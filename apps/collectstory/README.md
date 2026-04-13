# @dezkareid/collectstory

Collectstory is the collector's companion app — a Next.js 16 web application for tracking and showcasing personal collectibles collections (action figures, statues, diecast, and more).

## Features

- **Public homepage** (SSG) — brand presentation with hero, features, and CTA
- **Stores directory** (SSG) — curated list of collectibles stores worldwide
- **Collector page** (SSR, authenticated) — personal collection grid with Cloudinary images
- **Social login** — Google, Facebook, and X (Twitter) via Supabase Auth
- **Design system** — fully themed with `@dezkareid/design-tokens` and `@dezkareid/components`
- **Analytics** — G4 integration with privacy-focused user tracking and cookie consent
- **Internationalization (i18n)** — Full support for English and Spanish with automatic detection and URL-based routing

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Auth & DB | Supabase (Auth + PostgreSQL) |
| Images | Cloudinary |
| Analytics | Google Analytics 4 (@next/third-parties) |
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
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID |

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

Set the Supabase callback URL on the Google OAuth client to:
`https://<project-ref>.supabase.co/auth/v1/callback`

Add your deployed app URL to the Supabase Auth → URL Configuration → Redirect URLs:
`https://<your-domain>/auth/callback`

> Facebook and X (Twitter) providers are supported by the app but deferred — configure them when developer app credentials are available.

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

## Deployment

### Supabase Project Setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. From **Project Settings → API**, collect:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` (service_role key — keep secret)
3. From **Project Settings → General**, note the **Project Reference ID**.
4. Apply the initial schema migration:
   ```bash
   # From apps/collectstory/ — requires supabase CLI and SUPABASE_ACCESS_TOKEN env var
   supabase link --project-ref <project-ref>
   supabase db push
   ```
5. Enable **Google OAuth** in Supabase Auth → Providers → Google (see Local Setup §4 above).

### Vercel Project Setup

1. Import the GitHub repository into Vercel (personal account).
2. Set **Root Directory** to `.` (the repo root — not `apps/collectstory/`).
   Vercel picks up `apps/collectstory/vercel.json` automatically for the build command and output directory.
3. Set the following **Environment Variables** on the Vercel project for both **Production** and **Preview** environments:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |
   | `CLOUDINARY_CLOUD_NAME` | `placeholder` (not yet provisioned) |

4. After the first deploy, add the Vercel production URL to:
   - Supabase Auth → URL Configuration → **Redirect URLs**: `https://<app>.vercel.app/auth/callback`
   - Google Cloud Console → OAuth Client → **Authorized Redirect URIs**: same URL

> **Tech debt**: Preview deployments (from PRs) share the production Supabase project. This risks polluting prod data during testing. A dedicated staging Supabase project should be provisioned in the future.

### CI/CD (GitHub Actions)

The workflow `.github/workflows/deploy-collectstory.yml` runs on every PR and push to `main` that touches `apps/collectstory/**`. It runs three sequential jobs: `test → migrate → deploy`.

Add the following **GitHub repository secrets** (Settings → Secrets and variables → Actions):

| Secret | Where to find it |
|---|---|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel → Account Settings → General → Your ID |
| `VERCEL_PROJECT_ID_COLLECTSTORY` | Vercel → Project Settings → General → Project ID |
| `SUPABASE_ACCESS_TOKEN` | [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) |
| `SUPABASE_PROJECT_ID` | Supabase → Project Settings → General → Reference ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API → anon key |
| `TURBO_TOKEN` | Vercel Remote Cache token (shared with other workflows) |
| `TURBO_TEAM` | Vercel team slug (shared with other workflows) |

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

## Internationalization (i18n)

The application uses `next-intl` for full internationalization support.

### Architecture
- **Routing**: URL-based locale prefixes (e.g., `/en/username`, `/es/username`).
- **Detection**: Automatic language detection with fallback to Spanish (`es`).
- **Translations**: JSON files located in `messages/` (`en.json`, `es.json`).
- **Strategy**: Components remain agnostic of i18n, receiving translated strings via props from pages/server components.

### Adding Translations
1. Add the key to both `messages/en.json` and `messages/es.json`.
2. Use `getTranslations` in Server Components or `useTranslations` in Client Components.
3. Pass the translated string to the component's props.

## Roadmap

- Image upload to Cloudinary (paid-tier feature)
- Free vs paid user tiers
- Collection item create/edit/delete UI
- Map view for stores directory
- Public collection profiles
