# @dezkareid/css

Foundational CSS library for the dezkareid monorepo, providing common tools, resets, and layout primitives using the **ITCSS** architecture.

## Features

- **ITCSS Architecture**: Organized layers (Settings, Tools, Generic, Elements, Objects, Components, Utilities) for manageable CSS at scale.
- **Modern Reset**: A global reset (Generic layer) to ensure cross-browser consistency.
- **Responsive Tools**: SASS mixins for managing breakpoints (`media-up`).
- **Layout Objects**: Reusable layout patterns like `max-page-size`.

## Installation

```bash
pnpm add @dezkareid/css
```

## Usage

### Using the Full Bundle (CSS)

Import the compiled CSS in your application entry point:

```javascript
import '@dezkareid/css/dist/index.css';
```

### Using SASS Source

If you want to use the mixins or specific layers in your SASS project:

```scss
@use "@dezkareid/css/src/tools/breakpoints" as tools;

.my-element {
  @include tools.media-up('md') {
    padding: 2rem;
  }
}
```

## Layout Objects

### `.max-page-size`

A utility class to constrain the maximum width of a page container and center it.

```html
<div class="max-page-size">
  <!-- Content goes here -->
</div>
```

## ITCSS Structure

The source files are located in `src/`:

1.  **Settings**: Global variables (future tokens).
2.  **Tools**: SASS mixins and functions (e.g., breakpoints).
3.  **Generic**: Reset and global styles.
4.  **Elements**: Unclassed HTML element styles.
5.  **Objects**: Class-based, non-cosmetic layout primitives.
6.  **Components**: Specific UI components (mostly empty, use `@dezkareid/components` for these).
7.  **Utilities**: High-specificity, single-purpose helper classes.
