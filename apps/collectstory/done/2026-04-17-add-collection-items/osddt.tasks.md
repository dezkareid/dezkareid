# Tasks: Collection Items Exploration

## Phase 1: Inline Item Editing
- [x] [S] Verify/Create Server Action in `app/[username]/[collectionSlug]/actions.ts` for item updates.
- [x] [M] Create `src/features/edit-item/ui/EditItemModal.tsx` reusing/migrating `AddItemForm` logic.
- [x] [M] Integrate `EditItemModal` trigger into collection page item cards (owner only).
- [x] [S] Validate inline editing persistence and immediate UI feedback.

## Phase 2: Smooth View Transitions
- [x] [S] Synchronize `view-transition-name` between `CollectionItemCard` and item detail page.
- [x] [S] Audit `app/globals.css` for `::view-transition` compatibility.
- [x] [S] Validate smooth "grow/shrink" animation on navigation.

## Phase 3: Immersive Explorer
- [x] [S] Create `src/features/explore-collection/ui/ExploreButton.tsx`.
- [x] [M] Implement `src/features/explore-collection/ui/CollectionExplorerView.tsx` fullscreen layout.
- [x] [M] Develop `useExplorer` hook for navigation (keyboard + touch swipe).
- [x] [S] Integrate `LikeButton.tsx` and social logic into the explorer view.
- [x] [S] Add explorer trigger to the collection header.

## Dependencies
- Phase 1 integration should precede Phase 3 to ensure updated item data is available in the explorer.
- Entity-level item components must be stable before building the explorer view.

## Definition of Done
- **Functional**: Owners can edit items inline; explorer supports full navigation and "Liking".
- **Visual**: Transitions are smooth across all targeted routes; explorer is immersive and distraction-free.
- **Technical**: FSD structure is respected; no new external dependencies; performance-first image loading.
- **Accessible**: Explorer supports keyboard navigation and swipe gestures; proper ARIA attributes are present.
