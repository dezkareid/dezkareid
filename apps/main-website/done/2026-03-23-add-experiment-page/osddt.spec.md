# Spec: Experiment Page

## Overview

The Experiments section is a dedicated area of the personal website where visitors can discover and explore interactive demonstrations of new and experimental web APIs. The intent is to engage the developer audience with fresh, hands-on content that showcases cutting-edge browser capabilities — reinforcing the site's reputation as a forward-thinking frontend resource and strengthening professional visibility.

It consists of two surfaces:
- **Experiments index page** — a browsable list of all available experiments.
- **Experiment detail page** — a standalone page for each experiment with its full description, context, and interactive content.

## Business Context

### Alignment with Company Outcomes

| Outcome | Alignment |
|---|---|
| **Innovation & Growth** | Live, interactive experiment pages showcase cutting-edge browser capabilities, directly increasing professional visibility and reputation — contributing to the 20% lead generation target for consulting/development/mentoring services. |
| **High-Quality User Experience** | Pages must be performant and accessible, consistent with the "High Quality" performance rating target and the 100% accessibility compliance requirement. |
| **Native Discoverability** | Experiments are discoverable via search engines through semantic HTML and structured data, supporting organic discoverability goals. |
| **Efficiency & Velocity** | Each experiment is a self-contained Astro page with a defined metadata contract, enabling rapid authoring of new experiments as standalone code units. |

### Alignment with Architecture Principles

- **Configuration-Driven Behavior**: Experiment metadata (title, description, APIs, status) is declared as structured data per experiment, not scattered across hard-coded markup.
- **Simplicity over Complexity**: Each experiment is an independent Astro page — no shared runtime state, no framework overhead beyond what the experiment itself requires.
- **Documentation as a Primary Artifact**: Each experiment exports metadata that serves as both user-facing content and machine-readable documentation for the index and structured data.
- **Native Discoverability**: JSON-LD structured data must be included on both the index and detail pages.
- **Universal Accessibility**: All UI must meet established accessibility standards.

## Requirements

### Experiments Index Page (`/experiments`)

1. The page displays a list of all published experiments.
2. Each entry shows at minimum: title, short description, and the web API(s) it demonstrates.
3. Each entry links to its detail page.
4. The page includes an introductory heading and description explaining what the Experiments section is for.
5. The page includes JSON-LD structured data (`CollectionPage`) for search engine indexing.

### Experiment Detail Page (`/experiments/[slug]`)

1. Each experiment has its own URL at `/experiments/[slug]`, where the slug is a stable identifier defined by the experiment itself.
2. The page renders the full interactive experiment — implemented as a self-contained Astro page with its own HTML, styles, and scripts.
3. The page displays: title, description, the web API(s) it covers, and a status indicator (e.g. experimental, stable).
4. The page includes JSON-LD structured data (`TechArticle`) for search engine indexing.
5. The page includes navigation back to the experiments index.

### Experiment Metadata Contract

Each experiment is an Astro page that exports a typed metadata object. The index page collects this metadata at build time to populate the listing. The metadata contract is:

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Display name of the experiment |
| `description` | Yes | Short summary (used in index listing and meta description) |
| `slug` | Yes | URL-safe identifier used as the page route segment |
| `webApis` | Yes | List of web API names demonstrated |
| `status` | Yes | One of: `experimental`, `stable`, `deprecated` |
| `publishedDate` | Yes | ISO date of publication |
| `featured` | No | Whether to highlight on index (default: false) |
| `order` | No | Display order on index (default: 0) |

## Scope

### In Scope
- Experiments index page at `/experiments`
- Experiment detail pages at `/experiments/[slug]` — each as a self-contained Astro page with live interactive code
- A typed metadata contract that each experiment page must export
- At least one sample experiment page to validate the feature end-to-end

### Out of Scope
- Filtering or searching experiments by API name or status
- User comments or interactivity beyond the experiment's own demo
- Any backend or database
- Authentication or gated content
- Related experiments / recommendations
- A shared runtime sandbox or iframe-based isolation for experiment code

## Acceptance Criteria

1. Visiting `/experiments` renders a list of all experiments with title, description, and web API tags.
2. Clicking an experiment navigates to `/experiments/[slug]` and renders the full interactive experiment page.
3. The detail page displays the experiment's status and the web APIs it covers.
4. Both pages include valid JSON-LD structured data.
5. Both pages are accessible (semantic HTML, keyboard-navigable, sufficient color contrast).
6. Adding a new experiment Astro page that exports valid metadata causes it to appear on the index automatically at build time.
7. The pages follow the visual and layout conventions of the existing site (layout, typography, design tokens).

## Decisions

1. **Status display**: All experiments are shown on the index regardless of status, with a visible badge indicating the status (similar to how a blog shows all posts). `deprecated` experiments are not hidden.
2. **Featured experiments**: A flat ordered list is sufficient — no special visual treatment for featured experiments.
3. **Navigation integration**: `/experiments` is added to the main site navigation. The experiment list is **not** shown on the homepage.
