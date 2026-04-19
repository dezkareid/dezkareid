# Feature Specification: Add Analytics to Main Website

## Overview
The goal is to integrate an analytics solution into the main marketing website (`apps/main-website`) to gain insights into user behavior, track engagement, and monitor conversion rates. This will help the team make data-driven decisions for future improvements and marketing strategies.

## Requirements
- **Page View Tracking**: Automatically track page views on all routes within the marketing website.
- **Event Tracking**:
  - Track interactions with primary Call-to-Action (CTA) buttons.
  - Track successful form submissions (e.g., contact forms, sign-up leads).
- **User Identity**: Support anonymous tracking by default, with the ability to identify users if they sign up or log in (if applicable).
- **Privacy Compliance**: Ensure the implementation adheres to relevant data protection regulations (GDPR, CCPA). This includes respecting "Do Not Track" headers and providing a consent mechanism if required.
- **Performance**: The analytics script should be loaded asynchronously to avoid impacting the site's initial load time or Core Web Vitals.

## Scope
### In-Scope
- Integration of the analytics provider's script into the Astro-based `main-website` application.
- Configuration of environment variables for tracking IDs/API keys.
- Tracking of core engagement metrics (page views, sessions, bounce rate).
- Tracking of specific CTA clicks on the homepage and landing pages.

### Out-of-Scope
- Implementation of analytics in other monorepo applications (e.g., `apps/collectstory`).
- Advanced heatmapping or session recording (unless provided out-of-the-box by the chosen provider).
- Custom reporting dashboard development.

## Acceptance Criteria
- Page views are correctly reported in the analytics provider's dashboard for all public routes.
- Clicking a "Get Started" or "Contact Us" button triggers a corresponding custom event in the analytics dashboard.
- Successful form submissions are recorded as conversion events.
- The website's Lighthouse performance score remains within 5% of its baseline after the integration.
- Analytics are only active in production environments (disabled in development/test unless explicitly toggled).

## Decisions
1. **Provider Selection**: Use Google Analytics 4.
2. **Specific Events**: For the moment only check loads pages and clics on CTA.
3. **Consent Banner**: Use Existing Component.
