# Spec: Add Franchise to Collection Item & Variants to Lines

## Overview

This feature extends the Collectstory data model and UI in two related areas:

1. **Franchise on Collection Item** — Ensure users can associate a collection item with a franchise when creating or editing it. The franchise field already exists on the `AddItemForm` modal, but is missing from the page-based item creation form and the item edit form.

2. **Variants on Lines** — Product lines (e.g., "Myth Cloth EX") can have multiple named variants (e.g., "OCE - Original Color Edition", "40th Anniversary"). When a user creates a collection item, they can optionally select one of those variants. The variant is stored as a plain text value on the item — not as a foreign key reference. The value can be null (no variant selected).

This improves catalog richness, supports deeper filtering and discoverability, and lets collectors accurately describe the exact edition of an item in their collection.

---

## Business Context

- **Innovation & Growth**: Richer item metadata (franchise + variant) increases the descriptive value of each collection entry, improving organic discoverability and SEO for franchise/variant-specific searches — directly supporting the goal of expanding the Collectstory user base.
- **High-Quality User Experience**: Consistent franchise and variant fields across all item creation and editing surfaces ensures a coherent, complete user experience.
- **Architecture Principles — Simplicity over Complexity**: Variants are stored as plain text strings on the item, not as a relational entity with its own IDs, keeping the model simple and avoiding premature normalization.
- **Architecture Principles — Configuration-Driven Behavior**: Variant options are defined on the line (admin-configurable) and surfaced dynamically in the UI, so variant lists can be updated without code changes.

---

## Requirements

### Franchise on Collection Item

1. The franchise field must be present and functional in **all** item creation forms:
   - Modal-based form (`AddItemForm`)
   - Page-based new item form (`AddItemPageForm`)
2. The franchise field must be present and functional in the **item edit form** (`EditItemForm`).
3. The franchise field is **optional** — a collection item can be saved without a franchise.
4. When a franchise is selected, it is stored as a foreign key (`franchise_id`) on the collection item. This is the existing behavior.

### Variants on Lines

5. An admin can define a list of **variants** for a given line (e.g., for "Myth Cloth EX": value `"oce"` / display `"OCE - Original Color Edition"`). Each variant has a **stored value** and a **display name**.
6. Variants are plain objects (value + display name) — they have no independent ID and carry no relational meaning beyond belonging to a line.
7. A line can have zero or more variants.
8. When creating or editing a collection item, if the selected line has variants defined, a **variant selector** is shown.
9. The user can select one variant or leave it blank (null).
10. The selected variant's **stored value** is saved on the collection item (plain text, not a foreign key). The display name is not stored on the item.
11. If the selected line has no variants defined, the variant selector is hidden.
12. If the user changes the selected line, the variant selector resets (clears the previously selected variant).

---

## Scope

### In Scope

- Add franchise field to `AddItemPageForm` (page-based new item form)
- Add franchise field to `EditItemForm` (item edit form)
- Add a `variants` field (array of `{value, display_name}` objects) to the `lines` table — managed inline in the line edit page in the admin panel
- Add a `variant` field (nullable string) to the `collection_items` table
- Admin UI to add/edit/remove variant names on a line
- Variant selector in `AddItemForm`, `AddItemPageForm`, and `EditItemForm` — shown only when the selected line has variants
- Display the variant value on the collection item detail view (if set)

### Out of Scope

- Variants are not a standalone entity — no separate variants table with IDs
- No filtering or search by variant (can be considered in a future iteration)
- No bulk migration of existing items to assign variants retroactively
- No public variant directory or variant landing pages

---

## Acceptance Criteria

1. **Franchise in page form**: A user creating a new item via the page-based form can select a franchise. The selected franchise is saved correctly.
2. **Franchise in edit form**: A user editing an existing item can change or clear the franchise. The change is saved correctly.
3. **Admin variant management**: An admin can open a line in the admin panel and add, edit, or remove variant names (plain strings). Changes are persisted.
4. **Variant selector appears**: When a user selects a line that has variants defined, a variant dropdown or select appears in the item form.
5. **Variant selector hidden**: When a user selects a line with no variants, no variant selector is shown.
6. **Variant resets on line change**: If the user changes the selected line, the variant field is cleared.
7. **Variant is optional**: A user can save an item without selecting a variant (variant value is null).
8. **Variant saved as text**: The variant's stored value is saved as a plain string on the collection item — not as an ID reference.
9. **Variant displayed**: On the item detail view, if a variant is set, its display name is shown (resolved from the line's variant list). If the line's variant list no longer contains a matching value, the raw stored value is shown as a fallback.
10. **No regression**: Existing items without a variant continue to work correctly.

---

## Decisions

1. **Admin UI for variants**: Variant management is inline on the line edit page — a list of inputs within the existing line form.
2. **Variant selector UX**: Strict select/dropdown with an empty option (null) available to deselect.
3. **Variant display label**: Each variant has two fields — a stored value and a separate display name. The display name is shown to users; the stored value is saved on the collection item.
