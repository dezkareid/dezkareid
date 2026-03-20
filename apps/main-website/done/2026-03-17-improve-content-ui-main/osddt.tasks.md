# Task List: Improve Content, UI, and Accessibility of Main Page, Projects, and Services

## Dependencies

```
Phase 1 → Phase 2 → Phase 5
Phase 3 → Phase 6
Phase 2, 3 → Phase 7
Phase 7 → Phase 8
Phase 5, 6 → Phase 9
Phase 9 → Phase 10
```

---

## Phase 1 — Content schema extension

> **Definition of Done**: `src/content/config.ts` compiles without errors and `npmUrl` is accepted in project frontmatter without TypeScript warnings.

- [x] [S] Add `npmUrl: z.string().url().optional()` to `projectsCollection` schema in `src/content/config.ts`

---

## Phase 2 — Project content updates

> **Definition of Done**: All 8 project `.md` files have correct `featured`, `order`, external link fields (`githubUrl`, `liveUrl`, `npmUrl`), and improved impact-focused descriptions. Image fields still point to placeholders (will be replaced in Phase 4).
> **Depends on**: Phase 1

- [x] [S] Update `dezkareid-design-system.md`: set `featured: true`, `order: 1`, add `githubUrl`, rewrite description for impact
- [x] [S] Update `sync-ai-context.md`: set `featured: true`, `order: 2`, add `npmUrl`, rewrite description for impact
- [x] [S] Update `platzi-frontend-migration.md`: set `featured: true`, `order: 3`, add `liveUrl: https://platzi.com/`, rewrite description for impact
- [x] [S] Update `ai-team.md`: set `featured: false`, `order: 4`, add `npmUrl`, rewrite description for impact
- [x] [S] Update `osddt.md`: set `featured: false`, `order: 5`, add `npmUrl`, rewrite description for impact
- [x] [S] Update `platzi-blog.md`: set `featured: false`, `order: 6`, add `liveUrl: https://platzi.com/blog/`, rewrite description for impact
- [x] [S] Update `platzi-internationalization.md`: set `featured: false`, `order: 7`, add `liveUrl: https://platzi.com/`, rewrite description for impact
- [x] [S] Update `ibm-carbon-design-system.md`: set `featured: false`, `order: 8`, add `githubUrl`, rewrite description for impact

---

## Phase 3 — Service content updates

> **Definition of Done**: All 6 service `.md` files have outcome-focused descriptions, correct `cta` labels, and a "Who this is for" section in the body.

- [x] [S] Update `frontend-as-a-service.md`: rewrite description (outcome: production-ready frontend, team stays focused), set `cta: "Start a project"`, add "Who this is for" body section
- [x] [S] Update `frontend-architecture.md`: rewrite description (outcome: scalable auditable architecture), set `cta: "Request an audit"`, add "Who this is for" body section
- [x] [S] Update `web-performance.md`: rewrite description (outcome: measurable Core Web Vitals improvements), set `cta: "Request an audit"`, add "Who this is for" body section
- [x] [S] Update `consulting.md`: rewrite description (outcome: tech strategy aligned to business goals), set `cta: "Book a call"`, add "Who this is for" body section
- [x] [S] Update `mentoring.md`: rewrite description (outcome: career clarity + accelerated growth), set `cta: "Book a session"`, add "Who this is for" body section
- [x] [S] Update `speaker-workshops.md`: rewrite description (outcome: knowledge shared at your event/team), set `cta: "Send a request"`, add "Who this is for" body section

---

## Phase 5 — ProjectCard component: links + local images

> **Definition of Done**: Project cards show GitHub/npm/live links inline, all external links open in new tab with `rel="noopener noreferrer"`, all new CSS uses design tokens only.
> **Depends on**: Phase 2 (link fields)

- [x] [M] Destructure `githubUrl`, `liveUrl`, `npmUrl` from `project.data` and add a `project-links` row to the card with icon links for each available URL
- [x] [S] Ensure each external link has `target="_blank"`, `rel="noopener noreferrer"`, and a descriptive `aria-label` (e.g., "View Dezkareid Design System on GitHub")
- [x] [S] Set `z-index: 2` on project link elements so they sit above the stretched card link
- [x] [S] Style the `project-links` row using `var(--*)` tokens only; add `TODO(design-system)` annotations where tokens are missing

---

## Phase 6 — ServiceCard component: UX improvements

> **Definition of Done**: Service card CTA navigates to the detail page. A secondary "Get in touch" link still scrolls to `#contact`. Services index shows a visual separator between delivery and support services. All CSS uses design tokens.
> **Depends on**: Phase 3 (service content with correct `cta` labels)

- [x] [M] Change primary CTA button to navigate to `/services/${service.slug}` instead of scrolling to `#contact`.
- [x] [S] Add a secondary "Get in touch →" text link below the CTA button that scrolls to `#contact`.
- [x] [M] Update `src/pages/services/index.astro`: add visual categories (Delivery vs Strategic Support) with separators.
- [x] [S] Verify all new/modified styles in `ServiceCard.astro` use `var(--*)` tokens.

---

## Phase 7 — Homepage copy

> **Definition of Done**: Hero title and subtitle lead with companies/teams. Presentation quote is specific and first-person. Featured projects section surfaces Platzi Frontend Migration + Design System + Sync AI Context. Section eyebrows are visually consistent.
> **Depends on**: Phase 2 (featured/order fields set correctly)

- [x] [M] Rewrite hero title in `src/pages/index.astro`: replace "Crafting frontend product experiences." with a value proposition that names the outcome for companies/teams.
- [x] [S] Rewrite hero subtitle: mention companies/teams first.
- [x] [M] Rewrite the presentation quote block: specific first-person statement.
- [x] [S] Rewrite the featured projects section intro sentence.
- [x] [x] Audit section eyebrow labels (Expertise, Capabilities, Evidence, Inquiry) for consistency.

---

## Phase 8 — About page copy rewrite

> **Definition of Done**: About page copy is specific, first-person, and contains no filler phrases. Avatar and skills section are unchanged.
> **Depends on**: Phase 7 (positioning decisions locked in)

- [x] [M] Rewrite paragraph 1 in `src/pages/about.astro`: specific background.
- [x] [M] Rewrite paragraph 2: development philosophy.
- [x] [S] Replace paragraph 3 with focus on AI and developer workflows.

---

## Phase 9 — Detail pages: heading structure + accessibility

> **Definition of Done**: Heading hierarchy is H1 → H2 on all detail pages. Breadcrumb links have accessible labels. Service detail pages have `aria-label` on the inquiry button.
> **Depends on**: Phase 5 (project card links), Phase 6 (service card UX)

- [x] [S] Audit `src/pages/projects/[slug].astro`: verify H1 → H2 hierarchy; add `aria-label` to breadcrumb.
- [x] [S] Audit `src/pages/services/[slug].astro`: verify H1 → H2 hierarchy; add `aria-label="Inquire about {title}"` to the inquiry button.

---

## Phase 10 — Global accessibility pass

> **Definition of Done**: All interactive elements have visible `:focus-visible` rings. Social links have descriptive `aria-label`. Theme toggle announces current state. Nav has `aria-current="page"`. No `<img>` is missing `alt`.
> **Depends on**: Phase 9

- [x] [S] Add global `:focus-visible` rule to `src/styles/global.css`.
- [x] [S] Add descriptive `aria-label` to each social link in `src/components/SocialLinks.astro`.
- [x] [S] Verify dynamic `aria-label` in theme toggle `ThemeToggle.astro`.
- [x] [S] Verify `aria-current="page"` in `Layout.astro`.
- [x] [S] Audit `alt` text on all `<img>` tags.
