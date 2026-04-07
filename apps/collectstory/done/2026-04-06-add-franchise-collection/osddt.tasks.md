# Tasks: Add Franchise to Collection Item & Variants to Lines

## Phase 1 — Database Migration

- [x] [S] Create migration file via `npx supabase migration new add_variants_to_lines_and_items` from `apps/collectstory/`
- [x] [S] Write migration SQL: add `variants jsonb NOT NULL DEFAULT '[]'::jsonb` to `lines` and `variant text` (nullable) to `collection_items`
- [x] [S] Apply migration via Supabase MCP (`mcp__supabase__apply_migration`)
- [x] [S] Regenerate TypeScript types via Supabase MCP and update `lib/supabase/types.ts`

**Definition of Done**: Migration applied to remote DB; `lib/supabase/types.ts` reflects the two new columns.

---

## Phase 2 — Server Actions

> Depends on Phase 1 (types must be updated first)

- [x] [S] Define shared `LineVariant` type (`{ value: string; display_name: string }`) — add to `app/collection/actions.ts` or a shared types file
- [x] [S] Extend `getLinesByBrand` in `app/collection/actions.ts` to select and return `variants` per line
- [x] [S] Extend `createCollectionItem` in `app/collection/actions.ts` to read `variant` from `formData` and include it in the insert (null when empty)
- [x] [S] Extend `updateItem` in `app/[username]/[collectionSlug]/items/[itemId]/edit/actions.ts` to read `variant` from `formData` and include it in the update (null when empty)
- [x] [S] Extend `createLine` in `app/admin/lines/actions.ts` to parse `variants_json` from `formData` and save it to the `variants` column
- [x] [S] Extend `updateLine` in `app/admin/lines/actions.ts` to parse `variants_json` from `formData` and save it to the `variants` column

**Definition of Done**: All server actions compile without TypeScript errors; `getLinesByBrand` returns variants; create/update actions persist variant data.

---

## Phase 3 — Admin UI: Inline Variant Editor

> Depends on Phase 2

- [x] [M] Add `defaultVariants?: LineVariant[]` prop to `LineForm` (`components/admin/LineForm.tsx`)
- [x] [M] Add client-side state for variants list in `LineForm`; render inline rows with `value` + `display_name` inputs and a "Remove" button per row
- [x] [S] Add "+ Add Variant" button to `LineForm` that appends an empty row
- [x] [S] Serialize variants to JSON in a hidden input (`name="variants_json"`) on form submit
- [x] [S] Update `app/admin/lines/[id]/edit/page.tsx` to query `variants` from the line row and pass to `LineForm`
- [x] [S] Update `app/admin/lines/new/page.tsx` to pass `defaultVariants={[]}` (or omit, defaulting to empty)

**Definition of Done**: Admin can add, edit, and remove variants on any line; changes persist after save.

---

## Phase 4 — Item Forms: Franchise + Variant Fields

> Depends on Phase 2

### 4a — `AddItemPageForm`

- [x] [S] Add `franchises: { id: string; name: string }[]` prop to `AddItemPageForm`
- [x] [S] Fetch franchises in `app/[username]/[collectionSlug]/items/new/page.tsx` via `getAllFranchises()` and pass to form
- [x] [S] Render franchise `<select name="franchise_id">` with `— none —` as first option in `AddItemPageForm`
- [x] [M] Update `Line` type in `AddItemPageForm` to include `variants: LineVariant[]`; add `selectedVariants` state; render variant `<select name="variant">` conditionally (only when selected line has variants); reset on line change

### 4b — `EditItemForm`

- [x] [S] Add `franchises`, `currentFranchiseId`, `currentVariant`, and `currentLineVariants` props to `EditItemForm`
- [x] [S] Fetch franchises and current line variants in the edit page and pass to `EditItemForm`
- [x] [S] Render franchise `<select name="franchise_id">` with current value in `EditItemForm`
- [x] [M] Add variant `<select name="variant">` (conditional, resets on line change) with current value pre-selected in `EditItemForm`

### 4c — `AddItemForm` (modal)

- [x] [M] Update `Line` type in `AddItemForm` to include `variants`; add variant `<select name="variant">` conditional on selected line having variants; reset on line change

**Definition of Done**: Franchise dropdown present and functional in all three forms; variant selector appears/disappears based on selected line; variant value submitted with form.

---

## Phase 5 — Item Detail View: Display Variant

> Depends on Phase 2

- [x] [S] Locate item detail view and ensure `variant` is included in the item query
- [x] [S] Ensure the line's `variants` array is available in the item detail query/props
- [x] [S] Render variant display name (resolved from line variants by value, fallback to raw value); only render when `item.variant` is non-null

**Definition of Done**: Variant display name shown on item detail view; falls back gracefully if variant value no longer exists in the line's list.

---

## Dependencies Summary

```
Phase 1 → Phase 2 → Phase 3
                  → Phase 4
                  → Phase 5
```

Phases 3, 4, and 5 can proceed in parallel once Phase 2 is done.
