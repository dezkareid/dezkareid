# Plan: Experiment Page

## Architecture Overview

### How experiment pages work

Experiments are **self-contained Astro pages** under `src/pages/experiments/`. Each experiment file:
1. Exports a typed `metadata` object (the contract defined in the spec).
2. Renders its own full interactive content inside the shared site `Layout`.

The **experiments index page** (`src/pages/experiments/index.astro`) uses Astro's `import.meta.glob` at build time to collect all exported `metadata` objects from sibling experiment pages, then renders the list.

This avoids any content collection or database — adding a new experiment is just adding a new Astro file that exports the right metadata shape.

### Empty state

Since no experiments exist yet, the index page renders an empty state: a message indicating content is "coming very soon". This is shown when the glob returns zero entries.

### Key files

| File | Purpose |
|---|---|
| `src/types/experiment.ts` | Shared `ExperimentMetadata` TypeScript type |
| `src/pages/experiments/index.astro` | Listing page — collects metadata via glob, renders list or empty state |
| `src/pages/experiments/[...slug].astro` | (Future) dynamic route — **not built in this feature**, each experiment is its own static file |
| `src/pages/experiments/<slug>.astro` | One file per experiment (first sample included) |
| `src/components/ExperimentCard.astro` | Card component for the index listing |
| `src/layouts/Layout.astro` | Updated to add `/experiments` nav link |

> Note: Because each experiment is a dedicated Astro page (not a dynamic route), no `[slug].astro` is needed for this feature. Each file at `src/pages/experiments/<slug>.astro` generates its own static route.

### Constraints

- Already on **Astro 6** — no upgrade needed.
- Use `@dezkareid/components` (`Card.astro` wrapper) and design tokens (CSS custom properties) for all UI.
- No new npm dependencies required.

---

## Implementation Phases

### Phase 1 — Type contract

**Goal**: Define the shared TypeScript type for experiment metadata.

- Create `src/types/experiment.ts` exporting `ExperimentMetadata` interface:
  ```ts
  export interface ExperimentMetadata {
    title: string;
    description: string;
    slug: string;
    webApis: string[];
    status: 'experimental' | 'stable' | 'deprecated';
    publishedDate: string; // ISO date
    featured?: boolean;
    order?: number;
  }
  ```

---

### Phase 2 — Experiments index page

**Goal**: Build `/experiments` with empty state and listing logic.

- Create `src/pages/experiments/index.astro`.
- Use `import.meta.glob('../experiments/*.astro', { eager: true })` to collect all `metadata` exports from sibling pages.
- Sort by `order` (ascending, default 0), then `publishedDate` (descending).
- If zero experiments are found, render an **empty state** section:
  - Heading: "Experiments"
  - Message: "Something exciting is brewing. New experiments are coming very soon."
- If experiments exist, render an `ExperimentCard` for each.
- Include JSON-LD `CollectionPage` structured data.
- SEO: `<title>Experiments | ...</title>` + `<meta name="description">`.

---

### Phase 3 — ExperimentCard component

**Goal**: Reusable card for the index listing.

- Create `src/components/ExperimentCard.astro`.
- Props: `experiment: ExperimentMetadata`, `index: number`.
- Wraps the existing `Card.astro` component.
- Displays: title, description, `webApis` tags, status badge.
- Status badge colors:
  - `experimental` → amber/warning tone
  - `stable` → green/success tone
  - `deprecated` → muted/neutral tone
- Links to `/experiments/<slug>`.
- Use CSS custom properties only — no hardcoded colors.

---

### Phase 4 — Sample experiment page

**Goal**: Validate the full end-to-end flow with one real experiment.

- Create `src/pages/experiments/view-transitions-api.astro`.
- Export a valid `metadata` object matching `ExperimentMetadata`.
- Render inside `Layout` with:
  - Header: title, description, status badge, web API tags.
  - Breadcrumb: `← Back to Experiments`.
  - Interactive demo section (a minimal View Transitions API demo).
  - JSON-LD `TechArticle` structured data.

---

### Phase 5 — Navigation

**Goal**: Add `/experiments` to the main site nav.

- Edit `src/layouts/Layout.astro`.
- Add `{ href: '/experiments', label: 'Experiments' }` to the `navLinks` array.
- No homepage changes — experiments are not featured on the index page.

---

### Phase 6 — Sitemap

**Goal**: Ensure experiment pages are included in the sitemap.

- The existing `@astrojs/sitemap` integration auto-discovers all static pages — no changes needed as long as pages are under `src/pages/`.
- Verify `astro.config.mjs` has `sitemap()` configured (read-only check, no change expected).

---

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| Astro 6 | Already installed (`6.0.6`) | No upgrade needed |
| `@dezkareid/components` | Already a dependency | Use `Card.astro` from local components |
| `@dezkareid/design-tokens` | Already a dependency | CSS custom properties for all styling |
| `@astrojs/sitemap` | Already installed | Auto-discovers experiment pages |
| TypeScript 5.9.3 | Already configured | For `ExperimentMetadata` type |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| `import.meta.glob` picks up the index file itself | Glob pattern excludes `index.astro` explicitly: `../experiments/!(index).astro` or filter by checking `metadata` export exists |
| Type safety of glob-collected metadata | Cast via the `ExperimentMetadata` type; each experiment file is responsible for exporting a conformant object |
| CSS token gaps for status badge colors | Use `color-mix` with existing semantic tokens; add `TODO(design-system)` annotations if a dedicated status token is missing |

---

## Out of Scope

- Dynamic `[slug].astro` route (not needed — each experiment is a static file)
- Filtering or search on the index
- A shared interactive sandbox or iframe isolation
- Homepage changes
- Any backend, CMS, or database
