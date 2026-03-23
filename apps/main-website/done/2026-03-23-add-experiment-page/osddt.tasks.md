# Tasks: Experiment Page

## Phase 1 — Type Contract

- [x] [S] Create `src/types/experiment.ts` with the `ExperimentMetadata` interface (`title`, `description`, `slug`, `webApis`, `status`, `publishedDate`, `featured`, `order`)

**Definition of Done**: `ExperimentMetadata` is importable from `src/types/experiment.ts` and TypeScript compiles without errors.

---

## Phase 2 — Experiments Index Page

> Depends on: Phase 1

- [x] [M] Create `src/pages/experiments/index.astro` that collects experiment metadata via `import.meta.glob`, sorts by `order` then `publishedDate`, and renders either an `ExperimentCard` list or an empty state
- [x] [S] Implement the empty state UI: heading "Experiments" + "Something exciting is brewing. New experiments are coming very soon." message
- [x] [S] Add JSON-LD `CollectionPage` structured data to the index page
- [x] [S] Set correct `<title>` and `<meta name="description">` on the index page

**Definition of Done**: `/experiments` renders the empty state when no experiment files exist; shows the list when experiments are present. JSON-LD is valid.

---

## Phase 3 — ExperimentCard Component

> Depends on: Phase 1

- [x] [M] Create `src/components/ExperimentCard.astro` wrapping `Card.astro`, displaying title, description, `webApis` tags, and status badge, linking to `/experiments/<slug>`
- [x] [S] Style the status badge using CSS custom properties only (`experimental` → amber, `stable` → green, `deprecated` → muted); add `TODO(design-system)` annotations where tokens are missing

**Definition of Done**: Card renders all metadata fields correctly; status badge color changes per status value; no hardcoded colors.

---

## Phase 4 — Sample Experiment Page

> Depends on: Phase 1, Phase 2, Phase 3

- [x] [M] Create `src/pages/experiments/view-transitions-api.astro` exporting a valid `ExperimentMetadata` object and rendering inside `Layout` with title, description, status badge, web API tags, and a breadcrumb back to `/experiments`
- [x] [S] Build a minimal interactive View Transitions API demo within the page (e.g. a button that triggers a view transition between two states)
- [x] [S] Add JSON-LD `TechArticle` structured data to the experiment detail page

**Definition of Done**: Visiting `/experiments/view-transitions-api` renders the full page with metadata and a working demo. The experiment appears in the index listing. JSON-LD is valid.

---

## Phase 5 — Navigation

> Depends on: Phase 2

- [x] [S] Add `{ href: '/experiments', label: 'Experiments' }` to the `navLinks` array in `src/layouts/Layout.astro`

**Definition of Done**: "Experiments" link appears in the site header and is marked `aria-current="page"` when on any `/experiments` route.

---

## Phase 6 — Sitemap Verification

> Depends on: Phase 4

- [x] [S] Verify `astro.config.mjs` includes the `sitemap()` integration; confirm experiment pages will be auto-discovered (no code change expected)

**Definition of Done**: `sitemap()` is confirmed present. No action needed if already configured.

---

## Dependencies

```
Phase 1
  └── Phase 2
  └── Phase 3
        └── Phase 4
              └── Phase 6
  └── Phase 5 (can start after Phase 2)
```

Phase 3 and Phase 2 can be developed in parallel after Phase 1 is complete.
