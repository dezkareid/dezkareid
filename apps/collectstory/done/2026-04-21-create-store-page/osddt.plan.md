# Implementation Plan: Store Detail Page (`/stores/[store-slug]`)

## Architecture Overview

The store detail page is a public ISR page following the same patterns already established in the codebase:

- **Routing**: `app/[locale]/stores/[store-slug]/page.tsx` — dynamic segment resolved via `slug` column on `stores`
- **Rendering**: ISR with `revalidate: 3600` (same as `/stores` directory). Invalidated on admin store edits via `revalidateTag`.
- **Data fetching**: Server Component using `createServerClient` with `'use cache'` + `cacheLife('hours')` + `cacheTag('store-<slug>')`
- **FSD placement**:
  - New entity: `src/entities/store/` — `StoreHero`, `StoreItemCard` display components
  - New feature: `src/features/store-map/` — client-only map toggle + Google Maps embed
  - New widget: `src/widgets/store-detail/` — composes all sections into a page widget
- **Admin extension**: `/admin/stores` edit form extended with `cover_url`, `logo_url`, `address`, `google_place_id` fields; item-store link manager added to edit page
- **Database**: Two migrations via Supabase MCP
  1. `add_store_enrichment_fields` — adds `slug`, `cover_url`, `logo_url`, `address`, `google_place_id` to `stores`
  2. No new review table (Google Maps handles reviews)

### Key decisions carried from spec
- Map: Google Maps embed, opt-in toggle (lazy iframe, no API key for embed)
- Reviews: Google Maps embed via `google_place_id`
- Slugs: `slug` column on `stores`, backfilled from `name` via migration
- Store-item linking: managed from `/admin/stores/[id]/edit` (existing admin pattern)

---

## Implementation Phases

### Phase 1 — Database: Enrich `stores` table

**Goal**: Add all fields needed for the store detail page and establish slugs.

#### Steps

1. **Migration: `add_store_enrichment_fields`**

   Via `mcp__supabase__apply_migration`, add to `stores`:
   ```sql
   ALTER TABLE public.stores
     ADD COLUMN slug         text UNIQUE,
     ADD COLUMN cover_url    text,
     ADD COLUMN logo_url     text,
     ADD COLUMN address      text,
     ADD COLUMN google_place_id text;

   -- Backfill slugs from name using the same slugify logic as the app
   UPDATE public.stores
   SET slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
   WHERE slug IS NULL;

   -- Make slug NOT NULL after backfill
   ALTER TABLE public.stores ALTER COLUMN slug SET NOT NULL;
   ```

   Create the local migration file: `supabase/migrations/<timestamp>_add_store_enrichment_fields.sql`

2. **Regenerate Supabase TypeScript types**

   Run `mcp__supabase__generate_typescript_types` and update `lib/supabase/types.ts`.

3. **Update `stores` public RLS policy**

   Verify existing `SELECT` policy covers the new columns (it should — RLS is row-level, not column-level). No change needed.

---

### Phase 2 — Admin: Extend Store Edit Form

**Goal**: Admins can set `cover_url`, `logo_url`, `address`, `google_place_id`, and manage catalog item ↔ store links from the store edit page.

#### Steps

1. **Update `StoreForm` component** (`components/admin/StoreForm.tsx`)

   Add fields: `cover_url` (text, optional), `logo_url` (text, optional), `address` (text, optional), `google_place_id` (text, optional, tooltip: "Google Maps Place ID — used for map embed and reviews").

2. **Update `createStore` and `updateStore` Server Actions** (`app/[locale]/admin/stores/actions.ts`)

   Parse and persist `cover_url`, `logo_url`, `address`, `google_place_id` from FormData.

3. **Add `addCatalogItemToStore` / `removeCatalogItemFromStore` Server Actions** (same `actions.ts`)

   ```ts
   // Add catalog_item_stores row
   export async function addCatalogItemToStore(storeId: string, catalogItemId: string)
   // Delete catalog_item_stores row
   export async function removeCatalogItemFromStore(storeId: string, catalogItemId: string)
   ```

   Both require admin role and call `revalidateTag('store-<storeSlug>')` after mutation.

4. **Add `StoreItemsManager` component** (`components/admin/StoreItemsManager.tsx`)

   Client component rendered inside the edit page. Shows:
   - List of currently linked catalog items (name + remove button)
   - Search/select input to find and add a catalog item by name
   - Uses `addCatalogItemToStore` / `removeCatalogItemFromStore` actions

5. **Update Edit Store page** (`app/[locale]/admin/stores/[id]/edit/page.tsx`)

   Fetch store + linked catalog items. Render `StoreForm` + `StoreItemsManager` below it.

6. **Update Stitch design** via `mcp__stitch-collectstory__edit_screens`

   Generate admin store edit screen with the new fields and item manager panel.

---

### Phase 3 — Public Store Detail Page

**Goal**: Build the `/stores/[store-slug]` public page end-to-end.

#### Steps

1. **Query function** (`lib/stores.ts` — new file)

   ```ts
   export type StoreDetail = { id, name, slug, url, city, country, lat, lng, verified, cover_url, logo_url, address, google_place_id }
   export type StoreDetailItem = { catalog_item_id, name, slug, image_url, franchise: { name, slug } | null }

   export async function getStoreBySlug(slug: string): Promise<StoreDetail | null>
   export async function getStoreItems(storeId: string): Promise<StoreDetailItem[]>
   ```

   Both use `'use cache'` + `cacheLife('hours')` + `cacheTag(\`store-${slug}\`)`.

2. **FSD: Entity — `src/entities/store/`**

   - `ui/StoreHero.tsx` + `StoreHero.module.css` — logo, name, location, verified badge, website link
   - `ui/StoreItemCard.tsx` + `StoreItemCard.module.css` — item image, name, franchise tag, links to `/catalog/[slug]`
   - `index.ts` — public exports

3. **FSD: Feature — `src/features/store-map/`**

   - `ui/StoreMapToggle.tsx` + `StoreMapToggle.module.css` — `'use client'` component
     - Shows "Show map" button when `lat`/`lng` present
     - On click: reveals Google Maps `<iframe>` embed using Maps Embed API with `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
     - URL: `https://www.google.com/maps/embed/v1/place?key={API_KEY}&q={lat},{lng}`
     - Lazy-loads iframe (only renders after toggle, protecting LCP/CLS)
   - `ui/StoreReviewsEmbed.tsx` + `StoreReviewsEmbed.module.css` — `'use client'`
     - Uses Google Maps Places API (via `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) to embed reviews
     - When `google_place_id` present: renders a Google Maps reviews embed or widget
     - Falls back gracefully when no `google_place_id`
   - `index.ts`

   > **API key**: Both the map embed and reviews widget use `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. This key must be added to `.env.local` and Vercel environment variables. It must have the **Maps Embed API** and **Places API** enabled in Google Cloud Console. Restrict the key to the app domain in production.

4. **FSD: Widget — `src/widgets/store-detail/`**

   - `ui/StoreDetailWidget.tsx` — Server Component composing all sections:
     - `StoreHero` (entity)
     - Catalog items grid with `StoreItemCard` (entity) or empty state
     - `StoreMapToggle` (feature, Client Component island)
     - `StoreReviewsEmbed` (feature, Client Component island)
   - `ui/StoreDetailWidget.module.css`
   - `index.ts`

5. **Page route** (`app/[locale]/stores/[store-slug]/page.tsx`)

   ```ts
   export const revalidate = 3600;

   export async function generateMetadata({ params }) // dynamic title + description + JSON-LD
   export default async function StoreDetailPage({ params }) // fetches data, calls notFound(), renders widget
   ```

   - Calls `getStoreBySlug(slug)` → `notFound()` if null or `!store.visible`
   - Calls `getStoreItems(store.id)` in parallel
   - Renders `<StoreDetailWidget>` + injects `LocalBusiness` JSON-LD via `<script type="application/ld+json">`

6. **Update `/stores` directory page**

   Add links from each store list item to `/stores/[store.slug]` — requires fetching `slug` in `getStores()`.

7. **i18n strings** — add keys to `messages/es.json` and `messages/en.json`:
   ```json
   "StorePage": {
     "verified": "Verificado",
     "visitStore": "Visitar tienda",
     "availableItems": "Artículos disponibles",
     "noItemsListed": "No hay artículos listados aún",
     "location": "Ubicación",
     "showMap": "Ver mapa",
     "hideMap": "Ocultar mapa",
     "reviews": "Reseñas en Google Maps",
     "viewReviews": "Ver reseñas en Google Maps"
   }
   ```

8. **SEO / sitemap**

   Update `app/sitemap.ts` to include all visible store slugs.

---

### Phase 4 — Design with Stitch MCP

**Goal**: Generate a reference design for the public store detail page and admin store edit page extensions.

#### Steps

1. **Generate store detail screen** via `mcp__stitch-collectstory__generate_screen_from_text` on project `10701000976131458615`

   Prompt covers: store hero (logo, name, location, verified badge), catalog items horizontal scroll, location section with map toggle, reviews section with Google Maps link. Apply Collectstory design system tokens.

2. **Generate admin store edit screen extension** via Stitch

   Shows new fields (cover_url, logo_url, address, google_place_id) and the `StoreItemsManager` panel.

3. **Use generated HTML/CSS as visual reference** when implementing components — adapt to CSS Modules + design tokens, do not copy verbatim.

---

### Phase 5 — Quality & Accessibility

**Goal**: Ensure the page meets AC9 (Lighthouse ≥ 90 mobile) and WCAG 2.2 AA.

#### Steps

1. **Lazy-load map iframe** — only mount `<iframe>` after user interaction (Phase 3, step 3 already covers this)
2. **`next/image` for all images** — logo, cover, catalog item images; set `sizes` and `priority` on hero cover
3. **Accessible toggle button** — `aria-expanded`, `aria-controls` on "Show map" button
4. **Run axe-core audit** via `mcp__chrome-user-session__evaluate_script` after dev server is running
5. **Run Lighthouse audit** via `mcp__chrome-user-session__lighthouse_audit` targeting mobile profile

---

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| `stores.slug` column | New — Phase 1 | Migration via Supabase MCP |
| `stores.cover_url`, `logo_url`, `address`, `google_place_id` | New — Phase 1 | Same migration |
| `catalog_item_stores` junction | Exists | Already used in admin catalog items; now also managed from store side |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | New env var | Required for Maps Embed API; add to `.env.local` + Vercel |
| `next-intl` | Exists | New `StorePage` namespace in messages |
| `@dezkareid/components` | Exists | `Button`, `Tag` reused in store hero and item cards |
| `@dezkareid/design-tokens` | Exists | All CSS uses tokens from this package |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Slug collision after backfill (two stores with same name) | Low (only 1 store currently) | Add `UNIQUE` constraint; handle duplicates by appending `-2`, `-3` in admin create action |
| Google Maps Embed API key missing in env | Medium | `StoreMapToggle` renders nothing (not an error) if key absent; add guard + dev warning |
| `google_place_id` missing for most stores | High (existing stores won't have it) | Both map and reviews sections gracefully hide when fields are null |
| Stitch MCP timeout during design generation | Confirmed | Retry manually; use `get_screen` after a few minutes; design generation is non-blocking |
| ISR stale data after admin edits | Low | `revalidateTag('store-<slug>')` called in all admin mutations |
| `catalog_item_stores` adding URL-per-item column | N/A | The spec references a "link of item in store" — this is the `url` on the `stores` table itself, not a per-item URL. No extra column needed unless a per-item purchase URL is required in future. |

---

## Out of Scope

- Platform-native review system
- Per-item purchase URL (item-in-store link)
- Store image gallery / photo uploads
- Promoted or sponsored listings
- Review pagination
- Admin moderation of reviews
- Editing or deleting a submitted review
