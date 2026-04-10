# Tasks: Add Changeset and Web App Manifest to Collectstory

## Phase 1 — Changeset Tooling

- [x] [S] Install `@changesets/cli` as a devDependency on the root `package.json`
- [x] [S] Run `pnpm changeset init` to generate `.changeset/config.json`, then edit it to set `packages` to `["@dezkareid/collectstory"]`, `access` to `"restricted"`, and remove any other managed packages
- [x] [S] Add `"changeset": "changeset"` and `"version-packages": "changeset version"` scripts to the root `package.json`
- [x] [S] Create the initial changeset file declaring a `major` bump for `@dezkareid/collectstory` (documents the 1.0.0 release)
- [x] [S] Run `changeset version` to consume the initial changeset, set `apps/collectstory/package.json#version` to `1.0.0`, and generate `apps/collectstory/CHANGELOG.md`

**Dependencies**: Tasks run in order — init before config edit, config before creating the changeset, changeset before version.

**Definition of Done**:
- `.changeset/config.json` exists and lists only `@dezkareid/collectstory`
- `apps/collectstory/package.json#version` is `"1.0.0"`
- `apps/collectstory/CHANGELOG.md` exists with a Major entry
- Running `pnpm changeset` from the monorepo root launches the interactive prompt without errors

---

## Phase 2 — App Icons

- [x] [M] Author `design-system/icons/src/svg/collectstory-app.svg` following icons package conventions (`viewBox="0 0 24 24"`, `fill="currentColor"`, no `width`/`height`, no `id`/`class`/`style`)
- [x] [S] Build `@dezkareid/icons` to regenerate components and verify the new icon is included (`pnpm turbo run build --filter=@dezkareid/icons`)
- [x] [M] Write a one-off Node script (using `sharp`, already a dep of `apps/collectstory`) to rasterise `collectstory-app.svg` to `apps/collectstory/public/icons/icon-192.png` and `icon-512.png` with a solid `#2563eb` background
- [x] [S] Run the script and verify both PNG files exist and display correctly

**Dependencies**: SVG must be authored before building icons; icons must be built before the rasterisation script can reference the source file. PNG files must exist before Phase 3.

**Definition of Done**:
- `design-system/icons/src/svg/collectstory-app.svg` exists and passes `pnpm turbo run build --filter=@dezkareid/icons` without errors
- `apps/collectstory/public/icons/icon-192.png` (192 × 192 px, opaque) exists
- `apps/collectstory/public/icons/icon-512.png` (512 × 512 px, opaque) exists

---

## Phase 3 — Web App Manifest

- [x] [S] Create `apps/collectstory/app/manifest.ts` returning a `MetadataRoute.Manifest` object with name, short_name, description, start_url, display, background_color, theme_color, and the icons array referencing `/icons/icon-192.png` and `/icons/icon-512.png`
- [x] [S] Verify `<link rel="manifest" href="/manifest.webmanifest">` appears in the rendered `<head>` (DevTools or `curl`)
- [x] [S] Verify `/manifest.webmanifest` returns a valid JSON response with all required fields (DevTools Network tab or `curl`)
- [x] [S] Verify both icon URLs (`/icons/icon-192.png`, `/icons/icon-512.png`) return HTTP 200

**Dependencies**: Phase 2 (icon files) must be complete before the manifest can reference them. No dependency on Phase 1.

**Definition of Done**:
- `app/manifest.ts` exists and the dev server serves `/manifest.webmanifest` without errors
- `<link rel="manifest">` is present in the `<head>` of the homepage, `/collection`, and a public profile page
- Chrome DevTools Application → Manifest panel shows no errors and displays the correct icon previews
