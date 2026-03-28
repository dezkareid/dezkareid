# Specification: CSS Commons Package

## Overview
The `@dezkareid/css` package is a foundational library within the dezkareid monorepo designed to distribute common CSS tools, utilities, and architectural patterns. It serves as the bridge between raw design tokens and high-level UI components, providing a standardized set of CSS rules and behaviors that can be shared across applications (like `main-website` and `collectstory`) and internal packages.

## Requirements
- **ITCSS Methodology**: Organize all CSS/SASS files following the Inverted Triangle CSS architecture (Settings, Tools, Generic, Elements, Objects, Components, Utilities) to manage specificity and scalability.
- **CSS Reset**: A global reset (Generic layer) to ensure visual consistency across all browsers and environments.
- **Utility Classes**: A comprehensive set of functional CSS classes (Utilities layer) for spacing, typography, visibility, and layout (following design tokens).
- **Layout Primitives**: Reusable layout patterns (Objects layer, e.g., stack, cluster, grid) available as CSS classes for rapid UI construction.
- **Shared Tools & Mixins**: Standardized SASS mixins and functions (Tools layer) that can be applied to both application-level layouts and granular component styles.
- **Component & Application Support**: Classes and patterns must be designed to work seamlessly within both standalone applications (including page-level layouts like `max-page-size`) and encapsulated UI components.
- **Design Token Integration**: Every utility and layout primitive must be driven by `@dezkareid/design-tokens` (Settings layer) to ensure theme compliance.

## Scope
### In-Scope
- ITCSS architecture implementation.
- SASS source files for mixins and tools.
- Modern, accessible CSS Reset.
- Typography, Spacing, and Visibility utilities.
- Layout primitives (Stack, Center, Cluster, Switcher, Grid).
- Page-level layout containers (e.g., `max-page-size`).

### Out-of-Scope
- JavaScript-based styling (CSS-in-JS).
- Highly specific component-level styles that don't have general utility.
- Assets like fonts or icons.

## Acceptance Criteria
- [ ] The package follows the ITCSS structure in its source directory.
- [ ] SASS mixins are available for consumers who use SASS.
- [ ] Compiled CSS files are provided for each ITCSS layer and as a complete bundle.
- [ ] A central `index.css` (or `index.scss`) is available to import all tools at once.
- [ ] All spacing and color values are derived from `@dezkareid/design-tokens`.
- [ ] Documentation (README) cataloging available layers, utilities, and mixins.

## Session Context
- The package is located in `design-system/css`.
- The user explicitly requested **ITCSS** as the methodology.
- Support for both SASS source and compiled CSS is required.

## Decisions
1. **Mixins Strategy**: Focus on SASS to build CSS tools, while ensuring support for Vanilla CSS and PostCSS.
2. **Distribution Format**: Provide both source CSS/SASS and minified/compiled files.
3. **Application vs Component specificity**: There are page-specific layouts, such as `max-page-size`, distinct from component-level tools.
