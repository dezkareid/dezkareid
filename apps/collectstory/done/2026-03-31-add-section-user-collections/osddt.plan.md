# Implementation Plan: User Collection Public Sections

## Architecture Overview

### Routing Structure

The feature introduces a three-level public route hierarchy under a dynamic `[username]` segment. The existing `/[username]/items/[slug]` route will be replaced by the new structure:

```
/[username]/                          → Public profile (user's collections list)
/[username]/[collectionSlug]/         → Public collection (items in a collection)
/[username]/[collectionSlug]/[slug]/  → Public item detail
```

All three routes are **Server Components with ISR** (short revalidation period for SEO freshness). They include `generateMetadata()` for SEO and `generateStaticParams()` for pre-rendering known public profiles.

### CLS-Safe Authenticated Actions

Pages under `/[username]` must render the same layout shell for both authenticated and unauthenticated visitors to avoid CLS. The pattern:

- The **layout** is static and never changes based on auth state.
- Authenticated-only UI (e.g., "Create Collection", "Add Item", "Edit" buttons) is rendered in a **separate `<Suspense>` boundary** as a Client Component that checks session client-side after hydration — this way the layout never shifts between server render and hydration.
- Server Components that need auth (for actions) use `getSessionAndRole()` inside async sub-components wrapped in `<Suspense fallback={null}>`.

### Data Model Changes

```
categories          lines               brands
──────────          ──────              ───────
+ image_url         + category_id       + image_url
                    + image_url
                    - (removes nothing)

collections (NEW)
──────────────────
id, user_id, name, slug, visibility, description, created_at, updated_at
unique(user_id, slug)

collection_items
──────────────────
+ collection_id → collections
- brand_id (removed — derived through line → brand)
- category_id (removed — derived through line → category)
```

### Sitemap

`app/sitemap.ts` (Next.js built-in) generates a dynamic sitemap including:
- Static routes: `/`, `/login`, `/stores`
- All public user profile pages: `/{username}`
- All public collections: `/{username}/{collection-slug}`
- All public items: `/{username}/{collection-slug}/{item-slug}`

---

## Implementation Phases

### Phase 1 — Database Migrations

**Goal:** Apply all schema changes to Supabase without breaking existing functionality.

#### Migration A: `add_image_url_and_category_to_reference_tables`

```sql
-- brands: add image_url
ALTER TABLE public.brands ADD COLUMN image_url text;

-- categories: add image_url
ALTER TABLE public.categories ADD COLUMN image_url text;

-- lines: add image_url + category_id (one-to-one, nullable initially for migration safety)
ALTER TABLE public.lines
  ADD COLUMN image_url text,
  ADD COLUMN category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;
```

#### Migration B: `create_collections_table`

```sql
CREATE TABLE public.collections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  slug        text NOT NULL,
  description text,
  visibility  text NOT NULL DEFAULT 'public'
              CHECK (visibility IN ('public', 'private')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, slug)
);

-- updated_at trigger (reuse existing set_updated_at function)
CREATE TRIGGER set_collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Public can read public collections
CREATE POLICY collections_public_read ON public.collections
  FOR SELECT USING (visibility = 'public');

-- Owner can read all their own collections
CREATE POLICY collections_owner_read ON public.collections
  FOR SELECT USING (auth.uid() = user_id);

-- Owner can insert/update/delete own collections
CREATE POLICY collections_owner_insert ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY collections_owner_update ON public.collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY collections_owner_delete ON public.collections
  FOR DELETE USING (auth.uid() = user_id);
```

#### Migration C: `add_collection_id_to_items_and_remove_denormalized_fks`

This migration is split into safe steps:

**Step 1 — Add collection_id (nullable for now):**
```sql
ALTER TABLE public.collection_items
  ADD COLUMN collection_id uuid REFERENCES public.collections(id) ON DELETE SET NULL;
```

**Step 2 — Create default collections for users who have items but none yet, and assign orphaned items:**
```sql
-- For each user that has collection_items without a collection_id,
-- create a "My Collection" default collection and assign all their items to it.
DO $$
DECLARE
  r RECORD;
  new_col_id uuid;
BEGIN
  FOR r IN
    SELECT DISTINCT user_id FROM public.collection_items WHERE collection_id IS NULL
  LOOP
    -- Create default collection
    INSERT INTO public.collections (user_id, name, slug, visibility)
    VALUES (r.user_id, 'My Collection', 'my-collection', 'public')
    ON CONFLICT (user_id, slug) DO NOTHING
    RETURNING id INTO new_col_id;

    -- Fallback: if ON CONFLICT happened, look it up
    IF new_col_id IS NULL THEN
      SELECT id INTO new_col_id FROM public.collections
      WHERE user_id = r.user_id AND slug = 'my-collection';
    END IF;

    -- Assign orphaned items
    UPDATE public.collection_items
    SET collection_id = new_col_id
    WHERE user_id = r.user_id AND collection_id IS NULL;
  END LOOP;
END $$;
```

**Step 3 — Make collection_id NOT NULL and remove old FKs:**
```sql
ALTER TABLE public.collection_items
  ALTER COLUMN collection_id SET NOT NULL,
  DROP COLUMN brand_id,
  DROP COLUMN category_id;
```

> **Note on execution order:** Migrations A and B must be applied before C. Use `npx supabase migration new` for each to get proper CLI-generated timestamps.

---

### Phase 2 — TypeScript Types & Data Access Layer

**Goal:** Update all TypeScript types and query helpers to reflect the new schema.

#### 2.1 — Regenerate Supabase types

After applying migrations, regenerate via Supabase MCP or CLI:
```bash
npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
```

#### 2.2 — Update query helpers

- `lib/collections.ts` (new): server-side helpers for collections CRUD
  - `getPublicCollectionsByUsername(username)` → resolves username → user_id → collections
  - `getPublicCollectionBySlug(username, collectionSlug)` → single collection
  - `getPublicItemsInCollection(collectionId)` → public items with line→brand/category joins
  - `getPublicItemBySlug(collectionId, itemSlug)` → single item

- `lib/slug.ts`: add `generateUniqueCollectionSlug(supabase, userId, name)` (same pattern as items)

- `app/collection/actions.ts`: update `createCollectionItem` to:
  - Accept `collection_id` in formData
  - Remove `brand_id` and `category_id` from insert
  - Add `createCollection(formData)` and `deleteCollection(id)` server actions

---

### Phase 3 — Public Routes & SEO

**Goal:** Build the three new public pages with full SEO metadata.

#### 3.1 — Route: `app/[username]/page.tsx` (User Profile)

- Resolves username → profile (404 if not found)
- Fetches public collections for that user
- Renders collection cards linking to `/{username}/{collection.slug}`
- `generateMetadata()`:
  ```typescript
  title: `${username}'s Collections — Collectstory`,
  description: `Browse ${username}'s collectible collections on Collectstory.`,
  openGraph: { title, description, url, images: [avatar_url] }
  ```
- **Auth action panel**: `<Suspense fallback={null}><UserProfileActions username={username} /></Suspense>` — a client component that shows "Create Collection" button only when the viewer is the profile owner.

#### 3.2 — Route: `app/[username]/[collectionSlug]/page.tsx` (Collection)

- Fetches collection by username + slug (404 if not found or private)
- Fetches public items in collection
- Renders item cards linking to `/{username}/{collectionSlug}/{item.slug}`
- `generateMetadata()`:
  ```typescript
  title: `${collection.name} by ${username} — Collectstory`,
  description: `${collection.name}: ${itemCount} items collected by ${username}.`,
  openGraph: { title, description, url, images: [first_item_image] }
  ```
- **Auth action panel**: `<Suspense fallback={null}><CollectionActions username={username} collection={collection} /></Suspense>` — shows "Add Item", "Edit Collection", "Delete Collection" when owner.

#### 3.3 — Route: `app/[username]/[collectionSlug]/[slug]/page.tsx` (Item Detail)

- Replaces the existing `app/[username]/items/[slug]/page.tsx` route
- Fetches item with line → brand + category joins
- `generateMetadata()`:
  ```typescript
  title: `${item.name} — ${collection.name} by ${username} — Collectstory`,
  description: `${item.name} from ${line.name} by ${brand.name}. Part of ${username}'s ${collection.name} collection.`,
  openGraph: { title, description, url, images: [item.image_url] }
  ```
- **Auth action panel**: `<Suspense fallback={null}><ItemActions username={username} item={item} /></Suspense>` — shows "Edit", "Delete" when owner.

#### 3.4 — Authenticated Action Client Components (CLS-safe)

Located in `components/[username]/`:

- `UserProfileActions.tsx` (`'use client'`): checks session with `supabase.auth.getUser()`, compares username; renders "Create Collection" modal trigger.
- `CollectionActions.tsx` (`'use client'`): renders "Add Item", "Edit Collection", "Delete Collection" for owners.
- `ItemActions.tsx` (`'use client'`): renders "Edit Item", "Delete Item" for owners.

Each uses `useState` initialized to `null` (no visible UI) and sets state after `useEffect` resolves the session — ensuring the server-rendered layout is never affected.

---

### Phase 4 — Sitemap

**Goal:** Generate a full dynamic sitemap at `/sitemap.xml`.

#### `app/sitemap.ts`

```typescript
import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://collectstory.com';

  // Fetch all public profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, updated_at')
    .not('username', 'is', null);

  // Fetch all public collections
  const { data: collections } = await supabase
    .from('collections')
    .select('slug, user_id, updated_at, profiles!inner(username)')
    .eq('visibility', 'public');

  // Fetch all public items
  const { data: items } = await supabase
    .from('collection_items')
    .select('slug, collection_id, updated_at, collections!inner(slug, profiles!inner(username))')
    .eq('visibility', 'public');

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/stores`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
  ];

  const profileRoutes = (profiles ?? []).map((p) => ({
    url: `${baseUrl}/${p.username}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const collectionRoutes = (collections ?? []).map((c) => ({
    url: `${baseUrl}/${(c.profiles as { username: string }).username}/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const itemRoutes = (items ?? []).map((i) => {
    const col = i.collections as { slug: string; profiles: { username: string } };
    return {
      url: `${baseUrl}/${col.profiles.username}/${col.slug}/${i.slug}`,
      lastModified: new Date(i.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...profileRoutes, ...collectionRoutes, ...itemRoutes];
}
```

Add `NEXT_PUBLIC_BASE_URL` to `.env.local.example`.

---

### Phase 5 — Admin CRUD Updates

**Goal:** Update admin pages for brands, lines, and categories to support the new fields.

#### 5.1 — Brands admin (`/admin/brands`)
- Add `image_url` field to create/edit forms with image upload (reuse upload API)
- Display thumbnail in the list table

#### 5.2 — Categories admin (`/admin/categories`)
- Add `image_url` field to create/edit forms

#### 5.3 — Lines admin (`/admin/lines`)
- Add `image_url` field
- Add `category_id` select (loads all categories) to create/edit forms
- Display category name in the list table

---

### Phase 6 — Collection Management UI (Authenticated)

**Goal:** Give authenticated users the ability to manage their collections from the `/[username]` pages.

#### 6.1 — Create Collection flow
- `CreateCollectionModal` client component (modal, same pattern as `AddItemModal`)
- Form fields: name, description, visibility (public/private)
- Server action `createCollection(formData)` in `app/[username]/actions.ts`:
  - Inserts into `collections`
  - Generates unique slug
  - Revalidates `/{username}`
  - Redirects to `/{username}/{slug}`

#### 6.2 — Edit / Delete Collection
- `EditCollectionModal` — pre-filled form, calls `updateCollection(id, formData)`
- `DeleteCollectionButton` — confirmation dialog, calls `deleteCollection(id)`, redirects to `/{username}`
- Both live in `CollectionActions.tsx` client component

#### 6.3 — Add Item to Collection
- Update `AddItemForm` to:
  - Accept `collectionId` as a prop (passed from the page context)
  - Remove `brand_id` and `category_id` fields
  - Keep `line_id` (line now carries brand + category)
  - Show brand and category as read-only derived fields when a line is selected (client-side lookup)
- Update `createCollectionItem` server action to use `collection_id` instead of `brand_id`/`category_id`

#### 6.4 — Edit / Delete Item
- `EditItemModal` — same as AddItemForm but pre-filled, calls `updateCollectionItem(id, formData)`
- `DeleteItemButton` — confirmation, calls `deleteCollectionItem(id)`, redirects to `/{username}/{collectionSlug}`

---

### Phase 7 — UX Fixes

**Goal:** Fix post-login redirect and home page CTA.

#### 7.1 — Post-login redirect (`app/auth/callback/route.ts`)

```typescript
// After exchangeCodeForSession succeeds:
const { data: profile } = await supabase
  .from('profiles')
  .select('username')
  .eq('id', user.id)
  .single();

const redirectTo = profile?.username
  ? `/${profile.username}`
  : '/collection/edit'; // profile setup if no username yet
```

#### 7.2 — Home page CTA (`app/page.tsx`)

The homepage is currently `force-static`. To support auth-aware CTA without breaking SSG:

- Keep the page `force-static`
- Extract the CTA into a `HomeCTA` client component (`'use client'`)
- `HomeCTA` checks session via `supabase.auth.getUser()` in `useEffect`, then renders either:
  - Unauthenticated: "Sign In to Your Collection" → `/login`
  - Authenticated: "Go to My Collections" → `/{username}`
- Initial render (SSR/SSG): always renders the unauthenticated state — no CLS because the button is the same size; only the label and href change after hydration

#### 7.3 — Username uniqueness error in profile edit

- In `app/collection/edit/actions.ts` (or wherever profile update lives), catch the Postgres unique constraint violation (`23505` error code) on `profiles.username` and return a user-facing error: `"This username is already taken. Please choose another."`

---

### Phase 8 — Deprecate Old Route

**Goal:** Remove `app/[username]/items/[slug]/` once the new structure is live.

- Add a `redirect()` in the old route file pointing to `/{username}/{collectionSlug}/{slug}` if the item can be found, or 404 if not
- After confirming zero traffic, delete the old route directory

---

## Technical Dependencies

| Dependency | Status | Purpose |
|---|---|---|
| `@supabase/ssr` | Existing | Auth + DB client |
| `next` (App Router) | Existing | Routing, metadata, sitemap |
| Supabase MCP | Available | Run migrations, inspect schema |
| `lib/slug.ts` | Existing | Slug generation for collections |
| `@dezkareid/components/react` | Existing | UI primitives (Button, Card) |
| `@dezkareid/design-tokens` | Existing | CSS custom properties |
| `NEXT_PUBLIC_BASE_URL` | New env var | Sitemap absolute URL generation |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Migration C drops `brand_id`/`category_id` — breaks existing queries | Apply in multiple steps: add nullable column → backfill → make NOT NULL → drop old columns. Test each step on a branch database before merging. |
| `/{username}` conflicts with other top-level routes (`/login`, `/stores`, `/admin`, `/collection`) | Next.js static routes take priority over dynamic `[username]`. No conflict. Document reserved usernames and add a check constraint or validation that rejects them at sign-up. |
| Home page SSG + auth-aware CTA | Use client-side session check post-hydration. Server render shows unauthenticated state. No layout shift (same element, same size). |
| `generateStaticParams` for `[username]` may be expensive at scale | Limit to top N profiles by `updated_at` for ISR pre-render; remaining pages render on-demand and are cached after first visit. |
| Existing `/{username}/items/{slug}` URLs already shared/indexed | Keep old route as redirect (Phase 8) until traffic drops to zero. |

---

## Out of Scope

- Pagination or infinite scroll on collection/item listings
- Collection reordering or manual item sorting
- Admin management of user collections
- Search or filtering on public collection pages
- Social features (follow, like, comment)
- Sitemaps index file (single sitemap.xml is sufficient for initial scale)
- Email notifications on collection activity
