# @dezkareid/collectstory

Collectstory is the collector's companion app — a Next.js 16 web application for tracking and showcasing personal collectibles collections (action figures, statues, diecast, and more).

## Features

- **Public homepage** (SSG) — brand presentation with hero, features, and CTA
- **Stores directory** (SSG) — curated list of collectibles stores worldwide
- **Collector page** (SSR, authenticated) — personal collection grid with Cloudinary images
- **Social login** — Google, Facebook, and X (Twitter) via Supabase Auth
- **Design system** — fully themed with `@dezkareid/design-tokens` and `@dezkareid/components`

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Auth & DB | Supabase (Auth + PostgreSQL) |
| Images | Cloudinary |
| Hosting | Vercel |
| Styling | Pure CSS Modules + design tokens |

## Local Setup

### Prerequisites

- Node.js >= 22
- pnpm >= 10
- A Supabase project
- A Cloudinary account

### 1. Install dependencies

From the **monorepo root**:

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp apps/collectstory/.env.local.example apps/collectstory/.env.local
```

Required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |

### 3. Apply the database schema

Run the migration against your Supabase project:

```bash
# Using the Supabase CLI (from apps/collectstory/):
supabase db push
# Or apply the SQL manually in the Supabase dashboard:
# apps/collectstory/supabase/migrations/001_initial_schema.sql
```

### 4. Configure OAuth providers

In your Supabase project dashboard → Authentication → Providers, enable:

- **Google** — requires Google Cloud OAuth app credentials
- **Facebook** — requires Facebook App credentials
- **Twitter/X** — requires Twitter Developer App credentials

Set the OAuth callback URL to: `https://your-domain.com/auth/callback`

For local development, use a tunnel (e.g. `ngrok`) since Facebook and X require HTTPS callbacks.

### 5. Start development

From the **monorepo root**:

```bash
pnpm turbo run dev --filter=@dezkareid/collectstory
```

The app runs at `http://localhost:3000`.

## Available Scripts

Run all scripts from the **monorepo root** using Turbo:

```bash
# Development server
pnpm turbo run dev --filter=@dezkareid/collectstory

# Production build
pnpm turbo run build --filter=@dezkareid/collectstory

# Start production server (after build)
pnpm turbo run start --filter=@dezkareid/collectstory

# Lint
pnpm turbo run lint --filter=@dezkareid/collectstory
```

## Vercel Deployment

1. Connect the monorepo repository to a Vercel project.
2. Set the **Root Directory** to `apps/collectstory` in Vercel project settings.
3. Vercel will use `vercel.json` to run the correct monorepo build command.
4. Add all required environment variables in the Vercel dashboard.

## Data Model

```
brands          id, name, slug
lines           id, brand_id, name, slug          (line belongs to one brand)
categories      id, name, slug
stores          id, name, url, country, city, lat, lng
collection_items
                id, user_id, name, image_url,
                brand_id, line_id (nullable), category_id (nullable),
                description, date_acquired
```

Row-Level Security is enabled. Users can only access their own `collection_items`.

## Roadmap

- Image upload to Cloudinary (paid-tier feature)
- Free vs paid user tiers
- Collection item create/edit/delete UI
- Map view for stores directory
- Public collection profiles
