## Why

The current CSS token catalog only lists explicit theme-prefixed tokens (e.g., `--light-color-primary`, `--dark-color-primary`) but omits the core semantic variables (e.g., `--color-primary`) that utilize the `light-dark()` CSS function. These core variables are the primary interface for developers using the design system, and their absence makes the catalog incomplete for both human developers and AI agents.

## What Changes

- **Update Catalog Generation**: Modify `catalog-generator.js` to identify semantic tokens that have both light and dark variants.
- **Synthesize Core Tokens**: For each semantic pair, include the synthesized "core" CSS variable (without the `light-` or `dark-` prefix) in the CSS-formatted catalog.
- **Value Representation**: Represent the value of these core tokens using the `light-dark()` CSS function syntax (e.g., `light-dark(var(--light-color-primary), var(--dark-color-primary))`) to accurately reflect their implementation.
- **Improved Grouping**: Ensure semantic tokens are clearly distinguishable from base/global tokens in the catalog output.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `ai-token-catalog`: Update the catalog requirements to explicitly include synthesized semantic tokens and their `light-dark()` values in CSS output.

## Impact

- `src/utils/catalog-generator.js`: Logic update to handle semantic token synthesis.
- `dist/catalogs/all-tokens-css.md`: Output will include the new core semantic variables.
- AI agents will have better context on how to use the themed design system in CSS.
