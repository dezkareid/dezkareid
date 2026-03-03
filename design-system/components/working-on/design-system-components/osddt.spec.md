# Feature Specification: Design System Components

## Overview

Add four foundational UI components — **Button**, **Tag**, **Card**, and **ThemeToggle** — to the `@dezkareid/components` package. These components form the core building blocks of the personal design system, enabling consistent, accessible, and theme-aware UI across all surfaces that consume the package (React, Astro, Vue).

Each component must ship in all three framework formats (React, Astro, Vue), use design tokens for all visual properties, and support light/dark theming automatically.

---

## Requirements

### Button

- Renders a clickable element that triggers an action.
- Supports at least two visual variants: **primary** (filled) and **secondary** (outlined).
- Supports a **disabled** state that prevents interaction and communicates non-interactivity visually.
- Accepts a label via slot/children.
- Must be keyboard-accessible and announce its role to assistive technologies.

### Tag

- Renders a small inline label used to categorise or annotate content.
- Supports at least three semantic colour variants: **default**, **success**, and **danger**.
- Is non-interactive (display only).
- Text content is passed via slot/children.
- Must be readable by assistive technologies (appropriate role/label).

### Card

- Renders a contained surface that groups related content.
- Accepts arbitrary content via slot/children (title, body, actions).
- Provides consistent internal spacing and a distinct background relative to the page.
- Must be usable as a layout container with no fixed height.

### ThemeToggle

- Renders a toggle control that switches the active colour scheme between light and dark.
- The current theme state is reflected visually (icon or label change).
- Toggling persists the preference to `localStorage` under the key `color-scheme`.
- On initial load, reads `localStorage` first; falls back to the OS `prefers-color-scheme` preference.
- Theme is applied by setting `color-scheme` on the `<html>` element (`light` or `dark`).
- Must be keyboard-accessible and communicate its current state to assistive technologies.

---

## Scope

### In scope

- React, Astro, and Vue implementations for all four components.
- Design-token-driven styling (no hardcoded colour or spacing values).
- Automatic light/dark theme support via CSS semantic tokens.
- Accessible markup (keyboard navigation, ARIA roles/attributes where needed).
- Mobile-first responsive behaviour.
- Unit/integration tests for the React implementations.
- TypeScript prop types/interfaces for all components.
- Updated `README.md` and `AGENTS.md` with usage examples for each component.

### Out of scope

- Icon library integration (icons may be addressed as a follow-up).
- Animation or transition systems.
- Complex compound variants (e.g. icon-only Button, loading state).
- Storybook or visual regression tooling.
- Server-side rendering (SSR) specific configuration.

---

## Acceptance Criteria

1. **Button** renders correctly in primary and secondary variants and is disabled when `disabled` is set.
2. **Tag** renders in default, success, and danger variants using the correct semantic colour tokens.
3. **Card** renders its children inside a visually distinct surface with consistent spacing.
4. **ThemeToggle** switches the `color-scheme` attribute on `<html>` and persists the value to `localStorage`.
5. **ThemeToggle** reads `localStorage` on mount and applies the stored value; if absent, applies the OS preference.
6. All components pass accessibility checks (keyboard focus, ARIA) without errors.
7. All components render correctly in both light and dark modes using semantic tokens only.
8. React implementations have passing unit tests.
9. Each component is exported from the appropriate entry point (`react/`, `astro/`, `vue/`).
10. `README.md` includes import and usage examples for all four components.

---

## Decisions

1. **Button sizes**: Button will support three size variants — small, medium, and large — via a `size` prop.
2. **Tag dismissibility**: Tag remains display-only with no close action. It must accept arbitrary content via slot/children (not just a plain text string).
3. **Card elevation**: Card will support two elevation levels — **flat** (no shadow) and **raised** (with shadow) — via an `elevation` prop.
4. **ThemeToggle framework scope**: ThemeToggle will ship in all three framework formats (React, Astro, Vue), consistent with the other components.
