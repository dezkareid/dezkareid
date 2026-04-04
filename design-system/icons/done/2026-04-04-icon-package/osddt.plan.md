# Implementation Plan: Icon Package (`@dezkareid/icons`)

## Architecture Overview

The `@dezkareid/icons` package is a build-time SVG icon library. Raw SVG files are the source of truth; a build pipeline transforms them into framework-specific component exports.

**Key decisions:**
- **Source format**: Hand-authored SVG files in `src/svg/` using kebab-case filenames (e.g., `arrow-right.svg`)
- **Build tool**: `tsup` (already in the scaffold) — used for TypeScript compilation and bundling
- **SVG optimization**: `svgo` runs as a pre-build step to clean up SVG markup before code generation
- **Color flexibility**: SVGs authored with `currentColor` for `fill` and/or `stroke` so they inherit CSS `color`
- **Size control**: `width` and `height` driven by `--icon-size` CSS custom property (defaults to `1em`)
- **Code generation**: A custom script (`scripts/build-icons.ts`) reads optimized SVGs and emits typed React components — one file per icon + a barrel export
- **Entry points (this iteration)**: `@dezkareid/icons/react` only; Astro deferred
- **Tree-shaking**: Each icon is its own named export; tsup is configured with `splitting: true` and `treeshake: true`
- **Output**: `dist/react.js` (ESM) + `dist/react.d.ts`; no CJS needed for a pure ESM design-system package

**Directory layout after build:**
```
design-system/icons/
├── src/
│   ├── svg/               # Source SVGs (kebab-case filenames)
│   │   └── arrow-right.svg
│   ├── react/             # Generated React components (gitignored)
│   │   └── ArrowRight.tsx
│   └── index.ts           # Re-exports everything from react/ (generated)
├── scripts/
│   └── build-icons.ts     # SVG → React codegen script
├── dist/                  # tsup output
│   ├── react.js
│   └── react.d.ts
├── tsup.config.ts
└── package.json
```

---

## Implementation Phases

### Phase 1 — SVG source setup

**Goal**: Establish the SVG authoring conventions and add an initial icon set.

1. Create `src/svg/` directory.
2. Define SVG authoring guidelines:
   - `viewBox="0 0 24 24"` — 24×24 grid
   - `width` and `height` set to `var(--icon-size, 1em)` via inline style or removed entirely (controlled by CSS)
   - `fill="currentColor"` or `stroke="currentColor"` (no hardcoded colors)
   - No `id`, `class`, or `style` attributes in source SVGs (SVGO will clean these)
3. Author an initial set of icons covering common UI needs:
   - Navigation: `arrow-right`, `arrow-left`, `arrow-up`, `arrow-down`, `chevron-right`, `chevron-left`, `chevron-up`, `chevron-down`
   - Actions: `close`, `check`, `plus`, `minus`, `edit`, `trash`, `search`, `filter`
   - Status: `info`, `warning`, `error`, `success`
   - Media: `play`, `pause`, `stop`

### Phase 2 — SVGO optimization

**Goal**: Add an SVGO pass that cleans SVG source files before code generation.

1. Add `svgo` as a dev dependency.
2. Create `svgo.config.mjs` with a preset that:
   - Removes metadata, comments, and hidden elements
   - Collapses groups where safe
   - Preserves `currentColor` (do not convert colors to literals)
   - Removes `width`/`height` attributes (size controlled via CSS)
3. The code generation script (Phase 3) will pipe each SVG through SVGO in-memory before emitting components — no separate CLI step needed.

### Phase 3 — Code generation script

**Goal**: Automate the conversion of optimized SVGs into typed React components.

1. Create `scripts/build-icons.ts`:
   - Reads all `*.svg` files from `src/svg/`
   - For each file:
     - Runs SVGO optimization in-memory
     - Converts kebab-case filename to PascalCase component name (`arrow-right.svg` → `ArrowRight`)
     - Emits `src/react/<PascalCase>.tsx` with the component (see template below)
   - Emits `src/react/index.ts` barrel that re-exports all components
   - Emits `src/icons.ts` with a typed `IconName` union (`'arrow-right' | 'arrow-left' | ...`)

2. **React component template** (per icon):
   ```tsx
   import type { SVGProps } from 'react';

   interface ArrowRightProps extends SVGProps<SVGSVGElement> {
     label?: string;
   }

   export function ArrowRight({ label, ...props }: ArrowRightProps) {
     return (
       <svg
         aria-hidden={label ? undefined : true}
         aria-label={label}
         role={label ? 'img' : undefined}
         style={{ width: 'var(--icon-size, 1em)', height: 'var(--icon-size, 1em)' }}
         {...props}
       >
         {/* optimized SVG inner markup */}
       </svg>
     );
   }
   ```

3. Add a `generate` script to `package.json`:
   ```json
   "generate": "tsx scripts/build-icons.ts"
   ```
4. Add `src/react/` and `src/icons.ts` to `.gitignore` (generated files).

### Phase 4 — tsup build configuration

**Goal**: Configure tsup to bundle the generated React components into a publishable `dist/`.

1. Create `tsup.config.ts`:
   ```ts
   import { defineConfig } from 'tsup';

   export default defineConfig({
     entry: { react: 'src/react/index.ts' },
     format: ['esm'],
     dts: true,
     splitting: true,
     treeshake: true,
     clean: true,
     external: ['react'],
   });
   ```
2. Update `package.json` exports:
   ```json
   "exports": {
     "./react": {
       "import": "./dist/react.js",
       "types": "./dist/react.d.ts"
     }
   }
   ```
3. Remove the legacy `"main"`, `"module"`, `"types"` top-level fields (superseded by `exports`).
4. Update `"build"` script to run generate then tsup:
   ```json
   "build": "tsx scripts/build-icons.ts && tsup"
   ```
5. Add `tsx` as a dev dependency (needed to run the codegen script).

### Phase 5 — Turbo integration & build verification

**Goal**: Ensure the package participates correctly in the monorepo pipeline.

1. Add `src/svg/*.svg` to the `turbo.json` `build.inputs` array so Turbo invalidates cache when SVGs change.
2. Run `pnpm turbo run build --filter=@dezkareid/icons` from the repo root and verify:
   - `dist/react.js` is produced
   - `dist/react.d.ts` is produced
   - No errors

### Phase 6 — Tests

**Goal**: Verify icon rendering and accessibility contract.

1. Add `@testing-library/react`, `react`, `react-dom`, `jsdom` as dev dependencies.
2. Update `vitest.config.ts` to use `jsdom` environment for `src/**/*.test.tsx`.
3. Write tests in `src/react/__tests__/icons.test.tsx`:
   - An icon with no `label` renders with `aria-hidden="true"`
   - An icon with `label="Go forward"` renders with `aria-label="Go forward"` and `role="img"`
   - The `--icon-size` custom property is applied to `width`/`height` style
   - All icon names are present in the `IconName` type (compile-time check via `satisfies`)

### Phase 7 — Storybook stories

**Goal**: Add a visual catalog story to `ui-tools/storybook-react`.

1. Create `ui-tools/storybook-react/src/stories/icons/IconCatalog.stories.tsx`:
   - Imports all icons from `@dezkareid/icons/react`
   - Renders a grid showing every icon with its name below it
   - Provides controls for `--icon-size` and `color`
2. Add `@dezkareid/icons` to `storybook-react` dependencies.

### Phase 8 — Documentation update

**Goal**: Update README and AGENTS.md to reflect the final architecture.

1. Update `design-system/icons/README.md` with:
   - Installation instructions
   - Usage examples (React)
   - SVG authoring guidelines for adding new icons
   - CSS custom property reference
2. Update `design-system/icons/AGENTS.md` with final architecture and tech stack.

---

## Technical Dependencies

| Dependency | Type | Purpose |
|---|---|---|
| `svgo` | devDependency | SVG optimization in codegen script |
| `tsx` | devDependency | Run TypeScript codegen script without pre-compiling |
| `react` | peerDependency | React (peer, not bundled) |
| `@types/react` | devDependency | React type definitions |
| `@testing-library/react` | devDependency | Component tests |
| `react-dom` | devDependency | Required by testing-library |
| `jsdom` | devDependency | DOM environment for Vitest |

Existing devDependencies already in scaffold: `tsup`, `typescript`, `vitest`.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| SVGO strips `currentColor` and breaks color inheritance | Configure SVGO to preserve `currentColor`; add a test that checks `fill`/`stroke` is still `currentColor` after optimization |
| Generated files committed accidentally | Add `src/react/` and `src/icons.ts` to `.gitignore` |
| tsup `splitting` breaks named imports in some bundlers | Verify with a minimal consumer test; ESM + splitting is broadly supported |
| SVG inner markup is unsafe to inject as JSX | Use `dangerouslySetInnerHTML` only on `<svg>` inner content, not on full SVG; or parse to JSX AST during codegen |
| `tsx` version incompatibility | Pin to exact version matching monorepo conventions |

---

## Out of Scope

- Astro entry point (`@dezkareid/icons/astro`) — deferred to a future iteration
- Angular entry point — explicitly deferred
- Icon fonts, sprite sheets, or animated icons
- Brand/logo icons
- Figma integration
- Runtime icon registration or dynamic icon loading
- CJS output (ESM-only package)
