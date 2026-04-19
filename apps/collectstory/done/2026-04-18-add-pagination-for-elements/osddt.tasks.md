# Task List: Infinite Scroll for Collections and Items

## Phase 1–5: Completed (URL-based pagination foundation)
- [x] Types, lib functions, API routes, caching — all done

## Phase 6: total_items / public_items counters
- [x] Migration: add `total_items` + `public_items` columns + triggers + backfill
- [x] `getPublicCollectionsByUsername`: use `public_items`, COUNT fallback when null
- [x] `OwnerProfileGrid`: use `total_items`, COUNT fallback when null

## Phase 7: Explorer cross-page navigation & directional animation
- [x] `CollectionExplorerView`: eager all-page fetch, direction-aware slide animation
- [x] `ExploreButton`: pass `totalItems`, `collectionId`, `username`, `collectionSlug`

## Phase 8: Infinite scroll — collection page
- [x] Create `InfiniteScrollGrid` client component in `src/shared/ui/InfiniteScrollGrid/`
- [x] Replace `PublicItemGrid` + `CollectionPaginationNav` with `InfiniteScrollGrid` in collection page
- [x] Remove `searchParams`, `force-dynamic`, `getTotalPages` from collection page
- [x] Remove pagination CSS from `page.module.css` (collection)

## Phase 9: Infinite scroll — profile page
- [x] Create `InfiniteScrollCollections` client component in `src/features/profile/`
- [x] Replace `ProfileContent` + `ProfilePaginationNav` with `InfiniteScrollCollections` in profile page
- [x] Remove `searchParams` usage and `PaginationControls` import from profile page
- [x] Remove pagination CSS from `page.module.css` (profile)
