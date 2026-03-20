## Why

Currently, the design token catalog export is limited to color tokens and optimized primarily for human reading. As AI-assisted development becomes standard, there is a critical need for a comprehensive, **AI-readable** reference of all design tokens (color, spacing, typography, breakpoints). This change ensures that LLMs and automated tools can accurately parse, understand, and apply the design system's tokens with full context.

## What Changes

- **AI-Optimized Metadata**: Update `src/utils/catalog-generator.js` to include structural metadata and consistent formatting that improves LLM token recognition and association.
- **Full System Coverage**: Expand export to include all token categories: color, spacing, typography, and breakpoints.
- **Generalized CLI Tool**: Update `scripts/export-catalog.js` to support multi-category exports with an emphasis on structured Markdown that serves as a high-quality context window for AI.
- **BREAKING**: The default export format will transition from a human-centric color table to a structured, comprehensive catalog of all system tokens.

## Capabilities

### New Capabilities
- `ai-token-catalog`: A capability focused on generating machine-readable and LLM-friendly design token catalogs in Markdown, ensuring AI agents have the context needed to implement designs correctly.

### Modified Capabilities
- `color-catalog-cli`: This legacy capability will be replaced by the more robust `ai-token-catalog`.

## Impact

- `scripts/export-catalog.js`: Refactored to prioritize structured data output.
- `src/utils/catalog-generator.js`: Enhanced to provide semantic grouping and AI-friendly descriptions.
- **AI Integration**: Enables providing the design system as a "context file" for coding assistants.
