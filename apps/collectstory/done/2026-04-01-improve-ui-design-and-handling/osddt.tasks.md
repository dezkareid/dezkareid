# Task List: Improve UI Design and Error Handling

## Dependencies

```
Phase 1 → Phase 3, 4, 5, 6, 7, 8, 9  (utilities must exist before UI work)
Phase 2 → Phase 8, 9                  (schema must exist before store UI and admin)
Phase 3 → Phase 10
Phase 4 → Phase 10
Phase 5 → Phase 10
Phase 6 → Phase 10
Phase 7 → Phase 10
Phase 8 → Phase 10
Phase 9 → Phase 10
```

---

## Phase 1 — CSS Utilities Extension

**Definition of Done**: `dist/utilities.css` and `dist/main.css` contain `.u-focus-ring`, `.u-touch-target`, and `.u-truncate-2`. Package builds cleanly via Turbo.

- [x] [S] Read `design-system/css/src/utilities/` to identify correct file for additions
- [x] [S] Add `.u-focus-ring` utility to `@dezkareid/css` utilities layer
- [x] [S] Add `.u-touch-target` utility to `@dezkareid/css` utilities layer
- [x] [S] Add `.u-truncate-2` utility to `@dezkareid/css` utilities layer
- [x] [S] Ensure `src/main.scss` forwards the updated utilities partial
- [x] [S] Build `@dezkareid/css`: `pnpm turbo run build --filter=@dezkareid/css`
- [x] [S] Verify new classes appear in `dist/utilities.css` and `dist/main.css`

---

## Phase 2 — Database Schema: Store Model Redesign

**Definition of Done**: `stores` table has `verified` and `visible` columns; `collection_item_stores` join table exists with correct RLS; smoke tests pass via Supabase MCP.

- [x] [S] Create migration via Supabase MCP: `stores_verified_and_visible` — add `verified` and `visible` columns to `stores`
- [x] [S] Create migration via Supabase MCP: `collection_item_stores` — create many-to-many join table
- [x] [M] Create migration via Supabase MCP: `stores_rls_and_item_links` — update RLS policies (public read on visible only, admin-only write on stores and join table, create `item_links` table with owner-scoped RLS)
- [x] [S] Apply migrations via Supabase MCP (`supabase db push` or `apply_migration`)
- [x] [S] Smoke-test via Supabase MCP `execute_sql`: verify columns, join table, and policies exist

---

## Phase 3 — Home Page UI Improvements

**Definition of Done**: Stores section absent from home page; Lighthouse mobile performance ≥ 90 and accessibility ≥ 90 via Chrome MCP; no heading violations; no horizontal overflow at 320px.

- [x] [S] Remove "Stores Directory" feature card from `app/page.tsx`
- [x] [S] Rebalance features section to 2-column layout on desktop (update `app/page.module.css`)
- [x] [S] Audit and fix heading hierarchy in `app/page.tsx` (one `<h1>`, sequential `<h2>`/`<h3>`)
- [x] [S] Add descriptive `alt` text to all `<Image>` components; mark decorative images `alt=""`
- [x] [S] Replace hand-rolled focus styles with `.u-focus-ring` on interactive elements
- [x] [S] Ensure all CTA buttons have descriptive accessible names
- [x] [M] Rewrite `app/page.module.css` breakpoints mobile-first (`min-width` instead of `max-width`)
- [x] [S] Hero section: single-column on mobile, 2-column at 1024px+
- [x] [S] CTA buttons: full-width on mobile, `width: auto` at 640px+; min-height 44px
- [x] [S] Features section: single column on mobile, 2-column at 640px+
- [x] [S] Verify no unintentional horizontal overflow at 320px
- [x] [S] Confirm hero `<Image>` has `priority` prop and accurate `sizes` attribute

---

## Phase 4 — Collection Page UI Improvements

**Definition of Done**: No store UI on collection page; empty state has clear CTA; `error.tsx` exists; item grid is single-column at 320px; Lighthouse mobile ≥ 90 for both scores.

- [x] [S] Audit `app/collection/page.tsx` and `CollectionItemCard.tsx` — confirm no store data fetched or rendered
- [x] [S] Improve empty state: descriptive `<h2>`, supporting text, `<Button>` CTA with `.u-touch-target`
- [x] [S] Add `aria-live="polite"` wrapper around the items section
- [x] [S] Wrap item grid in `<ul role="list" aria-label="Your collection">` with `<li>` per card
- [x] [S] Ensure "Add Item" trigger button has a clear accessible name
- [x] [M] Audit `AddItemModal`: confirm `<dialog>`, `aria-modal="true"`, `aria-labelledby`, focus trap, Escape key close
- [x] [M] Rewrite `app/collection/page.module.css` breakpoints mobile-first
- [x] [S] Item grid: 1 column at 320px, 2 columns at 480px+, auto-fill at 768px+
- [x] [S] "Last Additions" strip: add `padding-inline` to prevent edge bleed on mobile
- [x] [S] Page header: stack title and "Add Item" button vertically on mobile, side-by-side at 640px+
- [x] [S] Ensure strip has `scroll-snap-type: x mandatory` and touch scroll support
- [x] [M] Create `app/collection/error.tsx` — client component with readable message and retry button

---

## Phase 5 — Collection Layout Header Improvements

**Definition of Done**: Avatar and sign-out always visible on mobile; sign-out meets 44px touch target; nav has `aria-label`; keyboard tab order is logical.

- [x] [S] Verify avatar + sign-out button visible on viewports below 480px
- [x] [S] Apply `.u-touch-target` to sign-out button
- [x] [S] Confirm admin link is absent for non-admin users (verify role-check logic)
- [x] [S] Add `<nav aria-label="App navigation">` wrapper around header nav links
- [x] [S] Verify keyboard tab order: logo → admin link (if visible) → profile link → sign-out

---

## Phase 6 — Error Handling Improvements

**Definition of Done**: No raw DB errors exposed to users; all field errors are associated via `aria-describedby`; form stays filled on error; image upload shows retry affordance; `TODO(design-system)` comment added for `--color-error`.

- [x] [M] Audit all `catch` blocks in `app/collection/actions.ts` — map Supabase error codes to human-readable messages
- [x] [S] Add friendly message for unique constraint violation (`23505`)
- [x] [S] Add friendly message for foreign key violation (`23503`)
- [x] [S] Add generic fallback error message for unhandled errors
- [x] [S] Add `id` attributes to all form inputs in `AddItemForm.tsx`
- [x] [M] Render field-level errors adjacent to their input with `role="alert"` and `aria-describedby` linkage
- [x] [S] Ensure global form error (`state.error`) uses `role="alert"`
- [x] [S] Add image upload retry affordance: re-enable upload input on failure, show "Upload failed — try again" message
- [x] [S] Ensure form fields remain populated when a submission error occurs (no reset on error)
- [x] [S] Add `TODO(design-system)` comment in `AddItemForm.module.css` for missing `--color-error` token

---

## Phase 7 — CollectionItemCard Accessibility & Mobile

**Definition of Done**: Card uses `<article>` with `aria-label`; image has meaningful `alt`; tags use list markup; date uses `<time>`; description uses `.u-truncate-2`; renders correctly at 320px.

- [x] [S] Wrap card in `<article aria-label={item.name}>` in `CollectionItemCard.tsx`
- [x] [S] Set `<Image>` `alt` to `item.name` (or `""` if purely decorative fallback)
- [x] [S] Wrap tags in `<ul aria-label="Tags">` with `<li>` per tag
- [x] [S] Wrap date in `<time dateTime={item.date_acquired}>`
- [x] [S] Replace duplicated two-line clamp on description with `.u-truncate-2` utility class
- [x] [S] Verify card renders without layout breakage at 320px in `CollectionItemCard.module.css`
- [x] [S] Confirm `ITEM_SELECT` query does not join `collection_item_stores`

---

## Phase 8 — "Where to Find It" Section: Store Display + Item Links

**Definition of Done**: Item detail page renders stores (read-only) above user links; item owner can add/remove links; verified stores show checkmark badge; all error states use `role="alert"`; links are hidden from non-owners.

- [x] [M] Add `addItemLink(itemId, url, label?)` Server Action to `app/collection/actions.ts` — validate URL, insert into `item_links`
- [x] [M] Add `removeItemLink(linkId)` Server Action to `app/collection/actions.ts`
- [x] [L] Create `components/ItemLinksManager/ItemLinksManager.tsx` — client component with links list, add form (URL + optional label), remove button per link
- [x] [M] Create `components/ItemLinksManager/ItemLinksManager.module.css` — design-token-only styles
- [x] [S] Client-side URL validation in `ItemLinksManager` with field-level `role="alert"` error
- [x] [S] Create inline SVG verified checkmark badge with `aria-label="Verified store"`
- [x] [M] Update item detail page (`app/[username]/[collectionSlug]/[slug]/page.tsx`) to fetch joined stores (read-only) and `item_links` (owner-only)
- [x] [M] Render "Where to find it" section: stores list (read-only, with verified badge) above `<ItemLinksManager>` (owner-only)
- [x] [S] If no stores and no links and viewer is owner, show prompt: "Add a link to where this item can be found"
- [x] [S] Verify stores list is visible to all visitors; `ItemLinksManager` renders only for the item owner

---

## Phase 9 — Admin: Store Verified Toggle, Soft-Delete & Item Association

**Definition of Done**: Admin can toggle `verified` and soft-delete stores; admin can link/unlink stores to any item; verified badge appears in admin list and item detail; no data is permanently deleted.

- [x] [S] Create (or extend) `app/admin/stores/actions.ts` with `toggleStoreVerified(storeId, verified)` using `createAdminClient()`
- [x] [S] Add `softDeleteStore(storeId)` Server Action (sets `visible = false`) to `app/admin/stores/actions.ts`
- [x] [S] Add `addStoreToItem(itemId, storeId)` Server Action to `app/admin/stores/actions.ts` using `createAdminClient()`
- [x] [S] Add `removeStoreFromItem(itemId, storeId)` Server Action to `app/admin/stores/actions.ts` using `createAdminClient()`
- [x] [M] Update `app/admin/stores/page.tsx` — add "Verified" column with toggle button per row
- [x] [M] Update `app/admin/stores/page.tsx` — replace any hard-delete with "Hide" soft-delete action
- [x] [S] Show verified checkmark badge (same SVG as item detail page) in admin store list
- [x] [M] Update `components/admin/StoreForm.tsx` — add `verified` checkbox for admin create/edit

---

## Phase 10 — Final Validation

**Definition of Done**: All acceptance criteria from `osddt.spec.md` pass; zero critical accessibility violations; no TypeScript errors; existing flows have no regressions.

- [x] [S] Build `@dezkareid/css`: confirm new utilities in `dist/utilities.css`
- [x] [M] Type-check: `pnpm turbo run build --filter=@dezkareid/collectstory` — zero TypeScript errors
