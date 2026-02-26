## Why

AI assistants and developers need a clear, text-based reference of the color system. Generating permanent Markdown catalog files during the build process ensures they are always in sync with the tokens, while a CLI command provides a convenient way to output these files for easy copy-pasting into prompts.

## What Changes

- Update the build process to generate permanent Markdown catalog files for CSS, SCSS, and JS formats.
- Add/Update a CLI command to locate and output the content of these generated catalog files based on the requested format.
- Optimize the generated files for AI context (text-only, clear hierarchy).

## Capabilities

### New Capabilities
- `color-catalog-generation`: Ability to generate Markdown catalog files as part of the Style Dictionary build.
- `color-catalog-viewer`: CLI command to read and output the generated catalog files.

## Impact

- CLI interface (new command `export-catalog` or similar).
- Developer workflow (easier to provide context to AI tools).
