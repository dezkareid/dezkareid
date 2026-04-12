# @dezkareid/collectstory

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
