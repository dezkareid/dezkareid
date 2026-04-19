# Specification: Infinite Scroll for Collections and Items

## Overview
As the Collecstory platform grows, users are creating and managing an increasing number of collections and items. Loading all elements at once impacts performance.

This feature introduces infinite scroll for both the collections list and the items list within collections. The first page is SSR-rendered for crawlers and fast initial load; subsequent pages are fetched client-side via `IntersectionObserver` as the user scrolls. The "Explore Collection" lightbox retains its existing behavior (eager all-page fetch + directional swipe navigation).

### Business Context
- **Performance-First Design**: First contentful paint is fast (SSR first page); remaining content loads progressively.
- **Native Discoverability**: Canonical URL stays clean (no `?page=` param) — better for SEO.
- **Simplicity over Complexity**: No URL state to manage, no Suspense wrappers, no `force-dynamic`.

## Requirements
- **SSR first page**: First 20 items/collections rendered server-side in initial HTML.
- **Client infinite scroll**: Subsequent pages fetched via `IntersectionObserver` hitting existing API route handlers.
- **Loading indicator**: Subtle spinner/bar while next page is loading.
- **End state**: Sentinel stops observing when all items are loaded.
- **Empty state**: Handled server-side on first render.

## Scope
### In-Scope
- `InfiniteScrollGrid` client component for items (collection page).
- `InfiniteScrollCollections` client component for collections (profile page).
- Remove prev/next pagination controls and all related CSS from both pages.
- Remove `?page` searchParams usage, `force-dynamic`, and `getTotalPages` from both pages.
- Explorer (`CollectionExplorerView`) stays unchanged — already fetches all pages eagerly on open.

### Out-of-Scope
- URL-based deep linking to a specific scroll position.
- Owner grid infinite scroll (owner items already load all at once from context).

## Acceptance Criteria
- [ ] First 20 items render in SSR HTML with no JS required.
- [ ] Scrolling to the bottom appends the next 20 items without a page reload.
- [ ] A loading indicator appears while fetching.
- [ ] No more items are fetched once the full list is loaded.
- [ ] The Explorer lightbox is unaffected and still navigates through all items.

## Decisions
1. **Scroll detection**: `IntersectionObserver` on a sentinel `div` at the bottom of the list.
2. **API**: Existing `/api/collection-items` and `/api/collections` route handlers — no changes needed.
3. **Page size**: Unchanged at 20 items per page.
4. **Owner grid**: Unchanged — loads all items at once from `CollectionAuthData`.
5. **Explorer**: Unchanged — already handles full-collection navigation independently.
6. **`total_items` / `public_items` counters**: Unchanged — still used by `OwnerProfileGrid` and `getPublicCollectionsByUsername`.
