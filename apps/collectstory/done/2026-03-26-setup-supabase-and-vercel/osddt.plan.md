# Implementation Plan: Supabase Setup & Collectstory Vercel Deployment

## Architecture Overview

The implementation is purely infrastructure and configuration — no application code changes. The stack is:

- **App**: Next.js 16 (App Router) — already built, in `apps/collectstory/`
- **Database & Auth**: Supabase (hosted PostgreSQL + Auth)
- **Hosting**: Vercel (personal account), monorepo configured via existing `vercel.json`
- **Migrations**: Supabase CLI (`supabase db push`) run in CI via GitHub Actions
- **CI**: GitHub Actions — a new dedicated workflow `deploy-collectstory.yml` handles all collectstory CI (test, migrate, deploy to Vercel); `deploy-apps.yml` remains unchanged and keeps its existing collectstory exclusion
- **Local dev MCP**: Supabase MCP server configured in Claude Code (`settings.json`) scoped to the collectstory project, enabling AI-assisted DB queries and management during development

### Key architectural decisions (from spec)

- Only Google OAuth is enabled; Facebook/X are deferred
- Preview deployments use the same Supabase production project (tech debt — tracked in code comment)
- `CLOUDINARY_CLOUD_NAME` is set as a placeholder on Vercel; Cloudinary is not provisioned yet
- Migration CI uses `SUPABASE_ACCESS_TOKEN` + `SUPABASE_PROJECT_ID` secrets (no interactive login)

---

## Implementation Phases

### Phase 1 — Supabase Project Setup (manual, one-time)

**Goal**: Provision the Supabase project and configure auth.

**Steps**:

1. Create a new Supabase project at [supabase.com](https://supabase.com) named `collectstory` (or `dezkareid-collectstory`).
2. From the Supabase dashboard → Project Settings → API, collect:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (anon/public key)
   - `SUPABASE_SERVICE_ROLE_KEY` (service_role key — keep secret)
3. From Project Settings → General, collect the **Project Reference ID** (`SUPABASE_PROJECT_ID`).
4. Generate a Supabase Personal Access Token at [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) — this becomes `SUPABASE_ACCESS_TOKEN`.
5. Enable Google OAuth in Supabase Auth → Providers → Google:
   - Create a Google OAuth 2.0 Client in [Google Cloud Console](https://console.cloud.google.com/) (Credentials → OAuth 2.0 Client IDs, type: Web application)
   - Add the Supabase callback URL as an Authorized Redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret into the Supabase Google provider settings
   - Save and enable the provider

---

### Phase 2 — Local Development Environment

**Goal**: Connect the local app to the Supabase project and configure the Supabase MCP for Claude Code.

**Steps**:

1. **Create `.env.local`** in `apps/collectstory/` (gitignored) with the values from Phase 1:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   CLOUDINARY_CLOUD_NAME=placeholder
   ```

2. **Create `.env.local.example`** in `apps/collectstory/` (committed) documenting all variables with placeholder values and comments.

3. **Initialize Supabase CLI** in the worktree root (if not already):
   ```bash
   npx supabase init
   ```
   Then link to the remote project:
   ```bash
   SUPABASE_ACCESS_TOKEN=<token> npx supabase link --project-ref <project-ref>
   ```

4. **Configure Supabase MCP** for Claude Code by adding to the project-level `settings.json` (`.claude/settings.json` at monorepo root):
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
   Authentication is handled via OAuth in Claude Code — no token stored in the config file.

---

### Phase 3 — Apply Database Migrations

**Goal**: Run the initial schema migration against the Supabase project.

**Steps**:

1. Verify the migration file exists at `apps/collectstory/supabase/migrations/001_initial_schema.sql`.
2. Confirm the Supabase CLI is linked (Phase 2, step 3).
3. Push migrations to the remote database:
   ```bash
   SUPABASE_ACCESS_TOKEN=<token> npx supabase db push --project-ref <project-ref>
   ```
4. Verify in the Supabase dashboard → Table Editor that all 5 tables exist with RLS enabled.

> **Note**: The `supabase/` folder is currently at `apps/collectstory/supabase/`. The CLI config (`supabase/config.toml`) may need to be created via `supabase init` at the `apps/collectstory/` level, or the `--project-ref` flag used directly with `db push` without a config file.

---

### Phase 4 — Vercel Project Setup (manual, one-time)

**Goal**: Create and configure the Vercel project for the monorepo.

**Steps**:

1. Import the GitHub repository into Vercel (personal account):
   - Framework Preset: **Next.js**
   - Root Directory: `.` (repo root — not `apps/collectstory/`)
   - Build Command: `cd ../.. && pnpm turbo run build --filter=@dezkareid/collectstory` (already in `vercel.json` — Vercel will use it automatically)
   - Output Directory: `apps/collectstory/.next` (already in `vercel.json`)
2. Set environment variables on the Vercel project (Settings → Environment Variables) for **Production** and **Preview**:
   | Variable | Value | Environments |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` | Production, Preview |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `<anon-key>` | Production, Preview |
   | `SUPABASE_SERVICE_ROLE_KEY` | `<service-role-key>` | Production, Preview |
   | `CLOUDINARY_CLOUD_NAME` | `placeholder` | Production, Preview |

   > Tech debt: Preview deployments share the production Supabase project. A staging Supabase project or branch should be added in the future to isolate preview data.

3. Collect Vercel credentials for CI:
   - `VERCEL_TOKEN`: Vercel dashboard → Account Settings → Tokens → Create Token
   - `VERCEL_ORG_ID`: Vercel dashboard → Account Settings → General → Your ID (personal account)
   - `VERCEL_PROJECT_ID_COLLECTSTORY`: Vercel project → Settings → General → Project ID
4. Update the **Supabase Auth redirect URL** allowlist to include the Vercel production URL:
   - Supabase dashboard → Auth → URL Configuration → Redirect URLs
   - Add: `https://<vercel-app>.vercel.app/auth/callback`

---

### Phase 5 — CI Pipeline: Dedicated Collectstory Workflow

**Goal**: Create a new, self-contained `deploy-collectstory.yml` workflow. `deploy-apps.yml` is **not modified** — its existing `!apps/collectstory/**` exclusion stays in place.

**Files to create/modify**:

- `.github/workflows/deploy-collectstory.yml` — new dedicated workflow (create)
- `.github/apps.yml` — **not modified** (collectstory is handled by the new workflow, not the matrix dispatch)

**Steps**:

1. **Create `.github/workflows/deploy-collectstory.yml`** with the following structure:

   ```yaml
   name: Deploy Collectstory

   on:
     pull_request:
       types: [opened, synchronize, reopened]
       paths:
         - "apps/collectstory/**"
       branches:
         - main
     push:
       paths:
         - "apps/collectstory/**"
       branches:
         - main

   env:
     HUSKY: 0
     TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
     TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

   jobs:
     test:
       runs-on: ubuntu-latest
       defaults:
         run:
           shell: bash
       steps:
         - name: Checkout
           uses: actions/checkout@v5
           with:
             fetch-depth: 0

         - name: Setup JS
           uses: ./.github/actions/setup-js

         - name: Test
           run: pnpm turbo run test --filter=@dezkareid/collectstory

     migrate:
       needs: test
       runs-on: ubuntu-latest
       defaults:
         run:
           shell: bash
       steps:
         - name: Checkout
           uses: actions/checkout@v5

         - name: Setup JS
           uses: ./.github/actions/setup-js

         - name: Apply Supabase migrations
           run: npx supabase db push --project-ref ${{ secrets.SUPABASE_PROJECT_ID }}
           env:
             SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

     deploy:
       needs: migrate
       runs-on: ubuntu-latest
       defaults:
         run:
           shell: bash
       steps:
         - name: Checkout
           uses: actions/checkout@v5
           with:
             fetch-depth: 0

         - name: Setup JS
           uses: ./.github/actions/setup-js

         - name: Build
           run: pnpm turbo run build --filter=@dezkareid/collectstory
           env:
             NODE_ENV: production
             NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
             NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY }}

         - name: Deploy to Vercel (preview)
           if: github.event_name == 'pull_request'
           run: npx vercel@latest deploy --token=${{ secrets.VERCEL_TOKEN }} --yes
           env:
             VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
             VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_COLLECTSTORY }}

         - name: Deploy to Vercel (production)
           if: github.event_name == 'push' && github.ref == 'refs/heads/main'
           run: npx vercel@latest deploy --token=${{ secrets.VERCEL_TOKEN }} --prod --yes
           env:
             VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
             VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_COLLECTSTORY }}
   ```

   > Note: The build step is optional if Vercel builds from source on its side. If Vercel is configured to build remotely (default), the `Build` step can be removed and only the `vercel deploy` command is needed. The build env vars (`NEXT_PUBLIC_*`) must still be present in the Vercel project settings.

2. **Add GitHub Secrets** to the repository (Settings → Secrets and variables → Actions):

   | Secret | Value |
   |---|---|
   | `VERCEL_TOKEN` | Vercel personal access token |
   | `VERCEL_ORG_ID` | Vercel personal account ID |
   | `VERCEL_PROJECT_ID_COLLECTSTORY` | Vercel project ID for collectstory |
   | `SUPABASE_ACCESS_TOKEN` | Supabase personal access token |
   | `SUPABASE_PROJECT_ID` | Supabase project reference ID |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (needed at build time) |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key (needed at build time) |

---

### Phase 6 — Documentation

**Goal**: Update `apps/collectstory/` documentation to reflect the full setup.

**Files to update**:

- `apps/collectstory/.env.local.example` — create with all env vars, placeholders, and source comments
- `apps/collectstory/README.md` — add "Deployment" section covering Supabase setup, Vercel project config, and CI secrets
- `apps/collectstory/AGENTS.md` — update Environment Variables table and add a "Local Setup" section documenting MCP configuration

---

## Technical Dependencies

| Dependency | Version / Source | Purpose |
|---|---|---|
| `supabase` CLI | latest (via `npx`) | DB migrations, project linking |
| `vercel` CLI | latest (via `npx vercel@latest`) | CI deployments |
| `@supabase/mcp-server-supabase` | hosted at `mcp.supabase.com` | Claude Code MCP for DB querying |
| `dorny/paths-filter@v3` | already in use | CI path-based dispatch |
| GitHub Actions secrets | manual setup | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_COLLECTSTORY`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID` |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| `supabase/config.toml` not present — CLI requires it for `supabase link` | Run `supabase init` inside `apps/collectstory/` to generate it, or use `--project-ref` + `SUPABASE_ACCESS_TOKEN` directly with `db push` to bypass the config file |
| `deploy-apps.yml` matrix strategy — adding Vercel logic alongside Cloudflare Pages would complicate the shared workflow | Avoided entirely: dedicated `deploy-collectstory.yml` keeps concerns isolated; `deploy-apps.yml` is unchanged |
| Preview deployments share prod Supabase — risk of polluting real data | Accepted as tech debt; document in `README.md` and add a code comment in the workflow |
| Google OAuth redirect URI mismatch between local, preview, and production | Add all three URIs to the Supabase redirect allowlist and to the Google Cloud OAuth client's Authorized Redirect URIs |
| Vercel ignores `vercel.json` if root directory is set to a subdirectory | Root directory must be set to `.` (repo root) in the Vercel project settings; `vercel.json` at `apps/collectstory/` is then picked up automatically |
| `supabase db push` runs on every collectstory deploy — idempotent but adds latency | Migrations are idempotent (Supabase tracks applied migrations); risk is low, acceptable for now |

---

## Out of Scope

- Custom domain configuration
- Database seed data (brands, lines, categories, stores)
- Facebook and X OAuth provider setup
- Cloudinary account provisioning
- Supabase Edge Functions or Storage
- Email/magic-link auth
- Monitoring, alerting, or error tracking
- Separate staging Supabase project for preview environments
