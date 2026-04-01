# Agent Instructions: @dezkareid/css

This package provides common CSS tools, resets, layout objects, and utilities for application pages across the dezkareid monorepo.

## Architecture: ITCSS

The package follows the **ITCSS** (Inverted Triangle CSS) methodology to manage specificity and order.

1. **settings/**: Global variables and feature flags (e.g., `_themes.scss`).
2. **tools/**: Mixins and functions (e.g., `_breakpoints.scss`).
3. **generic/**: Low-specificity resets (e.g., `_reset.scss`).
4. **elements/**: Base HTML element styling (e.g., `_base.scss`).
5. **objects/**: Class-based, non-cosmetic layout objects (e.g., `_container.scss`, `_stack.scss`).
6. **components/**: Specific UI components (mostly handled in `@dezkareid/components`).
7. **utilities/**: High-specificity utility classes (e.g., `_reveal.scss`, `_visibility.scss`).

## Usage

### Bundled CSS
Import the main bundle in your application entry point:
```css
@import "@dezkareid/css/dist/index.css";
```

### Modular SCSS
If using Sass, you can import specific modules for better control:
```scss
@use "@dezkareid/css/src/generic/reset";
@use "@dezkareid/css/src/objects/container";
```

## Key Features

### Automatic Theming
The package supports automatic light/dark theming using the `light-dark()` CSS function and design tokens.
- Manual overrides: Add `.light` or `.dark` classes to any parent element.

### Layout Objects (OOCSS)
- `.o-container`: Main page wrapper with max-width and centering.
- `.o-stack`: Vertical layout with standard spacing (`--spacing-16` by default).
- `.o-grid`: Responsive grid layout using CSS Grid.
- `.o-shell`: Basic page layout wrapper (`min-height: 100vh`).

### Utilities
- `.u-reveal`: Utility for scroll-reveal animations. Requires `.is-visible` to trigger.
- `.u-reveal-group`: Automatically staggers the reveal of its children.
- `.u-hidden`: `display: none !important`.
- `.u-visually-hidden`: Hide content from sighted users but keep it for screen readers.

## Conventions
- Use **BEM** naming for modifiers (e.g., `.o-container--narrow`).
- Always use **Design Tokens** via CSS custom properties (`var(--color-*)`).
- Prefix layout objects with `o-` and utilities with `u-`.
