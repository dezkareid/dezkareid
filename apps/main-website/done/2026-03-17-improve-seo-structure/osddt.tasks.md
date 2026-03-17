# Tasks: Improve SEO Structure — Main Website

## Phase 1 — Crawlability

**Goal:** Fix the two failing Lighthouse audits (robots.txt parse errors, missing sitemap).

- [x] [S] 1.1 Look up the latest stable version of `@astrojs/sitemap` and add it as an exact-version devDependency in `apps/main-website/package.json`, then run `pnpm install`
- [x] [S] 1.2 Update `apps/main-website/astro.config.mjs` — set `site: 'https://dezkareid.dev'` and add `sitemap()` to `integrations`
- [x] [S] 1.3 Create `apps/main-website/public/robots.txt` with `Allow: /` and `Sitemap: https://dezkareid.dev/sitemap-index.xml`

**Definition of Done:** `pnpm build` succeeds, `dist/robots.txt` exists and contains valid directives, `dist/sitemap-index.xml` exists and lists site pages.

**Dependencies:** 1.1 must complete before 1.2.

---

## Phase 2 — Meta Tag Fixes & Additions

**Goal:** Fix broken Twitter tags, add missing canonical/OG/Twitter fields, fix viewport, and improve default copy.

- [x] [S] 2.1 In `Layout.astro` frontmatter: add `image` to the `Properties` interface and destructure it with the Cloudinary URL as default; update default `title` and `description` to the new copy
- [x] [S] 2.2 In `Layout.astro` `<head>`: fix viewport — add `initial-scale=1` to the existing `content` attribute
- [x] [S] 2.3 In `Layout.astro` `<head>`: derive `canonicalURL` from `Astro.site` + `Astro.url.pathname` and add `<link rel="canonical">`
- [x] [S] 2.4 In `Layout.astro` `<head>`: add `og:url`, `og:site_name`, and `og:image` to the Open Graph block
- [x] [S] 2.5 In `Layout.astro` `<head>`: replace all three Twitter `property=""` attributes with `name=""` and add `twitter:image`

**Definition of Done:** Built page source contains correct canonical, all five OG tags, all four Twitter tags with `name=""`, updated viewport, updated default title and description.

**Dependencies:** 2.1 must complete before 2.3–2.5 (image prop needed). Phase 1 (site URL config) must complete before 2.3 (Astro.site).

---

## Phase 3 — JSON-LD Structured Data

**Goal:** Add a `Person` schema to the homepage for Google Knowledge Panel eligibility.

- [x] [S] 3.1 In `Layout.astro` `<head>`: add `<slot name="head" />` so pages can inject head content
- [x] [M] 3.2 In `src/pages/index.astro`: add a `<script slot="head" is:inline type="application/ld+json">` block with the `Person` schema (name, jobTitle, url, sameAs for GitHub + LinkedIn)

**Definition of Done:** Built homepage source contains a valid JSON-LD `Person` block. Pasting the HTML into [Google Rich Results Test](https://search.google.com/test/rich-results) reports no errors.

**Dependencies:** 3.1 must complete before 3.2.
