# Feature Specification: Improve UI Design and Error Handling

## Overview

This feature addresses two interconnected concerns in the Collecstory application:

1. **UI/UX improvements** to the Home page (`/`) and the Collector main page (`/collection`) — focused on usability, performance, and accessibility.
2. **Store data model redesign** — stores are currently a standalone admin-managed directory unrelated to collection items. They need to be repositioned as a property of collection items (where an item can be acquired at one or more stores), and stores must gain a `verified` field to distinguish admin-validated stores from user-submitted ones.

These changes improve the core collector experience, reduce misleading surface area on high-traffic pages, and lay the groundwork for richer item provenance tracking.

---

## Business Context

### Alignment with Company Outcomes

| Outcome | Relevance |
|---|---|
| **Expand Collecstory user base by 50%** | A faster, more accessible, and better-structured home page reduces bounce rates and improves organic discoverability. |
| **High-Quality User Experience** | The UI improvements directly target the "High Quality" performance rating and 100% accessibility compliance key results. |
| **Operational Excellence** | Better error handling reduces confusion and support burden, contributing to faster issue resolution. |
| **Efficiency & Velocity** | Aligning the store model with item-level data removes an inconsistent pattern and simplifies future feature development. |

### Alignment with Architecture Principles

- **Simplicity over Complexity**: Removing stores from the home page simplifies the information hierarchy and avoids surfacing unrelated data.
- **Performance-First Design**: Eliminating unnecessary data fetches (stores on home page) and optimizing UI rendering directly supports this principle.
- **Universal Accessibility**: Accessibility improvements are a baseline requirement, not an enhancement.
- **Integrity and Auditability**: The `verified` flag on stores provides a clear audit signal distinguishing trusted from user-submitted store data.

---

## Requirements

### Mobile-First Responsive Experience

The mobile experience is a primary concern across all pages. The application must be fully usable on small screens without requiring a desktop browser:

1. All layouts must be designed mobile-first, then progressively enhanced for wider viewports.
2. Touch targets (buttons, links, interactive controls) must be at least 44×44px to meet WCAG 2.5.5.
3. The navigation header must collapse or adapt gracefully on viewports below 768px.
4. Modals and overlays must be fully usable on mobile — no content cut off, scrollable when tall, closeable without a keyboard.
5. Font sizes must remain legible on small screens without requiring zoom (minimum 16px for body text).
6. Horizontal scrolling must not occur unintentionally on any page at any viewport width.

### Home Page (`/`)

1. The home page must not display store-related content, sections, or calls-to-action (e.g., "Stores Directory" feature card).
2. The home page must load with a "High Quality" Lighthouse performance score on mobile and desktop.
3. All interactive elements (buttons, links, navigation) must be keyboard-navigable and have visible focus indicators.
4. All images must have meaningful `alt` text; decorative images must use `alt=""`.
5. The page must meet WCAG 2.2 AA contrast ratios for all text and UI elements.
6. The hero and feature sections must be legible and functional at viewport widths from 320px to 1440px+.
7. Headings must follow a logical hierarchy (one `h1`, sequential `h2`/`h3`).

### Collector Main Page (`/collection`)

1. The collection page must not display store information at the item-card level or in any summary/filter UI.
2. The page must load its initial above-the-fold content quickly; non-critical sections (e.g., full grid) may load progressively via streaming.
3. All interactive controls (add item button, cards, modals) must be keyboard-accessible with logical tab order.
4. Empty states must be clearly communicated with a descriptive message and a visible action to add a first item.
5. Error states (failed data fetch, failed item creation, failed image upload) must present a human-readable, actionable message — not a raw error or silent failure.
6. The item grid must be legible and usable on mobile viewports (≥320px), with cards stacking to a single column on small screens.
7. ARIA roles and labels must be correctly applied to dynamic regions (modals, live regions for async updates).

### Store Data Model

1. A store must be associable with one or more collection items (many-to-many: an item can be acquired at multiple stores).
2. Store associations with items are managed exclusively by admin users. Collectors cannot create, edit, or delete stores.
3. A store must have a `verified` boolean field (default: `false`).
4. Admin users can mark a store as verified (`verified = true`) and manage store–item associations.
5. Verified and unverified stores must be visually distinguishable when displayed in item context (e.g., a badge or indicator).
6. On the item detail page, stores are displayed in a "Where to find it" section above user links. This positioning is intentional — stores are the monetization anchor for future releases.
7. The public `/stores` directory page is out of scope for UI changes in this feature but must continue to function without regression.

### Item Links

1. A collector can add one or more links to any of their collection items. Links represent external URLs where the item can be found (e.g., marketplace listings, retailer pages).
2. Each link has a URL and an optional display label.
3. Only the item's owner can create or delete their item's links. Links are not shared globally — they are scoped to the item.
4. Links are displayed below stores in the "Where to find it" section of the item detail page.
5. There is no admin-level management of user links (no moderation, no soft-delete by admin).

### Error Handling (General)

1. All server action failures (item creation, image upload) must surface a user-readable error message in the UI — no silent failures.
2. Network or connectivity errors must be caught and presented with a retry affordance where appropriate.
3. Form field validation errors must be associated with their respective fields (not only shown as a global message).
4. Error messages must use `role="alert"` or equivalent live region so screen readers announce them.

---

## Scope

### In Scope

- Home page UI: remove stores section, fix accessibility issues, improve performance (remove unused fetches, optimize rendering)
- Collection page UI: accessibility fixes, responsive improvements, error state polish
- Store–item association: new many-to-many relationship, admin-managed store links per item
- `verified` field on stores: data model addition + admin toggle + visual indicator in item context
- Item links: user-managed external URLs per item (add/delete), displayed below stores in item detail
- Error handling improvements across home and collection pages

### Out of Scope

- Public `/stores` directory page redesign
- Full redesign of the add/edit item form (only store-association UX is added)
- Admin stores management page changes (beyond adding the `verified` toggle)
- Profile page or public `[username]` page changes
- Push notifications or email error reporting
- Internationalization

---

## Acceptance Criteria

### Mobile Responsiveness

- [ ] All pages are fully usable on a 375px viewport (iPhone SE) without horizontal scrolling.
- [ ] All touch targets are at least 44×44px.
- [ ] Modals are scrollable and fully visible on mobile without content being cut off.
- [ ] Body text is at least 16px on all viewports.
- [ ] The collection item grid collapses to a single column on viewports below 480px.
- [ ] Lighthouse mobile performance score ≥ 90 on the home page and collection page.

### Home Page

- [ ] The "Stores Directory" feature card (or any store mention) is absent from the home page.
- [ ] Lighthouse accessibility score ≥ 90 on the home page.
- [ ] Lighthouse performance score ≥ 90 on the home page (mobile).
- [ ] All focusable elements have a visible focus ring.
- [ ] Page passes automated WCAG 2.2 AA contrast checks.
- [ ] No heading hierarchy violations (validated by axe or equivalent).

### Collection Page

- [ ] No store-related data or UI is shown on the collection main page.
- [ ] Empty state is shown when the user has no items, with a clear CTA.
- [ ] A failed item creation shows an inline error message; the form remains open and filled.
- [ ] A failed image upload shows a specific, actionable error message below the upload field.
- [ ] Collection page passes Lighthouse accessibility score ≥ 90.
- [ ] All modal interactions are keyboard-accessible (open, navigate fields, close with Escape).
- [ ] ARIA live regions announce async state changes (loading, success, error).

### Store Model

- [ ] A collection item can be linked to zero, one, or many stores.
- [ ] Only admins can create stores, edit store details, and manage store–item associations.
- [ ] Admin can toggle `verified` on any store.
- [ ] In the item detail view, verified stores display a distinct visual indicator compared to unverified ones.
- [ ] Stores are displayed above user links in the "Where to find it" section of the item detail page.
- [ ] Existing items and the `/stores` page are unaffected by regressions.

### Item Links

- [ ] A collector can add a link (URL + optional label) to any item they own.
- [ ] A collector can delete their own item links.
- [ ] Item links are displayed below stores in the "Where to find it" section of the item detail page.
- [ ] Invalid URLs are rejected with a field-level error message.
- [ ] Links are scoped to the item owner — other users cannot see or manage them.

### Error Handling

- [ ] All server action errors surface a visible, readable message in the UI.
- [ ] Error messages are associated with the triggering field or action (not only global alerts).
- [ ] Error messages use `role="alert"` or live region so they are announced by screen readers.
- [ ] No raw error strings (e.g., Supabase error codes, stack traces) are exposed to end users.

---

## Decisions

1. **Store display on item cards**: Stores are shown only on the individual item detail page — not on the `CollectionItemCard` in the collection grid.
2. **Store management is admin-only**: Collectors cannot create, edit, or associate stores. The `ItemStoreManager` component is admin-only. Users interact only with their own item links.
3. **Verified indicator design**: Only verified stores display a visual indicator (a checkmark badge). Unverified stores show no indicator.
4. **Store ownership model**: Stores are shared globally — one store record per real-world store, referenced by multiple collectors. Admins manage the canonical store catalog.
5. **"Where to find it" section layout**: Stores always appear above user links. This ordering is intentional — stores represent curated/monetizable placements; links are user-generated supplemental content.
6. **Item links are private to the owner**: Other users visiting the public item detail page do not see the owner's links.
7. **Performance budget**: Lighthouse ≥ 90 is the target for both home and collection pages.
