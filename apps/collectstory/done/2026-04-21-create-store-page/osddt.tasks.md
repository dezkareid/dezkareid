# Tasks: Store Detail Page (`/stores/[store-slug]`)

## Dependencies

```
Phase 1 → Phase 2, Phase 3
Phase 4 → Phase 3 (design reference before building UI)
Phase 2, Phase 3 → Phase 5
```

---

## Phase 1 — Database: Enrich `stores` table

> **Definition of Done**: Migration applied to remote Supabase, local migration file committed, TypeScript types regenerated and up-to-date.

- [x] [S] Apply Supabase migration via MCP to add `slug`, `cover_url`, `logo_url`, `address`, `google_place_id` columns to `stores`, backfill `slug` from `name`, and add `NOT NULL` + `UNIQUE` constraint on `slug`
- [x] [S] Create matching local migration file at `supabase/migrations/<timestamp>_add_store_enrichment_fields.sql` with the same SQL (rename to match remote timestamp)
- [x] [S] Regenerate TypeScript types via `mcp__supabase__generate_typescript_types` and overwrite `lib/supabase/types.ts`

---

## Phase 2 — Admin: Extend Store Edit Form

> **Definition of Done**: Admin can fill `cover_url`, `logo_url`, `address`, `google_place_id` on the store edit form and add/remove catalog item links. All changes persist to DB and revalidate the store's public cache tag.

**Depends on**: Phase 1

- [x] [S] Update `StoreForm` component (`components/admin/StoreForm.tsx`) — add optional fields: `cover_url`, `logo_url`, `address`, `google_place_id` (with help text "Google Maps Place ID")
- [x] [S] Update `createStore` and `updateStore` Server Actions (`app/[locale]/admin/stores/actions.ts`) — parse and persist the four new fields from FormData
- [x] [S] Add `revalidateTag('store-${slug}')` calls to `updateStore`, `softDeleteStore`, and `toggleStoreVerified` actions so public store pages invalidate on admin edits
- [x] [M] Add `addCatalogItemToStore` and `removeCatalogItemFromStore` Server Actions to `app/[locale]/admin/stores/actions.ts` — require admin role, insert/delete `catalog_item_stores` row, call `revalidateTag`
- [x] [M] Build `StoreItemsManager` client component (`components/admin/StoreItemsManager.tsx`) — list linked catalog items with remove buttons, search-and-add input that calls `addCatalogItemToStore`
- [x] [M] Update Edit Store page (`app/[locale]/admin/stores/[id]/edit/page.tsx`) — fetch store + linked catalog items in parallel; render updated `StoreForm` + `StoreItemsManager`

---

## Phase 3 — Public Store Detail Page

> **Definition of Done**: `/stores/[store-slug]` renders for a valid visible store; returns 404 for unknown/hidden slugs; shows catalog items, opt-in map, and Google Maps reviews embed; has correct metadata and JSON-LD; strings present in both `es` and `en`; `/stores` directory links to each detail page.

**Depends on**: Phase 1, Phase 4 (for design reference)

- [x] [S] Create `lib/stores.ts` with `getStoreBySlug(slug)` and `getStoreItems(storeId)` — both use `'use cache'` + `cacheLife('hours')` + `cacheTag('store-${slug}')`; export `StoreDetail` and `StoreDetailItem` types
- [x] [M] Build `src/entities/store/ui/StoreHero.tsx` + `StoreHero.module.css` — circular logo (`next/image`), store name, city/country, verified badge (`Tag` component), website link (`Button` component); export from `src/entities/store/index.ts`
- [x] [M] Build `src/entities/store/ui/StoreItemCard.tsx` + `StoreItemCard.module.css` — item image (`next/image`, `sizes` set), item name, franchise tag (`Tag`), links to `/catalog/[slug]`; card style matches design system (background-secondary, border-radius-large, shadow-card)
- [x] [M] Build `src/features/store-map/ui/StoreMapToggle.tsx` + `StoreMapToggle.module.css` — `'use client'`; "Show map" / "Hide map" toggle button with `aria-expanded` + `aria-controls`; lazy-mounts Google Maps Embed API `<iframe>` (`https://www.google.com/maps/embed/v1/place?key=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q={lat},{lng}`) only after toggle; renders nothing when `lat`/`lng` absent
- [x] [M] Build `src/features/store-map/ui/StoreReviewsEmbed.tsx` + `StoreReviewsEmbed.module.css` — `'use client'`; embeds Google Maps reviews widget via Places API using `google_place_id` + `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`; renders nothing when `google_place_id` absent; export both from `src/features/store-map/index.ts`
- [x] [M] Build `src/widgets/store-detail/ui/StoreDetailWidget.tsx` + `StoreDetailWidget.module.css` — Server Component composing `StoreHero`, catalog items grid (or "No items listed yet" empty state), `StoreMapToggle`, `StoreReviewsEmbed`; export from `src/widgets/store-detail/index.ts`
- [x] [M] Create page route `app/[locale]/stores/[store-slug]/page.tsx` — `revalidate = 3600`; `generateMetadata` with dynamic title/description; fetch store + items in parallel; `notFound()` if null or `!visible`; render `StoreDetailWidget`; inject `LocalBusiness` JSON-LD script
- [x] [S] Add i18n strings — `StorePage` namespace keys in `messages/es.json` and `messages/en.json` (verified, visitStore, availableItems, noItemsListed, location, showMap, hideMap, reviews, viewReviews)
- [x] [S] Update `/stores` directory page (`app/[locale]/stores/page.tsx`) — add `slug` to `getStores()` select; wrap each store list item in a `<Link href="/stores/${store.slug}">` (only when `slug` is present)
- [x] [S] Update `app/sitemap.ts` — include all `visible = true` stores with their slugs as `/stores/[slug]` entries

---

## Phase 4 — Design with Stitch MCP

> **Definition of Done**: At least one Stitch screen generated for the public store detail page; HTML reference used to guide component implementation.

- [x] [S] Generate store detail screen via `mcp__stitch-collectstory__generate_screen_from_text` (project `10701000976131458615`, MOBILE) — store hero, catalog scroll, location + map toggle, reviews section; apply Collectstory design tokens
- [x] [S] Generate admin store edit extension screen via Stitch — new fields panel + StoreItemsManager panel
- [x] [S] Review generated HTML/CSS output; note design decisions to apply during Phase 3 component implementation

---

## Phase 5 — Quality & Accessibility

> **Definition of Done**: Zero critical/serious axe-core violations on the store detail page; Lighthouse mobile Performance ≥ 90; map iframe only loads after user interaction confirmed in browser.

**Depends on**: Phase 2, Phase 3

- [x] [S] Verify map `<iframe>` is not mounted in DOM on initial load (only after toggle click) — check via browser DevTools or `evaluate_script`
- [x] [S] Verify all images use `next/image` with `sizes` attribute; hero cover image has `priority` prop
- [x] [S] Run axe-core accessibility audit on `/stores/[store-slug]` via `mcp__chrome-user-session__evaluate_script` — fix any critical/serious violations
- [x] [M] Run Lighthouse mobile audit via `mcp__chrome-user-session__lighthouse_audit` — confirm Performance ≥ 90 and all other scores acceptable; fix blockers if below threshold
- [x] [S] Manual keyboard navigation check — tab through store hero links, "Show map" toggle, catalog item cards; confirm focus order is logical
