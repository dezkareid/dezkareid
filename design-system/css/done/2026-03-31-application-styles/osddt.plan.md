# Implementation Plan: Application Styles Package

## Architecture Overview
The shared styles will follow the **ITCSS** (Inverted Triangle CSS) methodology, extending the existing structure in `design-system/css`. This approach ensures a clear separation of concerns, starting from generic resets and moving towards specific utilities.

- **Naming Convention**: **BEM** (Block, Element, Modifier) for components and **OOCSS** (Object-Oriented CSS) for layout objects.
- **Theming**: **Automatic Theming Base** that uses CSS custom properties from `@dezkareid/design-tokens`. It will support `.light`, `.dark`, and `prefers-color-scheme`.
- **Distribution**: Both modular imports (e.g., `@import "@dezkareid/css/src/generic/reset"`) and a single bundled `index.css` for ease of use.

## Implementation Phases

### Phase 1: Research & Setup
- **Objective**: Finalize the list of styles to extract and prepare the development environment.
- **Steps**:
    - Deep-dive into `apps/main-website` and `apps/collectstory` CSS to identify shared patterns.
    - Confirm the ITCSS directory structure is ready for the new additions.

### Phase 2: Core Generic & Element Styles
- **Objective**: Implement the base styling foundation.
- **Steps**:
    - Enhance `src/generic/_reset.scss` with standard resets (box-sizing, margin resets).
    - Update `src/elements/_base.scss` with typography foundations (font-family, line-height, base color).
    - Implement the **Automatic Theming Base** in a new `src/settings/_themes.scss` or similar.

### Phase 3: Layout Objects & Utilities
- **Objective**: Provide common layout containers and utility classes.
- **Steps**:
    - Implement OOCSS layout objects in `src/objects/` (e.g., `.o-container`, `.o-stack`, `.o-grid`).
    - Extract and implement the `reveal` scroll animation utility in `src/utilities/_reveal.scss`.
    - Add common utilities for visibility, spacing, and alignment.

### Phase 4: Bundling & Documentation
- **Objective**: Prepare the package for consumption and provide guidance for agents.
- **Steps**:
    - Update `src/main.scss` to import all new modules.
    - Create `AGENTS.md` with package overview, usage instructions, and key reference information.
    - Verify the build process (`pnpm build`) correctly generates the new `dist/index.css`.

## Technical Dependencies
- **Sass**: For pre-processing and module management.
- **LightningCSS**: For bundling and minification.
- **@dezkareid/design-tokens**: The source of truth for all visual values.

## Risks & Mitigations
- **Specificity Issues**: High-specificity selectors can make overrides difficult. *Mitigation: Adhere strictly to ITCSS to keep specificity low and predictable.*
- **Breaking Changes**: Moving styles from apps to a shared package could introduce regressions. *Mitigation: The current scope is only extraction; actual migration in apps will be a separate task with its own validation.*

## Out of Scope
- Migrating `apps/main-website` or `apps/collectstory` to use the new shared package.
- Implementing complex, component-specific styles that are not widely shared.
