## Context

The project uses Style Dictionary to manage design tokens. Developers need a way to quickly grab a reference of color tokens and their platform-specific names (CSS, SCSS, JS) to use in AI prompts or code.

## Goals / Non-Goals

**Goals:**
- Provide a CLI command to output color catalogs.
- Support `--format` flag for `css`, `scss`, and `js`.
- Output clean, text-only Markdown optimized for AI token usage.
- Ensure names match the actual generated output files.

**Non-Goals:**
- Visual swatches or images.
- Documentation for non-color tokens.
- Permanent file generation (focus is on CLI output).

## Decisions

### 1. Style Dictionary Platform for Catalogs
We will add a `catalog` platform to `sd.config.js` that generates three separate files:
- `dist/catalogs/color-css.md`
- `dist/catalogs/color-scss.md`
- `dist/catalogs/color-js.md`

### 2. Custom Style Dictionary Format
We will implement a custom Style Dictionary format that generates the AI-optimized Markdown table. This ensures the files are created automatically during `npm run build`.

### 3. CLI Viewer Logic
The CLI command will no longer initialize Style Dictionary itself. Instead, it will:
- Check if the requested catalog file exists in `dist/catalogs/`.
- If it doesn't exist, suggest running `npm run build`.
- If it exists, read the file and output its content to `stdout`.

## Risks / Trade-offs

- **[Risk]** The catalog files might be stale if the user hasn't run the build.
- **[Mitigation]** The CLI command will check the file existence and potentially the timestamp, or simply prompt the user to build if files are missing.
