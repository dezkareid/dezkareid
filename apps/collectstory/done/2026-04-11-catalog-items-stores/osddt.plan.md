# Implementation Plan: Catalog Items & Store Relations

## Architecture Overview

### Data Model Changes

```
catalog_items
  id           uuid PK
  name         text NOT NULL
  slug         text NOT NULL UNIQUE
  description  text NULLABLE
  image_url    text NULLABLE          -- Cloudinary URL
  franchise_id uuid NULLABLE FK → franchises(id) ON DELETE SET NULL
  line_id      uuid NULLABLE FK → lines(id) ON DELETE SET NULL
  created_at   timestamptz DEFAULT now()
  updated_at   timestamptz DEFAULT now()

catalog_item_stores
  catalog_item_id  uuid FK → catalog_items(id) ON DELETE CASCADE
  store_id         uuid FK → stores(id) ON DELETE CASCADE
  PRIMARY KEY (catalog_item_id, store_id)

collection_items (ALTER)
  + catalog_item_id  uuid NULLABLE FK → catalog_items(id) ON DELETE SET NULL

-- DROP: collection_item_stores table (replaced by catalog-driven store associations)
```

**RLS policies:**
- `catalog_items`: public SELECT; admin-only INSERT, UPDATE, DELETE (via `is_admin()`)
- `catalog_item_stores`: public SELECT; admin-only INSERT, DELETE
- `collection_items.catalog_item_id`: existing user-scoped policies cover the new column automatically

### Search Strategy

Use `pg_trgm` (available, not yet installed) for similarity-based autocomplete on `catalog_items.name`. A GIN trigram index on `name` enables fast `%` ILIKE queries and `similarity()` scoring without tsvector complexity. This matches the simple use case (name + franchise + line) without over-engineering.

SQL function:
```sql
CREATE FUNCTION search_catalog_items(query text, max_results int DEFAULT 10)
RETURNS TABLE(...) AS $$
  SELECT id, name, slug, image_url, franchise_id, line_id,
         similarity(name, query) AS score
  FROM catalog_items
  WHERE name ILIKE '%' || query || '%'
     OR similarity(name, query) > 0.1
  ORDER BY score DESC, name ASC
  LIMIT max_results;
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

### Routing

```
/catalog                          → app/catalog/page.tsx          (ISR, public)
/catalog/[slug]                   → app/catalog/[slug]/page.tsx   (ISR, public)
/admin/catalog-items              → app/admin/catalog-items/page.tsx
/admin/catalog-items/new          → app/admin/catalog-items/new/page.tsx
/admin/catalog-items/[id]/edit    → app/admin/catalog-items/[id]/edit/page.tsx
```

### FSD Placement

| What | Layer/Slice |
|---|---|
| Catalog item card (display) | `src/entities/catalog-item/` |
| Catalog item autocomplete input (user interaction) | `src/features/catalog-item-picker/` |
| "Where to buy" store list section | `src/features/where-to-buy/` |
| Admin store association manager | `components/admin/CatalogItemStoreManager.tsx` (co-located with other admin components) |
| Admin catalog item form | `components/admin/CatalogItemForm.tsx` |

### API for Autocomplete

A **Route Handler** (`app/api/catalog-items/search/route.ts`) serves autocomplete requests. Reason: autocomplete requires client-side debounced fetching — a Server Action cannot be called with debounce from a Client Component input. The Route Handler uses `createServerClient` (anon key) — public read RLS covers this.

```
GET /api/catalog-items/search?q=<term>&limit=10
→ JSON: { items: [{ id, name, slug, image_url, franchise?: { name }, line?: { name } }] }
```

---

## Implementation Phases

### Phase 1 — Database Schema

**Goal:** Apply all schema changes to Supabase.

**Steps:**

1. **Enable `pg_trgm` extension**
   - Migration: `CREATE EXTENSION IF NOT EXISTS pg_trgm;`

2. **Create `catalog_items` table**
   - Columns: id, name, slug (unique), description, image_url, franchise_id (nullable FK → franchises ON DELETE SET NULL), line_id (nullable FK → lines ON DELETE SET NULL), created_at, updated_at
   - RLS: enable; public SELECT; admin INSERT/UPDATE/DELETE via `is_admin()`
   - GIN trigram index on `name` for similarity search
   - `updated_at` trigger using existing `moddatetime` pattern

3. **Create `catalog_item_stores` junction table**
   - Columns: catalog_item_id (FK → catalog_items ON DELETE CASCADE), store_id (FK → stores ON DELETE CASCADE)
   - Composite PK: (catalog_item_id, store_id)
   - RLS: enable; public SELECT; admin INSERT/DELETE via `is_admin()`

4. **Add `catalog_item_id` to `collection_items`**
   - Nullable FK → catalog_items(id) ON DELETE SET NULL
   - Existing user-scoped RLS policies already allow column updates

5. **Drop `collection_item_stores` table**
   - Confirm zero rows (verified: 0 rows in prod) before dropping
   - Single migration: DROP TABLE collection_item_stores CASCADE

6. **Create `search_catalog_items` SQL function**
   - ILIKE + trigram similarity scoring
   - Returns id, name, slug, image_url, franchise name, line name (joined)
   - SECURITY DEFINER, stable

7. **Regenerate TypeScript types**
   - Run `mcp__supabase__generate_typescript_types` and update `lib/supabase/types.ts`

---

### Phase 2 — Admin: Catalog Items CRUD

**Goal:** Admins can create, edit, delete, and search catalog items.

**Steps:**

1. **Server Actions** — `app/admin/catalog-items/actions.ts`
   - `createCatalogItem(formData)`: requireAdmin → insert → generateUniqueSlug → redirect to list
   - `updateCatalogItem(id, formData)`: requireAdmin → update → revalidatePath
   - `deleteCatalogItem(id)`: requireAdmin → delete → revalidatePath (ON DELETE SET NULL handles collection_items)
   - `addStoreToCatalogItem(catalogItemId, storeId)`: requireAdmin → insert into catalog_item_stores → revalidatePath
   - `removeStoreFromCatalogItem(catalogItemId, storeId)`: requireAdmin → delete from catalog_item_stores → revalidatePath

2. **`CatalogItemForm` component** — `components/admin/CatalogItemForm.tsx`
   - `'use client'`, `useActionState`
   - Fields: name (required), description (textarea), image upload (Cloudinary, same pattern as StoreForm/FranchiseForm), franchise select (nullable), line select (nullable, cascades from franchise if franchise has lines)
   - Slug: auto-generated server-side from name, not shown in form

3. **List page** — `app/admin/catalog-items/page.tsx`
   - Server Component; query `catalog_items` joined with `franchises` and `lines`
   - Columns: name, franchise, line, stores count, actions (Edit, Delete)
   - Reuse `app/admin/list.module.css` styles
   - Search filter: `?q=` param → `ILIKE '%q%'` on name (simple server-side filter, not autocomplete)

4. **New page** — `app/admin/catalog-items/new/page.tsx`
   - Fetch all franchises + lines for selects; render `CatalogItemForm` with `createCatalogItem`

5. **Edit page** — `app/admin/catalog-items/[id]/edit/page.tsx`
   - Fetch catalog item + associated stores; render `CatalogItemForm` with `updateCatalogItem.bind(null, id)`
   - Below the form: `CatalogItemStoreManager` component

6. **`CatalogItemStoreManager` component** — `components/admin/CatalogItemStoreManager.tsx`
   - `'use client'`; lists currently associated stores with Remove button
   - Store search input (simple ILIKE against stores list fetched server-side as prop)
   - Add button calls `addStoreToCatalogItem` Server Action

7. **Admin dashboard link** — add "Catalog Items" entry to `app/admin/page.tsx`

---

### Phase 3 — Autocomplete API & Feature Slice

**Goal:** Users can search and select a catalog item when creating/editing a collection item.

**Steps:**

1. **Route Handler** — `app/api/catalog-items/search/route.ts`
   - `GET ?q=<term>&limit=10`
   - Uses `createServerClient` (anon key) — public RLS covers it
   - Calls `search_catalog_items(q, limit)` RPC
   - Returns `{ items: CatalogItemSearchResult[] }`
   - Response: `Cache-Control: no-store` (autocomplete must be fresh)

2. **FSD feature slice** — `src/features/catalog-item-picker/`
   - `ui/CatalogItemPicker.tsx`: `'use client'` combobox input
     - Controlled: `value` (selected `CatalogItemSearchResult | null`) + `onChange`
     - Internal state: `query` string, `results` array, `loading` boolean
     - Debounced fetch (300ms) to `/api/catalog-items/search?q=<query>`
     - Dropdown list with item name + franchise/line subtitle
     - Clear button to unlink
   - `model/types.ts`: `CatalogItemSearchResult` type
   - `index.ts`: public API export

---

### Phase 4 — Collection Item Integration

**Goal:** Users can link/unlink a catalog item on their collection items.

**Steps:**

1. **Server Actions update** — `app/[username]/[collectionSlug]/items/[itemId]/edit/actions.ts` (and new item actions)
   - Add `catalog_item_id: formData.get('catalog_item_id') ?? null` to `addItem` and `updateItem`
   - Validate: must be a valid UUID or null

2. **Edit form update** — `app/[username]/[collectionSlug]/items/[itemId]/edit/EditItemForm.tsx`
   - Add `CatalogItemPicker` to the form
   - Pass `defaultValue` from existing `collection_item.catalog_item_id` (pre-fetch catalog item name for display)
   - Hidden input `catalog_item_id` reflects the selected item's id

3. **New item form update** — `app/[username]/[collectionSlug]/items/new/AddItemPageForm.tsx`
   - Same: add `CatalogItemPicker` with no default

4. **Remove `collection_item_stores` UI** — remove any existing store-association UI from collection item forms (junction table is dropped in Phase 1)

---

### Phase 5 — "Where to Buy" on Item Detail

**Goal:** Collection item detail page shows stores from the linked catalog item.

**Steps:**

1. **FSD feature slice** — `src/features/where-to-buy/`
   - `ui/WhereToBuy.tsx`: Server Component (no client state needed)
     - Props: `stores: Store[]`
     - Renders store cards: name, city/country, link to store URL ("Visit Store" button)
     - Empty state: nothing rendered if `stores` is empty
   - `index.ts`: public API

2. **Item detail page update** — `app/[username]/[collectionSlug]/items/[itemId]/[slug]/page.tsx`
   - If `collection_item.catalog_item_id` is not null: fetch `catalog_item_stores` joined with `stores` for that catalog item
   - Render `<WhereToBuy stores={stores} />` section below item details
   - Use `Promise.all` to fetch item + stores in parallel

---

### Phase 6 — Public Catalog Pages

**Goal:** Public `/catalog` browse page and `/catalog/[slug]` detail page.

**Steps:**

1. **FSD entity slice** — `src/entities/catalog-item/`
   - `ui/CatalogItemCard.tsx`: display card (name, image, franchise tag, line tag)
   - `ui/CatalogItemCard.module.css`
   - `index.ts`

2. **Catalog list page** — `app/catalog/page.tsx`
   - ISR (`revalidate: 3600`)
   - Fetch all visible catalog items with franchise + line joins
   - Render grid of `CatalogItemCard`
   - SEO: `generateMetadata` with title "Catalog — Collectstory"
   - Structured data: `ItemList` schema.org JSON-LD

3. **Catalog detail page** — `app/catalog/[slug]/page.tsx`
   - ISR (`revalidate: 3600`)
   - Fetch catalog item by slug + its associated stores
   - Render item details + `WhereToBuy` stores section
   - SEO: `generateMetadata` with item name + description
   - Structured data: `Product` schema.org JSON-LD with `offers` pointing to store URLs
   - `generateStaticParams` for all catalog item slugs

4. **Sitemap update** — `app/sitemap.ts`
   - Add `/catalog` and `/catalog/[slug]` entries

---

### Phase 7 — Changeset & Release

1. Run `pnpm changeset` from monorepo root, select `@dezkareid/collectstory`, bump `minor`, write user-facing summary.

---

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| `pg_trgm` Postgres extension | Available, not installed | Enable via migration |
| Cloudinary image upload | Already configured | Reuse `/api/upload` route |
| `lib/slug.ts` | Exists | Reuse `toSlug` + `generateUniqueSlug` (adapt for `catalog_items` table) |
| `lib/auth/role.ts` `getSessionAndRole()` | Exists | Reuse for admin guards |
| `lib/supabase/admin.ts` `createAdminClient()` | Exists | Reuse for admin mutations |
| `app/admin/form.module.css` + `list.module.css` | Exists | Reuse directly |
| `@dezkareid/components/react` Button, Tag, Card | Exists | Use in new UI |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| `collection_item_stores` DROP breaks existing data | Confirmed 0 rows in prod — safe to drop. Include assertion in migration: `DO $$ BEGIN IF EXISTS (SELECT 1 FROM collection_item_stores LIMIT 1) THEN RAISE EXCEPTION 'Table not empty'; END IF; END $$;` |
| `pg_trgm` not available | Extension is listed in Supabase available extensions — enable in first migration |
| Autocomplete latency | 300ms debounce + GIN index ensures <100ms DB response; Route Handler is edge-compatible |
| `catalog_item_id` FK nullified on delete breaks "Where to buy" | ON DELETE SET NULL is the correct behavior — stores section simply won't render |
| TypeScript types out of sync after schema changes | Regenerate `lib/supabase/types.ts` via MCP after each migration phase |
| Slug uniqueness for catalog items | `generateUniqueSlug` adapted to query `catalog_items` table (no user_id scope — global uniqueness) |

---

## Out of Scope

- User-submitted catalog items
- Pricing or stock information at stores
- Notifications when stores are added to a catalog item
- Bulk catalog import
- Merging existing collection item data into catalog
- Catalog item ratings or reviews
- Direct item→store associations (replaced by catalog-driven path)
