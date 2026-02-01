## ADDED Requirements

### Requirement: Font Families
The system SHALL define font family tokens for brand usage (e.g., sans, serif, mono).

#### Scenario: Font family access
- **WHEN** accessing `font-family-base`
- **THEN** it returns the primary font stack string

### Requirement: Type Scale
The system SHALL define a typographic scale (e.g., size-100 to size-900) for consistent sizing.

#### Scenario: Heading sizes
- **WHEN** using `font-size-heading-1`
- **THEN** it returns the largest defined font size (e.g., 2.5rem)

### Requirement: Font Weights
The system SHALL define numerical font weights.

#### Scenario: Weight values
- **WHEN** accessing `font-weight-bold`
- **THEN** it returns 700 (or equivalent)
