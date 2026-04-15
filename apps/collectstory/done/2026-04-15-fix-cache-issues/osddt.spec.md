# Spec: Fix Cache Issues & Add Delete Operations

## Overview

Two related problems need to be addressed in Collectstory:

1. **Cache staleness bug**: When a user adds an item to their collection, the item is persisted to the database but the collection page does not reflect the change immediately. The UI appears unchanged, giving the impression the action failed — even though it succeeded. This erodes user trust and contradicts the platform's reliability goal.

2. **Missing delete functionality**: Users cannot delete individual items from their collections. Collection deletion exists as a server action but it is unclear whether it is exposed through the UI. Both operations are needed for users to manage their collections fully.

These issues directly affect user trust, product quality, and the goal of expanding the Collectstory user base through a reliable, high-quality experience.

## Business Context

- **Innovation & Growth**: A broken "add item" feedback loop discourages users from engaging with their collections and inviting others. Fixing it supports the 50% user base growth target.
- **Operational Excellence**: Cache bugs that make successful writes appear to fail are exactly the kind of issue that increases time-to-resolution and breaks user trust. Fixing this supports the 99.9% availability and 30% issue-resolution improvement targets.
- **High-Quality User Experience**: Users should always see an accurate, up-to-date view of their collections after any mutation. Stale UI post-mutation violates the "fast and easy to use" quality standard.
- **Integrity and Auditability** (Architecture): The system must reflect actual data state. A UI that shows stale data after a confirmed write breaks data integrity perception for the user.

## Requirements

### Cache Invalidation Fix

1. After a user successfully adds an item to a collection, the collection page must immediately reflect the new item without requiring a manual page refresh.
2. After a user successfully updates an item or collection, the affected pages must show the updated content immediately.
3. Cache invalidation must cover all relevant views: the collection item list, the collection detail, and the user's profile (collection list).

### Delete Item

4. An authenticated user who owns a collection must be able to delete any item from that collection.
5. After deleting an item, the collection page must immediately reflect the removal (no stale cache).
6. Deleting an item must be a confirmed action — the user must not be able to accidentally delete an item with a single click.

### Delete Collection (UI exposure)

7. An authenticated user must be able to delete one of their collections from the UI.
8. After deleting a collection, the user's profile page must immediately reflect the removal.
9. Deleting a collection must be a confirmed action — the user must not be able to accidentally delete a collection with a single click.

## Scope

### In Scope

- Fix cache revalidation after adding an item to a collection so the UI reflects the change immediately.
- Audit and fix cache revalidation for all existing item and collection mutations (update, copy, delete collection).
- Implement a "delete item" user action (server action + UI) for collection owners.
- Expose the existing "delete collection" server action through the UI if not already accessible.
- Confirmation step before any destructive delete action.

### Out of Scope

- Bulk delete of items or collections.
- Undo / restore of deleted items or collections.
- Soft delete (items/collections are permanently removed).
- Changes to how non-owners interact with collections.
- Any changes to the global discovery feed caching (latest arrivals, homepage).

## Acceptance Criteria

1. **Add item → immediate feedback**: After submitting the "add item" form, the collection page shows the new item without a manual refresh.
2. **Update item/collection → immediate feedback**: After editing an item or collection, the affected page shows the updated content without a manual refresh.
3. **Delete item → owner only**: A "delete" option is visible on item cards/detail pages only for the authenticated owner.
4. **Delete item → confirmation**: Triggering delete item presents a confirmation prompt before the action executes.
5. **Delete item → immediate feedback**: After confirming item deletion, the item no longer appears in the collection without a manual refresh.
6. **Delete collection → UI accessible**: A "delete" option is visible on the collection page for the authenticated owner.
7. **Delete collection → confirmation**: Triggering delete collection presents a confirmation prompt before the action executes.
8. **Delete collection → immediate feedback**: After confirming collection deletion, the collection no longer appears on the user's profile without a manual refresh.
9. **No data loss on cancel**: Cancelling a delete confirmation leaves the item/collection unchanged.
10. **Error handling**: If a delete or add-item action fails, the user sees a clear error message and the UI is not left in an inconsistent state.

## Decisions

1. **Delete collection cascade**: Deleting a collection permanently deletes all of its items as well. The confirmation modal must make this explicit (e.g., "All items in this collection will be deleted and cannot be recovered").
2. **Collection delete UI location**: The delete collection option must appear in two places — on the collection card (in the user's profile/collection list) and on the collection detail page header.
3. **Confirmation UX**: A modal dialog is used for all destructive delete actions. The modal copy must clearly state that all items will be deleted (for collection delete) or that the action is permanent (for item delete).
