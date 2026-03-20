## 1. Style Dictionary Configuration

- [x] 1.1 Update `sd.config.js` to refactor `markdown/catalog` format to remove color filtering and support all tokens
- [x] 1.2 Implement semantic grouping logic in `sd.config.js` to add category headers (Color, Spacing, Typography, Breakpoints)
- [x] 1.3 Update the `catalog` platform in `sd.config.js` to output `all-tokens-css.md`, `all-tokens-scss.md`, and `all-tokens-js.md`
- [x] 1.4 Refactor `markdown/catalog` format to include CSS, SCSS, and JS variable names alongside values in the same table where appropriate for AI context

## 2. CLI Tool Updates

- [x] 2.1 Update `scripts/export-catalog.js` to point to the new `all-tokens-*.md` destination files
- [x] 2.2 Update CLI description and options in `scripts/export-catalog.js` to reflect full token coverage
- [x] 2.3 Ensure the CLI correctly handles the absence of files and provides helpful error messages for the new filenames

## 3. Testing and Validation

- [x] 3.1 Update existing test suites (e.g., in `src/utils/__tests__`) to reflect the change from color-only to all-token catalogs
- [x] 3.2 Add new test cases to verify semantic grouping and multi-category support in catalog generation
- [x] 3.3 Run `npm run build` to verify new catalogs are generated correctly in `dist/catalogs/`
- [x] 3.4 Verify `all-tokens-css.md` contains Color, Spacing, Typography, and Breakpoint sections
- [x] 3.5 Verify `scripts/export-catalog.js` outputs the new comprehensive catalogs correctly
- [x] 3.6 Check the generated Markdown structure against AI-readability goals (consistent tables, clear headers)
