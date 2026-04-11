# Tasks: Catalog Items & Store Relations

> Feature: `catalog-items-stores`
> Plan: `osddt.plan.md`

---

## Phase 1 — Database Schema

> **Depends on:** nothing
> **Definition of Done:** All migrations applied, TypeScript types regenerated and committed. `collection_item_stores` table dropped. `catalog_items` and `catalog_item_stores` exist with correct RLS. `search_catalog_items` RPC callable from anon role.

- [x] [S] Migration: enable `pg_trgm` extension
- [x] [M] Migration: create `catalog_items` table with RLS (public SELECT, admin INSERT/UPDATE/DELETE via `is_admin()`), GIN trigram index on `name`, `updated_at` trigger
- [x] [S] Migration: create `catalog_item_stores` junction table with RLS (public SELECT, admin INSERT/DELETE)
- [x] [S] Migration: add nullable `catalog_item_id` FK to `collection_items` (ON DELETE SET NULL)
- [x] [S] Migration: drop `collection_item_stores` table (include empty-table assertion guard)
- [x] [M] Migration: create `search_catalog_items(query text, max_results int)` SQL function (ILIKE + trigram similarity, joins franchise + line names, SECURITY DEFINER)
- [x] [S] Regenerate `lib/supabase/types.ts` via `mcp__supabase__generate_typescript_types` and update file

---

## Phase 2 — Admin: Catalog Items CRUD

> **Depends on:** Phase 1 complete
> **Definition of Done:** Admin can create, edit, delete catalog items and manage their store associations at `/admin/catalog-items`. Non-admin users are redirected.

- [x] [M] Create `app/admin/catalog-items/actions.ts` with `createCatalogItem`, `updateCatalogItem`, `deleteCatalogItem`, `addStoreToCatalogItem`, `removeStoreFromCatalogItem` Server Actions (all guard with `requireAdmin`, use `createAdminClient`)
- [x] [M] Create `components/admin/CatalogItemForm.tsx` (`'use client'`, `useActionState`, fields: name, description, image upload via Cloudinary, franchise select, line select)
- [x] [M] Create `app/admin/catalog-items/page.tsx` — list view (Server Component, query with franchise + line joins, store count, search by `?q=` param, reuse `list.module.css`)
- [x] [S] Create `app/admin/catalog-items/new/page.tsx` — fetch franchises + lines, render `CatalogItemForm` with `createCatalogItem`
- [x] [M] Create `app/admin/catalog-items/[id]/edit/page.tsx` — fetch catalog item + associated stores, render `CatalogItemForm` + `CatalogItemStoreManager`
- [x] [M] Create `components/admin/CatalogItemStoreManager.tsx` (`'use client'`, list associated stores with Remove button, store search input from server-fetched prop, Add button calling `addStoreToCatalogItem`)
- [x] [S] Add "Catalog Items" link to `app/admin/page.tsx` admin dashboard

---

## Phase 3 — Autocomplete API & Feature Slice

> **Depends on:** Phase 1 complete
> **Definition of Done:** `GET /api/catalog-items/search?q=term` returns ranked results. `CatalogItemPicker` renders a working debounced combobox in isolation (can be tested via Storybook or dev).

- [x] [S] Create `app/api/catalog-items/search/route.ts` Route Handler (`GET`, calls `search_catalog_items` RPC via `createServerClient`, returns JSON, `Cache-Control: no-store`)
- [x] [M] Create `src/features/catalog-item-picker/model/types.ts` — `CatalogItemSearchResult` type
- [x] [M] Create `src/features/catalog-item-picker/ui/CatalogItemPicker.tsx` (`'use client'`, debounced fetch 300ms, dropdown results with name + franchise/line subtitle, clear button, hidden input for form submission)
- [x] [S] Create `src/features/catalog-item-picker/ui/CatalogItemPicker.module.css` (tokens only: `--color-*`, `--spacing-*`, `--border-radius-*`, `--shadow-*`)
- [x] [S] Create `src/features/catalog-item-picker/index.ts` public API export

---

## Phase 4 — Collection Item Integration

> **Depends on:** Phase 1, Phase 3 complete
> **Definition of Done:** Users can link/unlink a catalog item when adding or editing a collection item. `catalog_item_id` is persisted. Old `collection_item_stores` UI is removed.

- [x] [M] Update `app/[username]/[collectionSlug]/items/[itemId]/edit/EditItemForm.tsx` — add `CatalogItemPicker`, pass default from `collection_item.catalog_item_id`, add hidden input `catalog_item_id`
- [x] [M] Update `app/[username]/[collectionSlug]/items/new/AddItemPageForm.tsx` — add `CatalogItemPicker` with no default
- [x] [S] Update Server Actions (`addItem`, `updateItem`) to read and persist `catalog_item_id` from form data (UUID or null)
- [x] [S] Pre-fetch linked catalog item name/id in edit page Server Component so `CatalogItemPicker` can show the current selection on load
- [x] [S] Remove any remaining `collection_item_stores` UI from collection item forms (junction dropped in Phase 1)

---

## Phase 5 — "Where to Buy" on Item Detail

> **Depends on:** Phase 1, Phase 4 complete
> **Definition of Done:** Item detail page shows a "Where to buy" section with stores from the linked catalog item. Section is absent when no catalog item is linked or catalog item has no stores.

- [x] [M] Create `src/features/where-to-buy/ui/WhereToBuy.tsx` — Server Component, renders store list (name, city/country, "Visit Store" link button); renders nothing if `stores` is empty
- [x] [S] Create `src/features/where-to-buy/ui/WhereToBuy.module.css`
- [x] [S] Create `src/features/where-to-buy/index.ts` public API export
- [x] [M] Update item detail page (`app/[username]/[collectionSlug]/[slug]/page.tsx`) — if `catalog_item_id` present, fetch `catalog_item_stores` joined with `stores`; render `<WhereToBuy stores={catalogStores} />`

---

## Phase 6 — Public Catalog Pages

> **Depends on:** Phase 1, Phase 2 complete
> **Definition of Done:** `/catalog` lists all catalog items (ISR). `/catalog/[slug]` shows item detail + stores (ISR). Both pages have correct metadata and schema.org JSON-LD. Sitemap includes catalog entries.

- [x] [M] Create `src/entities/catalog-item/ui/CatalogItemCard.tsx` + `CatalogItemCard.module.css` — display card (image, name, franchise tag, line tag), uses `Card` from `@dezkareid/components/react`
- [x] [S] Create `src/entities/catalog-item/index.ts` public API export
- [x] [M] Create `app/catalog/page.tsx` — ISR (`revalidate: 3600`), fetch all catalog items with franchise + line, grid of `CatalogItemCard`, `generateMetadata`, `ItemList` JSON-LD
- [x] [S] Create `app/catalog/page.module.css`
- [x] [M] Create `app/catalog/[slug]/page.tsx` — ISR (`revalidate: 3600`), fetch catalog item by slug + associated stores, render detail + `WhereToBuy`, `generateMetadata`, `Product` JSON-LD with store offers, `generateStaticParams`
- [x] [S] Create `app/catalog/[slug]/page.module.css`
- [x] [S] Update `app/sitemap.ts` — add `/catalog` and all `/catalog/[slug]` entries

---

## Phase 7 — Changeset & Release

> **Depends on:** All phases complete, PR ready
> **Definition of Done:** Changeset file committed with the PR.

- [x] [S] Run `pnpm changeset` from monorepo root — select `@dezkareid/collectstory`, bump `minor`, write user-facing summary

---

## Dependencies Summary

```
Phase 1 (Schema)
  └── Phase 2 (Admin CRUD)
  └── Phase 3 (Autocomplete API + Picker)
        └── Phase 4 (Collection Item Integration)
              └── Phase 5 (Where to Buy)
  └── Phase 6 (Public Catalog Pages)
Phase 7 (Changeset) — after all phases
```

Phases 2, 3, and 6 can be worked in parallel once Phase 1 is done.
Phase 4 requires both Phase 1 and Phase 3.
Phase 5 requires Phase 1 and Phase 4.
