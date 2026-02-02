## Why

We need to establish a standard set of breakpoints to ensure consistent responsive behavior across small, medium, large, and extra-large screen devices. Currently, there is no centralized definition, leading to inconsistent implementations across different products.

## What Changes

- Add a new set of design tokens for breakpoints.
- Define specific viewport width values for:
    - Small
    - Medium
    - Large
    - Extra-large

## Capabilities

### New Capabilities

- `breakpoints-system`: Defines the standard viewport breakpoints and associated media query logic for the design system.

### Modified Capabilities

- None

## Impact

- Adds a new token category `breakpoints`.
- Generates new output variables (CSS, SCSS, etc.) for breakpoints.
- Consumers will need to adopt these new tokens for responsive layouts.
