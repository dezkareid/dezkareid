# Plan: Improve Accessibility and Design for Design System Components

## Architecture Overview

All changes are confined to `design-system/components`. No new dependencies are introduced. The work follows the existing conventions exactly:
- CSS changes live in `src/css/*.module.css` (BEM + OOCSS, design tokens only)
- Type changes live in `src/shared/types/*.ts`
- React changes live in `src/react/<Component>/index.tsx` + `index.test.tsx`
- Astro and Vue implementations mirror the React API changes (same props, same ARIA attributes)
- `AGENTS.md` is updated last to reflect the new component APIs

The four components are independent of each other — each can be changed and tested in isolation. The work is ordered by complexity (simplest first) to allow incremental validation.

### Key technical decisions from spec

1. **Tag a11y** — No component-level indicator injected. Document via `aria-label` convention; update tests to assert forwarding.
2. **Warning token** — Use `TODO: Propose --color-warning` annotation in CSS with a raw `#f59e0b` (amber-500) fallback, plus a `--color-base-yellow-500` reference comment so the token path is explicit.
3. **Card role prop** — Add `role?: AriaRole` to `CardProperties` interface. The existing `{...rest}` spread already forwards it; the explicit prop makes it IDE-discoverable.
4. **ThemeToggle icon** — Inline SVG paths for sun and moon, rendered inside the `<button>` alongside the text label.

---

## Implementation Phases

### Phase 1 — Button

**Goal:** Add focus ring and `aria-disabled` support.

#### 1.1 CSS (`src/css/button.module.css`)
- Add `:focus-visible` rule to `.button` with `outline: 2px solid var(--color-primary)` and `outline-offset: 2px`. Use `box-shadow` as a secondary fallback.
- Add `box-shadow` to the `transition` property so the focus ring animates.
- No changes to existing variant or size rules.

#### 1.2 React (`src/react/Button/index.tsx`)
- Add `aria-disabled={disabled}` attribute alongside the native `disabled` prop.

#### 1.3 Astro (`src/astro/Button/index.astro`)
- Add `aria-disabled={!href && disabled}` to the rendered `<Tag>` element.

#### 1.4 Vue (`src/vue/Button/index.vue`)
- Add `:aria-disabled="disabled"` to the `<button>` element.

#### 1.5 Tests (`src/react/Button/index.test.tsx`)
- Add: `aria-disabled` is present when `disabled=true`.
- Add: button has a `focus-visible` class or focus ring style (test via `toHaveAttribute`/ class assertion).

---

### Phase 2 — Tag

**Goal:** Add `warning` variant; update types; document `aria-label` convention in tests.

#### 2.1 Types (`src/shared/types/tag.ts`)
- Add `'warning'` to `TagVariant`.

#### 2.2 CSS (`src/css/tag.module.css`)
- Change `.tag` `border-radius` from `var(--spacing-4)` to `var(--spacing-12)` for pill-like shape.
- Add `.tag--warning` skin rule:
  ```css
  /* TODO: Propose --color-warning token (suggest amber-500 #f59e0b for light, amber-900 for dark) */
  .tag--warning {
    background-color: #f59e0b;
    color: var(--color-text-inverse);
  }
  ```

#### 2.3 React (`src/react/Tag/index.tsx`)
- No logic change needed — `variant` is already spread into class names. The new `'warning'` value flows through automatically once the type and CSS exist.

#### 2.4 Astro + Vue
- No changes needed — same as React: variant is passed through to class lookup.

#### 2.5 Tests (`src/react/Tag/index.test.tsx`)
- Add: renders `warning` variant with correct class.
- Add: `aria-label` is forwarded to the root `<span>` (confirms consumer-driven accessible label pattern).

---

### Phase 3 — Card

**Goal:** Replace hardcoded shadow; add flat border; add `role` prop to type.

#### 3.1 Types (`src/shared/types/card.ts`)
- Add `role?: React.AriaRole` (import `AriaRole` from `react` in the shared type, or use `string` to stay framework-agnostic — prefer `string` since this file is shared with Astro/Vue).

#### 3.2 CSS (`src/css/card.module.css`)
- Replace raw `box-shadow` in `.card--raised` with a `TODO` annotation:
  ```css
  /* TODO: Propose --shadow-raised token to design-tokens (suggest 0 2px 8px rgba(0,0,0,0.12)) */
  .card--raised {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
  ```
  (Comment already exists; ensure it is present and accurate — no functional change here.)
- Add border to `.card--flat`:
  ```css
  /* TODO: Propose --color-border token to design-tokens (suggest var(--color-background-secondary)) */
  .card--flat {
    box-shadow: none;
    border: 1px solid var(--color-background-secondary);
  }
  ```

#### 3.3 React (`src/react/Card/index.tsx`)
- No logic change — `role` is already forwarded via `{...rest}` since it is a valid HTML attribute. The type change in `CardProperties` makes it IDE-discoverable without requiring any JSX edit.

#### 3.4 Astro + Vue
- No logic change — same forwarding already in place via spread.

#### 3.5 Tests (`src/react/Card/index.test.tsx`)
- Add: `role` prop is forwarded to root element.
- Add: `card--flat` renders (smoke test for the new border class).

---

### Phase 4 — ThemeToggle

**Goal:** Add inline SVG icons; add `aria-live` announcement region.

#### 4.1 React (`src/react/ThemeToggle/index.tsx`)
- Extract sun SVG and moon SVG as inline constants (simple `<svg>` paths, `aria-hidden="true"` since the button already has `aria-label`).
- Add a visually-hidden `<span aria-live="polite">` outside the button (or inside as an `aria-live` region) that outputs the current theme text — this ensures screen readers announce the change after toggle without re-reading the button label.
- Replace the plain text `{isDark ? 'Dark' : 'Light'}` with `{icon} {label}`.

#### 4.2 CSS (`src/css/theme-toggle.module.css`)
- Add `.theme-toggle__icon` structure rule: `width: 1em; height: 1em; flex-shrink: 0;` — keeps icon sized relative to font.
- Add `.sr-only` utility rule for the live region:
  ```css
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  ```

#### 4.3 Astro (`src/astro/ThemeToggle/index.astro`)
- Add SVG icons alongside text label (static — Astro version renders server-side, initial theme from inline script).
- Add `aria-live="polite"` region.

#### 4.4 Vue (`src/vue/ThemeToggle/index.vue`)
- Add SVG icon components or inline SVG rendered via computed `isDark`.
- Add `aria-live="polite"` region.

#### 4.5 Tests (`src/react/ThemeToggle/index.test.tsx`) — create new file
- Add: renders button with `aria-label`.
- Add: `aria-pressed` is false initially (light mode).
- Add: after click, `aria-pressed` is true and `aria-label` changes to "Switch to light mode".
- Add: `aria-live` region is present in the DOM.
- Add: SVG icon is rendered (`aria-hidden="true"`).

---

### Phase 5 — Documentation

**Goal:** Update `AGENTS.md` to reflect all new APIs.

- **Button**: document `aria-disabled` behaviour.
- **Tag**: document `warning` variant; document `aria-label` convention for semantic variants.
- **Card**: document `role` prop in the props table.
- **ThemeToggle**: document inline SVG icons and `aria-live` region behaviour.

---

## Technical Dependencies

| Dependency | Version | Already present? |
|---|---|---|
| React | 19.2.4 | Yes |
| @testing-library/react | 16.3.2 | Yes |
| @testing-library/user-event | (existing) | Yes |
| vitest | 4.0.18 | Yes |
| classnames | (existing) | Yes |
| @dezkareid/design-tokens | (workspace) | Yes |

No new packages are required.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| `aria-live` region causes double-announcement in some screen readers if placed inside the button | Place it as a sibling element outside the `<button>`, not inside it |
| Raw `#f59e0b` warning colour fails WCAG AA against white text at small sizes | Verify contrast ratio; if needed use a darker amber shade (`#b45309`) and annotate the TODO accordingly |
| CSS Modules hashing means `.sr-only` class name is scoped — may conflict with consumer-level sr-only utilities | This is fine; the scoped class only applies within the ThemeToggle component |
| Astro `is:inline` script for FOUC prevention may not reflect SVG icon changes | No change to the inline script is needed — icon is part of the rendered HTML, not the script |
| Vue version imports `ButtonProps` (not `ButtonProperties`) — inconsistent naming with React type | Both names are exported; no change needed, just note the alias |

---

## Out of Scope

- Design token additions to `design-system/design-tokens`
- Storybook stories
- New components
- End-to-end / Chromatic visual regression tests
- `main-website` or any other app/package changes
