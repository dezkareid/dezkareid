# Spec: Avoid Duplicated Slugs

## Overview

When a user adds or edits a collection item, the slug is derived from the item's `name`. Currently, if another item in the user's collection already resolves to the same base slug, the system silently appends a numeric suffix (e.g., `barbie-2`). This creates an invisible, non-deterministic URL for the new item — the user never sees it, never chose it, and may be confused by it.

This feature gives the user explicit control over slug disambiguation: before an item is saved, if a name collision is detected, the user is shown a set of slug options derived from available item fields and can pick one. The system must also prevent the slug of an existing item from being changed during an edit.

## Business Context

- **Organic discoverability (SEO)**: Each item has a public URL containing its slug. Predictable, meaningful slugs improve SEO and directly support the 50% user-base growth target via improved discoverability.
- **Data integrity and auditability**: Once a slug is set, it becomes the permanent canonical URL for an item. Immutable slugs align with the "Integrity and Auditability" architecture principle and ensure external links, shares, and search-engine indexes never break.
- **High-quality user experience**: Showing the user a clear disambiguation UI — rather than silently mangling the URL — respects user intent and aligns with the "High-Quality User Experience" outcome.
- **Efficiency and velocity**: Standardising the slug-collision pattern here sets a reusable precedent for collections and catalog items.

## Requirements

### Duplicate Detection

1. **On item creation**: Before saving a new item, the system must check whether another item in the same collection already has a slug that collides with the slug derived from the submitted `name`.
2. **On item edit (name change)**: If the user changes an item's `name`, the system must re-run the same collision check against the new name within the same collection (excluding the item being edited).
3. **On item edit (no name change)**: If the `name` is unchanged, no collision check is needed — the item saves normally and the slug is never touched.

### Slug Options UI

4. When a collision is detected on create or edit, the system must **not** save the item. Instead, it must present the user with a list of slug options to choose from.
5. The available slug options are derived by combining the item's `name` with other fields. The system generates candidates in the following priority order; each option is only shown if the resulting slug **is not already taken** by another item in the same collection:

   | Priority | Option label | Slug formula | Condition |
   |---|---|---|---|
   | 1 | `name` + line | `slugify(name + line.name)` | `line` is selected |
   | 2 | `name` + variant | `slugify(name + variant)` | `variant` is set |
   | 3 | `name` + line + variant | `slugify(name + line.name + variant)` | both `line` and `variant` are set |
   | 4 | `name` + brand | `slugify(name + brand.name)` | `line` has a `brand` |
   | 5 | `name` + line + brand | `slugify(name + line.name + brand.name)` | `line` is selected and has a `brand` |
   | 6 | `name` + line + variant + brand | `slugify(name + line.name + variant + brand.name)` | all three fields present |
   | 7 | `name` + ID | `slugify(name) + "-" + shortAlphanumericId()` | always available as final fallback |

6. Each option whose slug is already taken is silently excluded — it does not appear in the list.
7. The "name + ID" fallback (priority 7) is **always present** regardless of other fields. The system generates a new short random alphanumeric ID until a free slug is found.
8. The user must select exactly one option before the item can be saved.
9. The list is presented in the priority order above so the most semantic option appears first.

### Slug Immutability

9. When editing an existing item, the system must never modify the item's `slug`, regardless of any changes to `name` or other fields.
10. The slug options UI is shown **only on item creation**. On edit, the slug is always preserved as-is — even if the new name would collide with another item's slug. The item saves with the updated name and the original unchanged slug. No disambiguation UI is shown during edit.

### Re-validation on Field Changes (Create only)

11. If the user changes the `name` on the create form after a collision was already detected (i.e., slug options are visible), the system must re-run the collision check against the new name and refresh the available options list.
12. If the updated name no longer causes a collision, the slug options UI must be dismissed and the item can be saved without a selection.
13. Re-validation does not apply to the edit form — the slug is never recalculated on edit.

## Scope

### In Scope

- Slug collision detection and options UI on **item creation** (AddItemForm).
- Slug immutability enforcement on **item edit** — name may change, slug never does (no slug field update in `updateItem`).
- Availability check for each option (remove taken options from the list), scoped to the same collection.
- Re-validation when the user changes the name after options are shown (create only).

### Out of Scope

- Slug collision handling for **collections** (separate concern).
- Slug collision handling for **admin catalog items** (separate concern).
- Allowing users to type a fully custom slug.
- Changing an existing item's slug via any user-facing flow.
- Bulk or import flows.

## Acceptance Criteria

1. **Create — no collision**: User fills in a name with no slug collision → item saves normally, no slug options UI appears.
2. **Create — collision detected**: User fills in a name that collides with an existing item's slug → item does not save; slug options UI appears showing only the available (non-taken) options.
3. **Create — all derived options taken**: Every field-based option (line, variant, brand combinations) slug is already taken → system must still offer the "name + ID" fallback option (regenerating a different alphanumeric ID until a free slug is found).
4. **Create — user selects option**: User picks one of the offered slug options → item saves with the selected slug.
5. **Edit — name unchanged**: User edits an item without changing the name → no collision check, item saves normally, slug is not changed.
6. **Edit — name changed, no collision**: User changes the name → item saves with the new name; slug remains unchanged.
7. **Edit — name changed, collision detected**: User changes the name to a value whose slug collides with another item in the same collection → item saves with the new name and the **original slug is preserved**. No disambiguation UI is shown.
8. **Options refreshed on name change**: After slug options appear, user changes the name again → the options list refreshes to reflect availability for the new name.
9. **Taken option removed**: A slug option whose resulting slug is already taken by another item must not appear in the list.
10. **Field-based options absent when fields not set**: If `variant` is empty, no `line` is selected, and no `brand` is available, only the "name + ID" fallback option appears.

## Decisions

1. **Slug on edit with collision**: On edit, the slug is always preserved as-is — no disambiguation UI is shown. The item saves silently with the original slug regardless of the new name. The options UI is a create-only concern.
2. **Automatic suffix format**: The fallback option uses a short random alphanumeric ID (e.g., 4–6 chars). The system retries until a free slug is found. Sequential counters are not used.
3. **Scope of collision check**: Collision checks are scoped to the specific collection the item belongs to. Two items with the same slug can exist in different collections of the same user.
