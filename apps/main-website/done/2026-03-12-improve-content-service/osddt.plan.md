# Plan: Improve Content of Service Sections and Projects

## Architecture Overview

All content is managed via Astro content collections (`src/content/services/` and `src/content/projects/`). UI components (`ServiceCard.astro`, `ProjectCard.astro`) read from those collections and render them on `index.astro`. The plan follows a content-first → schema → UI order to avoid broken builds at any intermediate step.

Key technical decisions:
- No new dependencies. Everything is Astro 5 content collections + vanilla CSS.
- `ServiceCard.astro` becomes a dual-action card: the outer wrapper links to `/services/{slug}`, and a secondary "Contact" CTA links to `#contact`. This requires restructuring the card's anchor elements carefully to avoid nested `<a>` tags (invalid HTML). Solution: use the card wrapper as the main link and position the contact CTA as a sibling button with `pointer-events` handled correctly, or use a `<div>` wrapper with `onclick` — preferred approach is CSS-only clickable card via `position: absolute` on the primary link stretched over the card, with the contact CTA sitting above it via `position: relative; z-index`.
- `ProjectCard.astro` becomes a fully clickable card using the same stretched-link pattern.
- The project `[slug].astro` detail page already exists and is driven by the collection — no placeholder pages needed.
- The service `[slug].astro` detail page already exists — no placeholder pages needed either.
- Placeholder images use `https://placehold.co/600x400` with descriptive alt text.

---

## Implementation Phases

### Phase 1 — Content schema updates

**Goal**: extend the Zod schemas so new fields are valid before any content files are touched.

1. In `src/content/config.ts`:
   - Add `cta: z.string().optional()` to `servicesCollection` schema.
   - Add `type: z.enum(['personal', 'work', 'contribution'])` to `projectsCollection` schema.
   - Ensure `image` is already `z.string().optional()` (it is — no change needed).

### Phase 2 — Service content files

**Goal**: rewrite all 6 service markdown files with correct copy, unique icons, sequential order, and a `cta` field.

Services to update (in intended display order):

| # | File | Title | Icon | CTA label |
|---|------|-------|------|-----------|
| 1 | `frontend-as-a-service.md` | Frontend as a Service | 🖥️ | Start a project |
| 2 | `frontend-architecture.md` | Frontend Architecture | 🏗️ | Request an audit |
| 3 | `performance.md` | Web Performance Optimization | ⚡ | Request an audit |
| 4 | `consultory.md` → rename title only | Consulting | 🧭 | Book a call |
| 5 | `mentory.md` → rename title only | Mentoring | 🎓 | Book a session |
| 6 | `speaker.md` | Speaker & Workshops | 🎤 | Send a request |

Each file must have:
- Frontmatter: `title`, `description` (1 punchy sentence), `icon`, `order` (1–6), `cta`
- Body: ## Service Overview (2–3 sentences, benefit-oriented) + ### How it works (bullet list, clean grammar)

### Phase 3 — Project content files

**Goal**: delete the 3 old project files and create 8 new ones.

Delete:
- `ecommerce-ds.md`
- `performance-audit.md`
- `portfolio.md`

Create (slugs derived from titles):

| # | File | Title | Type | Featured | Order |
|---|------|-------|------|----------|-------|
| 1 | `dezkareid-design-system.md` | Dezkareid Design System | personal | true | 1 |
| 2 | `sync-ai-context.md` | Sync AI Context | personal | true | 2 |
| 3 | `ai-team.md` | AI Team | personal | true | 3 |
| 4 | `osddt.md` | Spec-Driven Development Tool | personal | false | 4 |
| 5 | `platzi-frontend-migration.md` | Platzi Frontend Migration | work | false | 5 |
| 6 | `platzi-blog.md` | Platzi Blog | work | false | 6 |
| 7 | `platzi-internationalization.md` | Platzi Internationalization | work | false | 7 |
| 8 | `ibm-carbon-design-system.md` | IBM Carbon Design System | contribution | false | 8 |

Each file must have:
- Frontmatter: `title`, `description` (1–2 sentences), `techStack` (array), `image` (placehold.co URL), `type`, `featured`, `order`
- Body: brief project overview and key outcomes/features

### Phase 4 — ProjectCard.astro UI update

**Goal**: render image, type badge, remove buttons, make card fully clickable.

Changes to `ProjectCard.astro`:
1. Remove `Button` import and `project-links` section entirely.
2. Remove `githubUrl` and `liveUrl` from destructured props (still available on detail page).
3. Add `image` and `type` to destructured props.
4. Add an `<img>` element above `.project-content` for the cover image, wrapped in a `<div class="project-image">`.
5. Add a `<span class="project-type-badge">` inside the card showing the type label.
6. Wrap the entire card in an `<a href={/projects/${project.slug}}>` using the stretched-link pattern (absolute positioned, full coverage) so the card is clickable without nested anchors.
7. Style `.project-image` to render at a fixed aspect ratio (16:9 or 3:2) with `object-fit: cover`.
8. Style `.project-type-badge` with distinct colors per type (using `data-type` attribute + CSS).

### Phase 5 — ServiceCard.astro UI update

**Goal**: make the card link to detail page, add Contact CTA, use `cta` field label.

Changes to `ServiceCard.astro`:
1. Add `cta` to destructured props from `service.data`.
2. Use the stretched-link pattern: add `<a class="card-link" href={/services/${service.slug}}>` absolutely positioned to cover the card.
3. Change the existing `.learn-more` link to a "Contact" CTA pointing to `#contact` — label becomes "Get in touch →". Keep it `position: relative; z-index: 1` so it sits above the stretched link and is independently clickable.
4. Use the `cta` field value as a visible label inside the card body (e.g. "Start a project" displayed as a small text badge or pill above the contact link) to communicate the primary action.

### Phase 6 — index.astro update

**Goal**: show all 6 services on the homepage and add intro text to the projects section.

1. Remove `.slice(0, 3)` from the services query (line 21).
2. The projects section already uses `.slice(0, 3)` on featured projects — keep this as-is since only 3 are marked `featured: true`.
3. Add a `<p class="section-intro">` below the `<h2 class="section-title">` in the projects section with the copy: "Some projects are personal, others are contributions, and others are part of my past work." Style it as muted body text consistent with `--color-base-gray-500` and `--font-size-300`.

---

## Technical Dependencies

| Dependency | Version | Status |
|-----------|---------|--------|
| Astro | 5.x | Already installed |
| `astro:content` | built-in | Already used |
| `zod` | built-in via Astro | Already used |
| `https://placehold.co` | external CDN | No install needed |

No new packages to install.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Nested `<a>` tags (invalid HTML) from stretched-link pattern | Medium | Use `position: absolute; inset: 0` on the primary link, `position: relative; z-index: 1` on secondary CTAs. Validate with `astro check`. |
| `featured` projects on homepage: only 3 of 8 new projects are featured, homepage shows `.slice(0, 3)` — could show 0 if none are marked `featured: true` | Low | Ensure exactly 3 projects have `featured: true` in their frontmatter. |
| placehold.co URLs blocked by CSP | Low | No CSP is configured currently; note in code for future hardening. |
| `type` field missing on existing (deleted) project files breaking build | None | Files are deleted before the schema change lands, so there's no window where old files coexist with the new required field. |

---

## Out of Scope

- Visual redesign of ServiceCard or ProjectCard beyond structural changes.
- Full content for service detail pages (the existing `[slug].astro` renders whatever is in the markdown body).
- Contact forms or booking integrations.
- Changes to the projects or services index pages (`/projects`, `/services`).
- Adding `type` badge to the projects index page or detail page.
