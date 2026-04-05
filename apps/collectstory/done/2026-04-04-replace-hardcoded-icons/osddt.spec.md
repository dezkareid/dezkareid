# Feature Specification: Replace Hardcoded Icons with Design System Icons

## Overview

`apps/collectstory` currently uses two heterogeneous icon systems: hand-authored inline SVGs and Google Material Symbols loaded via CSS class names (`.material-symbols-outlined`). Neither of these is managed by the design system, leading to visual inconsistency, accessibility gaps, and a maintenance burden separate from the rest of the UI.

The goal of this feature is to replace all icon usages in `apps/collectstory` with components from `@dezkareid/icons/react`, the official icon library of the design system. Where a required icon does not exist in `@dezkareid/icons`, it must be added to the library first so that the library remains the single source of truth.

## Business Context

This feature aligns with the following company outcomes and architecture principles:

**Company Outcomes:**
- **High-Quality User Experience** — Achieving a "High Quality" rating and 100% accessibility compliance requires consistent, accessible icon usage. The current Material Symbols approach relies on a font-based system that can introduce rendering inconsistencies and missing icons in offline or font-blocked environments.
- **Efficiency & Velocity** — Standardising on `@dezkareid/icons` increases delivery velocity by 20% through shared, reusable design patterns across all products.

**Architecture Principles:**
- **Simplicity over Complexity** — Eliminating two ad-hoc icon systems (inline SVGs + Material Symbols) in favour of a single, typed library reduces cognitive overhead and eliminates duplicated code.
- **Modularity** — `@dezkareid/icons` provides tree-shakeable, individually importable components. Replacing class-based strings with typed imports makes icons statically verifiable and independently replaceable.
- **Universal Accessibility** — The design system icon components enforce accessibility contracts (aria-hidden by default, aria-label + role="img" when a label is provided). Material Symbols class names offer no such contract.
- **Configuration-Driven Behavior** — Icon identity and appearance should be encoded in code imports (type-checked), not magic strings like `"inventory_2"`.

## Requirements

1. All icons rendered in `apps/collectstory` must be imported from `@dezkareid/icons/react`.
2. The Google Material Symbols font dependency must be removed from the application.
3. The duplicated inline SVG checkmark icon (used independently in `VerifiedBadge.tsx` and `VerifiedToggle.tsx`) must be replaced by a single import of the `Check` icon component from `@dezkareid/icons/react`.
4. `ShelvesIcon` (`components/icons/ShelvesIcon.tsx`) must be migrated to `@dezkareid/icons` as `shelves.svg`, following the same SVG authoring conventions as all other icons (24×24 viewBox, `fill="currentColor"`, no hardcoded colours or size attributes). The collectstory-local component must be removed after migration.
5. For every Material Symbols icon currently used (`chevron_left`, `chevron_right`, `share`, `public`, `inventory_2`, `monitoring`), a visual equivalent must exist in `@dezkareid/icons`. If no equivalent exists, the missing icon must be added to `design-system/icons/src/svg/` before use in collectstory.
6. Mock data that stores icon identifiers as Material Symbols name strings must be updated to store references compatible with the design system icon library.
7. Replaced icons must preserve the same visual affordance and user-facing meaning as the icons they replace.
8. All icons used in interactive or meaningful contexts must include an accessible label; purely decorative icons must remain hidden from assistive technologies.

## Scope

### In Scope
- Removing the Material Symbols font/CSS dependency from `apps/collectstory`
- Replacing `<span className="material-symbols-outlined">...</span>` usages in:
  - `components/landing/Features.tsx` (icons: `inventory_2`, `monitoring`, `share`)
  - `components/landing/Footer.tsx` (icons: `share`, `public`)
  - `components/landing/LatestArrivals.tsx` (icons: `chevron_left`, `chevron_right`)
- Replacing the duplicate inline SVG checkmark in `VerifiedBadge.tsx` and `VerifiedToggle.tsx` with `<Check />` from `@dezkareid/icons/react`
- Updating `lib/mock-data.ts` feature icon references from Material Symbols strings to a design-system-compatible format
- Adding missing icons to `design-system/icons/src/svg/`: `share.svg`, `globe.svg`, `box.svg`, `chart.svg`, and `shelves.svg` (migrated from the local `ShelvesIcon` component)
- Rebuilding `@dezkareid/icons` after adding new SVGs

### Out of Scope
- Any icon usage in packages outside `apps/collectstory`
- Redesigning or restyling any existing UI component beyond the icon swap
- Adding an Astro or Vue entry point to `@dezkareid/icons`

## Acceptance Criteria

1. **No Material Symbols dependency**: The application no longer imports or references Google Material Symbols (no font link tag, no `material-symbols-outlined` class name, no Material Symbols string literals).
2. **All utility icons from design system**: Every rendered icon (except `ShelvesIcon`) is a React component imported from `@dezkareid/icons/react`.
3. **No duplicate SVG definitions**: The checkmark SVG defined inline in `VerifiedBadge.tsx` and `VerifiedToggle.tsx` is replaced by the shared `Check` component; the inline SVG markup is removed.
4. **Type-safe icon references**: Icon identity is expressed as TypeScript imports, not as runtime strings. The build fails if a non-existent icon is referenced.
5. **Accessibility preserved**: Icons in meaningful contexts (e.g. navigation arrows, verified badge) carry an `aria-label`; decorative icons are `aria-hidden`.
6. **Visual parity**: The replaced icons are visually equivalent in meaning to the icons they replace (e.g. chevron arrows remain directional, verification check remains a check).
7. **Design system icons build clean**: `pnpm turbo run build --filter=@dezkareid/icons` completes without errors after any new SVGs are added.
8. **Collectstory builds clean**: `pnpm turbo run build --filter=@dezkareid/collectstory` completes without errors.


## Research Summary

- **Current icon systems in collectstory**: Two — (1) hand-authored inline SVGs (`ShelvesIcon`, `VerifiedBadge`, `VerifiedToggle`) and (2) Material Symbols CSS class-based icons in landing components and mock data.
- **Design system icon library**: `@dezkareid/icons` is production-ready with 24 icons. React components are tree-shakeable, typed, and enforce accessibility. Icons are sized via `--icon-size` CSS custom property and colored via `currentColor`.
- **Coverage gap**: `chevron_left` / `chevron_right` → `ChevronLeft` / `ChevronRight` (available). `check` → `Check` (available). `share`, `public`, `inventory_2`, `monitoring`, and the local `ShelvesIcon` have no equivalents yet — new SVGs will be added.
- **No external icon library**: `apps/collectstory` has no installed icon package (no lucide-react, heroicons, etc.) — `@dezkareid/icons` would be the first and only icon dependency.

## Decisions

1. **`share` and `public` icons**: Add new SVGs (`share.svg`, `globe.svg`) to `@dezkareid/icons`. The icons package is the source of truth and centralises all SVG optimisations — no workarounds in the consuming app.
2. **`inventory_2` and `monitoring` icons**: Add new SVGs to `@dezkareid/icons` (e.g. `box.svg` for inventory, `chart.svg` for monitoring). Both are domain-relevant enough to belong in the shared library.
3. **Mock data icon format**: Refactor `lib/mock-data.ts` to store React component references directly (not strings), removing the need for any runtime string-to-component mapping.

## Session Context

- Feature scope was confirmed as `apps/collectstory` only.
- The worktree for this feature is at `.bare/replace-hardcoded-icons/apps/collectstory`.
- `ShelvesIcon` was initially considered out of scope as a brand illustration, but was subsequently included — it will be migrated to `@dezkareid/icons` as `shelves.svg` for SVG optimisation consistency, and the local component removed.
