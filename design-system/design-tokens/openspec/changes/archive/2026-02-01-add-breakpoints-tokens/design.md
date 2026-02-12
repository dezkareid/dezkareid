## Context

The design system needs to support responsive web applications by providing a standard set of breakpoints. Currently, there are no tokenized values for viewport widths, leading to hardcoded values and inconsistency across consuming applications. This design outlines the implementation of a new `breakpoints` token category using `rem` units as defined in the specifications.

## Goals / Non-Goals

**Goals:**
- Implement a new token category `breakpoints` in `src/tokens/breakpoints.json`.
- Configure Style Dictionary to output `rem`-based media queries for CSS, SCSS, and LESS.
- Ensure the output format is compatible with existing consumption patterns.

**Non-Goals:**
- Creating a grid system implementation (layout logic is separate from token definitions).
- Modifying existing typography or spacing tokens to be responsive (future scope).

## Decisions

### 1. Token Structure
We will introduce a new top-level file `src/tokens/breakpoints.json`.
The structure will follow the pattern:
```json
{
  "breakpoint": {
    "small": { "value": "..." },
    "medium": { "value": "..." },
    ...
  }
}
```
**Rationale**: Keeps breakpoints isolated and easily discoverable. Consistent with other token files like `spacing.json` and `color/*.json`.

### 2. Output Format for Media Queries
We will avoid `custom-media` syntax due to limited support and instead provide raw values that can be used to construct queries.
To facilitate range queries, we will introduce explicit `-min` and `-max` tokens where applicable.

**Strategy**:
- `small`: 
  - `min`: 0
  - `max`: 37.49rem (derived from medium start - 0.01)
- `medium`:
  - `min`: 37.5rem
  - `max`: 59.99rem
- `large`:
  - `min`: 60rem
  - `max`: 89.99rem
- `extra-large`:
  - `min`: 90rem
  - `max`: undefined (or extremely large if forced)

**Rationale**: Explicit min/max tokens give consumers full control to build `min-width`, `max-width`, or range media queries in any language (CSS, SCSS, JS) without relying on unstable syntax.

## Risks / Trade-offs

- **Risk**: Consumers using `px` values manually might have slightly different breakpoint behavior than these `rem` tokens if the user's base font size is not 16px.
  - **Mitigation**: Documentation must explicitly state that `rem` bases are dynamic and better for accessibility.
- **Risk**: `custom-media` syntax might not be supported in all CSS environments without PostCSS.
  - **Mitigation**: Ensure we also output raw values so consumers can construct their own queries if needed.
