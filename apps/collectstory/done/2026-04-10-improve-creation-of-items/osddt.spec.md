# Feature Specification: Improve Creation of Items

## Overview

The current item creation flow in the collection page has two usability problems. First, when a user is on a public collection page and wants to add a new item, clicking "Add Item" navigates them to a separate page (`/[username]/[collectionSlug]/items/new`), breaking context and flow. Second, the "I have this" button — which lets a visitor copy a public item into their own collection — stores the original item's image URL directly rather than uploading the image file, creating a dependency on another user's image and potential conflicts if the source image is later changed or deleted.

This feature improves three things: item creation happens in-context via a dialog (reusing the existing `AddItemModal` pattern); the "New Collection" modal form and the empty collection state's inline item form are properly centred; and the "I have this" image copy is fetched client-side and uploaded to the user's own Cloudinary folder via `/api/upload` instead of referencing the source URL.

---

## Requirements

### 1. In-context item creation on the collection page

- When an authenticated collection owner is viewing their own public collection page (`/[username]/[collectionSlug]`), the "Add Item" action must open a dialog overlay rather than navigating to a new page.
- The dialog must reuse the existing `AddItemModal` / `AddItemForm` component so that all fields, validation, and image upload behaviour are identical to the current new-item page.
- On successful submission, the dialog closes and the collection page refreshes to show the new item — without a full page navigation.
- The separate route `app/[username]/[collectionSlug]/items/new` may remain as a fallback for users who deep-link to it or navigate without JavaScript, but the primary entry point becomes the dialog.

### 2. Centred forms in collection creation and empty collection state

- The **"New Collection" modal** (opened from the "New Collection" button) must centre its form content within the modal overlay.
- When a collection exists but contains no items, the page shows a button that reveals an **inline item creation form**. That inline form must be horizontally and vertically centred within the content area.
- The centred layout for the inline form applies only while the collection is empty; once items exist the page returns to its standard grid layout.

### 3. Image copy on "I have this"

- When a visitor clicks "I have this" on a public collection item and confirms the copy, the application must **upload the source item's image to the current user's own Cloudinary folder** rather than storing the original `image_url` string.
- The upload must go through the existing `/api/upload` endpoint (with all its optimisation, metadata-stripping, and Cloudinary integration) so the copied image is treated as the user's own asset.
- If the source item has no image, the copied item is created without an image — no upload is attempted.
- If the image upload fails (e.g. the source URL is unreachable), the copy operation must still succeed; the item is created without an image and the user is informed that the image could not be copied.

---

## Scope

### In scope

- Replacing the full-page item creation navigation with a dialog on the public collection page (owner view).
- Centring the form inside the "New Collection" modal.
- Centring the inline item creation form in the empty collection state.
- Uploading the source image (client-side fetch → `/api/upload`) when a user uses "I have this".

### Out of scope

- Changes to the admin item creation flow.
- Changes to the item edit flow.
- Removing the `/items/new` route (it stays as a fallback).
- Changes to any other copy or sharing mechanism beyond "I have this".
- Mobile-specific layout changes beyond what the existing modal pattern already handles.

---

## Acceptance Criteria

1. **Collection page — Add Item dialog**: An authenticated owner visiting their own collection page sees an "Add Item" button that opens the item creation form as a dialog. Submitting the form closes the dialog and the new item appears in the collection grid without a page redirect.

2. **"New Collection" modal — centred form**: When the "New Collection" modal is open, its form content is horizontally centred within the modal overlay.

3. **Empty collection state — centred inline form**: A user who has a collection with zero items clicks the button to add their first item; the inline form that appears is centred in the content area. Once at least one item exists, the layout reverts to the standard grid.

4. **"I have this" — image upload**: When a visitor copies a public item that has an image, the resulting item in their collection references an image URL in their own Cloudinary folder (`collectstory/{userId}`), not the original item owner's URL. The image in the copied item is visually identical to the source.

5. **"I have this" — image upload failure graceful degradation**: If the source image cannot be fetched or uploaded (network error, invalid URL, unsupported format), the copy still completes. The copied item has no image, and the user sees an inline message indicating the image could not be copied.

6. **"I have this" — no image**: If the source item has no image, the copied item is created without an image and no upload is attempted. No error is shown.

7. **Accessibility**: The new item creation dialog is keyboard-navigable (focus is trapped inside the open dialog, Escape closes it, focus returns to the trigger button on close). WCAG 2.2 AA compliance is maintained.

8. **No regression**: The existing "Copy item" flow (same dialog, used by returning users who already have collections) continues to work correctly.

---

## Business Context

This feature directly supports two strategic outcomes for Dezkareid Enterprise (2026):

- **High-Quality User Experience** — Removing the page-navigation interruption for item creation and fixing the empty-state centering reduces friction in the core collector workflow, contributing to the "High Quality" performance and usability rating target.
- **Innovation & Growth** — A smoother item creation flow increases the likelihood that new users (acquired through improved SEO) complete their first collection item, supporting the 50% Collectstory user-base growth key result.

Architecturally, the image-copy change aligns with the **Integrity and Auditability** principle: each user's collection items reference image assets they own, making storage usage and data provenance transparent and auditable. Storing a URL belonging to another user violates this principle and creates silent breakage risk.

---

## Decisions

1. **Centering scope clarified**: There are two separate centering fixes. (a) The "New Collection" button opens a modal — the form inside that modal needs to be centred. (b) The empty collection state has a button that reveals an inline item creation form — that inline form needs to be centred. Both are CSS fixes to existing UI; no structural changes needed.

2. **Image upload on "I have this" — fetch approach**: The image fetch and upload happen client-side. The `CopyItemModal` fetches the source image as a blob and POSTs it to `/api/upload`, mirroring the same flow used by the regular item creation form. No server-side outbound request is needed.

3. **Dialog trigger location on the collection page**: The "Add Item" button appears only in the collection toolbar. The change is to wire that button to open the existing `AddItemModal` dialog instead of navigating to `/items/new`.
