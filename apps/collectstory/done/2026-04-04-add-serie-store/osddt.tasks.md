# Task List: Franchise Catalog

**Feature:** `add-serie-store`
**Date:** 2026-04-05

---

## Dependencies

```
Phase 1 → Phase 2 → Phase 3
Phase 1 → Phase 4
Phase 1 → Phase 5
Phase 1 → Phase 6
Phase 2 (partial) → Phase 3  (localized names UI needs franchise admin pages)
```

---

## Phase 1 — Database migration

**Definition of Done:** Migration applied to remote Supabase; `franchises` and `franchise_localized_names` tables exist with correct columns, indexes, and RLS; `collection_items` has nullable `franchise_id` column with `ON DELETE SET NULL`.

- [x] [S] Generate migration file via `npx supabase migration new add_franchise_catalog` from `apps/collectstory/`
- [x] [M] Write migration SQL: create `franchises` table (id, name, slug unique, description, image_url, created_at)
- [x] [M] Write migration SQL: create `franchise_localized_names` table (id, franchise_id FK cascade, locale, name, slug unique, created_at) with unique index on `(franchise_id, locale)`
- [x] [S] Write migration SQL: add nullable `franchise_id` column to `collection_items` with `ON DELETE SET NULL`
- [x] [M] Write RLS policies: enable RLS on `franchises`; public SELECT; admin-only INSERT / UPDATE / DELETE
- [x] [M] Write RLS policies: enable RLS on `franchise_localized_names`; public SELECT; admin-only INSERT / UPDATE / DELETE
- [x] [S] Apply migration via Supabase MCP or `npx supabase db push`

---

## Phase 2 — Admin CRUD for Franchises

**Definition of Done:** Admin can list, create, edit, and delete franchises at `/admin/franchises`; cover image upload works; slug auto-derives from name; duplicate name returns a user-facing error.

- [x] [S] Create `app/admin/franchises/actions.ts` with `createFranchise`, `updateFranchise`, `deleteFranchise` server actions (mirror brands pattern; validate name + image_url required)
- [x] [M] Create `components/admin/FranchiseForm.tsx` client component (fields: name, slug, description, image upload; reuse `form.module.css`)
- [x] [S] Create `app/admin/franchises/page.tsx` list page (table with thumbnail, name, slug, localised names count, Edit link, Delete button)
- [x] [S] Create `app/admin/franchises/new/page.tsx` create page (renders FranchiseForm with createFranchise action)
- [x] [S] Create `app/admin/franchises/[id]/edit/page.tsx` edit page (fetches franchise + localised names; renders FranchiseForm + localised names table)
- [x] [S] Add `/admin/franchises` link to admin navigation/dashboard

---

## Phase 3 — Admin CRUD for Localised Names

**Definition of Done:** Admin can add, edit, and delete localised names on a franchise from the edit page; duplicate locale per franchise returns a user-facing error; BCP 47 format is validated server-side.

- [x] [S] Create `app/admin/franchises/[id]/localized-names/actions.ts` with `createLocalizedName`, `updateLocalizedName`, `deleteLocalizedName` server actions (validate BCP 47 locale regex; derive slug from name; handle `23505`)
- [x] [S] Create `components/admin/LocalizedNameForm.tsx` client component (fields: locale BCP 47, name; reuse `form.module.css`)
- [x] [S] Create `app/admin/franchises/[id]/localized-names/new/page.tsx` (shows parent franchise name as context; renders LocalizedNameForm)
- [x] [S] Create `app/admin/franchises/[id]/localized-names/[nameId]/edit/page.tsx` (fetches record; renders LocalizedNameForm with defaults)

---

## Phase 4 — Franchise selector on item form

**Definition of Done:** Franchise dropdown appears in the add/edit item form; selecting a franchise saves `franchise_id`; clearing the selection saves `null`; existing items with no franchise are unaffected.

- [x] [S] Add `getAllFranchises()` server action to `app/collection/actions.ts` (fetch `franchises` ordered by name)
- [x] [M] Update `components/AddItemForm/AddItemForm.tsx` to accept `franchises` prop and render optional `franchise_id` select (first option "— None —")
- [x] [S] Update `app/collection/page.tsx` to fetch franchises and pass as prop to `AddItemForm`
- [x] [S] Update `createCollectionItem` server action to parse and persist optional `franchise_id`
- [x] [S] Update `updateCollectionItem` server action (if exists) to parse and persist optional `franchise_id`

---

## Phase 5 — Public franchise pages

**Definition of Done:** `/franchises` lists all franchises; `/franchises/[officialSlug]` shows franchise detail with localised names and public items grid; accessing a localised slug returns HTTP 301 to the canonical slug; `notFound()` for unknown slugs.

- [x] [M] Create `lib/franchises.ts` with `getAllPublicFranchises()`, `getFranchiseBySlug()`, and `getOfficialSlugByLocalizedSlug()` query helpers (use `createPublicClient()`; nested select pattern)
- [x] [M] Create `app/franchises/page.tsx` index page (SSG ISR 1h; card grid with cover image, official name, localised names preview)
- [x] [M] Create `app/franchises/[slug]/page.tsx` detail page (SSG ISR 1h; 301 redirect for localised slugs; `notFound()` for unknown; cover image, names, public items grid)
- [x] [S] Add `generateStaticParams` to `app/franchises/[slug]/page.tsx` for all official slugs
- [x] [S] Add `revalidatePath('/franchises')` and `revalidatePath('/franchises/' + slug)` calls in admin franchise server actions (Phase 2)

---

## Phase 6 — Item detail page: show linked franchise

**Definition of Done:** Item detail page shows franchise name as a linked badge when `franchise_id` is set; items with no franchise show nothing extra.

- [x] [S] Extend item detail query to join `franchises ( name, slug )` via the `franchise_id` FK
- [x] [S] Render franchise badge/chip on item detail page linking to `/franchises/[slug]` (show only when franchise is present)
