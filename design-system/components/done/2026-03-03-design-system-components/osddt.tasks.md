# Task List: Design System Components

---

## Phase 1 — Package Setup

> All Phase 2–7 tasks depend on Phase 1 being complete.

- [x] [S] Configure `package.json`: add `exports` map for `./react`, `./astro`, `./vue` sub-paths, and add `vue` + `astro` as peer dependencies
- [x] [S] Create directory skeleton: `src/css/`, `src/shared/js/`, `src/shared/types/`, `src/react/`, `src/astro/`, `src/vue/`
- [x] [S] Create empty barrel files: `src/react/index.ts`, `src/astro/index.ts`, `src/vue/index.ts`
- [x] [S] Verify `@dezkareid/design-tokens` is installed and its CSS token file is importable; add as dependency if missing
- [x] [M] Set up Vitest config targeting `src/react/**/*.test.tsx` with jsdom environment and React Testing Library

**Definition of Done**: `package.json` has correct exports and peer deps; all directories exist; Vitest runs (no tests yet, zero failures).

---

## Phase 2 — Button Component

> Depends on: Phase 1

- [x] [S] Define `ButtonProps` interface in `src/shared/types/button.ts` (`variant`, `size`, `disabled`, `children`)
- [x] [M] Write `src/css/button.module.css` — structure (`.button`, size modifiers `.button--sm/md/lg`) and skin (variant modifiers `.button--primary/secondary`, state modifier `.button--disabled`) using BEM + OOCSS
- [x] [M] Implement `src/react/Button/index.tsx` — composes BEM classes, forwards native button props
- [x] [M] Write `src/react/Button/index.test.tsx` — renders primary/secondary variants, renders sm/md/lg sizes, disabled prevents click, has accessible button role
- [x] [M] Implement `src/astro/Button/index.astro`
- [x] [M] Implement `src/vue/Button/index.vue`

**Definition of Done**: Button renders all variants and sizes in all three frameworks; React tests pass; no hardcoded colour or spacing values.

---

## Phase 3 — Tag Component

> Depends on: Phase 1

- [x] [S] Define `TagProps` interface in `src/shared/types/tag.ts` (`variant`, `children`)
- [x] [M] Write `src/css/tag.module.css` — structure (`.tag`) and skin (variant modifiers `.tag--default/success/danger`) using BEM + OOCSS; add comment proposing `--color-danger` semantic token
- [x] [M] Implement `src/react/Tag/index.tsx` — renders `<span>`, accepts `children`, composes BEM classes
- [x] [M] Write `src/react/Tag/index.test.tsx` — renders default/success/danger variants, renders arbitrary children content
- [x] [M] Implement `src/astro/Tag/index.astro`
- [x] [M] Implement `src/vue/Tag/index.vue`

**Definition of Done**: Tag renders all variants with correct colours in all three frameworks; accepts arbitrary slot/children; React tests pass.

---

## Phase 4 — Card Component

> Depends on: Phase 1

- [x] [S] Define `CardProps` interface in `src/shared/types/card.ts` (`elevation`, `children`; default elevation `'raised'`)
- [x] [M] Write `src/css/card.module.css` — structure (`.card`) and skin (base skin on `.card`, elevation modifiers `.card--raised/flat`) using BEM + OOCSS; add comment proposing `--shadow-raised` token
- [x] [M] Implement `src/react/Card/index.tsx` — renders `<div>`, accepts `children`, composes BEM classes
- [x] [M] Write `src/react/Card/index.test.tsx` — renders children, applies `card--raised` by default, applies `card--flat` when set
- [x] [M] Implement `src/astro/Card/index.astro`
- [x] [M] Implement `src/vue/Card/index.vue`

**Definition of Done**: Card renders children inside a themed surface with correct elevation in all three frameworks; React tests pass.

---

## Phase 5 — ThemeToggle Component

> Depends on: Phase 1

- [x] [S] Define `ThemeToggleProps` interface in `src/shared/types/theme-toggle.ts` (no required props)
- [x] [M] Implement shared theme utilities in `src/shared/js/theme.ts`: `getInitialTheme()`, `applyTheme()`, `persistTheme()` — all SSR-safe with `typeof window` guards
- [x] [M] Write `src/css/theme-toggle.module.css` — structure (`.theme-toggle`) and skin + state modifier (`.theme-toggle--dark`) using BEM + OOCSS
- [x] [M] Implement `src/react/ThemeToggle/index.tsx` — uses `useState` + `useEffect`, calls shared theme utilities
- [x] [L] Write `src/react/ThemeToggle/index.test.tsx` — initialises from `localStorage`, falls back to `prefers-color-scheme`, toggles on click, persists to `localStorage`
- [x] [M] Implement `src/astro/ThemeToggle/index.astro` — static markup + inline `<script>` calling shared utilities
- [x] [M] Implement `src/vue/ThemeToggle/index.vue` — uses `ref` + `onMounted`, calls shared utilities

**Definition of Done**: ThemeToggle reads, applies, and persists theme in all three frameworks; React tests pass; no FOUC in Astro (inline script runs before paint).

---

## Phase 6 — Exports & Package Configuration

> Depends on: Phases 2–5

- [x] [S] Update `src/react/index.ts` to re-export `Button`, `Tag`, `Card`, `ThemeToggle`
- [x] [S] Update `src/astro/index.ts` to re-export all Astro components
- [x] [S] Update `src/vue/index.ts` to re-export all Vue components
- [x] [S] Verify `package.json` `exports` paths resolve correctly (smoke check imports)

**Definition of Done**: All components importable from `@dezkareid/components/react`, `/astro`, and `/vue`; no TypeScript errors.

---

## Phase 7 — Documentation

> Depends on: Phase 6

- [x] [M] Update `README.md`: add `@dezkareid/design-tokens` CSS import requirement, add usage examples for Button, Tag, Card, ThemeToggle in all three framework formats
- [x] [M] Update `AGENTS.md`: add component API summaries (props, variants, slot/children behaviour) for all four components

**Definition of Done**: README covers install, token CSS import, and usage for all components; AGENTS.md describes all component APIs for AI tooling.
