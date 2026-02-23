# Feature Specification: Light / Dark / System Theme Support

**Date:** 2026-02-23
**Branch:** `feat/add-light-dark-system-theme`
**Project:** `apps/main-website`

---

## Overview

### What

Add an explicit theme toggle to the main website that lets visitors switch between **Light** and **Dark** colour modes. **System** (OS preference) is the silent default — no `localStorage` entry means system mode is active. The button toggles only between Light and Dark; system mode is the unset state and is never written to storage. The selected preference persists across page visits without a flash of unstyled content (FOUC).

### Why

The design-token layer already emits `light-dark()` CSS values and declares `color-scheme: light dark`, so the colour tokens respond automatically to the OS preference. However, there is currently no way for a visitor to override that preference from within the site, nor is the current mode communicated visually. Adding explicit user control is a standard accessibility and UX expectation for modern personal portfolios.

---

## Requirements

### Functional

| # | Requirement |
|---|-------------|
| F1 | A single icon-only toggle button is visible in the site header on every page. The icon conveys the **next** action: monitor when system is active (no preference), moon in Light mode (click to go dark), sun in Dark mode (click to go light). |
| F2 | Two explicit modes are supported: **Light** and **Dark**. **System** is the implicit default (OS `prefers-color-scheme`) and is never explicitly written to storage. |
| F3 | Clicking the button immediately applies the next colour scheme: System → Light → Dark → Light (System is only the unset state; once a user picks a mode the toggle cycles between Light and Dark). |
| F4 | Only explicit user choices (`"light"` or `"dark"`) are persisted in `localStorage` under the key `theme`. Absence of the key means system mode. |
| F5 | On initial page load the stored preference is applied before first paint (no FOUC). |
| F6 | When no preference is stored, **System** (OS preference) is active by default. |
| F7 | The active mode is visually indicated by the button icon. |

### Non-functional

| # | Requirement |
|---|-------------|
| NF1 | The toggle must work without JavaScript frameworks — plain vanilla JS in an Astro `<script>` tag is sufficient. |
| NF2 | Theme switching must not cause a layout shift (CLS = 0). |
| NF3 | The implementation must use the existing `color-scheme` + `light-dark()` CSS token infrastructure — no new colour values are to be hard-coded in the website. |
| NF4 | The inline script that restores the theme preference must be placed in `<head>` to execute before render. |
| NF5 | The toggle must be keyboard-accessible (focusable, activatable with Enter/Space). |
| NF6 | Works in all evergreen browsers that support `light-dark()` (Chrome 123+, Firefox 120+, Safari 17.5+). |

---

## Scope

### In Scope

- A `ThemeToggle` Astro component rendered in `Layout.astro`'s `<header>`.
- An inline `<script>` block in `<head>` that reads `localStorage` and sets `color-scheme` on `<html>` before render (FOUC guard).
- A client-side script inside `ThemeToggle` that handles click events, updates `localStorage`, and updates `<html>`'s `color-scheme` style.
- Appropriate ARIA attributes on the toggle for accessibility.
- CSS for the toggle component using existing design tokens only.

### Out of Scope

- Server-side theme detection via cookies (SSR is not used; the site is fully static).
- Animated theme transitions (e.g., a cross-fade or clip-path reveal).
- Per-page theme overrides.
- Changes to the `@dezkareid/design-tokens` package (tokens are consumed as-is).
- Adding new semantic colour tokens.

---

## Technical Context

- **Framework:** Astro 5.17 (static output, zero JS by default).
- **Styling:** Vanilla CSS using CSS custom properties from `@dezkareid/design-tokens`.
- **Token mechanism:** `:root { color-scheme: light dark; }` + `light-dark()` CSS function. Overriding `color-scheme` on `<html>` to `light` or `dark` forces the desired mode; `light dark` (or removing the override) restores system behaviour.
- **Persistence:** `localStorage` (`theme` key) — synchronous, appropriate for a static client-side site, and readable in the `<head>` inline script before first paint.
- **No existing theme toggle** — this is a greenfield addition.

---

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC1 | A single icon toggle button is visible in the header on every page (Home, Projects, Services, About), showing the monitor icon when no preference is stored, moon in Light mode, and sun in Dark mode. |
| AC2 | When in System mode (no `localStorage.theme`), clicking the button sets `color-scheme: light` on `<html>`, stores `"light"` in `localStorage.theme`, and updates the icon to moon (indicating dark is next). |
| AC3 | When in Light mode, clicking the button sets `color-scheme: dark` on `<html>`, stores `"dark"` in `localStorage.theme`, and updates the icon to sun (indicating light is next). |
| AC4 | When in Dark mode, clicking the button sets `color-scheme: light` on `<html>`, stores `"light"` in `localStorage.theme`, and updates the icon to moon (indicating dark is next). |
| AC5 | Hard-refreshing the page restores the previously selected theme with no visible flash. |
| AC6 | With no `localStorage.theme` entry, the page renders using the OS preference (system default) and the monitor icon is shown. |
| AC7 | The toggle is keyboard-operable: focusable via Tab, each option activatable via Enter or Space. |
| AC8 | No new CSS colour values are introduced that are not sourced from the design-token variables. |
| AC9 | The feature introduces no runtime errors in the browser console. |

---

## Resolved Design Decisions

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| OQ1 | Icon-only, text, or combination? | **Icon-only** with `aria-label` per state | Compact header footprint; accessibility covered by ARIA labels. |
| OQ2 | Segmented group vs single cycling button? | **Single toggle button** (System → Light → Dark → Light) | Simpler markup, smaller footprint in the header. System is the implicit unset state; once an explicit choice is made the button cycles only between Light and Dark. |
| OQ3 | Icon library? | **Heroicons SVGs inlined directly** — no npm package | Heroicons explicitly supports copy-paste inline usage (~500–700 bytes/icon, MIT). Zero runtime JS cost, zero added dependencies. Sun and Moon icons from Heroicons; a "computer screen" or "desktop" icon for System mode. |
| OQ4 | Persistence mechanism? | **`localStorage`** | Simple, synchronous, and directly readable in the `<head>` FOUC guard script. IndexedDB's async API is unnecessary complexity for a single string value. |
