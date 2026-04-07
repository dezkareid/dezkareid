---
title: Implementation Plan — Standardize Header, Container Layout & UX Fixes
feature: standarize-header-container
status: draft
date: 2026-04-07
---

# Implementation Plan: Standardize Header, Container Layout & UX Fixes

## Architecture Overview

### Key Design Decisions

1. **Single `SiteHeader` Server Component** — The existing `SiteHeader` is already an async Server Component that fetches session + profile data. It will be extended to include the Vault and Admin nav links, then adopted by all layouts. The `CollectionHeader` in `app/collection/layout.tsx` and the inline header in `app/admin/layout.tsx` will be removed.

2. **Nav layout change** — The header inner currently uses `justify-content: space-between` which puts brand on the left and actions on the right with nav floating. The layout will change to: `[Brand] [Nav (flex-grow)]  [Actions]` so nav sits beside the actions group.

3. **Admin submenu** — A new `AdminMenu` client component will render the admin sub-navigation (Brands, Lines, Categories, Stores, Franchises) as a dropdown/submenu triggered from the "Admin" nav link. Because this is interactive, it requires `'use client'`. It is only rendered inside `SiteHeader` when `role === 'admin'`.

4. **Shared page container** — A `.container` CSS utility class will be added to `app/globals.css` providing `max-width: 1200px`, `margin: 0 auto`, and consistent horizontal padding. All page `<main>` wrappers will use this class instead of duplicating the values.

5. **CLS fix** — The current `SiteHeader` uses `await connection()` which opts the entire page into dynamic rendering. The header is already inside `<Suspense>` on every page, so the shell is static and only the header slot streams in. No layout shift occurs because the header has a fixed height (`position: sticky`, fixed padding). No further changes needed for CLS beyond keeping the current pattern.

6. **Hero CTA** — `Hero` is a static Server Component. Auth state is not available server-side on a `force-static` page. The existing `HomeCTA` client component already handles the auth-aware redirect. The two CTA buttons will be collapsed into one: `HomeCTA` renders the single correct CTA, and the second static "Stores" button in Hero is removed.

7. **HEIC support** — `heic2any` will be dynamically imported (`import('heic2any')`) inside `handleFileChange` only when `file.type === 'image/heic' || file.type === 'image/heif'`. The converted `Blob` is treated as a JPEG for all subsequent validation and preview steps.

8. **Favicon** — The Shelves icon SVG source from `@dezkareid/icons` will be copied/exported as `public/favicon.svg`. The root layout `metadata` will reference it via `icons`.

9. **Login page — Google only** — The Facebook and X server actions and their form buttons are removed from `app/login/page.tsx`. The `signInWithFacebook` and `signInWithX` actions in `app/login/actions.ts` are deleted.

---

## Implementation Phases

### Phase 1 — Shared Container Utility

**Goal**: Establish the reusable container class so all subsequent phases can use it.

**Steps**:
1. Add a `.container` class to `app/globals.css`:
   ```css
   .container {
     max-width: 1200px;
     margin-inline: auto;
     padding-inline: var(--spacing-24);
   }
   @media (min-width: 60rem) {
     .container {
       padding-inline: var(--spacing-48);
     }
   }
   ```
2. Update `SiteHeader.module.css` — remove the duplicated max-width/padding/margin from `.inner` (it now uses the global `.container` class on the `<div>`).
3. Update `app/collection/layout.module.css` — `.headerInner` references the same container pattern (or adopts `.container`).
4. Update `app/admin/layout.module.css` — same as above.
5. Apply `.container` to the `<main>` wrappers in: `app/stores/page.module.css`, `app/[username]/page.module.css`, `app/collection/page.module.css`, `app/admin/page.module.css`, and any other pages missing it.

---

### Phase 2 — Unified `SiteHeader`

**Goal**: One header component used on all pages, with correct nav links per auth state.

**Steps**:
1. **Extend `SiteHeader`** (`components/SiteHeader.tsx`):
   - Change inner layout from `justify-content: space-between` to flex with `gap` so nav is adjacent to actions: `[Brand] [Nav flex-1] [Actions]`.
   - Add **Vault** link in `<nav>`: render `<Link href={`/${profile.username}`}>Vault</Link>` when `session && profile?.username`.
   - Add **Admin** link (or `AdminMenu`) in `<nav>`: render when `session?.role === 'admin'`.
   - Update `SiteHeader.module.css` accordingly (inner flex layout).

2. **Create `AdminMenu` client component** (`components/AdminMenu/AdminMenu.tsx`):
   - `'use client'` dropdown triggered by clicking "Admin".
   - Links: Brands `/admin/brands`, Lines `/admin/lines`, Categories `/admin/categories`, Stores `/admin/stores`, Franchises `/admin/franchises`.
   - Closes on outside click or Escape key.
   - Accessible: `aria-haspopup="menu"`, `aria-expanded`, `role="menu"` on the list.

3. **Create `UserMenu` client component** (`components/UserMenu/UserMenu.tsx`):
   - `'use client'` dropdown triggered by clicking the avatar button.
   - Receives `username`, `avatarUrl`, and `email` as props (passed down from the `SiteHeader` server component).
   - Menu items:
     - **Profile** → `/profile/edit`
     - **Vault** → `/<username>` (only shown when `username` is set)
     - **Sign Out** — calls the `signOut` server action (same action used by the existing `SignOutButton`)
   - Replaces the current plain avatar link in `SiteHeader`.
   - Closes on outside click or Escape key.
   - Accessible: `aria-haspopup="menu"`, `aria-expanded`, `role="menu"` on the list.

4. **Update `app/collection/layout.tsx`**:
   - Remove `CollectionHeader` async function and all its imports (`getUserProfile`, `AvatarDisplay`, `SignOutButton` usage in header).
   - Replace with `<Suspense><SiteHeader /></Suspense>`.
   - The `SignOutButton` standalone component can be removed if Sign Out is now exclusively in `UserMenu`.
   - Remove `layout.module.css` header/headerInner/brand/nav/profileLink/avatar/avatarFallback/profileLinkLabel rules (keep `.shell` and `.main`).

4. **Update `app/admin/layout.tsx`**:
   - Remove the inline `<header>` block and its nav links / backLink.
   - Add `<Suspense><SiteHeader /></Suspense>` at the top of the layout shell.
   - Remove `layout.module.css` header/headerInner/brand/nav/navLink/backLink rules (keep `.shell` and `.main`).

5. **Verify `app/page.tsx` and `app/stores/page.tsx`** already use `<SiteHeader />` — no change needed there.

---

### Phase 3 — Hero CTA Logic

**Goal**: Show exactly one CTA in the hero based on auth state.

**Steps**:
1. **Update `components/landing/Hero.tsx`**:
   - Remove the second `<Link>` / `<Button>` (the "Stores" outline CTA).
   - Replace the primary CTA `<Link href="/login">` with `<HomeCTA primaryClassName={styles.ctaPrimary} />`.
   - `HomeCTA` already handles the unauthenticated → `/login` and authenticated → `/<username>` logic.

2. **Update `HomeCTA` labels** (`components/HomeCta.tsx`):
   - Unauthenticated default label: `"Start Your Collection"` (keep as-is or update to match `heroData.ctaPrimary.label`).
   - Authenticated label: `"Explore Vault"`.

3. **Update `Hero.module.css`**: remove `.ctaSecondary` if it becomes unused.

4. **Update `lib/mock-data`** if `heroData.ctaPrimary.label` / `heroData.ctaSecondary` need to reflect the new single-CTA approach.

---

### Phase 4 — Image Field: Paste & HEIC Support

**Goal**: Users can paste images and select iPhone HEIC photos in any `ImageField`.

**Steps**:
1. **Add `heic2any` dependency**:
   ```
   pnpm add heic2any@0.0.4 --filter @dezkareid/collectstory
   pnpm add -D @types/heic2any@... --filter @dezkareid/collectstory
   ```
   Use exact version. Check npm for the latest stable.

2. **Update `components/admin/ImageField.tsx`**:

   a. **HEIC support** — in `handleFileChange`:
      - Expand `ALLOWED_TYPES` to include `'image/heic'` and `'image/heif'`.
      - After type check passes, if `file.type === 'image/heic' || file.type === 'image/heif'`:
        - Dynamically import `heic2any`: `const heic2any = (await import('heic2any')).default`
        - Convert: `const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 })`
        - Use the resulting `Blob` (which is always a single Blob, not array, when `multiple` is not set) for preview and upload.
      - Update `accept` attribute: `"image/jpeg,image/png,image/webp,image/heic,image/heif"`.
      - Update hint text: `"JPEG, PNG, WebP or HEIC · max 5 MB"`.

   b. **Paste support** — add `onPaste` handler to the `.uploadArea` div:
      - `tabIndex={0}` on the upload area div so it can receive keyboard/paste events.
      - `onPaste` reads `event.clipboardData.items`, finds the first `item.kind === 'file' && item.type.startsWith('image/')`.
      - Passes the resulting `File` through the same validation logic as `handleFileChange` (extract into a shared `processFile(file)` function).
      - Visually indicate the area is paste-ready: add focus styles to the upload area in CSS.

3. **Extract shared `processFile` function** inside `ImageField` to avoid duplicating validation between file-picker and paste paths.

4. **Consider `UpdateImageForm`** (`components/UpdateImageForm/UpdateImageForm.tsx`) — check if it also uses `ImageField` or has its own file input. If it has its own, apply the same HEIC + paste changes there.

---

### Phase 5 — Favicon

**Goal**: Browser tab shows the Shelves icon as a favicon.

**Steps**:
1. Locate the SVG source for the Shelves icon in `@dezkareid/icons` (check `packages/icons` or wherever it's published from).
2. Copy the raw SVG markup into `apps/collectstory/public/favicon.svg`.
   - Ensure the SVG has no hardcoded fill colors that clash with the browser tab background; use `currentColor` or a neutral dark fill that works in both light and dark contexts.
3. Update `app/layout.tsx` — add `icons` to the `metadata` export:
   ```ts
   export const metadata: Metadata = {
     ...
     icons: { icon: '/favicon.svg' },
   };
   ```

---

### Phase 6 — Login Page: Google Only

**Goal**: Remove Facebook and X sign-in options.

**Steps**:
1. **`app/login/page.tsx`**: Remove the `<form>` blocks for Facebook and X, and their corresponding `handleFacebook` / `handleX` inline server actions.
2. **`app/login/actions.ts`**: Delete `signInWithFacebook` and `signInWithX` exports.
3. Update button label if needed (e.g. "Continue with Google" stays).

---

## Technical Dependencies

| Dependency | Purpose | Notes |
|---|---|---|
| `heic2any` | Client-side HEIC → JPEG conversion | Lazy-loaded only on HEIC file selection; ~500KB WASM |
| `@dezkareid/icons` | SVG source for favicon | Already a workspace dependency |
| Next.js 16 App Router | All routing and layouts | Already in use |
| Supabase SSR | Auth session in Server Components | Already in use |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `heic2any` WASM fails to load on some browsers | Low | Show a user-friendly error via `onFileError` if conversion throws |
| Clipboard paste API not available (non-HTTPS, older browser) | Low | Wrap paste handler in `try/catch`; file picker remains the primary path |
| Admin submenu causes CLS or re-render flash | Low | `AdminMenu` is client-side and renders conditionally — no async data involved |
| Removing `CollectionHeader` breaks `SignOutButton` placement | Resolved | Sign Out moves into `UserMenu` dropdown — `SignOutButton` standalone component can be deleted |
| `heic2any` returns an array of Blobs for multi-frame HEIC | Low | Use `Array.isArray(result) ? result[0] : result` to always get a single Blob |

---

## Out of Scope

- Mobile hamburger / drawer navigation
- Redesigning the hero section visually beyond the single-CTA change
- Server-side HEIC conversion
- `.ico` favicon fallback
- Adding new admin entity types or restructuring admin routes
- Session management or auth provider changes beyond removing Facebook/X buttons
