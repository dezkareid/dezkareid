# Feature Specification: Catalog Items & Store Relations

## Overview

This feature introduces a **Catalog** — a global, admin-managed directory of known collectible products (catalog items). Catalog items serve as a shared reference layer that bridges the gap between a user's personal collection items and the stores where those items can be purchased.

Currently, users can link their collection items to stores via a junction table, but there is no structured product catalog to anchor those relationships. By introducing catalog items, the platform gains a verified, canonical product registry that collectors can reference when logging where they bought or can buy a specific collectible.

This feature supports the platform's goal of helping collectors know **where to buy** a collection item.

---

## Business Context

### Alignment with Company Outcomes

- **Innovation & Growth**: A catalog of known products enriches the platform with structured, discoverable content — improving organic discoverability (SEO) through canonical product pages and driving user base growth.
- **High-Quality User Experience**: Providing a verified product reference reduces manual data entry for users and improves the quality and consistency of collection item metadata.
- **Efficiency & Velocity**: Admin-managed catalog items standardize a common business pattern (product registry → store availability), reducing one-off user data fragmentation.

### Alignment with Architecture Principles

- **Native Discoverability**: Catalog items as a canonical product registry can carry structured data (schema.org), improving search indexing.
- **Integrity and Auditability**: Admin-managed catalog ensures data quality and provides a clear audit trail for product information.
- **Simplicity over Complexity**: The catalog reuses existing admin CRUD patterns and the established store relationship model (`collection_item_stores`).

---

## Requirements

### Catalog Item Management (Admin)

1. Admins can create a new catalog item with the following attributes:
   - **Name** (required) — the product name
   - **Slug** (required, auto-generated from name) — URL-friendly identifier
   - **Description** (optional) — a text description of the product
   - **Image** (optional) — a representative product image
   - **Franchise** (optional) — links the catalog item to an existing franchise (IP)
   - **Line** (optional) — links the catalog item to an existing product line

2. Admins can edit any catalog item's attributes.

3. Admins can delete a catalog item. Deleting a catalog item must not delete user collection items — the relation is severed but the collection item remains.

4. Admins can view a paginated list of all catalog items in the admin panel.

5. Admins can search/filter catalog items by name in the admin panel.

### Catalog Item Visibility (Public)

6. Catalog items are publicly readable by all users (authenticated or not).

7. Only admins can create, edit, or delete catalog items.

### Store Associations (Admin)

8. Admins can associate one or more stores with a catalog item, indicating that the product is available for purchase at those stores.

9. Admins can remove a store association from a catalog item.

10. The list of stores linked to a catalog item is publicly visible.

### Collection Item → Catalog Item Relation (User)

11. When a user creates or edits a collection item, they can optionally link it to a catalog item from the catalog.

12. A collection item can be linked to at most one catalog item.

13. The link is optional — existing collection items without a catalog item reference remain valid.

14. When a collection item is linked to a catalog item, the stores associated with that catalog item are surfaced on the collection item detail view as "Where to buy" suggestions.

15. Users can unlink a collection item from its catalog item at any time.

---

## Scope

### In Scope

- Admin CRUD for catalog items (create, read, update, delete)
- Admin UI for associating stores with catalog items
- Optional `catalog_item_id` foreign key on `collection_items`
- Public read access to catalog items and their store associations
- "Where to buy" store suggestions on collection item detail view, derived from the linked catalog item
- Admin list/search view for catalog items

### Out of Scope

- User-submitted catalog items (catalog is admin-managed only)
- Merging or de-duplicating existing collection item data into the catalog
- Pricing information or stock availability at stores
- Notifications to users when stores are added to a catalog item they own
- Catalog item ratings or reviews
- Bulk import of catalog items

---

## Acceptance Criteria

1. **Admin can manage catalog items**: An admin user can navigate to `/admin/catalog-items`, create a new catalog item, edit it, and delete it. Non-admin users cannot access these routes.

2. **Catalog item fields are validated**: Creating a catalog item without a name fails with a clear error. Slug is auto-generated from the name and is unique.

3. **Admin can link stores to a catalog item**: On the catalog item edit page, an admin can add and remove store associations. Changes are reflected immediately.

4. **Collection item can be linked to a catalog item**: When creating or editing a collection item, a user can search for and select a catalog item. The selection is saved and persisted.

5. **Collection item can exist without a catalog item**: Users with existing collection items not linked to any catalog item see no regression in functionality.

6. **"Where to buy" stores are shown**: On a collection item detail page, when the item is linked to a catalog item that has store associations, those stores are displayed in a "Where to buy" section.

7. **Deleting a catalog item does not delete collection items**: If an admin deletes a catalog item, the associated collection items remain intact; the `catalog_item_id` field is set to null (cascade nullify).

8. **Public users can browse catalog**: Unauthenticated users can view catalog items and their store associations (if a public catalog page is provided).

---

## Decisions

1. **Public catalog browse page**: The catalog is public. There will be a public `/catalog` browse page and `/catalog/[slug]` detail pages where anyone can see catalog items and the stores that carry them. Store associations on catalog items power the "Where to buy" experience on collection item detail pages.

2. **Catalog item search UX**: Autocomplete — the input recommends catalog items based on the search term and similarity with item attributes (name, franchise, line).

3. **Store association ownership**: Admin only — only admins can associate or remove stores from a catalog item.

4. **Relation to existing `collection_item_stores` junction**: Replace — the direct item→store junction is removed. Stores are surfaced exclusively through the catalog item relation going forward.

5. **Image hosting**: Catalog item images use the existing Cloudinary setup, same as collection items and franchises.
