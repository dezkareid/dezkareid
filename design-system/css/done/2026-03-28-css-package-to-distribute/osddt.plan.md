# Implementation Plan: CSS Commons Package (ITCSS + SASS)

## Architecture Overview
The package will follow the **ITCSS (Inverted Triangle CSS)** methodology to manage specificity and scalability. The project will be built using **SASS (SCSS)** to provide powerful tools (mixins/functions) while distributing both source SCSS and compiled CSS.

### ITCSS Layers:
1.  **Settings**: Global variables, design tokens integration (no output).
2.  **Tools**: SASS mixins and functions (no output).
3.  **Generic**: Reset and ground-zero styles (first layer of specificity).
4.  **Elements**: Unclassed HTML elements (h1, a, etc.).
5.  **Objects**: Class-based, non-cosmetic layout primitives (stack, center, cluster).
6.  **Components**: (Minimal/Empty) Specific UI components belong in `@dezkareid/components`.
7.  **Utilities**: High-specificity, single-purpose helper classes.

## Implementation Phases

### Phase 1: Project Setup (SASS)
- [ ] Initialize `package.json` with SASS and LightningCSS dependencies.
- [ ] Set up the ITCSS folder structure under `src/`.
- [ ] Create a master `main.scss` that `@forward`s or `@use`s all layers.

### Phase 2: Core Layers (Settings, Tools, Generic)
- [ ] **Settings**: Link `@dezkareid/design-tokens` CSS variables as SASS variables if needed, or use them directly.
- [ ] **Tools**: Implement core mixins for typography, spacing, and media queries (e.g. `_breakpoints.scss`).
- [ ] **Generic**: Port the modern reset into the Generic layer (e.g. `_reset.scss`).

### Phase 3: Objects & Elements
- [ ] **Elements**: Define base styles for common elements (e.g., fluid typography basics).
- [ ] **Objects**: Implement layout primitives (Stack, Center, Cluster, Grid) as SASS mixins *and* CSS classes.
- [ ] **App Layouts**: Implement `max-page-size` and other page-level objects.

### Phase 4: Utilities
- [ ] Implement a generator for utility classes (spacing, typography, visibility) using SASS loops and design tokens.

### Phase 5: Build & Distribution
- [ ] Configure `sass` to compile SCSS to CSS.
- [ ] Use `lightningcss` for bundling and minification.
- [ ] Ensure `dist/` contains:
    -   `index.css` (the full bundle)
    -   Individual layer files (e.g., `reset.css`, `utilities.css`)
    -   `scss/` folder with all source files for SASS consumers.

## Technical Dependencies
- `sass`: For pre-processing and tool creation.
- `lightningcss`: For bundling, minification, and modern CSS features.
- `@dezkareid/design-tokens`: Primary source of visual values.

## Risks & Mitigations
- **Complexity**: ITCSS can be overkill for small sets. *Mitigation: Keep layers focused and avoid over-engineering the "Components" layer.*
- **Specificity**: SASS nesting can lead to high specificity. *Mitigation: Enforce a "shallow nesting" rule in the linting/style guide.*

## Out of Scope
- JavaScript-based dynamic theming (logic stays in components).
- Icon fonts or SVG assets.
