---
title: Standardize Header, Container Layout & UX Fixes
feature: standarize-header-container
status: draft
date: 2026-04-07
---

# Spec: Standardize Header, Container Layout & UX Fixes

## Overview

Collectstory currently has three different header implementations: the public `SiteHeader` used on the home and stores pages, a custom `CollectionHeader` inside the authenticated collection layout, and a separate admin header in the admin layout. Container widths and padding are also inconsistent across pages — some use a max-width constraint, others do not.

Additionally, several UX issues need fixing: the hero section shows two CTAs regardless of auth state, the "Explore vault" link doesn't navigate to the user's actual vault, image fields in forms don't support paste or HEIC/iPhone photos, and the site has no favicon.

This feature standardizes the header across all pages, enforces a consistent max-width page container, and resolves the UX issues described above.

## Business Context

This feature aligns with the following company outcomes and architecture principles:

- **High-Quality User Experience** — fixing CLS, inconsistent layouts, and broken CTAs directly contributes to achieving a "High Quality" performance rating on core user devices.
- **Innovation & Growth** — a polished, consistent UI supports organic discoverability and user retention, contributing to the 50% user-base growth target for Collectstory.
- **Efficiency & Velocity** — standardizing header and container patterns is exactly the kind of common design pattern standardization that increases delivery velocity by 20%.
- **Simplicity over Complexity** (Architecture Principle) — replacing three divergent header implementations with one shared component reduces maintenance surface.
- **Performance-First Design** (Architecture Principle) — fixing CLS is a direct performance improvement aligned with the principle that performance must be considered in every architectural decision.

## Requirements

### 1. Unified Site Header

- The `SiteHeader` component must be used on **all** public and authenticated pages — replacing the bespoke `CollectionHeader` in the collection layout and the inline header in the admin layout.
- The header layout must follow: **[Logo/Brand] — [Main Nav] — [Actions]**, where the main navigation sits between the brand and the action area (not separated to opposite ends).
- The main navigation must contain:
  - **Vault** link → `/<username>` (only shown when the user is authenticated and has a username)
  - **Admin** link → `/admin` (only shown when the user's role is `admin`)
- The actions area must contain:
  - Theme toggle
  - **User menu** (when authenticated): avatar button that opens a dropdown with "Profile" (→ `/profile/edit`), "Vault" (→ `/<username>`, if set), and "Sign Out"
  - Sign In button (when unauthenticated)
- The header must not produce CLS. Any async data (session, username) must be resolved server-side or use a stable reserved layout so no layout shift occurs on load.

### 2. Consistent Page Container

- Every page must have a shared max-width constraint for its content area (matching the current `1200px` used in the header inner).
- Container padding must be consistent across all pages at all breakpoints.
- The admin layout and collection layout must use the same container token/class as the rest of the app.

### 3. Hero CTA Logic

- The hero section must show **only one CTA** at a time, determined by auth state:
  - **Unauthenticated**: show "Start Your Collection" → `/login`
  - **Authenticated**: show "Explore Vault" → `/<username>` (falls back to `/collection` if no username is set yet)
- Both CTAs must never appear simultaneously.

### 4. Image Field: Paste Support

- In the upload mode of the `ImageField` component (and any equivalent image upload UI), users must be able to paste an image from the clipboard (`Ctrl+V` / `Cmd+V`) directly into the upload area.
- Pasted images must go through the same validation (type, size) as file-picker uploads.
- The paste target must be clearly indicated (e.g., the upload area responds visually to focus/hover).

### 5. Image Field: HEIC / iPhone Photo Support

- The `ImageField` upload mode must accept HEIC and HEIF files (the default format for iPhone photos).
- HEIC/HEIF files must be converted to JPEG in the browser before upload using a lazily-loaded conversion library (e.g. `heic2any`) — the library is only loaded when the user actually selects a HEIC/HEIF file, keeping the initial bundle cost at zero.
- The file-picker `accept` attribute and validation logic must be updated to include `image/heic` and `image/heif`.
- The hint text in the upload area must reflect the updated accepted formats.

### 6. Favicon

- The site must have a favicon visible in browser tabs and bookmarks.
- The favicon must use the existing Shelves icon (already used as the header brand icon) as the source image.
- A `favicon.svg` must be placed in the `public/` directory and referenced in the root layout metadata. No `.ico` fallback is needed.

## Scope

### In Scope

- Refactoring `SiteHeader` to support authenticated nav links (Vault, Admin) server-side
- Removing the bespoke `CollectionHeader` from `app/collection/layout.tsx` and replacing it with `SiteHeader`
- Removing the inline header from `app/admin/layout.tsx` and replacing it with `SiteHeader`
- Adding an Admin submenu (Brands, Lines, Categories, Stores, Franchises) accessible from the "Admin" nav link in `SiteHeader`
- Adding a shared container utility (CSS class or layout wrapper) with max-width and consistent padding
- Applying the container to all page layouts
- Updating `Hero` component CTA logic to be auth-aware (single CTA)
- Adding clipboard paste support to `ImageField` (upload mode)
- Adding HEIC/HEIF support to `ImageField` (upload mode) with client-side conversion
- Adding a favicon using the Shelves icon (SVG only)
- Restricting the login page to Google as the only sign-in method (removing Facebook and X)

### Out of Scope

- Mobile navigation / hamburger menu (the existing mobile nav hide behavior is unchanged)
- Redesigning the hero section beyond the CTA logic change
- Adding new admin nav links or restructuring the admin section
- Changing the sign-out flow or session management
- Server-side HEIC conversion (conversion is client-side only)

## Acceptance Criteria

1. **Header consistency**: Navigating to `/`, `/stores`, `/[username]`, `/collection`, and `/admin` all render the same `SiteHeader` component with the same visual structure.
2. **Nav link — Vault**: When signed in with a username, the main nav shows a "Vault" link that navigates to `/<username>`. When not signed in, the link is absent.
3. **Nav link — Admin**: When signed in as admin, the main nav shows an "Admin" link. For non-admin users and guests, the link is absent.
4. **No CLS**: Loading the home page or any page with the header shows no visible layout shift from the header area during or after hydration (measurable via Lighthouse or DevTools CLS metric).
5. **Container max-width**: All pages constrain their content to the same max-width (1200px) with consistent horizontal padding at all breakpoints.
6. **Hero — single CTA (unauthenticated)**: Visiting the home page while logged out shows only the "Start Your Collection" CTA, not the vault CTA.
7. **Hero — single CTA (authenticated)**: Visiting the home page while logged in shows only an "Explore Vault" CTA that links to `/<username>` (or `/collection` as fallback). The "Start Your Collection" CTA is absent.
8. **Image paste**: In the upload mode of any `ImageField`, pressing `Ctrl+V` / `Cmd+V` with an image on the clipboard adds it as the selected file, triggering preview and validation.
9. **HEIC upload**: Selecting a `.heic` or `.heif` file from an iPhone or the file picker in any `ImageField` upload area converts it to a web-compatible format and shows a preview without an error.
10. **Favicon**: The site displays a favicon (Shelves icon) in the browser tab on all pages.

## Decisions

1. **Vault nav label**: Use the generic label "Vault".
2. **Header on login page**: Keep the login page full-screen without a header. Also, Google is the only sign-in method — remove Facebook and X.
3. **HEIC conversion library**: Use `heic2any` (or equivalent), loaded lazily only when a HEIC/HEIF file is selected.
4. **Favicon format**: SVG only — no `.ico` fallback needed.
5. **Admin sub-nav**: The admin section links (Brands, Lines, Categories, Stores, Franchises) become a submenu accessible from the "Admin" nav link in `SiteHeader`.
