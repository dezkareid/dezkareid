## Context
The project lacks a visual reference for its design tokens. While we have machine-readable outputs, designers and developers need a way to see swatches, spacing scales, and breakpoint values. We already have a build process (`style-dictionary`) that generates CSS and JS versions of the tokens.

## Goals / Non-Goals

**Goals:**
- Create a lightweight, zero-dependency visualizer for all design tokens.
- Support simultaneous visualization of light and dark theme values for colors.
- Provide a clear, categorized view of Colors, Spacing, Typography, and Breakpoints.

**Non-Goals:**
- Replacing professional documentation tools like Storybook or Docusaurus.
- Providing a token editing interface.
- Theme toggling or dynamic color scheme switching (removed to maintain simplicity).
- Adaptive `light-dark()` swatches (removed to focus on individual theme values).

## Decisions

### 1. Implementation: Single-Page Static HTML with Dev Server
We will implement the visualizer as a single `visualizer.html` file located in `scripts/visualizer/`. To support loading ESM modules (`dist/js/tokens.mjs`), we will use `http-server`.
- **Rationale**: Browsers block ESM modules when opening via `file://`. A simple server is needed.
- **Alternatives**:
  - **Bundling with Vite/Webpack**: More complex than needed.
  - **Inline JS**: Makes the code harder to manage and separate from build outputs.

### 2. Data Source: JSON/JS Exports
The visualizer will consume the generated `dist/js/tokens.mjs` to dynamically build the UI.
- **Rationale**: Using the generated JS ensures the visualizer is always in sync with the latest build.

### 3. Clean Naming Mapping Logic
The visualizer will implement a robust `toKebab` function to map PascalCase JS exports to kebab-case CSS variables, explicitly stripping internal `Val` prefixes (e.g., `ColorBaseBlue500` -> `--color-base-blue-500`).
- **Rationale**: This ensures correct visual representation and CSS variable identification even when JS identifiers require prefixes.

### 4. Layout & Components
- **Color Swatches**: Rendered as `<div>` elements with `background-color: var(--token-name)`.
- **Theme Grouping**: Semantic color tokens are displayed as pairs (Light / Dark) side-by-side to show both theme values simultaneously for direct comparison.
- **Spacing**: Rendered as two blocks with a `gap` or `margin` equal to the token value.
- **Breakpoints**: Listed with their raw values.
- **No Dynamic Theme Switching**: To simplify the UI and focus on verification, the visualizer shows both theme values at once rather than switching between them.

## Risks / Trade-offs

- **[Risk] Path Sensitivity** → The visualizer relies on relative paths to `dist/`. If the folder structure changes, the visualizer will break.
  - **Mitigation**: Use a script to launch the visualizer from the project root or provide a clear `npm run visualizer` command.
