# AI Token Catalog

## Purpose
Generate a machine-readable and LLM-friendly design token catalog in Markdown to provide clear context for AI agents and automated tools.

## Requirements

### Requirement: Multi-Category Support
The AI token catalog MUST include all token categories defined in the design system, specifically: colors, spacing, typography, and breakpoints.

#### Scenario: Exporting all categories
- **WHEN** the user runs the export tool without specific category flags
- **THEN** the output contains sections for Color, Spacing, Typography, and Breakpoints

### Requirement: AI-Optimized Structural Metadata
The catalog SHALL include platform-specific variable names (CSS, SCSS, JS) and their raw values to provide direct and concise context for AI agents.

#### Scenario: Metadata inclusion
- **WHEN** a token is exported to the catalog
- **THEN** it includes its platform-specific variable names and its raw value in a structured table or list

### Requirement: Semantic Grouping
The output MUST be organized into logical sections using Markdown headers to ensure AI models can easily parse and navigate the different parts of the design system.

#### Scenario: Structured Markdown output
- **WHEN** the catalog is generated
- **THEN** each token category is introduced by a level 2 header (e.g., `## Colors`) and contains a table of tokens

### Requirement: CLI Category Filtering
The CLI tool SHALL allow users to specify one or more token categories to export, facilitating targeted context injection for AI tasks.

#### Scenario: Exporting specific category
- **WHEN** the user runs the export tool with `--category spacing`
- **THEN** the output contains only the spacing token section

### Requirement: Synthesized Semantic Token Support
The CSS catalog SHALL include synthesized "core" semantic tokens that utilize the `light-dark()` function for any token that has both light and dark variants defined in its semantic path.

#### Scenario: Core semantic token inclusion in CSS catalog
- **WHEN** the CSS catalog is generated
- **AND** a semantic token has both `light` and `dark` variants (e.g., `light.primary` and `dark.primary`)
- **THEN** the catalog includes a row for the core token name (e.g., `--color-primary`)
- **AND** the value is represented using the `light-dark()` CSS function (e.g., `light-dark(var(--light-color-primary), var(--dark-color-primary))`)
- **AND** this synthesized token appears in the Color section alongside its variant tokens

### Requirement: Dedicated Semantic Section
The catalog SHALL include a dedicated "Semantic Tokens" section (or sub-section) when semantic tokens are present, to clearly distinguish them from base/global tokens.

#### Scenario: Semantic section visibility
- **WHEN** the catalog is generated and contains semantic tokens
- **THEN** it includes a section header "Semantic Tokens"
- **AND** all core semantic tokens (those using `light-dark()`) are listed within this section to provide explicit support for light/dark mode reference.
