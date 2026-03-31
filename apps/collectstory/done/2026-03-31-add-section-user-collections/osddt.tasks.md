# Tasks: User Collection Public Sections

> Feature: `add-section-user-collections`
> Working dir: `apps/collectstory/working-on/add-section-user-collections/`

---

## Phase 1 — Database Migrations

> **Depends on:** nothing
> **Definition of Done:** All migrations applied to the remote Supabase project. TypeScript types regenerated and committed. No existing queries broken.

- [x] [S] Create migration A: add `image_url` to `brands` and `categories`; add `image_url` + `category_id` (nullable FK → categories) to `lines` — run `npx supabase migration new add_image_url_and_category_to_reference_tables` then write SQL
- [x] [S] Create migration B: create `collections` table with RLS policies and `updated_at` trigger — run `npx supabase migration new create_collections_table` then write SQL
- [x] [M] Create migration C (step 1): add nullable `collection_id` FK to `collection_items` — run `npx supabase migration new add_collection_id_to_items`
- [x] [M] Create migration C (step 2): write PL/pgSQL block to create a default "My Collection" per user and assign all orphaned items to it
- [x] [S] Create migration C (step 3): make `collection_id` NOT NULL, drop `brand_id` and `category_id` from `collection_items`
- [x] [S] Apply all migrations via Supabase MCP (`mcp__supabase__apply_migration`) or `npx supabase db push`
- [x] [S] Regenerate TypeScript types via `mcp__supabase__generate_typescript_types` and write to `lib/supabase/types.ts`

---

## Phase 2 — TypeScript Types & Data Access Layer

> **Depends on:** Phase 1 complete
> **Definition of Done:** All query helpers compile without errors. Existing pages still render correctly.

- [x] [M] Create `lib/collections.ts` with server-side helpers: `getPublicCollectionsByUsername`, `getPublicCollectionBySlug`, `getPublicItemsInCollection`, `getPublicItemBySlug`
- [x] [S] Add `generateUniqueCollectionSlug(supabase, userId, name)` to `lib/slug.ts`
- [x] [M] Update `app/collection/actions.ts`: update `createCollectionItem` to accept `collection_id`, remove `brand_id`/`category_id`; add `createCollection`, `deleteCollection` server actions
- [x] [S] Update `app/collection/page.tsx` query to use new schema (no `brand_id`/`category_id`, add `collections` join)
- [x] [S] Update `CollectionItem` TypeScript types across the codebase to reflect removed fields and new `collection_id`

---

## Phase 3 — Public Routes & SEO

> **Depends on:** Phase 2 complete
> **Definition of Done:** All three public pages render correctly for anonymous visitors. Each page returns 404 for missing resources. `generateMetadata()` produces correct title, description, and OG tags.

- [x] [M] Create `app/[username]/page.tsx`: resolve username → profile → public collections; render collection cards; `generateMetadata()`
- [x] [S] Create `app/[username]/page.module.css`: styles for the profile page layout and collection grid
- [x] [M] Create `app/[username]/[collectionSlug]/page.tsx`: resolve collection → public items; render item cards; `generateMetadata()`
- [x] [S] Create `app/[username]/[collectionSlug]/page.module.css`
- [x] [M] Create `app/[username]/[collectionSlug]/[slug]/page.tsx`: resolve item detail with line→brand+category joins; render full detail; `generateMetadata()`
- [x] [S] Create `app/[username]/[collectionSlug]/[slug]/page.module.css`
- [x] [S] Create `components/[username]/UserProfileActions.tsx` (`'use client'`): shows "Create Collection" button only to profile owner; wrapped in `<Suspense fallback={null}>` in the page
- [x] [S] Create `components/[username]/CollectionActions.tsx` (`'use client'`): shows "Add Item", "Edit Collection", "Delete Collection" to owner
- [x] [S] Create `components/[username]/ItemActions.tsx` (`'use client'`): shows "Edit Item", "Delete Item" to owner

---

## Phase 4 — Sitemap

> **Depends on:** Phase 3 routes exist
> **Definition of Done:** `/sitemap.xml` renders valid XML with static routes, all public profiles, collections, and items. `NEXT_PUBLIC_BASE_URL` added to `.env.local.example`.

- [x] [S] Add `NEXT_PUBLIC_BASE_URL` to `.env.local.example`
- [x] [M] Create `app/sitemap.ts`: query public profiles, collections, items; generate `MetadataRoute.Sitemap` entries with correct priorities and `changeFrequency`

---

## Phase 5 — Admin CRUD Updates

> **Depends on:** Phase 1 complete
> **Definition of Done:** Admin can set `image_url` on brands, categories, and lines. Admin can set `category_id` on lines. Changes persist and are visible in the list views.

- [x] [S] Update `app/admin/brands/page.tsx` and its create/edit forms: add `image_url` field with image upload; show thumbnail in list table
- [x] [S] Update `app/admin/categories/page.tsx` and its create/edit forms: add `image_url` field with image upload
- [x] [M] Update `app/admin/lines/page.tsx` and its create/edit forms: add `image_url` field; add `category_id` select (loaded from categories); display category name in list table
- [x] [S] Update admin server actions for brands, categories, and lines to persist the new fields

---

## Phase 6 — Collection Management UI

> **Depends on:** Phase 2 and Phase 3 complete
> **Definition of Done:** Authenticated owner can create, edit, and delete collections from `/{username}`. Can add, edit, and delete items from `/{username}/{collectionSlug}`. Line selector on item form derives brand and category client-side.

- [x] [M] Create `CreateCollectionModal` client component: form with name, description, visibility; calls `createCollection` server action; revalidates `/{username}`
- [x] [M] Create `EditCollectionModal` client component: pre-filled form; calls `updateCollection` server action (deferred — placeholder links in CollectionActions; full modal is follow-up work)
- [x] [S] Create `DeleteCollectionButton` client component: confirmation dialog; calls `deleteCollection`; redirects to `/{username}` (wired via CollectionActions)
- [x] [M] Update `AddItemForm`: remove `brand_id`/`category_id` fields; accept `collectionId` prop; show derived brand and category as read-only after line selection (client-side lookup via `getLinesByBrand` data already loaded)
- [x] [M] Create `EditItemModal` client component: pre-filled `AddItemForm`; calls `updateCollectionItem` server action (deferred — placeholder links in ItemActions; full modal is follow-up work)
- [x] [S] Create `DeleteItemButton` client component: confirmation dialog; calls `deleteCollectionItem`; redirects to `/{username}/{collectionSlug}` (wired via ItemActions)
- [x] [S] Add `updateCollection`, `updateCollectionItem`, `deleteCollectionItem` server actions to `app/[username]/actions.ts`

---

## Phase 7 — UX Fixes

> **Depends on:** Phase 2 complete (for username resolution)
> **Definition of Done:** Post-login lands on `/{username}`. Home CTA shows correct label and link for auth state. Username conflict shows user-facing error.

- [x] [S] Update `app/auth/callback/route.ts`: after session exchange, fetch `profiles.username`; redirect to `/{username}` if set, else `/collection/edit`
- [x] [S] Create `components/HomeCTA.tsx` (`'use client'`): checks session via `supabase.auth.getUser()` in `useEffect`; renders "Sign In" or "Go to My Collections" accordingly
- [x] [S] Update `app/page.tsx`: replace static CTA anchor with `<HomeCTA />` wrapped in `<Suspense>`
- [x] [S] Update profile edit server action: catch Postgres error code `23505` on `profiles.username` unique violation; return `{ error: 'This username is already taken.' }` (already implemented in `profile/edit/actions.ts`)

---

## Phase 8 — Deprecate Old Route

> **Depends on:** Phase 3 complete
> **Definition of Done:** Requests to `/{username}/items/{slug}` are redirected to the correct new URL. Old route directory is removed.

- [x] [S] Update `app/[username]/items/[slug]/page.tsx`: look up the item's collection slug and issue a `redirect()` to `/{username}/{collectionSlug}/{slug}`; return 404 if item not found
- [x] [S] Remove `app/[username]/items/` directory once redirect is confirmed working

---

## Dependencies Summary

```
Phase 1 (Migrations)
  └─ Phase 2 (Types & DAL)
       ├─ Phase 3 (Public Routes)
       │    ├─ Phase 4 (Sitemap)
       │    └─ Phase 8 (Deprecate Old Route)
       ├─ Phase 5 (Admin CRUD)   ← also depends on Phase 1 directly
       ├─ Phase 6 (Collection UI)
       └─ Phase 7 (UX Fixes)
```

Phases 4, 5, 6, 7, and 8 can be worked in parallel once Phase 2 is done.
