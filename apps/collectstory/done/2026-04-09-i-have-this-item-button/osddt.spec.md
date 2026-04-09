# Specification: "I Have This Item" Button

## Overview
To increase user engagement and accelerate the growth of the Collecstory platform, we need a way for users to easily add items they discover in other people's collections to their own. Manually creating an item that already exists in the system is a barrier to entry. The "I Have This Item" feature allows users to "claim" or "copy" an existing item into one of their own collections with a single click, fostering a more connected and active community of collectors.

## Business Context
This feature aligns with the following **Dezkareid Enterprise Strategic Outcomes (2026)**:
- **Innovation & Growth**: Specifically the goal to expand the Collecstory user base by 50% through improved community engagement. By lowering the friction of adding items, we encourage more frequent updates and larger collections.
- **High-Quality User Experience**: By standardizing the "copy" pattern, we make the application feel more intuitive and powerful, fulfilling the "superior usability" result.

It also adheres to our **Architecture Principles**:
- **Simplicity over Complexity**: We are adding a straightforward "copy" action rather than a complex social networking "shared item" model.
- **Performance-First Design**: The operation must be fast to ensure the user experience remains "High Quality."

## Requirements
- **Action Trigger**: A clearly visible button/action must be added to collection items (both in list/grid views and detail views).
- **Collection Selection**: Clicking the button must present the user with a list of their existing collections. If the user has no collections, the system should automatically create a default collection for them.
- **Item Duplication**: Upon selecting a collection, a new item should be created in that collection with the same metadata (name, description, tags, etc.) as the source item.
- **User Feedback**: The user must receive immediate confirmation when the item is successfully added to their collection, including a link to the new item.
- **Authentication**: This feature is only available to logged-in users. Anonymous users should be prompted to log in or sign up.

## Scope
### In Scope
- UI button on item cards and item detail pages.
- A selection interface (e.g., modal or dropdown) to choose a destination collection.
- Automatic creation of a default collection if the user has none.
- Backend logic to duplicate an item's data and associate it with the current user's collection.
- Success/Error notifications.

### Out Scope
- Bulk copying of items.
- Syncing changes between the original item and the copied version (they are independent copies).

## Acceptance Criteria
- As a logged-in user, I can see an "I have this" button on any item that is not already in one of my collections.
- Clicking the button opens a list of my collections.
- Selecting a collection successfully creates a copy of the item in that collection.
- I am notified of the success and can navigate directly to my new item.
- As an anonymous user, clicking the button redirects me to the login page with a return path to the item.

## Session Context
- The feature is specifically targeted at the `apps/collectstory` application.
- The primary goal is to "incentivize users to create collections and items" by making the process frictionless.

## Decisions
1. **Editing Copy**: The user will be allowed to edit item details (like personal notes or condition) *during* the copy process.
2. **Private Fields**: Only public metadata will be copied from the source item.
3. **Shortcuts**: No "recently used collection" shortcut will be implemented for now, keeping the interface simple with a standard collection list.
4. **No Collections**: If a user has no collections, the system will automatically create a default one to facilitate the copy.
