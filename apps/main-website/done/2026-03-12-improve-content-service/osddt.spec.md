# Spec: Improve Content of Service Sections and Projects

## Overview

The portfolio website currently displays a services section and a projects section on the homepage. The service content files have been updated with new offerings and the UI needs to reflect this. Additionally, the existing service texts need copy editing for clarity and professionalism, and each service card must include a call to action (CTA) so visitors can take the next step.

The goal is to ensure that every service is clearly presented, easy to read, and converts visitors into leads by providing a direct action they can take.

## Requirements

### Services Section

1. **Display all services** — the homepage services grid must show all 6 services (currently capped at 3 via `.slice(0, 3)`). The UI should either remove the cap or introduce a "View all services" link while showing a meaningful subset.
2. **Copy editing** — each service file must have clear, consistent, and professional copy:
   - Titles must be grammatically correct and marketable (e.g. "Consultory" → "Consulting", "Mentory" → "Mentoring").
   - Descriptions (used in the card) must be one punchy sentence that communicates value.
   - The body text (overview + how it works) must be concise, free of grammatical errors, and benefit-oriented.
3. **Unique icons** — each service must have a distinct, relevant emoji icon (currently all use 🚀 except performance and speaker).
4. **Consistent `order` values** — services must have unique, sequential `order` values so they sort predictably.
5. **Call to action per service** — each service card on the homepage must include a clear CTA (e.g. "Book a call", "Request an audit", "Learn more", "Send a speaking request") that links to the service detail page or a contact mechanism. The ServiceCard already renders a "Learn about {title}" link — this CTA text must be customized per service to be more compelling.

### Projects Section

6. **Projects replaced** — the 3 existing project entries are removed and replaced with 8 new ones: "Sync AI Context", "Other Spec-Driven Development tool", "AI Team", "Dezkareid Design System", "Platzi frontend migration", "Platzi Blog", "Platzi Internationalization", "IBM Carbon Design System". Each must include a short (1–2 sentence) description, tech stack, placeholder image, and a `type` field (`personal`, `work`, or `contribution`).
7. **Project type field** — the content schema gains a `type` field (enum: `personal | work | contribution`) and `ProjectCard.astro` displays a visible badge for it.
10. **Projects section intro text** — the homepage projects section must display a short explanatory sentence below the section title: "Some projects are personal, others are contributions, and others are part of my past work." This sets context for the type badges shown on each card.
8. **Project card image** — each project card must display a cover image at the top of the card. The `image` field already exists in the content schema but is currently unused in the UI. Project markdown files will use placeholder images from `https://placehold.co`, and `ProjectCard.astro` must render the image.
9. **Short description on card** — the project card must show a short, punchy description (1–2 sentences max). The current `description` field is used for this.
10. **Clickable card, no buttons** — the project card must be entirely clickable (linking to `/projects/{slug}`). The buttons row (GitHub, Live Demo, Read More) is removed. The full card acts as the link.
11. **Service card dual action** — each service card is clickable to `/services/{slug}` (with a placeholder page if the detail page doesn't exist yet), and also has a separate "Contact" CTA linking to `#contact`.

## Scope

### In Scope
- Editing all 6 service markdown files: titles, descriptions, icons, order values, body copy, and CTA text.
- Adding a `cta` field to the services content schema and to each service file.
- Updating `ServiceCard.astro` to use the custom `cta` label from the content instead of the hardcoded "Learn about {title}".
- Updating `index.astro` to show all 6 services (remove or increase the `.slice(0, 3)` cap), or add a "View all services" link.
- Removing the 3 existing project markdown files and creating 8 new ones with copy, tech stack, placeholder image, `type`, and `featured`/`order` fields.
- Adding a `type` field (`personal | work | contribution`) to the projects content schema.
- Updating `ProjectCard.astro` to render the cover image, display the type badge, remove the buttons row, and make the entire card a clickable link to `/projects/{slug}`.
- Creating placeholder service detail pages for services that don't have one yet (minimal page with title and "coming soon" copy).
- Updating `ServiceCard.astro` to make the whole card link to `/services/{slug}` and add a secondary "Contact" CTA pointing to `#contact`.

### Out of Scope
- Redesigning the ServiceCard or ProjectCard visually beyond the structural changes above.
- Full service detail page content (placeholder pages are sufficient).
- Adding contact forms or booking integrations.
- Changing the projects or services grid layout.

## Acceptance Criteria

1. All 6 services are visible on the homepage grid.
2. Each service card displays a unique, relevant icon.
3. Each service card is clickable to `/services/{slug}` and has a "Contact" CTA linking to `#contact`.
4. Service titles are correctly spelled and professionally worded ("Consulting", "Mentoring").
5. Service descriptions are one clear sentence communicating the value proposition.
6. Service body copy is free of typos and grammatical errors.
7. Services render in a predictable, intentional order.
8. The homepage shows the 8 new projects (old 3 are gone).
8a. The projects section header includes the sentence "Some projects are personal, others are contributions, and others are part of my past work."
9. Each project displays a `type` badge (`personal`, `work`, or `contribution`).
10. Project cards display a placeholder cover image at the top.
11. Project card descriptions are short (1–2 sentences) and benefit-oriented.
12. Project cards have no buttons; clicking anywhere on the card navigates to `/projects/{slug}`.
13. Each project markdown file has a `type` field, a `description`, a `techStack`, and a placeholder `image` URL.

## Decisions

1. **Project images**: use placeholder images from `https://placehold.co`.
2. **Homepage grid cap**: show all 6 services on the homepage (remove the `.slice(0, 3)` cap).
3. **CTA destination**: each service card is clickable to its detail page (`/services/{slug}`); additionally, each card has a separate "Contact" CTA linking to `#contact`. For services without a detail page yet, use a placeholder page.
4. **"Consultory" / "Mentory" naming**: typos — correct to "Consulting" and "Mentoring".
5. **Projects**: replace all 3 existing projects with 8 new ones: "Sync AI Context", "Other Spec-Driven Development tool", "AI Team", "Dezkareid Design System", "Platzi frontend migration", "Platzi Blog", "Platzi Internationalization", "IBM Carbon Design System". Add a `type` field to each project with values: `personal`, `work`, or `contribution`.
