# @dezkareid/design-tokens

Design tokens for the dezkareid design system.

## Installation

```bash
pnpm add @dezkareid/design-tokens
```

## Usage

This package provides design tokens in multiple formats located in the `dist` folder.

### CSS

Import the CSS variables into your stylesheet:

```css
@import "@dezkareid/design-tokens/dist/css/variables.css";

.my-button {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  padding: var(--spacing-16);
}
```

### SCSS

Import the SCSS variables into your Sass files:

```scss
@import "@dezkareid/design-tokens/dist/scss/variables";

.my-button {
  background-color: $color-base-blue-500;
  padding: $spacing-16;
}
```

### JavaScript / TypeScript

Import tokens as constants:

```javascript
import { LightColorPrimary, SpacingVal16 } from '@dezkareid/design-tokens';

const styles = {
  backgroundColor: LightColorPrimary,
  padding: SpacingVal16
};
```

## Breakpoints

The design system provides breakpoint tokens for responsive design.

### CSS

```css
@media (min-width: var(--breakpoint-medium-min)) {
  .my-container {
    width: 100%;
  }
}
```

### SCSS

```scss
@media (min-width: $breakpoint-medium-min) {
  .my-container {
    width: 100%;
  }
}
```

### JavaScript / TypeScript

```javascript
import { BreakpointMediumMin } from '@dezkareid/design-tokens';

if (window.matchMedia(`(min-width: ${BreakpointMediumMin})`).matches) {
  // logic for medium screens and up
}
```
