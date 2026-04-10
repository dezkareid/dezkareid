# Feature Specification: Like Collection Items

## Overview

Users of Collecstory will be able to "like" any public collection item. Likes serve as a lightweight engagement signal — they help collectors discover popular items, reward item owners with social validation, and increase the time users spend exploring other people's collections.

This feature does not require deep social interaction (no comments or follows are in scope). It is intentionally minimal: a single tap or click to express appreciation for an item.

## Business Context

This feature directly supports the following strategic outcomes and architecture principles:

**Company Outcomes:**
- **Innovation & Growth** — Contributes to the 50% user-base expansion goal for Collecstory by improving community engagement metrics and increasing organic discoverability of popular items.
- **High-Quality User Experience** — Provides a familiar, low-friction social affordance (the "like" pattern) that is expected on any modern collection or catalog platform.

**Architecture Principles:**
- **Simplicity over Complexity** — A single `likes` table with a unique constraint is the simplest correct model. No denormalized counters in the initial scope.
- **Integrity and Auditability** — One like per user per item enforced at the database level (unique constraint + RLS), not just the application layer.
- **Native Discoverability** — The like count on an item page provides a social proof signal that can improve engagement-based ranking in future discovery features.

## Requirements

### Functional Requirements

1. **Like an item** — An authenticated user can like any public collection item that they do not own.
2. **Unlike an item** — An authenticated user who has previously liked an item can remove their like.
3. **View like count on detail page** — Any visitor (authenticated or not) can see the total number of likes on a public item detail page.
4. **View like count on list page** — Any visitor (authenticated or not) can see the like count on each item card in the collection list page (`/[username]/[collectionSlug]`).
5. **Liked state indicator** — An authenticated user can see at a glance whether they have already liked a given item.
6. **Unauthenticated prompt** — When a visitor who is not signed in attempts to like an item, they are prompted to sign in.
7. **Owners cannot like their own items** — A user who owns an item cannot like it (enforced both in UI and at the data level).
8. **Private items cannot be liked** — Only items with `visibility = 'public'` are likeable. Private or draft items do not expose a like action.

### Out of Scope

- Liking collections (only items are in scope for this feature)
- Notifications to item owners when they receive a like
- A "liked items" feed or profile section showing all items a user has liked
- Sorting or filtering items by like count
- Anonymous likes
- Publicly exposing the list of users who liked an item (only counts are public)

## Acceptance Criteria

1. **AC-1: Authenticated like** — Given a signed-in user viewing a public item they do not own, when they click the like button, the like count increments by 1 and the button reflects a "liked" state without a full page reload.
2. **AC-2: Unlike** — Given a signed-in user who has already liked an item, when they click the liked button again, the like count decrements by 1 and the button returns to an unliked state.
3. **AC-3: Like count on detail page** — Given any visitor (signed in or not) viewing a public item detail page, the current total like count is displayed.
3a. **AC-3a: Like count on list page** — Given any visitor (signed in or not) viewing the collection list page, the like count is shown on each public item card.
4. **AC-4: Unauthenticated CTA** — Given a visitor who is not signed in, when they interact with the like button, they are redirected to or prompted with the sign-in flow.
5. **AC-5: No self-like** — Given the item owner viewing their own item, the like button is not displayed or is visually disabled.
6. **AC-6: Duplicate like prevention** — Given a signed-in user who has already liked an item, attempting to like it again produces no change (idempotent; database constraint prevents duplicates).
7. **AC-7: Private item** — Given an item with `visibility` other than `'public'`, no like button or like count is shown.

## Scope

### In Scope
- Like / unlike action on the item detail page (`/[username]/[collectionSlug]/[slug]`)
- Like count display on the item detail page
- Like count badge on item cards on the collection list page (`/[username]/[collectionSlug]`)
- `item_likes` table to persist individual likes (who liked what) with RLS enforcement
- Denormalized `likes_count` integer column on `collection_items`, maintained in sync with the `item_likes` table via a database trigger
- UI affordance: like button with count and active/inactive state

### Out of Scope
- Liking collections or user profiles
- Like-based sorting or discovery feeds
- Like notifications or activity history
- Optimistic UI beyond a simple toggle (no skeleton loaders, no animation spec)

## Decisions

1. **Like count scope**: Like counts will appear on both the item detail page and item cards on the collection list page.
2. **Count strategy**: Use a denormalized `likes_count` column on `collection_items` (maintained by a DB trigger) alongside a `item_likes` table that records individual likes (user + item). This gives fast reads and preserves the full like history.
3. **Liker visibility**: Only the total count is public. The `user_id` on `item_likes` is NOT queryable by other users via RLS — liker identity stays private.
