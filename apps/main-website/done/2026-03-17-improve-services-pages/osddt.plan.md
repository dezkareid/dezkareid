# Plan: Improve Services Pages Performance, Accessibility & Content

## Architecture Overview

All service pages are built with **Astro 5 (static output)**. Content lives in markdown files at `src/content/services/*.md` with a Zod schema in `src/content/config.ts`. The detail page template is `src/pages/services/[slug].astro`; the index is `src/pages/services/index.astro`. The shared layout is `src/layouts/Layout.astro`.

Key design decisions:
- **No new components** — the bottom CTA section is added directly to `[slug].astro` using the existing `Section` component and the same `.bg-alt` pattern already used on the index page.
- **Meta per-page** — `Layout.astro` already accepts `title`, `description`, and `image` props; service pages just need to pass unique values. A new `metaDescription` frontmatter field is added to the content schema.
- **Structured data via JSON-LD** — injected as a `<script type="application/ld+json">` in the Layout's `<slot name="head" />` on each detail page. No external library needed.
- **Pricing in schema** — approximate price range strings are added as a new optional `priceRange` field to the content schema and surfaced in the JSON-LD `offers` block.
- **Accessibility fixes** — targeted changes to markup in `[slug].astro` and `ServiceCard.astro`; no design system changes needed.
- **Performance** — Astro static output is already optimized; improvements focus on ensuring no unnecessary JS, correct font/resource loading, and CLS avoidance.

---

## Implementation Phases

### Phase 1 — Content Schema & Frontmatter Enrichment

**Goal:** Add the data needed to power unique meta tags, context-aware CTAs, and structured data — without changing any UI yet.

**Files:**
- `src/content/config.ts` — add `metaDescription` (string, required), `priceRange` (string, optional), `serviceType` (string, optional) fields to the services schema.
- All 6 `src/content/services/*.md` files — add `metaDescription`, `priceRange`, and `serviceType` values to each frontmatter block.
- `src/pages/services/index.astro` — add a unique `description` prop to the `<Layout>` call.

**Details per service:**

| Service | metaDescription (≤160 chars) | priceRange | serviceType |
|---|---|---|---|
| Frontend as a Service | Hire a dedicated frontend specialist for React, Next.js, and Astro delivery. Your team stays focused — I handle the frontend end-to-end. | Project-based | Frontend Development |
| Frontend Architecture | Get a prioritized frontend architecture audit with an actionable roadmap. I analyze your codebase, workflows, and tooling — then fix them. | From $1,500 | Technical Consulting |
| Web Performance | Root-cause web performance audits for teams where slow pages hurt retention and SEO. Measurable improvements, not just Lighthouse scores. | From $900 | Performance Optimization |
| Consulting | Independent technical strategy for CTOs and engineering leads. Single calls to ongoing advisory — grounded in real-world frontend experience. | From $250/session | Technical Advisory |
| Mentoring | 1:1 mentoring for developers growing into senior, staff, or leadership roles. Career strategy, code review, system design, and interview prep. | From $150/session | Professional Mentoring |
| Speaker & Workshops | Frontend conference talks and internal workshops on architecture, design systems, performance, and AI-assisted development. | Free (public) / Negotiated (private) | Speaking & Training |

---

### Phase 2 — SEO: Unique Meta Tags & Structured Data

**Goal:** Every service page has unique title, description, and OG tags. Each detail page has Schema.org `Service` JSON-LD.

**Files:**
- `src/pages/services/[slug].astro` — pass `description={metaDescription}` to `<Layout>`. Add a `<script type="application/ld+json">` block inside `<slot name="head">` with the `Service` schema.
- `src/pages/services/index.astro` — pass a unique `description` to `<Layout>`.

**JSON-LD structure for each service detail page:**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "<title>",
  "description": "<metaDescription>",
  "url": "<canonicalURL>",
  "serviceType": "<serviceType>",
  "provider": {
    "@type": "Person",
    "name": "Joel Humberto Gomez Paredes",
    "url": "https://dezkareid.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "<priceRange>",
    "priceCurrency": "USD"
  }
}
```

---

### Phase 3 — Accessibility Fixes

**Goal:** Fix all known a11y gaps across service pages.

**Changes:**

1. **`src/pages/services/[slug].astro`**
   - Add `aria-label="Breadcrumb"` to the existing `<nav class="breadcrumb">`.
   - Add `<main>` landmark `aria-label="Service details"` — already handled by Layout's `<main>` wrapper, but verify `<header>` is inside `<main>`.
   - Ensure the CTA button text is contextual: change from generic "Inquire About This Service" to use the `cta` frontmatter field (e.g. "Start a project", "Request an audit"). Update `aria-label` accordingly.
   - Add `service-description` bottom margin fix: currently `margin-bottom: var(--spacing-48)` and `margin-inline: auto` are both applied which can conflict — consolidate into a single margin-bottom with separate margin-inline.

2. **`src/components/ServiceCard.astro`** — verify `aria-label` on the stretched link correctly describes each service (already uses `"Learn about ${title}"` — no change needed).

3. **`src/pages/services/index.astro`** — verify heading order: `h1` (Professional Services) → `h2` (group titles) is correct. No changes needed.

4. **`src/content/services/*.md`** — verify heading order in markdown content: all files use `h2` as the top level inside content, which renders under `h1` on the page. Check no `h4+` are used without `h3` parent. Fix any skipped levels.

---

### Phase 4 — Bottom CTA Section on Detail Pages

**Goal:** Add a secondary CTA section after the markdown content on every service detail page, matching the `bg-alt` style from the index page.

**Files:**
- `src/pages/services/[slug].astro` — add a second `<Section>` below the main content section, using `class="bg-alt"`. Use the `cta` frontmatter field for the button label and the `title` for the heading copy.

**Markup pattern** (mirrors the index page CTA section):
```astro
<Section class="bg-alt">
  <div class="cta-container">
    <h2 class="cta-title">Ready to {cta.toLowerCase()}?</h2>
    <p class="cta-text">Let's talk about your project and how I can help.</p>
    <a href="mailto:elmaildeldezkareid@gmail.com" class="cta-button">{cta}</a>
  </div>
</Section>
```

The `bg-alt` class and `cta-button` styles already exist on the index page — replicate them in the detail page's `<style>` block using the same design token values.

---

### Phase 5 — Performance Audit & Fixes

**Goal:** Verify no regressions from new JSON-LD scripts, confirm CLS is clean, and validate Lighthouse scores.

**Checks:**
1. JSON-LD `<script>` tags are `type="application/ld+json"` — parsed by browser as JSON data, no JS execution cost.
2. No new render-blocking resources introduced.
3. The bottom CTA `Section` component uses existing CSS custom properties only — no new fonts or images.
4. CLS: the `service-description` `margin-inline: auto` + `margin-bottom` conflict in CSS is fixed (Phase 3 item 1) which may cause layout recalculation.
5. Run `pnpm build` to verify no build errors.
6. Run Lighthouse audit locally on `/services` and at least one detail page.

---

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| Astro 5 content collections | Existing | Schema extension needed (Phase 1) |
| `@dezkareid/components` Button (Astro) | Existing | Used in detail page header CTA |
| `Section.astro` | Existing | Reused for bottom CTA section |
| Schema.org JSON-LD | No new dep | Inline `<script type="application/ld+json">` |
| Design tokens | Existing | `var(--color-background-secondary)` etc. |

No new npm packages needed.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Content schema change breaks existing markdown | Add new fields as optional with defaults in Zod; existing files without them will not break |
| `priceRange` string in JSON-LD `offers.price` is non-standard (Schema.org expects a number) | Use `"description"` field inside the `Offer` instead of `"price"` for free-text ranges; or use `PriceSpecification` with a `description` string |
| `Section` component does not forward `class` prop for `bg-alt` styling | Check `Section.astro` — if it doesn't forward `class`, apply background color via a wrapper `<div>` inside the Section instead |
| Heading hierarchy in markdown content — some files may use `h3` without a parent `h2` | Audit all 6 markdown files before Phase 3 ships |

---

## Out of Scope

- Navigation or footer changes
- Non-service pages
- Contact form UI
- Design system token changes
- Unique OG images per service (deferred — shared image used for now)
- New or removed service pages
- Backend / API integrations
