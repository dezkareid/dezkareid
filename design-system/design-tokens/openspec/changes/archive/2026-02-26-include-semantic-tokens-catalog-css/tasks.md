## 1. Catalog Generator Preparation

- [x] 1.1 Update `src/utils/catalog-generator.js` to identify semantic tokens by checking their path for 'semantic', 'light', and 'dark' keywords.
- [x] 1.2 Implement a pre-processing step to group semantic tokens by their core identity (path without theme identifiers).

## 2. Core Implementation

- [x] 2.1 Implement core semantic token synthesis for the CSS catalog format.
- [x] 2.2 Synthesize the `light-dark()` value for core tokens that have both light and dark variants.
- [x] 2.3 Modify the Markdown generation logic to create a separate "Semantic Tokens" section in the output.

## 3. Formatting and Output

- [x] 3.4 Ensure core semantic tokens are correctly formatted as CSS variables (e.g., `--color-primary`) in the dedicated section.
- [x] 3.5 Verify that global tokens are still correctly grouped in their respective categories before the semantic section.

## 4. Verification

- [x] 4.1 Run `npm run build` to generate the updated catalogs.
- [x] 4.2 Verify that `dist/catalogs/all-tokens-css.md` contains the new "Semantic Tokens" section.
- [x] 4.3 Verify that core variables like `--color-primary` are present with the correct `light-dark()` value.
- [x] 4.4 Run existing tests with `npm test` to ensure no regressions in catalog generation or token naming.
