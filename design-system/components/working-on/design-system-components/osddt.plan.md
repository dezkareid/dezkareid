# Implementation Plan: Design System Components

## Architecture Overview

### Directory Structure

Framework-specific components are grouped by framework. CSS and shared logic live in a top-level `shared/` folder, keeping styling and utilities decoupled from any framework.

```
src/
  css/
    button.module.css       # Button BEM + OOCSS classes
    tag.module.css          # Tag BEM + OOCSS classes
    card.module.css         # Card BEM + OOCSS classes
    theme-toggle.module.css # ThemeToggle BEM + OOCSS classes
  shared/
    js/
      theme.ts                # ThemeToggle logic (read/write localStorage, apply color-scheme)
    types/
      button.ts               # ButtonProps interface
      tag.ts                  # TagProps interface
      card.ts                 # CardProps interface
      theme-toggle.ts         # ThemeToggleProps interface
  react/
    Button/
      index.tsx
      index.test.tsx
    Tag/
      index.tsx
      index.test.tsx
    Card/
      index.tsx
      index.test.tsx
    ThemeToggle/
      index.tsx
      index.test.tsx
    index.ts                  # Barrel: exports all React components
  astro/
    Button/
      index.astro
    Tag/
      index.astro
    Card/
      index.astro
    ThemeToggle/
      index.astro
    index.ts                  # Barrel: exports all Astro components
  vue/
    Button/
      index.vue
    Tag/
      index.vue
    Card/
      index.vue
    ThemeToggle/
      index.vue
    index.ts                  # Barrel: exports all Vue components
```

### Styling Strategy

- **CSS Modules** for component-scoped styles, located in `src/css/`.
- **BEM** for class naming within each module: block (`button`), element (`button__label`), modifier (`button--primary`, `button--sm`, `button--disabled`).
- **OOCSS** to separate structural responsibility from skin responsibility:
  - *Structure classes* define layout, sizing, spacing, and display behaviour (e.g. `.button`, `.card`).
  - *Skin classes* define colour, border, shadow, and typography (e.g. `.button--primary`, `.tag--success`, `.card--raised`).
  - Framework files compose both structure and skin classes together.
- All colour, spacing, and font values use CSS custom properties from `@dezkareid/design-tokens`.
- Semantic tokens (`--color-background-primary`, `--color-text-primary`, etc.) are used exclusively — no raw hex/px values.

### Theming

- The `color-scheme` attribute on `<html>` drives light/dark switching.
- `ThemeToggle` is the only component that reads/writes theme state. All other components are passive consumers of semantic tokens.
- `ThemeToggle` uses `localStorage` (key: `color-scheme`) for persistence and falls back to `prefers-color-scheme`.

### TypeScript

- Shared prop interfaces/types are defined in `src/shared/types/<component>.ts` and imported by all three framework implementations.
- Strict typing; no `any`.

### Testing

- React implementations only (as per spec).
- Vitest + React Testing Library.
- Tests cover: rendering variants, disabled states, slot/children content, ThemeToggle localStorage and OS-preference behaviour.

### Entry Points

The package will expose three sub-path exports:
- `@dezkareid/components/react` → all React components
- `@dezkareid/components/astro` → all Astro components
- `@dezkareid/components/vue` → all Vue components

`package.json` `exports` field will be configured accordingly.

---

## Implementation Phases

### Phase 1 — Package Setup

**Goal**: Establish the build infrastructure, folder layout, and entry points before writing any component code.

- Configure `package.json` with `exports` for `react/`, `astro/`, and `vue/` sub-paths.
- Create the full directory skeleton: `src/css/`, `src/shared/js/`, `src/shared/types/`, `src/react/`, `src/astro/`, `src/vue/`.
- Create barrel `index.ts` files for each framework entry point (`src/react/index.ts`, `src/astro/index.ts`, `src/vue/index.ts`).
- Verify that `@dezkareid/design-tokens` is available as a dependency and that its CSS token file can be imported from `src/css/`.
- Set up Vitest config (if not present) targeting `src/react/**/*.test.tsx`.

### Phase 2 — Button Component

**Goal**: Implement the Button component across all three frameworks with full variant, size, and disabled support.

- Define `ButtonProps` in `src/shared/types/button.ts`: `variant: 'primary' | 'secondary'`, `size: 'sm' | 'md' | 'lg'`, `disabled?: boolean`, `children/slot`.
- Write `src/css/button.module.css` using BEM + OOCSS:
  - **Structure**: `.button` — `display: inline-flex`, `align-items: center`, `cursor: pointer`, `border: none`, `border-radius`.
  - **Structure modifiers** (size): `.button--sm`, `.button--md`, `.button--lg` — vary `padding` and `font-size` via spacing/font tokens.
  - **Skin modifiers** (variant): `.button--primary` — `background-color: var(--color-primary)`, `color: var(--color-text-inverse)`; `.button--secondary` — `background-color: transparent`, `border: 1px solid var(--color-primary)`, `color: var(--color-primary)`.
  - **State modifier**: `.button--disabled` — reduced opacity, `cursor: not-allowed`, `pointer-events: none`.
- Implement `src/react/Button/index.tsx` — renders `<button>`, composes BEM classes from CSS module, passes through native button props.
- Implement `src/astro/Button/index.astro`.
- Implement `src/vue/Button/index.vue`.
- Write `src/react/Button/index.test.tsx`: renders each variant, renders each size, disabled prevents click, accessible role.

### Phase 3 — Tag Component

**Goal**: Implement the Tag component across all three frameworks with semantic colour variants and children support.

- Define `TagProps` in `src/shared/types/tag.ts`: `variant: 'default' | 'success' | 'danger'`, `children/slot`.
- Write `src/css/tag.module.css` using BEM + OOCSS:
  - **Structure**: `.tag` — `display: inline-flex`, `align-items: center`, `border-radius`, `padding: var(--spacing-4) var(--spacing-8)`, `font-size: var(--font-size-100)`.
  - **Skin modifiers** (variant): `.tag--default` — `background-color: var(--color-background-secondary)`, `color: var(--color-text-primary)`; `.tag--success` — `background-color: var(--color-success)`, `color: var(--color-text-inverse)`; `.tag--danger` — `background-color: var(--color-base-red-500)`, `color: var(--color-text-inverse)`. *(Note: propose `--color-danger` semantic token for the design-tokens package.)*
- Implement `src/react/Tag/index.tsx` — renders a `<span>`, composes BEM classes, accepts `children`.
- Implement `src/astro/Tag/index.astro`.
- Implement `src/vue/Tag/index.vue`.
- Write `src/react/Tag/index.test.tsx`: renders each variant, renders slot/children content.

### Phase 4 — Card Component

**Goal**: Implement the Card component across all three frameworks with flat and raised elevation.

- Define `CardProps` in `src/shared/types/card.ts`: `elevation?: 'flat' | 'raised'` (default: `'raised'`), `children/slot`.
- Write `src/css/card.module.css` using BEM + OOCSS:
  - **Structure**: `.card` — `display: block`, `border-radius`, `padding: var(--spacing-24)`, `width: 100%`.
  - **Skin** (base): `.card` — `background-color: var(--color-background-secondary)`, `color: var(--color-text-primary)`.
  - **Skin modifiers** (elevation): `.card--raised` — `box-shadow: 0 2px 8px rgba(0,0,0,0.12)` *(propose `--shadow-raised` token)*; `.card--flat` — no shadow.
- Implement `src/react/Card/index.tsx` — renders a `<div>`, composes BEM classes, accepts `children`.
- Implement `src/astro/Card/index.astro`.
- Implement `src/vue/Card/index.vue`.
- Write `src/react/Card/index.test.tsx`: renders children, applies correct elevation class.

### Phase 5 — ThemeToggle Component

**Goal**: Implement the ThemeToggle component across all three frameworks with localStorage persistence and OS preference fallback.

- Define `ThemeToggleProps` in `src/shared/types/theme-toggle.ts`: no required props (self-contained stateful component).
- Extract shared theme logic to `src/shared/js/theme.ts`:
  - `getInitialTheme(): 'light' | 'dark'` — reads `localStorage.getItem('color-scheme')`; falls back to `window.matchMedia('(prefers-color-scheme: dark)').matches`.
  - `applyTheme(theme: 'light' | 'dark'): void` — sets `document.documentElement.setAttribute('color-scheme', theme)`.
  - `persistTheme(theme: 'light' | 'dark'): void` — writes to `localStorage`.
  - All functions guard against `typeof window === 'undefined'` for SSR safety.
- Write `src/css/theme-toggle.module.css` using BEM + OOCSS:
  - **Structure**: `.theme-toggle` — `display: inline-flex`, `align-items: center`, `cursor: pointer`, `padding`, `border: none`.
  - **Skin**: `.theme-toggle` — `background-color: transparent`, `color: var(--color-text-primary)`.
  - **State modifier**: `.theme-toggle--dark` — visual indicator for dark mode active state.
- Implement `src/react/ThemeToggle/index.tsx` — uses `useState` + `useEffect`, calls `src/shared/js/theme.ts` utilities.
- Implement `src/astro/ThemeToggle/index.astro` — static markup + inline `<script>` that imports and calls `src/shared/js/theme.ts`.
- Implement `src/vue/ThemeToggle/index.vue` — uses `ref` + `onMounted`, calls shared utilities.
- Write `src/react/ThemeToggle/index.test.tsx`: initialises from `localStorage`, initialises from `prefers-color-scheme` when no stored value, toggles on click, persists to `localStorage`.

### Phase 6 — Exports & Package Configuration

**Goal**: Wire all components into the entry points and validate the exports map.

- Update `src/react/index.ts` to re-export `Button`, `Tag`, `Card`, `ThemeToggle` from their respective sub-folders.
- Update `src/astro/index.ts` to re-export Astro components.
- Update `src/vue/index.ts` to re-export Vue components.
- Update `package.json` `exports`:
  ```json
  {
    "./react": "./src/react/index.ts",
    "./astro": "./src/astro/index.ts",
    "./vue": "./src/vue/index.ts"
  }
  ```
- Verify build compiles without errors.

### Phase 7 — Documentation

**Goal**: Update `README.md` and `AGENTS.md` to reflect the new components.

- Add installation note for `@dezkareid/design-tokens` CSS requirement.
- Add usage examples for each component in each framework format.
- Update `AGENTS.md` with component API summaries.

---

## Technical Dependencies

| Dependency | Purpose | Already Present? |
|---|---|---|
| `@dezkareid/design-tokens` | CSS token variables | To verify |
| `react` / `react-dom` | React runtime | Peer dep |
| `vue` | Vue runtime | To add as peer dep |
| `astro` | Astro runtime | To add as peer dep |
| `vitest` | Test runner | To configure |
| `@testing-library/react` | React test utilities | To configure |
| `jsdom` | DOM environment for tests | To configure |
| `typescript` | Type checking | To configure |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Missing semantic tokens (e.g. `--color-danger`, `--shadow-raised`) | Use base tokens as fallback; add inline comments proposing new tokens to the design-tokens package |
| CSS Modules not supported in Astro/Vue by default | Astro natively supports CSS Modules; Vue supports them via `<style module>` — both are straightforward |
| `localStorage` access in SSR/Astro contexts | Wrap all `localStorage` access in `typeof window !== 'undefined'` guards; use `is:inline` or `client:load` in Astro |
| ThemeToggle hydration flash (FOUC) | Emit an inline `<script>` that applies the theme before first paint (Astro strategy); React version uses `useEffect` which may flash — document as a known limitation |
| Vue not yet configured as a peer dependency | Add `vue` peer dep to `package.json` in Phase 1 |

---

## Out of Scope

- Icon library (no icon assets bundled with components).
- Animation/transition system.
- Loading state or icon-only Button variant.
- Storybook or visual regression tooling.
- SSR-optimised theme detection beyond the `<script>` injection approach.
- Astro and Vue unit tests (React tests only, per spec).
