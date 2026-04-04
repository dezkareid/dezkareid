# Tasks: Icon Package (`@dezkareid/icons`)

## Phase 1 — SVG source setup

- [x] [S] Create `src/svg/` directory
- [x] [M] Author initial icon set (24 icons): `arrow-right`, `arrow-left`, `arrow-up`, `arrow-down`, `chevron-right`, `chevron-left`, `chevron-up`, `chevron-down`, `close`, `check`, `plus`, `minus`, `edit`, `trash`, `search`, `filter`, `info`, `warning`, `error`, `success`, `play`, `pause`, `stop`, `menu`
- [x] [S] Verify all SVGs use `viewBox="0 0 24 24"`, `currentColor` for fill/stroke, and no hardcoded colors or size attributes

**Definition of Done**: All SVGs in `src/svg/`, open in browser, render with correct shape and inherit `currentColor`.

---

## Phase 2 — SVGO optimization

- [x] [S] Add `svgo` as a dev dependency
- [x] [S] Create `svgo.config.mjs` configured to: remove metadata/comments, preserve `currentColor`, remove `width`/`height` attributes, collapse safe groups

**Definition of Done**: Running SVGO manually on a sample SVG produces clean output with `currentColor` intact.

---

## Phase 3 — Code generation script

- [x] [S] Add `tsx` as a dev dependency
- [x] [M] Create `scripts/build-icons.ts` that reads `src/svg/*.svg`, runs SVGO in-memory, and emits typed React components to `src/react/`
- [x] [S] Emit `src/react/index.ts` barrel file re-exporting all generated components
- [x] [S] Emit `src/icons.ts` with `IconName` union type derived from SVG filenames
- [x] [S] Add `"generate": "tsx scripts/build-icons.ts"` script to `package.json`
- [x] [S] Add `src/react/` and `src/icons.ts` to `.gitignore`
- [x] [S] Run `pnpm generate` and verify React components are emitted with correct accessibility props and `currentColor`

**Definition of Done**: `pnpm generate` succeeds, `src/react/ArrowRight.tsx` exists, component uses `currentColor`, accessibility props present.

> Depends on: Phase 1, Phase 2

---

## Phase 4 — tsup build configuration

- [x] [S] Create `tsup.config.ts` with entry `react: src/react/index.ts`, ESM format, `splitting: true`, `treeshake: true`, `dts: true`, `external: ['react']`
- [x] [S] Update `package.json` exports map with `./react` entry pointing to `dist/react.mjs` and `dist/react.d.mts`
- [x] [S] Remove legacy top-level `"main"`, `"module"`, `"types"` fields from `package.json`
- [x] [S] Update `"build"` script in `package.json` to `tsx scripts/build-icons.ts && tsup`
- [x] [S] Add `@types/react` as a dev dependency

**Definition of Done**: `pnpm build` (run via Turborepo) produces `dist/react.js` and `dist/react.d.ts` without errors.

> Depends on: Phase 3

---

## Phase 5 — Turbo integration & build verification

- [x] [S] Add `src/svg/*.svg` to the `inputs` array in the `build` task in `turbo.json`
- [x] [S] Run `pnpm turbo run build --filter=@dezkareid/icons` from repo root and confirm clean output in `dist/`
- [x] [S] Run the build a second time and confirm Turbo uses the cache (no rebuild)

**Definition of Done**: Full Turbo build passes, outputs exist, cache works on second run.

> Depends on: Phase 4

---

## Phase 6 — Tests

- [x] [S] Add `@testing-library/react`, `react`, `react-dom`, `@types/react`, `jsdom` as dev dependencies
- [x] [S] Update `vitest.config.ts` to use `jsdom` environment for `**/*.test.tsx` files
- [x] [M] Write `src/react/__tests__/icons.test.tsx` covering: `aria-hidden` when no label, `aria-label` + `role="img"` when label provided, `--icon-size` applied to width/height style, `IconName` type completeness check
- [x] [S] Run `pnpm turbo run test --filter=@dezkareid/icons` and confirm all tests pass

**Definition of Done**: All tests pass, coverage includes accessibility and sizing contract.

> Depends on: Phase 3

---

## Phase 7 — Storybook stories

- [x] [S] Add `@dezkareid/icons` to `ui-tools/storybook-react` dependencies
- [x] [M] Create `ui-tools/storybook-react/src/stories/icons/IconCatalog.stories.tsx` rendering a grid of all icons with name labels and controls for `--icon-size` and `color`
- [x] [S] Run Storybook and visually verify the icon catalog renders correctly

**Definition of Done**: Storybook shows a full icon catalog grid; size and color controls work.

> Depends on: Phase 4

---

## Phase 8 — Documentation

- [x] [M] Update `design-system/icons/README.md` with installation, usage examples, SVG authoring guidelines, and CSS custom property reference
- [x] [S] Update `design-system/icons/AGENTS.md` with final architecture, tech stack, and codegen flow

**Definition of Done**: README and AGENTS.md accurately describe the final package.

> Depends on: Phase 4

---

## Dependencies Summary

```
Phase 1 ──┐
Phase 2 ──┤─→ Phase 3 ──→ Phase 4 ──→ Phase 5
                    └──→ Phase 6
                              Phase 4 ──→ Phase 7
                              Phase 4 ──→ Phase 8
```
