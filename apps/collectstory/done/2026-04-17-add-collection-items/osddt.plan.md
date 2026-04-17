# Implementation Plan: Collection Items Exploration

## Architecture Overview
This implementation leverages **Next.js 16 (App Router)** and follows **Feature-Sliced Design (FSD)**. We will utilize built-in primitives and existing monorepo packages to avoid adding new dependencies.

### Key Decisions:
- **Inline Editing**: Implement a `EditItemFeature` using a Modal component from `@dezkareid/components`. This feature will use **Server Actions** for data mutations to keep the logic server-centric.
- **View Transitions**: Enhance the existing `ViewTransition` usage in `CollectionItemCard` and the item detail page to ensure the `view-transition-name` matches across routes.
- **Explore Mode**: Create a `CollectionExplorer` widget using React state for navigation and CSS Modules for the fullscreen layout. We will use native touch events (Swiper-like behavior) and keyboard listeners to handle navigation without external libraries.
- **FSD Structure**:
    - `src/features/edit-item`: Modal-based edit form and logic.
    - `src/features/explore-collection`: Fullscreen gallery logic and navigation.
    - `src/entities/item`: Shared item components and types.
    - `app/[username]/[collectionSlug]`: Page integration.

## Implementation Phases

### Phase 1: Inline Item Editing
1.  **Server Action**: Verify or create a Server Action in `app/[username]/[collectionSlug]/actions.ts` that handles item updates (CRUD).
2.  **Feature Component**: Create `src/features/edit-item/ui/EditItemModal.tsx`.
    - Reuse `AddItemForm` logic (from legacy `components/`) but migrate it to FSD if necessary.
    - Use `@dezkareid/components/react` `Button` and internal `Modal` primitives.
3.  **Integration**: Update the collection page to include the `EditItemModal` trigger on each item card when the viewer is the owner.

### Phase 2: Smooth View Transitions
1.  **Consistency Check**: Ensure `CollectionItemCard` (list) and the item detail page (`app/[username]/[collectionSlug]/items/[itemId]/page.tsx`) use the same `ViewTransition` name for the image.
2.  **Global Styles**: Verify `app/globals.css` doesn't have styles that conflict with the `::view-transition` pseudo-elements.
3.  **Validation**: Test navigation between list and detail to ensure the image "grows" or "shrinks" smoothly.

### Phase 3: Immersive Explorer
1.  **Explorer Feature**: Create `src/features/explore-collection`.
    - `ui/ExploreButton.tsx`: Trigger for the explorer.
    - `ui/CollectionExplorerView.tsx`: Fullscreen portal/view.
    - **`ui/LikeButton.tsx`**: Integrated like action for the current item.
2.  **Logic**:
    - Implement a `useExplorer` hook for index management (next/prev).
    - Handle `keydown` (ArrowLeft, ArrowRight, Escape).
    - Handle `touchstart`, `touchmove`, `touchend` for swipe detection.
    - **Social Logic**: Integrate with existing `toggleLike` Server Action (if available) or create a new one.
3.  **Visuals**: Use CSS Modules for a dark, immersive background, centering the image, showing minimal metadata, and a clear "Like" interaction.
4.  **Integration**: Add the "Explore Collection" button to the collection header.

## Technical Dependencies
- **Next.js 16**: App Router, Server Actions.
- **React**: `useState`, `useEffect`, `useTransition`, `ViewTransition`.
- **Supabase**: `@supabase/ssr` for authentication and data (including likes table).
- **@dezkareid/components**: UI primitives (Button, Tag, Modal).
- **@dezkareid/design-tokens**: CSS variables for consistent styling.

## Risks & Mitigations
- **Risk**: Performance issues with many high-res images in Explorer.
    - **Mitigation**: Use the `Image` component from `@dezkareid/components` with `strategy="cloudinary"` for the current/next image in the explorer to leverage its built-in optimizations.
- **Risk**: View Transitions browser support.
    - **Mitigation**: View Transitions are a progressive enhancement; navigation will still work if the API is unsupported.
- **Risk**: Mobile swipe complexity.
    - **Mitigation**: Keep swipe logic simple (threshold-based) to avoid the need for heavy libraries like `framer-motion` or `swiper`.

## Out of Scope
- Adding social interactions like comments to the explorer view.
- Support for video or 3D model exploration (images only).
- Bulk editing of items.
