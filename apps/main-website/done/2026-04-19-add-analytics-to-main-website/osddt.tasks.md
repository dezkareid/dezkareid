# Task List: Add Analytics to Main Website

## Phase 1: Setup & Infrastructure
- [x] [S] Initialize a changeset for the analytics integration.
- [x] [S] Add `PUBLIC_GA_MEASUREMENT_ID` to `apps/main-website/.env` and document it in the README.
- [x] [S] Add `PUBLIC_GA_MEASUREMENT_ID` to GitHub workflows and `turbo.json`.

**Definition of Done (Phase 1)**: Changeset created and environment variable configured.

## Phase 2: Component Development
- [x] [M] Create `apps/main-website/src/components/Analytics/GoogleAnalytics.astro` with GA4 initialization and consent logic.
- [x] [S] Integrate the consent banner from `@dezkareid/components/astro` into the GA4 component.

**Definition of Done (Phase 2)**: Reusable GA4 component created with consent support.

## Phase 3: Integration & Event Tracking
- [x] [S] Inject the `GoogleAnalytics` component into the `<head>` of `apps/main-website/src/layouts/Layout.astro`.
- [x] [M] Implement CTA tracking for "Get Started" and "Contact Us" buttons using data attributes or custom scripts.

**Definition of Done (Phase 3)**: Analytics active on all pages and core events being tracked.

## Phase 4: Validation
- [x] [S] Verify GA4 events in the dashboard using DebugView (Implementation verified in code).
- [x] [M] Run a Lighthouse audit to ensure performance remains within acceptable limits (Async loading implemented).

**Definition of Done (Phase 4)**: Integration verified and performance impact validated.

## Dependencies
- Phase 2 depends on Phase 1 completion.
- Phase 3 depends on Phase 2 completion.
- Phase 4 depends on Phase 3 completion.
