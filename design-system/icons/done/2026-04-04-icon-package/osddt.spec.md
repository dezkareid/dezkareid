# Feature Specification: Icon Package

## Overview

The `@dezkareid/icons` package currently exists as an empty scaffold (`design-system/icons/`) with no icons or meaningful exports. The goal is to build a fully functional icon package that centralizes and standardizes icons across all platforms and packages in the monorepo.

Without a shared icon package, each app or component would either inline SVGs ad-hoc, reach for different third-party icon libraries, or duplicate assets — leading to visual inconsistency, bundle bloat, and no single source of truth for iconography.

## Requirements

1. **Consumers can import individual icons by name** — each icon is a named export so consumers only bundle the icons they use.
2. **Icons work in all supported frameworks** — React (including React Server Components), Astro, and Vue consumers can render icons without framework-specific glue code.
3. **Icons are styled via CSS custom properties** — size and color are controllable through CSS, defaulting to the current text color and a standard size from `@dezkareid/design-tokens`.
4. **Icons are accessible by default** — each icon accepts an optional accessible label; when no label is provided the icon is hidden from assistive technology.
5. **Icons are visually consistent** — all icons share the same grid, stroke weight, and style (outline vs filled) so they look cohesive when used together.
6. **Consumers can discover available icons** — the package exports a typed list of all icon names so IDEs can autocomplete and consumers know what is available without consulting external docs.
7. **Adding a new icon does not require manual wiring** — placing a new SVG source file in the correct location is sufficient for it to be included in the next build.
8. **The package is tree-shakeable** — importing one icon does not force the browser to download all icons.

## Scope

### In scope
- SVG-based icon components for React (client and server), Astro, and Vue
- A curated initial set of icons covering common UI needs (navigation, actions, status, media)
- TypeScript types for icon names and component props
- CSS custom properties for size and color control
- Accessibility support (aria-label / aria-hidden)
- Build output integrated into the monorepo Turborepo pipeline
- Storybook stories for the icon set (within `ui-tools/storybook-react`)

### Out of scope
- Icon fonts or sprite sheets (SVG components only)
- Custom icon upload or runtime icon registration
- Animated icons
- Brand / logo icons (those remain in each app's own assets)
- Figma or design-tool integration

## Acceptance Criteria

1. `import { ArrowRight } from '@dezkareid/icons/react'` renders a valid React element with no additional setup.
2. `import { ArrowRight } from '@dezkareid/icons/astro'` renders in an Astro component with no additional setup.
3. `import { ArrowRight } from '@dezkareid/icons/vue'` renders in a Vue SFC with no additional setup.
4. An icon with no `label` prop renders with `aria-hidden="true"` and no accessible name.
5. An icon with `label="Go forward"` renders with `aria-label="Go forward"` and `role="img"`.
6. Setting `style="--icon-size: 32px"` on the icon element changes its rendered size.
7. Setting `color: red` on a parent element causes the icon to inherit that color by default.
8. Running `pnpm turbo run build --filter=@dezkareid/icons` succeeds and produces output in `dist/`.
9. A Storybook story renders the full icon catalog in a grid.
10. TypeScript consumers get an error when referencing a non-existent icon name.


## Decisions

1. **Icon source**: Icons will be authored from scratch (no third-party icon set as base).
2. **Naming convention**: Source SVG files use kebab-case (`arrow-right.svg`); these map to PascalCase named exports (`ArrowRight`).
3. **Angular support**: Deferred — no `@dezkareid/icons/angular` entry point in this iteration.
4. **Icon sizing scale**: Size is controlled via a free CSS custom property (`--icon-size: 24px`); no constrained size prop.

## Session Context

- Package location: `design-system/icons/` (alongside `design-tokens` and `components`)
- Package name: `@dezkareid/icons`
- The scaffold already exists with `package.json`, `tsconfig.json`, `vitest.config.ts`, and an empty `src/index.ts`
- Current build tooling in the scaffold uses `tsup`, but this may be revisited in the plan to align with the rest of the design system (Rollup)
- The monorepo uses `pnpm` + Turborepo; all tasks must be run from the repo root
- The `@dezkareid/components` package's multi-framework pattern (react / astro / vue / angular entry points) is the established model to follow
