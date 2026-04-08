# Agent Instructions: main-website

Astro 6 marketing website for Joel Gomez (dezkareid). Static site built with Astro content collections, design tokens, and a shared component library.

## Overview

This is a marketing website for Joel Gomez (dezkareid). It is a static site built with Astro 6.

Production URL: https://dezkareid.dev

### Stack

- **Framework**: Astro 6 (`astro: 6.0.6`) — static output, no SSR
- **UI components**: `@dezkareid/components` (Button, Card, ThemeToggle — Astro variants)
- **Design tokens**: `@dezkareid/design-tokens` — CSS custom properties, never hardcode values
- **Styling**: Scoped `<style>` per component + `src/styles/global.css`
- **Linting**: ESLint 9 flat config via `@dezkareid/eslint-plugin-web` (`configs.astro`)

## Architecture

### Islands Architecture
Currently, this project uses a pure static approach. Components from the `@dezkareid/components` library are server-rendered by Astro. Hydration (e.g., `client:load`) is only used for interactive elements like the `ThemeToggle`.

### Content Collections
All content is managed through the Astro 6 Content Layer API (see `src/content.config.ts`). Collections for `projects` and `services` use `glob` loaders to validate frontmatter and process markdown content.

### Integrations
- `@astrojs/sitemap`: Automatically generates a sitemap for search engine discovery.
- `sharp`: Used for high-performance image processing and conversion to WebP/AVIF.

### Deployment & Adapters
The project is configured for static output (SSG). It is deployed as a static site (Cloudflare Pages or similar) using the default Astro static adapter.

### Skills
To develop this application effectively, the AI agent should activate the following skills:
- `web-quality-audit` / `web-quality:web-quality-audit`: For auditing performance and accessibility.
- `performance` / `web-quality:performance`: For optimizing asset delivery and LCP.
- `seo` / `web-quality:seo`: For managing metadata and sitemap configuration.
- `design-tokens` / `design-system:design-tokens`: For referencing authorized colors and spacing.
- `accessibility` / `web-quality:accessibility`: For ensuring WCAG 2.2 compliance and screen reader support.
- `styles-methodology` / `frontend-tools:styles-methodology`: Standard methodology for writing and organizing styles.

### MCP Servers
- `context7` / `mcp__context7__query-docs`: When you need documentation for any external library (Astro, Sharp, Vite, etc.) — do not rely on training data alone.

## Project Structure

```
src/
├── components/         # Astro UI components
│   ├── Layout.astro    # Root layout: nav, header, footer, theme toggle
│   ├── Hero.astro      # Homepage hero section
│   ├── ProjectCard.astro
│   ├── ServiceCard.astro
│   ├── ContactSection.astro
│   ├── Section.astro   # Section wrapper with consistent padding
│   ├── Card.astro      # Base card primitive
│   ├── Button.astro
│   ├── SkillsList.astro
│   ├── SocialLinks.astro
│   ├── ThemeToggle.astro
│   └── PixelCrab.astro # Logo mark
├── content/
│   ├── projects/       # 8 project .md files (images colocated here)
│   └── services/       # 6 service .md files
├── content.config.ts   # Content Layer API schemas (Astro 6 — glob loaders)
├── layouts/
│   └── Layout.astro    # HTML shell, nav, footer, SEO meta
├── pages/
│   ├── index.astro     # Homepage
│   ├── about.astro
│   ├── projects/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── services/
│       ├── index.astro
│       └── [slug].astro
├── styles/
│   └── global.css      # Reset, typography, :focus-visible, design token imports
└── types/              # Shared TypeScript types
```

## Content Collections

### `projects` — `src/content/projects/`

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | |
| `description` | `string` | |
| `image` | `ImageMetadata` (optional) | Relative path to colocated image e.g. `./foo.png`; validated by Astro's `image()` helper |
| `techStack` | `string[]` | |
| `githubUrl` | `string` (url, optional) | |
| `liveUrl` | `string` (url, optional) | |
| `npmUrl` | `string` (url, optional) | |
| `type` | `'personal' \| 'work' \| 'contribution'` | |
| `featured` | `boolean` | Homepage shows top 3 by `order` where `featured: true` |
| `order` | `number` | Sort order across all listings |

Projects (in order): dezkareid-design-system, sync-ai-context, platzi-frontend-migration, ai-team, osddt, platzi-blog, platzi-internationalization, ibm-carbon-design-system.

### `services` — `src/content/services/`

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | |
| `description` | `string` | |
| `icon` | `string` (optional) | Emoji |
| `cta` | `string` (optional) | Action label used on the detail page |
| `order` | `number` | Orders 1–3 = delivery; 4–6 = strategic support |

Services (in order): frontend-as-a-service, frontend-architecture, performance, consultory, mentory, speaker.

## Coding Standards & Style

- **Styling Approach:** Use **BEM** (Block Element Modifier) for naming conventions and **OOCSS** (Object Oriented CSS) to split structural and skin responsibilities.
- Props interface must be named `Properties` — the ESLint rule `varsIgnorePattern: '^Properties$'` suppresses the unused-vars warning since Astro types props implicitly via `Astro.props`.
- All CSS uses `var(--*)` tokens from `@dezkareid/design-tokens`. Where a token is missing, add a comment: `/* DS NOTE: --token-name: description */`
- Stretched card links: use `position: absolute; inset: 0; z-index: 1` on a plain `<a>`. Interactive elements inside the card (e.g. project links) must have `position: relative; z-index: 2` to sit above it.
- External links always get `target="_blank" rel="noopener noreferrer"` and a descriptive `aria-label`.

## Pages

| Page | Route | Data source |
|---|---|---|
| Homepage | `/` | Featured projects (top 3 by order), all services |
| Projects index | `/projects` | All projects sorted by `order` |
| Project detail | `/projects/[id]` | Single project entry + rendered markdown |
| Services index | `/services` | All services split: delivery (order ≤ 3) / support (order > 4) |
| Service detail | `/services/[id]` | Single service entry + rendered markdown + CTA button |
| About | `/about` | Static copy |

## Styling Guidelines

- Import design tokens via `@dezkareid/components/css` (already in `global.css`).
- Light/dark theming: use `light-dark()` CSS function or `color-scheme` — never hardcode theme-specific hex values.
- Responsive breakpoints come from `@dezkareid/design-tokens`. The nav hides links below `800px` (mobile menu not yet implemented).
- `src/styles/global.css` contains the global `:focus-visible` ring rule — do not add per-component focus styles that conflict with it.

## Scripts

```bash
pnpm dev          # astro dev (http://localhost:4321)
pnpm build        # astro build → dist/
pnpm preview      # serve dist/
pnpm lint         # eslint .
pnpm lint:fix     # eslint . --fix
```

### Auditories

The audits should be done over the production site.

## Images

- Project images are colocated with their `.md` file in `src/content/projects/` and referenced as `./filename.png` in frontmatter.
- The `image()` schema helper (Astro Content Layer API) validates and imports them at build time.
- `ProjectCard.astro` uses `<Image>` from `astro:assets` with `widths` and `sizes` for responsive output (WebP via `sharp`).
- Projects without an image show a gradient placeholder with initials derived from the project title.
- Avatar images (Hero, About) are served from Cloudinary with `srcset` for HiDPI support.

## Known Gaps / TODOs

- Mobile navigation (hamburger menu) is not implemented — nav links are hidden below 800px.
- AI-generated images for personal/OSS projects are not yet available — those project cards show the initials placeholder.
- OG image uses a Cloudinary URL directly in `Layout.astro` as a temporary placeholder.
