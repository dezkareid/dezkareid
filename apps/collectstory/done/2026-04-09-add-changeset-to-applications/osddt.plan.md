# Plan: Add Changeset and Web App Manifest to Collectstory

## Architecture Overview

### Changeset tooling

`@changesets/cli` will be installed at the **monorepo root** (as a devDependency on the root `package.json`). Changesets already have first-class monorepo support: the `.changeset/config.json` file lists which packages are managed, changeset files reference package names, and `changeset version` bumps only the listed packages.

The configuration will:
- Scope managed packages to `@dezkareid/collectstory` only (other packages remain unmanaged by this config).
- Use `linked: []` (no linked versions — packages are independent).
- Set `access: "restricted"` since `collectstory` is `private: true`.
- Bump `@dezkareid/collectstory` from `0.0.1` → `1.0.0` as the initial release via the first changeset file.

Root `package.json` gains two scripts:
- `"changeset": "changeset"` — interactive prompt to create a changeset
- `"version-packages": "changeset version"` — consume changesets, bump versions, write CHANGELOG

### Web App Manifest

Next.js 16 App Router exposes the `metadata` export and a dedicated `manifest.ts` route convention. The cleanest approach is a `app/manifest.ts` file that returns a `MetadataRoute.Manifest` object — Next.js serialises it to `/manifest.webmanifest` automatically and injects `<link rel="manifest">` into every page rendered under the root layout.

No manual `<link>` tag or `public/manifest.json` file is needed; Next.js handles both.

### Icons

The existing `favicon.svg` in `apps/collectstory/public/` uses a shelf/collectibles motif with `fill="#2563eb"` (blue). The PWA icons must be raster (PNG) at 192 × 192 and 512 × 512 px — browsers do not accept SVG for the `icons` array in a manifest.

The source SVG for the icons will live in `design-system/icons/src/svg/` (e.g. `collectstory-app.svg`) following the package conventions, then rasterised to PNG and placed in `apps/collectstory/public/icons/`. The rasterisation is a one-time manual step using a Node script or CLI tool (`sharp` is already a dependency of `apps/collectstory`).

Because the manifest icon spec requires opaque raster images (transparent backgrounds render poorly on home screens), the PNG variants will use a solid background matching the manifest `background_color`.

---

## Implementation Phases

### Phase 1 — Changeset tooling

**Goal**: Enable the changeset workflow at the monorepo root, scoped to `@dezkareid/collectstory`.

1. Install `@changesets/cli` as a devDependency on the root `package.json`.
2. Run `pnpm changeset init` to generate `.changeset/config.json`; then edit it to restrict `packages` to `["@dezkareid/collectstory"]`.
3. Add `"changeset"` and `"version-packages"` scripts to root `package.json`.
4. Create the initial changeset file (`.changeset/<hash>.md`) declaring a `major` bump for `@dezkareid/collectstory` to document the `1.0.0` release.
5. Run `changeset version` to consume that changeset, set `apps/collectstory/package.json#version` to `1.0.0`, and generate `apps/collectstory/CHANGELOG.md`.

### Phase 2 — App icons

**Goal**: Create brand-consistent PWA icons sourced from `design-system/icons`.

1. Author `design-system/icons/src/svg/collectstory-app.svg` — a 24 × 24 shelf motif using `fill="currentColor"` (following icons package conventions). This is the vector source.
2. Build `@dezkareid/icons` to regenerate components (the new SVG is picked up automatically).
3. Write a one-off Node script (or use the existing `sharp` package from `apps/collectstory`) to rasterise the SVG at 192 × 192 and 512 × 512 px with a solid `#2563eb` background, outputting:
   - `apps/collectstory/public/icons/icon-192.png`
   - `apps/collectstory/public/icons/icon-512.png`

> **Why not use the React/Astro component output?** The manifest `icons` array requires static raster files at known URLs — it cannot reference React components or SVG at build time without additional tooling. The SVG still lives in `design-system/icons` as the source of truth; the PNGs are derived artefacts.

### Phase 3 — Web App Manifest

**Goal**: Serve a valid manifest and surface it to browsers via Next.js metadata.

1. Create `apps/collectstory/app/manifest.ts` returning a `MetadataRoute.Manifest` object with:
   - `name: "Collectstory"`
   - `short_name: "Collectstory"`
   - `description: "Track and showcase your collectibles collection."`
   - `start_url: "/"`
   - `display: "standalone"`
   - `background_color: "#ffffff"` (matches `--color-background-primary` light theme)
   - `theme_color: "#2563eb"` (matches the brand blue from favicon)
   - `icons` array referencing `/icons/icon-192.png` and `/icons/icon-512.png`
2. Verify the existing root `layout.tsx` `metadata` export does **not** manually set a `manifest` key (it doesn't currently) — Next.js derives `<link rel="manifest">` from `app/manifest.ts` automatically.
3. Confirm `<link rel="manifest" href="/manifest.webmanifest">` appears in rendered page `<head>` via DevTools.

---

## Technical Dependencies

| Dependency | Version | Location | Purpose |
|---|---|---|---|
| `@changesets/cli` | latest stable | root `devDependencies` | Changeset workflow |
| `sharp` | `0.34.5` (already installed) | `apps/collectstory` | SVG → PNG rasterisation |
| `MetadataRoute.Manifest` | built-in (Next.js 16) | `apps/collectstory` | Typed manifest route |
| `@dezkareid/icons` | workspace | `design-system/icons` | Source SVG for app icon |

No new dependencies are required for the manifest or icons beyond what already exists.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `changeset version` bumps unintended packages | Medium | Set `packages` in `.changeset/config.json` explicitly; verify with `--dry-run` before running for real |
| SVG rasterisation colour mismatch | Low | Use the exact hex `#2563eb` from `favicon.svg` for both the icon fill and background; visually verify the output PNG |
| Next.js serves manifest at `/manifest.webmanifest` (not `.json`) | Low | The spec accepts either filename; browsers follow the `<link rel="manifest">` href — no hardcoded `/manifest.json` URL in code |
| Icons package `src/svg/` authoring constraints not met | Low | Follow the AGENTS.md rules: `viewBox="0 0 24 24"`, `fill="currentColor"`, no `width`/`height`, no `id`/`class`/`style` |
| `sharp` SVG input requires `librsvg` on the host | Low | `sharp` bundled in the repo already handles SVG natively on Node >= 16; confirm in CI environment |

---

## Out of Scope

- Service worker / offline caching (PWA shell)
- Push notification manifest fields (`gcm_sender_id`, etc.)
- CI enforcement of changeset files on PRs
- Changeset tooling for any package other than `@dezkareid/collectstory`
- Maskable icon variants or splash screens
- App store packaging
