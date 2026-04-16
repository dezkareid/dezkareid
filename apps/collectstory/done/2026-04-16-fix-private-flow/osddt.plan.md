# Plan: Fix Private Collection & Item Flow

## Architecture Overview

The app uses a **dual-grid pattern** for owner vs. visitor rendering:

- A **cached public RSC** (via `'use cache'`) renders content visible to everyone and to search engines. These queries always filter by `visibility = 'public'` — this must never change.
- A **dynamic owner RSC** (via `connection()` + `createClient()`) streams in via `<Suspense>` and, when the user is the authenticated owner, overlays the public grid using a CSS `:has()` selector trick.

This fix extends the owner RSC layer on all three affected routes to include private content, while leaving the public cached layer completely untouched.

### Key design decisions

1. **No changes to public cached queries** — `getPublicCollectionsByUsername`, `getPublicCollectionBySlug`, `getPublicItemsInCollection`, `getPublicItemBySlug` are not modified. SEO, caching, and visitor behaviour are preserved exactly.

2. **New owner-scoped query helpers** in `lib/collections.ts`:
   - `getOwnerCollectionBySlug(username, collectionSlug)` — fetches a collection by slug with no visibility filter, using the authenticated server client. Returns `undefined` if the user is not the owner.
   - `getOwnerItemsInCollection(collectionId)` — fetches all items in a collection (public + private), authenticated, no visibility filter.
   - `getOwnerItemBySlug(collectionId, itemSlug)` — fetches an item by slug with no visibility filter, authenticated.

3. **Shared `CollectionCard` component** — the `OwnerProfileCollectionCard` and the public profile card share duplicated structure (name, description, item count). Extract a shared `CollectionCard` entity component in `src/entities/collection/ui/CollectionCard.tsx` that both the public list and the owner card consume, reducing duplication.

4. **`PrivateBadge` component** — a new shared UI component `src/shared/ui/PrivateBadge/` renders a small "Private" badge overlaid on images. Used by the owner grid on `/[username]`, the owner item grid on `/[username]/[collectionSlug]`, and the item detail page.

5. **`/[username]/[collectionSlug]` — owner item grid refactor** — `OwnerItemActions` currently fetches and renders the owner grid. It will be extended to include private items alongside public ones, and each item card will conditionally show the `PrivateBadge`.

6. **`/[username]/[collectionSlug]/[slug]` — private item access** — when `getPublicItemBySlug` returns `undefined` (item is private or doesn't exist), instead of immediately calling `notFound()`, the page attempts `getOwnerItemBySlug` using the authenticated client. If that also returns `undefined` or the user is not the owner, then `notFound()` is called.

7. **`generateMetadata` stays SEO-safe** — metadata functions call only the public query. If the public query returns nothing (private content), metadata returns `{}`. No change needed.

---

## Implementation Phases

### Phase 1 — Shared infrastructure

**Goal**: Add the new owner query helpers and shared UI components that all phases depend on.

#### 1.1 — Add owner-scoped query helpers to `lib/collections.ts`

Add three new async functions that use `createClient()` (authenticated server client, no `'use cache'`):

```ts
// Returns the collection regardless of visibility, only if the authenticated user owns it.
export async function getOwnerCollectionBySlug(
  username: string,
  collectionSlug: string,
): Promise<{ collection: { id: string; name: string; slug: string; description: string | undefined; visibility: string }; userId: string } | undefined>

// Returns all items in a collection (public + private), only if called from an authenticated owner context.
export async function getOwnerItemsInCollection(
  collectionId: string,
): Promise<OwnerItem[]>  // OwnerItem extends PublicItem with { visibility: string }

// Returns an item by slug regardless of visibility.
export async function getOwnerItemBySlug(
  collectionId: string,
  itemSlug: string,
): Promise<PublicItemDetail | undefined>
```

Also export a new `OwnerItem` type (extends `PublicItem` with `visibility: string`).

#### 1.2 — Create `PrivateBadge` shared UI component

New file: `src/shared/ui/PrivateBadge/PrivateBadge.tsx`

- Client component (`'use client'` not needed — no interactivity, can be RSC).
- Renders a small pill/badge reading "Private" (translated via `useTranslations` / `getTranslations`).
- Positioned absolutely over the image container — the parent must have `position: relative`.
- CSS Module: `PrivateBadge.module.css` — uses design tokens only.
- Export via `src/shared/ui/PrivateBadge/index.ts`.

#### 1.3 — Extract shared `CollectionCard` entity component

New file: `src/entities/collection/ui/CollectionCard.tsx`

Extracts the shared structure used by both:
- The public profile page's `<Link>` card (name, description, item count)
- `OwnerProfileCollectionCard` (same structure + delete button + private badge)

The entity component renders only display — no delete button, no badge (those are feature/owner concerns passed as children or props). This reduces duplication between the two card implementations.

Export via `src/entities/collection/index.ts`.

---

### Phase 2 — `/[username]` profile page: private collections in owner grid

**Goal**: Owner sees private collections in their overlay grid with a "Private" badge.

#### 2.1 — Update `OwnerProfileGrid` query

In `src/features/owner-profile-actions/ui/OwnerProfileGrid.tsx`, change the collections query to remove the `.eq('visibility', 'public')` filter. Add `visibility` to the select. Count items without visibility filter for private collections; keep public-only count for public collections.

Also update the item count sub-query: for each collection, count all items (no visibility filter) to show the owner the full count.

#### 2.2 — Update `OwnerProfileCollectionCard` to show `PrivateBadge`

Pass `visibility` from the grid to `OwnerProfileCollectionCard`. When `visibility !== 'public'`, render `<PrivateBadge />` overlaid on the card. Since there is no image on the profile collection card, position the badge inline (e.g. next to the name) rather than over an image.

Update the `Collection` type in `OwnerProfileCollectionCard` to include `visibility: string`.

#### 2.3 — Refactor to use shared `CollectionCard`

Replace the duplicated card structure in the public profile page (`app/[locale]/[username]/page.tsx` `ProfileContent`) and in `OwnerProfileCollectionCard` to both consume the shared `CollectionCard` entity.

---

### Phase 3 — `/[username]/[collectionSlug]` collection page: private collection + private items

**Goal**: Owner can navigate to a private collection URL and sees all items (including private).

#### 3.1 — Handle private collection access in `CollectionContent`

In `app/[locale]/[username]/[collectionSlug]/page.tsx`, `CollectionContent` currently calls `getPublicCollectionBySlug` and calls `notFound()` if it returns `undefined`.

Change to: if `getPublicCollectionBySlug` returns `undefined`, attempt `getOwnerCollectionBySlug`. If that also fails (visitor, or wrong owner), call `notFound()`. If it succeeds (authenticated owner), proceed to render the collection using the owner data.

When rendering the collection as an owner with a private collection, skip the `<DataSchema>` structured data and `<SocialShare>` (or render them conditionally only when `visibility === 'public'`).

#### 3.2 — Update `OwnerItemActions` to include private items

In `src/features/owner-item-actions/ui/OwnerItemActions.tsx`, change the items query to remove the `visibility = 'public'` filter (use `getOwnerItemsInCollection`). Render `<PrivateBadge />` over the image for items where `visibility !== 'public'`.

#### 3.3 — Item count in collection header

When rendering as owner, the item count in the header should reflect public + private items (from the owner query). When rendering as visitor, it reflects public only (from the cached query). Pass an `isOwner` flag or use the result length from the appropriate query.

---

### Phase 4 — `/[username]/[collectionSlug]/[slug]` item detail page: private item access

**Goal**: Owner can navigate to a private item URL; visitors get a 404.

#### 4.1 — Fallback to owner query in `ItemDetail`

In `app/[locale]/[username]/[collectionSlug]/[slug]/page.tsx`, `ItemDetail` calls `getPublicCollectionBySlug` then `getPublicItemBySlug`. Currently both return `undefined` for private content, causing `notFound()`.

Change to:
1. Try `getPublicCollectionBySlug`. If `undefined`, try `getOwnerCollectionBySlug`. If still `undefined` → `notFound()`.
2. Try `getPublicItemBySlug`. If `undefined`, try `getOwnerItemBySlug`. If still `undefined` → `notFound()`.
3. When rendering via owner path, skip `<DataSchema>` schema output (no structured data for private items).

#### 4.2 — `BreadcrumbNav` graceful fallback

`BreadcrumbNav` also calls `getPublicCollectionBySlug` / `getPublicItemBySlug` to resolve display names. Extend with the same owner fallback so the breadcrumb renders correctly for private content.

#### 4.3 — `generateMetadata` stays unchanged

`generateMetadata` calls only the public queries. If the collection or item is private, it returns `{}`. This is correct behaviour — no metadata, no indexing. No change required.

---

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| `createClient` (server Supabase) | Existing — `lib/supabase/server.ts` | Used for all owner queries |
| `connection()` from `next/server` | Existing pattern | Required in owner RSC to opt out of caching |
| `getTranslations` / `useTranslations` | Existing | Need translation key for "Private" badge label |
| `src/shared/ui/PrivateBadge` | New | Created in Phase 1 |
| `src/entities/collection` | New | Created in Phase 1 |
| `OwnerItem` type | New | Exported from `lib/collections.ts` |
| Owner query helpers | New | Added to `lib/collections.ts` |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Owner query accidentally leaks private data to visitors | All owner helpers call `createClient()` (cookie-based session) + verify `user.id === collection.user_id` before returning data. No data is returned for unauthenticated requests. |
| `'use cache'` boundary contamination | Owner helpers have no `'use cache'` directive. Public helpers are not modified. Cache and dynamic paths remain strictly separated. |
| `generateMetadata` serving private content in OG tags | Metadata functions call only public queries — no change needed. Private content returns `{}`. |
| CSS `:has()` trick stops working | It is already in use on both `/[username]` and `/[collectionSlug]` — this plan follows the established pattern, not introduces it. |
| Breadcrumb showing wrong names for private content | Phase 4.2 adds the owner fallback to `BreadcrumbNav` explicitly. |
| Duplicate item count queries (public + total) | Accepted trade-off. Owner queries run dynamically (no cache), so an extra count query per collection is acceptable for the owner-only path. |

---

## Out of Scope

- Changing visibility settings (toggle public/private).
- Sharing private collections with other users.
- Private content in sitemap, landing page, or search results.
- Admin-level visibility overrides.
- `generateMetadata` for private content (returns `{}` — intentional).
