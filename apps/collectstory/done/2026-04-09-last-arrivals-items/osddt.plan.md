# Implementation Plan: Last Arrivals Items

## Architecture Overview

Two concerns are addressed in a single migration boundary:

1. **FK re-targeting** — Drop the `auth.users.id` FK constraints on `collection_items.user_id` and `collections.user_id` and add new constraints pointing to `profiles.id`. The UUID values are identical (`profiles.id = auth.users.id`), so this is a constraint-only change with zero data migration. All existing RLS policies (`auth.uid() = user_id`) continue to work unchanged since `auth.uid()` returns the same UUID that is stored in `user_id`.

2. **Last Arrivals feed** — A Postgres view (`public.last_arrivals`) joins `collection_items`, `profiles`, `lines`, and `brands` to expose the 10 most recent public items. Queried server-side from a Next.js Server Component. No Edge Function, no client-side fetch.

**Schema after migration:**
```
auth.users
  └─ profiles (id → auth.users.id)
       ├─ collections (user_id → profiles.id)
       │    └─ collection_items (user_id → profiles.id, collection_id → collections.id)
       └─ last_arrivals view (reads collection_items ⋈ profiles ⋈ lines ⋈ brands)
```

**FSD placement for new UI:**
- DB query helper → `lib/collections.ts` (existing shared query file)
- Last Arrivals widget → `src/widgets/last-arrivals/` (new FSD widget slice)
- Homepage page → `app/page.tsx` (import widget, keep SSG `force-static`)

**Migration strategy:** Applied via Supabase MCP (`mcp__supabase__apply_migration`). No local migration files created — the MCP writes directly to the remote schema and records the migration version.

---

## Implementation Phases

### Phase 1 — Database Migration (FK re-targeting + view)

**Goal:** Fix the FK constraints and create the `last_arrivals` view in a single atomic migration.

**Steps:**

1. **Apply migration via Supabase MCP** with the following SQL:

   ```sql
   -- Safety guard: abort if any item/collection has no matching profile
   -- (would cause the new FK constraint to reject the row)
   DO $$
   DECLARE
     orphaned_items integer;
     orphaned_collections integer;
   BEGIN
     SELECT COUNT(*) INTO orphaned_items
     FROM public.collection_items ci
     WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = ci.user_id);

     SELECT COUNT(*) INTO orphaned_collections
     FROM public.collections c
     WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = c.user_id);

     IF orphaned_items > 0 OR orphaned_collections > 0 THEN
       RAISE EXCEPTION
         'Migration aborted: % collection_item(s) and % collection(s) have no matching profile row. Fix orphaned rows before re-running.',
         orphaned_items, orphaned_collections;
     END IF;
   END $$;

   -- Step 1: Drop old FK constraints
   ALTER TABLE public.collection_items
     DROP CONSTRAINT collection_items_user_id_fkey;

   ALTER TABLE public.collections
     DROP CONSTRAINT collections_user_id_fkey;

   -- Step 2: Add new FK constraints pointing to profiles
   ALTER TABLE public.collection_items
     ADD CONSTRAINT collection_items_user_id_fkey
       FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

   ALTER TABLE public.collections
     ADD CONSTRAINT collections_user_id_fkey
       FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

   -- Step 3: Create last_arrivals view
   CREATE OR REPLACE VIEW public.last_arrivals AS
   SELECT
     ci.id,
     ci.name,
     ci.image_url,
     ci.slug,
     ci.created_at,
     ci.collection_id,
     p.username,
     p.avatar_url,
     l.name   AS line_name,
     l.slug   AS line_slug,
     b.name   AS brand_name,
     b.slug   AS brand_slug,
     col.slug AS collection_slug
   FROM public.collection_items ci
   JOIN public.profiles p   ON p.id = ci.user_id
   JOIN public.collections col ON col.id = ci.collection_id
   LEFT JOIN public.lines l ON l.id = ci.line_id
   LEFT JOIN public.brands b ON b.id = l.brand_id
   WHERE ci.visibility = 'public'
   ORDER BY ci.created_at DESC
   LIMIT 10;

   -- Step 4: Grant public SELECT on the view (anon role)
   GRANT SELECT ON public.last_arrivals TO anon;
   ```

2. **Verify** via Supabase MCP:
   - Query `last_arrivals` view returns rows.
   - Confirm FK constraints on both tables now reference `public.profiles`.
   - Confirm existing `collection_items` and `collections` rows are untouched.

3. **Generate updated TypeScript types** via `mcp__supabase__generate_typescript_types` and replace `lib/supabase/types.ts`.

---

### Phase 2 — Data Fetching Layer

**Goal:** Add a typed query function for the last arrivals feed.

**File:** `apps/collectstory/lib/collections.ts` (extend existing file)

**Steps:**

1. Add a `LastArrivalItem` TypeScript type derived from the view columns.
2. Add `getLastArrivals()` async function:
   - Uses `createServerClient` (server-side only).
   - Queries `from('last_arrivals').select('*')` — limit is baked into the view.
   - Returns `LastArrivalItem[]`.
3. No authentication required (view is publicly readable via `anon` grant).

---

### Phase 3 — UI Widget (FSD)

**Goal:** Build the Last Arrivals section as a widget following FSD conventions.

**New slice:** `src/widgets/last-arrivals/`

```
src/widgets/last-arrivals/
├── ui/
│   ├── LastArrivalsSection.tsx        # Server Component — fetches + renders
│   ├── LastArrivalsSection.module.css
│   └── LastArrivalCard.tsx            # Item card sub-component (RSC, no state)
│   └── LastArrivalCard.module.css
└── index.ts                           # Public API: export { LastArrivalsSection }
```

**`LastArrivalsSection`** (React Server Component):
- Calls `getLastArrivals()` directly (no `useEffect`, no client fetch).
- Renders a section heading + grid of `LastArrivalCard` items.
- If feed is empty, renders a graceful empty state.

**`LastArrivalCard`**:
- Uses `next/image` for `image_url` (Cloudinary domain already in `next.config.ts`).
- Links to `/{username}/{collection_slug}/items/{itemId}/{slug}` (matches existing item detail route pattern).
- Displays: item image, item name, brand/line label, collector username + avatar, relative or formatted `created_at`.
- Uses design tokens only — no hardcoded values.
- Uses `sizes` attribute on `<Image>` for responsive loading.

**CSS approach:**
- CSS Modules with BEM naming.
- CSS Grid for the card grid (responsive: 1 → 2 → 3 columns via `min-width` breakpoints).
- All values from `@dezkareid/design-tokens` CSS custom properties.

**Skills to invoke before implementation:**
- `frontend-design` — for distinctive UI
- `react-best-practices` — RSC boundary, no unnecessary client components
- `next-best-practices` — image optimization, `sizes`, `priority`
- `design-tokens` — token reference
- `accessibility` — WCAG 2.2 AA compliance

---

### Phase 4 — Homepage Integration

**Goal:** Add the Last Arrivals widget to the homepage.

**File:** `app/page.tsx`

**Steps:**

1. Import `LastArrivalsSection` from `@/src/widgets/last-arrivals`.
2. Place it below existing homepage content (after Hero / Stats / Features sections).
3. Keep `export const dynamic = 'force-static'` — the widget is a Server Component and the data can be served statically or with ISR.
   - **Decision point**: If the feed should update without a full redeploy, change `force-static` to `export const revalidate = 3600` (1 hour ISR). This is the recommended approach for a live feed.
4. Update `app/page.module.css` if layout adjustments are needed.

---

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| Supabase MCP (`mcp__supabase__apply_migration`) | Available | Used for schema migration |
| Supabase MCP (`mcp__supabase__generate_typescript_types`) | Available | Regenerate `lib/supabase/types.ts` after migration |
| `@dezkareid/design-tokens` | Installed | CSS custom properties via `globals.css` |
| `@dezkareid/components/react` | Installed | Check for reusable primitives before writing new ones |
| `next/image` | Built-in | Cloudinary `remotePatterns` already configured |
| `createServerClient` | `lib/supabase/server.ts` | For server-side query in `getLastArrivals()` |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| FK drop fails due to other constraints depending on `collection_items.user_id` | Low | Schema inspection confirmed no other table references `collection_items.user_id` as a FK source |
| RLS policies break after FK re-targeting | Low | Policies use `auth.uid() = user_id`; `auth.uid()` returns the same UUID — no policy changes needed |
| `last_arrivals` view returns no rows | Low | 1 existing public item confirmed in DB; view WHERE clause matches |
| Homepage `force-static` caches stale feed | Medium | Change to `revalidate = 3600` for ISR so the feed refreshes hourly without a redeploy |
| Image URLs are `null` for some items | Possible | `LastArrivalCard` must handle `image_url = null` gracefully (placeholder or hide image) |
| Cloudinary domain not in `remotePatterns` for new item images | Low | Already configured in `next.config.ts` |

---

## Out of Scope

- Per-user "my recent arrivals" authenticated feed
- Pagination beyond the 10-item default
- Real-time updates / Supabase Realtime subscriptions
- Admin moderation of the feed
- Changes to `stores`, `brands`, `lines`, `categories`, or `franchises` tables
- A standalone `/last-arrivals` route
- Local Supabase migration files (migration applied directly via MCP)
