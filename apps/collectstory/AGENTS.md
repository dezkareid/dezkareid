# Agent Instructions: @dezkareid/collectstory

This file provides context for AI agents working on the `apps/collectstory` package.

## Overview

Next.js 16 (App Router) web application for tracking collectibles collections. Registered in the monorepo as `@dezkareid/collectstory`.

## Tech Stack & Versions

| Technology | Version / Detail |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.9.3 |
| **Package Manager** | pnpm (run all tasks from monorepo root via Turbo) |
| **Auth** | `@supabase/ssr` — cookie-based session with Next.js middleware |
| **Database** | Supabase (Postgres) with Row Level Security |
| **Styling** | CSS Modules + `@dezkareid/design-tokens` CSS custom properties |
| **UI Components** | `@dezkareid/components` (Button, Tag, Card, ThemeToggle) |
| **Analytics** | `@next/third-parties/google` (G4 integration) |
| **Linting** | `@dezkareid/eslint-plugin-web/next` (ESLint 9 flat config) |
| **Image CDN** | Cloudinary (configured via `next.config.ts` remotePatterns) |
| **Node** | >= 22 |

## Project Structure

This project uses **Feature-Sliced Design (FSD)** inside `src/` alongside the Next.js `app/` router. All new code belongs in `src/`. The `components/` directory is legacy and being migrated progressively.

```
apps/collectstory/
├── app/                                          # Next.js App Router — routing only
│   ├── layout.tsx                                # Root layout (font, theme script, SiteHeader)
│   ├── globals.css                               # Global styles (imports @dezkareid/components/css)
│   ├── page.tsx                                  # Homepage (SSG, force-static)
│   ├── page.module.css
│   ├── sitemap.ts                                # Dynamic sitemap generation
│   ├── login/
│   │   ├── page.tsx                              # Login page (SSG, force-static)
│   │   ├── login.module.css
│   │   └── actions.ts                            # Server Action: signInWithGoogle
│   ├── auth/callback/route.ts                    # OAuth callback Route Handler
│   ├── api/upload/route.ts                       # Image upload endpoint
│   ├── collection/
│   │   ├── layout.tsx / layout.module.css        # Authenticated layout
│   │   ├── page.tsx / page.module.css            # My Collection (SSR, force-dynamic)
│   │   ├── error.tsx / error.module.css          # Error boundary
│   │   └── actions.ts                            # signOut, item/collection mutations
│   ├── admin/                                    # Admin pages (PPR, admin role only)
│   │   ├── layout.tsx / layout.module.css        # AdminGuard in Suspense
│   │   ├── page.tsx / page.module.css            # Admin dashboard
│   │   ├── form.module.css / list.module.css     # Shared admin styles
│   │   └── {brands,lines,categories,stores,franchises}/
│   │       ├── page.tsx                          # List view
│   │       ├── new/page.tsx                      # Create form
│   │       ├── [id]/edit/page.tsx                # Edit form
│   │       └── actions.ts                        # CRUD server actions
│   ├── [username]/                               # Public user profiles (ISR)
│   │   ├── page.tsx / page.module.css            # User collections list
│   │   └── [collectionSlug]/
│   │       ├── page.tsx / page.module.css        # Collection view
│   │       ├── actions.ts
│   │       ├── edit/                             # Edit collection
│   │       └── items/
│   │           ├── new/                          # Add item
│   │           └── [itemId]/edit/               # Edit item
│   │               └── [slug]/                   # Item detail
│   ├── stores/page.tsx / page.module.css         # Stores directory (ISR, revalidate 1h)
│   ├── franchises/                               # Franchise catalog (ISR)
│   │   ├── page.tsx / page.module.css
│   │   └── [slug]/page.tsx / page.module.css
│   └── profile/edit/                             # Edit profile
│       ├── page.tsx / page.module.css
│       └── actions.ts
│
├── src/                                          # FSD — all new code goes here
│   ├── shared/                                   # No business logic; reusable by any layer
│   │   ├── lib/
│   │   │   ├── analytics/                        # Analytics utilities
│   │   │   │   ├── events.ts                     # Typed G4 event tracking wrapper
│   │   │   │   ├── hash.ts                       # SHA-256 User ID hashing
│   │   │   │   ├── useAnalytics.ts               # Client hook for tracking with auth/consent context
│   │   │   │   └── AnalyticsClient.tsx           # Client-side GA initializer + dynamic banner
│   │   │   └── share-utilities.ts
│   │   └── ui/
│   │       ├── ConsentBanner/                    # Lazy-loaded cookie consent banner
│   │       │   ├── ConsentBanner.tsx
│   │       │   ├── ConsentBanner.module.css
│   │       │   └── index.ts
│   │       └── dropdown-menu/                    # Generic dropdown primitive
│   │           ├── DropdownMenu.tsx              # Container: click-outside, Escape, open state
│   │           ├── DropdownMenu.module.css
│   │           ├── DropdownMenuItem.tsx          # Polymorphic: variant="anchor" | "action"
│   │           ├── DropdownMenuItem.module.css
│   │           ├── DropdownDivider.tsx
│   │           ├── DropdownDivider.module.css
│   │           └── index.ts                      # Public API
│   ├── entities/                                 # Business model UI (no actions)
│   │   └── item/
│   │       ├── ui/CollectionItemCard.tsx
│   │       ├── ui/CollectionItemCard.module.css
│   │       └── index.ts
│   ├── features/                                 # User interactions (one slice per action)
│   │   ├── theme/
│   │   │   ├── ui/ThemeToggleWrapper.tsx         # Wraps ThemeToggle with lightningcss processor
│   │   │   └── index.ts
│   │   ├── admin-menu/
│   │   │   ├── ui/AdminMenu.tsx                  # Admin nav dropdown
│   │   │   ├── ui/AdminMenu.module.css
│   │   │   └── index.ts
│   │   └── user-menu/
│   │       ├── ui/UserMenu.tsx                   # User dropdown (profile, vault, sign out)
│   │       ├── ui/UserMenu.module.css
│   │       └── index.ts
│   └── widgets/                                  # Composed sections from features + entities
│       └── site-header/
│           ├── ui/SiteHeader.tsx                 # Brand + async auth slot (Suspense)
│           ├── ui/SiteHeader.module.css
│           └── index.ts
│
├── components/                                   # Legacy — migrate to src/ as you touch files
│   ├── landing/                                  # Homepage sections (Hero, Stats, Features…)
│   ├── admin/                                    # Admin form components
│   ├── username/                                 # User profile action components
│   ├── AddItemForm/ AddItemModal/                # Collection item creation
│   ├── CreateCollectionModal/                    # Collection creation
│   ├── EditProfileForm/                          # Profile editing
│   ├── ItemLinksManager/                         # Item external links
│   └── UpdateImageForm/                          # Image upload
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                             # createBrowserClient ('use client' only)
│   │   ├── server.ts                             # createServerClient (RSC, Actions, Handlers)
│   │   ├── admin.ts                              # createAdminClient (server-only, RLS bypass)
│   │   └── types.ts                              # Generated database types
│   ├── auth/role.ts                              # getSessionAndRole() helper
│   ├── collections.ts                            # Public collection queries
│   ├── franchises.ts                             # Franchise catalog queries
│   ├── slug.ts                                   # toSlug, generateUniqueSlug helpers
│   ├── mock-data.ts                              # Static site data
│   ├── reserved-usernames.ts                     # Reserved username list
│   └── image/strip-metadata.ts                   # Image metadata stripping
│
├── next.config.ts
├── tsconfig.json
└── .env.local.example
```

## FSD Architecture

### Layer overview

| Layer | Purpose | Can import from |
|---|---|---|
| `widgets` | Full page sections composed of features + entities | `features`, `entities`, `shared` |
| `features` | Single user interactions (a menu, a form, a toggle) | `entities`, `shared` |
| `entities` | Business model UI (card, badge, avatar — no actions) | `shared` |
| `shared` | Generic, domain-free primitives (dropdown, button wrappers) | nothing internal |

> **One-way rule**: higher layers import lower — never the reverse. Slices within the same layer are isolated and must not import each other.

### Slice anatomy

Every slice lives in its layer folder and exposes a single public API:

```
src/<layer>/<slice-name>/
├── ui/           # React components + CSS Modules
├── model/        # (optional) hooks, stores, types specific to this slice
├── lib/          # (optional) slice-internal utilities
└── index.ts      # Public API — only export what consumers need
```

### Public API rule

Always import from the slice root. Never reach into internal paths:

```ts
// ✅ correct — public API
import { SiteHeader } from '@/src/widgets/site-header';
import { CollectionItemCard } from '@/src/entities/item';
import { DropdownMenu } from '@/src/shared/ui/dropdown-menu';

// ❌ wrong — bypasses public API, breaks encapsulation
import { SiteHeader } from '@/src/widgets/site-header/ui/SiteHeader';
```

### Placing new code

| What you're building | Where it goes |
|---|---|
| Generic UI with no business logic (dropdown, modal shell, spinner) | `src/shared/ui/<name>/` |
| Display component for a business entity (item card, user avatar) | `src/entities/<entity>/ui/` |
| User-triggered interaction (form, menu, toggle, delete button) | `src/features/<feature>/ui/` |
| Full composed section used in a page (header, sidebar, feed) | `src/widgets/<widget>/ui/` |
| Route, layout, Server Action, Route Handler | `app/` (Next.js constraint) |

### Next.js + FSD integration

- `app/` handles **routing only** — pages are thin and delegate rendering to widgets/features/entities.
- Server Actions stay in `app/**/actions.ts` co-located with the route; features import them as needed.
- Server Components can live in any FSD layer — the RSC/client boundary is orthogonal to FSD layers.
- `lib/` (Supabase clients, auth helpers, query functions) is the `shared/api` equivalent — imported by any layer.

## Development Workflow

Always run tasks from the **monorepo root** — never `cd apps/collectstory && next dev` as this bypasses Turborepo and breaks internal package builds.

```bash
# Start dev server
pnpm turbo run dev --filter=@dezkareid/collectstory

# Production build
pnpm turbo run build --filter=@dezkareid/collectstory
```

### Local Setup

1. Copy `.env.local.example` to `.env.local` and fill in values.
2. Link and push Supabase migrations:

```bash
# From apps/collectstory/
SUPABASE_ACCESS_TOKEN=<token> npx supabase link --project-ref <project-ref>
npx supabase db push --project-ref <project-ref>
```

3. Create migrations via CLI only — never by hand:

```bash
npx supabase migration new <migration_name>
```

> Manual timestamps cause `supabase db push` to fail with "Remote migration versions not found". If this happens, rename local files to match the versions in the error or run `supabase db pull`.

### Supabase MCP

Add to `.claude/settings.json` at the monorepo root:

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=<project-ref>"
    }
  }
}
```

Authentication is OAuth-based — no token stored in the config.

## Coding Standards & Style

### Rendering Patterns

| Route | Strategy | Access |
|---|---|---|
| `/` | SSG (`force-static`) | Public |
| `/login` | SSG (`force-static`) | Public |
| `/auth/callback` | Route Handler | Public (OAuth callback) |
| `/stores` | ISR (`revalidate: 3600`) | Public |
| `/collection` | SSR (`force-dynamic`) | Authenticated only |
| `/admin/*` | PPR | `admin` role only |

**RSC boundary rule**: Default to Server Components. Add `'use client'` only when the component uses browser APIs, event handlers, `useState`, `useEffect`, or context that requires hydration. Never make a component a Client Component just to read data — fetch on the server and pass serializable props down.

### API Routes & Server Actions

- **Server Actions** live in `actions.ts` co-located with the route segment that uses them.
- **Route Handlers** (`route.ts`) are used only for OAuth callbacks and webhook endpoints — prefer Server Actions for form mutations.
- Always authenticate Server Actions like API routes: call `getSessionAndRole()` at the top before any mutation.
- Use `createAdminClient()` (service role) only for admin writes that must bypass RLS — never in Client Components (`import 'server-only'` enforces this).

### Middleware & Authentication

- `middleware.ts` calls `supabase.auth.getClaims()` immediately after `createServerClient` — no code in between.
- Always return `supabaseResponse` unmodified to preserve cookie sync. **Never** create a new `NextResponse` after `createServerClient`.
- Redirect rules:
  - Unauthenticated → `/collection` or `/admin/*` → redirect to `/login`
  - Authenticated non-admin → `/admin/*` → redirect to `/collection`
- `app/admin/layout.tsx` has a secondary server-side role check via `AdminGuard` (async Server Component in `<Suspense>`) for defense-in-depth.

### Image & Font Optimization

- **Always** use `next/image` instead of `<img>`. Configure remote domains in `next.config.ts` under `remotePatterns` (Cloudinary is already set up).
- **Always** use `next/font` for fonts. The root layout uses `IBM_Plex_Sans` from `next/font/google` — extend there, never import fonts via CSS `@import` or `<link>` tags.
- Set the `sizes` attribute on `<Image>` for responsive images to avoid oversized downloads.
- Use `priority` on above-the-fold LCP images.

### Design System

- All CSS uses **CSS Modules** with CSS custom properties from `@dezkareid/design-tokens`.
- `globals.css` imports `@dezkareid/components/css` — this provides all token variables; do not import `variables.css` separately.
- Never hardcode colors, spacing, or typography — always use tokens:

| Category | Pattern | Example |
|---|---|---|
| Semantic colors | `--color-primary`, `--color-background-primary/secondary`, `--color-text-primary/secondary/inverse` | `var(--color-primary)` |
| Spacing | `--spacing-{4,8,12,16,24,32,48,64}` | `var(--spacing-16)` |
| Font size | `--font-size-{100-900}` | `var(--font-size-400)` |
| Font weight | `--font-weight-{light,regular,medium,bold}` | `var(--font-weight-bold)` |
| Line height | `--font-line-height-{none,tight,normal,relaxed}` | `var(--font-line-height-normal)` |
| Border radius | `--border-radius-{small,medium,large,pill}` | `var(--border-radius-large)` |
| Shadow | `--shadow-{subtle,card,card-hover}` | `var(--shadow-card)` |

- If the desired design cannot be achieved with existing tokens, add a `TODO` annotation:
  ```
  // TODO(design-system): needs token for <description>
  // TODO(design-system): needs component <name>
  ```

- Available components from `@dezkareid/components/react`: `Button`, `Tag`, `Card`, `ThemeToggle`. Check these before writing new UI primitives.

### Analytics & Tracking

This application uses Google Analytics 4 (G4) via `@next/third-parties/google`.

- **Privacy**: User IDs are always hashed using SHA-256 before being sent to G4.
- **Consent**: Tracking is strictly prohibited until the user grants consent via the `ConsentBanner`. Consent state is stored in `localStorage` (`ga_consent: 'true'`).
- **Performance**: The `GoogleAnalytics` component and `ConsentBanner` are loaded via `AnalyticsClient` (Client Component) to avoid blocking initial TTI. The banner appears after a 3-second idle delay.
- **How to track events**:
  - Always use the `useAnalytics` hook from `@/src/shared/lib/analytics/useAnalytics`.
  - The `track` function automatically handles User ID hashing and checks for consent.
  - Custom events must be defined in the `AnalyticsEvent` type in `events.ts`.

Example:
```tsx
const { track } = useAnalytics();

const handleClick = () => {
  track({
    action: 'cta_click',
    category: 'interaction',
    label: 'my_button',
  });
};
```

### Routing Strategy

This app uses **Next.js App Router** (file-based routing under `app/`). Key conventions:

- `app/` is routing-only — pages delegate rendering to `src/` widgets/features/entities.
- Dynamic segments: `[username]`, `[collectionSlug]`, `[itemId]`, `[slug]`, `[id]`.
- Route groups are not used; authenticated routes live under `app/collection/` and `app/admin/`.
- Parallel and intercepting routes are not currently used.
- All public profile routes (`/[username]/...`) use ISR; authenticated routes use SSR (`force-dynamic`).

### State Management

No global state library is used. State is managed at the closest responsible layer:

- **Server state** — fetched in Server Components and passed as serializable props; mutations go through Server Actions.
- **Local UI state** — `useState` / `useReducer` in Client Components (e.g., dropdown open state, modal visibility).
- **No** Redux, Zustand, Jotai, or similar libraries. Do not introduce one without discussion.

### Data Fetching & Mutations

- **Reads** — Server Components fetch data directly using `createServerClient` or query helpers in `lib/`. Never fetch in Client Components unless the data is truly client-only (e.g., real-time subscriptions).
- **Mutations** — Server Actions in `app/**/actions.ts`. Always call `getSessionAndRole()` first; throw on auth failure.
- **Parallelism** — use `Promise.all()` for independent fetches within the same Server Component to avoid waterfalls.
- **No client fetching library** (SWR, React Query) — not needed while all data flows through RSC + Server Actions.
- **Revalidation** — use `revalidatePath` / `revalidateTag` inside Server Actions after mutations; ISR routes set `revalidate` at the segment level.

### Development Strategies

- **Mobile-first** — style from the smallest viewport up; override for larger screens with `min-width` media queries.
- **Responsive breakpoints** (from `@dezkareid/design-tokens`):
  - `sm`: 640 px — single-column to two-column transitions
  - `md`: 768 px — tablet-sized layouts
  - `lg`: 1024 px — desktop-optimized layouts
  - `xl`: 1280 px — wide content containers
- **Layout approach** — use CSS Grid for page-level structure; Flexbox for component-level alignment.
- **Progressive enhancement** — pages must be readable and functional before JavaScript loads. Avoid client-only rendering for primary content.
- **Accessibility first** — WCAG 2.2 AA compliance is a baseline, not an afterthought. Every new UI must pass keyboard navigation and screen reader review.

### Import Conventions

- Use the `@/` alias for all app-internal imports (configured in `tsconfig.json`).
- Always import FSD slices from their `index.ts` public API — never from internal `ui/` paths.
- `createBrowserClient` → only in `'use client'` components.
- `createServerClient` → Server Components, Route Handlers, Server Actions.
- `createAdminClient` → Server Actions / Server Components that need RLS bypass (never client-side).

## Testing Conventions

> Tests are not yet established for this app. When adding tests:
> - Use **Vitest** (monorepo standard) with **React Testing Library**.
> - Place test files adjacent to the component/module: `ComponentName.test.tsx`.
> - Test Server Components by rendering them in a Node environment (no browser APIs).
> - Mock Supabase clients at the module level using `vi.mock`.
> - Do not test implementation details — assert on rendered output and user interactions.

## Debugging & Troubleshooting

### Common Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Auth session lost on navigation | New `NextResponse` created after `createServerClient` in middleware | Return `supabaseResponse` unmodified |
| `supabase db push` fails with "Remote migration versions not found" | Migration file created manually with wrong timestamp | Rename file to match version in error, or run `supabase db pull` |
| Build fails with missing `@dezkareid/components` | Ran `next dev` directly inside `apps/collectstory/` | Always use `pnpm turbo run dev --filter=@dezkareid/collectstory` from root |
| Admin page accessible to non-admin | Middleware redirect bypassed | Verify `AdminGuard` Server Component is present in `app/admin/layout.tsx` |
| Hydration mismatch | Using `Date`, `Math.random`, or browser APIs in RSC output | Move to `'use client'` or `useEffect`; use `suppressHydrationWarning` only for intentional mismatches |
| `SUPABASE_SERVICE_ROLE_KEY` exposed to client | `createAdminClient` imported in a Client Component | `admin.ts` has `import 'server-only'` — fix the import location |

### Logs & Debugging Tools

- **Next.js debug output**: `NODE_OPTIONS='--inspect' pnpm turbo run dev --filter=@dezkareid/collectstory`
- **Supabase logs**: Supabase Dashboard → Logs → API / Auth / Postgres tabs, or via MCP `mcp__supabase__get_logs`.
- **Rebuild specific routes**: `next build --debug-build-paths /collection` to isolate rendering issues.

### Accessibility Debugging with axe-core

Use the `chrome-user-session` MCP (`mcp__chrome-user-session__*` tools) to run live accessibility audits against any page.

**Step 1 — Navigate to the page**

```
mcp__chrome-user-session__navigate_page  { url: "http://localhost:3000/<route>" }
```

**Step 2 — Inject axe-core**

```
mcp__chrome-user-session__evaluate_script {
  script: `
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  `
}
```

**Step 3 — Run the audit**

```
mcp__chrome-user-session__evaluate_script {
  script: `
    const results = await axe.run();
    return JSON.stringify({
      violations: results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map(n => ({ html: n.html, failureSummary: n.failureSummary }))
      })),
      passes: results.passes.length,
      incomplete: results.incomplete.length
    }, null, 2);
  `
}
```

**Reading the output**

| Field | Meaning |
|---|---|
| `violations` | Issues that must be fixed — each has `impact` (`critical`, `serious`, `moderate`, `minor`) |
| `passes` | Count of rules that passed |
| `incomplete` | Rules axe could not determine automatically — review manually |

Fix `critical` and `serious` violations first. Every new page must reach zero `critical`/`serious` violations before shipping.

**Scoping the audit to a specific component**

Pass a CSS selector as the `context` option to narrow the scan:

```
mcp__chrome-user-session__evaluate_script {
  script: `
    const results = await axe.run('#main-content');
    return JSON.stringify(results.violations, null, 2);
  `
}
```

## Skills

AI agents working on this app **must** invoke the following skills before implementing or reviewing code:

| Skill | When to use |
|---|---|
| `react-best-practices` / `frontend-tools:react-best-practices` | Any React component work (RSC boundaries, re-renders, data fetching) |
| `next-best-practices` / `frontend-tools:next-best-practices` | Any Next.js-specific work (routing, middleware, metadata, image/font) |
| `react-components` / `frontend-tools:react-components` | When writing React components based on HTML components |
| `styles-methodology` / `frontend-tools:styles-methodology` | Any CSS authoring — BEM naming, OOCSS structure/skin separation |
| `fsd-architecture` / `frontend-tools:fsd-architecture` | When creating or moving code — determines which FSD layer/slice it belongs to |
| `frontend-design` | Any new UI — pages, components, layouts |
| `design-tokens` / `design-system:design-tokens` | When referencing or adding design tokens |
| `accessibility` / `web-quality:accessibility` | Any UI work — ensure WCAG 2.2 compliance, keyboard navigation, screen reader support |
| `performance` / `web-quality:performance` | Any performance-sensitive work — loading, rendering, bundle size |
| `seo` / `web-quality:seo` | Any public page — meta tags, structured data, sitemap |
| `web-quality-audit` / `web-quality:web-quality-audit` | Full audit of a page or feature before shipping |
| `supabase-postgres-best-practices` / `database-tools:supabase-postgres-best-practices` | Any Supabase query, schema, or RLS change |

### MCP Servers

| MCP | When to use |
|---|---|
| `context7` | When you need documentation for any external library (Next.js, React, Supabase, Tailwind, etc.) — do not rely on training data alone |
| `supabase` | When querying, migrating, or inspecting the Supabase project (tables, logs, edge functions, migrations) |
| `chrome-user-session` | Debugging runtime issues, performance analysis (traces, Lighthouse audits, network inspection, console errors) |

### CSS Methodology

All styles in this app follow two conventions:

- **BEM** for class naming — `block__element--modifier` (e.g. `.card__title--highlighted`)
- **OOCSS** for splitting responsibilities — separate structure (layout, box model) from skin (colors, typography)

## Data Model Summary

| Table | Key Columns | Notes |
|---|---|---|
| `profiles` | `id, role` | One row per auth user; `role` is `'admin'` or `'user'`; auto-created on signup via trigger |
| `brands` | `id, name, slug` | Public read; admin write |
| `lines` | `id, brand_id, name, slug` | Belongs to one brand; public read; admin write |
| `categories` | `id, name, slug` | Public read; admin write |
| `stores` | `id, name, url, country, city, lat, lng` | Public read; admin write |
| `collection_items` | `id, user_id, name, image_url, brand_id, line_id, category_id, description, date_acquired` | RLS: user-scoped CRUD only |

## Admin Infrastructure

### Promoting the First Admin

```sql
insert into public.profiles (id, role)
select id, 'admin'
from auth.users
where email = 'your-email@example.com'
on conflict (id) do update set role = 'admin';
```

The migration `003_bootstrap_admin.sql` is idempotent and handles this on first apply if the user exists at migration time.

### `createAdminClient`

Use `lib/supabase/admin.ts` → `createAdminClient()` for Server Actions or Server Components that need to bypass RLS. Protected by `import 'server-only'`.

```ts
import { createAdminClient } from '@/lib/supabase/admin';

const supabase = createAdminClient();
await supabase.from('brands').insert({ name, slug });
```

### `getSessionAndRole`

Use `lib/auth/role.ts` → `getSessionAndRole()` to check the current user's role in Server Components and Server Actions:

```ts
import { getSessionAndRole } from '@/lib/auth/role';

const session = await getSessionAndRole();
if (!session || session.role !== 'admin') throw new Error('Forbidden');
```

## Environment Variables

| Variable | Where used | Source |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client + Server | Supabase → Project Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (admin ops) | Supabase → Project Settings → API → service_role key |
| `CLOUDINARY_CLOUD_NAME` | Server (future upload feature) | Not yet provisioned — use `placeholder` |

Copy `.env.local.example` to `.env.local` for local development.
