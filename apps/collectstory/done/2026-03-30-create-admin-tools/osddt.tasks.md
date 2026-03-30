# Tasks: Admin Tools

## Phase 1 — Database: profiles table + RLS + bootstrap migration

> **Depends on**: nothing
> **Definition of Done**: migrations apply cleanly; `profiles` rows are auto-created on new signups; admin RLS policies allow admin writes on reference tables; bootstrap migration promotes the target user idempotently.

- [x] [M] Write `002_profiles_and_roles.sql`: create `profiles` table with `role` column, auto-insert trigger on `auth.users`, RLS policies for self-read/update, index on `profiles(role)`, admin write policies on `brands`/`lines`/`categories`/`stores`
- [x] [S] Write `003_bootstrap_admin.sql`: idempotent `DO` block that promotes a user by email to `admin` only if no admin exists yet; include `-- TODO: replace with your email` comment
- [x] [S] Apply migrations to the remote Supabase project via Supabase MCP or CLI

## Phase 2 — Server infrastructure

> **Depends on**: Phase 1
> **Definition of Done**: admin client, role helper, and slugify util exist and are importable; middleware correctly redirects unauthenticated and non-admin users away from `/admin`.

- [x] [S] Create `lib/supabase/admin.ts`: `createAdminClient()` using `SUPABASE_SERVICE_ROLE_KEY`, guarded with `import 'server-only'`
- [x] [S] Create `lib/auth/role.ts`: `getSessionAndRole()` that reads the current user's `profiles` row and returns `{ user, role }` or `null`
- [x] [S] Create `lib/utils/slugify.ts`: pure `slugify(name: string): string` function
- [x] [M] Update `proxy.ts` (middleware): extend existing session logic to redirect `/admin/*` — unauthenticated → `/login`, authenticated non-admin → `/collection`

## Phase 3 — Admin route group: layout + dashboard

> **Depends on**: Phase 2
> **Definition of Done**: `/admin` renders for admin users; non-admins and unauthenticated users are redirected; SiteHeader shows "Admin" link only to admins.

- [x] [M] Create `app/admin/layout.tsx`: Server Component that calls `getSessionAndRole()`, redirects if not admin, renders admin nav shell with links to Brands, Lines, Categories, Stores
- [x] [S] Create `app/admin/layout.module.css`: styles for admin shell nav
- [x] [S] Create `app/admin/page.tsx`: dashboard index with cards/links to each resource section
- [x] [M] Update `app/layout.tsx`: read role server-side, pass `isAdmin` to `SiteHeader` (implemented in collection layout instead — root layout is static)
- [x] [S] Update `components/SiteHeader.tsx`: accept `isAdmin?: boolean` prop, conditionally render "Admin" nav link

## Phase 4 — Brands CRUD

> **Depends on**: Phase 3
> **Definition of Done**: admin can list, create, edit, and delete brands; slug auto-generated on create and edit; delete requires confirmation; all actions enforce role server-side.

- [x] [S] Create `app/admin/brands/page.tsx`: fetch and list all brands
- [x] [S] Create `app/admin/brands/new/page.tsx`: new brand form page
- [x] [S] Create `app/admin/brands/[id]/edit/page.tsx`: edit brand form page (pre-populated)
- [x] [M] Create `app/admin/brands/actions.ts`: `createBrand`, `updateBrand`, `deleteBrand` Server Actions with role check, slugify, admin client writes, and `revalidatePath`
- [x] [S] Create `components/admin/BrandForm.tsx`: shared `'use client'` form for new/edit
- [x] [S] Create `components/admin/DeleteButton.tsx`: `'use client'` confirmation button reusable across all resource types

## Phase 5 — Lines CRUD

> **Depends on**: Phase 4 (DeleteButton reuse)
> **Definition of Done**: admin can list all lines (flat, with Brand column), create, edit, and delete lines; brand selector populated from DB.

- [x] [S] Create `app/admin/lines/page.tsx`: fetch lines joined with brand name, render flat table
- [x] [S] Create `app/admin/lines/new/page.tsx`: form with brand selector + name field
- [x] [S] Create `app/admin/lines/[id]/edit/page.tsx`: pre-populated edit form
- [x] [M] Create `app/admin/lines/actions.ts`: `createLine`, `updateLine`, `deleteLine` Server Actions with role check, slugify, admin client

## Phase 6 — Categories CRUD

> **Depends on**: Phase 3
> **Definition of Done**: admin can list, create, edit, and delete categories.

- [x] [S] Create `app/admin/categories/page.tsx`: list all categories
- [x] [S] Create `app/admin/categories/new/page.tsx`: name-only create form
- [x] [S] Create `app/admin/categories/[id]/edit/page.tsx`: edit form
- [x] [M] Create `app/admin/categories/actions.ts`: `createCategory`, `updateCategory`, `deleteCategory` Server Actions

## Phase 7 — Stores CRUD

> **Depends on**: Phase 3
> **Definition of Done**: admin can list, create, edit, and delete stores; all optional fields (URL, country, city, lat, lng) are handled gracefully.

- [x] [S] Create `app/admin/stores/page.tsx`: list stores (name, city, country, URL columns)
- [x] [S] Create `app/admin/stores/new/page.tsx`: full store form (name required, rest optional)
- [x] [S] Create `app/admin/stores/[id]/edit/page.tsx`: pre-populated edit form
- [x] [M] Create `app/admin/stores/actions.ts`: `createStore`, `updateStore`, `deleteStore` Server Actions

## Phase 8 — Polish & verification

> **Depends on**: Phases 1–7
> **Definition of Done**: all 12 acceptance criteria from the spec pass; AGENTS.md updated.

- [x] [S] Verify middleware redirects: unauthenticated → `/login`, non-admin → `/collection` for all `/admin/*` routes
- [x] [S] Verify Server Actions reject non-admin callers even with direct requests (no UI bypass possible)
- [x] [S] Verify cascade: deleting a brand removes its lines; UI warns admin before delete
- [x] [S] Verify slug collision error is caught and surfaced as a user-friendly message
- [x] [S] Update `AGENTS.md`: add `/admin` routes table, document bootstrap migration steps, document `createAdminClient` usage
