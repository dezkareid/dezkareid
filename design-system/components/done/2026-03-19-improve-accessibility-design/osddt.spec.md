# Spec: Improve Accessibility and Design for Design System Components

## Overview

The `@dezkareid/components` design system library ships four UI components — **Button**, **Tag**, **Card**, and **ThemeToggle** — across React, Astro, and Vue. While the components function correctly, they have accessibility gaps and design deficiencies that reduce usability for keyboard and assistive-technology users and weaken the overall visual quality of the system. This feature closes those gaps by applying WCAG 2.2 conformance standards and improving visual design using existing design tokens.

## Requirements

### Accessibility

1. **Button** — The button must expose a visible focus ring that meets a 3:1 contrast ratio against the adjacent background for all variants (primary, secondary, ghost, success). Disabled state must use `aria-disabled="true"` in addition to the native `disabled` attribute so screen readers can announce the state on non-interactive roles.
2. **Tag** — Tags that convey semantic meaning (success, danger) must not rely on colour alone; they must include a visually hidden or icon-supported text indicator accessible to screen readers (e.g., `aria-label` or a visually-hidden prefix).
3. **Card** — Card rendered as a `<div>` must accept and forward an accessible role so consumers can declare the card's semantic purpose (e.g. `role="article"`, `role="region"` with `aria-label`). The component must not assign a default role that misrepresents its content.
4. **ThemeToggle** — The toggle button already has `aria-label` and `aria-pressed`; it must also announce the *current* theme state to screen readers using `aria-live="polite"` or an equivalent technique so users who cannot see the visual change are informed.
5. **All components** — Focus styles must never be removed (`outline: none` is prohibited without a visible replacement). All interactive elements must be reachable and operable by keyboard alone (Tab, Enter/Space as appropriate).
6. **All components** — Colour contrast of text against backgrounds must meet WCAG AA (4.5:1 for normal text, 3:1 for large text and UI components).

### Design

7. **Button** — Add a visible, styled focus ring using `outline` or `box-shadow` with a token-based colour. The transition should include `box-shadow` so the focus ring animates smoothly.
8. **Tag** — Provide a `warning` variant in addition to `default`, `success`, and `danger`, using design-token colours. The tag shape should use a slightly larger border-radius to feel more pill-like.
9. **Card** — Replace the hardcoded `box-shadow` value in `card--raised` with a token reference or a `TODO` annotation proposing a `--shadow-raised` token. Add a `border` to the `card--flat` variant using a semantic border token so it remains visually distinct from the page background.
10. **ThemeToggle** — Replace plain text labels ("Light" / "Dark") with icon + text so the component is visually communicative. The icon can be a Unicode symbol (☀ / ☾) or an inline SVG, rendered alongside the text label.

## Scope

### In scope

- React implementation of all four components (`src/react/`)
- CSS Module files for all four components (`src/css/`)
- Shared TypeScript type files for all four components (`src/shared/types/`)
- Vitest + RTL unit tests for React components (`src/react/*/index.test.tsx`)
- Astro and Vue implementations updated to match React changes (props, ARIA attributes, class names)
- Documentation updates to `AGENTS.md` for changed component APIs

### Out of scope

- New components beyond the existing four
- Changes to the design-token package (`design-system/design-tokens`)
- Storybook stories (not currently authored per component; no stories to update)
- End-to-end or visual regression tests (Chromatic runs are a CI concern)
- Adding a new token to `design-system/design-tokens` (only `TODO` annotations are in scope)

## Acceptance Criteria

1. Running `pnpm test` (or `pnpm vitest`) in `design-system/components` passes all existing and new tests without errors.
2. All interactive components (Button, ThemeToggle) have a visible focus ring when focused via keyboard — no `outline: none` without a styled replacement.
3. The Tag component exposes a screen-reader-accessible indicator for `success` and `danger` variants (confirmed by an automated accessibility assertion in the test).
4. The Card component accepts a `role` prop and forwards it to the root element without requiring consumer workarounds.
5. ThemeToggle announces the new theme after toggle (confirmed via `aria-live` or `aria-pressed` assertion in the test).
6. The `card--raised` hardcoded shadow is replaced by a `TODO` annotation or a token reference.
7. A `warning` variant exists on Tag with a token-based colour.
8. ThemeToggle renders an icon alongside the text label for light and dark states.
9. All modified CSS files use only CSS custom properties from `@dezkareid/design-tokens` — no hardcoded hex, rgb, or px values outside of `TODO`-annotated placeholders.
10. `AGENTS.md` is updated to reflect any new props or variants added.

## Decisions

1. **Tag accessible indicator**: Use `aria-label` override — the component documents that consumers should provide a meaningful `aria-label` when the variant conveys semantic meaning. No visually-hidden prefix or icon is added by the component itself.
2. **Warning token**: Propose `--color-warning` via `TODO` annotation in the CSS; use a raw fallback value in the meantime (neither `--color-warning` nor `--color-accent` exist in the current token set).
3. **Card role default**: Add an explicit `role` prop to the TypeScript interface (`CardProperties`) to make the pattern discoverable, while defaulting to no role. The existing `...rest` spread already forwards it to the DOM.
4. **ThemeToggle icon**: Use inline SVG for the sun (light) and moon (dark) icons — consistent rendering across platforms.
