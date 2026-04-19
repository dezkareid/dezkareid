# Implementation Plan: Add Analytics to Main Website

## Architecture Overview
The integration will follow a component-based approach in Astro. We will create a generic `GoogleAnalytics.astro` component that handles the initialization and event tracking logic for GA4. This component will be conditionally rendered in the main Layout based on the user's consent status.

Key decisions:
- **GA4 Integration**: Use the standard `gtag.js` library.
- **Generic Component**: Create a reusable Astro component for analytics.
- **Consent Management**: Integrate the `ThemeToggle` or equivalent consent logic from `@dezkareid/components/astro`.
- **Changesets**: Use `changeset` for versioning the changes within the monorepo.

## Implementation Phases

### Phase 1: Setup & Infrastructure
1. **Changeset**: Initialize a changeset for the analytics integration.
2. **Environment Variables**: Add `PUBLIC_GA_MEASUREMENT_ID` to `.env` (development) and ensure it's documented for production.

### Phase 2: Component Development
1. **Generic GA Component**: Create `apps/main-website/src/components/Analytics/GoogleAnalytics.astro`.
   - Implement the `gtag.js` snippet.
   - Support `page_view` and custom `event` tracking.
   - Handle opt-out/consent state.
2. **Consent Banner Integration**: Import and configure the consent banner from `@dezkareid/components/astro`.

### Phase 3: Integration & Event Tracking
1. **Layout Integration**: Inject the `GoogleAnalytics` component into the `<head>` of `apps/main-website/src/layouts/Layout.astro`.
2. **CTA Tracking**: Add data attributes or client-side scripts to track clicks on primary buttons (e.g., "Get Started").

### Phase 4: Validation
1. **Local Verification**: Use Google Analytics DebugView to confirm events are firing correctly.
2. **Performance Audit**: Run a Lighthouse audit to ensure Core Web Vitals are unaffected.

## Technical Dependencies
- `gtag.js` (loaded via CDN)
- `@dezkareid/components` (for the consent banner)
- `@changesets/cli` (for versioning)

## Risks & Mitigations
- **Risk**: Analytics affecting site performance.
- **Mitigation**: Load the GA script with `async` and only initialize after the initial page load or consent.
- **Risk**: Privacy non-compliance.
- **Mitigation**: Strictly respect the consent state from the shared component before firing any tracking events.

## Out of Scope
- Detailed user behavior analysis (heatmaps).
- Integration with third-party CRM platforms.
- Server-side tracking (all tracking will be client-side).
