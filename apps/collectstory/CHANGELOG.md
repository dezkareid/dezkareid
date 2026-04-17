# @dezkareid/collectstory

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
