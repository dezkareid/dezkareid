# Implementation Plan: Improve UX of Collection Item Page

**Feature:** `improve-ux-collection-item`
**Branch:** `feat/improve-ux-collection-item`
**Date:** 2026-04-09

---

## Architecture Overview

The collection item page (`app/[username]/[collectionSlug]/[slug]/`) is a Next.js App Router route using ISR. The page follows Feature-Sliced Design (FSD): routing lives in `app/`, new interactive UI slices go in `src/features/` or `src/shared/ui/`, business display components in `src/entities/`.

All four improvements are isolated changes to existing files plus two new FSD slices:

| Change | FSD placement | Files touched |
|---|---|---|
| Richer metadata (label/value pairs) | `app/.../[slug]/page.tsx` (inline component) | `page.tsx`, `page.module.css` |
| "Where to Find" modal | `src/shared/ui/modal/` (new generic shell) + `src/features/where-to-find/` (new feature slice) | New files; `page.tsx` updated |
| Image edit UX | `app/.../[slug]/ItemImageSection.tsx` | `ItemImageSection.tsx`, `page.module.css` |
| Share fix (remove Web Share API) | `src/features/social-share/ui/social-share.tsx` | `social-share.tsx`, `SocialShare.module.css` |

**Design system:** All styling uses CSS Modules + `@dezkareid/design-tokens` CSS custom properties per `DESIGN.md`. No hardcoded values.

**No backend changes.** All data is already fetched; this is purely a UI rework.

---

## Implementation Phases

### Phase 1 — Generic Modal Primitive (`src/shared/ui/modal/`)

**Goal:** Create a reusable, accessible modal shell usable by any feature. The "Where to Find" feature will consume it.

**Files to create:**
- `src/shared/ui/modal/Modal.tsx` — Client Component. Uses `<dialog>` HTML element with `showModal()` / `close()`. Handles Escape key (built-in to `<dialog>`), backdrop click via `::backdrop` click detection, focus trap, and `aria-labelledby`.
- `src/shared/ui/modal/Modal.module.css` — `<dialog>` styling: centered, max-width `540px`, `border-radius: var(--border-radius-large)`, `box-shadow: var(--shadow-card-hover)`, `padding: var(--spacing-32)`. Backdrop: semi-transparent dark overlay with fade-in animation.
- `src/shared/ui/modal/index.ts` — Public API: `export { Modal } from './Modal'`

**Props:**
```ts
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

**Accessibility:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` linked to title heading. Focus moves to first focusable element on open; returns to trigger on close.

---

### Phase 2 — "Where to Find" Feature Slice (`src/features/where-to-find/`)

**Goal:** Replace the inline `WhereToFindSection` component in `page.tsx` with a button that opens the modal.

**Files to create:**
- `src/features/where-to-find/ui/WhereToFindButton.tsx` — Client Component. Renders a `Button` (variant `"secondary"`, full width) labelled "Where to find". Manages `open` state. Renders `<Modal>` with `WhereToFindContent` inside.
- `src/features/where-to-find/ui/WhereToFindContent.tsx` — Server-renderable content (passed as children to modal): store list + `ItemLinksManager`. Receives same props as current `WhereToFindSection`.
- `src/features/where-to-find/ui/WhereToFind.module.css` — Button and modal content styles.
- `src/features/where-to-find/index.ts` — Public API: `export { WhereToFindButton } from './ui/WhereToFindButton'`

**Page changes (`page.tsx`):**
- Remove `WhereToFindSection` inline component definition.
- Replace `<WhereToFindSection ...>` usage in `ItemMeta` with `<WhereToFindButton ...>`.
- Pass `itemId`, `isOwner`, `linkedStores`, `initialLinks` as props.

**Visibility rule:** `WhereToFindButton` is only rendered when `linkedStores.length > 0 || initialLinks.length > 0 || isOwner` — matching AC-6.

---

### Phase 3 — Richer Metadata Display

**Goal:** Add a structured label/value metadata block below the tags and above the title.

**Component:** `ItemMetaDetails` — inline Server Component inside `page.tsx`.

**Fields to render (only when value is present):**

| Label | Value source |
|---|---|
| Brand | `item.lines?.brands?.name` |
| Line | `item.lines?.name` |
| Variant | `resolveVariantLabel(item)` |
| Category | `item.lines?.categories?.name` |
| Franchise | `item.franchises?.name` (linked to `/franchises/{slug}`) |

**CSS layout:** CSS Grid, two columns (`auto 1fr`), `row-gap: var(--spacing-8)`, `column-gap: var(--spacing-16)`. Labels: `font-size: var(--font-size-100)`, `font-weight: var(--font-weight-medium)`, `color: var(--color-text-secondary)`, `text-transform: uppercase`, `letter-spacing: 0.06em`. Values: `font-size: var(--font-size-300)`, `color: var(--color-text-primary)`.

**Placement in `ItemMeta`:** Inserted between `<ItemTags>` and the name/share row. Both `ItemTags` (the pill tags) and `ItemMetaDetails` (the label/value block) coexist — tags remain for quick scanning, the detail block provides labeled context.

**Page CSS additions:** Add `.metaDetails`, `.metaDetails__label`, `.metaDetails__value` classes to `page.module.css`.

---

### Phase 4 — Image Edit UX Improvement

**Goal:** Make `ItemImageSection.tsx` feel interactive with a clear edit mode overlay rather than a flat toggle.

**Changes to `ItemImageSection.tsx`:**
- When `editingImage === true`, apply an overlay state class to `imageWrapper` that adds a visual "edit mode" affordance: dim the current image with `opacity: 0.5` + a centered camera/edit icon overlay on top (using CSS `::after` or an absolutely positioned element).
- Move the "Replace image / Add image" trigger button to sit as an overlay on the image (bottom-center, `position: absolute`), styled as a pill button with background `var(--color-primary)`, icon + label. This makes the affordance obvious rather than a plain text button below.
- When `editingImage === true`: show `UpdateImageForm` in a panel below the image (current approach) but add a clearly styled "Cancel" button using `Button` component (`variant="ghost"`) from `@dezkareid/components/react` — replacing the bare `<button>` element.
- Success state: after `handleImageUpdated`, briefly set a `showSuccess` flag for 1.5s, display a brief "Image updated!" label below the image with `var(--color-success)` color, then clear it.

**CSS additions to `page.module.css`:**
- `.imageWrapper--editing` — modifier class: dims image + shows edit overlay ring (`outline: 2px solid var(--color-primary)`)
- `.imageOverlayButton` — absolute positioned pill on image (bottom center), primary bg, white text, icon + text
- `.imageSuccessFeedback` — small success label, `color: var(--color-success)`, `font-size: var(--font-size-200)`, fade-in/out

---

### Phase 5 — Fix Social Share (Remove Web Share API)

**Goal:** Always show the in-app dropdown regardless of device/browser. Remove the `canUseWebShare()` branch entirely.

**Changes to `src/features/social-share/ui/social-share.tsx`:**
- Remove the `canUseWebShare()` import and the native share branch (`if (canUseWebShare()) { return <Button onClick={handleNativeShare}> ... }`).
- Remove `handleNativeShare` function.
- Remove `shareUrl` import from `share-utilities` (only used for native share).
- The SSR fallback (returns ghost button before hydration) stays — it is needed to avoid hydration mismatch and renders correctly server-side.
- After hydration (`isClient === true`), always render the `DropdownMenu` with Twitter/X, Facebook, LinkedIn, and Copy Link.
- LinkedIn entry was already present in the dropdown — keep it (it was only hidden behind the native share branch on mobile).

**Changes to `src/shared/lib/share-utilities.ts`:** Remove or leave `shareUrl` / `canUseWebShare` exports — check if used elsewhere first; if only used here, remove them.

---

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| `<dialog>` HTML element | Native browser API | Well-supported; no library needed |
| `@dezkareid/components/react` `Button` | Already used | Use for image overlay trigger + cancel button |
| `@dezkareid/icons/react` | Already used | Add camera/edit icon for image overlay if available; fallback to text-only |
| `src/shared/ui/dropdown-menu` | Already used by SocialShare | No change needed |
| `ItemLinksManager` (legacy `components/`) | Already used | Stays in legacy location; consumed inside `WhereToFindContent` |
| `VerifiedBadge` (legacy `components/`) | Already used | Moves inside `WhereToFindContent` |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `<dialog>` focus trap behaviour varies across browsers | Low | Test on Chrome, Firefox, Safari. Add manual focus management fallback if needed. |
| `item_links` table may not exist in the database yet (flagged in codebase exploration) | Medium | `WhereToFindContent` already handles empty `initialLinks` gracefully; if the table is missing, Supabase query returns error — handle with `?? []` guard (already in place in `page.tsx`). |
| Removing Web Share API on mobile may feel less native | Low | Decision confirmed by user. The in-app dropdown is the intended UX. |
| Image overlay button position on very small screens | Low | Use `min-width` media query fallback; ensure button is always visible and tappable (min 44px touch target). |
| `canUseWebShare` / `shareUrl` used elsewhere | Low | Grep before deleting; if used by other features, leave the export and just stop calling it from `SocialShare`. |

---

## File Change Summary

### New files
- `src/shared/ui/modal/Modal.tsx`
- `src/shared/ui/modal/Modal.module.css`
- `src/shared/ui/modal/index.ts`
- `src/features/where-to-find/ui/WhereToFindButton.tsx`
- `src/features/where-to-find/ui/WhereToFindContent.tsx`
- `src/features/where-to-find/ui/WhereToFind.module.css`
- `src/features/where-to-find/index.ts`

### Modified files
- `app/[username]/[collectionSlug]/[slug]/page.tsx` — remove `WhereToFindSection`, add `ItemMetaDetails`, use `WhereToFindButton`
- `app/[username]/[collectionSlug]/[slug]/page.module.css` — add metadata and image overlay styles
- `app/[username]/[collectionSlug]/[slug]/ItemImageSection.tsx` — edit mode overlay, overlay button, success feedback, use `Button` component
- `src/features/social-share/ui/social-share.tsx` — remove Web Share API branch
- `src/shared/lib/share-utilities.ts` — remove unused exports (conditional on grep result)

---

## Out of Scope

- Any changes to item metadata editing (name, description, date, variant)
- Store management (adding/removing stores from an item)
- Collection list or collection detail pages
- Backend / database schema changes
- LinkedIn removal (it stays in the dropdown — it was already implemented)
- Storybook stories for new components (desired but not part of this feature)
