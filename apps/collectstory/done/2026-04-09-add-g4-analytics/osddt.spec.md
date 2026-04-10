# Specification: G4 Analytics Integration for Collecstory

## Overview

The product team lacks quantitative data on how users interact with the Collecstory application. Currently, it is impossible to measure the success of product initiatives, track user engagement with key features (like the "Quick Start" onboarding), or understand the organic growth driven by social sharing.

This feature integrates Google Analytics 4 (G4) into the Collecstory application to capture essential interaction metrics. This data will enable data-driven product decisions and allow the team to measure the effectiveness of the platform's features and community engagement strategies.

### Business Context

This feature is a direct enabler for several **Dezkareid Enterprise Shared Strategic Outcomes (2026)**:

- **Innovation & Growth**: Directly supports the goal to expand the Collecstory user base by 50% by providing the metrics needed to measure and optimize community engagement (via social shares) and onboarding effectiveness.
- **High-Quality User Experience**: Supports the objective of achieving "High Quality" performance ratings by monitoring real-world page load times and user engagement patterns.
- **Efficiency & Velocity**: Aligns with the goal to increase the frequency of meaningful updates by providing the data needed to quickly identify underperforming features and respond to user needs.

From an **Architecture Principle** standpoint, this implementation adheres to:
- **Integrity and Auditability**: By providing a verifiable record of user behavior and system interaction, we ensure that product successes and failures are transparent and measurable.
- **Native Discoverability**: Monitoring how users find and interact with content helps us optimize the system's inherent discoverability.

## Requirements

The system must capture and report the following user-observable behaviors to Google Analytics 4:

1.  **Page Views**: Every route transition within the Collecstory application must trigger a page view event.
2.  **Social Sharing**: Clicks on social sharing buttons (e.g., Twitter/X, Facebook, LinkedIn, Copy Link) must be tracked, including the specific platform used.
3.  **Onboarding Funnel**: Interaction with the "Quick Start Collection" feature must be tracked, specifically identifying when a user starts the onboarding process and when they successfully complete it.
4.  **Key CTAs (Call to Actions)**: Engagement with primary action buttons must be captured, including:
    - "Copy Item" actions.
    - "Where to find" link clicks.
    - "Report Problem" submissions.
5.  **Global Actions**: Interaction with header elements (Login, Home navigation, Profile menu) must be tracked.
6.  **Performance Metrics**: Page loading events should include associated performance data (e.g., core web vitals) where supported by the client.

## Scope

### In Scope
- Integration of the G4 tag/SDK into the Collecstory Next.js application.
- Tracking of `page_view` events for all public and authenticated routes.
- Tracking of `share` events with platform parameters.
- Tracking of `cta_click` events for specific features (`quick-start`, `copy-item`, `where-to-find`, `report-problem`).
- Tracking of `onboarding_start` and `onboarding_complete` for the Quick Start flow.

### Out of Scope
- Server-side event tracking (all tracking will be client-side).
- Tracking of other applications in the monorepo (e.g., `main-website`).
- Marketing attribution modeling (e.g., UTM parameter management beyond standard G4 behavior).
- Tracking of administrative dashboard actions.

## Acceptance Criteria

- G4 is successfully integrated and verified via the Google Analytics Real-Time report.
- Every page transition in the Next.js environment of Collecstory triggers a unique page view event.
- Social sharing actions report the correct platform (e.g., "twitter", "copy_link") to the G4 dashboard.
- The onboarding funnel for "Quick Start" shows clear "start" and "complete" events.
- All tracked CTA clicks include a label identifying the specific button or action.
- Performance data (page load time) is visible in the analytics reports.

## Session Context

- The target package for this feature is `apps/collectstory`.
- The user highlighted the need to track "initiatives and effectiveness," which guided the inclusion of the "Quick Start" onboarding funnel and social sharing as high-priority metrics.

## Decisions

1. **User Identification**: Track a hashed version of the User ID for logged-in users to enable cross-device tracking.
2. **Performance Thresholds**: Use standard Core Web Vitals monitoring without additional custom events for thresholds.
3. **Internal Search**: Internal search queries will not be tracked at this stage.
4. **Specific Buttons**: The "i have this button" refers to the "Copy Item" action within a collection item.
5. **Consent Management**: Integration with a cookie consent banner is required before firing tracking events.
