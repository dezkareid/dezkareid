# Tasks: Application Styles Package

## Phase 1: Research & Setup
- [x] [S] Audit `apps/main-website` for shared styling patterns (resets, layout, reveal).
- [x] [S] Audit `apps/collectstory` for shared styling patterns (globals, resets, layout).
- [x] [S] Map current `design-system/css` ITCSS structure for integration points.

**DoD**: Clear list of CSS rules and utilities to extract.

## Phase 2: Core Generic & Element Styles
- [x] [S] Update `src/generic/_reset.scss` with universal resets (box-sizing, global margins).
- [x] [S] Enhance `src/elements/_base.scss` with typography foundations from research.
- [x] [M] Create `src/settings/_themes.scss` for automatic light/dark theming logic.

**DoD**: Base styling foundation using design tokens is established.

## Phase 3: Layout Objects & Utilities
- [x] [M] Implement OOCSS layout objects in `src/objects/` (e.g., `.o-container`, `.o-stack`).
- [x] [S] Implement `src/utilities/_reveal.scss` for scroll-reveal animations.
- [x] [S] Add standard utility classes (visibility, spacing, alignment).

**DoD**: Reusable layout objects and utilities are available and following BEM/OOCSS.

## Phase 4: Bundling & Documentation
- [x] [S] Update `src/main.scss` to import all new ITCSS modules.
- [x] [M] Create `AGENTS.md` with package overview and usage documentation.
- [x] [S] Verify `pnpm build` output in `dist/index.css` reflects all changes.

**DoD**: Package builds successfully with all new styles and is documented for AI agents.

## Dependencies
- Phase 2 requires completion of Phase 1 audits.
- Phase 3 depends on Phase 2 core styles.
- Phase 4 requires implementation of all styles in Phases 2 and 3.
