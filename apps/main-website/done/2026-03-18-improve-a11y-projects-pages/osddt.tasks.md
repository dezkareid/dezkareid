# Tasks: Improve Accessibility, SEO, and Performance for Projects Pages

## Phase 1 — Heading Hierarchy

- [x] [S] In `ProjectCard.astro`, change `<h3 class="project-title">` to `<h2 class="project-title">` (no CSS change needed)

**Definition of Done:** The projects index page DOM has h1 → h2 structure with no skipped levels. Verified with browser accessibility tree or validator.

---

## Phase 2 — Mobile Spacing

- [x] [S] In `[slug].astro`, add `padding-inline: var(--spacing-24)` to `.container` and add `@media (min-width: 90rem) { .container { padding-inline: 0; } }` override

**Definition of Done:** On a 375px-wide viewport, individual project pages have visible horizontal padding on both sides. No layout change at desktop widths.

---

## Phase 3 — Touch Target Size

- [x] [S] In `ProjectCard.astro`, add `min-width: 24px; min-height: 24px; padding: var(--spacing-4);` to `.project-link` rule

**Definition of Done:** GitHub, NPM, and Live Demo icon links have a clickable area of at least 24×24px. Visual icon size is unchanged.

---

## Phase 4 — Contrast Fixes

- [x] [M] **4a** — In `ProjectCard.astro`, replace `opacity: 0.75` on `.project-description` with `color: light-dark(#4b5563, #9ca3af)` (~7:1 light, ~7.2:1 dark). Added `TODO(design-system)` for a future `--color-text-secondary` token.
- [x] [M] **4b** — `--color-base-gray-500` (`#6b7280`) is at the 4.5:1 boundary — replaced with `light-dark(#4b5563, #9ca3af)` in `index.astro` `.page-description` and `[slug].astro` `.project-description` for comfortable headroom. Added `TODO(design-system)` annotations in both files.
- [x] [M] **4c** — Verified badge dark-mode colors: `#fcd34d` on near-black (~11.5:1), `#93c5fd` on near-black (~8.5:1), `#86efac` on near-black (~10:1). All pass. Light-mode dark colors also pass. No changes needed.
- [x] [S] **4d** — In `ProjectCard.astro`, replaced `opacity: 0.6` on `.project-link` with `color: var(--color-base-gray-500)`. Removed `opacity` from default rule (combined with Phase 3 edit).

**Dependencies:** 4b should be done after 4a (same elements). 4c and 4d are independent.

**Definition of Done:** All text, badge, and icon colors pass ≥4.5:1 (text) or ≥3:1 (UI components/icons) in both light and dark themes. Verified with browser accessibility checker.

---

## Phase 5 — SEO Meta Tags

- [x] [S] In `index.astro`, pass `description="Explore my portfolio of frontend projects — design systems, performance tooling, and open-source contributions."` to `<Layout>`
- [x] [S] In `[slug].astro`, pass `description={description}` to `<Layout>` (variable already destructured from `project.data`)

**Definition of Done:** Viewing page source for `/projects` shows a unique `<meta name="description">` tag. Viewing any `/projects/[slug]` page source shows the project's own description in the meta tag and in `og:description`.

---

## Dependencies Summary

```
Phase 1 → independent
Phase 2 → independent
Phase 3 → independent
Phase 4a → independent (do before 4b)
Phase 4b → after 4a
Phase 4c → independent
Phase 4d → independent
Phase 5 → independent
```

All phases can be implemented in parallel except 4b which should follow 4a.
