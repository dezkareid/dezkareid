# Tasks: Avoid Duplicated Slugs

## Phase 1 — Database Migration

- [x] [S] Verify whether a `slugify()` Postgres function already exists via Supabase MCP; note result for Phase 1b
- [x] [M] Create migration to drop `collection_items_user_slug_unique` and add `collection_items_collection_slug_unique UNIQUE (collection_id, slug)`; scan for cross-collection slug duplicates first and include a dedup step if needed
- [x] [M] Create migration for `get_slug_options(p_collection_id, p_name, p_line_name, p_variant, p_brand_name, p_exclude_slug)` Postgres RPC that returns `TABLE(priority int, slug text, label text)` filtered to non-taken slugs in the collection
- [x] [S] Apply both migrations via `mcp__supabase__apply_migration` and verify via Supabase MCP

**Definition of Done**: `collection_items` has `UNIQUE (collection_id, slug)`; `get_slug_options` RPC callable from Supabase client; no existing data broken.

---

## Phase 2 — `lib/slug.ts` Update

> Depends on: Phase 1 complete (new constraint in place)

- [x] [S] Update `generateUniqueSlug` to accept `collectionId: string` instead of `userId: string` and filter `collection_items` by `collection_id`
- [x] [S] Update caller in `insertCollectionItem` (actions.ts) to pass `collection_id` from formData
- [x] [S] Update caller in `addItem` (actions.ts) to pass `collection_id` from formData
- [x] [S] Update caller in `copyItemToCollection` (actions.ts) to pass the resolved `collectionId`

**Definition of Done**: All callers compile; `generateUniqueSlug` queries by `collection_id`; TypeScript strict check passes.

---

## Phase 3 — `checkSlugCollision` Server Action

> Depends on: Phase 1 (RPC exists), Phase 2 (`generateUniqueSlug` updated)

- [x] [S] Add `SlugOption = { priority: number; slug: string; label: string }` type export to `actions.ts`
- [x] [M] Implement `checkSlugCollision(collectionId, name, lineName, variant, brandName): Promise<SlugOption[] | null>` Server Action in `actions.ts` — calls `get_slug_options` RPC; returns `null` when no collision (base slug is free)
- [x] [S] Extend `CreateItemState` discriminated union in `actions.ts` with `{ slugOptions: SlugOption[] }` branch
- [x] [S] Update `addItem` and `createCollectionItem` Server Actions to accept an explicit `slug` field from formData (user-chosen); skip `generateUniqueSlug` when slug is provided

**Definition of Done**: `checkSlugCollision` returns `null` for a free slug, returns non-empty array for a collision; chosen slug flows through to insert without re-generating.

---

## Phase 4 — `useSlugDisambiguation` Hook

> Depends on: Phase 3 (`checkSlugCollision` exported)

- [x] [S] Create `src/features/slug-picker/` slice with `index.ts`, `ui/`, `model/` folders
- [x] [M] Implement `useSlugDisambiguation` hook in `src/features/slug-picker/model/useSlugDisambiguation.ts`:
  - `checkCollision(name, lineName, variant, brandName, collectionId)` — calls `checkSlugCollision`, stores options
  - `selectedSlug`, `selectSlug(slug)`
  - `reset()` — clears options and selection
  - `needsSelection` derived boolean
- [x] [S] Export hook from `src/features/slug-picker/index.ts`

**Definition of Done**: Hook manages all collision state; `needsSelection` is `true` only when options are showing and nothing is selected; `reset()` clears everything.

---

## Phase 5 — `SlugPicker` UI Component

> Depends on: Phase 4 (hook types available)

- [x] [M] Implement `SlugPicker` component in `src/features/slug-picker/ui/SlugPicker.tsx`:
  - `<fieldset>` + `<legend>` with disambiguation prompt
  - One `<label>/<input type="radio">` per option showing `<code>{slug}</code>` + label
  - `required`, keyboard-navigable, accessible
- [x] [S] Add `SlugPicker.module.css` using design tokens only (no hardcoded values)
- [x] [S] Export `SlugPicker` from `src/features/slug-picker/index.ts`

**Definition of Done**: Component renders all options; selecting one fires `onSelect`; zero hardcoded color/spacing values; no critical/serious axe violations.

---

## Phase 6 — Wire into `AddItemPageForm`

> Depends on: Phase 3, Phase 4, Phase 5

- [x] [S] Extend `getLinesByBrand` return type to include `brandName: string | undefined` (needed for collision check)
- [x] [M] Integrate `useSlugDisambiguation` into `AddItemPageForm` (`app/[locale]/[username]/[collectionSlug]/items/new/AddItemPageForm.tsx`):
  - Two-phase `handleSubmit`: check collision first; only call `formAction` when `selectedSlug` is set or no collision
  - Add `data.set('slug', selectedSlug)` before `formAction` when a slug was chosen
  - Call `reset()` on name field change (debounced `onChange`)
  - Disable submit when `needsSelection` is true
- [x] [S] Render `<SlugPicker>` below the Name field when `slugOptions !== null`

**Definition of Done**: AC 1–4 and AC 8–10 pass; no TypeScript errors; form submits normally when no collision.

---

## Phase 7 — Wire into `AddItemForm` (modal variant)

> Depends on: Phase 3, Phase 4, Phase 5

- [x] [M] Integrate `useSlugDisambiguation` into `useAddItemFormLogic` hook in `components/AddItemForm/AddItemForm.tsx`:
  - Same two-phase `handleSubmit` logic as Phase 6
  - Pass `collectionId` and resolved `selectedLine.name` / `brandName` / `selectedVariant` into `checkCollision`
- [x] [S] Render `<SlugPicker>` inside `FormBody` below `<NameField>`

**Definition of Done**: Modal add flow has identical collision behaviour to the page form; both forms share the same hook.

---

## Phase 8 — Edit Form Verification

> No dependencies

- [x] [S] Confirm `updateItem` in `actions.ts` does not write `slug` in the `.update({...})` call (already correct — verify and leave as-is)
- [x] [S] Add a single-line comment on the `updateItem` `.update()` call: `// slug intentionally omitted — slugs are immutable after creation`

**Definition of Done**: AC 5–7 pass; `updateItem` compiles; no slug field in the update payload.

---

## Phase 9 — Tests

> Depends on: Phase 2, Phase 3, Phase 4, Phase 5 complete

All tests use **Vitest** + **React Testing Library**. Style: **BDD `describe/it`** with **table-driven cases** (`it.each`). Mock Supabase at the module level via `vi.mock`.

### Phase 9a — `lib/slug.ts` unit tests

- [x] [M] Write `lib/slug.test.ts` — unit tests for `toSlug` and `generateUniqueSlug`:
  ```
  describe('toSlug')
    it.each([
      ['normalises accents',      'Barbie Niña',     'barbie-nina'],
      ['trims leading/trailing',  '-hello-',         'hello'],
      ['collapses separators',    'a  b--c',         'a-b-c'],
      ['truncates at 60 chars',   'a'.repeat(70),    'a'.repeat(60)],
      ['empty string',            '',                ''],
    ])

  describe('generateUniqueSlug')
    it.each([
      ['returns base when collection is empty',    [],                       'barbie', 'barbie'],
      ['returns base when no collision',           ['other-slug'],           'barbie', 'barbie'],
      ['generates ID suffix on collision',         ['barbie'],               'barbie', /^barbie-[a-z0-9]+$/],
      ['retries until free slug found',            ['barbie','barbie-ab12'], 'barbie', /^barbie-[a-z0-9]+$/],
    ])
  ```

### Phase 9b — `useSlugDisambiguation` hook unit tests

- [x] [M] Write `src/features/slug-picker/model/useSlugDisambiguation.test.ts` using `renderHook`:
  ```
  describe('useSlugDisambiguation')
    describe('checkCollision')
      it('returns null and sets no options when base slug is free')
      it('sets slugOptions when collision is detected')
      it.each([
        ['with line only',            { lineName: 'Masters' }],
        ['with variant only',         { variant: 'Red' }],
        ['with line + variant',       { lineName: 'Masters', variant: 'Red' }],
        ['with brand only',           { brandName: 'Mattel' }],
        ['with all fields',           { lineName: 'Masters', variant: 'Red', brandName: 'Mattel' }],
      ])('passes correct args to checkSlugCollision — %s', ...)

    describe('selectSlug')
      it('sets selectedSlug')
      it('sets needsSelection to false after selection')

    describe('reset')
      it('clears slugOptions')
      it('clears selectedSlug')
      it('sets needsSelection to false')

    describe('needsSelection')
      it('is false when no options')
      it('is true when options present and no slug selected')
      it('is false when options present and slug selected')
  ```

### Phase 9c — `SlugPicker` component tests

- [x] [M] Write `src/features/slug-picker/ui/SlugPicker.test.tsx`:
  ```
  describe('SlugPicker')
    it.each([
      ['renders all options',         3 options → 3 radios],
      ['renders single option',       1 option  → 1 radio],
    ])

    it('calls onSelect with slug when radio is clicked')
    it('marks the selectedSlug radio as checked')
    it('renders slug inside <code> element')
    it('renders legend with disambiguation prompt')
    it('is keyboard-navigable (Tab moves between radios)')
  ```

### Phase 9d — `checkSlugCollision` Server Action integration test

- [x] [M] Write `lib/checkSlugCollision.test.ts` (or co-locate in `actions.test.ts`):
  ```
  describe('checkSlugCollision')
    it.each([
      ['no collision → returns null',          rpc returns [],        null],
      ['collision with options → returns list', rpc returns [rows],   SlugOption[]],
      ['all options taken → only ID fallback',  rpc returns [{priority:7,...}], [idOption]],
    ])
  ```
  Mock `createClient` and the `.rpc()` call via `vi.mock`.

**Definition of Done**: All test files pass `pnpm turbo run test --filter=@dezkareid/collectstory`; each `it.each` table has ≥ 3 rows where applicable; no `any` casts in test files.

---

## Phase 10 — Changeset

> Depends on: all phases complete

- [x] [S] Run `pnpm changeset` from monorepo root; select `@dezkareid/collectstory`; bump `minor`; summary: "Slug disambiguation UI on item creation: users now choose a unique URL when a name collision is detected"

**Definition of Done**: `.changeset/*.md` file committed alongside the feature changes.

---

## Dependencies Summary

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5 ──► Phase 6
                                                           └──► Phase 7
Phase 2, 3, 4, 5 ──► Phase 9 (tests)
Phase 8 (independent)
Phase 10 (last)
```
