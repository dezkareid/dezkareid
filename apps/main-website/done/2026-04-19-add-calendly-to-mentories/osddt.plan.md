# Plan: Calendly Integration for Mentoring Service

## Architecture Overview
The integration will follow a **Configuration-Driven** approach, where the Calendly link is stored in the service frontmatter. A dedicated Astro/React component will handle the Calendly script loading and the popup trigger.

- **Component Layer**: A `CalendlyPopup` component (or integration) will be responsible for injecting the `calendly.js` script and initializing the widget.
- **Trigger**: A "Book a Session" CTA button will be added to the Mentoring service page.
- **Data Flow**: The service page template will read the `calendlyLink` from the content frontmatter and pass it to the trigger component.
- **Analytics**: A data-layer event or direct GA4 call will be triggered upon clicking the "Book a Session" button.

## Implementation Phases

### Phase 1: Content & Configuration
- **Step 1.1**: Update `src/content/services/mentory.md` to include a `calendlyLink` field in the frontmatter.
- **Step 1.2**: Update the service schema (if applicable) to allow the new field.

### Phase 2: Calendly Component Development
- **Step 2.1**: Create a `CalendlyTrigger` component.
- **Step 2.2**: Implement script loading for `https://assets.calendly.com/assets/external/widget.js`.
- **Step 2.3**: Implement the `Calendly.initPopupWidget` call to open the overlay.
- **Step 2.4**: Ensure styles are consistent with the design system.

### Phase 3: Integration
- **Step 3.1**: Modify the service page template (`src/pages/services/[slug].astro` or similar) to detect the `calendlyLink`.
- **Step 3.2**: Render the `CalendlyTrigger` component if the link is present.

### Phase 4: Analytics
- **Step 4.1**: Integrate GA4 event tracking (`event: 'book_session_click'`) when the CTA is clicked.
- **Step 4.2**: (Optional/Nice-to-have) Listen for Calendly `calendly.event_scheduled` postMessage event to track successful bookings.

### Phase 5: Verification & Audit
- **Step 5.1**: Run a local build and verify the widget functionality.
- **Step 5.2**: Perform a Lighthouse audit to ensure no performance regressions or accessibility issues.

## Technical Dependencies
- **Calendly Widget API**: External script `widget.js` and CSS `widget.css`.
- **GA4/GTM**: Existing tracking infrastructure in `apps/main-website`.
- **Astro**: Content collections and component rendering.

## Risks & Mitigations
- **Script Blocking**: Ad-blockers might block Calendly. *Mitigation*: Ensure the button fallback is a direct link if the script fails to load.
- **Performance Impact**: External scripts can slow down the page. *Mitigation*: Use `client:idle` or deferred script loading to prioritize LCP.
- **Design Mismatch**: The popup style is controlled by Calendly. *Mitigation*: Use `color` and `branding` parameters in the widget configuration.

## Out of Scope
- Inline embedding of the calendar.
- Custom booking forms (relying on Calendly default).
- Multi-event type selection (using a single link).
