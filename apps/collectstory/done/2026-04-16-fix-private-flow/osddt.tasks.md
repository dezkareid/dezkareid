# Tasks: Fix Private Collection & Item Flow

## Phase 1 — Shared infrastructure

> Dependencies: none — all other phases depend on this phase completing first.

- [x] [M] Add `OwnerItem` type and `getOwnerCollectionBySlug`, `getOwnerItemsInCollection`, `getOwnerItemBySlug` owner-scoped query helpers to `lib/collections.ts` (use `createClient()`, no `'use cache'`, verify ownership)
- [x] [S] Create `src/shared/ui/PrivateBadge/` component — pill badge labelled "Private", absolutely positioned over parent image container, CSS Modules + design tokens only
- [x] [S] Create `src/entities/collection/ui/CollectionCard.tsx` — shared display component (name, description, item count) consumed by both the public profile list and `OwnerProfileCollectionCard`

### Definition of Done — Phase 1
- All three query helpers return `undefined` for unauthenticated requests and for requests where `user.id !== collection.user_id`.
- `PrivateBadge` renders correctly and is accessible (screen-reader label).
- `CollectionCard` entity renders identically to the current public profile card.

---

## Phase 2 — `/[username]` profile page: private collections in owner grid

> Depends on: Phase 1 fully complete.

- [x] [S] Update `OwnerProfileGrid` — remove `.eq('visibility', 'public')` filter from collections query; add `visibility` to select; update item count sub-query to count all items (no visibility filter) per collection
- [x] [S] Update `OwnerProfileCollectionCard` — accept `visibility` prop; render `<PrivateBadge />` inline (next to name) when `visibility !== 'public'`
- [x] [M] Refactor public profile `ProfileContent` (`app/[locale]/[username]/page.tsx`) and `OwnerProfileCollectionCard` to both use the shared `CollectionCard` entity component

### Definition of Done — Phase 2
- AC-1: Owner sees all collections (public + private) in the owner overlay grid; private ones show the badge.
- AC-2: Visitor sees only public collections — no regression.
- Private collection item counts show total (public + private) in the owner grid.

---

## Phase 3 — `/[username]/[collectionSlug]` collection page: private collection + private items

> Depends on: Phase 1 fully complete.

- [x] [M] Update `CollectionContent` in `app/[locale]/[username]/[collectionSlug]/page.tsx` — when `getPublicCollectionBySlug` returns `undefined`, fall back to `getOwnerCollectionBySlug`; call `notFound()` only if the owner query also fails; suppress `<DataSchema>` and `<SocialShare>` for private collections
- [x] [M] Update `OwnerItemActions` (`src/features/owner-item-actions/`) — use `getOwnerItemsInCollection` (no visibility filter); render `<PrivateBadge />` over the image for items where `visibility !== 'public'`
- [x] [S] Update item count displayed in collection header — when rendering via owner path (private collection), derive count from the owner items query result

### Definition of Done — Phase 3
- AC-3: Owner navigates to a private collection URL — page renders with all items.
- AC-4: Visitor navigates to a private collection URL — receives 404.
- AC-7: Owner views a public collection — private items appear with badges; public items unchanged.
- AC-8: No private content served from cached queries.

---

## Phase 4 — `/[username]/[collectionSlug]/[slug]` item detail page: private item access

> Depends on: Phase 1 fully complete.

- [x] [M] Update `ItemDetail` in `app/[locale]/[username]/[collectionSlug]/[slug]/page.tsx` — add owner fallback chain: `getPublicCollectionBySlug` → `getOwnerCollectionBySlug` → `notFound()`; `getPublicItemBySlug` → `getOwnerItemBySlug` → `notFound()`; skip `<DataSchema>` structured data when item is private
- [x] [S] Update `BreadcrumbNav` in the same page — add owner fallback for collection and item name resolution so the breadcrumb renders correctly for private content
- [x] [S] Verify `generateMetadata` returns `{}` for private content — confirm no change is needed (public-only queries already return `undefined` for private; add a comment documenting this is intentional)

### Definition of Done — Phase 4
- AC-5: Owner navigates to a private item URL — item detail page renders fully.
- AC-6: Visitor navigates to a private item URL — receives 404.
- AC-9: `generateMetadata` returns `{}` for private items/collections — no OG tags or structured data emitted.

---

## Dependencies summary

```
Phase 1 (query helpers + PrivateBadge + CollectionCard)
  └── Phase 2 (profile owner grid)
  └── Phase 3 (collection page)
  └── Phase 4 (item detail page)
```

Phases 2, 3, and 4 are independent of each other and can be worked in parallel once Phase 1 is done.
