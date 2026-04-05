# Implementation Plan: Franchise Catalog

**Feature:** `add-serie-store`
**Date:** 2026-04-05
**Stack:** Next.js 16 (App Router) · Supabase (PostgreSQL + RLS) · Cloudinary · TypeScript · CSS Modules

---

## Architecture Overview

The Franchise Catalog follows the same admin-managed reference catalog pattern already established by `brands`, `lines`, `categories`, and `stores`. No new architectural patterns are introduced.

### Data model

Two new tables are added:

**`franchises`**
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `name` | `text` | Official name, e.g. "Saint Seiya" |
| `slug` | `text` | Unique, URL-safe, derived from name |
| `description` | `text` | Optional |
| `image_url` | `text` | Required (Cloudinary URL) |
| `created_at` | `timestamptz` | Default `now()` |

**`franchise_localized_names`**
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `franchise_id` | `uuid` | FK → `franchises.id` ON DELETE CASCADE |
| `locale` | `text` | BCP 47 code, e.g. `es-419`, `ja` |
| `name` | `text` | Localised name, e.g. "Caballeros del Zodiaco" |
| `slug` | `text` | Unique, URL-safe, derived from localised name |
| `created_at` | `timestamptz` | Default `now()` |

**`collection_items`** — add nullable FK column:
```sql
franchise_id uuid references franchises(id) on delete set null
```
`ON DELETE SET NULL` ensures deleting a franchise leaves the item intact with `franchise_id = null`.

### Routing additions

| Route | Type | Access |
|---|---|---|
| `/franchises` | SSG (ISR 1h) | Public |
| `/franchises/[slug]` | SSG (ISR 1h) | Public — resolves official slug or localised slug (301 redirect) |
| `/admin/franchises` | PPR | Admin only |
| `/admin/franchises/new` | PPR | Admin only |
| `/admin/franchises/[id]/edit` | PPR | Admin only |
| `/admin/franchises/[id]/localized-names/new` | PPR | Admin only |
| `/admin/franchises/[id]/localized-names/[nameId]/edit` | PPR | Admin only |

### RLS policies

- `franchises`: Public SELECT; Admin INSERT / UPDATE / DELETE
- `franchise_localized_names`: Public SELECT; Admin INSERT / UPDATE / DELETE
- `collection_items.franchise_id`: existing item RLS policies are unchanged; the new column is just another nullable FK

---

## Implementation Phases

### Phase 1 — Database migration

**Goal:** Add the new tables and alter `collection_items`.

1. Generate migration file with Supabase CLI from `apps/collectstory/`:
   ```bash
   npx supabase migration new add_franchise_catalog
   ```

2. Write migration SQL:
   - Create `franchises` table with columns above
   - Create `franchise_localized_names` table with `ON DELETE CASCADE` on `franchise_id`
   - Add unique index on `franchise_localized_names(slug)`
   - Add unique index on `franchise_localized_names(franchise_id, locale)` — one entry per locale per franchise
   - Add nullable `franchise_id` column to `collection_items` with `ON DELETE SET NULL`
   - RLS: enable RLS on both new tables; add public SELECT policies; add admin-only write policies using the `(SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'` pattern already used by brands/lines/categories

3. Apply via MCP or `npx supabase db push`.

---

### Phase 2 — Admin CRUD for Franchises

**Goal:** Admins can create, edit, and delete franchises (with cover image upload).

Mirror the pattern from `/admin/brands/`.

#### Files to create

**`app/admin/franchises/page.tsx`**
- Server Component, `await connection()`
- Fetch all franchises ordered by name, include `franchise_localized_names` count for display
- Render table with columns: cover thumbnail, name, slug, localised names count, Edit link, Delete button
- Link to `/admin/franchises/new`

**`app/admin/franchises/new/page.tsx`**
- Renders `<FranchiseForm action={createFranchise} submitLabel="Create franchise" />`

**`app/admin/franchises/[id]/edit/page.tsx`**
- Fetch franchise by id + all its localised names
- Renders `<FranchiseForm action={updateFranchise.bind(undefined, id)} defaultValues={franchise} submitLabel="Update franchise" />`
- Below the form: table of localised names with edit/delete links, and a link to add a new localised name

**`app/admin/franchises/actions.ts`**
- `createFranchise(formData)` — validate name + image_url required; insert; redirect to `/admin/franchises`
- `updateFranchise(id, formData)` — validate; update; redirect to `/admin/franchises`
- `deleteFranchise(formData)` — delete by id; `ON DELETE SET NULL` cascades to items automatically; revalidate; redirect

**`components/admin/FranchiseForm.tsx`**
- `'use client'` component
- Fields: `name` (required), `slug` (required, auto-derived, editable), `description` (textarea, optional), `image` (file required — use same upload pattern as existing forms)
- Uses `useActionState` + `/api/upload` for image
- Reuses admin `form.module.css` styles

---

### Phase 3 — Admin CRUD for Localised Names

**Goal:** Admins can add, edit, and delete localised names on a franchise.

**`app/admin/franchises/[id]/localized-names/new/page.tsx`**
- Fetch parent franchise (show franchise name as context)
- Renders `<LocalizedNameForm action={createLocalizedName.bind(undefined, franchiseId)} submitLabel="Add name" />`

**`app/admin/franchises/[id]/localized-names/[nameId]/edit/page.tsx`**
- Fetch localised name record
- Renders `<LocalizedNameForm action={updateLocalizedName.bind(undefined, nameId)} defaultValues={record} submitLabel="Update name" />`

**`app/admin/franchises/[id]/localized-names/actions.ts`** (or inline in franchises actions)
- `createLocalizedName(franchiseId, formData)` — validate locale (BCP 47 non-empty) + name; derive slug; insert into `franchise_localized_names`; handle `23505` (duplicate locale or slug); redirect back to `/admin/franchises/[id]/edit`
- `updateLocalizedName(nameId, formData)` — update locale + name + slug; redirect back
- `deleteLocalizedName(formData)` — delete by nameId; redirect back

**`components/admin/LocalizedNameForm.tsx`**
- Fields: `locale` (text, BCP 47, required — placeholder `es-419`), `name` (text, required)
- Lightweight — no image upload needed

---

### Phase 4 — Franchise selector on collection item form

**Goal:** Users can optionally link a franchise when adding/editing an item.

**`app/collection/actions.ts`** — add:
```ts
export async function getAllFranchises(): Promise<{ id: string; name: string }[]>
```
Fetches `franchises` ordered by name using the server client (public read).

**`components/AddItemForm/AddItemForm.tsx`**
- Accept new prop `franchises: { id: string; name: string }[]`
- Add `franchise_id` select field (optional — first option is empty "— None —")
- Pass `franchise_id` value in FormData to `createCollectionItem` server action

**`app/collection/page.tsx`** (where AddItemForm is rendered)
- Fetch `getAllFranchises()` alongside existing brands fetch
- Pass `franchises` prop to `<AddItemForm />`

**`createCollectionItem` / `updateCollectionItem` server actions**
- Parse optional `franchise_id` from FormData
- Include in insert/update payload

---

### Phase 5 — Public franchise pages

**Goal:** Public franchise index and detail pages; canonical redirect for localised slugs.

#### `lib/franchises.ts` — query helpers

```ts
// All franchises for index page
export async function getAllPublicFranchises(): Promise<FranchiseCard[]>
// Franchise by official slug → includes localized names + public items
export async function getFranchiseBySlug(slug: string): Promise<FranchiseDetail | null>
// Localised slug lookup → returns official slug for redirect
export async function getOfficialSlugByLocalizedSlug(slug: string): Promise<string | null>
```

Use `createPublicClient()` (same as `lib/collections.ts`). Nested select pattern:
```ts
supabase
  .from('franchises')
  .select(`
    id, name, slug, description, image_url,
    franchise_localized_names ( id, locale, name, slug )
  `)
  .eq('slug', slug)
  .single()
```

For items on the franchise detail page:
```ts
supabase
  .from('collection_items')
  .select('id, name, slug, image_url, user_id, ...')
  .eq('franchise_id', franchiseId)
  .eq('visibility', 'public')
  .order('created_at', { ascending: false })
```

#### `app/franchises/page.tsx`

- SSG with `export const revalidate = 3600`
- Fetches all public franchises, renders a card grid
- Each card: cover image, official name, list of localised names

#### `app/franchises/[slug]/page.tsx`

- SSG with `export const revalidate = 3600`
- On render:
  1. Try `getFranchiseBySlug(slug)` — if found, render detail page
  2. If not found, try `getOfficialSlugByLocalizedSlug(slug)` — if found, `redirect('/franchises/' + officialSlug, RedirectType.permanent)` (HTTP 301)
  3. If neither, `notFound()`
- Page renders: cover image, official name, all localised names with locale codes, public items grid

#### `generateStaticParams`

Generate params for all official slugs (localised slugs are not pre-rendered since they redirect).

---

### Phase 6 — Item detail page: show linked franchise

**Goal:** The collection item detail page shows the linked franchise name, linked to its page.

**`app/[username]/[collectionSlug]/[slug]/page.tsx`** (or the query it uses)
- Extend the item query to include `franchises ( name, slug )` via the FK join
- If `item.franchises` is present, render a linked chip/badge: "Franchise: [Saint Seiya]" → `/franchises/saint-seiya`

---

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| Supabase (PostgreSQL + RLS) | Existing | New tables + migration only |
| Cloudinary | Existing | Reuse `/api/upload` route handler |
| Next.js App Router | Existing | New pages under `app/franchises/` and `app/admin/franchises/` |
| `@dezkareid/design-tokens` | Existing | CSS custom properties only |
| `@dezkareid/components/react` | Existing | Button, Card where needed |

No new npm packages are required.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Localised slug collision with official slug | Enforce unique constraint across both `franchises.slug` and `franchise_localized_names.slug` at DB level. In the admin form, validate that a localised slug doesn't already exist as an official slug (and vice versa). |
| `ON DELETE SET NULL` silently unlinking items | Expected behaviour per spec. Admin UI should warn when deleting a franchise that has linked items (show count before confirming deletion). |
| Cover image required but upload fails | Keep the existing client-side validation pattern: disable submit until upload completes; show inline error on failure. |
| ISR stale cache after admin edits | Call `revalidatePath('/franchises')` and `revalidatePath('/franchises/' + slug)` in admin server actions after create/update/delete. |
| BCP 47 locale validation | Do a lightweight regex check on the `locale` field in the server action (`/^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2}|\d{3})?$/`) rather than a full BCP 47 parser. |

---

## Out of Scope

- User-created franchises
- Assigning multiple franchises to one item
- UI internationalisation (only franchise names are localised)
- Automatic locale detection for name display
- Search across localised names
- Franchise-level analytics
