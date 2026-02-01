## ADDED Requirements

### Requirement: Breakpoints System
The system SHALL provide a standardized set of viewport width breakpoints using `rem` units to enable consistent responsive behavior across products.

**Rationale for `rem` units**:
Using `rem` units for media queries allows the layout to adapt based on the user's browser font size settings, ensuring accessibility and consistency with fluid typography strategies. Unlike `px`, `rem` respects user preferences for base font size.

**Breakpoint Reference Table (assuming 16px base):**

| Breakpoint  | `rem` Value | `px` Equivalent |
|-------------|-------------|-----------------|
| Small       | < 37.5rem   | < 600px         |
| Medium      | ≥ 37.5rem   | ≥ 600px         |
| Large       | ≥ 60rem     | ≥ 960px         |
| Extra-large | ≥ 90rem     | ≥ 1440px        |

#### Scenario: Small viewport
- **WHEN** the viewport width is less than 37.5rem
- **THEN** the layout should adapt for small screens
- **THEN** the `small` breakpoint token should be active

#### Scenario: Medium viewport
- **WHEN** the viewport width is between 37.5rem and 59.99rem
- **THEN** the layout should adapt for medium screens
- **THEN** the `medium` breakpoint token should be active

#### Scenario: Large viewport
- **WHEN** the viewport width is between 60rem and 89.99rem
- **THEN** the layout should adapt for large screens
- **THEN** the `large` breakpoint token should be active

#### Scenario: Extra-large viewport
- **WHEN** the viewport width is 90rem or greater
- **THEN** the layout should adapt for extra-large screens
- **THEN** the `extra-large` breakpoint token should be active

### Requirement: Media Query Generation
The system SHALL generate appropriate media query strings for each breakpoint using `rem` units.

#### Scenario: Small media query
- **WHEN** consuming the `small` media query token
- **THEN** it should output a query targeting screens up to 37.49rem (e.g., `(max-width: 37.49rem)`)

#### Scenario: Medium media query
- **WHEN** consuming the `medium` media query token
- **THEN** it should output a query targeting screens from 37.5rem to 59.99rem

#### Scenario: Large media query
- **WHEN** consuming the `large` media query token
- **THEN** it should output a query targeting screens from 60rem to 89.99rem

#### Scenario: Extra-large media query
- **WHEN** consuming the `extra-large` media query token
- **THEN** it should output a query targeting screens 90rem and wider
