# Tasks: Calendly Integration for Mentoring Service

## Phase 1: Content & Configuration
- [x] [S] Add `calendlyLink` to `src/content/services/mentory.md` frontmatter.
- [x] [S] Update Zod schema in `src/content/config.ts` to include `calendlyLink`.
- **Definition of Done**: Frontmatter and schema are aligned, and the field is accessible in the template.

## Phase 2: Calendly Component Development
- [x] [M] Create `CalendlyTrigger` Astro component in `src/components/CalendlyTrigger.astro`.
- [x] [S] Implement script and CSS loading for Calendly widget.
- [x] [S] Implement `initPopupWidget` logic.
- [x] [S] Style the trigger button to match the design system.
- **Definition of Done**: A reusable component exists that can trigger the Calendly popup.

## Phase 3: Integration
- [x] [M] Modify service page template (e.g., `src/pages/services/[slug].astro`) to pass `calendlyLink` to `CalendlyTrigger`.
- [x] [S] Ensure the component only renders when `calendlyLink` is present.
- **Definition of Done**: The "Book a Session" button appears only on the Mentoring page.

## Phase 4: Analytics
- [x] [S] Add GA4 event tracking for the CTA click.
- [x] [S] (Optional) Add listener for `calendly.event_scheduled`.
- **Definition of Done**: CTA clicks are tracked in the data layer/GA4.

## Phase 5: Verification & Audit
- [x] [S] Manually verify the popup opens and works in development.
- [x] [M] Run `pnpm build` and check performance/accessibility (Lighthouse).
- **Definition of Done**: Feature works in production build with no regressions.

## Dependencies
- Phase 1 must be completed before Phase 3.
- Phase 2 must be completed before Phase 3.
- Phase 3 must be completed before Phase 4.
