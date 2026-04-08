# @dezkareid/components

A multi-framework UI component library (React, Astro, Vue, Angular) that exports accessible, themeable, production-grade UI components. It is part of the `dezkareid` monorepo and is the component layer built on top of `@dezkareid/design-tokens`.

## Overview

Always use Context7 MCP when I need external library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## Skills

The following skills **must** be invoked when working on this package:

| Skill | When to use |
|---|---|
| `design-tokens` / `design-system:design-tokens` | Before choosing any color, spacing, or typography value — provides the authoritative token list |
| `frontend-design` | When building or modifying any UI component — produces distinctive, production-grade interfaces |
| `react-best-practices` / `frontend-tools:react-best-practices` | When writing or reviewing React components — ensures optimal React/Next.js patterns |
| `accessibility` / `web-quality:accessibility` | When implementing or auditing any component — ensures WCAG 2.2 compliance |
| `react-components` / `frontend-tools:react-components` | When writing React components based on HTML components |
| `styles-methodology` / `frontend-tools:styles-methodology` | When writing CSS — enforces the project's BEM + OOCSS approach |


## MCP Servers

| MCP | When to use |
|---|---|
| `context7` | When you need documentation for any external library (React, Rollup, Vitest, Angular, Astro, Vue) — do not rely on training data alone |

## Tech Stack & Versions

- **Node**: `>=22` (project runtime)
- **Package manager**: `pnpm` (monorepo-managed via `pnpm-workspace.yaml`)
- **TypeScript**: `5.9.3`
- **React**: `19.2.4` (peer dep: `^18.0.0 || ^19.0.0`)
- **Astro**: `>=6.0.0` (peer dep, optional)
- **Vue**: `^3.0.0` (peer dep, optional)
- **Angular**: `>=21.0.0` (peer dep, optional)
- **Rollup**: `4.56.0` — build tool for React entries
- **ng-packagr**: `21.2.0` — build tool for Angular entry (Angular Package Format)
- **Vite**: `7.3.1` (via `@vitejs/plugin-react`)
- **Vitest**: `4.0.18`
- **React Testing Library**: `16.3.2`
- **jsdom**: `28.0.0`
- **ESLint**: `9.39.2`
- **Prettier**: `3.8.1`

Always use **exact versions** (no `^` or `~`) when adding new dependencies.

## Project Structure

```
design-system/components/
├── src/
│   ├── react/                  # React components (entry: src/react/index.ts)
│   │   └── <Component>/
│   │       └── index.tsx
│   ├── react-server/           # Server-safe entry (entry: src/react-server/index.ts)
│   │   └── index.ts            # Re-exports Button, Card, Tag only
│   ├── react-client/           # Client-only entry (entry: src/react-client/index.ts)
│   │   └── index.ts            # Re-exports ThemeToggle only
│   ├── astro/                  # Astro components (entry: src/astro/index.ts)
│   │   └── <Component>/
│   │       └── index.astro
│   ├── vue/                    # Vue SFCs (entry: src/vue/index.ts)
│   │   └── <Component>/
│   │       └── index.vue
│   ├── angular/                # Angular components (entry: src/angular/index.ts)
│   │   └── <Component>/
│   │       └── <component>.component.ts
│   ├── css/                    # CSS Modules — one file per component
│   │   ├── <component>.module.css
│   │   └── index.ts            # Imports all modules for the CSS bundle
│   └── shared/
│       ├── js/                 # Framework-agnostic JS utilities (e.g. theme.ts)
│       └── types/              # Shared TypeScript interfaces for all components
│           └── <component>.ts
├── dist/                       # Build output (git-ignored)
├── rollup.config.mjs           # Rollup build config (React entries)
├── ng-package.json             # Angular Package Format config
├── vitest.config.mts           # Vitest config (Angular tests only)
├── setup-tests.ts              # Vitest global setup
└── package.json
```

### Package Exports

| Export | Points to | Compiled? | Notes |
|---|---|---|---|
| `@dezkareid/components/react` | `dist/react/index.js` | Yes — Rollup ESM, `preserveModules` | All components. For non-Next.js React consumers. |
| `@dezkareid/components/react-server` | `dist/react-server/index.js` | Yes — Rollup ESM, `preserveModules` | `Button`, `Card`, `Tag` only. Safe for Next.js Server Components. No `'use client'`. |
| `@dezkareid/components/react-client` | `dist/react-client/index.js` | Yes — Rollup ESM, `preserveModules` | `ThemeToggle` only. Every emitted file starts with `'use client'` (injected via Rollup `output.banner`). |
| `@dezkareid/components/astro` | `src/astro/index.ts` | No — compiled by Astro | |
| `@dezkareid/components/vue` | `src/vue/index.ts` | No — compiled by Vite/Vue | |
| `@dezkareid/components/angular` | `dist/angular/index.d.ts` | Yes — Angular Package Format (APF) | Pre-compiled for Angular 21+ |
| `@dezkareid/components/css` | `dist/components.min.css` | Yes — CSS Modules extracted via `rollup-plugin-postcss` | |

## Development

### Component Architecture

Each component is a **self-contained unit** implemented once per framework. There is no shared runtime abstraction — each framework renders its own native implementation (`tsx`, `.astro`, `.vue`, `.ts`) sharing only the CSS module and TypeScript types.

A complete component set requires these files:

| File | Purpose |
|---|---|
| `src/shared/types/<component>.ts` | Shared TypeScript props interface across all frameworks |
| `src/css/<component>.module.css` | BEM + OOCSS styles using design tokens exclusively |
| `src/react/<Component>/index.tsx` | React implementation |
| `src/astro/<Component>/index.astro` | Astro implementation |
| `src/vue/<Component>/index.vue` | Vue SFC implementation |
| `src/angular/<Component>/<component>.component.ts` | Angular Standalone Component |

Each component must support:
- Multi-theme (light/dark via design tokens)
- Mobile-first responsive design
- Accessibility / WCAG 2.2
- Performance-focused (minimal JS, CSS Modules scoping)

### Design Tokens & Theme

All visual values (colors, spacing, typography) come exclusively from `@dezkareid/design-tokens`. **Never hardcode hex, rgb, or px values.**

- In CSS: use CSS custom properties — `var(--color-primary)`, `var(--spacing-4)`, etc.
- Use **semantic tokens** (`--color-text-primary`, `--color-background-secondary`) for automatic light/dark support — they resolve differently per `color-scheme`.
- Use the `design-tokens` skill for the authoritative list of available tokens.
- When a needed token does not exist, use the closest base token and add a comment:
  ```css
  /* TODO: Propose --color-warning token to @dezkareid/design-tokens */
  ```

### Storybook

Components are previewed and documented in `ui-tools/storybook-react/`. Run from the monorepo root:

```bash
pnpm turbo run storybook --filter=storybook-react
# Opens at http://localhost:6006
```

Always verify visual output in Storybook after creating or modifying a component.

### Build

The build is split into two tools:

**Rollup** (React entries, CSS extraction):
```bash
pnpm turbo run build --filter=@dezkareid/components
```

Rollup exports three configs from `rollup.config.mjs`:
1. `react` config — extracts CSS to `dist/components.min.css`
2. `react-server` config — no CSS (avoids duplication), no banner
3. `react-client` config — no CSS, injects `'use client';` banner on every emitted file

**Angular (ng-packagr)** — runs automatically after Rollup as `build:angular`.

Key build notes:
- Rollup 4 strips `"use client"` directives by default — the `react-client` config uses `output.banner` to re-inject it.
- CSS class names are scoped (hashed) by `postcss-modules`. JS proxy files in `dist/css/` export the class name map.
- Consumers must import `@dezkareid/components/css` once at their app root — styles are not auto-injected.

### Development Commands

Always run from the monorepo root via Turborepo:

```bash
# Build the package (resolves internal deps automatically)
pnpm turbo run build --filter=@dezkareid/components

# Run tests
pnpm turbo run test --filter=@dezkareid/components

# Lint
pnpm turbo run lint --filter=@dezkareid/components

# Fix lint issues
pnpm turbo run lint:fix --filter=@dezkareid/components
```

## Coding Standards & Style

### CSS Conventions

Use the `styles-methodology` skill when writing CSS. The two core methodologies are:

- **BEM** — for class naming: `.block`, `.block--modifier`, `.block__element`. BEM encodes component structure and state directly in the class name, making styles predictable and collision-free.
- **OOCSS** — for splitting responsibilities: separate structure classes (layout, sizing, spacing) from skin classes (colour, border, shadow). This allows structural styles to be reused across variants without duplicating rules.

Additional rules:
- All values must use CSS custom properties from `@dezkareid/design-tokens` — never hardcode hex, rgb, or px
- Use semantic tokens for automatic light/dark support
- Expose per-component CSS custom properties for consumer overrides (see component docs below)

### TypeScript

- Strict mode is on. No `any` unless unavoidable.
- Shared props interfaces live in `src/shared/types/` and are imported by each framework implementation.
- Use `React.HTMLAttributes` forwarding on interactive components so consumers can pass native attributes.

### ESLint

Uses `@dezkareid/eslint-config-ts-base` (ESLint 9 flat config). Run `pnpm turbo run lint --filter=@dezkareid/components` before committing.

### Commit Messages

Follow Conventional Commits with the package scope:
```
feat(components): add Avatar component
fix(components): correct focus-visible outline on Button
```

Never commit directly to `main`. Always branch and PR.

## Testing Conventions

### Test Runners

| Framework | Runner | Config |
|---|---|---|
| Angular | Vitest + `@analogjs/vitest-angular` | `vitest.config.mts` |
| React | Vitest + React Testing Library | (no separate config — uses Vite defaults via `@vitejs/plugin-react`) |

### File Conventions

- Angular tests: `src/angular/<Component>/<component>.component.spec.ts`
- React tests: `src/react/<Component>/index.test.tsx`

### Setup

`setup-tests.ts` initialises:
- `@testing-library/jest-dom` matchers
- Angular `TestBed` with `BrowserTestingModule`
- `matchMedia` mock (required for ThemeToggle SSR-safety tests)

### What to Test

Each component test should cover:
- Renders without errors for all `variant` / prop combinations
- Accessibility: correct `role`, `aria-*` attributes, `disabled` propagation
- User interaction: click handlers, toggle state (ThemeToggle)
- CSS class application: verify BEM modifier classes are applied per prop

### Running Tests

```bash
pnpm turbo run test --filter=@dezkareid/components
```

## Debugging

### Common Build Issues

| Symptom | Cause | Fix |
|---|---|---|
| `'use client'` missing from `dist/react-client/` | Rollup 4 strips directives | Confirm `output.banner: "'use client';"` is set in `rollup.config.mjs` for the `react-client` config |
| CSS classes not found at runtime | CSS Modules hash mismatch between build runs | Delete `dist/` and rebuild: `pnpm turbo run build --filter=@dezkareid/components` |
| Angular build fails with type errors | `@angular/compiler-cli` version mismatch | Check `ng-packagr` and `@angular/compiler-cli` versions match in `package.json` |
| Vitest cannot resolve `.astro` or `.vue` imports | Test config imports a framework file not in scope | Ensure Angular specs only import Angular files; React tests only import React files |
| Design token CSS variables resolve to empty | Consumer hasn't imported `@dezkareid/components/css` | Add `import '@dezkareid/components/css'` at the app root |

### Verbose Build Output

```bash
# Rollup with verbose logging
node_modules/.bin/rollup -c rollup.config.mjs --bundleConfigAsCjs

# ng-packagr verbose
node_modules/.bin/ng-packagr -p ng-package.json --verbose
```

### Checking the Dist Output

After a build, verify the expected files exist:
```bash
ls dist/react/        # Should contain .js + .d.ts per component
ls dist/react-server/
ls dist/react-client/
ls dist/angular/
ls dist/components.min.css
```

## Available Components

### Button

File: `src/react/Button/index.tsx` | `src/astro/Button/index.astro` | `src/vue/Button/index.vue` | `src/angular/Button/button.component.ts`
Types: `src/shared/types/button.ts` | CSS: `src/css/button.module.css`

Props:
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success'` — default `'primary'`
- `size?: 'sm' | 'md' | 'lg'` — default `'md'`
- `disabled?: boolean` — default `false`
- Forwards all native `<button>` HTML attributes

Accessibility:
- Sets both `disabled` and `aria-disabled={disabled}` so screen readers announce the state.
- `:focus-visible` outline uses `var(--color-primary)` — never removed.

BEM classes: `.button`, `.button--primary`, `.button--secondary`, `.button--outline`, `.button--ghost`, `.button--success`, `.button--sm`, `.button--md`, `.button--lg`, `.button--disabled`

Component custom properties:
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

### Tag

File: `src/react/Tag/index.tsx` | `src/astro/Tag/index.astro` | `src/vue/Tag/index.vue` | `src/angular/Tag/tag.component.ts`
Types: `src/shared/types/tag.ts` | CSS: `src/css/tag.module.css`

Props:
- `variant?: 'default' | 'success' | 'danger' | 'warning'` — default `'default'`
- Accepts arbitrary `children`/slot content

Accessibility:
- Consumers must provide `aria-label` when variant colour conveys status (e.g. `<Tag variant="danger" aria-label="Error: item rejected">`).

BEM classes: `.tag`, `.tag--default`, `.tag--success`, `.tag--danger`, `.tag--warning`

Component custom properties:
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

Note: `--color-warning` token is proposed but not yet in `@dezkareid/design-tokens`; currently uses raw `#d97706` (amber-600).

### Card

File: `src/react/Card/index.tsx` | `src/astro/Card/index.astro` | `src/vue/Card/index.vue` | `src/angular/Card/card.component.ts`
Types: `src/shared/types/card.ts` | CSS: `src/css/card.module.css`

Props:
- `elevation?: 'flat' | 'raised'` — default `'raised'`
- `role?: string` — forwarded to root `<div>` (e.g. `role="article"`, `role="region"`)
- Accepts arbitrary `children`/slot content

BEM classes: `.card`, `.card--raised`, `.card--flat`

Note: `--shadow-raised` and `--color-border` tokens are proposed but not yet in `@dezkareid/design-tokens`.

### ThemeToggle

File: `src/react/ThemeToggle/index.tsx` | `src/astro/ThemeToggle/index.astro` | `src/vue/ThemeToggle/index.vue` | `src/angular/ThemeToggle/theme-toggle.component.ts`
Types: `src/shared/types/theme-toggle.ts` | CSS: `src/css/theme-toggle.module.css`
Shared logic: `src/shared/js/theme.ts`

Props:
- `cssProcessor?: 'css' | 'lightningcss'` — default `'css'`
  - `'css'`: sets `document.documentElement.style.colorScheme`. Works with native `light-dark()` (Astro, Vite).
  - `'lightningcss'`: also flips `--lightningcss-light` / `--lightningcss-dark`. Required for Next.js/Turbopack.
- `onChange?: (theme: 'light' | 'dark') => void` — called after each toggle

Behaviour:
- On mount: reads `localStorage.getItem('color-scheme')`; falls back to `prefers-color-scheme`
- On toggle: flips theme → `applyTheme()` → `persistTheme()` → `onChange?.()`
- SVG icons have `aria-hidden="true"`; a visually-hidden `<span aria-live="polite">` announces the new theme
- All `window`/`localStorage` access is SSR-safe (`typeof window !== 'undefined'` guards in `theme.ts`)
- Astro version includes an inline `<script is:inline>` for FOUC prevention

BEM classes: `.theme-toggle`, `.theme-toggle--dark`, `.theme-toggle__icon`, `.theme-toggle__wrapper`

## Documentation

- `README.md` — usage guide for consumers of the package
- `AGENTS.md` — this file; context for AI-assisted development

When a component is created or modified, update both files with the new information.
