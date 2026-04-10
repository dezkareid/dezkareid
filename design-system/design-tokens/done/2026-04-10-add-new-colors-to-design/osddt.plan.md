# Implementation Plan: Add New Colors to Design System

This plan outlines the steps to introduce new global and semantic color tokens, including a reusable alpha manipulation mechanism in the Style Dictionary configuration.

## Architecture Overview
- **Global Tokens (Tier 1)**: Expand `src/tokens/color/global.json` with `rose` and `orange` palettes, including light and dark variants.
- **Alpha Support**: Enhance `sd.config.js` by registering a custom transform that can process alpha modifications (e.g., using a custom attribute or a nested value structure) without requiring external dependencies.
- **Semantic Tokens (Tier 2)**: Update `src/tokens/color/semantic.json` to include the `like` and `error` tokens, utilizing theme-specific aliases and the new alpha mechanism.

## Implementation Phases

### Phase 1: Alpha Support in Style Dictionary
- **Goal**: Enable alpha/opacity manipulation in token definitions.
- **Steps**:
    1.  Research/Implement a custom transform in `sd.config.js` that detects an `alpha` property on a color token.
    2.  Update the `color/css` transform (or add a custom one) to produce `rgba()` or hex-with-alpha values when `alpha` is present.
    3.  Verify the transform with a small temporary token.

### Phase 2: Update Global Tokens
- **Goal**: Provide the foundational colors (`rose`, `orange`) in the base palette.
- **Steps**:
    1.  Modify `src/tokens/color/global.json` to add:
        - `rose.500` (Light: `#f43f6e`, Dark: to be determined for contrast).
        - `orange.400` (Light: `#fb923c`, Dark: to be determined for contrast).
    2.  Add a proper `rose.100` and `rose.900` for a consistent palette if applicable.

### Phase 3: Update Semantic Tokens
- **Goal**: Expose the functional colors for applications.
- **Steps**:
    1.  Modify `src/tokens/color/semantic.json` to add the `like` group:
        - `like`: Default state.
        - `like-hover-bg`: Rose-500 with 0.08 alpha.
        - `like-gradient-from`: Rose-500.
        - `like-gradient-to`: Orange-400.
    2.  Add the `error` semantic token, aliasing a suitable red shade.
    3.  Verify `text-secondary` is using `light-dark(#4b5563, #9ca3af)`.

### Phase 4: Catalog Generation Update
- **Goal**: Improve token discovery by moving catalogs from \`dist/\` to the project root.
- **Steps**:
    1.  Modify \`sd.config.js\` to change the \`catalog\` build path from \`dist/catalogs/\` to \`catalogs/\`.
    2.  Update the \`export-catalog.js\` script (if necessary) to ensure it correctly identifies the new path.
    3.  Update \`AGENTS.md\` to point to these new catalog files as the primary source for token discovery.

### Phase 5: Build & Validation
- **Goal**: Ensure all outputs are correct and accessible.
- **Steps**:
    1.  Run \`pnpm build\` and inspect \`dist/\` and \`catalogs/\`.
    2.  Run \`pnpm test\` to ensure naming and transformation logic holds.
    3.  Run \`pnpm contrast-check\` to validate WCAG compliance for new semantic tokens.


## Technical Dependencies
- **Style Dictionary 5.x**: Core engine for token transformation.
- **Node.js**: Execution environment.

## Risks & Mitigations
- **Complexity of Alpha Support**: If a custom transform becomes too complex, fallback to defining specific global tokens for alpha variants (e.g., `rose-500-alpha-8`).
- **Contrast Ratios**: The suggested `rose-500` on white might be tight for AA. Mitigation: Adjust dark mode variants or provide a slightly darker rose if needed.

## Out of Scope
- Consuming these tokens in `collectstory` or `main-website` (application side updates).
