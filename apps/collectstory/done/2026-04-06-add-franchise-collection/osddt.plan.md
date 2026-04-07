# Plan: Add Franchise to Collection Item & Variants to Lines

## Architecture Overview

### Key Technical Decisions

- **Variants stored as JSONB on `lines`**: Add a `variants` column (`jsonb`, default `'[]'`) to the `lines` table. Each element is `{ value: string, display_name: string }`. No separate table, no IDs.
- **Variant stored as text on `collection_items`**: Add a `variant` column (`text`, nullable) to `collection_items`. Stores the raw `value` string from the selected variant.
- **JSONB typed in TypeScript** via a local `LineVariant` type (`{ value: string; display_name: string }`).
- **`getLinesByBrand` server action extended**: Returns `variants` alongside existing fields so the client can show/hide the variant selector without a second network call.
- **Display name resolved client-side**: The item detail view resolves the display name by matching the stored `variant` value against the line's `variants` array. Falls back to raw value if no match.
- **Supabase MCP** is used to create and apply migrations.
- **No new tables, no new foreign keys** for variants.

### Affected Files (summary)

| Area | Files |
|---|---|
| DB migration | new migration via `supabase migration new` |
| Types | `lib/supabase/types.ts` (regenerated after migration) |
| Server actions | `app/collection/actions.ts` — extend `getLinesByBrand`, `createCollectionItem`, add `updateItem` variant field |
| Admin server actions | `app/admin/lines/actions.ts` — extend `createLine` / `updateLine` to handle variants |
| Admin UI | `components/admin/LineForm.tsx` — add inline variant list editor |
| Admin edit page | `app/admin/lines/[id]/edit/page.tsx` — pass `variants` to `LineForm` |
| Item forms | `components/AddItemForm/AddItemForm.tsx`, `app/[username]/[collectionSlug]/items/new/AddItemPageForm.tsx`, `app/[username]/[collectionSlug]/items/[itemId]/edit/EditItemForm.tsx` |
| Item detail view | wherever item detail is rendered (show `variant` display name) |

---

## Implementation Phases

### Phase 1 — Database Migration

**Goal**: Add `variants` (JSONB) to `lines` and `variant` (text, nullable) to `collection_items`.

**Steps**:
1. Run `npx supabase migration new add_variants_to_lines_and_items` from `apps/collectstory/` to generate the migration file with the correct CLI timestamp.
2. Write the migration SQL:
   ```sql
   -- Add variants array to lines (default empty array)
   ALTER TABLE lines ADD COLUMN IF NOT EXISTS variants jsonb NOT NULL DEFAULT '[]'::jsonb;

   -- Add variant value to collection_items (nullable text)
   ALTER TABLE collection_items ADD COLUMN IF NOT EXISTS variant text;
   ```
3. Apply the migration via Supabase MCP (`mcp__supabase__apply_migration`).
4. Regenerate TypeScript types via Supabase MCP (`mcp__supabase__generate_typescript_types`) and update `lib/supabase/types.ts`.

---

### Phase 2 — Server Actions

**Goal**: Extend server actions to read/write the new fields.

**Steps**:

1. **`app/collection/actions.ts` — `getLinesByBrand`**: Add `variants` to the select query. Update the return type to include `variants: Array<{ value: string; display_name: string }>`.

2. **`app/collection/actions.ts` — `createCollectionItem`**: Read `variant` from `formData` (optional string) and pass it to the insert. Store `null` when empty.

3. **`app/[username]/[collectionSlug]/items/[itemId]/edit/actions.ts` — `updateItem`**: Read `variant` from `formData` and include it in the update payload. Store `null` when empty.

4. **`app/admin/lines/actions.ts` — `createLine` / `updateLine`**: Parse `variants` from `formData`. The form will submit variants as a JSON string in a hidden input (`name="variants_json"`). Parse and validate it as `LineVariant[]` before passing to Supabase.

---

### Phase 3 — Admin UI: Inline Variant Editor on LineForm

**Goal**: Allow admins to add/edit/remove variants (value + display name) inline on the line create/edit form.

**Steps**:

1. Add a `defaultVariants?: LineVariant[]` prop to `LineForm` in `components/admin/LineForm.tsx`.
2. Add client-side state: `variants: LineVariant[]` initialized from `defaultVariants`.
3. Render an inline list of row inputs for each variant: a `value` text input and a `display_name` text input, plus a "Remove" button per row.
4. Add an "+ Add Variant" button that appends a new empty row to the list.
5. Before form submission, serialize the `variants` state to JSON and set it in a hidden `<input name="variants_json">`.
6. Update `app/admin/lines/[id]/edit/page.tsx` to query `variants` from the `lines` row and pass it to `LineForm`.
7. Update `app/admin/lines/new/page.tsx` to pass `defaultVariants={[]}` (or omit, defaulting to empty).

---

### Phase 4 — Item Forms: Franchise + Variant Fields

**Goal**: Add franchise dropdown and variant selector to `AddItemPageForm` and `EditItemForm`; ensure variant selector is conditional and resets on line change.

#### 4a — `AddItemPageForm`

1. Add `franchises: { id: string; name: string }[]` prop.
2. Fetch franchises in the page (`app/[username]/[collectionSlug]/items/new/page.tsx`) via `getAllFranchises()` and pass to the form.
3. Render franchise `<select name="franchise_id">` with `— none —` as first option.
4. Update `Line` type to include `variants: LineVariant[]`.
5. Update `getLinesByBrand` call to receive variants.
6. Add `selectedVariants` state (derived from `selectedLine`).
7. Render variant `<select name="variant">` only when `selectedLine?.variants.length > 0`. Options: `— none —` (value `""`) + one per variant (value = `variant.value`, label = `variant.display_name`).
8. On `handleLineChange`: reset variant select to `""`.

#### 4b — `EditItemForm`

1. Add `franchises: { id: string; name: string }[]` and `currentFranchiseId: string | undefined` props.
2. Fetch franchises in the edit page and pass to the form.
3. Render franchise `<select name="franchise_id">` with current value.
4. Add `currentVariant: string | undefined` and `currentLineVariants: LineVariant[]` props (loaded from the existing line's variants at page render).
5. Update `Line` type and `getLinesByBrand` to include variants.
6. Add local `selectedVariants` state initialized from `currentLineVariants`. Reset on brand/line change.
7. Render variant `<select name="variant">` conditionally.

#### 4c — `AddItemForm` (modal)

The modal form already has franchise. Add variant support following the same pattern as 4a (steps 4–8), receiving variants from the extended `getLinesByBrand` response.

---

### Phase 5 — Item Detail View: Display Variant

**Goal**: Show variant display name on the collection item detail page.

**Steps**:

1. Locate the item detail view component/page.
2. Ensure the item query includes `variant` and the line query includes `variants`.
3. Resolve the display name: find the matching `LineVariant` by `value`. If found, show `display_name`. If not found (variant was removed from the line), show the raw stored value as fallback.
4. Only render the variant field when `item.variant` is non-null.

---

## Technical Dependencies

| Dependency | Notes |
|---|---|
| Supabase MCP | Used to apply migration and regenerate types |
| `@supabase/ssr` | Already installed — no change |
| `next/cache` `revalidatePath` | Already used in actions |

No new npm packages required.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| JSONB variants become stale (variant removed from line after item was created) | Spec requires fallback: show raw stored value if display name not found |
| `LineForm` is a client component — serializing variants to a hidden JSON input requires care to avoid XSS | Values are admin-entered, validated server-side before DB write. No user-generated content in this path. |
| `getLinesByBrand` is called from multiple client forms — adding `variants` changes the return shape | Update the shared `Line` type and all callers in the same PR; TypeScript will catch any mismatch |
| Supabase types are auto-generated — `variants` column type will be `Json` | Define a local `LineVariant` type and cast appropriately |

---

## Out of Scope

- No filtering or search by variant
- No bulk migration of existing items to assign variants
- No public variant directory
- No separate variants table or ID-based referencing
