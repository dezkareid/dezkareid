# Implementation Plan: Copy Collection Item to Catalog

## Architecture Overview

The feature splits into two independent tracks that share a database migration:

**Track A — Multi-image support for catalog items**
- Add a `jsonb` column `images` to `catalog_items` storing an ordered array of `{ src, alt, order }` objects (max 5).
- Update `CatalogItemForm` with a new `ImageListField` client component that handles add/remove/drag-to-reorder.
- Update `createCatalogItem` and `updateCatalogItem` server actions to persist the `images` column.
- Update the public catalog item detail page (`/catalog/[slug]`) to render an image gallery when `images` is present.

**Track B — "Copy to Catalog" admin action**
- Add a `CopyToCatalogButton` feature slice (`src/features/copy-to-catalog/`) that renders only for admin users on the collection item detail page.
- Navigation is done via a plain `<Link>` passing only `?source_item_id=<uuid>` — no data in the URL.
- `NewCatalogItemPage` reads `source_item_id` from search params, fetches the collection item server-side using `createAdminClient`, and passes the resolved data as `defaultValues` to `CatalogItemForm`. It also passes `source_item_id` as a hidden field so the action can back-link after save.
- After `createCatalogItem` saves successfully, if `source_item_id` is present, a secondary update sets `catalog_item_id` on the source collection item (via admin client).

**No new pages, no new API routes.** Everything reuses existing patterns: Server Actions, `CatalogItemForm`, `getSessionAndRole`, `createAdminClient`.

---

## Implementation Phases

### Phase 1 — Database migration: add `images` column to `catalog_items`

**Goal:** Extend the schema to support the ordered image list.

**Steps:**
1. Use Supabase MCP (`mcp__supabase__apply_migration`) to apply a migration that adds:
   ```sql
   ALTER TABLE public.catalog_items
     ADD COLUMN images jsonb NOT NULL DEFAULT '[]'::jsonb;
   ```
   The column stores an array of objects: `{ src: string, alt: string, order: number }`.
2. Add a check constraint to enforce max 5 images:
   ```sql
   ALTER TABLE public.catalog_items
     ADD CONSTRAINT catalog_items_images_max_5
     CHECK (jsonb_array_length(images) <= 5);
   ```
3. Create the local migration file under `apps/collectstory/supabase/migrations/` with the matching remote timestamp (follow the timestamp-match convention from CLAUDE.md).
4. Run `mcp__supabase__generate_typescript_types` and update `lib/supabase/types.ts`.

---

### Phase 2 — `ImageListField` component

**Goal:** A reusable client component for managing up to 5 ordered images in admin forms.

**File:** `components/admin/ImageListField.tsx` (legacy `components/admin/` placement, consistent with `ImageField.tsx` and `CatalogItemForm.tsx`).

**Steps:**
1. Build `ImageListField` as a `'use client'` component with:
   - Props: `defaultImages?: CatalogImage[]`, `uploading: boolean`, `onImagesChange: (images: CatalogImage[]) => void`, `onError: (error: string | undefined) => void`, `error: string | undefined`
   - Type `CatalogImage = { src: string; alt: string; order: number }`
   - Displays existing images as a drag-sortable list (HTML5 drag-and-drop — no new library)
   - "Add image" button opens a file picker (delegates to the existing `ImageField` logic for validation/HEIC conversion)
   - Each item has a remove button and a drag handle
   - Enforces max 5: disables "Add image" and shows error when limit is reached
2. The serialized value is submitted as a hidden `<input name="images" value={JSON.stringify(images)} />`.

---

### Phase 3 — Update `CatalogItemForm` and server actions

**Goal:** Wire multi-image support into the existing create/edit flow.

**Steps:**
1. Update `CatalogItemFormProperties` interface to add `defaultImages?: CatalogImage[]`.
2. Add `ImageListField` below the existing `ImageField` in `CatalogItemForm`.
3. On form submit in `handleSubmit`, read the hidden `images` input value and include it in `FormData`.
4. Update `createCatalogItem` in `actions.ts`:
   - Parse `images` from `FormData` (JSON.parse, validate array, strip extra fields).
   - Pass `images` to the Supabase insert.
   - If `source_item_id` is present in `FormData`, after insert success, update `collection_items.catalog_item_id` using `createAdminClient()`.
5. Update `updateCatalogItem` in `actions.ts`:
   - Parse and persist `images` on update.
6. Update `NewCatalogItemPage` to read `source_item_id` from search params. If present, fetch the collection item server-side with `createAdminClient()` and pass the resolved fields (`name`, `description`, `image_url`, `franchise_id`, `line_id`) as `defaultValues`. Also render a hidden `<input name="source_item_id" />` so the server action can back-link after save. If the source item already has a `catalog_item_id`, render an inline warning above the form.
7. Update `EditCatalogItemPage` to fetch and pass `item.images` as `defaultImages`.

---

### Phase 4 — Image gallery on public catalog detail page

**Goal:** Show all images for a catalog item on `/catalog/[slug]`.

**Steps:**
1. Update the Supabase query in `CatalogItemContent` to also select `images`.
2. Replace the single `<Image>` block with a gallery component:
   - If `images` array is non-empty, render all images in order (primary `image_url` first if not already in the array, then additional images).
   - If `images` is empty, fall back to the existing `image_url` single image behavior (no regression).
3. Add CSS module styles for the gallery layout (`catalog/[slug]/page.module.css` — add a `.gallery` block following BEM convention).
4. Update `generateMetadata` and `buildProductSchema` to include additional images in `openGraph.images` and `schema.org` `image` array.

---

### Phase 5 — "Copy to Catalog" feature slice

**Goal:** Admin-only button on the collection item detail page that links to the pre-filled catalog form.

**File structure (FSD):**
```
src/features/copy-to-catalog/
├── ui/
│   ├── CopyToCatalogButton.tsx
│   └── CopyToCatalogButton.module.css
└── index.ts
```

**Steps:**
1. Create `CopyToCatalogButton` as an async Server Component:
   - Calls `getSessionAndRole()` — renders nothing if role is not `'admin'`.
   - Accepts `item: { id, name, description, image_url, franchise_id, line_id, catalog_item_id }`.
   - If `item.catalog_item_id` is set, renders a warning badge alongside the link: "Already linked to catalog".
   - Renders a `<Link>` to `/admin/catalog-items/new?source_item_id=<item.id>` — only the UUID in the URL.
   - Uses a `Button` variant from `@dezkareid/components/react` or a plain styled anchor — consistent with existing admin action patterns.
2. Export from `index.ts`.
3. Mount in the collection item detail page (`app/[locale]/[username]/[collectionSlug]/[slug]/page.tsx`):
   - Add `<CopyToCatalogButton>` inside `<ItemMeta>` (or in a dedicated admin section below the existing `<OwnerItemEditActions>`), wrapped in `<Suspense fallback={undefined}>` since it's a dynamic server component that reads session cookies.
   - The button must only render for admins; `CopyToCatalogButton` itself handles this guard.
   - Pass the item's `catalog_item_id` to enable the "already linked" warning.

---

### Phase 6 — Changeset

**Goal:** Record the release for versioning.

**Steps:**
1. From the monorepo root: `pnpm changeset`, select `@dezkareid/collectstory`, bump `minor`.
2. Summary: "Add Copy to Catalog admin action on collection item detail page and multi-image support for catalog items (up to 5 images with drag-to-reorder)."

---

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| `jsonb` column on `catalog_items` | New — Phase 1 | Applied via Supabase MCP |
| `ImageListField` component | New — Phase 2 | Self-contained, no new libraries |
| HTML5 Drag-and-Drop API | Browser-native | No new npm dependency needed |
| `getSessionAndRole()` | Existing | Used in `CopyToCatalogButton` for admin check |
| `createAdminClient()` | Existing | Used in `createCatalogItem` for back-linking |
| URL search params for form pre-fill | Platform-native | `ReadonlyURLSearchParams` in Next.js page |
| `@dezkareid/components/react` Button | Existing | Used in `CopyToCatalogButton` if available |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| `jsonb` column default `'[]'` means existing rows already satisfy the constraint — no data migration needed. | Confirmed by schema; `DEFAULT '[]'::jsonb` covers all existing rows. |
| The 5-image check constraint fires at the DB level; the UI also enforces it — belt-and-suspenders. | DB constraint is the authoritative guard; UI is UX only. |
| `source_item_id` in the URL could be crafted by an attacker to link an arbitrary collection item to a catalog item. | `createCatalogItem` calls `requireAdmin()` before touching `collection_items`; non-admins get Forbidden. No data is exposed — only written. |
| `NewCatalogItemPage` fetches the collection item with `createAdminClient` — bypasses RLS, so it can read any user's item. | Acceptable: the page is behind `AdminGuard`; only admins reach it. |
| Drag-and-drop reorder UX is complex to implement accessibly. | Provide arrow-up/down buttons as keyboard alternative alongside drag handles. |
| `generateStaticParams` in `/catalog/[slug]/page.tsx` uses `createAdminClient` at build time — adding `images` to the select doesn't affect the static params shape. | No risk. |
| TypeScript types for `images: CatalogImage[]` must be manually added after `generate_typescript_types` since Supabase infers `jsonb` as `Json`. | Define `CatalogImage` type in `lib/supabase/types.ts` and cast the column at query boundaries. |

---

## Out of Scope

- Bulk copy of multiple collection items
- One-click publish (no admin review bypass)
- Image gallery on user collection items
- A store-facing dedicated view
- Syncing/updating an existing linked catalog item from a collection item
