# Feature Spec: Rendering Performance — Collections

## Overview

The three main public-facing routes of Collectstory — `/<username>`, `/<username>/<collection>`, and `/<username>/<collection>/<slug>` — currently contain client components (`UserProfileActions`, `CollectionActions`, `ItemActions`) that determine ownership by firing Supabase auth and profile queries in the browser via `useEffect`. This causes a visible flash of missing owner controls after hydration, and makes the initial HTML shell dependent on client-side round-trips for content that could be resolved at render time on the server.

This feature eliminates the remaining client-side data fetches on these three routes so that all collection and collection-item information is fully resolved and rendered server-side on first response, improving perceived load performance, SEO fidelity, and consistency of the rendered HTML.

## Business Context

**Company Outcomes alignment:**

- **High-Quality User Experience** — Eliminating client-side ownership fetches removes the flash of deferred UI, improving perceived performance and contributing toward the "High Quality" performance rating target on core user devices.
- **Innovation & Growth (Collecstory user base +50%)** — Profile and collection pages are the primary organic entry points for new users. Server-rendered, complete HTML improves crawlability and SEO signal strength, directly supporting discoverability growth.

**Architecture Principles alignment:**

- **Performance-First Design** — Moving data resolution to the server reduces the number of round-trips required before the page is visually complete.
- **Native Discoverability** — Server-rendered owner controls are irrelevant to crawlers, but ensuring the full content (collection cards, item details) is present in the initial HTML payload without client-side supplementation improves indexability.
- **Simplicity over Complexity** — Replacing `useEffect`-based ownership checks with server-side auth resolution removes a class of client state that is only needed to conditionally show UI that the server already knows how to resolve.

## Requirements

1. The `/<username>` page must render the "Create Collection" action (currently shown only to the profile owner) based on server-resolved auth, without requiring a client-side Supabase query after hydration.
2. The `/<username>/<collection>` page must render owner action links ("Add Item", "Edit") based on server-resolved auth, without requiring a client-side Supabase query after hydration.
3. The `/<username>/<collection>/<slug>` page must render the "Edit item" action based on server-resolved auth, without requiring a client-side Supabase query after hydration.
4. Collection cards on the `/<username>` page must be fully rendered in the server HTML response — collection name, description, and item count must be present without any additional client fetch.
5. Collection items on the `/<username>/<collection>` page must be fully rendered in the server HTML response — item name, image, and metadata must be present without any additional client fetch.
6. Item detail on the `/<username>/<collection>/<slug>` page must be fully rendered in the server HTML response — item name, brand, line, variant, category, franchise, and description must be present without any additional client fetch.
7. Pages must continue to function correctly for unauthenticated visitors — owner-only controls must not appear.
8. Pages must continue to function correctly for authenticated non-owners — owner-only controls must not appear.
9. The like button on the item detail page may remain a client interactive component, but its initial state (liked/not-liked, count) must continue to be resolved server-side.
10. Image upload/replace interaction on the item detail page may remain client-side interactive, but the image must be rendered server-side in the initial response.

## Scope

### In scope
- Refactoring `UserProfileActions`, `CollectionActions`, and `ItemActions` to resolve ownership server-side.
- Ensuring all public collection and item data is rendered in the initial server HTML on the three affected routes.
- Preserving existing cache tags and `'use cache'` patterns for public data queries.

### Out of scope
- Changes to edit forms (`EditCollectionForm`, `EditItemForm`, `AddItemPageForm`) — these are owner-only authenticated routes and are not public-facing.
- Changes to the like feature beyond what is already server-rendered (initial state).
- Introducing static generation (`generateStaticParams`) — routes remain dynamic SSR.
- Changes to routes outside the three listed (`/<username>`, `/<username>/<collection>`, `/<username>/<collection>/<slug>`).
- Performance improvements to the auditor tool or any other app in the monorepo.

## Acceptance Criteria

1. **No client-side ownership fetch**: Viewing the network panel on any of the three routes while logged in as the owner shows no Supabase REST or auth requests fired from the browser to determine ownership on initial page load.
2. **Owner controls in initial HTML**: When the authenticated session belongs to the profile owner, owner-only controls (Create Collection, Add Item, Edit collection, Edit item) are present in the server-rendered HTML (visible in `view-source` or SSR response body).
3. **Owner controls absent for visitors**: When unauthenticated or authenticated as a non-owner, owner-only controls are absent from both the server-rendered HTML and the final rendered DOM.
4. **Collection data in initial HTML**: Collection cards (name, item count) on `/<username>` are present in the server-rendered HTML without requiring JavaScript execution.
5. **Item data in initial HTML**: Item cards on `/<username>/<collection>` are present in the server-rendered HTML without requiring JavaScript execution.
6. **Item detail in initial HTML**: Item name, brand/line/variant metadata, and description on `/<username>/<collection>/<slug>` are present in the server-rendered HTML without requiring JavaScript execution.
7. **No regression on interactions**: Like button, image upload, social share, and copy-item features continue to work as before.
8. **No regression on unauthenticated views**: All three routes render correctly with full public content when accessed without a session.

## Decisions

1. **Flash of owner controls on navigation**: Unauthenticated visitors must see full public content in the initial HTML with no streaming delay (SEO requirement — crawlers must not see incomplete HTML). For authenticated owners, a brief `<Suspense>` streaming delay on client-side navigation is acceptable.
2. **Caching strategy**: Use option (a) — cache the public content shell (24h via `'use cache'`) and stream ownership UI via a dynamic `<Suspense>` boundary, consistent with the existing `OwnerImageSection` pattern. Do not make entire pages dynamic.
