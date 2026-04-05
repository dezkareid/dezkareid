# Feature Specification: Astro Icon Export for `@dezkareid/icons`

## Overview

`@dezkareid/icons` currently exports icons only as React components (`@dezkareid/icons/react`). The `main-website` (an Astro application) and other Astro-based apps cannot consume this entry point — they embed raw inline SVG markup copied from third-party sources (e.g. Heroicons), bypassing the design system entirely.

This feature adds an **Astro entry point** (`@dezkareid/icons/astro`) to `@dezkareid/icons`, enabling Astro applications to import typed, SVGO-optimised, accessibility-ready icon components directly from the design system. The goal is to eliminate scattered, ad-hoc SVG markup across Astro apps and establish `@dezkareid/icons` as the single source of truth for all icons.

## Business Context

**Company outcomes alignment:**

- **High-Quality User Experience**: A centralised icon library ensures consistent sizing, colour inheritance, and accessibility attributes (ARIA) across all products. Ad-hoc inline SVGs currently diverge in implementation (e.g. hardcoded `width`/`height`, inconsistent `aria-hidden` usage).
- **Efficiency & Velocity**: Standardising icon delivery through the design system reduces per-app icon maintenance effort and accelerates the addition of new icons across all products simultaneously.
- **Operational Excellence**: Replacing scattered SVG copies with a single versioned package reduces the surface area for visual regressions and accessibility defects.

**Architecture principles alignment:**

- **Statelessness and Modularity**: A dedicated Astro entry point keeps the icon library modular and framework-independent — React and Astro consumers share the same SVG source, diverging only at the component wrapper layer.
- **Documentation as a Primary Artifact**: The feature must ship with updated `README.md` and `AGENTS.md` documentation so the new entry point is discoverable by both human developers and AI agents.
- **Universal Accessibility**: Astro icon components must carry the same accessibility guarantees as their React counterparts (controlled `aria-hidden`/`aria-label` behaviour).

## Requirements

1. `@dezkareid/icons` must expose an `@dezkareid/icons/astro` entry point that Astro applications can import.
2. Each icon available under `@dezkareid/icons/react` must also be available under `@dezkareid/icons/astro` with an equivalent name (e.g. `ArrowRight`).
3. Astro icon components must accept at minimum: a `label` prop (string, optional) for accessible naming, and a `class` prop for external CSS class composition.
4. When `label` is omitted, the icon must be hidden from assistive technology (`aria-hidden="true"`).
5. When `label` is provided, the icon must be announced with that label (`aria-label` + `role="img"`).
6. Icon size must be controlled exclusively via the `--icon-size` CSS custom property (defaulting to `1em`), consistent with the React entry point.
7. Icon colour must always inherit from the surrounding context (`currentColor`).
8. The build pipeline must generate Astro components from the same `src/svg/` SVG sources used for the React entry point — no duplication of SVG source files.
9. Adding a new SVG to `src/svg/` must automatically produce both a React and an Astro component on the next build, without additional manual wiring.
10. The `main-website` must be updated to import at least one icon from `@dezkareid/icons/astro` as a proof of integration (replacing an existing inline SVG).

## Scope

### In scope
- New `@dezkareid/icons/astro` package export (built as part of the existing `@dezkareid/icons` build).
- Code-generation script update to emit `.astro` component files alongside `.tsx` files.
- `main-website` dependency on `@dezkareid/icons` and integration of the Astro entry point.
- Updated `README.md` and `AGENTS.md` for `@dezkareid/icons` documenting the new entry point.

### Out of scope
- Vue entry point (`@dezkareid/icons/vue`) — deferred.
- Angular entry point (`@dezkareid/icons/angular`) — deferred.
- Storybook stories for Astro components.
- Full migration of all inline SVGs in `main-website` — a single integration proof is sufficient.
- `collectstory` integration — deferred to a future iteration.

## Acceptance Criteria

1. `import { ArrowRight } from '@dezkareid/icons/astro'` resolves successfully in an Astro file without TypeScript errors.
2. Rendering an Astro icon component without `label` produces an `<svg>` with `aria-hidden="true"` and no `aria-label`.
3. Rendering an Astro icon component with `label="Go right"` produces an `<svg>` with `aria-label="Go right"` and `role="img"`.
4. The rendered icon width and height respond to `--icon-size` and default to `1em` when that variable is unset.
5. The icon renders in the colour of its parent element (i.e. uses `currentColor`).
6. Running `pnpm turbo run build --filter=@dezkareid/icons` completes without errors and produces `dist/astro.mjs` and `dist/astro.d.mts`.
7. Running `pnpm turbo run build --filter=@dezkareid/main-website` succeeds after `@dezkareid/icons` is added as a dependency.
8. At least one component in `main-website` imports an icon from `@dezkareid/icons/astro` and renders it correctly in the browser.
9. `README.md` and `AGENTS.md` for `@dezkareid/icons` document the `./astro` entry point, its props, and usage example.

## Decisions

1. **Astro component output format**: Raw `.astro` source files, compiled by the consumer's Astro toolchain — consistent with the `@dezkareid/components/astro` precedent.
2. **`collectstory` integration**: `main-website` only for this iteration; `collectstory` is deferred.
3. **Social/brand icons**: GitHub, LinkedIn, and RSS must be added to `src/svg/`. Pixel-crab is excluded — it uses multi-colour fills incompatible with `currentColor` and remains inline.
