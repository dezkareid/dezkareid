---
feature: upload-collection-item
status: draft
date: 2026-03-30
---

# Spec: Upload Collection Item

## Overview

Users need a way to add new items to their collection directly from the app. Currently the collection page displays items but provides no way to create them — items can only exist if added via the database directly. This feature introduces an "Add Item" flow where authenticated users can fill in item details and optionally upload a photo, making their collection personally meaningful and visually rich.

Publishing items also unlocks future UX improvements: a "Last Additions" section on the user home and (future) public profile, and individual item pages that can be indexed by search engines to drive organic traffic from collectors searching for specific figures, brands, or lines.

## Requirements

### Item Creation Form

- An authenticated user can open an "Add Item" form from their collection page.
- The form must include the following fields:
  - **Name** (required) — free-text name of the item
  - **Image** (optional) — the user can upload a photo from their device
  - **Brand** (optional) — selected from the existing admin-managed brands list
  - **Line** (optional) — selected from lines associated with the selected brand; resets when brand changes
  - **Category** (optional) — selected from the existing admin-managed categories list
  - **Description** (optional) — free-text description
  - **Date Acquired** (optional) — date picker for when the item was obtained
- The form includes a **Visibility** field with three options: `Public` (default), `Private`, and `Draft`.
- The form validates that Name is not empty before submission.
- On successful submission, the new item appears in the user's collection without a full page reload (the collection list updates).
- On error, the form displays a clear error message and retains the user's input.

### Image Upload

- The user can attach a single image file (JPEG, PNG, WebP) to an item.
- The image is uploaded to Cloudinary and the resulting URL is stored on the item.
- There is a maximum file size limit (e.g. 5 MB) enforced on the client before upload; oversized files show an error message.
- If no image is provided, the item is saved with no image (the existing placeholder is shown on the card).
- Uploaded images are displayed in the `CollectionItemCard` using the stored Cloudinary URL.

### Last Additions Section

- The user's collection home (`/collection`) gains a "Last Additions" section that shows the most recently created items (e.g. the last 6 items, ordered by `created_at` descending).
- This section is visually distinct from the main collection grid (e.g. a horizontal scroll strip or highlighted row).
- If the user has fewer items than the section size, all items are shown.
- If the user has no items, the "Last Additions" section is not shown (or shows an empty prompt).

### Item Detail Page (for SEO)

- Each `public` collection item has a public, indexable detail page at `/<username>/items/[slug]`.
- The URL namespace is scoped to the owner's username, so slugs only need to be unique per user.
- The slug is auto-generated from the item name at creation time (e.g. `sh-figuarts-spider-man`); if a slug collision occurs for the same user, a numeric suffix is appended.
- The page displays the item's name, image, brand, line, category, description, and date acquired.
- The page is server-rendered and includes appropriate `<title>` and `<meta name="description">` tags derived from item data.
- `private` and `draft` items are not accessible via their detail page — they return a 404 to unauthenticated visitors.
- If the item does not exist, the page returns a 404.
- `public` item detail pages are accessible without authentication so search engines can crawl them.

## Scope

### In Scope

- Add Item form accessible from the authenticated collection page
- Image upload via Cloudinary (single image per item)
- Client-side file size validation
- "Last Additions" section on the collection home page
- Individual public item detail page with SEO metadata (public items only)
- Item visibility states: public, private, draft
- Slug generation from item name (with collision handling)
- Image update after item creation
- Brand → Line cascade (line options filter by selected brand)
- Edit Profile form: username + profile picture upload

### User Profile Editing

- An authenticated user can access an "Edit Profile" form from their collection page (e.g. via a settings link in the header or collection layout).
- The form includes:
  - **Username** (required) — unique handle used in public item URLs (e.g. `/<username>/items/[slug]`); only lowercase letters, digits, and hyphens allowed; minimum 3 characters.
  - **Profile Picture** (optional) — the user can upload a photo from their device; stored in Cloudinary under `collectstory/avatars/<user-id>/`.
- The username field shows a real-time availability check (or at minimum a clear error on submit if the username is already taken).
- Updating the username changes all existing public item URLs immediately (since the URL is resolved via the current username, not a historical one).
- If a user has no username set, item detail pages are not publicly accessible until a username is chosen.
- On successful save, the user's collection page reflects the updated username/avatar.

### Out of Scope

- Editing or deleting existing collection items (separate feature)
- Public user profile page listing all of a user's items (separate feature)
- Bulk import of items
- Multiple images per item
- Social sharing buttons
- Admin moderation of user-uploaded items

## Acceptance Criteria

1. An authenticated user on `/collection` sees an "Add Item" button that opens the creation form.
2. Submitting the form with only a name creates a new item that immediately appears in the collection.
3. Submitting the form with a name and an image uploads the image and displays it on the new item card.
4. Attempting to upload a file larger than the allowed limit shows an error before submission and does not upload the file.
5. Submitting the form with no name shows a validation error and does not create an item.
6. When a brand is selected in the form, the line dropdown populates with only that brand's lines; clearing the brand clears the line selection.
7. The collection home shows a "Last Additions" section with up to 6 of the user's most recent items sorted by creation date (newest first).
8. Navigating to `/<username>/items/[slug]` for a `public` item renders a page with the item's name, image, and metadata without requiring login.
9. The item detail page `<title>` includes the item name (e.g. "S.H. Figuarts Spider-Man — Collectstory").
10. Navigating to `/<username>/items/[slug]` for a `private` or `draft` item returns a 404 to unauthenticated visitors.
11. Navigating to a username or item slug that does not exist returns a 404 page.
12. A user can update the image of an existing item from the item detail or edit form.
13. An authenticated user can access an "Edit Profile" form and set a unique username.
14. Submitting a username that is already taken shows an error and does not save.
15. After setting a username, the user's public item URLs resolve at `/<username>/items/[slug]`.
16. A user without a username set cannot have their items accessed via a public URL.
17. An authenticated user can upload a profile picture; it is displayed in the collection layout header.

## Decisions

1. **Item visibility**: Items have three visibility states — `public` (default), `private`, and `draft`. Draft allows saving an unfinished item without publishing it. Only `public` items are indexable and accessible via the detail page without authentication.
2. **Slug vs UUID in URL**: Item detail pages use a human-readable slug scoped to the owner's username (e.g. `/<username>/items/sh-figuarts-spider-man`). Slugs are unique per user; auto-generated from the item name at creation time with a collision suffix if needed.
3. **Last Additions scope**: "Last Additions" currently shows the authenticated user's own items. The section is designed to eventually become a global feed of all users' public recent additions.
4. **Cloudinary folder structure**: Images are organized into per-user folders in Cloudinary (e.g. `collectstory/<user-id>/`).
5. **Image update**: Users can update an item's image after creation (not only at creation time).
