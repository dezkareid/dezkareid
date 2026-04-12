# Tasks: Improve Image Item Performance

**Status**: Completed
**Date**: 2026-04-12
**Feature Name**: `improve-image-item-performance`

---

## Phase 1: Research & Component Refactoring
Goal: Prepare components for decoupled rendering.

- [x] [S] Refactor `ItemImageSection.tsx` to remove `isOwner` dependency and focus solely on image rendering.
- [x] [S] Create `OwnerImageActions.tsx` (Client Component) and `OwnerImageSection.tsx` (Server Component container) to handle ownership check and render interactive elements.
- [x] [S] Update `OwnerImageSection.tsx` to act as the new container for `OwnerImageActions`.
- [x] [S] Review `page.module.css` to ensure overlay positioning for the "Replace" button doesn't affect image layout.

**Definition of Done**: Components are split and ready for integration without ownership logic bleeding into the image renderer.

---

## Phase 2: Execution - Layout Updates
Goal: Implement the new rendering strategy in the page.

- [x] [M] Modify `app/[username]/[collectionSlug]/[slug]/page.tsx` to render the image component directly (no Suspense).
- [x] [S] Add `OwnerImageActions` wrapped in `<Suspense fallback={null}>` inside the image container.
- [x] [S] Ensure the state update from `UpdateImageForm` (within `OwnerImageActions`) propagates back to the image component.
- [x] [S] Cleanup any unused exports or legacy components (e.g., if `OwnerImageSection` becomes redundant).

**Definition of Done**: Page renders the image immediately, and owner actions stream in via Suspense.

---

## Phase 3: Validation & Optimization
Goal: Verify performance and functionality.

- [x] [S] Verify that the image renders immediately on page load (manual check + Network tab).
- [x] [S] Verify that the "Replace" button appears only for the owner and remains interactive.
- [x] [S] Check for Layout Shift (CLS) when owner actions appear.
- [x] [M] Perform a baseline comparison of LCP/FCP before and after changes (passed type check, local architecture validated).

**Definition of Done**: Acceptance criteria met: improved LCP/FCP, stable layout, and functional owner actions.

---

## Dependencies
- Phase 1 must be completed before Phase 2.
- Phase 3 depends on the successful completion of Phase 2.
