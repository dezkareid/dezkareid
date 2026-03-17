# Feature Spec: Improve Content, UI, and Accessibility of Main Page, Projects, and Services

## Overview

The current main website has functional structure but presents content that feels generic, lacks visual hierarchy, and misses accessibility best practices. The hero copy, about section, project descriptions, and service pages do not fully communicate Joel's unique positioning as a Frontend Architect. The UI lacks visual polish on key conversion sections (services, featured projects, contact CTA), and several accessibility gaps (missing ARIA labels, low-contrast states, keyboard navigation issues) reduce the experience for all users.

This feature improves the written content to be more specific and compelling, enhances the visual presentation of key sections, and brings the pages up to WCAG 2.2 AA compliance.

---

## Research Summary

Screenshots were taken of the two Platzi work projects that have live URLs:

- **Platzi home** (`https://platzi.com/`): Dark-themed, bold typography, teal accent color, clean hero with search bar and clear value proposition ("La escuela de tecnología de Latinoamérica"). A recognizable brand that can be referenced as the employer context.
- **Platzi blog** (`https://platzi.com/blog/`): Card-based blog grid with images, author avatars, reading time, and like counts. High-traffic, visually dense layout. Suitable for a screenshot-based project image.

Screenshots saved to `working-on/improve-content-ui-main/` as `screenshot-platzi-home.png` and `screenshot-platzi-blog.png`.

Projects without live screenshots currently use `https://placehold.co/600x400`. AI-generated images and Cloudinary upload are deferred to a separate session.

---

## Requirements

### Content

1. The homepage hero must communicate Joel's specific value proposition clearly — not just a job title, but the outcome he delivers for clients/teams.
2. The homepage presentation quote must feel personal and distinctive, avoiding generic developer biography language.
3. The projects index page description must reflect the actual range of work shown (design systems, open-source tools, enterprise migrations, performance work).
4. Each featured project card on the homepage must have a description that conveys impact, not just what the project is.
5. The services index page description must speak to the target audience (businesses, teams, individuals) and the outcome they get.
6. The about page copy must feel authentic and specific to Joel's background, not a generic developer bio template.
7. The services detail pages must clearly explain who the service is for and what the outcome is.

### UI / Visual Design

8. The homepage services section must visually distinguish the most strategic offerings (Frontend as a Service, Frontend Architecture) from supporting services.
9. The featured projects section on the homepage must have a clear visual hierarchy that draws attention to the project name and impact, not just the tech stack.
10. The services index page must have a CTA section that feels inviting and action-oriented, not just a button below a description.
11. The projects index page must present the full project grid in a way that is easy to scan and compare.
12. Section labels/eyebrows (e.g., "Offerings", "Work", "Tech Stack") must be visually consistent across all pages.
13. The contact section must clearly display all social/contact options with adequate touch/click targets.

### Service Card UX

14. Each service card must clearly communicate: the service name, a one-line outcome statement, and a single primary action (CTA button).
15. Service cards must have a consistent visual structure so users can scan and compare offerings at a glance.
16. The CTA button on each service card must use action-oriented label text specific to that service (e.g., "Start a project", "Book a call") — not a generic "Learn more".
17. Service cards must provide a clear affordance (hover state, cursor, or link behavior) indicating they are interactive and lead to a detail page.
18. On the services index, the card layout must group or visually separate "delivery" services (Frontend as a Service, Architecture, Performance) from "support" services (Consulting, Mentoring, Speaking).

### Project Card UX

19. Each project card must display: project title, a one-sentence impact description, project type badge (Personal / Work / Contribution), tech stack pills, and at least one relevant link (GitHub, npm, live site, or demo).
20. Project cards for work projects (Platzi) must use a real screenshot as the card image — using the captured screenshots of platzi.com and platzi.com/blog.
21. Project cards for personal/OSS projects without a live URL may use a placeholder image until AI-generated assets are produced in a dedicated session.
22. Project cards must surface all relevant external links (GitHub, npm, live site) directly on the card, not only on the detail page, so users can reach the resource in one click.
23. Project type badges must be visually distinct for each type (Personal, Work, Contribution) and not rely on color alone.
24. The project card hover state must clearly indicate the card is interactive without causing layout shifts.

### Project Links

25. The following projects must include the corresponding external links in their content and on their cards:
    - **IBM Carbon Design System**: GitHub — `https://github.com/carbon-design-system/carbon`
    - **Sync AI Context**: npm — `https://www.npmjs.com/package/@dezkareid/ai-context-sync`
    - **Spec-Driven Development Tool (OSDDT)**: npm — `https://www.npmjs.com/package/@dezkareid/osddt`
    - **AI Team**: npm — `https://www.npmjs.com/package/@dezkareid/ai-team`
    - **Dezkareid Design System**: GitHub — `https://github.com/dezkareid/dezkareid/tree/main/design-system`
    - **Platzi Frontend Migration**: live site — `https://platzi.com/`
    - **Platzi Blog**: live site — `https://platzi.com/blog/`
26. Links must open in a new tab (`target="_blank"`) with appropriate `rel="noopener noreferrer"`.
27. Link labels must be descriptive (e.g., "View on GitHub", "Install on npm", "Visit site") — not bare URLs.

### Accessibility

14. All interactive elements (buttons, links, nav items, social icons) must have visible focus indicators that meet WCAG 2.2 AA contrast ratios.
15. All images must have descriptive, meaningful `alt` text (or `alt=""` for decorative images).
16. All icon-only interactive elements (social link icons, theme toggle) must have accessible names via `aria-label` or visually hidden text.
17. The navigation must be keyboard-navigable in logical DOM order.
18. Color contrast for all text and interactive states (default, hover, focus) must meet WCAG AA (4.5:1 for normal text, 3:1 for large text and UI components).
19. Section headings must follow a logical heading hierarchy (H1 → H2 → H3) on every page.
20. The theme toggle must announce its current state to screen readers.
21. Project type badges and tech stack pills must not rely on color alone to convey meaning.
22. The site must be usable without JavaScript (progressive enhancement) — layout and content must be readable with JS disabled.

---

## Scope

### In Scope

- Homepage (`/`): hero copy, presentation quote, services section, featured projects section, skills section, contact section — content and visual/accessibility improvements
- Projects index page (`/projects`): page description, project grid presentation, accessibility
- Projects detail page (`/projects/[slug]`): heading structure, accessibility of breadcrumb, tech stack pills, links
- Services index page (`/services`): page description, service grid, CTA section — content and visual/accessibility improvements
- Services detail page (`/services/[slug]`): copy improvements, heading structure, accessibility of interactive elements
- About page (`/about`): copy rewrite, accessibility improvements
- Global: focus indicators, heading hierarchy, aria labels on icon-only elements, color contrast audit
- Project content files: add correct external links (GitHub, npm, live URLs) to all 8 projects
- Project images: replace placeholder images with real screenshots for Platzi projects (AI-generated images deferred)
- Service card UX: improve card structure, CTA labels, visual grouping
- Project card UX: improve card structure, link surfacing, image quality

### Out of Scope

- Adding new pages or routes
- Adding new projects or services content entries (only editing existing)
- Redesigning the navigation or header
- Changing the overall layout structure (section order, grid columns)
- Adding animations or transitions beyond what already exists
- Backend or CMS changes

---

## Acceptance Criteria

1. **Hero copy**: A first-time visitor can identify within 5 seconds who Joel is, who he helps, and what outcome he provides.
2. **Services section**: Each service card describes a concrete outcome, not just a capability label.
3. **Projects section**: Each featured project card communicates what makes the project notable or impactful, beyond listing tech stack.
4. **About page**: Copy reads as a first-person, specific account — not a generic template. No filler phrases like "passionate developer" or "when I'm not coding."
5. **Focus indicators**: Every interactive element shows a visible focus ring when navigated via keyboard (Tab key).
6. **Icon-only elements**: Screen reader announces a meaningful label for all social links, theme toggle, and any other icon-only controls.
7. **Heading hierarchy**: Running a heading-order check on any page returns no skipped heading levels.
8. **Color contrast**: Automated contrast check passes WCAG AA for all text and interactive UI states in both light and dark themes.
9. **Alt text**: No `<img>` element is missing an `alt` attribute.
10. **Section labels**: Eyebrow/label text is visually and semantically consistent across all sections on all pages.
11. **CTA section (services)**: The "Ready to start a project?" section reads as an invitation with a clear next action.
12. **No JS fallback**: Pages render meaningful content without JavaScript enabled.
13. **Service card links**: Every service card CTA button leads to the service detail page or a contact action — no dead ends.
14. **Project card images**: Platzi project cards show real screenshots. Other projects may retain placeholders until image generation is handled in a separate session.
15. **Project links**: Every project that has an external URL (GitHub, npm, live site) shows that link on its card and detail page. No project with a known URL is missing a link.
16. **External link behavior**: All links to external sites open in a new tab and include `rel="noopener noreferrer"`.
17. **Service card scannability**: A user can compare all services in the grid without reading each card in full — the title and one-line outcome are always visible and consistently positioned.
18. **Project card scannability**: A user can identify project type (Personal/Work/Contribution) and available links at a glance for every card in the grid.

---

## Session Context

- User explicitly requested improved UX for service and project cards, not just content changes.
- User requested screenshots of Platzi work projects (captured: `screenshot-platzi-home.png`, `screenshot-platzi-blog.png`) to use as real project images.
- AI-generated images and Cloudinary upload are deferred to a separate session.
- User provided specific external links to be added to each project:
  - IBM Carbon: `https://github.com/carbon-design-system/carbon`
  - Sync AI Context: `https://www.npmjs.com/package/@dezkareid/ai-context-sync`
  - OSDDT: `https://www.npmjs.com/package/@dezkareid/osddt`
  - AI Team: `https://www.npmjs.com/package/@dezkareid/ai-team`
  - Design System: `https://github.com/dezkareid/dezkareid/tree/main/design-system`
  - Platzi Frontend Migration: `https://platzi.com/`
  - Platzi Blog: `https://platzi.com/blog/`

---

## Decisions

1. **Hero copy tone**: Lead with companies/teams as the primary audience (frontend contractor/consultant), with mentoring mentioned as a secondary offering.
2. **About page hero image**: Keep the current circular avatar style. Generate a custom illustrated/designed hero image for the site based on the site content and Joel's positioning.
3. **Featured project selection**: Change to a mix — 1 work project (Platzi Frontend Migration) + 2 personal (Design System + Sync AI Context or AI Team).
4. **Services CTA email**: Keep `elmaildeldezkareid@gmail.com` as-is.
5. **Skills section scope**: Keep the list lean intentionally — do not expand or reorganize.
