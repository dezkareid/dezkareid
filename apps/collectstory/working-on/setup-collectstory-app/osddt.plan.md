# Plan: Setup Collectstory App

## Architecture Overview

### Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Pure CSS using `@dezkareid/design-tokens` CSS custom properties |
| UI Components | `@dezkareid/components/react` |
| Auth | Supabase Auth — Google, Facebook, X (OAuth) |
| Database | Supabase PostgreSQL |
| Image hosting | Cloudinary (referenced by URL, no upload in this setup) |
| Hosting | Vercel |
| Package manager | pnpm (monorepo workspace) |

### Rendering Strategy

- **Public pages** (homepage, stores directory): SSG — built at deploy time for maximum performance and SEO.
- **Authenticated pages** (`/collection`): SSR — server-renders per request so user session is always fresh.
- **Auth callback route** (`/auth/callback`): Server Route Handler — exchanges OAuth code for session.

### Supabase Auth Architecture

- `@supabase/supabase-js` + `@supabase/ssr` (never use deprecated `@supabase/auth-helpers-nextjs`)
- `createBrowserClient` — used in Client Components
- `createServerClient` — used in Server Components, Route Handlers, and Middleware
- **Middleware** runs on every request to refresh session cookies and protect authenticated routes
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### Monorepo Integration

- The existing `apps/collectstory/package.json` is replaced/updated to a full Next.js package.
- The app is registered in `pnpm-workspace.yaml` (already present as `apps/*`).
- Turbo `dev`, `build`, `lint` tasks work from the monorepo root.
- Design system packages (`@dezkareid/design-tokens`, `@dezkareid/components`) are workspace dependencies.

### Data Model (Supabase PostgreSQL)

```
brands          id, name, slug, created_at
lines           id, brand_id (FK→brands), name, slug, created_at
categories      id, name, slug, created_at
stores          id, name, url, country, city, lat, lng, created_at
collection_items
                id, user_id (FK→auth.users), name, image_url,
                brand_id (FK→brands), line_id (FK→lines, nullable),
                category_id (FK→categories, nullable),
                description, date_acquired, created_at, updated_at
```

Row-Level Security (RLS):
- `collection_items`: users can only SELECT/INSERT/UPDATE/DELETE their own rows (`auth.uid() = user_id`)
- `brands`, `lines`, `categories`, `stores`: public SELECT; INSERT/UPDATE restricted to service role or admin

---

## Implementation Phases

### Phase 1 — Project Scaffold

**Goal**: Replace the placeholder `apps/collectstory` with a full Next.js 16 + TypeScript app, wired into the monorepo.

1. Replace `apps/collectstory/package.json` with a proper Next.js package manifest (`@dezkareid/collectstory`), adding scripts `dev`, `build`, `start`, `lint`.
2. Run `create-next-app@latest` output manually (do not use the CLI interactively) — create the standard App Router directory structure:
   - `app/layout.tsx`, `app/page.tsx`
   - `app/globals.css`
   - `next.config.ts`
   - `tsconfig.json`
   - `public/`
3. Add workspace dependencies: `@dezkareid/design-tokens`, `@dezkareid/components`.
4. Import design tokens CSS in `app/globals.css`:
   ```css
   @import '@dezkareid/components/css';
   ```
5. Remove all default Next.js boilerplate styles; replace with design token variables only.
6. Verify `pnpm turbo run build --filter=@dezkareid/collectstory` succeeds from monorepo root.

### Phase 2 — Supabase Setup

**Goal**: Configure Supabase client utilities, middleware, and database schema.

1. Install `@supabase/supabase-js` and `@supabase/ssr`.
2. Create `lib/supabase/client.ts` — `createBrowserClient` for Client Components.
3. Create `lib/supabase/server.ts` — `createServerClient` with `next/headers` cookie wiring for Server Components and Route Handlers.
4. Create `middleware.ts` at the app root — session refresh pattern using `createServerClient`; protect `/collection` route (redirect unauthenticated users to `/login`).
5. Add `matcher` config to middleware (exclude `_next/static`, `_next/image`, `favicon.ico`, public assets).
6. Create `.env.local.example` documenting required env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CLOUDINARY_CLOUD_NAME`
7. Write Supabase migration SQL (`supabase/migrations/001_initial_schema.sql`):
   - Tables: `brands`, `lines`, `categories`, `stores`, `collection_items`
   - RLS policies for `collection_items` (user-scoped CRUD)
   - Public SELECT policies for reference tables

### Phase 3 — Authentication

**Goal**: Implement social login (Google, Facebook, X) and sign-out.

1. Create `app/login/page.tsx` — public SSG page with sign-in UI using design system components (Button). Three social login buttons (Google, Facebook, X).
2. Create `app/login/actions.ts` — Server Actions calling `supabase.auth.signInWithOAuth()` for each provider, with `redirectTo` pointing to `/auth/callback`.
3. Create `app/auth/callback/route.ts` — Route Handler that exchanges the OAuth code for a session via `supabase.auth.exchangeCodeForSession()` and redirects to `/collection`.
4. Add sign-out Server Action (`app/collection/actions.ts`) calling `supabase.auth.signOut()`, redirecting to `/`.
5. Expose a `SignOutButton` Client Component in the collection layout that calls the sign-out action.

### Phase 4 — Homepage (SSG)

**Goal**: Build the public homepage using the design system.

1. Create `app/page.tsx` — statically generated (default in App Router with no dynamic data).
2. Add `export const dynamic = 'force-static'` to make intent explicit.
3. Structure: hero section, brief about section, call-to-action (sign in / explore).
4. Use `@dezkareid/components/react` primitives: `Button`, `Card`, `ThemeToggle`.
5. Apply layout via CSS custom properties from design tokens only — no hardcoded values.
6. Add Next.js `metadata` export: `title`, `description`, `openGraph`.
7. Include `ThemeToggle` in the site header/nav.

### Phase 5 — Collection Page (SSR)

**Goal**: Build the authenticated `/collection` page showing the user's items.

1. Create `app/collection/layout.tsx` — shared layout for the authenticated area; includes nav with `SignOutButton` and user info.
2. Create `app/collection/page.tsx` — SSR page (`export const dynamic = 'force-dynamic'`).
   - Fetches the current user from Supabase server client.
   - Queries `collection_items` joined with `brands` and `lines` for the authenticated user.
   - Renders a grid of collection item cards.
3. Create `components/CollectionItemCard.tsx` — displays item name, brand, line, category, and Cloudinary image. Uses `@dezkareid/components/react` `Card` and `Tag`.
4. Handle empty state (no items yet) with a friendly message.
5. Configure `next.config.ts` to allow Cloudinary image hostname (`res.cloudinary.com`) in `images.remotePatterns`.

### Phase 6 — Stores Directory (SSG)

**Goal**: Build a public, statically generated stores directory page.

1. Create `app/stores/page.tsx` — SSG page listing all stores from Supabase (fetched at build time via `generateStaticParams` or a top-level async call).
2. Display store name, city, country, website link.
3. Use `Card` component for each store entry.
4. Add `metadata` export for SEO.

### Phase 7 — Vercel Deployment Config

**Goal**: Ensure smooth Vercel deployment.

1. Create `vercel.json` at `apps/collectstory/` — set `buildCommand` and `outputDirectory` if needed for monorepo (or rely on Vercel's auto-detection with `pnpm turbo`).
2. Document required Vercel environment variables in `README.md`.
3. Add `next.config.ts` output configuration (`standalone` output for optimal Vercel performance if needed).

### Phase 8 — Documentation

**Goal**: Leave the package fully documented per monorepo standards.

1. Write `apps/collectstory/README.md` — usage, local setup, env vars, available scripts.
2. Write `apps/collectstory/AGENTS.md` — package context for AI agents: structure, routing conventions, data model overview, auth pattern.

---

## Technical Dependencies

| Package | Purpose |
|---|---|
| `next` | Framework (16.x) |
| `react`, `react-dom` | UI runtime (19.x, matching monorepo) |
| `typescript` | Language (5.9.3, matching monorepo) |
| `@supabase/supabase-js` | Supabase core client |
| `@supabase/ssr` | Supabase SSR helpers for Next.js App Router |
| `@dezkareid/design-tokens` | CSS custom properties, spacing, colors |
| `@dezkareid/components` | Button, Card, Tag, ThemeToggle React components |
| `@types/node`, `@types/react` | Type definitions (matching monorepo versions) |

**External services:**
- Supabase project (Auth + PostgreSQL)
- Cloudinary account (cloud name for image URLs)
- Vercel project connected to the monorepo repo

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| OAuth provider setup (Google, Facebook, X) requires external app registration | Document required redirect URIs and credentials in README; mark as prerequisite before testing auth |
| Supabase middleware session desync (random logouts) | Strictly follow the `updateSession` middleware pattern — never create a new `NextResponse` after `createServerClient`; always return `supabaseResponse` unmodified |
| Monorepo build order: design system must be built before collectstory | Turbo `^build` dependency handles this automatically when running from root |
| `@dezkareid/components` currently exports Astro/Vue — React export must be confirmed available | Verified: `@dezkareid/components/react` export exists in `design-system/components/` |
| Cloudinary `res.cloudinary.com` must be whitelisted in Next.js image config | Added to `next.config.ts` `images.remotePatterns` in Phase 5 |
| Facebook and X OAuth require HTTPS callback URLs — localhost needs tunneling for local dev | Document use of `ngrok` or Vercel preview URLs for local OAuth testing |

---

## Out of Scope

- Collection item create/edit/delete UI
- Image upload to Cloudinary (deferred — paid-tier feature on roadmap)
- Free vs paid user tier logic
- Public collection profiles / sharing
- Search or filtering
- Maps/geo UI for stores (coordinates stored but not rendered on a map in this setup)
- Admin interface for managing brands, lines, categories, stores
- Email/password authentication
