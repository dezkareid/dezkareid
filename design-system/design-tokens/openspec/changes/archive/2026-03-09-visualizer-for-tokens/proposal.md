## Why
Design tokens are currently defined in JSON and can be exported to a machine-readable Markdown catalog, but there is no interactive visual reference for developers and designers to see how these tokens actually look and behave. A visualizer will help ensure consistency and provide a quick way to verify theme mappings (light/dark) and visual scales.

## What Changes
- Create a web-based visualization dashboard for all design tokens.
- Organize tokens by categories: Colors, Spacing, Typography, and Breakpoints.
- **Clean Naming Mapping**: Implement robust mapping from PascalCase JS exports to kebab-case CSS variables, ensuring no accidental prefixes (like `Val`) appear in the middle of names or CSS properties.
- **Color Visualization**: Show swatches as squares with a border, filled with the token color.
- **Theme Grouping**: Group semantic colors in pairs to show light and dark variants together simultaneously for direct comparison.
- **Spacing Visualization**: Show the actual space between elements to represent the scale.
- **Breakpoint Visualization**: Display the raw value for each breakpoint.
- **Metadata**: Every item must display its corresponding CSS variable name and cleaned JS export name.
- **Non-Interactive**: The visualizer remains a static reference; no dynamic theme toggling or adaptive swatches are included to maintain simplicity.

## Capabilities

### New Capabilities
- `token-visualizer`: A web-based tool to visually browse and inspect design tokens across all systems (color, spacing, breakpoints, typography).

### Modified Capabilities
<!-- No requirement changes to existing specs. -->

## Impact
- New visualizer application/component in the codebase.
- Potential new build/dev scripts to serve the visualizer.
- No breaking changes to existing token JSON structures or export logic.
