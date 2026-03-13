# Tasks: Improve Content of Service Sections and Projects

> Feature: `improve-content-service`
> Working directory: `apps/main-website/working-on/improve-content-service/`

---

## Phase 1 — Content schema updates

> **Must complete before Phases 2, 3, 4, 5.**

- [x] [S] Add `cta: z.string().optional()` to `servicesCollection` schema in `src/content/config.ts`
- [x] [S] Add `type: z.enum(['personal', 'work', 'contribution'])` to `projectsCollection` schema in `src/content/config.ts`

**Definition of Done**: `pnpm astro check` passes with no type errors after schema changes and before any content files are modified.

---

## Phase 2 — Service content files

> **Depends on Phase 1.**

- [x] [M] Rewrite `frontend-as-a-service.md` — title "Frontend as a Service", icon 🖥️, order 1, cta "Start a project", copy-edited overview + how it works
- [x] [M] Rewrite `frontend-architecture.md` — title "Frontend Architecture", icon 🏗️, order 2, cta "Request an audit", copy-edited overview + how it works
- [x] [M] Rewrite `performance.md` — title "Web Performance Optimization", icon ⚡, order 3, cta "Request an audit", copy-edited overview + how it works
- [x] [M] Rewrite `consultory.md` — title "Consulting", icon 🧭, order 4, cta "Book a call", copy-edited overview + how it works
- [x] [M] Rewrite `mentory.md` — title "Mentoring", icon 🎓, order 5, cta "Book a session", copy-edited overview + how it works
- [x] [M] Rewrite `speaker.md` — title "Speaker & Workshops", icon 🎤, order 6, cta "Send a request", copy-edited overview + how it works

**Definition of Done**: All 6 service files have `title`, `description`, `icon`, `order`, `cta` in frontmatter. Descriptions are one clear sentence. Body copy is grammatically correct and benefit-oriented. `pnpm astro check` passes.

---

## Phase 3 — Project content files

> **Depends on Phase 1. Can run in parallel with Phase 2.**

- [x] [S] Delete `src/content/projects/ecommerce-ds.md`
- [x] [S] Delete `src/content/projects/performance-audit.md`
- [x] [S] Delete `src/content/projects/portfolio.md`
- [x] [M] Create `dezkareid-design-system.md` — type: personal, featured: true, order: 1, placeholder image, tech stack, 1–2 sentence description, body overview
- [x] [M] Create `sync-ai-context.md` — type: personal, featured: true, order: 2, placeholder image, tech stack, 1–2 sentence description, body overview
- [x] [M] Create `ai-team.md` — type: personal, featured: true, order: 3, placeholder image, tech stack, 1–2 sentence description, body overview
- [x] [M] Create `osddt.md` — type: personal, featured: false, order: 4, placeholder image, tech stack, 1–2 sentence description, body overview
- [x] [M] Create `platzi-frontend-migration.md` — type: work, featured: false, order: 5, placeholder image, tech stack, 1–2 sentence description, body overview
- [x] [M] Create `platzi-blog.md` — type: work, featured: false, order: 6, placeholder image, tech stack, 1–2 sentence description, body overview
- [x] [M] Create `platzi-internationalization.md` — type: work, featured: false, order: 7, placeholder image, tech stack, 1–2 sentence description, body overview
- [x] [M] Create `ibm-carbon-design-system.md` — type: contribution, featured: false, order: 8, placeholder image, tech stack, 1–2 sentence description, body overview

**Definition of Done**: 3 old files deleted, 8 new files present. Each new file has all required frontmatter fields including `type` and `image`. Exactly 3 projects have `featured: true`. `pnpm astro check` passes.

---

## Phase 4 — ProjectCard.astro UI update

> **Depends on Phase 3 (needs `type` and `image` fields populated in content).**

- [x] [S] Remove `Button` import and `project-links` div from `ProjectCard.astro`
- [x] [S] Remove `githubUrl` and `liveUrl` from destructured props in `ProjectCard.astro`
- [x] [S] Add `image` and `type` to destructured props in `ProjectCard.astro`
- [x] [M] Add `<div class="project-image"><img /></div>` above `.project-content`, with `object-fit: cover` and a fixed aspect ratio (3:2)
- [x] [M] Add `<span class="project-type-badge" data-type={type}>` displaying the type label inside the card
- [x] [M] Implement stretched-link pattern: add `<a class="card-link" href={/projects/${project.slug}}>` absolutely positioned over the full card
- [x] [S] Style `.project-type-badge` with distinct colors per `data-type` value (`personal`, `work`, `contribution`) using CSS custom properties

**Definition of Done**: Project cards show an image, a type badge, and no buttons. Clicking anywhere on the card navigates to `/projects/{slug}`. No nested `<a>` tags. Badge colors are visually distinct per type.

---

## Phase 5 — ServiceCard.astro UI update

> **Depends on Phase 2 (needs `cta` field in content).**

- [x] [S] Add `cta` to destructured props from `service.data` in `ServiceCard.astro`
- [x] [M] Implement stretched-link pattern: add `<a class="card-link" href={/services/${service.slug}}>` absolutely positioned over the full card
- [x] [M] Replace the existing `.learn-more` link with a "Get in touch →" contact CTA pointing to `#contact`, styled `position: relative; z-index: 1`
- [x] [S] Display the `cta` field value as a visible label in the card body (e.g. as a small pill or text above the contact CTA)

**Definition of Done**: Each service card is fully clickable to its detail page. A "Get in touch →" CTA pointing to `#contact` is independently clickable. The per-service `cta` label is visible. No nested `<a>` tags.

---

## Phase 6 — index.astro update

> **Depends on Phases 2 and 3 (content must be in place). Can run in parallel with Phases 4 and 5.**

- [x] [S] Remove `.slice(0, 3)` from the services collection query so all 6 services display
- [x] [S] Add `<p class="section-intro">` below the projects `<h2 class="section-title">` with copy: "Some projects are personal, others are contributions, and others are part of my past work."
- [x] [S] Style `.section-intro` as muted body text (`color: var(--color-base-gray-500)`, `font-size: var(--font-size-300)`)

**Definition of Done**: Homepage shows all 6 service cards. Projects section header includes the intro sentence. Layout is visually clean at all breakpoints.

---

## Dependencies Summary

```
Phase 1
  ├── Phase 2 (services schema needed for cta field)
  │     └── Phase 5 (ServiceCard needs cta in content)
  └── Phase 3 (projects schema needed for type field)
        └── Phase 4 (ProjectCard needs type + image in content)

Phase 2 + Phase 3 → Phase 6 (content must exist before homepage query changes)
```

## Final Verification

- [x] [S] Run `pnpm astro check` — no type errors (verified via `astro build` — 18 pages built successfully)
- [x] [M] Visual review done — contrast improved, contact CTA is a functional button, presentation section redesigned as centered quote
- [x] [S] Presentation section simplified by user to plain centered `<p>` with inline quote marks; unused decorator styles removed
