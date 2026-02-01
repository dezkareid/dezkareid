## ADDED Requirements

### Requirement: Global Color Palette
The system SHALL provide a primitive global color palette (e.g., blue-500, red-600) for base values.

#### Scenario: Palette availability
- **WHEN** a consumer imports the tokens
- **THEN** they can access raw color values like `blue-500`

### Requirement: Semantic Colors
The system SHALL provide semantic color aliases (e.g., `primary`, `success`, `background`) mapped to global colors.

#### Scenario: Semantic mapping
- **WHEN** using `color-primary`
- **THEN** it resolves to the defined brand color

### Requirement: Theming Support
The system SHALL support multiple themes (light, dark) where semantic tokens resolve to different values.

#### Scenario: Theme switching
- **WHEN** switching from light to dark theme
- **THEN** `color-background` changes from light to dark value
