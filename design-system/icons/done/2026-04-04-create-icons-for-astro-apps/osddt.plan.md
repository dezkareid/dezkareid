# Implementation Plan: Astro Icon Export for `@dezkareid/icons`

## Architecture Overview

The Astro entry point follows the same strategy as `@dezkareid/components/astro`: raw `.astro` source files shipped inside the package, compiled by the consumer's Astro toolchain — no pre-bundling.

The build pipeline is extended symmetrically with the React pipeline:

```
src/svg/*.svg
    ↓  scripts/build-icons.ts (existing, extended)
    ↓  SVGO optimization (shared, same config as React)
    ↓  PascalCase component generation
src/react/*.tsx        ← existing generated output
src/astro/*.astro      ← NEW generated output (same SVG content)
src/astro/index.ts     ← NEW generated barrel
    ↓  tsup (React only — Astro is shipped as source)
dist/react.mjs + dist/react.d.mts   ← existing
```

The `./astro` package export points to `src/astro/index.ts` — identical pattern to `@dezkareid/components/astro`.

### Key decisions
- **Same SVGO pass**: the existing in-memory SVGO optimization in `build-icons.ts` already produces the correct optimized SVG. Astro components reuse the same `innerSvg` string — no duplication of optimization logic.
- **No attribute conversion**: React needs `strokeWidth`, `fillRule`, etc. (camelCase). Astro uses HTML attribute names natively — the raw SVG inner content is inserted verbatim via a `<Fragment set:html>` directive, so no JSX attr mapping is needed.
- **Prop API parity**: both React and Astro components expose `label?: string` and `class?: string`. Size is `var(--icon-size, 1em)`, colour is `currentColor`.
- **Brand SVGs added**: `github.svg`, `linkedin.svg`, `rss.svg`, and `pixel-crab.svg` added to `src/svg/` — picked up automatically by the existing build script.

## Implementation Phases

### Phase 1 — Add brand/social SVGs to `src/svg/`

**Goal**: expand the icon catalogue with the four icons currently inlined in `main-website`.

Steps:
1. Extract the inline SVG markup for GitHub, LinkedIn, and RSS from `apps/main-website/src/components/SocialLinks.astro`.
2. Normalise each to the SVG authoring conventions: `viewBox="0 0 24 24"`, `currentColor` only, no `width`/`height`, no `id`/`class`/`style`.
3. Save as `src/svg/github.svg`, `src/svg/linkedin.svg`, `src/svg/rss.svg`.
4. **Pixel-crab is excluded** — it uses multi-colour fills that cannot be reduced to `currentColor` and is not a standard UI icon; it remains inline in `PixelCrab.astro`.

### Phase 2 — Extend `build-icons.ts` to emit `.astro` files

**Goal**: generate an `.astro` component file per SVG alongside the existing `.tsx` file, using the same SVGO pass.

Steps:
1. Add `ASTRO_DIR = path.resolve('src/astro')` constant.
2. In the `buildIcons` loop, after generating the React component, generate the Astro component using the same `innerSvg` and `optimized` variables — no extra SVGO call.
3. Astro component template (no JSX attr conversion needed):

```astro
---
interface Props {
  label?: string;
  class?: string;
}

const { label, class: className } = Astro.props;
---

<svg
  viewBox="0 0 24 24"
  aria-hidden={label ? undefined : 'true'}
  aria-label={label}
  role={label ? 'img' : undefined}
  class={className}
  style="width: var(--icon-size, 1em); height: var(--icon-size, 1em);"
>
  <Fragment set:html="{innerSvg}" />
</svg>
```

4. Emit `src/astro/index.ts` barrel (same pattern as `src/react/index.ts`):
   ```ts
   export { default as ArrowRight } from './ArrowRight.astro';
   // ...
   ```
5. Verify `src/react/index.ts` barrel still uses `.js` extension (no change needed).

### Phase 3 — Wire up the `./astro` package export

**Goal**: expose `@dezkareid/icons/astro` from `package.json`.

Steps:
1. Add to `package.json` exports:
   ```json
   "./astro": {
     "types": "./src/astro/index.ts",
     "default": "./src/astro/index.ts"
   }
   ```
   This mirrors the `@dezkareid/components/astro` pattern exactly.
2. Add `src/astro/` to `files` array in `package.json` (so it is included when published).
3. Update `tsconfig.json` if needed so TypeScript resolves `.astro` imports correctly.

### Phase 4 — Integrate into `main-website`

**Goal**: add `@dezkareid/icons` as a dependency and replace at least one inline SVG with a design system icon component.

Steps:
1. Add `"@dezkareid/icons": "workspace:*"` to `apps/main-website/package.json` dependencies.
2. Run `pnpm install` from the monorepo root.
3. Choose `ThemeToggle.astro` as the integration proof — it already embeds sun/moon SVGs inline (from Heroicons) and is the simplest swap.
   - Replace inline sun SVG with `<Sun />` imported from `@dezkareid/icons/astro`.
   - Replace inline moon SVG with `<Moon />` imported from `@dezkareid/icons/astro`.
   - Ensure `sun.svg` and `moon.svg` exist in `src/svg/` (add if missing).
4. Verify the build: `pnpm turbo run build --filter=@dezkareid/main-website`.

### Phase 5 — Update documentation

**Goal**: `README.md` and `AGENTS.md` for `@dezkareid/icons` reflect the new Astro entry point.

Steps:
1. Add `./astro` entry to the **Package Exports** section of `AGENTS.md`.
2. Add Astro usage example to `README.md` (import, props table, sizing/colour notes).
3. Remove "Astro entry point (`@dezkareid/icons/astro`) — deferred" from the **Out of Scope** section of `AGENTS.md`.
4. Update the **Data flow** diagram in `AGENTS.md` to include `src/astro/*.astro`.

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| `svgo` | Existing in `@dezkareid/icons` | Shared with React pipeline — no new dep |
| `tsx` | Existing | Runs `build-icons.ts` |
| `tsup` | Existing | React bundle only — Astro ships as source |
| `astro` | Existing in `main-website` | Compiles `.astro` files at consumer build time |
| `@dezkareid/icons` workspace dep | New in `main-website` | Add `"workspace:*"` to `package.json` |

No new packages need to be installed.

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Brand SVG viewBoxes differ from `0 0 24 24` | Normalise manually during extraction; verify visually |
| `pixel-crab.svg` uses multi-colour fills | Excluded from migration — remains inline in `PixelCrab.astro` |
| Astro doesn't resolve `src/astro/index.ts` without an `astro` integration | The `@dezkareid/components/astro` precedent works without one — Astro's standard module resolution handles `.ts` barrels |
| tsup `clean: true` deletes `src/` on build | `clean` only removes `dist/` — `src/` is safe; verify this assumption in `tsup.config.ts` (confirmed: tsup cleans `dist/` only) |
| TypeScript errors on `.astro` imports in the barrel | Add `"@astrojs/ts-plugin"` to `tsconfig.json` `plugins` if needed (check if already present in workspace) |

## Out of Scope

- Vue and Angular entry points
- Storybook stories for Astro icon components
- Full replacement of all inline SVGs in `main-website`
- `collectstory` integration
- Animated icons, icon fonts, or sprite sheets
