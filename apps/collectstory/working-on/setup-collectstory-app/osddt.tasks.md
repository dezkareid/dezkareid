# Tasks: Setup Collectstory App

## Dependencies

- Phase 1 must complete before all other phases (scaffold required)
- Phase 2 must complete before Phases 3, 5, and 6 (Supabase client required)
- Phase 3 must complete before Phase 5 (auth required for collection page)
- Phase 4 and Phase 6 are independent once Phase 1 is done
- Phase 7 requires Phases 1–6 to be complete
- Phase 8 can be done last

---

## Phase 1 — Project Scaffold

- [x] [M] Replace `apps/collectstory/package.json` with a full Next.js 16 package manifest (`@dezkareid/collectstory`) including `dev`, `build`, `start`, `lint` scripts and workspace dependencies (`@dezkareid/design-tokens`, `@dezkareid/components`)
- [x] [M] Create Next.js App Router directory structure: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next.config.ts`, `tsconfig.json`, `public/`
- [x] [S] Import design system CSS in `app/globals.css` (`@import '@dezkareid/components/css'`) and remove all default Next.js boilerplate styles
- [x] [S] Verify monorepo build works: `pnpm turbo run build --filter=@dezkareid/collectstory` from root

### Definition of Done
The app builds successfully from the monorepo root. No hardcoded styles remain from the Next.js scaffold.

---

## Phase 2 — Supabase Setup

- [x] [S] Install `@supabase/supabase-js` and `@supabase/ssr` as dependencies
- [x] [S] Create `lib/supabase/client.ts` — `createBrowserClient` for Client Components
- [x] [S] Create `lib/supabase/server.ts` — `createServerClient` with `next/headers` cookie wiring for Server Components and Route Handlers
- [x] [M] Create `middleware.ts` at app root — session refresh pattern; protect `/collection` route (redirect unauthenticated users to `/login`); add `matcher` config excluding static assets
- [x] [S] Create `.env.local.example` documenting all required env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_CLOUD_NAME`)
- [x] [M] Write Supabase migration SQL `supabase/migrations/001_initial_schema.sql` — tables: `brands`, `lines`, `categories`, `stores`, `collection_items`; RLS policies for `collection_items` (user-scoped CRUD); public SELECT policies for reference tables

### Definition of Done
Supabase client utilities are in place. Middleware protects `/collection`. Migration SQL covers all tables and RLS policies.

---

## Phase 3 — Authentication

- [x] [M] Create `app/login/page.tsx` — public SSG page with three social login buttons (Google, Facebook, X) using `Button` from `@dezkareid/components/react`; design token styling only
- [x] [M] Create `app/login/actions.ts` — Server Actions for `signInWithOAuth` for each provider with `redirectTo: /auth/callback`
- [x] [M] Create `app/auth/callback/route.ts` — Route Handler exchanging OAuth code for session via `exchangeCodeForSession`, redirecting to `/collection`
- [x] [S] Create `app/collection/actions.ts` — sign-out Server Action calling `supabase.auth.signOut()`, redirecting to `/`
- [x] [S] Create `components/SignOutButton.tsx` — Client Component calling the sign-out action; uses `Button` from design system

### Definition of Done
A user can complete the full OAuth flow (sign in via Google/Facebook/X), land on `/collection`, and sign out back to the homepage. Unauthenticated access to `/collection` redirects to `/login`.

---

## Phase 4 — Homepage (SSG)

- [x] [M] Build `app/page.tsx` — hero section, about section, CTA (sign in / explore); `export const dynamic = 'force-static'`; uses `Button`, `Card`, `ThemeToggle` from `@dezkareid/components/react`
- [x] [S] Add Next.js `metadata` export to homepage: `title`, `description`, `openGraph`
- [x] [S] Create site header/nav component with `ThemeToggle` and navigation links; include in `app/layout.tsx`
- [x] [S] Ensure all styles use CSS custom properties from design tokens — no hardcoded color, spacing, or typography values

### Definition of Done
Homepage renders publicly without auth. Theme toggle works. Page metadata is set. Zero hardcoded style values.

---

## Phase 5 — Collection Page (SSR)

- [x] [M] Create `app/collection/layout.tsx` — authenticated area layout with nav, `SignOutButton`, and user display
- [x] [M] Create `app/collection/page.tsx` — SSR page (`export const dynamic = 'force-dynamic'`); fetches authenticated user and their `collection_items` joined with `brands` and `lines`; renders item grid; handles empty state
- [x] [M] Create `components/CollectionItemCard.tsx` — displays item name, brand, line, category, Cloudinary image; uses `Card` and `Tag` from `@dezkareid/components/react`
- [x] [S] Add `res.cloudinary.com` to `images.remotePatterns` in `next.config.ts`

### Definition of Done
Authenticated user sees their collection items with images. Empty state renders when no items exist. Unauthenticated access redirects to `/login`.

---

## Phase 6 — Stores Directory (SSG)

- [x] [M] Create `app/stores/page.tsx` — SSG page; fetches all stores from Supabase at build time; displays store name, city, country, website link using `Card` component
- [x] [S] Add `metadata` export to stores page for SEO

### Definition of Done
Stores page renders publicly, is statically generated, and lists all stores from the database.

---

## Phase 7 — Vercel Deployment Config

- [x] [S] Create `apps/collectstory/vercel.json` — configure build command and output for monorepo if needed
- [x] [S] Add `output: 'standalone'` to `next.config.ts` if required for Vercel monorepo deployment
- [x] [S] Verify environment variable list in README matches what Vercel requires

### Definition of Done
App deploys successfully on Vercel with only environment variables configured.

---

## Phase 8 — Documentation

- [x] [M] Write `apps/collectstory/README.md` — overview, local setup steps, required env vars, available scripts, monorepo usage
- [x] [M] Write `apps/collectstory/AGENTS.md` — package context for AI agents: directory structure, routing conventions, data model overview, auth pattern, design system integration notes

### Definition of Done
README and AGENTS.md are complete and accurate. Another developer (or AI agent) can onboard from the docs alone.
