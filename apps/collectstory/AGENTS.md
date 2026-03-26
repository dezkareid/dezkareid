# Agent Instructions: @dezkareid/collectstory

This file provides context for AI agents working on the `apps/collectstory` package.

## Package Overview

Next.js 16 (App Router) web application for tracking collectibles collections. Registered in the monorepo as `@dezkareid/collectstory`.

## Directory Structure

```
apps/collectstory/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (IBM Plex Sans font, globals.css)
│   ├── globals.css             # Global styles (imports @dezkareid/components/css)
│   ├── page.tsx                # Homepage (SSG, force-static)
│   ├── page.module.css
│   ├── login/
│   │   ├── page.tsx            # Login page (SSG, force-static)
│   │   ├── login.module.css
│   │   └── actions.ts          # Server Actions: signInWithProvider (google/facebook/twitter)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts        # OAuth callback Route Handler
│   ├── collection/
│   │   ├── layout.tsx          # Authenticated layout (shows user email + SignOutButton)
│   │   ├── layout.module.css
│   │   ├── page.tsx            # Collection page (SSR, force-dynamic)
│   │   ├── page.module.css
│   │   └── actions.ts          # Server Action: signOut
│   └── stores/
│       ├── page.tsx            # Stores directory (SSG, revalidate 1h)
│       └── page.module.css
├── components/                 # Shared UI components
│   ├── SiteHeader.tsx          # 'use client' — sticky nav with ThemeToggle
│   ├── SiteHeader.module.css
│   ├── SignOutButton.tsx        # 'use client' — form action calling signOut
│   ├── SignOutButton.module.css
│   ├── CollectionItemCard.tsx  # Server component — displays one collection item
│   └── CollectionItemCard.module.css
├── lib/
│   └── supabase/
│       ├── client.ts           # createBrowserClient (use in 'use client' components)
│       └── server.ts           # createServerClient (use in Server Components/Actions)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Initial DB schema + RLS
├── middleware.ts               # Session refresh + /collection route protection
├── next.config.ts              # Cloudinary remotePatterns
├── tsconfig.json
├── vercel.json
└── .env.local.example
```

## Routing Conventions

| Route | Type | Access |
|---|---|---|
| `/` | SSG | Public |
| `/login` | SSG | Public |
| `/auth/callback` | Route Handler | Public (OAuth callback) |
| `/stores` | SSG (ISR 1h) | Public |
| `/collection` | SSR | Authenticated only |

The middleware redirects all unauthenticated requests to `/collection` → `/login`.

## Auth Pattern

This app uses `@supabase/ssr` with the Next.js App Router middleware pattern:

1. `middleware.ts` — runs on every non-static request; calls `supabase.auth.getClaims()` immediately after `createServerClient` (no code in between); returns `supabaseResponse` unmodified to preserve cookie sync.
2. `lib/supabase/server.ts` — `createServerClient` with `next/headers` cookie wiring; use in Server Components, Route Handlers, and Server Actions.
3. `lib/supabase/client.ts` — `createBrowserClient`; use only in `'use client'` components.

**Critical**: Never create a new `NextResponse` after calling `createServerClient` in middleware — always mutate and return `supabaseResponse`.

## Design System Integration

- All CSS uses CSS Modules with CSS custom properties from `@dezkareid/design-tokens`.
- `globals.css` imports `@dezkareid/components/css` which includes all design token variables.
- `SiteHeader.tsx` and `SignOutButton.tsx` are `'use client'` components.
- `ThemeToggle` from `@dezkareid/components/react` requires a Client Component wrapper because it uses `useState`/`useEffect`.

### Token Reference

| Category | CSS Variable Pattern | Example |
|---|---|---|
| Semantic colors | `--color-primary`, `--color-background-primary/secondary`, `--color-text-primary/secondary/inverse` | `var(--color-primary)` |
| Spacing | `--spacing-{4,8,12,16,24,32,48,64}` | `var(--spacing-16)` |
| Font size | `--font-size-{100-900}` | `var(--font-size-400)` |
| Font weight | `--font-weight-{light,regular,medium,bold}` | `var(--font-weight-bold)` |
| Line height | `--font-line-height-{none,tight,normal,relaxed}` | `var(--font-line-height-normal)` |
| Border radius | `--border-radius-{small,medium,large,pill}` | `var(--border-radius-large)` |
| Shadow | `--shadow-{subtle,card,card-hover}` | `var(--shadow-card)` |

## Data Model Summary

| Table | Key Columns | Notes |
|---|---|---|
| `brands` | `id, name, slug` | Public read |
| `lines` | `id, brand_id, name, slug` | Belongs to one brand; public read |
| `categories` | `id, name, slug` | Public read |
| `stores` | `id, name, url, country, city, lat, lng` | Public read |
| `collection_items` | `id, user_id, name, image_url, brand_id, line_id, category_id, description, date_acquired` | RLS: user-scoped CRUD only |

## Environment Variables

| Variable | Where used | Source |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client + Server | Supabase → Project Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (reserved for admin ops) | Supabase → Project Settings → API → service_role key |
| `CLOUDINARY_CLOUD_NAME` | Server (future upload feature) | Not yet provisioned — use `placeholder` |

For local development, copy `.env.local.example` to `.env.local` and fill in the values.

## Local Setup

### 1. Link the Supabase CLI

From `apps/collectstory/`:

```bash
# Authenticate (stores token in native credentials storage)
SUPABASE_ACCESS_TOKEN=<your-token> npx supabase link --project-ref <project-ref>

# Apply migrations to the remote database
npx supabase db push --project-ref <project-ref>
```

### 2. Configure Supabase MCP for Claude Code

Add the following to the monorepo-level Claude Code settings (`.claude/settings.json`):

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

Authentication is handled via OAuth in Claude Code — no token is stored in the config file. The MCP enables AI-assisted queries, schema inspection, and data management for the collectstory Supabase project.

## Monorepo Usage

Always run tasks from the monorepo root:

```bash
pnpm turbo run dev --filter=@dezkareid/collectstory
pnpm turbo run build --filter=@dezkareid/collectstory
```

Never `cd apps/collectstory && next dev` — this bypasses Turborepo and will fail because `@dezkareid/components` won't be built.
