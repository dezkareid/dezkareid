# Specification: Calendly Integration for Mentoring Service

## Overview
Integrate a Calendly scheduling widget into the Mentoring service page of the personal website. This feature aims to streamline the booking process for prospective mentees, allowing them to schedule sessions directly without needing to initiate a separate contact flow.

## Business Context
This feature directly aligns with the **Innovation & Growth** objective of Dezkareid Enterprise:
- **Lead Generation**: Aims to contribute to the goal of a 20% increase in lead generation for Personal Website services (Mentoring) by reducing friction in the conversion funnel.
- **User Experience**: Enhances the user experience by providing an immediate, interactive way to engage with the service, aligning with the "High-Quality User Experience" objective.
- **Architectural Alignment**: The implementation will follow the **Configuration-Driven Behavior** principle, ensuring the scheduling link is easily manageable.

## Requirements
- **Integrated Scheduling**: The Mentoring service page must display a Calendly widget (inline or popup) that allows users to browse availability and book a session.
- **Visual Consistency**: The widget integration should respect the website's design system and layout, ensuring a professional and cohesive appearance.
- **Loading Performance**: The Calendly script should be loaded efficiently to minimize impact on page performance (LCP/TBT), adhering to the **Performance-First Design** principle.
- **Accessibility**: The integration must ensure that the scheduling flow remains accessible to all users, following WCAG standards.

## Scope
- **In-Scope**:
  - Modification of the Mentoring service content or template to include the Calendly widget.
  - Configuration of the Calendly event link.
  - Basic styling adjustments to ensure the widget fits the layout.
- **Out-of-Scope**:
  - Custom backend integration for scheduling (Calendly manages the state).
  - Integration with other services (e.g., Development or Consulting) unless requested.
  - Modification of Calendly's internal styling (beyond what their embed options allow).

## Acceptance Criteria
- [ ] The Calendly widget is visible and functional on the Mentoring service page.
- [ ] Users can successfully navigate the scheduling flow within the widget.
- [ ] The widget configuration (link) is defined in a manageable way (e.g., content frontmatter or environment variable).
- [ ] Page performance metrics remain within the "High Quality" rating thresholds.
- [ ] The page passes basic accessibility audits with the widget present.

## Open Questions
- **Integration Style**: Should the widget be embedded inline (always visible) or triggered by a "Book a Session" button (popup/overlay)?
- **Specific Link**: Is there a specific Calendly event link or user profile that should be used as the default?
- **Global Availability**: Should the booking option be available globally across all services, or exclusively for the Mentoring service for now?
- **Tracking**: Do we need to implement specific event tracking (e.g., GA4) for successful bookings?

## Session Context
- The project is identified as `apps/main-website` (Astro-based).
- The "mentories service" was identified in the codebase as the "Mentoring" service located in `src/content/services/mentory.md`.
