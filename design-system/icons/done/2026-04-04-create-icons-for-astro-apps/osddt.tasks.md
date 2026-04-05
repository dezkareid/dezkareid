# Tasks: Astro Icon Export for `@dezkareid/icons`

Feature: `create-icons-for-astro-apps`
Working directory: `design-system/icons/working-on/create-icons-for-astro-apps/`

---

## Phase 1 — Add brand/social SVGs to `src/svg/`

- [x] [S] Extract GitHub SVG from `apps/main-website/src/components/SocialLinks.astro` and normalise to authoring conventions (`viewBox="0 0 24 24"`, `currentColor`, no `width`/`height`); save as `design-system/icons/src/svg/github.svg`
- [x] [S] Extract LinkedIn SVG from `apps/main-website/src/components/SocialLinks.astro` and normalise; save as `design-system/icons/src/svg/linkedin.svg`
- [x] [S] Extract RSS SVG from `apps/main-website/src/components/SocialLinks.astro` and normalise; save as `design-system/icons/src/svg/rss.svg`
- [x] [S] Verify sun and moon SVGs exist in `src/svg/` (needed for Phase 4 ThemeToggle swap); add them from `main-website/src/components/ThemeToggle.astro` inline markup if missing

**Definition of Done**: `src/svg/` contains `github.svg`, `linkedin.svg`, `rss.svg`, plus `sun.svg` and `moon.svg`. All files pass SVGO without error and use `currentColor`.

---

## Phase 2 — Extend `build-icons.ts` to emit `.astro` files

> Depends on: Phase 1 complete (so new SVGs are included in the generated output)

- [x] [S] Add `ASTRO_DIR` constant (`src/astro`) to `scripts/build-icons.ts`
- [x] [M] Add Astro component template generator to the build loop — reuse the existing `innerSvg` variable (same SVGO pass, no extra optimisation); emit one `.astro` file per SVG icon into `src/astro/`
- [x] [S] Emit `src/astro/index.ts` barrel from the build script (same pattern as `src/react/index.ts`, exporting each component as `default` re-export)
- [x] [S] Run `pnpm --filter @dezkareid/icons generate` and verify `src/astro/` is populated with `.astro` files and `index.ts` barrel
- [x] [S] Add `src/astro/` to `.gitignore` (generated files, same as `src/react/`)

**Definition of Done**: `pnpm --filter @dezkareid/icons generate` produces one `.astro` file per SVG in `src/astro/` plus `src/astro/index.ts`. Output is correct and matches the Astro component template spec.

---

## Phase 3 — Wire up the `./astro` package export

> Depends on: Phase 2 complete

- [x] [S] Add `"./astro"` export to `package.json` pointing to `src/astro/index.ts` (mirroring `@dezkareid/components/astro` pattern)
- [x] [S] Add `"src/astro"` to the `files` array in `package.json`
- [x] [S] Verify `tsconfig.json` includes `src/astro/**/*` in `include` (so TypeScript resolves `.astro` imports)
- [x] [S] Run `pnpm turbo run build --filter=@dezkareid/icons` and confirm it succeeds (React bundle unaffected; `dist/react.mjs` still produced)

**Definition of Done**: `@dezkareid/icons/astro` resolves from `package.json` exports. Build succeeds with no TypeScript errors.

---

## Phase 4 — Integrate into `main-website`

> Depends on: Phase 3 complete

- [x] [S] Add `"@dezkareid/icons": "workspace:*"` to `apps/main-website/package.json` dependencies
- [x] [S] Run `pnpm install` from the monorepo root
- [x] [M] Update `apps/main-website/src/components/ThemeToggle.astro` — replace the inline Heroicons sun SVG with `<Sun />` and moon SVG with `<Moon />` imported from `@dezkareid/icons/astro`
- [x] [M] Update `apps/main-website/src/components/SocialLinks.astro` — replace inline GitHub, LinkedIn, and RSS SVGs with the corresponding icon components from `@dezkareid/icons/astro`
- [x] [S] Run `pnpm turbo run build --filter=@dezkareid/main-website` and confirm it succeeds

**Definition of Done**: `main-website` builds without errors. `ThemeToggle.astro` and `SocialLinks.astro` import icons from `@dezkareid/icons/astro` with no inline SVGs remaining for GitHub, LinkedIn, RSS, sun, or moon.

---

## Phase 5 — Update documentation

> Depends on: Phase 3 complete

- [x] [S] Update `design-system/icons/AGENTS.md` — add `./astro` to the Package Exports table, update the data flow diagram to include `src/astro/*.astro`, remove the "deferred" note for the Astro entry point
- [x] [M] Update `design-system/icons/README.md` — add Astro usage section with import example, props table (`label`, `class`), sizing (`--icon-size`) and colour (`currentColor`) notes

**Definition of Done**: `README.md` and `AGENTS.md` fully document the `./astro` entry point. A developer can follow the README alone to start using icons in an Astro app.

---

## Dependencies Summary

```
Phase 1 → Phase 2 → Phase 3 → Phase 4
                  ↘ Phase 5
```

Phase 4 and Phase 5 can begin in parallel once Phase 3 is complete.
