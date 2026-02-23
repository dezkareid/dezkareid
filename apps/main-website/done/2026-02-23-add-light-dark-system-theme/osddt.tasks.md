# Task List: Light / Dark / System Theme Support

**Date:** 2026-02-23
**Branch:** `feat/add-light-dark-system-theme`
**Project:** `apps/main-website`
**Plan:** `osddt.plan.md`

---

## Phase 1 — FOUC Guard

**Goal:** Apply stored theme preference before first paint on every page.
**File:** `src/layouts/Layout.astro`

- [x] [S] Add `<script is:inline>` FOUC guard to `<head>` in `Layout.astro` that reads `localStorage.theme` and sets `document.documentElement.style.colorScheme` only when the value is `"light"` or `"dark"`; absence of the key leaves `colorScheme` unset so the token stylesheet's `color-scheme: light dark` governs — wrapped in `try/catch`.

**Definition of Done:** Hard-refreshing any page after manually setting `localStorage.theme = 'dark'` in DevTools renders the dark palette immediately with no flash.

---

## Phase 2 — ThemeToggle Component

**Goal:** Self-contained cycling icon button component.
**File:** `src/components/ThemeToggle.astro`
**Depends on:** Phase 1 complete (FOUC guard in place before wiring the toggle)

- [x] [S] Create `src/components/ThemeToggle.astro` with a `<button id="theme-toggle" type="button" data-theme="system">` shell and initial `aria-label` of `"Switch to light theme"` (system is the default unset state).
- [x] [M] Inline the three Heroicons outline SVGs (24×24) inside the button — `sun` wrapped in `<span class="icon-light">`, `moon` in `<span class="icon-dark">`, `computer-desktop` in `<span class="icon-system">` — with a comment noting the Heroicons source and MIT licence.
- [x] [S] Add scoped `<style>` block: button reset (no background/border, cursor pointer, `--spacing-8` padding, `color: var(--color-text-primary)`), focus ring (`outline: 2px solid var(--color-primary); outline-offset: 2px`), all icon spans `display: none` by default, and `[data-theme="light"] .icon-dark` (moon), `[data-theme="dark"] .icon-light` (sun), `[data-theme="system"] .icon-system` (monitor) set to `display: block` — icons show the next action, not the current state.
- [x] [M] Add client `<script>` (no `is:inline`) implementing `TOGGLE = {system:'light', light:'dark', dark:'light'}`, `getTheme()` (returns `'system'` when no valid entry in `localStorage`), `applyTheme(theme)` (only called for `light`/`dark`, writes to `localStorage`, sets `colorScheme`, updates button), `syncButton()` (aligns button state with FOUC guard on load without writing to storage), and click handler.

**Definition of Done:** Component file exists; button renders with the correct icon for each theme state; clicking cycles through all three modes; icon and `aria-label` update correctly on each click.

---

## Phase 3 — Wire into Layout

**Goal:** Mount FOUC guard and ThemeToggle in the root layout.
**File:** `src/layouts/Layout.astro`
**Depends on:** Phase 2 complete (ThemeToggle component exists)

- [x] [S] Import `ThemeToggle` in the frontmatter of `Layout.astro`.
- [x] [S] Place `<ThemeToggle />` inside `.nav-container` after the `.nav-links` div.

**Definition of Done:** Theme toggle button is visible in the header on all pages (Home, Projects, Services, About); no layout shift introduced.

---

## Phase 4 — Manual Verification

**Goal:** Validate all acceptance criteria before marking the feature done.
**Depends on:** Phase 3 complete

- [x] [S] AC1 — `<ThemeToggle />` is mounted in `Layout.astro` which wraps all pages; confirmed present in all 10 built HTML files.
- [x] [S] AC2–AC4 — `TOGGLE` map drives System→Light, Light→Dark, Dark→Light; `applyTheme()` writes only `light`/`dark` to storage; `syncButton()` handles the system default without writing; cycling logic confirmed correct.
- [x] [S] AC5 — FOUC guard sets `colorScheme` only when `localStorage.theme` is `"light"` or `"dark"`; absent key leaves OS preference in control.
- [x] [S] AC6 — `getTheme()` returns `'system'` when no valid `localStorage` entry exists; FOUC guard does not override `colorScheme` in this case.
- [x] [S] AC7 — `<button type="button">` is focusable by default; Enter/Space activate click handler natively.
- [x] [S] AC8 — All CSS uses `var(--*)` tokens only; no hard-coded colour values introduced.
- [x] [S] AC9 — `pnpm build` completed with zero errors or warnings.

**Definition of Done:** All seven AC checks pass with no issues.

---

## Dependencies Summary

```
Phase 1 (FOUC guard)
  └─► Phase 2 (ThemeToggle component)
        └─► Phase 3 (Wire into Layout)
              └─► Phase 4 (Manual verification)
```

All phases are strictly sequential — each builds on the previous.
