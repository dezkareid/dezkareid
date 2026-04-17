# Plan: Avoid Duplicated Slugs

## Architecture Overview

The feature is implemented in three layers:

1. **Database** — replace the existing `UNIQUE (user_id, slug)` constraint on `collection_items` with `UNIQUE (collection_id, slug)`, scoping uniqueness to a collection instead of a user.

2. **Server** — a new Supabase RPC function (`get_slug_options`) that, given a `collection_id`, a `name`, and optional `line_name`/`variant`/`brand_name`, returns a ranked list of candidate slugs that are not already taken in that collection. The `generateUniqueSlug` helper in `lib/slug.ts` is updated to query by `collection_id` instead of `user_id`. The `updateItem` Server Action is confirmed slug-safe already (does not write `slug`).

3. **Client** — the `AddItemPageForm` (and the shared `AddItemForm` used by modals) gains a two-phase submit flow:
   - **Phase 1 (check)**: on submit, a Server Action (`checkSlugCollision`) runs the collision check. If no collision → immediately proceed to save (Phase 2). If collision → return a `{ slugOptions: SlugOption[] }` payload and render the slug picker UI inline.
   - **Phase 2 (save)**: user selects a slug option and re-submits; the chosen slug is included in the `FormData` as a hidden field, bypassing `generateUniqueSlug`.

The slug picker is a new FSD feature slice: `src/features/slug-picker/`. The `EditItemForm` requires no UI changes — only verifying that `updateItem` never writes the `slug` field (already correct).

### Key Decisions

- **Supabase RPC for candidate checking**: a single `get_slug_options` database function computes all candidate slugs and checks availability in one round-trip, avoiding N+1 queries from the server action.
- **No new route or API endpoint**: the collision check is a Server Action (`checkSlugCollision`) callable directly from the Client Component via `useActionState`. This avoids introducing a Route Handler for what is purely a form interaction.
- **Two-phase `useActionState`**: `ActionState` is extended with a `slugOptions` discriminant. The existing `useActionState` loop handles both phases — check returns options, save returns success.
- **`AddItemForm` (modal variant) and `AddItemPageForm` (page variant) diverged**: both need the slug-picker integration. The shared logic will be extracted into a custom hook `useSlugDisambiguation` placed in `src/features/slug-picker/model/`.

---

## Implementation Phases

### Phase 1 — Database Migration

**Goal**: Change the uniqueness scope from per-user to per-collection.

Steps:
1. Create migration `YYYYMMDD_change_slug_unique_to_collection.sql`:
   ```sql
   ALTER TABLE collection_items
     DROP CONSTRAINT collection_items_user_slug_unique,
     ADD CONSTRAINT collection_items_collection_slug_unique UNIQUE (collection_id, slug);
   ```
2. Create migration `YYYYMMDD_create_get_slug_options_fn.sql` — a Postgres function:
   ```sql
   CREATE OR REPLACE FUNCTION get_slug_options(
     p_collection_id uuid,
     p_name         text,
     p_line_name    text DEFAULT NULL,
     p_variant      text DEFAULT NULL,
     p_brand_name   text DEFAULT NULL,
     p_exclude_slug text DEFAULT NULL   -- for edit: exclude the item's own slug
   )
   RETURNS TABLE (priority int, slug text)
   LANGUAGE plpgsql STABLE SECURITY DEFINER
   AS $$
   DECLARE
     base text := slugify(p_name);
     ...
   END;
   $$;
   ```
   The function builds up to 7 candidate slugs (matching the spec priority table), filters out any already present in `collection_items` for that `collection_id`, and returns the survivors ordered by priority. The `p_exclude_slug` parameter supports edit flows (not needed for UI but makes the function reusable).

   > `slugify()` is already present in the database as a Postgres helper. Confirm via Supabase MCP before writing — if absent, inline the logic.

3. Apply both migrations via `mcp__supabase__apply_migration`.

---

### Phase 2 — `lib/slug.ts` Update

**Goal**: Fix `generateUniqueSlug` to scope by `collection_id` instead of `user_id`.

Steps:
1. Update `generateUniqueSlug` signature: add `collectionId: string`, remove `userId: string` from the query filter.
2. Query `collection_items` filtered by `collection_id` (not `user_id`) for the `%base%` like check.
3. Update all callers:
   - `insertCollectionItem` in `actions.ts` — pass `collection_id` from `formData`.
   - `addItem` in `actions.ts` — same.
   - `copyItemToCollection` in `actions.ts` — pass the resolved `collectionId`.
4. Leave `generateUniqueCollectionSlug` untouched (collections are still per-user).

---

### Phase 3 — `checkSlugCollision` Server Action

**Goal**: A lightweight Server Action that calls `get_slug_options` and returns slug options to the client.

Location: `app/[locale]/[username]/[collectionSlug]/actions.ts`

```ts
export type SlugOption = { priority: number; slug: string; label: string };

export type CreateItemState
  = | { error: string }
  | { slugOptions: SlugOption[] }   // collision detected — user must pick
  | { success: true }
  | undefined;

export async function checkSlugCollision(
  collectionId: string,
  name: string,
  lineName: string | undefined,
  variant: string | undefined,
  brandName: string | undefined,
): Promise<SlugOption[] | null> { ... }
```

The `label` field is a human-readable string derived from the slug formula for display (e.g. `"name + line"`, `"name + variant"`, `"name + ID"`).

---

### Phase 4 — `useSlugDisambiguation` Hook

**Goal**: Extract the collision-check + option-selection state machine into a reusable hook.

Location: `src/features/slug-picker/model/useSlugDisambiguation.ts`

Responsibilities:
- Holds `slugOptions: SlugOption[] | null` state.
- Exposes `checkCollision(name, lineName, variant, brandName, collectionId)` — calls `checkSlugCollision` Server Action.
- Exposes `selectedSlug: string | null` and `selectSlug(slug: string)`.
- Exposes `reset()` — clears options (called when name field changes).
- Returns `needsSelection: boolean` (true when options are showing and nothing is selected yet).

The hook is called from both `AddItemPageForm` and `AddItemForm`.

---

### Phase 5 — `SlugPicker` UI Component

**Goal**: Render the disambiguation options list.

Location: `src/features/slug-picker/ui/SlugPicker.tsx` + `SlugPicker.module.css`

Props:
```ts
type Props = {
  options: SlugOption[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
};
```

Renders a `<fieldset>` with a `<legend>` ("This name is already taken. Choose a URL for your item:") and one `<label>/<input type="radio">` per option. Each radio shows the full slug as a `<code>` block plus a human label (e.g. "name + line"). Accessible: keyboard-navigable, `required`, `aria-describedby`.

CSS uses design tokens only — no hardcoded values.

---

### Phase 6 — Wire into `AddItemPageForm`

**Goal**: Integrate the two-phase flow into the page-level add form.

Steps:
1. Import `useSlugDisambiguation` and `SlugPicker` from `@/src/features/slug-picker`.
2. Modify `handleSubmit`:
   - If `slugOptions` is null → run `checkCollision(...)`. If options come back → store them and **do not** call `formAction`. Return.
   - If `slugOptions` is not null and `selectedSlug` is set → add `data.set('slug', selectedSlug)` then call `formAction`.
3. Add `<SlugPicker>` below the Name field, shown only when `slugOptions !== null`.
4. On name field change (`onBlur` or debounced `onChange`), call `reset()` to dismiss stale options.
5. Disable submit button when `needsSelection` is true.
6. Update `addItem` Server Action: if `slug` is present in `formData` (the user-chosen one), use it directly and skip `generateUniqueSlug`.

---

### Phase 7 — Wire into `AddItemForm` (modal variant)

**Goal**: Same integration for the modal-based add form in `components/AddItemForm/AddItemForm.tsx`.

Steps:
1. Import `useSlugDisambiguation` into `useAddItemFormLogic`.
2. Patch `handleSubmit` with the same two-phase logic as Phase 6.
3. Render `<SlugPicker>` inside `FormBody` below `<NameField>`.
4. Pass `collectionId` and the resolved line/brand names from `selectedLine` into `checkCollision`.

---

### Phase 8 — Edit Form Verification

**Goal**: Confirm `updateItem` never touches `slug` and no cleanup is needed.

Steps:
1. Verify `updateItem` in `actions.ts` — the `.update({...})` call already omits `slug` ✓ (confirmed by reading the source).
2. No UI changes needed in `EditItemForm`.
3. Add a JSDoc comment on `updateItem` noting slug immutability is intentional.

---

### Phase 9 — Changeset

**Goal**: Document the release.

```bash
pnpm changeset
# select @dezkareid/collectstory, minor
# "Slug disambiguation UI on item creation: users now choose a unique URL when a name collision is detected"
```

---

## Technical Dependencies

| Dependency | Notes |
|---|---|
| Supabase `get_slug_options` RPC | New Postgres function; must be created before server action |
| `slugify()` Postgres function | May already exist — verify via Supabase MCP before Phase 1 |
| `mcp__supabase__apply_migration` | Used to push migrations |
| `@tanstack/react-query` | Already used in `AddItemForm` for lines; no new dep needed |
| Design tokens | `SlugPicker` CSS uses existing tokens only |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| `slugify()` Postgres function absent | Check via Supabase MCP before writing `get_slug_options`; inline slug logic if missing |
| Migration timestamp mismatch (local vs remote) | Follow CLAUDE.md: rename local file to match remote timestamp shown in error |
| Existing items have duplicate slugs across collections after constraint change | Query for duplicates before applying migration; add a dedup step if needed |
| `AddItemForm` (modal) and `AddItemPageForm` (page) divergence | Both use the same `useSlugDisambiguation` hook — single source of truth for the state machine |
| Two-phase submit breaks the existing `useActionState` loop | Use discriminated union on `ActionState`; the existing `useEffect` on `state` already checks for `'success' in state` |
| Brand name not available in `AddItemPageForm` (brand is a select, not fetched with name) | `getLinesByBrand` returns lines that include brand context; extend the return type to include `brandName` |

---

## Out of Scope

- Slug collision handling for collections.
- Slug collision handling for admin catalog items.
- Allowing users to type a fully custom slug.
- Retroactively changing slugs on existing items.
- Bulk or import flows.
