## ADDED Requirements

### Requirement: Multi-Category Organization
The visualizer SHALL organize design tokens into distinct categories: Colors, Spacing, Typography, and Breakpoints to facilitate navigation.

#### Scenario: Categorized display
- **WHEN** the visualizer is loaded
- **THEN** tokens are grouped and labeled by their functional category

### Requirement: Visual Representation for Colors
The visualizer SHALL display color tokens as swatches represented by squares with a black border and a fill of the respective token color.

#### Scenario: Color swatch display
- **WHEN** a color token is rendered
- **THEN** it is displayed as a square with a 1px solid black border and the token value as its background color

### Requirement: Semantic Theme Grouping for Colors
The visualizer SHALL group semantic color tokens in pairs to display their light and dark variants simultaneously, allowing direct inspection of both theme values.

#### Scenario: Simultaneous Light/Dark display
- **WHEN** semantic color tokens with light and dark variants are rendered
- **THEN** both variants are displayed as a horizontal pair with their respective colors and names.

### Requirement: Visual Representation for Spacing
The visualizer SHALL display spacing tokens by rendering a visual gap between elements that matches the token's value.

#### Scenario: Spacing scale display
- **WHEN** a spacing token is rendered
- **THEN** it is represented by a visual space (e.g., a colored block or margin) that reflects the token's value

### Requirement: Value Display for Breakpoints
The visualizer SHALL display the raw value for each breakpoint token.

#### Scenario: Breakpoint value display
- **WHEN** a breakpoint token is rendered
- **THEN** its value is displayed as text alongside its name

### Requirement: CSS Variable Name Visibility
The visualizer SHALL display the corresponding CSS variable name for every token item rendered.

#### Scenario: Metadata inclusion
- **WHEN** any token is displayed in the visualizer
- **THEN** its CSS variable name is shown as text within or near the visual representation

### Requirement: Clean Naming Mapping
The visualizer SHALL robustly map PascalCase JS export names to kebab-case CSS variables, stripping any internal `Val` prefixes (e.g., `ColorBaseBlue500` -> `--color-base-blue-500`).

#### Scenario: Stripping accidental prefixes
- **WHEN** a token name like `ColorBaseBlueVal500` is encountered
- **THEN** it is displayed as `ColorBaseBlue500` and its CSS variable is correctly identified as `--color-base-blue-500`

### Requirement: Static Visualization Only
The visualizer SHALL NOT include interactive theme toggles or adaptive (light-dark) swatches, ensuring a clear and stable static reference for all values.

#### Scenario: No dynamic theme toggling
- **WHEN** the visualizer is loaded
- **THEN** only static swatches for individual theme variants are shown without interactive toggles.
