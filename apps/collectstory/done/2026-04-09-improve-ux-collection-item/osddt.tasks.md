# Tasks: Improve UX of Collection Item Page

**Feature:** `improve-ux-collection-item`
**Branch:** `feat/improve-ux-collection-item`
**Date:** 2026-04-09

---

## Phase 1 — Generic Modal Primitive

**Goal:** Reusable accessible modal shell (`<dialog>`-based) for use by any feature.

- [x] [S] Create `src/shared/ui/modal/Modal.tsx` — Client Component using native `<dialog>` with `showModal()` / `close()`, backdrop click detection, `aria-modal`, `aria-labelledby`, focus management
- [x] [S] Create `src/shared/ui/modal/Modal.module.css` — centered dialog, `border-radius: var(--border-radius-large)`, `box-shadow: var(--shadow-card-hover)`, `padding: var(--spacing-32)`, semi-transparent backdrop with fade-in
- [x] [S] Create `src/shared/ui/modal/index.ts` — export `Modal`

**Dependencies:** None — standalone primitive.

**Definition of Done:** Modal opens/closes correctly, traps focus, closes on Escape and backdrop click, renders title as heading, passes keyboard nav.

---

## Phase 2 — "Where to Find" Feature Slice

**Goal:** Move "Where to Find" out of the page into a button + modal.

- [x] [S] Create `src/features/where-to-find/ui/WhereToFindContent.tsx` — renders store list + `ItemLinksManager`; accepts `itemId`, `isOwner`, `linkedStores`, `initialLinks` props
- [x] [M] Create `src/features/where-to-find/ui/WhereToFindButton.tsx` — Client Component; manages `open` state; renders `Button` (secondary, full-width) + `Modal` wrapping `WhereToFindContent`
- [x] [S] Create `src/features/where-to-find/ui/WhereToFind.module.css` — modal content layout styles (store list, spacing)
- [x] [S] Create `src/features/where-to-find/index.ts` — export `WhereToFindButton`
- [x] [M] Update `app/[username]/[collectionSlug]/[slug]/page.tsx` — remove `WhereToFindSection` inline component, import and use `WhereToFindButton` in `ItemMeta`; apply visibility rule (`linkedStores.length > 0 || initialLinks.length > 0 || isOwner`)

**Dependencies:** Phase 1 must be complete (Modal primitive).

**Definition of Done:** Inline "Where to Find" section gone from page. Button appears only when data exists or user is owner. Modal opens with correct content. Owner can manage links inside modal. Modal closes on button, Escape, and backdrop click.

---

## Phase 3 — Richer Metadata Display

**Goal:** Add structured label/value metadata block to item details column.

- [x] [M] Add `ItemMetaDetails` inline component to `page.tsx` — renders label/value pairs for Brand, Line, Variant, Category, Franchise; skips fields with no value; Franchise value is a link to `/franchises/{slug}`
- [x] [S] Add `.metaDetails`, `.metaDetails__label`, `.metaDetails__value` CSS classes to `page.module.css` — two-column CSS Grid, uppercase small labels, body-size values

**Dependencies:** None — isolated addition to `page.tsx`.

**Definition of Done:** All populated metadata fields visible as labeled pairs. Empty fields not rendered. Franchise is a clickable link. Layout is consistent on mobile and desktop.

---

## Phase 4 — Image Edit UX Improvement

**Goal:** Replace flat toggle with an interactive, clearly afforded edit mode on the image section.

- [x] [M] Update `ItemImageSection.tsx` — add overlay trigger button (absolutely positioned, bottom-center of image, primary color pill style) replacing the plain text button below the image
- [x] [S] Update `ItemImageSection.tsx` — apply `imageWrapper--editing` modifier class when `editingImage === true` (dim image + primary outline)
- [x] [S] Update `ItemImageSection.tsx` — replace bare `<button>` cancel element with `Button` component (`variant="ghost"`) from `@dezkareid/components/react`
- [x] [S] Update `ItemImageSection.tsx` — add `showSuccess` state flag; display "Image updated!" feedback for 1.5s after successful upload using `var(--color-success)`
- [x] [M] Add `.imageWrapper--editing`, `.imageOverlayButton`, `.imageSuccessFeedback` classes to `page.module.css`

**Dependencies:** None — isolated to `ItemImageSection.tsx` and CSS.

**Definition of Done:** "Add/Replace image" button overlaid on image (not below). Edit mode visually distinct (dimmed image, primary outline). Cancel uses Button component. Success feedback shown briefly after upload. Min 44px touch target on overlay button.

---

## Phase 5 — Fix Social Share

**Goal:** Remove Web Share API branch; always show in-app social dropdown.

- [x] [S] Grep `src/shared/lib/share-utilities.ts` for all usages of `shareUrl` and `canUseWebShare` across the codebase to confirm they are only used in `social-share.tsx`
- [x] [M] Update `src/features/social-share/ui/social-share.tsx` — remove `canUseWebShare()` import and branch, remove `handleNativeShare` function, remove `shareUrl` import; always render `DropdownMenu` after hydration
- [x] [S] Remove `shareUrl` and `canUseWebShare` exports from `src/shared/lib/share-utilities.ts` (only if confirmed unused elsewhere in Phase 5, task 1)

**Dependencies:** None — isolated to social share feature.

**Definition of Done:** Share button never opens OS share sheet on any device/browser. Dropdown with Twitter/X, Facebook, LinkedIn, Copy Link always appears. Copy Link shows "Copied!" feedback. All shared URLs include UTM params.

---

## Refactoring (post-implementation)

- [x] [M] **CSS conventions — `page.module.css`** — Rewrote to follow BEM + OOCSS: single `item-page` block prefix, kebab-case class names throughout, structure and skin separated into distinct rule blocks per section. Updated all `styles.*` references in `page.tsx` and `ItemImageSection.tsx` to match.

---

## Bug Fixes (post-implementation)

- [x] [S] **Copy link toast** — Added `src/shared/ui/toast/Toast.tsx` primitive; wired into `SocialShare` to show "Link copied!" toast on clipboard copy instead of only updating the dropdown item label
- [x] [S] **Modal centered on screen** — `<dialog>` was appearing at top-left corner; fixed with `position: fixed; top: 50%; left: 50%; translate: -50% -50%; margin: 0` and updated slide-in keyframes to keep centering consistent
- [x] [S] **Modal backdrop in dark mode** — Added `backdrop-filter: blur(6px)` to `::backdrop` so the overlay is visually distinct regardless of page background color; increased opacity to `0.6` in dark mode via `prefers-color-scheme`
- [x] [M] **Edit item line not pre-populated** — `useEffect` used `startLoadingLines` (a `useTransition` wrapper) to call the `getLinesByBrand` server action; `startTransition` does not await async callbacks so `setLines` never fired. Fixed by calling the server action directly with `.then(setLines)` and a plain `linesLoading` boolean state. Also switched the line `<select>` to controlled (`value={selectedLine}`) and added `selectedLine` state initialized from `currentLineId`.

---

## Notes

- Tasks within a phase can be done in any order unless a dependency is noted.
- All CSS must use design tokens — no hardcoded values.
- Every new interactive element must pass keyboard navigation (Tab, Enter, Escape).
- Run `pnpm turbo run build --filter=@dezkareid/collectstory` after completing all phases to verify no type errors.
