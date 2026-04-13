# Implementation Plan: Sentry Integration for Collectstory

## Architecture Overview
The Sentry integration will follow the official Next.js SDK pattern, leveraging the `instrumentation` hook for server-side and edge initialization, and separate configuration files for the client. We will use the `@sentry/nextjs` package (version 8.x, which supports Next.js 16 and React 19) to ensure full coverage across App Router components, Server Actions, and API routes. Sourcemaps will be automatically uploaded to Sentry during the `pnpm build` process via the Sentry Webpack Plugin integrated into `next.config.ts`.

## Implementation Phases

### Phase 1: Dependency & Environment Setup
- **Step 1**: Install `@sentry/nextjs` (latest stable 8.x).
- **Step 2**: Add required environment variables to `.env.local` and CI/CD (GitHub Actions):
  - `SENTRY_DSN`
  - `SENTRY_AUTH_TOKEN` (for sourcemap uploads)
  - `SENTRY_ORG`
  - `SENTRY_PROJECT`

### Phase 2: Core Configuration
- **Step 1**: Create `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts` in the root of `apps/collectstory`.
- **Step 2**: Configure `sentry.client.config.ts` with `tracesSampleRate: 0.1` and disable Session Replay as per the spec decisions.
- **Step 3**: Configure `sentry.server.config.ts` and `sentry.edge.config.ts` with appropriate sampling and environment context.
- **Step 4**: Implement `instrumentation.ts` to register Sentry for the `nodejs` and `edge` runtimes.
- **Step 5**: Update `next.config.ts` (or `next.config.js`) to use `withSentryConfig`.

### Phase 3: Build & Release Integration
- **Step 1**: Verify that `pnpm build` triggers sourcemap upload.
- **Step 2**: Update the GitHub Actions workflow (`.github/workflows/deploy-collectstory.yml`) to pass `SENTRY_AUTH_TOKEN` during the build step.
- **Step 3**: Enable release tracking to correlate errors with specific commits.

### Phase 4: Verification & Error Handling
- **Step 1**: Create a temporary test page/route to manually trigger a client-side and server-side error.
- **Step 2**: Verify that errors appear in Sentry with correct environment tags (`production`, `preview`, `development`) and readable stack traces.
- **Step 3**: Verify that the 10% sampling rate is correctly applied in the production environment.

## Technical Dependencies
- **SDK**: `@sentry/nextjs` (v8.x)
- **Runtime**: Next.js 16.2.3, React 19.2.4
- **Tooling**: Sentry Wizard (optional for initial scaffolding, but manual config is preferred for precision).

## Risks & Mitigations
- **Risk**: Increased build times due to sourcemap upload.
  - **Mitigation**: Use `silent: true` and ensure Sentry upload happens in parallel where possible. Monitor build times in CI.
- **Risk**: Performance impact of client-side tracking.
  - **Mitigation**: Use the agreed 0.1 sampling rate and avoid heavy integrations like Session Replay.
- **Risk**: Sensitive data leakage.
  - **Mitigation**: Use Sentry's `beforeSend` or `data-masking` features if needed, though the decision was to rely on defaults for now.

## Out of Scope
- Sentry integration for `apps/main-website` or other monorepo packages.
- Custom Sentry user feedback components.
- Advanced performance profiling beyond standard transaction tracing.
