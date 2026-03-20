## ADDED Requirements

### Requirement: Catalog file generation
The system SHALL generate Markdown catalog files for `css`, `scss`, and `js` formats during the build process.

#### Scenario: Build generates files
- **WHEN** user runs `npm run build`
- **THEN** system creates `dist/catalogs/color-css.md`, `dist/catalogs/color-scss.md`, and `dist/catalogs/color-js.md`

### Requirement: CLI viewer for catalogs
The system SHALL provide a CLI command to read and output the content of the generated catalog files.

#### Scenario: Viewing a generated catalog
- **WHEN** user runs `npm run tokens:catalog -- --format css`
- **AND** `dist/catalogs/color-css.md` exists
- **THEN** system outputs the content of that file to the terminal

### Requirement: AI-optimized output
The catalog output SHALL be optimized for AI processing by using a clean, text-only Markdown structure without visual swatches or images.

#### Scenario: Output structure
- **WHEN** user generates any catalog
- **THEN** the output contains a Markdown table with headers: | Token | [Format] Name | Value |
- **AND** the output contains no HTML img tags or external image references

### Requirement: Theme awareness
The catalog SHALL accurately represent themed tokens (light/dark) based on the system's token resolution logic.

#### Scenario: Themed token display
- **WHEN** a token has light and dark variants
- **THEN** the catalog displays the appropriate variable names used in the themed output (e.g., `light-color-primary`, `dark-color-primary`)
