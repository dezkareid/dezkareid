# Plan: Admin Tools

## Architecture Overview

### Stack
- **Framework**: Next.js App Router (existing), with the `/admin` route group added alongside `/collection`
- **Database**: Supabase Postgres — new `profiles` table holds the `role` column; admin writes use the service-role client
- **Auth**: Existing `@supabase/ssr` pattern; role check added to middleware and admin layouts
- **Data mutations**: Server Actions (no Route Handlers needed — admin is not a public API)
- **UI**: CSS Modules + design tokens (existing pattern); no new component library introduced

### Role Enforcement Strategy
- **Middleware** (`proxy.ts` — renamed from `middleware.ts` in Next.js 16): extend to also redirect `/admin/*` for non-admins
- **Admin layout** (`app/admin/layout.tsx`): secondary server-side check — reads profile role, redirects if not admin. Defense-in-depth.
- **Server Actions**: each action re-verifies the caller's role before executing any write. Never trust the client.

### Data Access Pattern
- **Reads in admin pages**: Server Components fetch directly via the server Supabase client (no waterfalls — use `Promise.all` where multiple tables are needed)
- **Writes**: Server Actions using a service-role Supabase client (`SUPABASE_SERVICE_ROLE_KEY`) to bypass RLS for reference table mutations
- **RLS additions**: New policies on `profiles` so each user can read/update only their own row; no direct admin write via anon/authenticated key

### Slug Generation
- Pure function `slugify(name: string): string` — lowercases, replaces non-alphanumeric with hyphens, collapses consecutive hyphens, trims. Applied on both create and edit.

---

## Implementation Phases

### Phase 1 — Database: profiles table + RLS + bootstrap migration

**Goal**: Persist roles; promote the first admin; no app code change yet.

1. **Migration `002_profiles_and_roles.sql`**:
   - Create `profiles` table: `id uuid PK references auth.users(id) on delete cascade`, `role text not null default 'user' check (role in ('admin', 'user'))`, `created_at`, `updated_at`
   - Create trigger on `auth.users` insert → auto-insert a `profiles` row with `role = 'user'` (new signups get default role)
   - Enable RLS on `profiles`
   - Policy: authenticated users can `SELECT` and `UPDATE` their own row (`auth.uid() = id`)
   - Index: `profiles(id)` (already PK); add `profiles(role)` for admin-check queries
   - Add RLS policies on reference tables for admin writes: `INSERT/UPDATE/DELETE` allowed when `exists (select 1 from profiles where id = auth.uid() and role = 'admin')`

2. **Migration `003_bootstrap_admin.sql`**:
   - Idempotent `DO $$ ... $$` block: if no row in `profiles` has `role = 'admin'`, find the user in `auth.users` by a placeholder email and update their `profiles` row to `role = 'admin'`
   - Uses a `DO` block so it is safe to re-run (checks before acting)
   - Placeholder email must be substituted before applying (documented in migration comment)

### Phase 2 — Server infrastructure: admin role helpers + service-role client

**Goal**: Shared utilities all admin Server Components and Actions will use.

1. **`lib/supabase/admin.ts`** — exports `createAdminClient()` using `SUPABASE_SERVICE_ROLE_KEY`; server-only (add `import 'server-only'`)
2. **`lib/auth/role.ts`** — exports `getSessionAndRole(): Promise<{ user, role } | null>` using the server Supabase client; reads `profiles` for the current user's role
3. **`lib/utils/slugify.ts`** — pure `slugify(name)` utility
4. **Update `proxy.ts` (middleware)** — extend the existing session-refresh logic to also check `/admin` routes: unauthenticated → `/login`; authenticated non-admin → `/collection`
   - Role check in middleware requires reading from `profiles` — use a lightweight query; cache result in a short-lived cookie or rely on layout double-check to avoid per-request DB round-trips (see Risks)

### Phase 3 — Admin route group: layout + dashboard

**Goal**: Scaffold the protected `/admin` area with a shell layout and index page.

1. **`app/admin/layout.tsx`** (Server Component):
   - Calls `getSessionAndRole()`
   - Redirects unauthenticated → `/login`, non-admin → `/collection`
   - Renders admin shell: sidebar/nav with links to Brands, Lines, Categories, Stores
   - CSS Module: `admin.layout.module.css`

2. **`app/admin/page.tsx`** — Dashboard index: links/cards to each resource section

3. **Update `components/SiteHeader.tsx`** — accept an optional `isAdmin` prop (passed from root layout after reading role); render "Admin" nav link conditionally. Root layout (`app/layout.tsx`) reads role server-side and passes it down.

### Phase 4 — Brands CRUD

**Goal**: Full create/edit/delete for brands.

Files under `app/admin/brands/`:
1. **`page.tsx`** (Server Component) — fetches all brands, renders `BrandsTable` + "New Brand" button
2. **`new/page.tsx`** — form page for creating a brand
3. **`[id]/edit/page.tsx`** — form page for editing a brand (pre-populated)
4. **`actions.ts`** (Server Actions):
   - `createBrand(formData)` — validates name, slugifies, inserts via admin client, revalidates `/admin/brands`
   - `updateBrand(id, formData)` — validates, slugifies, updates, revalidates
   - `deleteBrand(id)` — deletes, revalidates; cascades to lines via DB FK
   - Each action calls `getSessionAndRole()` and throws/redirects if not admin
5. **`components/BrandForm.tsx`** (`'use client'`) — shared form component used by new/edit pages; handles confirmation for delete via a separate `DeleteButton` client component

### Phase 5 — Lines CRUD

**Goal**: Full create/edit/delete for lines (flat list with brand column).

Files under `app/admin/lines/`:
1. **`page.tsx`** — fetches all lines joined with brand name; renders flat table with Brand column
2. **`new/page.tsx`** — form with brand selector (fetches brands list) + name field
3. **`[id]/edit/page.tsx`** — pre-populated form
4. **`actions.ts`**:
   - `createLine(formData)` — requires `brand_id` and `name`; slugifies name
   - `updateLine(id, formData)` — updates name, brand_id, slug
   - `deleteLine(id)`
   - Role check in each action

### Phase 6 — Categories CRUD

**Goal**: Full create/edit/delete for categories.

Files under `app/admin/categories/`:
1. **`page.tsx`** — list all categories
2. **`new/page.tsx`** / **`[id]/edit/page.tsx`** — name-only form
3. **`actions.ts`**: `createCategory`, `updateCategory`, `deleteCategory` — same pattern as brands

### Phase 7 — Stores CRUD

**Goal**: Full create/edit/delete for stores (all optional fields).

Files under `app/admin/stores/`:
1. **`page.tsx`** — list all stores (name, city, country, URL)
2. **`new/page.tsx`** / **`[id]/edit/page.tsx`** — full form with optional lat/lng/url/country/city
3. **`actions.ts`**: `createStore`, `updateStore`, `deleteStore` — same pattern; no slugify needed

### Phase 8 — Polish & verification

1. Verify all acceptance criteria end-to-end
2. Confirm middleware redirects work for unauthenticated and non-admin users
3. Confirm Server Actions reject non-admin callers even with direct POST attempts
4. Update `AGENTS.md` and `README.md` with new routes and admin bootstrap instructions

---

## Technical Dependencies

| Dependency | Already present | Notes |
|---|---|---|
| `@supabase/ssr` | Yes | Used for server client |
| `SUPABASE_SERVICE_ROLE_KEY` | Env var defined in `.env.local.example` | Must be set in `.env.local` and Vercel |
| `server-only` package | Check needed | Add if missing — guards admin client from client bundle |
| Next.js App Router | Yes | Route groups, Server Actions, layouts |
| CSS Modules + design tokens | Yes | Existing pattern |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Middleware role DB query adds latency** | Keep the role in the JWT custom claim (via Supabase Auth hook) so middleware reads it without a DB round-trip. If not feasible immediately, rely on layout-level redirect as primary guard and accept the middleware only checking authentication (not role). |
| **Service-role key leaked to client bundle** | `lib/supabase/admin.ts` uses `import 'server-only'` — build will fail if imported in a Client Component. Never pass admin client to props. |
| **Cascade deletes (brand → lines)** | Already handled by `ON DELETE CASCADE` on `lines.brand_id`. Inform admin in UI that deleting a brand removes its lines. |
| **Slug collisions on edit** | Catch unique constraint violation in Server Actions and return a user-friendly error message. |
| **Bootstrap migration applied with wrong email** | Migration includes a prominent `-- TODO: replace with your email` comment. If applied with placeholder, no user is promoted (safe no-op). |

---

## Out of Scope

- Multi-admin invite/demote UI
- Role assignment for regular users
- Audit logging
- `collection_items` admin management
- Pagination / search in admin lists
- Image upload for reference entities
