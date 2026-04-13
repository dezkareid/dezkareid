# Feature Specification: Sentry Error Monitoring

## Overview
Currently, the `collectstory` application lacks a centralized system for monitoring and tracking runtime errors in production. This makes it difficult to proactively identify, diagnose, and fix bugs that users encounter. We need to integrate Sentry to provide real-time error reporting and performance monitoring across both the client and server environments of our Next.js application.

## Requirements
- **Runtime Error Capture:** Automatically capture and report all unhandled exceptions occurring in the browser and on the server.
- **Manual Error Reporting:** Provide a standard way to manually capture and report handled errors or specific business-logic failures.
- **Environment Context:** Each error report must include context about the environment (e.g., production, staging), the release version, and relevant system metadata (browser, OS).
- **Readable Stack Traces:** Ensure that production stack traces are mapped back to the original source code using sourcemaps.
- **Performance Monitoring:** Capture basic performance metrics and transaction traces to identify slow parts of the application.

## Scope
- **In-scope:**
  - Integration of Sentry SDK into the `apps/collectstory` Next.js application.
  - Configuration for both client-side and server-side (API routes, Edge runtime if used) error tracking.
  - Automatic sourcemap upload during the build process.
  - Configuration via environment variables.
- **Out-of-scope:**
  - Integration for other applications or packages in the monorepo.
  - Implementation of custom Sentry user feedback dialogs.
  - Advanced session replay features (unless specified later).

## Acceptance Criteria
- Errors occurring in the production environment are successfully captured and visible in the Sentry dashboard.
- Stack traces in Sentry are readable and point to the correct source lines.
- The integration does not capture errors in local development unless a specific `SENTRY_DSN` is provided.
- Sensitive information (like passwords or secrets in environment variables) is not leaked to Sentry.
- The application build process correctly uploads sourcemaps to Sentry without increasing the final bundle size significantly.

## Decisions
1. **Session Replay**: Do not enable Session Replay for now.
2. **Sampling Rate**: Use a 0.1 (10%) sampling rate for performance monitoring in production.
3. **PII Filtering**: No specific PII filtering rules beyond Sentry's defaults.
4. **Environment Names**: Use `production`, `preview`, and `development` as environment names.
5. **CI/CD Integration**: Integrate Sentry with the CI/CD pipeline for release tracking and sourcemap management.

## Session Context
- The user specified `apps/collectstory` as the target for this integration.
