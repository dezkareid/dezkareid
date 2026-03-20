## 1. Preparation & Refactoring

- [x] 1.1 Refactor `sd.config.js` to extract naming logic (CSS, SCSS, JS) into shared utility functions.
- [x] 1.2 Export these naming utilities for use by the new catalog command.

## 2. Catalog Generation Logic

- [x] 2.1 Create a utility to initialize Style Dictionary and resolve the token dictionary.
- [x] 2.2 Implement a Markdown table generator that takes tokens and a format-specific naming function.
- [x] 2.3 Implement support for theme-aware name resolution (light/dark variants).

## 3. CLI Command Implementation

- [x] 3.1 Create the CLI script to handle arguments using `commander`.
- [x] 3.2 Integrate the CLI script with the catalog generation logic.
- [x] 3.3 Add a new script `tokens:catalog` to `package.json`.

## 4. Verification & Testing

- [x] 4.1 Add unit tests for token naming logic using `vitest`.
- [x] 4.2 Verify CSS catalog output: `npm run tokens:catalog -- --format css`
- [x] 4.3 Verify SCSS catalog output: `npm run tokens:catalog -- --format scss`
- [x] 4.4 Verify JS catalog output: `npm run tokens:catalog -- --format js`
