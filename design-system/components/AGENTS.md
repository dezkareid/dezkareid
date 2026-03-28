# @dezkareid/components

A package to export UI components in formats like React, Astro, Vue, etc.

## Overview

Always use Context7 MCP when I need external library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

The following paths are the entry points to the different packages:

- `src/react/`: React components (entry: `src/react/index.ts`) — all components, for non-Next.js consumers
- `src/react-server/`: Server-safe React entry (entry: `src/react-server/index.ts`) — re-exports `Button`, `Card`, `Tag` only
- `src/react-client/`: Client React entry (entry: `src/react-client/index.ts`) — re-exports `ThemeToggle` only
- `src/astro/`: Astro components (entry: `src/astro/index.ts`)
- `src/vue/`: Vue components (entry: `src/vue/index.ts`)
- `src/css/`: Shared CSS Modules (one file per component, `src/css/index.ts` imports all for the CSS bundle)
- `src/shared/js/`: Framework-agnostic JS utilities
- `src/shared/types/`: Shared TypeScript interfaces for all components

## Package Exports

| Export | Points to | Compiled? | Notes |
|---|---|---|---|
| `@dezkareid/components/react` | `dist/react/index.js` | Yes — Rollup ESM, `preserveModules` | All components. For non-Next.js React consumers. |
| `@dezkareid/components/react-server` | `dist/react-server/index.js` | Yes — Rollup ESM, `preserveModules` | `Button`, `Card`, `Tag` only. Safe for Next.js Server Components. No `'use client'`. |
| `@dezkareid/components/react-client` | `dist/react-client/index.js` | Yes — Rollup ESM, `preserveModules` | `ThemeToggle` only. Every emitted file starts with `'use client'` (injected via Rollup `output.banner`). |
| `@dezkareid/components/astro` | `src/astro/index.ts` | No — compiled by Astro | |
| `@dezkareid/components/vue` | `src/vue/index.ts` | No — compiled by Vite/Vue | |
| `@dezkareid/components/css` | `dist/components.min.css` | Yes — CSS Modules extracted via `rollup-plugin-postcss` | |

### Why Astro and Vue are not pre-compiled

- **Astro** `.astro` files require Astro's own compiler — they cannot be pre-compiled to generic JS
- **Vue** SFCs are best compiled by the consumer's Vite for correct SSR and template optimisation

## Build

The build uses **Rollup** (`rollup.config.mjs`) — not Vite — because `rollup-plugin-postcss` handles CSS Modules extraction correctly in Rollup without conflicts.

`rollup.config.mjs` exports an **array of three configs**, one per React entry point:

1. **`react` config** — `input: src/react/index.ts`, extracts CSS to `dist/components.min.css`
2. **`react-server` config** — `input: src/react-server/index.ts`, `postcss({ extract: false })` (no CSS duplication)
3. **`react-client` config** — `input: src/react-client/index.ts`, `output.banner: "'use client';"`, `postcss({ extract: false })`

The build produces:
- `dist/react/**/*.js` + `.d.ts` — all components (tree-shakeable via `preserveModules`)
- `dist/react-server/**/*.js` + `.d.ts` — server-safe components only
- `dist/react-client/**/*.js` + `.d.ts` — client components; every file starts with `'use client';`
- `dist/components.min.css` — CSS Modules processed and bundled (emitted by the `react` config only)

Key plugins:
- `rollup-plugin-postcss` with `autoModules: true, minimize: true` — processes CSS Modules; `extract: 'components.min.css'` on the `react` config only, `extract: false` on the others
- `@rollup/plugin-typescript` with `declaration: true` — compiles TSX and emits `.d.ts` files
- `@rollup/plugin-node-resolve` — resolves node_modules

**`'use client'` injection:** Rollup 4 strips `"use client"` directive prologs by default. The `react-client` config uses `output.banner: "'use client';"` to prepend the directive to every file it emits. No additional plugin is needed.

### CSS Modules in the build

CSS class names are scoped (hashed) by `postcss-modules`. The JS proxy files (e.g. `dist/css/button.module.css.js`) export the class name map so React components can reference the correct hashed names. The `dist/components.min.css` file contains the matching scoped styles.

Consumers **must** import `@dezkareid/components/css` once at their app root — styles are not auto-injected into JS.

## Development

Each component lives in its own folder within each framework directory, e.g. `src/react/Button/index.tsx`.

### Component characteristics

Each component should have support for the following characteristics:

- Multi-theme support
- Mobile first
- Accessibility/WCAG 2.2 support
- Performance focused

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
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success'` — default `'primary'`
- `size?: 'sm' | 'md' | 'lg'` — default `'md'`
- `disabled?: boolean` — default `false`
- Forwards all native `<button>` HTML attributes

Accessibility:
- Sets both `disabled` and `aria-disabled={disabled}` so screen readers announce the disabled state regardless of the element's interactive role.
- `:focus-visible` outline uses `var(--color-primary)` — never removed.

BEM classes: `.button`, `.button--primary`, `.button--secondary`, `.button--outline`, `.button--ghost`, `.button--success`, `.button--sm`, `.button--md`, `.button--lg`, `.button--disabled`

Component custom properties (override per-variant colours without touching global tokens):
| Property | Variant | Default |
|---|---|---|
| `--button-primary-color-background` | primary | `var(--color-primary)` |
| `--button-primary-color-text` | primary | `var(--color-text-inverse)` |
| `--button-secondary-color-background` | secondary/outline | `transparent` |
| `--button-secondary-color-text` | secondary/outline | `var(--color-primary)` |
| `--button-secondary-color-border` | secondary/outline | `var(--color-primary)` |
| `--button-success-color-background` | success | `var(--color-success)` |
| `--button-success-color-text` | success | `var(--color-text-inverse)` |
| `--button-ghost-color-background` | ghost | `transparent` |
| `--button-ghost-color-text` | ghost | `var(--color-text-primary)` |

Usage example:
```css
.my-section .button--primary {
  --button-primary-color-background: var(--color-danger);
  --button-primary-color-text: var(--color-text-inverse);
}
```

#### Tag

File: `src/react/Tag/index.tsx` | `src/astro/Tag/index.astro` | `src/vue/Tag/index.vue`
Types: `src/shared/types/tag.ts` | CSS: `src/css/tag.module.css`

Props:
- `variant?: 'default' | 'success' | 'danger' | 'warning'` — default `'default'`
- Accepts arbitrary `children`/slot content (not limited to plain text)

Accessibility:
- The component does not inject accessible text for semantic variants. Consumers must provide a meaningful `aria-label` when the variant colour conveys status (e.g. `<Tag variant="danger" aria-label="Error: item rejected">`).

BEM classes: `.tag`, `.tag--default`, `.tag--success`, `.tag--danger`, `.tag--warning`

Component custom properties (override per-variant colours without touching global tokens):
| Property | Variant | Default |
|---|---|---|
| `--tag-default-color-background` | default | `var(--color-background-secondary)` |
| `--tag-default-color-text` | default | `var(--color-text-primary)` |
| `--tag-success-color-background` | success | `var(--color-success)` |
| `--tag-success-color-text` | success | `var(--color-text-inverse)` |
| `--tag-danger-color-background` | danger | `var(--color-danger)` |
| `--tag-danger-color-text` | danger | `var(--color-text-inverse)` |
| `--tag-warning-color-background` | warning | `#d97706` |
| `--tag-warning-color-text` | warning | `var(--color-text-inverse)` |

Usage example:
```css
.my-section {
  --tag-success-color-background: var(--color-primary);
  --tag-success-color-text: var(--color-text-inverse);
}
```

Note: `--color-warning` token is proposed but not yet in `@dezkareid/design-tokens`; currently uses raw `#d97706` (amber-600).

#### Card

File: `src/react/Card/index.tsx` | `src/astro/Card/index.astro` | `src/vue/Card/index.vue`
Types: `src/shared/types/card.ts` | CSS: `src/css/card.module.css`

Props:
- `elevation?: 'flat' | 'raised'` — default `'raised'`
- `role?: string` — forwarded to root `<div>` for semantic landmark declaration (e.g. `role="article"`, `role="region"` with `aria-label`). No default role is set.
- Accepts arbitrary `children`/slot content

BEM classes: `.card`, `.card--raised`, `.card--flat`

Note: `--shadow-raised` and `--color-border` tokens are proposed but not yet in `@dezkareid/design-tokens`; currently use raw values.

#### ThemeToggle

File: `src/react/ThemeToggle/index.tsx` | `src/astro/ThemeToggle/index.astro` | `src/vue/ThemeToggle/index.vue`
Types: `src/shared/types/theme-toggle.ts` | CSS: `src/css/theme-toggle.module.css`
Shared logic: `src/shared/js/theme.ts`

Props:
- `cssProcessor?: 'css' | 'lightningcss'` — default `'css'`. Controls how `applyTheme` overrides the document theme.
  - `'css'`: sets `document.documentElement.style.colorScheme`. Works with native `light-dark()` support (Astro, Vite).
  - `'lightningcss'`: also flips `--lightningcss-light` / `--lightningcss-dark` CSS variables. Required for Next.js/Turbopack, which compiles `light-dark()` away. See https://lightningcss.dev/transpilation.html.
- `onChange?: (theme: 'light' | 'dark') => void` — called after each toggle with the new theme value. Useful for syncing external state or analytics.

Behaviour:
- On mount: reads `localStorage.getItem('color-scheme')`; falls back to `window.matchMedia('(prefers-color-scheme: dark)')`
- On toggle: flips theme, calls `applyTheme(theme, cssProcessor)`, calls `persistTheme()` (writes to `localStorage`), then calls `onChange?.(next)`
- Renders an inline SVG sun icon (light mode) or moon icon (dark mode) alongside the text label. SVGs have `aria-hidden="true"`.
- A visually-hidden `<span aria-live="polite">` sibling outside the `<button>` announces the new theme to screen readers after each toggle.
- Astro version includes an inline `<script is:inline>` for FOUC prevention
- All `window`/`localStorage` access is SSR-safe (`typeof window !== 'undefined'` guards in `theme.ts`)

BEM classes: `.theme-toggle`, `.theme-toggle--dark`, `.theme-toggle__icon`, `.theme-toggle__wrapper`

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
- **Vite**: `7.3.1` (via `@vitejs/plugin-react`)
- **@vitejs/plugin-react**: `5.1.4`

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