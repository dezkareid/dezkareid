# Implementation Plan: Improve Content, UI, and Accessibility of Main Page, Projects, and Services

## Architecture Overview

The website is an Astro 5 static site in a pnpm monorepo. All visual tokens are CSS custom properties imported from `@dezkareid/design-tokens/dist/css/variables.css` — no hardcoded colors or spacing values. Content lives in Astro content collections (`src/content/projects/`, `src/content/services/`).

**Key technical decisions:**

- **Image generation and Cloudinary**: Deferred to a separate session. Platzi screenshot images are stored as local `public/` assets. Other projects retain placeholder images.
- **Design tokens**: All new/modified CSS must use only `var(--*)` tokens from `@dezkareid/design-tokens`. Where a token does not exist, add a `// TODO(design-system): needs token for <x>` annotation.
- **Content schema**: The existing `githubUrl` and `liveUrl` frontmatter fields in the projects schema are already defined. A new `npmUrl` field will be added to support npm links. `ServiceCard` already links to the detail page via a stretched link — the CTA button will be changed to link to the detail page explicitly rather than scrolling to `#contact`.
- **Featured projects**: Updated via the `featured: true` + `order` frontmatter fields (no component changes needed, just content file edits).
- **Accessibility**: Implemented directly in Astro component markup — no new JS, no new libraries.

---

## Implementation Phases

### Phase 1 — Content schema extension

**Goal**: Add `npmUrl` field to the projects content schema so npm package links can be stored in frontmatter alongside existing `githubUrl` and `liveUrl`.

**Files:**
- `src/content/config.ts` — add `npmUrl: z.string().url().optional()` to `projectsCollection` schema

---

### Phase 2 — Project content updates (frontmatter + links)

**Goal**: Update all 8 project `.md` files with correct external links, improved descriptions, updated `featured`/`order` fields, and local image paths for Platzi projects.

**Changes per project:**

| Project | `featured` | `order` | `githubUrl` | `liveUrl` | `npmUrl` | Image source |
|---|---|---|---|---|---|---|
| Dezkareid Design System | `true` | 1 | `https://github.com/dezkareid/dezkareid/tree/main/design-system` | — | — | Placeholder (deferred) |
| Sync AI Context | `true` | 2 | — | — | `https://www.npmjs.com/package/@dezkareid/ai-context-sync` | Placeholder (deferred) |
| Platzi Frontend Migration | `true` | 3 | — | `https://platzi.com/` | — | Local screenshot |
| AI Team | `false` | 4 | — | — | `https://www.npmjs.com/package/@dezkareid/ai-team` | Placeholder (deferred) |
| OSDDT | `false` | 5 | — | — | `https://www.npmjs.com/package/@dezkareid/osddt` | Placeholder (deferred) |
| Platzi Blog | `false` | 6 | — | `https://platzi.com/blog/` | — | Local screenshot |
| Platzi Internationalization | `false` | 7 | — | `https://platzi.com/` | — | Placeholder (deferred) |
| IBM Carbon Design System | `false` | 8 | `https://github.com/carbon-design-system/carbon` | — | — | Placeholder (deferred) |

**Files:**
- `src/content/projects/dezkareid-design-system.md`
- `src/content/projects/sync-ai-context.md`
- `src/content/projects/platzi-frontend-migration.md`
- `src/content/projects/ai-team.md`
- `src/content/projects/osddt.md`
- `src/content/projects/platzi-blog.md`
- `src/content/projects/platzi-internationalization.md`
- `src/content/projects/ibm-carbon-design-system.md`

---

### Phase 3 — Service content updates

**Goal**: Rewrite service descriptions to lead with the outcome and target audience. Update `cta` labels to be action-oriented and consistent.

**Changes:**

| Service | New description focus | CTA label |
|---|---|---|
| Frontend as a Service | Outcome: production-ready frontend, your team stays focused | "Start a project" |
| Frontend Architecture | Outcome: scalable, auditable architecture for growing teams | "Request an audit" |
| Web Performance | Outcome: measurable Core Web Vitals improvements | "Request an audit" |
| Consulting | Outcome: technology strategy aligned to business goals | "Book a call" |
| Mentoring | Outcome: career clarity and accelerated skill growth | "Book a session" |
| Speaker & Workshops | Outcome: knowledge shared at your event or team | "Send a request" |

**Files:**
- `src/content/services/frontend-as-a-service.md`
- `src/content/services/frontend-architecture.md`
- `src/content/services/web-performance.md`
- `src/content/services/consulting.md`
- `src/content/services/mentoring.md`
- `src/content/services/speaker-workshops.md`

---

### Phase 5 — ProjectCard component: links + local images

**Goal**: Surface external links directly on project cards and ensure accessible link labels.

**Changes to `src/components/ProjectCard.astro`:**
- Accept `githubUrl`, `liveUrl`, `npmUrl` from `project.data`
- Add a `project-links` row at the bottom of the card with icon+label links for each available URL
- Each link: `target="_blank" rel="noopener noreferrer"`, `aria-label` with descriptive text, `z-index: 2` to sit above the stretched card link
- All new styles use `var(--*)` tokens only

**Files:**
- `src/components/ProjectCard.astro`

---

### Phase 6 — ServiceCard component: UX improvements

**Goal**: Improve service card scannability, make the CTA link to the service detail page (not just scroll to contact), and visually group delivery vs support services on the index page.

**Changes to `src/components/ServiceCard.astro`:**
- Change `data-contact-btn` behavior: primary CTA button now navigates to `/services/${service.slug}` (the detail page). The scroll-to-contact JS is removed from the card; contact is available on the detail page.
- Add a secondary "Get in touch" text link below the CTA that still scrolls to `#contact`, so the contact path is not lost
- Keep the stretched link that already covers the card
- Ensure CTA label text comes from the `cta` frontmatter field (already does; just ensure all services have it set in Phase 3)
- All styles use `var(--*)` tokens

**Changes to `src/pages/services/index.astro`:**
- Add a visual divider or section label between "delivery" services (orders 1–3) and "support" services (orders 4–6) — implemented as a heading or separator element with consistent eyebrow styling

**Files:**
- `src/components/ServiceCard.astro`
- `src/pages/services/index.astro`

---

### Phase 7 — Homepage content and copy

**Goal**: Rewrite hero, presentation quote, and section copy to reflect Joel's actual positioning (companies/teams as primary audience, mentoring as secondary).

**Changes:**
- **Hero title**: Replace "Crafting frontend product experiences." with a clearer value proposition leading with who Joel helps and what outcome they get.
- **Hero subtitle**: Rewrite to mention companies/teams first, mentoring second.
- **Presentation quote**: Replace generic bio with a specific, first-person statement about Joel's approach and what he values.
- **Services section eyebrow/title**: Keep "Services" but ensure eyebrow label is consistent with other sections.
- **Projects section intro**: Replace "Some projects are personal, others are contributions..." with a line that frames the projects as evidence of range and depth.
- **Featured projects**: Verify the `featured: true` + `order` fields updated in Phase 2 now surface Platzi Frontend Migration, Design System, Sync AI Context as the top 3.

**Files:**
- `src/pages/index.astro`

---

### Phase 8 — About page copy rewrite

**Goal**: Replace generic bio copy with a specific, first-person account of Joel's background and work philosophy. No filler language.

**Changes:**
- Rewrite the 3 paragraphs in `src/pages/about.astro` with specific, first-person content
- Keep the circular avatar as-is
- Keep the "My Technical Expertise" skills section and its lean list (per Decision 5)

**Files:**
- `src/pages/about.astro`

---

### Phase 9 — Projects and services detail pages: copy + heading structure

**Goal**: Ensure heading hierarchy is correct on detail pages, and that service detail pages clearly state who the service is for.

**Changes to `src/pages/projects/[slug].astro`:**
- Verify H1 → H2 hierarchy in rendered markdown content
- Ensure breadcrumb link has accessible label

**Changes to `src/pages/services/[slug].astro`:**
- Verify H1 → H2 hierarchy
- Ensure "Inquire About This Service" button has descriptive `aria-label` including the service name
- Add a "Who this is for" line to each service detail (handled via content file edits, not template changes)

**Files:**
- `src/pages/projects/[slug].astro`
- `src/pages/services/[slug].astro`
- All 6 service `.md` files (add "Who this is for" section if missing)

---

### Phase 10 — Global accessibility pass

**Goal**: Bring all pages to WCAG 2.2 AA. Address focus indicators, ARIA labels, icon-only elements, and color contrast.

**Changes:**

- **Focus indicators** (`src/styles/global.css`): Add a global `:focus-visible` rule using `var(--color-primary)` outline, ensuring it applies to all interactive elements.
- **SocialLinks** (`src/components/SocialLinks.astro`): Each `<a>` must have a descriptive `aria-label` (e.g., `aria-label="Joel on GitHub"`).
- **ThemeToggle** (`src/components/ThemeToggle.astro`): Add `aria-label` that reflects current state (e.g., "Switch to dark mode") and update it on toggle via the existing JS.
- **Navigation** (`src/layouts/Layout.astro`): Add `aria-current="page"` to the active nav link. Ensure nav `<ul>` has appropriate role.
- **ProjectCard badge contrast**: The `light-dark()` color pairs already set in Phase 5 must be verified to meet 4.5:1.
- **Alt text audit**: Check all `<img>` tags across all pages and components for meaningful `alt` attributes.

**Files:**
- `src/styles/global.css`
- `src/components/SocialLinks.astro`
- `src/components/ThemeToggle.astro`
- `src/layouts/Layout.astro`
- `src/components/Hero.astro` (avatar alt text)

---

## Technical Dependencies

| Dependency | Purpose | How used |
|---|---|---|
| `@dezkareid/design-tokens` | CSS custom properties | Already in use. All new CSS must reference its tokens exclusively. |
| `@dezkareid/components` | Button, Card, etc. | Already in use. No changes to the design system packages. |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Content rewrite sounds AI-generated / impersonal | Medium | Write copy in Joel's voice using first-person, specific facts. Avoid adjectives without referents. Review against the "no filler" acceptance criterion before finalising. |
| `npmUrl` schema addition causes TypeScript errors in components that destructure `project.data` | Low | Declare as `optional()` in Zod schema; components check for presence before rendering. |
| Service CTA change (detail page instead of scroll-to-contact) breaks existing user flow | Low | Keep a secondary "Get in touch" text link on each service card that still scrolls to `#contact`. |

---

## Out of Scope

- Adding new pages or routes
- Adding new projects or services content entries
- Redesigning the navigation or header
- Changing the overall grid/layout structure
- Adding new animations or transitions
- Expanding the skills list
- Backend, CMS, or API changes
- Mobile hamburger menu implementation
- Internationalization of site copy
