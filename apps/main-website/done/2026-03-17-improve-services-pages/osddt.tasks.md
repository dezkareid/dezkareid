# Tasks: Improve Services Pages Performance, Accessibility & Content

## Phase 1 — Content Schema & Frontmatter Enrichment

> **Depends on:** nothing
> **Definition of Done:** `pnpm build` succeeds with no type errors; all 6 service markdown files have `metaDescription`, `priceRange`, and `serviceType` in their frontmatter.

- [x] [S] Extend `src/content/config.ts` — add `metaDescription` (string, optional), `priceRange` (string, optional), `serviceType` (string, optional) to the services schema
- [x] [S] Add frontmatter fields to `src/content/services/frontend-as-a-service.md`
- [x] [S] Add frontmatter fields to `src/content/services/frontend-architecture.md`
- [x] [S] Add frontmatter fields to `src/content/services/performance.md`
- [x] [S] Add frontmatter fields to `src/content/services/consultory.md`
- [x] [S] Add frontmatter fields to `src/content/services/mentory.md`
- [x] [S] Add frontmatter fields to `src/content/services/speaker.md`

---

## Phase 2 — SEO: Unique Meta Tags & Structured Data

> **Depends on:** Phase 1
> **Definition of Done:** Each service detail page has unique `<title>`, `<meta name="description">`, `og:title`, `og:description` in rendered HTML. Each detail page has a valid `<script type="application/ld+json">` with `Service` schema. Services index has its own unique description.

- [x] [S] Update `src/pages/services/index.astro` — pass unique `description` prop to `<Layout>`
- [x] [M] Update `src/pages/services/[slug].astro` — destructure `metaDescription`, `serviceType`, `priceRange` from `service.data`; pass `description={metaDescription}` to `<Layout>`
- [x] [M] Add Schema.org `Service` JSON-LD block to `src/pages/services/[slug].astro` via `<slot name="head">` — include `name`, `description`, `url`, `serviceType`, `provider`, and `offers` (using `PriceSpecification` with `description` for free-text price ranges)

---

## Phase 3 — Accessibility Fixes

> **Depends on:** Phase 1 (for `cta` field usage)
> **Definition of Done:** No axe-core violations on service pages for heading order, accessible names, or landmark roles. Breadcrumb `<nav>` has `aria-label="Breadcrumb"`. CTA button text matches service context.

- [x] [S] Add `aria-label="Breadcrumb"` to `<nav class="breadcrumb">` in `src/pages/services/[slug].astro`
- [x] [S] Update CTA button in `src/pages/services/[slug].astro` — replace hardcoded "Inquire About This Service" with `{cta}` from frontmatter; update `aria-label` to match
- [x] [S] Fix `.service-description` CSS in `src/pages/services/[slug].astro` — consolidate `margin-bottom` and `margin-inline: auto` to avoid shorthand conflict
- [x] [S] Audit heading hierarchy in all 6 `src/content/services/*.md` files — fix any skipped heading levels (h2 → h4 without h3, etc.)

---

## Phase 4 — Bottom CTA Section on Detail Pages

> **Depends on:** Phase 1 (for `cta` and `title` fields), Phase 3 (markup is stable)
> **Definition of Done:** Every service detail page renders a `bg-alt` CTA section after the markdown content and before the footer. The section uses the service's `cta` label and links to the mailto address.

- [x] [S] Check `src/components/Section.astro` — verify it forwards `class` prop; document result
- [x] [M] Add bottom CTA `<Section>` to `src/pages/services/[slug].astro` — `bg-alt` background, heading using `cta` text, mailto link button
- [x] [S] Add scoped CSS for `.bg-alt`, `.cta-container`, `.cta-title`, `.cta-text`, `.cta-button` to `src/pages/services/[slug].astro` — mirror design tokens from index page CTA styles

---

## Phase 5 — Performance Audit & Build Validation

> **Depends on:** Phases 1–4 complete
> **Definition of Done:** `pnpm build` succeeds with no errors. Lighthouse Performance ≥ 90, Accessibility ≥ 95, SEO = 100 on `/services` and at least one detail page.

- [x] [S] Run `pnpm build` from repo root — fix any TypeScript or Astro build errors
- [x] [M] Run Lighthouse audit on `/services` index page — record scores; fix any issues below threshold
- [x] [M] Run Lighthouse audit on one service detail page (e.g. `/services/frontend-as-a-service`) — record scores; fix any issues below threshold
- [x] [S] Verify JSON-LD output in rendered HTML — confirm no parse errors and correct field values for all 6 detail pages

---

## Dependencies Summary

```
Phase 1 → Phase 2
Phase 1 → Phase 3
Phase 1 + Phase 3 → Phase 4
Phase 1 + Phase 2 + Phase 3 + Phase 4 → Phase 5
```

Phases 2, 3, and 4 can be worked in parallel once Phase 1 is complete.
