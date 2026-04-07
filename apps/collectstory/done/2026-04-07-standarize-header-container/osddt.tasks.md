---
title: Task List — Standardize Header, Container Layout & UX Fixes
feature: standarize-header-container
status: in-progress
date: 2026-04-07
---

# Task List: Standardize Header, Container Layout & UX Fixes

## Phase 1 — Shared Container Utility

> **Depends on**: nothing — start here.

- [x] [S] Add `.container` utility class to `app/globals.css` (max-width 1200px, margin-inline auto, responsive padding-inline)
- [x] [S] Remove duplicated max-width/padding/margin from `SiteHeader.module.css` `.inner` — apply `container` class in `SiteHeader.tsx` instead
- [x] [S] Apply `.container` to `app/collection/layout.module.css` `.headerInner` and `.main`
- [x] [S] Apply `.container` to `app/admin/layout.module.css` `.headerInner` and `.main`
- [x] [S] Apply `.container` to `app/stores/page.module.css` main content wrapper
- [x] [S] Audit remaining pages (`app/[username]/`, `app/[username]/[collectionSlug]/`, `app/franchises/`, `app/profile/edit/`) and apply `.container` where missing

**Definition of Done**: every page content area is constrained to 1200px with consistent horizontal padding at all breakpoints. No page has its own one-off max-width rule.

---

## Phase 2 — Unified `SiteHeader`

> **Depends on**: Phase 1 (container class available).

- [x] [S] Update `SiteHeader.module.css` `.inner` flex layout: brand left, nav centre (flex-grow), actions right — nav and actions are adjacent, not space-between
- [x] [M] Extend `SiteHeader.tsx`: add **Vault** nav link (`/<username>`) shown only when authenticated with a username
- [x] [S] Extend `SiteHeader.tsx`: replace plain Admin link with `<AdminMenu>` component (rendered only when `role === 'admin'`)
- [x] [M] Create `components/AdminMenu/AdminMenu.tsx` (`'use client'`) — dropdown with links to Brands, Lines, Categories, Stores, Franchises; closes on outside click / Escape; fully accessible (`aria-haspopup`, `aria-expanded`, `role="menu"`)
- [x] [S] Create `components/AdminMenu/AdminMenu.module.css` — dropdown positioning, animation, styles using design tokens
- [x] [M] Create `components/UserMenu/UserMenu.tsx` (`'use client'`) — avatar button triggers dropdown with Profile, Vault (if username set), and Sign Out items; closes on outside click / Escape; fully accessible
- [x] [S] Create `components/UserMenu/UserMenu.module.css` — dropdown positioning, animation, styles using design tokens
- [x] [S] Update `SiteHeader.tsx` actions area: replace plain avatar `<Link>` with `<UserMenu>` (passing `username`, `avatarUrl`, `email` as props)
- [x] [M] Update `app/collection/layout.tsx`: remove `CollectionHeader` and all its local imports; add `<Suspense><SiteHeader /></Suspense>`; clean up unused CSS rules from `layout.module.css` (keep `.shell`, `.main`)
- [x] [M] Update `app/admin/layout.tsx`: remove inline `<header>` block; add `<Suspense><SiteHeader /></Suspense>`; clean up unused CSS rules from `layout.module.css` (keep `.shell`, `.main`)
- [x] [S] Delete `components/SignOutButton.tsx` and `components/SignOutButton.module.css` (Sign Out now lives in `UserMenu`)
- [x] [S] Verify `app/page.tsx` and `app/stores/page.tsx` — confirm `<SiteHeader />` renders correctly with the new layout (no visual regression)

**Definition of Done**: all pages use one `SiteHeader`; nav shows Vault for logged-in users with a username, Admin submenu for admins; avatar opens a user menu with Profile, Vault, and Sign Out; no bespoke headers remain.

---

## Phase 3 — Hero CTA Logic

> **Depends on**: Phase 2 (`SiteHeader` stable, `HomeCTA` pattern understood).

- [x] [S] Update `components/landing/Hero.tsx`: remove the second CTA button (outline "Stores" link); replace the primary CTA `<Link>` with `<HomeCTA primaryClassName={styles.ctaPrimary} />`
- [x] [S] Update `components/HomeCta.tsx`: set unauthenticated label to `"Start Your Collection"` and authenticated label to `"Explore Vault"`; confirm redirect logic points to `/<username>` (authenticated) or `/login` (unauthenticated)
- [x] [S] Remove `.ctaSecondary` from `components/landing/Hero.module.css` if it becomes unused
- [x] [S] Update `lib/mock-data` `heroData` if `ctaSecondary` is referenced — remove or mark unused

**Definition of Done**: visiting the home page while logged out shows only "Start Your Collection"; visiting while logged in shows only "Explore Vault" linking to `/<username>`. Never both at once.

---

## Phase 4 — Image Field: Paste & HEIC Support

> **Depends on**: Phase 1 (no hard dependency, but Phase 2+ should be stable first).

- [x] [S] Add `heic2any` dependency to `apps/collectstory/package.json` (exact version, no `^`)
- [x] [M] Extract shared `processFile(file: File)` function inside `components/admin/ImageField.tsx` — consolidate validation logic used by both file-picker and paste paths
- [x] [M] Add HEIC/HEIF support to `ImageField`: expand `ALLOWED_TYPES`, lazy-import `heic2any` on HEIC/HEIF selection, convert to JPEG Blob before preview/upload; handle array-vs-single Blob result; update `accept` attribute and hint text
- [x] [M] Add paste support to `ImageField` upload area: add `tabIndex={0}` and `onPaste` handler to the upload area div; extract pasted image file and pass through `processFile`; add focus/paste-ready visual style in `ImageField.module.css`
- [x] [S] Check `components/UpdateImageForm/UpdateImageForm.tsx` — if it has its own file input (not using `ImageField`), apply the same HEIC + paste changes there

**Definition of Done**: a user can paste an image from clipboard into the upload area; selecting a `.heic`/`.heif` file shows a preview without error; the initial JS bundle has no HEIC library code until a HEIC file is selected.

---

## Phase 5 — Favicon

> **Depends on**: nothing — can be done any time.

- [x] [S] Locate the Shelves icon SVG source in `@dezkareid/icons` package
- [x] [S] Create `apps/collectstory/public/favicon.svg` — copy SVG markup; ensure fill uses a neutral color or `currentColor` suitable for browser tab display
- [x] [S] Add `icons: { icon: '/favicon.svg' }` to the `metadata` export in `app/layout.tsx`

**Definition of Done**: the Shelves icon appears in the browser tab on all pages.

---

## Phase 6 — Login Page: Google Only

> **Depends on**: nothing — fully isolated.

- [x] [S] Remove `handleFacebook` and `handleX` inline server actions from `app/login/page.tsx`
- [x] [S] Remove the Facebook and X `<form>` / `<button>` blocks from `app/login/page.tsx`
- [x] [S] Delete `signInWithFacebook` and `signInWithX` exports from `app/login/actions.ts`

**Definition of Done**: the login page shows only the "Continue with Google" button; no Facebook or X options are present.

---

## Dependencies Summary

```
Phase 1 (container) → Phase 2 (header) → Phase 3 (hero CTA)
Phase 4 (image field)  — independent, after Phase 2 is stable
Phase 5 (favicon)      — fully independent
Phase 6 (login)        — fully independent
```
