# @dezkareid/collectstory

## 1.3.0

### Minor Changes

- 9353ed6: Add Copy to Catalog admin action on collection item detail page and multi-image support for catalog items (up to 5 images with drag-to-reorder).
- fb97bb0: Add Photo Sessions feature: `/{username}/sessions/` list and detail pages with photo upload, drag-and-drop reorder, and session likes

### Patch Changes

- Fix session photo bugs and improve photo management:

  - Allow uploading multiple photos at once from the file picker
  - Fix explore session button showing stale photos after upload by introducing `SessionPhotosContext` — a shared provider that keeps the photo list in sync across the actions bar and owner section
  - Fix "Cannot update a component while rendering a different component" error on photo delete by making `SessionPhotoGrid` fully controlled (no internal state sync)
  - Add share button to session detail page
  - Fix Cloudinary images cropped to 480×360 by switching from `c_fill` to `c_limit` transformation
  - Delete photo asset from Cloudinary when a session photo is deleted
  - Increase session photo upload limit from 5 MB to 10 MB per image
  - Fix image optimization falling back to original when WebP output is larger than input, instead of throwing a 500

## 1.2.2

### Patch Changes

- Fix horizontal overflow on iPhone Pro Max across collection and profile pages. Grid item cards, the collection explorer image, and the AddItemForm category field no longer cause x-axis scroll. Category field moved to bottom of AddItemForm and label replaced with an accessible paragraph.

## 1.2.1

### Patch Changes

- Fix inconsistent card sizes in public profile and collection views.

  - `/[username]`: collection cards now stretch to equal height in each grid row; the item count meta is always pinned to the bottom via `margin-top: auto` regardless of whether a description is present. Applies to both the public grid and the owner grid.
  - `/[username]/[collectionSlug]`: item cards now fill the full grid cell width (`width: 100%`) fixing an issue where `flex: 1` collapsed the card width via `flex-basis: 0%`. Images are absolutely positioned inside their aspect-ratio container to prevent the design-system base `height: auto` from competing with the fill rules. The line name element is always rendered (non-breaking space fallback) to prevent layout shift when navigating between items.
  - Explore Collection: added a stable `aspect-ratio: 3/4` image wrapper to prevent layout shift while images load, and always renders the line name to avoid content jumping when switching items.

## 1.2.0

### Minor Changes

- abd5b26: Add email/password authentication with sign-in, sign-up, password reset, and change-password flows alongside existing Google OAuth
- a9add26: Slug disambiguation UI on item creation: users now choose a unique URL when a name collision is detected
- 7f7a8d6: Fix cache invalidation after adding items to a collection so the UI reflects changes immediately without a page refresh. Add delete item and delete collection operations with modal confirmation dialogs. Add React Query for optimistic UI updates — adding and deleting items updates the grid instantly without reloading the page.
- cd53416: Implemented full internationalization (i18n) support for all public-facing pages, including the homepage, user profiles, collection details, and item details. This includes support for English and Spanish with automatic detection and URL-based routing.

### Patch Changes

- ccb278f: fix(collectstory): show private collections and items to their owners

## 1.1.0

### Minor Changes

- 37ef364: Add public catalog with store relations. Introduces a global admin-managed catalog of collectible items linked to stores, a "Where to Buy" section on item detail pages, an autocomplete picker for linking collection items to catalog items, and public `/catalog` and `/catalog/[slug]` pages with ISR and schema.org structured data.

### Patch Changes

- 49b908c: Migrate reusable UI components (Breadcrumb, Image, LikeButton, Modal, VerifiedBadge, ConsentBanner) to the @dezkareid/components design system package. This ensures visual consistency and shared primitives across the monorepo.

  Includes documentation and stories for all new components in the Storybook package.

- 643052c: Fix theme toggle border, Cloudinary image optimization for LCP, human-readable breadcrumbs with BreadcrumbList schema, Last Arrivals direct item links, and card-to-item view transition.

## 1.0.0

### Major Changes

- Initial stable release of Collectstory (1.0.0). Introduces changeset-based versioning and a web app manifest for improved device discoverability and installability.
