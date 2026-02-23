# Implementation Plan: Light / Dark / System Theme Support

**Date:** 2026-02-23
**Branch:** `feat/add-light-dark-system-theme`
**Project:** `apps/main-website`
**Spec:** `osddt.spec.md`

---

## Architecture Overview

### Theme mechanism

The design-token stylesheet already declares `color-scheme: light dark` on `:root` and uses the `light-dark()` CSS function for every semantic colour token. Forcing a specific colour scheme requires only setting `color-scheme` on the `<html>` element:

| User selection | `<html>` `color-scheme` value | Effect |
|---|---|---|
| Light | `light` | Forces light palette |
| Dark | `dark` | Forces dark palette |
| System | `light dark` (or unset) | Follows OS preference |

No additional CSS variables or colour overrides are needed — the token layer handles everything.

### Persistence & FOUC guard

`localStorage` key `theme` stores only explicit user choices (`"light"` or `"dark"`). Absence of the key means system mode is active — system is never written to storage. A small inline `<script>` in `<head>` reads this key and sets `color-scheme` on `<html>` synchronously before any CSS or DOM is rendered, eliminating flash of unstyled content. When the key is absent the FOUC guard does nothing, leaving `:root { color-scheme: light dark; }` from the token stylesheet to govern.

### Component structure

```
src/
├── components/
│   └── ThemeToggle.astro      ← new: cycling icon button + client script
└── layouts/
    └── Layout.astro           ← modified: add FOUC script to <head>, add ThemeToggle to <header>
```

### Toggle behaviour & icons

System is the implicit default (no storage entry). The button toggles only between Light and Dark; from System it always enters Light first.

| Current mode | Click → next mode | Icon shown | `aria-label` |
|---|---|---|---|
| `system` (no entry) | `light` | `computer-desktop` (outline) | "Switch to light theme" |
| `light` | `dark` | `moon` (outline) | "Switch to dark theme" |
| `dark` | `light` | `sun` (outline) | "Switch to light theme" |

> The icon shown represents the **next** action (what you'll switch to), not the current mode — except for system where the monitor signals "no explicit preference".

---

## Implementation Phases

### Phase 1 — FOUC Guard (inline head script)

**Goal:** Apply the stored theme preference before first paint on every page.

**File:** `src/layouts/Layout.astro`

**Changes:**
1. Add an inline `<script is:inline>` block inside `<head>`, after the `<meta>` tags:

```js
(function () {
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.style.colorScheme = theme;
    }
    // No entry = system default; leave colorScheme unset so the token
    // stylesheet's `color-scheme: light dark` governs.
  } catch (_) {}
})();
```

- Uses an IIFE to avoid polluting global scope.
- Runs synchronously — browser applies `color-scheme` before computing styles.
- Only sets `colorScheme` when an explicit choice exists; absence of the key leaves the OS preference in control.

**Risk:** If `localStorage` is unavailable (private browsing in some contexts), the `getItem` call throws. Wrap in a `try/catch` that silently falls back to `'system'`.

---

### Phase 2 — ThemeToggle Component

**Goal:** Build the cycling icon button as a self-contained Astro component.

**File:** `src/components/ThemeToggle.astro`

#### 2a — Markup

A single `<button>` element with:
- `id="theme-toggle"` for the client script to target.
- `type="button"` to prevent form submission.
- `aria-label` set to the label for the *next* action (updated by JS).
- Three child `<svg>` elements (sun, moon, computer-desktop), each wrapped in a `<span>` with a distinct class (`icon-light`, `icon-dark`, `icon-system`). Visibility is controlled by CSS classes on the button.
- Inline Heroicons SVGs (MIT, copy-paste, no package dependency):
  - **Sun** — Heroicons `sun` outline 24×24
  - **Moon** — Heroicons `moon` outline 24×24
  - **Computer Desktop** — Heroicons `computer-desktop` outline 24×24

#### 2b — CSS (scoped `<style>` block)

- Button reset: no background, no border, cursor pointer, padding using `--spacing-8`.
- `color: var(--color-text-primary)` so icons inherit the current text colour.
- Focus ring using `outline` with `var(--color-primary)` for keyboard visibility.
- Icon visibility: `.icon-light`, `.icon-dark`, `.icon-system` all `display: none` by default; button `data-theme` attribute controls which is shown. Icons represent the **next** action, so light mode shows the moon and dark mode shows the sun:
  ```css
  [data-theme="light"]  .icon-dark   { display: block; } /* moon: click to go dark */
  [data-theme="dark"]   .icon-light  { display: block; } /* sun: click to go light */
  [data-theme="system"] .icon-system { display: block; } /* monitor: no preference set */
  ```
- Use `data-theme` attribute on the button itself (not `<html>`) to avoid global selector conflicts.

#### 2c — Client script (`<script>` tag, no `is:inline`)

```ts
// System is the implicit default; only 'light' | 'dark' are ever stored.
const TOGGLE = { system: 'light', light: 'dark', dark: 'light' };
const NEXT_LABELS = {
  system: 'Switch to light theme',
  light:  'Switch to dark theme',
  dark:   'Switch to light theme',
};

function getTheme() {
  try {
    const s = localStorage.getItem('theme');
    if (s === 'light' || s === 'dark') return s;
  } catch (_) {}
  return 'system';
}

function applyTheme(theme) {
  try { localStorage.setItem('theme', theme); } catch (_) {}
  document.documentElement.style.colorScheme = theme;
  const btn = document.getElementById('theme-toggle');
  btn.dataset.theme = theme;
  btn.setAttribute('aria-label', NEXT_LABELS[theme]);
}

function syncButton() {
  const theme = getTheme();
  const btn = document.getElementById('theme-toggle');
  btn.dataset.theme = theme;
  btn.setAttribute('aria-label', NEXT_LABELS[theme]);
  if (theme !== 'system') document.documentElement.style.colorScheme = theme;
}

syncButton(); // align button with FOUC guard state

document.getElementById('theme-toggle').addEventListener('click', () => {
  applyTheme(TOGGLE[getTheme()]);
});
```

- No `is:inline` — Astro will bundle and deduplicate this script automatically.
- `syncButton` is called on load to align the button's visual state with the value already applied by the FOUC guard (avoids icon mismatch).
- `applyTheme` is only called for explicit `light`/`dark` selections, never for system.

---

### Phase 3 — Wire into Layout

**Goal:** Mount the FOUC script and `ThemeToggle` in the root layout.

**File:** `src/layouts/Layout.astro`

**Changes:**
1. Import `ThemeToggle`:
   ```
   import ThemeToggle from "../components/ThemeToggle.astro";
   ```
2. Add FOUC inline script in `<head>` (Phase 1).
3. Place `<ThemeToggle />` inside `.nav-container`, after `.nav-links`:
   ```html
   <nav class="nav-container">
     <a href="/" class="logo">JD.DEV</a>
     <div class="nav-links">…</div>
     <ThemeToggle />
   </nav>
   ```
4. No layout or spacing changes are required — the button is inline in the flex row and inherits the nav's `align-items: center`.

---

## Technical Dependencies

| Dependency | Source | Notes |
|---|---|---|
| Heroicons SVG markup | [heroicons.com](https://heroicons.com) — copy-paste | MIT license. No npm package. Three icons: `sun`, `moon`, `computer-desktop` (all outline, 24×24). |
| `localStorage` | Browser built-in | Synchronous, available in all target browsers. |
| `color-scheme` CSS property | Browser built-in | Supported in Chrome 81+, Firefox 67+, Safari 13+. |
| `light-dark()` CSS function | `@dezkareid/design-tokens` | Already in use. No changes to the package. |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `localStorage` unavailable (e.g. storage quota exceeded, private mode restrictions) | Low | Wrap all `localStorage` calls in `try/catch`; fall back to `'system'`. |
| FOUC if inline script is moved or deferred | Medium | `<script is:inline>` must remain in `<head>` with no `defer` or `async`. Code review gate. |
| Icon mismatch on load (FOUC guard fires but button JS hasn't run) | Low | `applyTheme(getTheme())` called immediately on script evaluation (Phase 2c) syncs button state. |
| `color-scheme` on `<html>` style attribute overrides stylesheet cascade | Intended | This is the desired mechanism — inline style takes precedence over `:root` in the token stylesheet. Removing the inline style restores system behaviour. |
| Heroicons SVG markup changes between versions | Very low | SVGs are copied verbatim at implementation time; no live dependency. Lock the source commit/version in a comment. |

---

## Out of Scope

- Server-side theme detection or cookie-based persistence.
- Animated theme transitions.
- Per-page theme overrides.
- Any changes to `@dezkareid/design-tokens`.
- Adding new semantic colour tokens.
- Testing infrastructure (no test framework is configured in `apps/main-website`).
