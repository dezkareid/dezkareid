# Feature Spec: Supabase Setup & Collectstory Vercel Deployment

## Overview

Collectstory is a Next.js 16 (App Router) web application for tracking collectibles collections. The application code is complete — auth patterns, DB schema, and routing are implemented — but the infrastructure has not been provisioned and the app is not publicly reachable. This feature provisions the Supabase project (database + auth), deploys Collectstory to Vercel, and integrates the deployment into the monorepo CI pipeline so that every push to `main` that touches `apps/collectstory/` triggers an automated build and deploy.

## Business Context

- **Innovation & Growth**: Making Collectstory publicly accessible is a prerequisite for the 50% user-base growth target. The app cannot acquire users while it is undeployed.
- **Operational Excellence**: A CI-gated Vercel deployment ensures the 99.9% availability benchmark is achievable through reproducible, auditable deploys rather than manual processes.
- **Efficiency & Velocity**: Automating deployment via GitHub Actions and standardising the Vercel project config (monorepo `buildCommand`, `outputDirectory`) increases delivery frequency without manual intervention.
- **Architecture — Configuration-Driven Behavior**: All secrets and environment values (Supabase URLs, OAuth client IDs) must live in external configuration (Vercel env vars, GitHub Secrets) — never hardcoded. This enables environment-specific behaviour (preview vs. production) without code changes.
- **Architecture — Documentation as a Primary Artifact**: Infrastructure decisions (required env vars, OAuth provider setup steps, CI secret names) must be documented so future contributors can reproduce the setup.

## Requirements

### Supabase Project

1. A Supabase project must exist for Collectstory with the initial database schema applied (tables: `brands`, `lines`, `categories`, `stores`, `collection_items`; RLS policies; `pgcrypto` extension).
2. **Google OAuth** must be enabled in the Supabase project's Auth settings, with the redirect URI configured to point to the deployed app's `/auth/callback` route. Facebook and X OAuth are deferred.
3. The Supabase project must supply three environment values to the app: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

### Vercel Deployment

4. The Collectstory app must be deployed to Vercel, reachable via a public URL.
5. The Vercel project must be configured for the monorepo: root directory set to the repo root, `buildCommand` pointing to `pnpm turbo run build --filter=@dezkareid/collectstory`, and `outputDirectory` set to `apps/collectstory/.next`.
6. All required environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) must be set on the Vercel project for the production environment. `CLOUDINARY_CLOUD_NAME` is not yet available and must be added as a placeholder.
7. Preview deployments (from PRs) must also receive the environment variables so that auth flows can be tested before merging.

### CI Pipeline

8. The existing `deploy-apps.yml` workflow currently excludes `apps/collectstory/**` from its path triggers. This exclusion must be removed so that changes to `apps/collectstory/` trigger the workflow.
9. The CI deploy job must deploy Collectstory to Vercel (not Cloudflare Pages, which is used for other apps). The workflow must handle Vercel deployments for Collectstory and Cloudflare Pages deployments for other apps, dispatching correctly based on the app being deployed.
10. The GitHub repository must contain the necessary secrets for Vercel deployment: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID_COLLECTSTORY`.
11. On PR, the CI pipeline must produce a Vercel preview deployment URL. On push to `main`, it must trigger a production deployment.

### Documentation

12. A `.env.local.example` file must exist in `apps/collectstory/` listing all required environment variables with placeholder values and comments explaining where to obtain each value.
13. The `AGENTS.md` and `README.md` for `apps/collectstory/` must document the Supabase project setup steps, required Vercel project settings, and GitHub secrets required for CI to function.

## Scope

### In Scope

- Provisioning the Supabase project and running the initial migration
- Enabling and configuring Google OAuth in Supabase Auth (Facebook and X deferred)
- Creating and configuring the Vercel project with correct monorepo settings
- Setting production and preview environment variables on Vercel
- Adding Collectstory to the `deploy-apps.yml` CI workflow (path trigger + Vercel deploy step)
- Adding `collectstory` to `.github/apps.yml` paths filter
- Documenting required secrets, env vars, and setup steps

### Out of Scope

- Building new application features or UI changes
- Custom domain setup (can be done separately after initial deployment)
- Database seed data or reference data population (brands, lines, categories, stores)
- Supabase Edge Functions or Storage
- Email / magic-link auth (only social OAuth is in scope)
- Monitoring, alerting, or error-tracking tooling

## Acceptance Criteria

1. **Live URL**: Collectstory is publicly accessible at a Vercel-provided URL; the homepage loads without errors.
2. **Auth flow**: A user can sign in with Google and land on `/collection` after authentication.
3. **Protected route**: Accessing `/collection` without being authenticated redirects to `/login`.
4. **Schema applied**: The `collection_items`, `brands`, `lines`, `categories`, and `stores` tables exist in the Supabase database with RLS enabled.
5. **CI on PR**: Opening a PR that touches `apps/collectstory/` triggers the `deploy-apps.yml` workflow, which produces a Vercel preview URL.
6. **CI on merge**: Merging a PR to `main` with collectstory changes triggers a Vercel production deployment.
7. **Other apps unaffected**: The `deploy-apps.yml` changes do not break deployments for `main-website` or any other app.
8. **Env var documentation**: `.env.local.example` in `apps/collectstory/` lists all variables needed to run the app locally, with comments.
9. **Setup docs**: `README.md` contains a "Deployment" section describing the Supabase and Vercel setup steps and required GitHub secrets.

## Session Context

- The app targets `apps/collectstory/` within the `dezkareid` monorepo (worktree workflow).
- The existing `deploy-apps.yml` workflow explicitly **excludes** `apps/collectstory/**` via `!apps/collectstory/**` path filters — this is the primary CI gap to close.
- The workflow currently deploys only to Cloudflare Pages; a Vercel deploy step must be added (or the workflow must branch on app type).
- `apps.yml` path filter currently only lists `main-website`; `collectstory` must be added.
- OAuth providers supported by the app: Google, Facebook, X (Twitter) — all wired in `app/login/actions.ts`.
- The `vercel.json` file already exists with the correct `buildCommand` and `outputDirectory` for the monorepo.
- Supabase packages (`@supabase/ssr@0.9.0`, `@supabase/supabase-js@2.100.0`) are already installed.
- The auth middleware uses `supabase.auth.getClaims()` (not `getUser()`) — this is the correct pattern for `@supabase/ssr` and must be preserved.

## Decisions

1. **Cloudinary**: Not yet available. `CLOUDINARY_CLOUD_NAME` must be documented and added as a placeholder env var on Vercel; the image upload feature is not part of this feature.
2. **Facebook & X OAuth**: Deferred. Only Google OAuth will be configured in this feature. Facebook and X will be added in a future feature when developer app credentials are available.
3. **Vercel account**: Personal account. The Vercel project is created under a personal account; `VERCEL_ORG_ID` corresponds to the personal account ID.
4. **Preview env vars**: Preview deployments use the same Supabase production project. This is a known trade-off (risk of polluting prod data during PR testing) and is tracked as technical debt.
5. **Supabase migration method**: Migrations are applied via the Supabase CLI (`supabase db push`) as part of CI. This requires adding `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_ID` as GitHub secrets.
