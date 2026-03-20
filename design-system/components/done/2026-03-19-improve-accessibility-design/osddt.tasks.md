# Tasks: Improve Accessibility and Design for Design System Components

## Dependencies

- Phase 1 (Button), Phase 2 (Tag), Phase 3 (Card), and Phase 4 (ThemeToggle) are independent — they can be worked in any order.
- Phase 5 (Docs) depends on all previous phases being complete.
- Within each component phase: CSS and types must be done before tests that assert on class names or prop types.

---

## Phase 1 — Button

**Goal:** Add focus ring and `aria-disabled` support.

- [x] [S] 1.1 Add `:focus-visible` outline rule to `.button` in `src/css/button.module.css` (2px solid `--color-primary`, offset 2px)
- [x] [S] 1.2 Add `box-shadow` to the `transition` property on `.button` so the focus ring animates smoothly
- [x] [S] 1.3 Add `aria-disabled={disabled}` to React `<button>` in `src/react/Button/index.tsx`
- [x] [S] 1.4 Add `aria-disabled={!href && disabled}` to Astro `<Tag>` in `src/astro/Button/index.astro`
- [x] [S] 1.5 Add `:aria-disabled="disabled"` to Vue `<button>` in `src/vue/Button/index.vue`
- [x] [S] 1.6 Add test: `aria-disabled` attribute is present when `disabled=true` (`src/react/Button/index.test.tsx`)

**Definition of Done:** All Button tests pass; disabled button has `aria-disabled="true"`; keyboard focus shows visible ring.

---

## Phase 2 — Tag

**Goal:** Add `warning` variant; pill-like border-radius; document `aria-label` convention.

- [x] [S] 2.1 Add `'warning'` to `TagVariant` in `src/shared/types/tag.ts`
- [x] [S] 2.2 Change `.tag` `border-radius` to `var(--spacing-12)` in `src/css/tag.module.css`
- [x] [S] 2.3 Add `.tag--warning` skin rule with `TODO` annotation for `--color-warning` token (`src/css/tag.module.css`)
- [x] [S] 2.4 Add test: renders `warning` variant with correct BEM class (`src/react/Tag/index.test.tsx`) — create file if it does not exist
- [x] [S] 2.5 Add test: `aria-label` prop is forwarded to the root `<span>` (`src/react/Tag/index.test.tsx`)

**Definition of Done:** Tag renders `warning` class; `aria-label` is forwarded; all Tag tests pass.

---

## Phase 3 — Card

**Goal:** Add `role` prop to type; add flat border; ensure shadow TODO annotation is correct.

- [x] [S] 3.1 Add `role?: string` to `CardProperties` interface in `src/shared/types/card.ts`
- [x] [S] 3.2 Verify/update `TODO` annotation on `.card--raised` shadow in `src/css/card.module.css` (no functional change, annotation must be accurate)
- [x] [S] 3.3 Add `border: 1px solid var(--color-background-secondary)` to `.card--flat` with `TODO` annotation for `--color-border` token (`src/css/card.module.css`)
- [x] [S] 3.4 Add test: `role` prop is forwarded to root `<div>` — create `src/react/Card/index.test.tsx`
- [x] [S] 3.5 Add test: `card--flat` class is applied when `elevation="flat"` (`src/react/Card/index.test.tsx`)

**Definition of Done:** Card accepts `role` prop; flat card has visible border; all Card tests pass.

---

## Phase 4 — ThemeToggle

**Goal:** Add inline SVG sun/moon icons; add `aria-live` sibling region.

- [x] [M] 4.1 Define sun and moon inline SVG constants (`aria-hidden="true"`) in `src/react/ThemeToggle/index.tsx`
- [x] [M] 4.2 Replace plain text label with `{icon} {label}` in the React ThemeToggle button
- [x] [S] 4.3 Add visually-hidden `<span aria-live="polite">` sibling (outside `<button>`) announcing current theme in `src/react/ThemeToggle/index.tsx`
- [x] [S] 4.4 Add `.theme-toggle__icon` structure rule (`width: 1em; height: 1em; flex-shrink: 0`) to `src/css/theme-toggle.module.css`
- [x] [S] 4.5 Add `.sr-only` utility rule for the live region to `src/css/theme-toggle.module.css`
- [x] [M] 4.6 Add sun/moon SVG icons and `aria-live` region to `src/astro/ThemeToggle/index.astro`
- [x] [M] 4.7 Add sun/moon SVG icons and `aria-live` region to `src/vue/ThemeToggle/index.vue`
- [x] [M] 4.8 Create `src/react/ThemeToggle/index.test.tsx` with tests:
  - Renders button with `aria-label`
  - `aria-pressed` is `false` initially (light mode)
  - After click: `aria-pressed` is `true`, `aria-label` changes to "Switch to light mode"
  - `aria-live` region is present in the DOM
  - SVG icon is rendered with `aria-hidden="true"`

**Definition of Done:** ThemeToggle renders sun/moon SVG; `aria-live` sibling announces theme change; all ThemeToggle tests pass.

---

## Phase 5 — Documentation

**Goal:** Update `AGENTS.md` to reflect all changed component APIs.

*Depends on: Phases 1–4 complete.*

- [x] [S] 5.1 Update Button section in `design-system/components/AGENTS.md`: document `aria-disabled` behaviour
- [x] [S] 5.2 Update Tag section in `AGENTS.md`: add `warning` to variant list; document `aria-label` convention for semantic variants
- [x] [S] 5.3 Update Card section in `AGENTS.md`: add `role?: string` to props table
- [x] [S] 5.4 Update ThemeToggle section in `AGENTS.md`: document SVG icons and `aria-live` region behaviour

**Definition of Done:** `AGENTS.md` accurately reflects all new props and variants; no stale information remains.

---

## Phase 6 — Component-level custom properties (Button + Tag)

**Goal:** Expose per-variant colour overrides via CSS custom properties so consumers can restyle individual variants without touching global tokens.

Pattern: each variant declares component-scoped custom properties that fall back to the global design token. Example:
```css
.button--primary {
  --button-primary-color-background: var(--color-primary);
  --button-primary-color-text: var(--color-text-inverse);
  background-color: var(--button-primary-color-background);
  color: var(--button-primary-color-text);
}
```

- [x] [M] 6.1 Add component custom properties to all Button variants in `src/css/button.module.css`:
  - `--button-primary-color-background`, `--button-primary-color-text`
  - `--button-secondary-color-background`, `--button-secondary-color-text`, `--button-secondary-color-border`
  - `--button-ghost-color-background`, `--button-ghost-color-text`
  - `--button-success-color-background`, `--button-success-color-text`
- [x] [M] 6.2 Add component custom properties to all Tag variants in `src/css/tag.module.css`:
  - `--tag-default-color-background`, `--tag-default-color-text`
  - `--tag-success-color-background`, `--tag-success-color-text`
  - `--tag-danger-color-background`, `--tag-danger-color-text`
  - `--tag-warning-color-background`, `--tag-warning-color-text`
- [x] [S] 6.3 Update `AGENTS.md`: document the component custom property API for Button and Tag with usage examples

**Definition of Done:** Consumers can override any variant's background/text colour by setting the component custom property on a parent or the element itself, without affecting other variants or global tokens.
