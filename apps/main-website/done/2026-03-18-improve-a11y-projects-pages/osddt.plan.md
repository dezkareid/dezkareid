# Plan: Improve Accessibility, SEO, and Performance for Projects Pages

## Architecture Overview

All changes are isolated to three files in `apps/main-website/src/`:

- `pages/projects/index.astro` — projects index page
- `pages/projects/[slug].astro` — individual project page
- `components/ProjectCard.astro` — project card component used by the index

The `Layout.astro` already handles canonical URL, Open Graph, Twitter cards, and meta description via props — so SEO improvements only require passing the right values from the page components. No new files or dependencies are needed.

### Key observations from current code

| Issue | Location | Current state |
|---|---|---|
| `h3` used for card titles | `ProjectCard.astro:54` | Skips h2 — must change to `h2` |
| `.project-description` opacity 0.75 | `ProjectCard.astro:216` | May fail contrast at 75% of text color |
| `.page-description` uses `--color-base-gray-500` | `index.astro:59` | `#6b7280` = ~4.6:1 — at boundary; replaced with `light-dark(#4b5563, #9ca3af)` |
| `.project-description` on slug page uses `--color-base-gray-500` | `[slug].astro:111` | Same — same fix applied |
| Icon links are 1.25rem SVG, no padding | `ProjectCard.astro:261–279` | ~20px — below 24px minimum |
| `[slug].astro` container has no `padding-inline` | `[slug].astro:87–90` | Content touches viewport on mobile |
| Index page SEO: generic description | `index.astro:11` | No custom description passed to Layout |
| Slug page SEO: no description passed | `[slug].astro:21` | Falls back to site default |
| Badge colors: `light-dark(#1d4ed8, #93c5fd)` etc. | `ProjectCard.astro:186–203` | Needs contrast verification against badge bg |
| Images: already have `loading="lazy"` and dimensions | `ProjectCard.astro:36–47` | ✓ Already compliant |

---

## Implementation Phases

### Phase 1 — Heading Hierarchy

**File:** `components/ProjectCard.astro`

- Change `<h3 class="project-title">` → `<h2 class="project-title">` (line 54)
- No style change needed — the CSS class targets `.project-title`, not the tag name

**Rationale:** The index page has an `h1` and then immediately uses `h3` in cards, skipping `h2`. Individual project pages are unaffected (their `h2` content headings come from markdown).

---

### Phase 2 — Mobile Spacing (Slug Page)

**File:** `pages/projects/[slug].astro`

- Add `padding-inline: var(--spacing-24)` to the `.container` rule (line 87–90)
- Add a `@media (min-width: 90rem)` override to remove it at large viewports (matching the pattern used in `index.astro` and `Layout.astro`)

**Rationale:** The index page and Layout already add `padding-inline: var(--spacing-24)` to their containers and remove it at 90rem. The slug page container is missing this entirely, causing content to reach the viewport edge on narrow screens.

---

### Phase 3 — Touch Target Size (Icon Links)

**File:** `components/ProjectCard.astro`

- On `.project-link`, add `min-width: 24px; min-height: 24px; padding: var(--spacing-4)` to increase the clickable area to ≥ 24×24px without enlarging the visual icon
- The `display: flex; align-items: center; justify-content: center` is already present, so padding will expand the target symmetrically

**Rationale:** SVG icons are `1.25rem` (~20px). Adding `padding: var(--spacing-4)` (4px each side) expands the hit area to ~28px, meeting WCAG 2.5.8.

---

### Phase 4 — Contrast Fixes

**File:** `components/ProjectCard.astro` and `pages/projects/[slug].astro`

#### 4a. Project card description opacity — **implemented**
- Removed `opacity: 0.75` from `.project-description` in `ProjectCard.astro`
- Set `color: light-dark(#4b5563, #9ca3af)` — ~7:1 light, ~7.2:1 dark
- Added `TODO(design-system)` annotation for a future `--color-text-secondary` token

#### 4b. `--color-base-gray-500` on descriptions — **implemented**
- `#6b7280` on `#ffffff`/`#000000` = ~4.6:1 — technically passes but is at the boundary
- Replaced with `light-dark(#4b5563, #9ca3af)` in `index.astro` `.page-description` and `[slug].astro` `.project-description`
- Added `TODO(design-system)` annotations in both files

#### 4c. Badge contrast — **verified, no changes needed**
- `personal` dark: `#93c5fd` on near-black → ~8.5:1 ✓
- `work` dark: `#86efac` on near-black → ~10:1 ✓
- `contribution` dark: `#fcd34d` on near-black → ~11.5:1 ✓
- All light-mode dark colors pass as well

#### 4d. Icon link opacity — **implemented**
- Removed `opacity: 0.6` from `.project-link` default state
- Set `color: var(--color-base-gray-500)` as explicit resting color (~4.6:1, meets 3:1 UI component threshold)
- Kept `opacity: 1` in `:hover` rule for transition effect

---

### Phase 5 — SEO Meta Tags

**File:** `pages/projects/index.astro`

- Pass a `description` prop to `<Layout>` with a descriptive string specific to the projects listing, e.g.: `"Explore my portfolio of frontend projects — design systems, performance tooling, and open-source contributions."`
- The `title` is already `"Projects | Frontend Developer Portfolio"` — this is acceptable
- The Layout already handles canonical URL and Open Graph from these props — no further changes needed

**File:** `pages/projects/[slug].astro`

- Pass `description={description}` to `<Layout>` (the project's own description is already destructured at line 17)
- The `title` already uses `${title} | Projects` — acceptable
- Layout already handles OG tags — no further changes needed

---

## Data Schema

### JSON-LD Structured Data

**`pages/projects/index.astro`** — `CollectionPage` injected into `<head>` via `slot="head"`:
```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Projects",
  description: "...",
  url: new URL("/projects", Astro.site).toString(),
  author: { "@type": "Person", name: "...", url: Astro.site },
};
```

**`pages/projects/[slug].astro`** — `SoftwareSourceCode`:
```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: title,
  description,
  url: new URL(`/projects/${project.slug}`, Astro.site).toString(),
  ...(githubUrl && { codeRepository: githubUrl }),
  ...(liveUrl && { installUrl: liveUrl }),
  programmingLanguage: techStack,
  author: { "@type": "Person", name: "...", url: Astro.site },
};
```

Both use `Astro.site` for absolute URLs. `codeRepository` and `installUrl` are conditionally emitted.

## Technical Dependencies

- No new packages or dependencies required
- All fixes use existing design tokens (`--spacing-*`, `--color-*`, `--font-*`)
- CSS `color-mix()` and `light-dark()` are already in use — browser support is already assumed

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Changing `h3` → `h2` in `ProjectCard` affects any page that uses `ProjectCard` outside the projects index | Check all usages of `ProjectCard` — currently only used in `pages/projects/index.astro`, so safe |
| Gray-500 token at contrast boundary | **Resolved** — replaced with `light-dark(#4b5563, #9ca3af)` giving ~7:1 in both themes. Flagged for design system token. |
| Badge dark-mode `#fcd34d` contribution color | **Verified passing** — `#fcd34d` on near-black = ~11.5:1. No change needed. |
| Adding `padding-inline` to slug container could affect layout at wide widths | Mirror the `@media (min-width: 90rem) { padding-inline: 0 }` override already used in `index.astro` |

## Out of Scope

- Changes to any pages other than `/projects` and `/projects/[slug]`
- Redesigning the visual appearance or layout
- Adding new components or packages
- Site-wide SEO or performance audit
- Fixing audit issues not listed in the spec
