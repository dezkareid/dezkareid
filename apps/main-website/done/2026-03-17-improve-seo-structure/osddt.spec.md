# Spec: Improve SEO Structure — Main Website

## Overview

The main website (`apps/main-website`) is an Astro-based portfolio site hosted at `https://main-website-a3t.pages.dev/`. Despite having basic meta tags, the site has several critical and high-impact SEO gaps that limit its visibility in search engines and prevent correct rendering when shared on social platforms.

The goal of this feature is to bring the site to a production-ready SEO baseline: a valid `robots.txt`, a generated sitemap, corrected and complete social sharing tags, a canonical URL, and structured data that enables Google Knowledge Panel eligibility for a personal portfolio.

## Requirements

### Crawlability

1. The site must expose a valid `/robots.txt` that explicitly allows all crawlers and references the sitemap URL.
2. The site must expose a `/sitemap.xml` that lists all indexable pages with their canonical URLs.
3. The sitemap URL must be the production domain, not the staging Cloudflare Pages domain.

### Meta Tags — Corrections

4. Twitter card meta tags must use the `name=""` attribute (not `property=""`), so that Twitter/X correctly renders link previews when the site URL is shared.
5. The viewport meta tag must include `initial-scale=1` in addition to `width=device-width`.

### Meta Tags — Additions

6. Every page must include a `<link rel="canonical">` tag pointing to its production URL.
7. The Open Graph block must include `og:url` (the page's canonical URL) and `og:site_name` (the brand name).
8. The Open Graph block and the Twitter card block must each include a social sharing image (`og:image` / `twitter:image`).
9. A social sharing image (1200 × 630 px) must be created and placed in the public assets directory.

### Structured Data

10. The homepage must include a JSON-LD `Person` schema that describes the portfolio owner, including: `name`, `jobTitle`, `url`, and `sameAs` links to relevant social profiles.
11. The structured data must be valid according to the Schema.org specification and pass Google's Rich Results Test.

### Meta Description

12. The default meta description must be specific and compelling — it should mention the owner's specialisation (frontend architecture, React, performance) rather than the current generic copy.

## Scope

### In scope

- `apps/main-website` only
- `Layout.astro` — meta tag corrections and additions
- `astro.config.mjs` — adding `@astrojs/sitemap` integration with the production site URL
- `public/robots.txt` — new static file
- `public/og-image.png` (or `.webp`) — new social sharing image
- `src/pages/index.astro` — JSON-LD structured data for the homepage
- All other pages (`/projects`, `/services`, `/about`) benefit automatically from `Layout.astro` changes; individual per-page structured data is out of scope for this iteration

### Out of scope

- Per-page structured data beyond the homepage `Person` schema
- Google Search Console setup or verification
- Performance optimisation (Core Web Vitals)
- Content rewrites beyond the meta description
- Hreflang / internationalisation

## Acceptance Criteria

1. **robots.txt**: `GET /robots.txt` returns a valid robots file (not HTML), Lighthouse reports 0 parse errors, and it references the sitemap URL.
2. **sitemap.xml**: `GET /sitemap.xml` returns a valid XML sitemap listing at least the homepage, `/projects`, `/services`, and `/about` pages.
3. **Twitter cards**: When inspected, all Twitter meta tags use `name=""` attribute. Pasting the URL into the [Twitter Card Validator](https://cards-dev.twitter.com/validator) renders a `summary_large_image` card.
4. **Canonical**: Every page's `<head>` contains `<link rel="canonical" href="<absolute-production-url>">`.
5. **OG completeness**: `og:url`, `og:site_name`, and `og:image` are all present in every page's `<head>`.
6. **Twitter image**: `twitter:image` is present in every page's `<head>`.
7. **Social image**: A 1200 × 630 px image asset exists in `public/`.
8. **JSON-LD**: The homepage contains a valid `Person` JSON-LD block. The [Google Rich Results Test](https://search.google.com/test/rich-results) reports no errors.
9. **Viewport**: The viewport meta tag reads `width=device-width, initial-scale=1`.
10. **Lighthouse SEO**: Running Lighthouse SEO audit on the built site scores ≥ 100 (up from 92).

## Decisions

1. **Production domain**: `https://dezkareid.dev` is the canonical domain. All sitemap URLs and canonical tags must use this domain.
2. **Social profiles for `sameAs`**: GitHub (URL to be sourced from the codebase/content) and LinkedIn (`https://www.linkedin.com/in/joelhumberto/`).
3. **OG / Twitter image**: Use the provided Cloudinary image: `https://res.cloudinary.com/ddyovtxd2/image/upload/v1773092115/JOEL_GOMEZ-4_viqymi.jpg`. No local asset needed.
4. **Owner's name**: Use `"Joel Humberto Gomez Paredes"` in the `Person` JSON-LD schema.

---

*Audit performed against https://main-website-a3t.pages.dev/ on 2026-03-16. Lighthouse SEO score at time of audit: 92/100.*
