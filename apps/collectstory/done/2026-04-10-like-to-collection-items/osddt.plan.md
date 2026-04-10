# Implementation Plan: Like Collection Items

## Architecture Overview

The like feature follows the existing FSD + Next.js App Router patterns:

- **Database layer**: New `item_likes` table (who liked what) + `likes_count` denormalized column on `collection_items`, kept in sync by a Postgres trigger. RLS restricts write to the owning user and prevents self-likes at the DB level. Public read is scoped to counts only — liker identity is never exposed.
- **Query layer**: New helper functions in `lib/collections.ts` to fetch like counts and the current user's liked state in a single query (batch for list pages, single for detail page).
- **Mutation layer**: Two Server Actions (`likeItem`, `unlikeItem`) co-located in the item detail route's `actions.ts`. Both call `getSessionAndRole()` first and revalidate the item's cache tag after.
- **UI layer**: A `LikeButton` feature slice in `src/features/like-item/`. Client Component with `useTransition` for non-blocking toggling, heart SVG icon, CSS keyframe animation on like, and a count display. Unauthenticated users are redirected to `/login?origin=<current-path>` on click — the same pattern used by `IHaveThisButton`.
- **Integration points**:
  - Item detail page (`app/[username]/[collectionSlug]/[slug]/page.tsx`) — `LikeButton` placed in `ItemMeta` alongside `SocialShare` and `IHaveThisButton`.
  - Collection list page (`app/[username]/[collectionSlug]/page.tsx`) — like count badge rendered on each item card (read-only, no like action from the list).

### Key Constraints

- `likes_count` is read at ISR render time from `collection_items` — no extra query needed on the list page once the column exists.
- The `LikeButton` must be wrapped in `<Suspense>` on the detail page so the auth check (whether the user has liked this item) streams in without blocking the static cache shell.
- `PublicItem` and `PublicItemDetail` types in `lib/collections.ts` will gain a `likes_count: number` field.
- Analytics: a `like_item` event tracked via `useAnalytics`.

---

## Implementation Phases

### Phase 1 — Database Migration

**Goal**: Establish the persistence layer.

1. Create migration `20260410_add_item_likes.sql` via `npx supabase migration new add_item_likes`.
2. Add `likes_count INTEGER NOT NULL DEFAULT 0` column to `collection_items`.
3. Create `item_likes` table:
   ```sql
   CREATE TABLE item_likes (
     user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
     item_id UUID NOT NULL REFERENCES collection_items(id) ON DELETE CASCADE,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     PRIMARY KEY (user_id, item_id)
   );
   ```
4. Add check constraint to prevent self-likes:
   ```sql
   ALTER TABLE item_likes ADD CONSTRAINT no_self_like
     CHECK (user_id != (SELECT user_id FROM collection_items WHERE id = item_id));
   ```
   > Note: The check must reference `collection_items.user_id` — implement via trigger instead of a CHECK constraint (Postgres CHECK constraints cannot reference other tables). Use a `BEFORE INSERT` trigger on `item_likes` that raises an exception if `NEW.user_id = collection_items.user_id`.
5. Enable RLS on `item_likes`:
   - **INSERT**: authenticated user can insert only their own row (`user_id = auth.uid()`), item must be `visibility = 'public'`.
   - **DELETE**: authenticated user can delete only their own row.
   - **SELECT**: no public select of full rows — liker identity is private. Only the count via `likes_count` on `collection_items` is public.
6. Create `AFTER INSERT OR DELETE` trigger on `item_likes` to maintain `likes_count` on `collection_items`:
   ```sql
   CREATE OR REPLACE FUNCTION sync_likes_count()
   RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
   BEGIN
     UPDATE collection_items
       SET likes_count = (SELECT COUNT(*) FROM item_likes WHERE item_id = COALESCE(NEW.item_id, OLD.item_id))
     WHERE id = COALESCE(NEW.item_id, OLD.item_id);
     RETURN NULL;
   END;
   $$;

   CREATE TRIGGER trg_sync_likes_count
   AFTER INSERT OR DELETE ON item_likes
   FOR EACH ROW EXECUTE FUNCTION sync_likes_count();
   ```
7. Apply migration and regenerate TypeScript types via Supabase MCP.

---

### Phase 2 — Query Layer

**Goal**: Expose like data to Server Components with minimal query overhead.

**File**: `lib/collections.ts`

1. Add `likes_count: number` to `PublicItem` and `PublicItemDetail` types.
2. Update `getPublicItemsInCollection` query to include `likes_count` in the select (it's a column on `collection_items` — zero overhead).
3. Update `getPublicItemBySlug` query to include `likes_count`.
4. Add new query `getItemLikedByUser(itemId: string, userId: string): Promise<boolean>`:
   - Uses `createServerClient` (not public client) to select from `item_likes` with the user's session.
   - Returns `true` if a row exists, `false` otherwise.
   - Decorated with `'use cache'` + `cacheTag(\`item-like:${userId}:${itemId}\`)` + short `cacheLife` (e.g. `'seconds'`) so it is invalidated immediately after a mutation.

---

### Phase 3 — Server Actions

**Goal**: Secure, authenticated mutation endpoints for like/unlike.

**File**: `app/[username]/[collectionSlug]/actions.ts` (extend existing file)

1. Add `likeItem(itemId: string)` Server Action:
   - Calls `getSessionAndRole()` — throws if unauthenticated.
   - Inserts into `item_likes` with `upsert` / `ON CONFLICT DO NOTHING` to be idempotent.
   - Calls `revalidateTag(\`item-like:${session.user.id}:${itemId}\`)` and `revalidateTag(\`item:...\`)` for the item's cache.
   - Returns `{ success: true }` or surfaces the DB error.

2. Add `unlikeItem(itemId: string)` Server Action:
   - Calls `getSessionAndRole()` — throws if unauthenticated.
   - Deletes the matching row from `item_likes`.
   - Same revalidation as `likeItem`.

---

### Phase 4 — LikeButton Feature Slice

**Goal**: Reusable, animated like button following FSD conventions.

**Location**: `src/features/like-item/`

```
src/features/like-item/
├── ui/
│   ├── LikeButton.tsx          # Client Component
│   └── LikeButton.module.css   # Heart animation + styles
└── index.ts                    # Public API
```

#### `LikeButton.tsx`

- `'use client'`
- Props: `itemId: string`, `initialCount: number`, `initialLiked: boolean`, `isOwner: boolean`, `isAuthenticated: boolean`
- State: `count` (number), `liked` (boolean), managed with `useState` seeded from props.
- Toggle handler uses `useTransition` — calls `likeItem` or `unlikeItem` Server Action; updates local state on success. `isPending` used to disable the button during the transition.
- Unauthenticated click: `router.push(\`/login?origin=${encodeURIComponent(pathname)}\`)`.
- Owner: renders `null` (no button shown).
- Non-public item: renders `null`.
- Tracks `like_item` / `unlike_item` analytics events via `useAnalytics`.
- Accessible: `aria-label` reflects current state ("Like item" / "Unlike item"), `aria-pressed` for toggle state.

#### Heart animation

CSS keyframe animation triggered by adding a class on like. The heart scales up (`scale(1.3)`) then returns to normal with a subtle overshoot, using `animation-fill-mode: forwards`. The filled heart uses `--color-primary` (design token); the outline heart uses `--color-text-secondary`.

```css
@keyframes like-pop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.35); }
  70%  { transform: scale(0.92); }
  100% { transform: scale(1); }
}
```

No external animation libraries — pure CSS keyframes.

#### Heart SVG

Inline SVG paths for outline (unliked) and filled (liked) states. Toggle between the two via conditional rendering based on `liked` state. No icon library dependency.

---

### Phase 5 — Integration: Item Detail Page

**Goal**: Render `LikeButton` on the item detail page with streaming auth.

**File**: `app/[username]/[collectionSlug]/[slug]/page.tsx`

1. Create a new async Server Component `LikeSection` (or inline in `ItemDetail`):
   - Checks auth: `supabase.auth.getUser()`.
   - If user exists: calls `getItemLikedByUser(item.id, user.id)` to get initial liked state.
   - Renders `<LikeButton>` with `initialCount={item.likes_count}`, `initialLiked`, `isOwner={user?.id === item.user_id}`, `isAuthenticated={!!user}`.
2. Wrap `LikeSection` in `<Suspense fallback={<LikeButtonSkeleton />}>` within `ItemMeta` so the auth check streams without blocking the ISR shell. `LikeButtonSkeleton` is a static placeholder showing a heart icon + the count from the cached item.
3. Place `LikeButton` in `item-page__actions` div alongside `SocialShare` and `IHaveThisButton`.

---

### Phase 6 — Integration: Collection List Page

**Goal**: Display like count badge on item cards (read-only).

**File**: `app/[username]/[collectionSlug]/page.tsx`

1. `likes_count` is now part of `PublicItem` (Phase 2) — no additional query.
2. Add a like count indicator to each item card in the `items.map(...)` render — a small heart icon + count, visible only when `likes_count > 0`.
3. This is a **static display** — no `LikeButton` on the list page. Clicking an item navigates to the detail page where the full like interaction lives.
4. Style via `page.module.css` using BEM: `.item-card__like-count`.

---

### Phase 7 — Analytics Event Registration

**Goal**: Register new analytics events so TypeScript enforces correct event shapes.

**File**: `src/shared/lib/analytics/events.ts`

1. Add `'like_item'` and `'unlike_item'` to the `AnalyticsEvent` action union type.

---

### Phase 8 — TypeScript Types

**Goal**: Keep generated + hand-written types in sync.

1. Regenerate `lib/supabase/types.ts` via Supabase MCP after migration is applied.
2. Verify `PublicItem.likes_count` and `PublicItemDetail.likes_count` are aligned with the generated DB types.

---

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| Supabase Postgres | Existing | New table + trigger added via migration |
| `@supabase/ssr` | Existing | Server Actions use `createServerClient` |
| Next.js `useTransition` | Existing (React 19) | Non-blocking Server Action calls |
| `useAnalytics` hook | Existing | `src/shared/lib/analytics/useAnalytics` |
| CSS custom properties / design tokens | Existing | `--color-primary`, `--color-text-secondary` |
| `@dezkareid/components/react` Button | Existing | Optional — LikeButton is a custom control, Button component may not fit semantically |

No new external libraries are required.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Postgres `CHECK` constraint cannot reference other tables (no self-like rule) | Use a `BEFORE INSERT` trigger instead of a CHECK constraint |
| ISR cache serving stale `likes_count` after a like | `revalidateTag` in Server Action invalidates the item's ISR segment immediately; `likes_count` reflects the DB value on next render |
| Race condition: two users like simultaneously → trigger runs concurrently | Postgres row-level lock during UPDATE in the trigger handles this correctly |
| `LikeSection` Suspense boundary blocks ISR static shell | Wrap only `LikeSection` (auth-dependent) in Suspense; `likes_count` from the cached item is passed as `initialCount` to the skeleton, avoiding a blank count flash |
| Button accessible only by mouse | `aria-label`, `aria-pressed`, and keyboard `Enter`/`Space` handled natively by `<button>` element |
| Heart animation runs on every render (not just on transition) | Apply the animation class only when transitioning from unliked → liked, via a `useEffect` that watches the `liked` state change |

---

## Out of Scope

- Liking collections or user profiles
- Notifications to item owners
- A "liked items" profile section or feed
- Sorting / filtering items by like count
- Anonymous likes
- Exposing liker identity publicly
- Optimistic UI (count update is handled via `useTransition` + local state — no rollback on failure in this version)
