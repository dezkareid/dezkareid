# Implementation Plan: "I Have This Item" Button

This plan outlines the technical steps to implement the "I Have This Item" feature in `apps/collectstory`, allowing users to copy existing items into their own collections.

## Architecture Overview
The feature will use Next.js Server Actions for all data mutations and collection retrieval. We will leverage the existing Supabase integration for database operations. The UI will follow the established component structure, reusing existing form patterns where possible.

### Key Components
- **Server Action**: `getUserCollections` - Fetches the authenticated user's collections.
- **Server Action**: `copyItemToCollection` - Handles the duplication logic, including metadata and optional user overrides.
- **UI Component**: `IHaveThisButton` - A reusable button component that triggers the copy flow.
- **UI Component**: `CopyItemModal` - A dialog that allows users to select a destination collection and edit item details before saving.
- **Logic**: Automatic creation of a default collection if the user has none during the copy process.

## Implementation Phases

### Phase 1: Backend & Data (Server Actions)
1. **Retreival Action**: Create `getUserCollections` in `app/[username]/actions.ts` (or a more appropriate shared location) to fetch collections for the logged-in user.
2. **Copy Action**: Create `copyItemToCollection` in `app/[username]/[collectionSlug]/actions.ts`.
   - Logic:
     - Verify authentication.
     - If no collection ID is provided and user has no collections, create a default "My Collection".
     - Generate a unique slug for the new item.
     - Insert a new record into `collection_items` using metadata from the source item.
     - Support overrides for fields like `notes`, `condition`, or `visibility`.
3. **Data Fetching**: Ensure we can fetch necessary lookup data (brands, franchises) for the item editor, potentially reusing `AddItemForm` loaders.

### Phase 2: UI - Trigger & Selection
1. **Button Component**: Create `IHaveThisButton` in `features/copy-item`.
   - Should check for authentication.
   - Redirect to login if unauthenticated.
2. **Modal Component**: Create `CopyItemModal`.
   - Fetches user collections on open.
   - Displays a selection dropdown.
   - If user has no collections, show a message indicating a default one will be created.
3. **Integration**: Add `IHaveThisButton` to `CollectionItemCard`.
   - Ensure it's visually integrated without cluttering the card.
   - Pass the source item's metadata as initial data.

### Phase 3: UI - Item Editor (Form Reuse)
1. **Form Refactoring**: Review `AddItemForm` to see if it can be easily adapted to accept "initial data" for pre-filling fields.
2. **Copy Form**: Create `CopyItemForm` (or adapt `AddItemForm`) to allow users to review and edit the item details before finalizing the copy.
   - Pre-fill with source item's public metadata (Name, Description, Tags, Image URL).
3. **Success Flow**: Implement the post-copy notification and navigation to the new item.

### Phase 4: Validation & Edge Cases
1. **Auth Guarding**: Ensure the button doesn't perform actions for logged-out users.
2. **Private Fields**: Explicitly exclude any internal/private source data from being copied.
3. **Duplicate Prevention**: (Optional) Check if the user already has this item (by name/slug) in the selected collection.

## Technical Dependencies
- **Next.js Server Actions**: Core for all mutations.
- **Supabase (PostgreSQL)**: Database for collections and items.
- **Existing UI Components**: `Tag`, `AddItemForm` (as reference/base).

## Risks & Mitigations
- **Complexity of Item Metadata**: Items have many fields (brands, lines, categories).
  - *Mitigation*: Ensure `AddItemForm` is reusable or that the copy action accurately maps all related IDs.
- **Image Handling**: Copying image URLs.
  - *Mitigation*: Since image URLs are public Supabase storage links, we can just copy the URL string without re-uploading the file.
- **Concurrency**: Creating a default collection while copying.
  - *Mitigation*: Wrap the default collection creation and item insertion in a database transaction if possible, or handle sequentially with proper error cleanup.

## Out of Scope
- Syncing updates between the original and copied items.
- Bulk copying multiple items at once.
- Creating custom collections during the copy flow (only automatic default creation is supported).
