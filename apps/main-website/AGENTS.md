# Agent Instructions: main-website

Astro 5 marketing website for Joel Gomez (dezkareid). Static site built with Astro content collections, design tokens, and a shared component library.

## Stack

- **Framework**: Astro 5 (`astro: 5.18.0`) — static output, no SSR
- **UI components**: `@dezkareid/components` (Button, Card, ThemeToggle — Astro variants)
- **Design tokens**: `@dezkareid/design-tokens` — CSS custom properties, never hardcode values
- **Styling**: Scoped `<style>` per component + `src/styles/global.css`
- **Linting**: ESLint 9 flat config via `@dezkareid/eslint-plugin-web` (`configs.astro`)

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
│   ├── config.ts       # Zod schemas for collections
│   ├── projects/       # 8 project .md files
│   └── services/       # 6 service .md files
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
| `image` | `string` (optional) | Local path e.g. `/images/projects/foo.png` |
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

## Component Conventions

- Props interface must be named `Properties` — the ESLint rule `varsIgnorePattern: '^Properties$'` suppresses the unused-vars warning since Astro types props implicitly via `Astro.props`.
- All CSS uses `var(--*)` tokens from `@dezkareid/design-tokens`. Where a token is missing, add a comment: `/* DS NOTE: --token-name: description */`
- Stretched card links: use `position: absolute; inset: 0; z-index: 1` on a plain `<a>`. Interactive elements inside the card (e.g. project links) must have `position: relative; z-index: 2` to sit above it.
- External links always get `target="_blank" rel="noopener noreferrer"` and a descriptive `aria-label`.

## Pages

| Page | Route | Data source |
|---|---|---|
| Homepage | `/` | Featured projects (top 3 by order), all services |
| Projects index | `/projects` | All projects sorted by `order` |
| Project detail | `/projects/[slug]` | Single project entry + rendered markdown |
| Services index | `/services` | All services split: delivery (order ≤ 3) / support (order > 4) |
| Service detail | `/services/[slug]` | Single service entry + rendered markdown + CTA button |
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

## Known Gaps / TODOs

- Mobile navigation (hamburger menu) is not implemented — nav links are hidden below 800px.
- AI-generated images for personal/OSS projects are deferred — those projects still use `https://placehold.co/600x400`.
- Cloudinary integration is deferred — images are served from `public/images/`.
- OG image uses a Cloudinary URL directly in `Layout.astro` as a temporary placeholder.
