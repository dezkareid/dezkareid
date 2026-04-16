# Spec: Fix Private Collection & Item Flow

## Overview

Private collections and items are currently invisible to their owners when browsing their own profile and collection pages. The queries that power `/[username]`, `/[username]/[collectionSlug]`, and `/[username]/[collectionSlug]/[slug]` filter strictly by `visibility = 'public'`, meaning any collection or item the owner has marked private returns a 404 or is silently omitted — even when the owner is logged in.

This fix ensures that owners can always view their private collections and items on their own profile, while visitors (unauthenticated or other users) continue to see only public content.

## Business Context

**Company outcomes alignment:**
- **Operational Excellence** — fixing a reliability gap where owners lose access to their own private content, reducing friction and potential support issues.
- **High-Quality User Experience** — owners expect to see and manage everything they have created, regardless of visibility state.
- **Innovation & Growth** — private collections are a trust feature that encourages collectors to organise content before publishing; if private content is broken, that trust mechanism is undermined.

**Architecture principles alignment:**
- **Simplicity over Complexity** — the fix avoids over-engineering: private content only needs auth-aware rendering for the owner, not a full permission system.
- **Statelessness and Modularity** — the public cached path remains unchanged; private rendering is an additive, isolated client-side layer for the owner only.
- **Native Discoverability** — private content must never be indexed or cached publicly, so server-side (cached) components continue to filter by `visibility = 'public'`.

## Requirements

### `/[username]` — User Profile Page

1. The public cached grid must continue to show only public collections to all visitors.
2. The owner, when authenticated, must also see their private collections listed alongside their public ones in the owner grid.
3. Private collections must be visually distinguished from public ones (e.g. a "Private" badge) so the owner knows their visibility state at a glance.
4. Private collection item counts must reflect all items in that collection (public + private) when displayed to the owner.

### `/[username]/[collectionSlug]` — Collection Page

5. If a collection is private and the visitor is not the owner, the page must return a 404 (not found).
6. If a collection is private and the authenticated user is the owner, the page must render normally, showing all items in the collection regardless of their visibility.
7. If a collection is public, items must continue to be filtered by `visibility = 'public'` for visitors. The owner, however, must also see their private items within the collection.
8. Private items must be visually distinguished (e.g. a "Private" label) so the owner recognises them.

### `/[username]/[collectionSlug]/[slug]` — Item Detail Page

9. If an item is private and the visitor is not the owner, the page must return a 404.
10. If an item is private and the authenticated user is the owner, the page must render the full item detail normally.
11. The server-side cached query path must not be changed to expose private data — private item rendering must use a client-aware or uncached path.

### General Constraints

12. Private collections and items must never appear in cached server responses accessible to non-owners.
13. No SEO metadata (Open Graph, structured data) should be generated for private collections or items.
14. The existing public/cached rendering pipeline must not be broken — public content performance and caching must be preserved.

## Scope

**In scope:**
- Fixing the owner's ability to view private collections on `/[username]`.
- Fixing the owner's ability to view private collections on `/[username]/[collectionSlug]` (navigate into the collection).
- Fixing the owner's ability to view private items on `/[username]/[collectionSlug]/[slug]` (item detail page).
- Visual distinction for private content when viewed by the owner.
- Updating the `/[username]` owner grid query to include private collections.

**Out of scope:**
- Changing visibility settings (toggle public/private) — that is an existing feature.
- Sharing private collections with specific users (not a current product goal).
- Private content appearing in the public sitemap, search results, or landing page latest arrivals.
- Admin-level visibility overrides.

## Acceptance Criteria

| # | Scenario | Expected behaviour |
|---|---|---|
| AC-1 | Owner visits `/[username]` while logged in | Sees all their collections (public + private); private ones are labelled. |
| AC-2 | Visitor (not owner) visits `/[username]` | Sees only public collections — identical to current behaviour. |
| AC-3 | Owner navigates to a private collection at `/[username]/[collectionSlug]` | Page renders with all items visible (public + private). |
| AC-4 | Visitor navigates to a private collection URL | Page returns 404. |
| AC-5 | Owner navigates to a private item at `/[username]/[collectionSlug]/[slug]` | Item detail page renders fully. |
| AC-6 | Visitor navigates to a private item URL | Page returns 404. |
| AC-7 | Owner views a public collection while logged in | Private items within the collection are visible and labelled; public items are unchanged. |
| AC-8 | Private collection or item is never served from the public cached query | No private content leaks through the `'use cache'` layer. |
| AC-9 | Private item/collection detail pages have no Open Graph or structured data | `generateMetadata` returns `{}` for private content when called without owner auth context. |

## Decisions

1. **Owner grid overlay vs unified grid**: Private collections remain only in the owner overlay layer (the existing `:has()` CSS pattern). The public cached grid stays untouched underneath — no change to the public rendering path.
2. **Item count on profile page**: The owner sees total item count (public + private). Visitors see only the public item count — same as today.
3. **Private badge design**: No existing badge exists — create a new "Private" badge component. It should be displayed as a badge overlaid on the collection/item image.
