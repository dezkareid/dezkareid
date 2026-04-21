# Feature Spec: Copy Collection Item to Catalog

## Overview

Admins currently create catalog items manually from scratch via the `/admin/catalog-items/new` form. However, users continuously add collection items with rich data (name, description, images, franchise, line, variant) that would be valuable in the global catalog.

This feature adds a **"Copy to Catalog"** action on collection item admin views, allowing an admin to pre-populate the catalog item creation form with data from a user's collection item in a single click — eliminating redundant data entry.

Additionally, the catalog item model is extended to support **multiple images** (up to 5), enabling richer product presentation on public catalog pages and store-facing views.

---

## Business Context

### Company Outcomes Alignment

- **Innovation & Growth**: A richer catalog with multiple images improves organic discoverability (SEO) and community engagement — directly supporting the 50% Collecstory user base growth target.
- **Operational Excellence**: Reducing admin data-entry friction decreases the time-to-create for catalog items, improving internal team efficiency.
- **High-Quality User Experience**: Multi-image catalog items provide a more complete and trustworthy product view for collectors browsing or comparing items.
- **Efficiency & Velocity**: Reusing existing user-submitted data to seed catalog entries increases the frequency of meaningful catalog updates with less manual effort.

### Architecture Principles Alignment

- **Simplicity over Complexity**: The copy action pre-fills the existing catalog form — no new creation flows, no duplication of UI patterns.
- **Integrity and Auditability**: The feature creates a new catalog record (not a direct copy); the admin reviews and confirms all data before saving, maintaining catalog integrity.
- **Native Discoverability**: Multi-image catalog items better represent products for SEO structured data and public catalog pages.

---

## Requirements

### Copy to Catalog Action

1. An admin viewing a **collection item detail page** must see a **"Copy to Catalog"** button.
2. Clicking the action navigates the admin to the catalog item creation form (`/admin/catalog-items/new`) pre-filled with data from the collection item:
   - `name` ← collection item `name`
   - `description` ← collection item `description`
   - `image_url` ← collection item `image_url` (mapped as the first image)
   - `franchise_id` ← collection item `franchise_id`
   - `line_id` ← collection item `line_id`
3. The admin must be able to review and modify all pre-filled values before saving.
4. If the collection item already has a linked `catalog_item_id`, the action should warn the admin that a catalog link exists, and still allow proceeding (to create a new/duplicate entry or update the linked one).
5. After the new catalog item is saved, the system automatically sets `catalog_item_id` on the source collection item, linking them.
6. The action must only be visible to admin users.

### Multi-Image Support for Catalog Items

7. A catalog item must support a list of images, with a **maximum of 5 images**.
8. The primary image (`image_url`) remains the canonical thumbnail used in cards and listings.
9. Additional images are stored as an ordered JSON array column on `catalog_items`; the order reflects the display order in the gallery.
10. On the catalog item detail page, all images must be viewable (e.g., gallery or image list).
11. The admin form for catalog items must allow uploading and removing images (up to the 5-image limit). The admin can set the display order at upload time (i.e., images appear in the order they are uploaded) or via drag-and-drop reordering.
12. Attempting to add more than 5 images must be prevented with a clear user-facing error.

---

## Scope

### In Scope

- "Copy to Catalog" button on the collection item detail page (admin only)
- Pre-population of the catalog item creation form with collection item data
- Warning when a collection item already has a `catalog_item_id`
- Auto-linking: after catalog item is saved, `catalog_item_id` is set on the source collection item
- Multi-image storage for catalog items (up to 5 images, JSON array column)
- Image gallery on the public catalog item detail page
- Admin form updates to manage multiple images (add, remove, drag-to-reorder)

### Out of Scope

- Automatically creating a catalog item without admin review (no one-click publish)
- Syncing/updating an existing linked catalog item from a collection item
- Bulk copy of multiple collection items at once
- Image gallery support for user collection items (only catalog items)
- User-facing "suggest to catalog" flow (admin-only)
- A dedicated store-facing view (existing public catalog detail page is sufficient for now)

---

## Acceptance Criteria

1. **Admin sees the action**: On a collection item detail page, a "Copy to Catalog" button is visible and only rendered for admin users.
2. **Form pre-fill**: Clicking "Copy to Catalog" opens `/admin/catalog-items/new` with the name, description, first image, franchise, and line pre-populated from the source collection item.
3. **Editable pre-fill**: All pre-filled values are editable before the admin submits the form.
4. **Existing link warning**: If the collection item has a `catalog_item_id`, the admin sees a warning indicating a catalog entry is already linked before proceeding.
5. **Auto-link on save**: After the admin saves the new catalog item, the source collection item's `catalog_item_id` is automatically set to the newly created catalog item.
6. **Max 5 images enforced**: On the catalog item admin form, the UI prevents adding a 6th image and displays an error message when the limit is reached.
7. **Images persisted**: All images added to a catalog item (up to 5) are saved and displayed on the public catalog item detail page.
8. **Admin image management**: The admin can add, remove, and drag-to-reorder images for a catalog item in the create/edit form.
9. **Gallery on detail page**: The public catalog item detail page shows all images for that item (not just the primary one).
10. **No regression**: Existing catalog item create/edit functionality (single image, store linking) continues to work as before.

---

## Decisions Log

| # | Question | Decision |
|---|----------|----------|
| 1 | Where is the trigger shown? | Collection item **detail page** only |
| 2 | Auto-link after save? | Yes — `catalog_item_id` set automatically on the source collection item |
| 3 | Image ordering? | Upload order; drag-and-drop reordering available |
| 4 | Image storage? | JSON array column on `catalog_items` |
| 5 | Store-facing view? | Existing public catalog detail page — no new view needed for now |
