# Spec: Admin Tools

## Overview

Collectstory currently has reference tables (`brands`, `lines`, `categories`, `stores`) that are publicly readable but have no write path for regular users — writes are reserved for service-role access. There is no UI or access-control mechanism to manage this reference data.

This feature introduces an admin section of the app where a designated admin user (the owner) can create, edit, and delete brands, lines, collections (categories), and stores. It also establishes the concept of roles so that the first user can be promoted to admin status.

## Requirements

### Role System

- The system must support at least two roles: `admin` and `user`.
- A user's role must be stored persistently and checked server-side on every admin request.
- Only users with the `admin` role may access any admin UI or perform admin write operations.
- Non-admin authenticated users visiting any `/admin` route must be redirected (e.g., back to `/collection`).
- Unauthenticated visitors must be redirected to `/login`.

### Bootstrapping the First Admin

- There must be a one-time mechanism to promote a specific user (by their Supabase Auth user ID or email) to the `admin` role without requiring an existing admin.
- Once at least one admin exists, this bootstrap mechanism must no longer be usable.
- The bootstrap operation must be safe to run in a migration (idempotent).

### Admin Dashboard

- Admin users must be able to navigate to a dedicated `/admin` section of the app.
- The dashboard must provide entry points to manage each resource: brands, lines, categories (shown as "Collections"), and stores.

### Brands Management

- Admin can view a list of all brands.
- Admin can create a new brand (name required; slug auto-derived from name).
- Admin can edit an existing brand's name (slug updated accordingly or kept stable — see Open Questions).
- Admin can delete a brand (with a confirmation step before deletion).

### Lines Management

- Admin can view a list of all lines, grouped or filterable by brand.
- Admin can create a new line, selecting the parent brand (required) and providing a name (slug auto-derived).
- Admin can edit an existing line's name and/or parent brand.
- Admin can delete a line (with a confirmation step).

### Categories Management

- Admin can view a list of all categories.
- Admin can create a new category (name required; slug auto-derived).
- Admin can edit a category's name.
- Admin can delete a category (with a confirmation step).

### Stores Management

- Admin can view a list of all stores.
- Admin can create a new store (name required; URL, country, city, lat, lng optional).
- Admin can edit any field of an existing store.
- Admin can delete a store (with a confirmation step).

### Navigation

- The admin section must be accessible from the site header for admin users only (a link or indicator should appear).
- Non-admin users must not see any admin navigation links.

## Scope

### In Scope

- Role system with `admin` and `user` roles backed by the database.
- First-admin bootstrap via a database migration or seed script.
- `/admin` route group protected server-side by role check.
- CRUD UI for: brands, lines, categories, stores.
- Slug auto-generation from name on create.
- Route-level protection in middleware or layout (server-side).
- Admin nav link visible only to admins.

### Out of Scope

- Multi-admin management UI (inviting or demoting admins via the UI).
- Role management for regular users (assigning roles through a UI).
- Audit logging of admin actions.
- `collection_items` management through admin (users manage their own items).
- Pagination or search for admin list views (deferred until data volume warrants it).
- Image upload for brands/lines/stores.

## Acceptance Criteria

1. A non-authenticated user visiting `/admin` is redirected to `/login`.
2. An authenticated user without the `admin` role visiting `/admin` is redirected to `/collection`.
3. An authenticated admin user can access `/admin` and see a dashboard with links to manage brands, lines, categories, and stores.
4. Admin can create a brand; it appears in the brands list immediately after creation.
5. Admin can edit a brand's name; the change is reflected in the list.
6. Admin can delete a brand; it no longer appears in the list after deletion.
7. Admin can create a line associated with an existing brand.
8. Admin can create, edit, and delete categories.
9. Admin can create, edit, and delete stores (all optional fields can be left blank).
10. The site header shows an "Admin" link only when the logged-in user has the `admin` role.
11. The first-admin bootstrap can be run once (via migration/seed) and is idempotent — running it again when an admin already exists has no effect.
12. All admin write operations reject requests from non-admin users, even if the UI protection is bypassed (server-side enforcement).

## Decisions

1. **Slug on edit**: Slug is auto-updated from the name on every edit (not kept stable).
2. **Lines list layout**: Flat list with a "Brand" column — no nesting or grouping.
3. **Bootstrap mechanism**: Pure DB migration only — no setup UI. A migration promotes the first user by email/ID; idempotent (no-op if an admin already exists).
4. **Roles storage**: Single `role` column on a `profiles` table (one row per auth user, simpler).
