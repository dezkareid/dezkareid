# Task List: Sentry Integration for Collectstory

## Phase 1: Dependency & Environment Setup
- [ ] [S] Install `@sentry/nextjs` using `pnpm add @sentry/nextjs` in the `apps/collectstory` directory.
- [ ] [S] Update `apps/collectstory/.env.local.example` with Sentry placeholders (`SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`).
- [ ] [S] Ensure environment variable access in `apps/collectstory` (verify `SENTRY_DSN` is correctly picked up).

**Definition of Done**: `@sentry/nextjs` is listed in `package.json` and environment variables are documented.

## Phase 2: Core Configuration
- [ ] [S] Create `apps/collectstory/sentry.client.config.ts` with `tracesSampleRate: 0.1` and disabled Session Replay.
- [ ] [S] Create `apps/collectstory/sentry.server.config.ts` with `tracesSampleRate: 0.1`.
- [ ] [S] Create `apps/collectstory/sentry.edge.config.ts` with `tracesSampleRate: 0.1`.
- [ ] [M] Implement `apps/collectstory/instrumentation.ts` to call Sentry initialization based on `NEXT_RUNTIME`.
- [ ] [M] Wrap the configuration in `apps/collectstory/next.config.ts` (or `next.config.js`) using `withSentryConfig`.

**Definition of Done**: Sentry configuration files exist, and the application starts correctly with Sentry integrated.

## Phase 3: Build & Release Integration
- [ ] [M] Execute a local build (`pnpm build` from monorepo root) and verify Sentry sourcemap upload logs.
- [ ] [M] Update `.github/workflows/deploy-collectstory.yml` to pass `SENTRY_AUTH_TOKEN` to the build process.
- [ ] [S] Configure the Sentry SDK to use the Git commit hash as the `release` version.

**Definition of Done**: Build process successfully uploads sourcemaps and reports release information to Sentry.

## Phase 4: Verification & Error Handling
- [ ] [S] Create a temporary `/test-sentry` page in `apps/collectstory/app/` to trigger test errors (client-side button + server-side action).
- [ ] [S] Verify client-side error appears in Sentry with environment tag and readable stack trace.
- [ ] [S] Verify server-side error appears in Sentry with environment tag and readable stack trace.
- [ ] [S] Remove the temporary `/test-sentry` page after verification.

**Definition of Done**: Verified end-to-end error reporting in Sentry with correct mapping and metadata.

## Dependencies
- Phase 2 requires Phase 1 completion.
- Phase 3 requires Phase 2 completion.
- Phase 4 requires Phase 2 and 3 (for full production-like verification).
