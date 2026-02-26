## ADDED Requirements

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
