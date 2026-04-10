# Specification: Fix Theme Toggle, Breadcrumb, Images & Last Arrivals

## Overview

This feature addresses four user-facing bugs and quality gaps in the Collectstory application and its shared design system:

1. **ThemeToggle button** displays an unwanted visible border, degrading visual consistency.
2. **Collection item images** are not served at optimal sizes via Cloudinary, causing poor Largest Contentful Paint (LCP) scores.
3. **Breadcrumbs** in collection and item pages display raw URL slugs instead of human-readable names, and lack Schema.org BreadcrumbList structured data for SEO.
4. **Last Arrivals cards** link to the collection page instead of the individual item page, preventing users from navigating directly to the item they see.

These fixes directly improve user experience, site performance, and organic discoverability — all of which are critical to Collectstory's growth targets.

---

## Business Context

These fixes align with the following company outcomes and architecture principles:

**Company Outcomes:**
- *Expand Collectstory user base by 50% through improved organic discoverability (SEO)*: Adding BreadcrumbList structured data and human-readable breadcrumb labels makes pages more indexable and improves SERP appearance.
- *Achieve a "High Quality" performance rating on core user devices*: Fixing LCP-impacting unoptimized images directly addresses this key result.

**Architecture Principles:**
- *Performance-First Design*: Serving correctly-sized images via Cloudinary transformations is a direct application of this principle — performance must not be an afterthought.
- *Native Discoverability*: BreadcrumbList structured data follows the semantic standards principle — systems must be inherently discoverable by both users and external systems.
- *Simplicity over Complexity*: Reusing the existing Button `ghost` variant for ThemeToggle avoids maintaining duplicate styling logic across two components.

---

## Requirements

### 1. ThemeToggle — Remove Visible Border

- The ThemeToggle button must not display a visible border in either light or dark mode.
- The button must remain visually distinct and interactive (hover and focus states preserved).
- If the existing Button component's `ghost` variant achieves the borderless appearance without custom CSS, it should be used in place of the current custom button implementation.

### 2. Images — Cloudinary Optimized URLs

- Collection item images displayed anywhere in the app (collection grid, item cards, Last Arrivals) must be served using Cloudinary's URL-based transformation capabilities to deliver appropriately resized images.
- The image URL must include transformation parameters that match the display size context (e.g., thumbnails should not download full-resolution images).
- This applies to all pages and components that render `image_url` values from collection items.

### 3. Breadcrumb — Human-Readable Labels & BreadcrumbList Schema

- Breadcrumbs on the collection page must display the collection's human-readable name instead of the raw `collectionSlug`.
- Breadcrumbs on the item detail page must display both the collection's human-readable name and the item's human-readable name instead of their raw slugs.
- Both pages must emit a valid Schema.org `BreadcrumbList` JSON-LD structured data block in the page `<head>`, reflecting the full breadcrumb trail with correct labels and URLs.

### 4. Last Arrivals — Link to Item, Not Collection

- Each card in the Last Arrivals section must link directly to the individual item page (`/{username}/{collectionSlug}/{itemSlug}`), not to the collection page.
- The `slug` field is already present on the `LastArrivalItem` type and must be used to construct the correct URL.

---

## Scope

### In Scope

- `design-system/components`: ThemeToggle component styling (border removal, potential Button ghost variant reuse).
- `apps/collectstory`: All components and pages that render collection item images with Cloudinary URLs.
- `apps/collectstory`: Breadcrumb UI in collection page and item detail page (human-readable labels).
- `apps/collectstory`: BreadcrumbList JSON-LD schema for collection page and item detail page.
- `apps/collectstory`: Last Arrivals card link fix.

### Out of Scope

- Changes to image upload logic or Cloudinary account configuration.
- Breadcrumb on pages other than collection (`/[username]/[collectionSlug]`) and item detail (`/[username]/[collectionSlug]/[slug]`).
- Redesigning or restructuring the ThemeToggle component beyond the border fix.
- Adding new structured data types beyond BreadcrumbList.

---

## Acceptance Criteria

1. **ThemeToggle**: When rendered in both light and dark mode, the ThemeToggle button has no visible border. Hover and focus states remain functional.
2. **ThemeToggle**: If the Button `ghost` variant is used, there is no duplicate CSS for the ThemeToggle button's base appearance.
3. **Images**: Collection item images in the collection grid, item cards, and Last Arrivals section are served via Cloudinary URLs that include size transformation parameters appropriate to the display context.
4. **Images**: LCP-relevant images (above-the-fold, `loading="eager"`) use transformation parameters that avoid downloading oversized images.
5. **Breadcrumb (Collection page)**: The breadcrumb displays the collection's human-readable `name` instead of `collectionSlug`.
6. **Breadcrumb (Item detail page)**: The breadcrumb displays both the collection's `name` and the item's `name` instead of their slugs.
7. **Breadcrumb SEO**: Both collection and item detail pages include a valid `BreadcrumbList` JSON-LD block in the `<head>` that reflects the displayed breadcrumb trail with correct `name` and `id` (URL) values.
8. **Last Arrivals**: Clicking a card in Last Arrivals navigates to the individual item page (`/{username}/{collectionSlug}/{itemSlug}`), not the collection page.

---

## Open Questions

_None. All requirements are clearly defined based on codebase findings and user description._
