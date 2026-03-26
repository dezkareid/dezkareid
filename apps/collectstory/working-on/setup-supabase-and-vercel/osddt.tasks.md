# Tasks: Supabase Setup & Collectstory Vercel Deployment

## Phase 1 — Supabase Project Setup (manual, one-time)

- [x] [S] Create Supabase project named `collectstory` (or `dezkareid-collectstory`) via the Supabase dashboard
- [x] [S] Collect `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from Project Settings → API
- [x] [S] Collect the Supabase Project Reference ID (`SUPABASE_PROJECT_ID`) from Project Settings → General
- [x] [S] Generate a Supabase Personal Access Token (`SUPABASE_ACCESS_TOKEN`) from the account tokens page
- [x] [M] Create a Google OAuth 2.0 Client in Google Cloud Console (Web application type) and add the Supabase callback URL as an Authorized Redirect URI
- [x] [S] Enable Google OAuth in Supabase Auth → Providers → Google using the Google Client ID and Secret

**Definition of Done**: Supabase project exists, all API keys collected, Google OAuth enabled and redirect URI configured.

---

## Phase 2 — Local Development Environment

> Depends on: Phase 1

- [x] [S] Create `apps/collectstory/.env.local` (gitignored) with values from Phase 1 and `CLOUDINARY_CLOUD_NAME=placeholder`
- [x] [S] Create `apps/collectstory/.env.local.example` with placeholder values and source comments for each variable
- [x] [S] Run `supabase init` inside `apps/collectstory/` to generate `supabase/config.toml` (if not already present)
- [x] [S] Run `supabase link --project-ref <project-ref>` to link the local project to the remote Supabase instance

**Definition of Done**: `pnpm turbo run dev --filter=@dezkareid/collectstory` starts without errors and connects to Supabase; Supabase MCP appears in Claude Code.

---

## Phase 3 — Apply Database Migrations

> Depends on: Phase 2

- [x] [S] Verify `apps/collectstory/supabase/migrations/001_initial_schema.sql` exists and is complete
- [x] [M] Run `supabase db push --project-ref <project-ref>` to apply migrations to the remote database
- [x] [S] Verify all 5 tables (`brands`, `lines`, `categories`, `stores`, `collection_items`) exist with RLS enabled in the Supabase dashboard → Table Editor

**Definition of Done**: All tables exist in the remote Supabase database with RLS policies active.

---

## Phase 4 — Vercel Project Setup (manual, one-time)

> Depends on: Phase 1

- [x] [M] Import the GitHub repository into Vercel (personal account), setting root directory to `.` (repo root) — Vercel will use `apps/collectstory/vercel.json` automatically
- [x] [M] Set all environment variables on the Vercel project for Production and Preview environments: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_CLOUD_NAME=placeholder`
- [x] [S] Collect `VERCEL_TOKEN` (Account Settings → Tokens), `VERCEL_ORG_ID` (Account Settings → General → Your ID), and `VERCEL_PROJECT_ID_COLLECTSTORY` (Project Settings → General)
- [x] [S] Add the Vercel production URL (`https://<vercel-app>.vercel.app/auth/callback`) to the Supabase Auth → URL Configuration → Redirect URLs allowlist
- [x] [S] Add the Vercel production URL to the Google Cloud Console OAuth client's Authorized Redirect URIs

**Definition of Done**: Vercel project exists, env vars set, production URL is an allowed redirect in both Supabase and Google OAuth.

---

## Phase 5 — CI Pipeline: Dedicated Collectstory Workflow

> Depends on: Phase 4

- [x] [M] Create `.github/workflows/deploy-collectstory.yml` with three sequential jobs: `test → migrate → deploy`
- [x] [S] Add path trigger for `apps/collectstory/**` on `pull_request` and `push` to `main` in the new workflow
- [x] [S] Add `migrate` job that runs `supabase db push` using `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_ID` secrets
- [x] [S] Add `deploy` job with two conditional steps: preview deploy on `pull_request`, production deploy (`--prod`) on `push` to `main`
- [x] [S] Add GitHub repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_COLLECTSTORY`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [x] [S] Verify `deploy-apps.yml` is unchanged and its `!apps/collectstory/**` exclusion is still in place

**Definition of Done**: Opening a PR touching `apps/collectstory/` triggers the new workflow and produces a Vercel preview URL; merging to `main` triggers a production deploy; `deploy-apps.yml` is unaffected.

---

## Phase 6 — Documentation

> Depends on: Phases 1–5

- [x] [S] Update `apps/collectstory/AGENTS.md` — update the Environment Variables table and add a "Local Setup" section documenting Supabase CLI link command and MCP configuration
- [x] [M] Update `apps/collectstory/README.md` — add a "Deployment" section covering: Supabase project setup steps, Vercel project configuration, required GitHub secrets, and the tech-debt note about shared Supabase for preview environments
- [x] [S] Add a `# TODO(tech-debt): preview deployments share the production Supabase project` comment in `deploy-collectstory.yml` near the preview deploy step

**Definition of Done**: `README.md` contains a complete "Deployment" section; `.env.local.example` is committed; `AGENTS.md` reflects the current local setup and MCP config.

---

## Dependencies Summary

```
Phase 1 (Supabase setup)
  └── Phase 2 (Local env + MCP)
        └── Phase 3 (Migrations)
  └── Phase 4 (Vercel setup)
        └── Phase 5 (CI workflow)
              └── Phase 6 (Docs)
```

Phases 2 and 4 can proceed in parallel once Phase 1 is complete.
