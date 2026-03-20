## Context

The current catalog generation is baked into `sd.config.js` via the `markdown/catalog` format, which is explicitly filtered to only include `colorTokens`. The CLI tool (`scripts/export-catalog.js`) simply reads these pre-generated Markdown files from `dist/catalogs/`. To provide an AI-readable catalog of all tokens, we need to update the build process to generate comprehensive files and update the CLI to point to these new, all-inclusive catalogs.

## Goals / Non-Goals

**Goals:**
- **Full Token Coverage**: Update the `markdown/catalog` format in `sd.config.js` to process all tokens, not just colors.
- **AI-Optimized Multi-Platform Output**: Include CSS, SCSS, and JS variable names in a single, structured table to maximize context for AI agents.
- **Maintain File-Based CLI**: Keep the CLI approach of reading from `dist/` but point it to the new "all-tokens" catalogs.
- **Semantic Grouping**: Ensure the generated Markdown uses clear headers for each token category (Color, Spacing, Typography, Breakpoints).

**Non-Goals:**
- Removing the current color-only catalogs (they will be replaced by the all-token versions).
- Changing the primary token transformation logic for CSS/SCSS/JS files.

## Decisions

### 1. Consolidate into `all-tokens` Catalogs
The `sd.config.js` will be updated to produce `all-tokens-css.md`, `all-tokens-scss.md`, and `all-tokens-js.md`.
- **Rationale**: Providing separate catalogs for each format allows users/AI to select the specific platform syntax they need without wading through irrelevant code.

### 2. Multi-Variable Markdown Format
The `markdown/catalog` format will be refactored to include both the platform-specific name and the raw value.
- **Rationale**: AI models benefit from seeing the direct mapping between a design intent (the token value) and the technical implementation (the variable name).

### 3. Category Header Injection
The generator will group tokens by their top-level path segment (e.g., `spacing`, `typography`) and inject Markdown headers before each group.
- **Rationale**: This provides the "Semantic Grouping" required by the spec, making the document easily parsable by both humans and LLMs.

## Risks / Trade-offs

- **[Risk] File Bloat** → **Mitigation**: While the files will be larger, Markdown is highly compressible and efficient for LLM consumption compared to raw JSON or split files.
- **[Trade-off] Build Time** → **Mitigation**: Generating Markdown is a low-overhead task for Style Dictionary and won't significantly impact build performance.

## Open Questions

- Should we keep the specific `color-css.md` files? (Decision: No, they will be subsumed by the comprehensive catalogs to avoid duplication).
