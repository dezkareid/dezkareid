# Tasks: Copy Collection Item to Catalog

Feature folder: `apps/collectstory/working-on/copy-item-to-catalog/`

---

## Phase 1 — Database migration: `images` column on `catalog_items`

- [x] [S] Apply Supabase migration via MCP: add `images jsonb NOT NULL DEFAULT '[]'::jsonb` column to `catalog_items`
- [x] [S] Add check constraint `catalog_items_images_max_5` enforcing `jsonb_array_length(images) <= 5`
- [x] [S] Create matching local migration file under `apps/collectstory/supabase/migrations/` with the remote-generated timestamp
- [x] [S] Run `mcp__supabase__generate_typescript_types` and update `lib/supabase/types.ts` with the new column
- [x] [S] Define `CatalogImage = { src: string; alt: string; order: number }` type and cast `images` column at query boundaries

**Definition of Done:** Migration applied remotely and locally, TypeScript types reflect `images: Json` column, `CatalogImage` type defined and exported.

---

## Phase 2 — `ImageListField` component

> Depends on: Phase 1 (needs `CatalogImage` type)

- [x] [M] Create `components/admin/ImageListField.tsx` — client component rendering an ordered list of images with drag-handle, remove button, and hidden serialized `<input name="images" />`
- [x] [S] Implement HTML5 drag-and-drop reorder within `ImageListField` (mousedown/dragstart/dragover/drop)
- [x] [S] Add keyboard alternative (arrow-up / arrow-down buttons) for accessible reordering
- [x] [S] Add "Add image" button that delegates file picking and validation to existing `ImageField` logic (HEIC conversion, 5 MB limit, type check)
- [x] [S] Enforce max-5 limit: disable "Add image" and show inline error when limit is reached
- [x] [S] Add `ImageListField.module.css` with BEM-named styles using design tokens only

**Definition of Done:** `ImageListField` renders, allows add/remove/reorder up to 5 images, serializes to hidden input, keyboard-accessible, no hardcoded styles.

---

## Phase 3 — Update `CatalogItemForm` and server actions

> Depends on: Phase 2

- [x] [S] Add `defaultImages?: CatalogImage[]` to `CatalogItemFormProperties` interface
- [x] [S] Mount `ImageListField` in `CatalogItemForm` below the existing `ImageField`; wire `onImagesChange` state
- [x] [S] On `handleSubmit`, read hidden `images` input and ensure it is included in the submitted `FormData`
- [x] [M] Update `createCatalogItem` action: parse and validate `images` from `FormData`, insert with `images` column; if `source_item_id` present, update `collection_items.catalog_item_id` after successful insert using `createAdminClient()`
- [x] [S] Update `updateCatalogItem` action: parse and persist `images` on update
- [x] [M] Update `NewCatalogItemPage`: read `source_item_id` search param; if present, fetch the collection item server-side with `createAdminClient()`, pass resolved fields as `defaultValues`, render hidden `source_item_id` input, and show inline warning if item already has a `catalog_item_id`
- [x] [S] Update `EditCatalogItemPage`: fetch `images` column and pass as `defaultImages` to `CatalogItemForm`

**Definition of Done:** Creating and editing catalog items persists `images`; `source_item_id` flow pre-fills form and back-links after save; all existing tests/builds pass.

---

## Phase 4 — Image gallery on public catalog detail page

> Depends on: Phase 1 (column exists)

- [x] [S] Update Supabase query in `CatalogItemContent` (`app/[locale]/catalog/[slug]/page.tsx`) to select `images`
- [x] [M] Replace single `<Image>` block with gallery: render `images` array in order if non-empty, fall back to `image_url` only if `images` is empty (no regression)
- [x] [S] Add `.catalog-detail__gallery` BEM block styles to `catalog/[slug]/page.module.css`
- [x] [S] Update `generateMetadata` to include all images in `openGraph.images`
- [x] [S] Update `buildProductSchema` to include all images in the schema.org `image` array

**Definition of Done:** Gallery renders all catalog item images on the public detail page; single-image fallback unchanged; OG and structured data include all images.

---

## Phase 5 — `CopyToCatalogButton` feature slice

> Depends on: Phase 3 (new page accepts `source_item_id`)

- [x] [S] Create FSD slice: `src/features/copy-to-catalog/ui/CopyToCatalogButton.tsx`, `CopyToCatalogButton.module.css`, `index.ts`
- [x] [S] Implement `CopyToCatalogButton` as async Server Component: calls `getSessionAndRole()`, renders nothing if not admin
- [x] [S] Render `<Link href="/admin/catalog-items/new?source_item_id=<id>">Copy to Catalog</Link>` styled as a secondary admin action button
- [x] [S] If `item.catalog_item_id` is set, render an inline warning badge: "Already linked to catalog" alongside the link
- [x] [S] Mount `<CopyToCatalogButton>` in the item detail page (`app/[locale]/[username]/[collectionSlug]/[slug]/page.tsx`) inside `<ItemMeta>`, wrapped in `<Suspense fallback={undefined}>`

**Definition of Done:** Button visible only to admins on item detail page; links to pre-filled catalog form; shows warning when item already linked; non-admins see nothing.

---

## Phase 6 — Changeset

> Depends on: all phases complete

- [x] [S] Run `pnpm changeset` from monorepo root, select `@dezkareid/collectstory`, bump `minor`, write summary: "Add Copy to Catalog admin action on collection item detail page and multi-image support for catalog items (up to 5 images with drag-to-reorder)"

**Definition of Done:** `.changeset/*.md` file committed with the PR.

---

## Dependencies Summary

```
Phase 1 → Phase 2 → Phase 3 → Phase 5
Phase 1 → Phase 4
Phase 3 + Phase 4 + Phase 5 → Phase 6
```

Phase 1 and Phase 4 can start in parallel once the migration is applied.
Phase 2 and Phase 4 can be developed in parallel.
Phase 5 requires Phase 3 to be complete (the new page must accept `source_item_id`).
