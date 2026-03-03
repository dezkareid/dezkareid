# @dezkareid/components

A package to export UI components in formats like React, Astro, Vue, etc.

## Overview

Always use Context7 MCP when I need external library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

The following paths are the entry points to the different packages:

- `src/react/`: React components (entry: `src/react/index.ts`)
- `src/astro/`: Astro components (entry: `src/astro/index.ts`)
- `src/vue/`: Vue components (entry: `src/vue/index.ts`)
- `src/css/`: Shared CSS Modules (one file per component)
- `src/shared/js/`: Framework-agnostic JS utilities
- `src/shared/types/`: Shared TypeScript interfaces for all components

## Development

Each component lives in its own folder within each framework directory, e.g. `src/react/Button/index.tsx`.

A component set should include:

- `src/shared/types/<component>.ts` — shared TypeScript props interface
- `src/css/<component>.module.css` — BEM + OOCSS styles using design tokens only
- `src/react/<Component>/index.tsx` — React implementation
- `src/react/<Component>/index.test.tsx` — Vitest + RTL tests (React only)
- `src/astro/<Component>/index.astro` — Astro implementation
- `src/vue/<Component>/index.vue` — Vue SFC implementation

### CSS conventions

- Use **BEM** for class naming: `.block`, `.block--modifier`, `.block__element`
- Use **OOCSS** to separate structure (layout/sizing/spacing) from skin (colour/border/shadow)
- All values must use CSS custom properties from `@dezkareid/design-tokens` — never hardcode hex, rgb, or px values
- Use semantic tokens (`--color-primary`, `--color-text-primary`, etc.) for automatic light/dark support
- When a needed token doesn't exist, use the closest base token and add a `TODO: Propose --token-name` comment

### Available components

#### Button

File: `src/react/Button/index.tsx` | `src/astro/Button/index.astro` | `src/vue/Button/index.vue`
Types: `src/shared/types/button.ts` | CSS: `src/css/button.module.css`

Props:
- `variant?: 'primary' | 'secondary'` — default `'primary'`
- `size?: 'sm' | 'md' | 'lg'` — default `'md'`
- `disabled?: boolean` — default `false`
- Forwards all native `<button>` HTML attributes

BEM classes: `.button`, `.button--primary`, `.button--secondary`, `.button--sm`, `.button--md`, `.button--lg`, `.button--disabled`

#### Tag

File: `src/react/Tag/index.tsx` | `src/astro/Tag/index.astro` | `src/vue/Tag/index.vue`
Types: `src/shared/types/tag.ts` | CSS: `src/css/tag.module.css`

Props:
- `variant?: 'default' | 'success' | 'danger'` — default `'default'`
- Accepts arbitrary `children`/slot content (not limited to plain text)

BEM classes: `.tag`, `.tag--default`, `.tag--success`, `.tag--danger`

#### Card

File: `src/react/Card/index.tsx` | `src/astro/Card/index.astro` | `src/vue/Card/index.vue`
Types: `src/shared/types/card.ts` | CSS: `src/css/card.module.css`

Props:
- `elevation?: 'flat' | 'raised'` — default `'raised'`
- Accepts arbitrary `children`/slot content

BEM classes: `.card`, `.card--raised`, `.card--flat`

Note: `--shadow-raised` token is proposed but not yet in `@dezkareid/design-tokens`; currently uses a raw `box-shadow` value.

#### ThemeToggle

File: `src/react/ThemeToggle/index.tsx` | `src/astro/ThemeToggle/index.astro` | `src/vue/ThemeToggle/index.vue`
Types: `src/shared/types/theme-toggle.ts` | CSS: `src/css/theme-toggle.module.css`
Shared logic: `src/shared/js/theme.ts`

Props: none (self-contained stateful component)

Behaviour:
- On mount: reads `localStorage.getItem('color-scheme')`; falls back to `window.matchMedia('(prefers-color-scheme: dark)')`
- On toggle: flips theme, calls `applyTheme()` (sets `color-scheme` on `<html>`), calls `persistTheme()` (writes to `localStorage`)
- Astro version includes an inline `<script is:inline>` for FOUC prevention
- All `window`/`localStorage` access is SSR-safe (`typeof window !== 'undefined'` guards in `theme.ts`)

BEM classes: `.theme-toggle`, `.theme-toggle--dark`

And offer support for the next characteristics:

- Multi-theme support
- Mobile first
- Accessibility support
- Performance focused

To choose colors use the `design-tokens` skill (already have multi-theme support). When you need to use a color not defined in the design tokens you can propose a new color to be added to the design tokens using a commentary in the code.

## Critical Dependency Versions

The following versions are established across the project's packages and should be respected when adding new dependencies or troubleshooting.

### Core Languages & Runtimes
- **TypeScript**: `5.9.3`

### Build & Bundling Tools
- **Rollup**: `4.56.0`
- **Vite**: `5.1.2` (via `@vitejs/plugin-react`)

### Testing Frameworks
- **Vitest**: `4.0.18`
- **React Testing Library**: `16.3.2`
- **jsdom**: `27.4.0`

### Linting & Formatting
- **ESLint**: `9.39.2`
- **Prettier**: `3.8.1`

### Type Definitions
- **@types/node**: `25.0.10`
- **@types/react**: `19.2.9`
- **@types/fs-extra**: `11.0.4`
- **@types/jest**: `30.0.0`

### Key Libraries
- **React**: `19.2.4` (Peer dependency: `^18.0.0 || ^19.0.0`)
- **React DOM**: `19.2.4`

## Documentation

- `README.md`: The source to use the package.
- `AGENTS.md`: The source to understand the package for ai-assisted tools.

When a component is created or modified, consider update those files with the new information.