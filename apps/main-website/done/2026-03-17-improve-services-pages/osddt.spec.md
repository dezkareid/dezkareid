# Spec: Improve Services Pages Performance, Accessibility & Content

## Overview

The services pages are a primary revenue channel. Currently they have good structural foundations but lack optimized performance, complete accessibility coverage, and strong conversion-focused content. This feature improves all three dimensions to drive more organic traffic (SEO), improve user retention (accessibility + UX), and increase conversion (clear CTAs throughout).

## Requirements

### Performance
1. Each service page must achieve a Lighthouse Performance score ≥ 90 on both mobile and desktop.
2. Images and assets on service pages must be optimized (lazy loading, correct sizing, no render-blocking resources).
3. The service index page must load with minimal layout shift (CLS < 0.1).
4. Service pages must not introduce unnecessary JavaScript payloads.

### Accessibility
5. All service pages must achieve a Lighthouse Accessibility score ≥ 95.
6. Every interactive element (links, buttons) must have a visible focus indicator.
7. Page heading hierarchy must be correct and unbroken (h1 → h2 → h3) on every service page.
8. All text content must meet WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text).
9. The breadcrumb on detail pages must be marked up as a `<nav>` with `aria-label="Breadcrumb"`.
10. Service content sections should use appropriate landmark roles so screen reader users can navigate efficiently.
11. CTA buttons must have descriptive accessible names (not just "Inquire").

### SEO
12. Each service page must have a unique, descriptive `<title>` and `<meta description>` (≤ 160 characters).
13. Each service page must have unique `og:description` and `og:title` tags matching the page content.
14. Structured data (Schema.org `Service` type) must be present on each service detail page.
15. The canonical URL for each service page must be set correctly.
16. Service index page must have its own unique meta description.

### Content & CTA
17. Every service detail page must have at least one primary CTA button visible above the fold (in the hero/header area).
18. Every service detail page must have a secondary CTA section at the bottom of the content (before the footer), so users who read to the end have a clear next action.
19. The CTA copy must match the service context (e.g. "Start a project" for Frontend as a Service, not generic "Inquire").
20. Each service page must clearly state: who the service is for, what the outcome is, and how to engage.
21. The services index page CTA section must be compelling and reflect current availability.

## Scope

### In Scope
- All 6 service detail pages (`/services/frontend-as-a-service`, `/services/frontend-architecture`, `/services/performance`, `/services/consultory`, `/services/mentory`, `/services/speaker`)
- The services index page (`/services`)
- Meta tags (title, description, og:*, twitter:*) for all service pages
- Structured data markup on service detail pages
- Accessibility fixes across service pages and shared components used by them
- Content review and CTA additions/improvements in service markdown files
- Bottom CTA section added to each service detail page

### Out of Scope
- Navigation or footer changes
- Non-service pages (home, about, projects, etc.)
- Contact form implementation (CTA links to email/booking; no new form UI)
- Design system token changes
- New service pages or removal of existing ones
- Backend/API integrations

## Acceptance Criteria

1. **Performance:** Lighthouse Performance ≥ 90 on all 7 service pages (index + 6 detail).
2. **Accessibility:** Lighthouse Accessibility ≥ 95 on all 7 service pages.
3. **SEO:** Lighthouse SEO = 100 on all 7 service pages.
4. **Unique meta:** Each page has a distinct `<title>`, `<meta description>`, `og:title`, and `og:description` — no page shares the same values.
5. **Structured data:** Each service detail page passes Google's Rich Results Test for `Service` schema.
6. **CTA above fold:** On every service detail page, the primary CTA button is visible without scrolling on a 1280×800 viewport.
7. **CTA at bottom:** On every service detail page, a CTA section appears after the main content and before the footer.
8. **Accessible names:** All CTA buttons pass axe-core with no violations for accessible name.
9. **Heading order:** No heading level is skipped on any service page (validated via axe-core or manual review).
10. **Contrast:** All text on service pages meets WCAG AA contrast ratio.

## Decisions

1. **Bottom CTA design:** Use `bg-alt` background style matching the index page CTA section — centered heading, paragraph, and button. One CTA per detail page, placed just before the footer.
2. **Structured data scope:** Include pricing information in `Service` schema (approximate/range values alongside descriptive fields).
3. **CTA destination:** All CTA buttons link to the existing mailto link.
4. **Availability messaging:** Keep the existing availability copy on the index page unchanged.
5. **og:image:** Unique OG images per service page is the goal, but use the shared Cloudinary image for this iteration.
