# Task List: "I Have This Item" Button

## Phase 1: Backend & Data (Server Actions)
- [x] [S] Implement `getUserCollections` server action in `app/[username]/actions.ts` to fetch authenticated user's collections.
- [x] [M] Implement `copyItemToCollection` server action in `app/[username]/[collectionSlug]/actions.ts`.
    - Include logic for verifying authentication.
    - Include logic for creating a default "My Collection" if the user has none.
    - Implement unique slug generation for the copied item.
    - Ensure only public metadata (name, description, tags, image_url) is copied.
- [x] [S] Ensure lookup data actions (brands, franchises, lines) are available for the item editor during the copy flow.

## Phase 2: UI - Trigger & Selection
- [x] [S] Create `IHaveThisButton` component in a new `features/copy-item` directory.
    - Handle client-side auth check and redirect to login if necessary.
- [x] [M] Create `CopyItemModal` component.
    - Fetch and display the user's collections.
    - Show a notice if a default collection will be created.
- [x] [S] Integrate `IHaveThisButton` into the `CollectionItemCard` component.
    - Ensure styling is consistent with existing card actions.

## Phase 3: UI - Item Editor & Flow
- [x] [M] Refactor `AddItemForm` to support `initialData` for pre-filling fields.
- [x] [S] Create `CopyItemForm` (or specialized `AddItemForm` instance) within `CopyItemModal`.
    - Map source item metadata to form fields.
- [x] [S] Implement success/error notifications (Toasts) and navigation to the newly created item.

## Phase 4: Validation & Edge Cases
- [x] [S] Verify that private source data is explicitly excluded from copies.
- [x] [S] Add robust error handling for database failures or slug collisions.
- [x] [S] Perform a final accessibility and design system alignment pass.

## Dependencies
- Phase 1 must be partially completed (Server Actions) before Phase 2 and 3 can be fully implemented.
- `AddItemForm` refactoring is a prerequisite for the full `CopyItemForm` experience.

## Definition of Done
### Phase 1: Backend
- Server actions successfully fetch user collections and duplicate items with correct metadata.
- Default collection creation works as intended.

### Phase 2 & 3: UI
- "I have this" button is visible and triggers the modal.
- Users can select a collection and edit item details.
- Item is successfully created, and the user is redirected/notified.

### Phase 4: Quality
- No private data leaked during copy.
- Errors are handled gracefully with user feedback.
