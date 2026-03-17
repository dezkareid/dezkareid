# Plan: Improve SEO Structure — Main Website

## Architecture Overview

All changes are confined to `apps/main-website`. The implementation uses Astro's built-in capabilities and one official integration:

- **`@astrojs/sitemap`** — generates `/sitemap-index.xml` + `/sitemap-0.xml` at build time from all static routes. Requires `site` to be set in `astro.config.mjs`.
- **`public/robots.txt`** — a static file served as-is by Astro/Cloudflare Pages; no dynamic generation needed.
- **`Layout.astro`** — single source of truth for all `<head>` meta. All fixes and additions are made here so every page benefits automatically.
- **`src/pages/index.astro`** — the only page receiving JSON-LD structured data in this iteration.
- **No new runtime dependencies** — `@astrojs/sitemap` is a build-time dev integration.

Canonical URL and OG/Twitter image are derived from the production site URL (`https://dezkareid.dev`) and passed through the layout. The Cloudinary image is referenced by URL — no local asset needed.

---

## Technical Dependencies

| Dependency | Type | Version | Purpose |
|---|---|---|---|
| `@astrojs/sitemap` | devDependency | latest stable | Sitemap generation at build time |

---

## Implementation Phases

### Phase 1 — Crawlability

**Goal:** Fix the two failing Lighthouse audits (robots.txt parse errors, missing sitemap).

#### Step 1.1 — Install `@astrojs/sitemap`

Add `@astrojs/sitemap` as a dev dependency in `apps/main-website/package.json`. Use the exact version constraint (no `^` or `~`) per project conventions.

#### Step 1.2 — Configure `astro.config.mjs`

- Set `site: 'https://dezkareid.dev'`
- Add `sitemap()` to the `integrations` array

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dezkareid.dev',
  integrations: [sitemap()],
});
```

#### Step 1.3 — Create `public/robots.txt`

```text
User-agent: *
Allow: /

Sitemap: https://dezkareid.dev/sitemap-index.xml
```

> Note: `@astrojs/sitemap` generates `sitemap-index.xml` (not `sitemap.xml`) as the entry point.

---

### Phase 2 — Meta Tag Fixes & Additions in `Layout.astro`

**Goal:** Fix broken Twitter tags, add missing canonical/OG/Twitter fields, and fix the viewport tag.

#### Step 2.1 — Fix viewport tag

Change:
```html
<meta name="viewport" content="width=device-width" />
```
To:
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

#### Step 2.2 — Add `canonical` link

The layout must receive or derive the canonical URL. Use `Astro.site` (set via `astro.config.mjs`) combined with `Astro.url.pathname`:

```astro
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
```

```html
<link rel="canonical" href={canonicalURL} />
```

#### Step 2.3 — Complete Open Graph block

Add to the existing OG block:
```html
<meta property="og:url" content={canonicalURL} />
<meta property="og:site_name" content="Dezkareid" />
<meta property="og:image" content="https://res.cloudinary.com/ddyovtxd2/image/upload/v1773092115/JOEL_GOMEZ-4_viqymi.jpg" />
```

#### Step 2.4 — Fix and complete Twitter card block

Replace all three `property=""` attributes with `name=""`, and add the image:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content="https://res.cloudinary.com/ddyovtxd2/image/upload/v1773092115/JOEL_GOMEZ-4_viqymi.jpg" />
```

#### Step 2.5 — Update Layout props interface

Expose `image` as an optional prop so individual pages can override the OG/Twitter image in the future:

```ts
interface Properties {
  title?: string;
  description?: string;
  image?: string;
}
const {
  title = "Joel Humberto Gomez Paredes — Frontend Architect",
  description = "Frontend architect specialising in React, performance, and scalable UI systems. Explore my projects, services, and open-source work.",
  image = "https://res.cloudinary.com/ddyovtxd2/image/upload/v1773092115/JOEL_GOMEZ-4_viqymi.jpg",
} = Astro.props;
```

> The default title and description are updated here to be more specific and compelling (Requirement 12).

---

### Phase 3 — JSON-LD Structured Data on Homepage

**Goal:** Add a `Person` schema to `src/pages/index.astro` to enable Google Knowledge Panel eligibility.

Add a `<script type="application/ld+json">` block inside the `<Layout>` component's slot or pass it as a head slot if Layout supports it. Since `Layout.astro` uses a single default slot for body content, inject the JSON-LD directly in `index.astro` inside the `<Layout>` wrapper — Astro will hoist `<script>` tags in `<head>` if declared with `is:inline` inside the page's frontmatter area, or simply place it as the first child inside the layout and rely on the browser treating it as body content (valid for JSON-LD).

The cleanest Astro approach: add a named `head` slot to `Layout.astro` and pass the JSON-LD from `index.astro`.

#### Step 3.1 — Add `head` slot to `Layout.astro`

Inside `<head>` in `Layout.astro`, add:
```html
<slot name="head" />
```

#### Step 3.2 — Add JSON-LD to `index.astro`

```astro
<Layout>
  <script slot="head" type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Joel Humberto Gomez Paredes",
    "jobTitle": "Frontend Architect",
    "url": "https://dezkareid.dev",
    "sameAs": [
      "https://github.com/dezkareid",
      "https://www.linkedin.com/in/joelhumberto/"
    ]
  })} />
  ...
</Layout>
```

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `Astro.site` is `undefined` at build time if `site` not set | Low (we set it in Phase 1) | Set `site` in `astro.config.mjs` before using `Astro.site` in Layout |
| `@astrojs/sitemap` generates `sitemap-index.xml` not `sitemap.xml` | Known | robots.txt references `sitemap-index.xml` explicitly |
| Cloudinary image URL changes or becomes unavailable | Low | URL is hardcoded; add a comment noting it should be updated if the asset moves |
| Custom domain `dezkareid.dev` not yet live | Possible | canonical/sitemap use the correct domain; no functional issue until DNS is configured |
| `<script slot="head">` injection in Astro — Astro may process `<script>` tags | Medium | Use `is:inline` to prevent Astro from bundling it; use `set:html` for the JSON string |

---

## Out of Scope

- Per-page structured data beyond the homepage `Person` schema
- Google Search Console setup, verification, or sitemap submission
- Core Web Vitals / performance optimisation
- Content rewrites beyond the default title and meta description
- Hreflang / internationalisation
- Twitter/X handle (`twitter:site`, `twitter:creator`)
- Custom domain DNS configuration
