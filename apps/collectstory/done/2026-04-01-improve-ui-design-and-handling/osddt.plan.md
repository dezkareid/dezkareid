# Implementation Plan: Improve UI Design and Error Handling

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 16 App Router (Server Components, Server Actions, Streaming)
- **Database**: Supabase (PostgreSQL + RLS) — all migrations via Supabase MCP (`npx supabase migration new`)
- **Styling**: CSS Modules + `@dezkareid/design-tokens` CSS custom properties
- **CSS Utilities**: `@dezkareid/css` (ITCSS, v0.0.0) — extend the utilities layer with missing helpers; never add one-off utility classes inside app CSS modules
- **Performance Testing**: Chrome MCP — Lighthouse runs (mobile + desktop) after each UI phase to validate scores ≥ 90

### Key Design Decisions

1. **Mobile-first**: All CSS is written for the smallest viewport first, enhanced upward with `min-width` media queries. Use the `media-up()` mixin from `@dezkareid/css/src/tools` in SCSS contexts; plain `min-width` in CSS Modules.
2. **No new runtime dependencies**: All changes use existing libraries and the established design system.
3. **Store–item relation**: New `collection_item_stores` join table (many-to-many). Stores gain `verified BOOLEAN DEFAULT false` and `visible BOOLEAN DEFAULT true` (soft-delete). Only admins can create, edit, or associate stores. New `item_links` table for user-managed external URLs per item.
4. **Supabase MCP for all migrations**: Never hand-craft migration timestamps — always use `npx supabase migration new <name>` via the MCP, then apply with `supabase db push`.
5. **Store management UI**: Integrated into the existing public item detail page (`app/[username]/[collectionSlug]/[slug]/`) via an `ItemStoreManager` component shown only to the item owner. Not in the add-item modal.
6. **Error handling**: All Server Action returns are typed (`{ error: string } | { success: true }`). Every error message rendered in the UI uses `role="alert"` and is associated with the relevant field via `aria-describedby`.

### Existing `@dezkareid/css` Utilities (do not duplicate)

The package already provides: `.u-sr-only`, `.u-visually-hidden`, `.u-hidden`, `.u-text-center/left/right`, `.u-flex`, `.u-flex-column`, `.u-items-center`, `.u-justify-center`, `.u-justify-between`, `.u-bg-alt`, `.u-reveal`, `.u-reveal-group`, layout objects (`.o-container`, `.o-stack`, `.o-grid`, `.o-shell`).

Missing utilities to add in Phase 1: `.u-focus-ring`, `.u-touch-target`, `.u-truncate-2`.

---

## Implementation Phases

### Phase 1 — CSS Utilities Extension

**Goal**: Add the three missing utility classes to `@dezkareid/css` so all subsequent phases can reference them consistently.

**Steps**:
1. Read `design-system/css/src/utilities/` to locate the correct file for additions.
2. Add to `src/utilities/_helpers.scss` (or create if absent):
   - `.u-focus-ring` — standardised focus indicator:
     ```scss
     .u-focus-ring {
       &:focus-visible {
         outline: 2px solid var(--color-primary);
         outline-offset: 3px;
       }
     }
     ```
   - `.u-touch-target` — minimum touch target per WCAG 2.5.5:
     ```scss
     .u-touch-target {
       min-width: 44px;
       min-height: 44px;
     }
     ```
   - `.u-truncate-2` — two-line clamp (already duplicated in CollectionItemCard and AddItemForm):
     ```scss
     .u-truncate-2 {
       display: -webkit-box;
       -webkit-line-clamp: 2;
       -webkit-box-orient: vertical;
       overflow: hidden;
     }
     ```
3. Ensure `src/main.scss` `@forward`s the updated utilities partial.
4. Build the package: `pnpm turbo run build --filter=@dezkareid/css`.
5. Verify `dist/utilities.css` and `dist/main.css` contain the new classes.

**Files changed**: `design-system/css/src/utilities/_helpers.scss`, `design-system/css/src/main.scss`

---

### Phase 2 — Database Schema: Store Model Redesign

**Goal**: Extend the stores table and create the item–store join table with correct RLS.

**Steps**:
1. **Migration 1** — via Supabase MCP: `npx supabase migration new stores_verified_and_visible`
   ```sql
   ALTER TABLE stores
     ADD COLUMN verified BOOLEAN NOT NULL DEFAULT false,
     ADD COLUMN visible  BOOLEAN NOT NULL DEFAULT true;
   ```
2. **Migration 2** — via Supabase MCP: `npx supabase migration new collection_item_stores`
   ```sql
   CREATE TABLE collection_item_stores (
     item_id  UUID NOT NULL REFERENCES collection_items(id) ON DELETE CASCADE,
     store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
     PRIMARY KEY (item_id, store_id)
   );
   ```
3. **Migration 3** — via Supabase MCP: `npx supabase migration new stores_rls_and_item_links`
   ```sql
   -- Public read: only visible stores
   DROP POLICY IF EXISTS stores_public_read ON stores;
   CREATE POLICY stores_public_read ON stores
     FOR SELECT USING (visible = true);

   -- Admin-only insert, update, and soft-delete on stores
   CREATE POLICY stores_admin_write ON stores
     FOR ALL USING (
       EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
     );

   -- collection_item_stores: admin-only management
   ALTER TABLE collection_item_stores ENABLE ROW LEVEL SECURITY;

   CREATE POLICY cis_admin_all ON collection_item_stores
     FOR ALL USING (
       EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
     );

   CREATE POLICY cis_public_select ON collection_item_stores
     FOR SELECT USING (true);

   -- item_links: user-managed external URLs per item
   CREATE TABLE item_links (
     id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     item_id    UUID NOT NULL REFERENCES collection_items(id) ON DELETE CASCADE,
     url        TEXT NOT NULL,
     label      TEXT,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );

   ALTER TABLE item_links ENABLE ROW LEVEL SECURITY;

   -- Owner can insert links on their own items
   CREATE POLICY item_links_owner_insert ON item_links
     FOR INSERT WITH CHECK (
       EXISTS (SELECT 1 FROM collection_items WHERE id = item_id AND user_id = auth.uid())
     );

   -- Owner can delete their own item's links
   CREATE POLICY item_links_owner_delete ON item_links
     FOR DELETE USING (
       EXISTS (SELECT 1 FROM collection_items WHERE id = item_id AND user_id = auth.uid())
     );

   -- Owner can read their own item's links
   CREATE POLICY item_links_owner_select ON item_links
     FOR SELECT USING (
       EXISTS (SELECT 1 FROM collection_items WHERE id = item_id AND user_id = auth.uid())
     );
   ```
4. Apply migrations via Supabase MCP (`supabase db push` or `apply_migration`).
5. Smoke-test via Supabase MCP `execute_sql`: verify `stores` columns, `collection_item_stores` table, `item_links` table, and all policies exist.

**Files changed**: New migration files (auto-timestamped by Supabase MCP)

---

### Phase 3 — Home Page UI Improvements

**Goal**: Remove stores section, fix accessibility, improve mobile layout, hit Lighthouse ≥ 90.

**Steps**:
1. **Remove stores** (`app/page.tsx`):
   - Delete the "Stores Directory" feature card from the features section.
   - Rebalance the features section to a 2-column layout on desktop if 2 items remain, or replace with a different feature highlight.
2. **Accessibility** (`app/page.tsx`):
   - Audit heading hierarchy — ensure one `<h1>`, sequential `<h2>`/`<h3>` with no skipped levels.
   - Add descriptive `alt` text to all `<Image>` components; mark decorative elements `alt=""` or `aria-hidden="true"`.
   - Replace any hand-rolled focus styles with the `.u-focus-ring` utility class.
   - Ensure all CTA buttons have descriptive accessible names (not just "Click here").
3. **Mobile-first CSS refactor** (`app/page.module.css`):
   - Rewrite `@media (max-width: …)` queries to `@media (min-width: …)` throughout.
   - Base styles target 320px; enhancements at 640px (`sm`) and 1024px (`lg`).
   - Hero section: single-column stacked on mobile; 2-column split at 1024px+.
   - CTA buttons: full-width on mobile, `width: auto` at 640px+; min-height 44px (`.u-touch-target`).
   - Features section: single column on mobile, 2-column at 640px+.
   - Verify no unintentional horizontal overflow at 320px.
4. **Performance** (`app/page.tsx`):
   - Confirm the static home page has no server-side data fetches (force-static is already set).
   - Hero image: add `priority` prop to `<Image>` if not already present; ensure `sizes` attribute is accurate.
5. **Validate with Chrome MCP**: Lighthouse mobile — performance ≥ 90, accessibility ≥ 90.

**Files changed**: `app/page.tsx`, `app/page.module.css`

---

### Phase 4 — Collection Page UI Improvements

**Goal**: Fix accessibility, improve mobile layout, polish empty/error states, remove any store surface.

**Steps**:
1. **Remove store references**: Audit `app/collection/page.tsx`, `page.module.css`, and `components/CollectionItemCard.tsx` — confirm no store data is fetched or rendered (stores are item-detail only per Decision 1).
2. **Empty state** (`app/collection/page.tsx`):
   - Ensure empty state renders: descriptive `<h2>`, supporting text, and a prominent "Add your first item" `<Button>` using `@dezkareid/components/react`.
   - Apply `.u-touch-target` to the CTA.
3. **Accessibility**:
   - Wrap the item grid in `<ul role="list" aria-label="Your collection">` with `<li>` wrappers around each card.
   - Add `aria-live="polite"` to the section containing items so screen readers announce after async updates.
   - Ensure the "Add Item" trigger button has a clear accessible name.
   - Confirm `AddItemModal` uses `<dialog>` element, `aria-modal="true"`, `aria-labelledby` pointing to the modal title, and traps focus while open.
   - Ensure Escape key closes the modal (already implemented — verify).
4. **Mobile-first CSS** (`app/collection/page.module.css`):
   - Rewrite breakpoints to `min-width`.
   - Item grid: 1 column at 320px, 2 columns at 480px+, `auto-fill minmax(260px, 1fr)` at 768px+.
   - "Last Additions" strip: add `padding-inline` to prevent cards bleeding to viewport edge on mobile.
   - Page header (title + "Add Item" button): stack vertically on mobile, side-by-side at 640px+.
   - Ensure horizontal scroll strip has `-webkit-overflow-scrolling: touch` and `scroll-snap-type: x mandatory`.
5. **Error boundary**: Add `app/collection/error.tsx` — a client component that renders a user-readable message and a retry button when the Server Component fetch throws.
6. **Validate with Chrome MCP**: Lighthouse on the authenticated collection page (mobile) — performance ≥ 90, accessibility ≥ 90.

**Files changed**: `app/collection/page.tsx`, `app/collection/page.module.css`, `app/collection/error.tsx` (new), `components/CollectionItemCard.tsx`

---

### Phase 5 — Collection Layout Header Improvements

**Goal**: Make the authenticated header fully accessible and mobile-usable.

**Steps**:
1. **Mobile header** (`app/collection/layout.tsx`, `layout.module.css`):
   - Confirm avatar + sign-out button are always visible on small screens (profile label currently hides at 480px — avatar alone must be sufficient).
   - Sign-out button: ensure minimum 44px touch target (`.u-touch-target`).
   - Admin link: confirm it is absent for non-admin users (already implemented via role check — verify).
2. **Focus order**: Ensure logical keyboard tab order — brand/logo → admin link (if visible) → profile link → sign-out.
3. **ARIA**: Add `<nav aria-label="App navigation">` wrapper around the header nav links.

**Files changed**: `app/collection/layout.tsx`, `app/collection/layout.module.css`

---

### Phase 6 — Error Handling Improvements

**Goal**: All Server Action errors produce human-readable, field-associated messages with correct ARIA.

**Steps**:
1. **Server Actions** (`app/collection/actions.ts`):
   - Audit every `catch` block — ensure all return `{ error: 'human-readable message' }`, never raw Supabase error objects or stack traces.
   - Map known Supabase error codes to friendly messages:
     - `23505` (unique constraint) → "An item with this name already exists."
     - `23503` (foreign key violation) → "The selected brand or line no longer exists."
     - Generic fallback → "Something went wrong. Please try again."
2. **AddItemForm** (`components/AddItemForm/AddItemForm.tsx`):
   - Add `id` attributes to each form input (e.g. `id="item-name"`).
   - Render field-level errors adjacent to their input with `role="alert"` and link via `aria-describedby` on the input.
   - Global form error (`state.error`) must also use `role="alert"`.
   - Image upload failure: re-enable the upload input after failure and show "Upload failed — try again" message below the upload area.
   - Ensure form state persists (fields remain filled) when a submission error occurs — do not reset the form on error.
3. **CSS** (`components/AddItemForm/AddItemForm.module.css`):
   - Replace hardcoded `#e53e3e` in `--color-error` fallback with:
     ```css
     /* TODO(design-system): needs token --color-error (semantic error color) */
     background-color: color-mix(in srgb, var(--color-error, #e53e3e) 10%, transparent);
     ```
   - The `TODO` comment flags the gap for design token promotion.

**Files changed**: `app/collection/actions.ts`, `components/AddItemForm/AddItemForm.tsx`, `components/AddItemForm/AddItemForm.module.css`

---

### Phase 7 — CollectionItemCard Accessibility & Mobile

**Goal**: Each card is semantic, accessible, and responsive at all viewport widths.

**Steps**:
1. **Semantic structure** (`components/CollectionItemCard.tsx`):
   - Wrap card in `<article aria-label={item.name}>`.
   - Ensure `<Image>` `alt` is meaningful (use `item.name`; if image is decorative fallback, use `alt=""`).
   - Tags group: wrap in `<ul aria-label="Tags">` with `<li>` per tag (brand, line, category).
   - Date: use `<time dateTime={item.date_acquired}>` for semantic markup.
2. **Mobile CSS** (`components/CollectionItemCard.module.css`):
   - Verify card renders without layout breakage at 320px wide (single-column grid).
   - Replace duplicated two-line clamp on description with `.u-truncate-2` utility.
   - Ensure any interactive element (e.g. future card link) meets 44px touch target.
3. **No store data**: Confirm no store fields are queried in the card's data fetching — the `ITEM_SELECT` query must not join `collection_item_stores`.

**Files changed**: `components/CollectionItemCard.tsx`, `components/CollectionItemCard.module.css`

---

### Phase 8 — "Where to Find It" Section: Store Display + Item Links

**Goal**: Item detail page shows admin-managed stores (read-only for collectors) above user-managed links (add/delete by item owner).

**Steps**:
1. **New Server Actions for item links** (`app/collection/actions.ts`):
   - `addItemLink(itemId: string, url: string, label?: string): Promise<{ success: true } | { error: string }>` — insert into `item_links`; RLS enforces item ownership. Validate `url` is a valid URL before inserting.
   - `removeItemLink(linkId: string): Promise<{ success: true } | { error: string }>` — delete from `item_links`; RLS enforces item ownership.
2. **ItemLinksManager component** (`components/ItemLinksManager/`):
   - `'use client'` component.
   - Props: `itemId: string`, `initialLinks: ItemLink[]` (links currently on this item).
   - Renders a `<ul role="list" aria-label="Links">` of existing links.
     - Each link: anchor (`<a href={url} target="_blank" rel="noopener noreferrer">`) with label or truncated URL + "Remove" button.
   - Below the list: a small form with a URL input and optional label input + "Add" button.
   - Client-side URL validation before calling `addItemLink`; field error with `role="alert"` on invalid input.
   - All errors (add/remove failures) render with `role="alert"`.
   - CSS: `ItemLinksManager.module.css` using design tokens only.
3. **Item detail page integration** (`app/[username]/[collectionSlug]/[slug]/page.tsx`):
   - Fetch `collection_item_stores` (join stores with `verified` field) for display — read-only, no management UI for collectors.
   - Fetch `item_links` for the item — only when the current user is the item owner (RLS enforces this server-side too).
   - Render a **"Where to find it"** section with two sub-sections in this order:
     1. **Stores** (always visible if any exist): read-only list of store names + verified badge. No add/remove controls for collectors.
     2. **Links** (owner-only): render `<ItemLinksManager>` with `itemId` and `initialLinks`.
   - If neither stores nor links exist and the viewer is the owner, show a prompt: "Add a link to where this item can be found."
4. **Verified badge**: A small inline SVG checkmark icon — no external icon library. Style with `var(--color-primary)`. Add `TODO(design-system)` if a suitable token is unavailable.

**Files changed**: `app/collection/actions.ts`, `components/ItemLinksManager/ItemLinksManager.tsx` (new), `components/ItemLinksManager/ItemLinksManager.module.css` (new), `app/[username]/[collectionSlug]/[slug]/page.tsx`

---

### Phase 9 — Admin: Store Verified Toggle, Soft-Delete & Item Association

**Goal**: Admins can mark stores as verified, soft-delete them, and manage which stores are linked to a given item.

**Steps**:
1. **Admin Server Actions** (`app/admin/stores/actions.ts` — create if absent, otherwise extend):
   - `toggleStoreVerified(storeId: string, verified: boolean)` — updates `stores.verified` using `createAdminClient()`.
   - `softDeleteStore(storeId: string)` — sets `stores.visible = false` using `createAdminClient()`. Does not delete data.
   - `addStoreToItem(itemId: string, storeId: string): Promise<{ success: true } | { error: string }>` — insert into `collection_item_stores` using `createAdminClient()`.
   - `removeStoreFromItem(itemId: string, storeId: string): Promise<{ success: true } | { error: string }>` — delete from `collection_item_stores` using `createAdminClient()`.
2. **Admin stores page** (`app/admin/stores/page.tsx`):
   - Add a "Verified" column to the store list table with a toggle button.
   - Add a "Hide" (soft-delete) action button per store row (replaces any hard-delete if present).
   - Verified stores show the same checkmark badge used on the item detail page.
3. **StoreForm** (`components/admin/StoreForm.tsx`):
   - Add a `verified` checkbox field for admin create/edit.
4. **Admin item detail** (`app/admin/` — extend existing item detail or add a store-association panel):
   - Admin can search for a store and link/unlink it to any item via `addStoreToItem` / `removeStoreFromItem`.

**Files changed**: `app/admin/stores/page.tsx`, `app/admin/stores/actions.ts` (new or extended), `components/admin/StoreForm.tsx`

---

### Phase 10 — Final Validation

**Goal**: Confirm all acceptance criteria pass before raising the PR.

**Steps**:
1. **Build CSS package**: `pnpm turbo run build --filter=@dezkareid/css` — verify new utilities are in `dist/utilities.css`.
2. **Chrome MCP Lighthouse runs**:
   - Home page: mobile + desktop — performance ≥ 90, accessibility ≥ 90.
   - Collection page (authenticated, seeded with items): mobile — performance ≥ 90, accessibility ≥ 90.
3. **Manual mobile checks** (375px viewport):
   - No horizontal scroll on any page.
   - All touch targets ≥ 44px (use DevTools element inspector).
   - Modals fully visible and scrollable without content cut off.
   - Body text ≥ 16px throughout.
   - Item grid: single column at 375px.
4. **Accessibility sweep**: Run axe DevTools (or equivalent) on home and collection pages — zero critical violations.
5. **Regression checks**:
   - `/stores` page renders correctly with only `visible = true` stores.
   - Admin stores page: toggle verified, soft-delete — confirm changes reflect in public store list.
   - Existing item creation flow (AddItemModal → AddItemForm → image upload → createCollectionItem) works end-to-end.
   - Public item detail page: `ItemStoreManager` visible to owner, hidden to other users.
6. **Type-check**: `pnpm turbo run build --filter=@dezkareid/collectstory` — no TypeScript errors.

---

## Technical Dependencies

| Dependency | Purpose | Status |
|---|---|---|
| `@dezkareid/design-tokens` v1.5.0 | CSS custom properties for all visual values | In use |
| `@dezkareid/components/react` v1.1.1 | Button, Tag, ThemeToggle primitives | In use |
| `@dezkareid/css` v0.0.0 | Base utility classes — extend in Phase 1 | Built from source; `dist/` not yet compiled |
| Supabase MCP | Create and apply DB migrations (Phases 2, 8) | Available |
| Chrome MCP | Lighthouse performance & accessibility validation (Phases 3, 4, 10) | Available |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `collection_item_stores` RLS policies conflict with existing item policies | Medium | Test with non-admin session via Supabase MCP `execute_sql` after applying migration |
| `@dezkareid/css` `dist/` not built when collectstory tries to import utilities | Medium | Phase 1 explicitly builds the package before any app work begins |
| `item_links` URL validation bypassed on server | Low | Server Action validates URL format before inserting; client-side validation provides early feedback |
| Chrome MCP Lighthouse on authenticated page requires active session | Medium | Use a seeded test account; document auth setup in Phase 10 notes |
| `--color-error` missing from design tokens | Low | Hardcoded fallback already in place; `TODO(design-system)` comment added in Phase 6 |
| Removing "Stores Directory" leaves features section visually unbalanced | Low | Rebalance to 2-column layout in Phase 3 |

---

## Out of Scope

- Public `/stores` directory page redesign
- Full redesign of the add/edit item form beyond store-association UX
- Profile page or public `[username]` page changes beyond store display on item detail
- Push notifications or email error reporting
- Internationalization
- Store deduplication / moderation beyond admin soft-delete
- Design token addition for `--color-error` (flagged as `TODO(design-system)` only)
