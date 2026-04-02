# @dezkareid/css

Foundational CSS library for the dezkareid monorepo, providing common tools, resets, and layout primitives using the **ITCSS** architecture.

## Features

- **ITCSS Architecture**: Organized layers (Tools, Settings, Generic, Elements, Objects, Components, Utilities) for manageable CSS at scale.
- **Flat Distribution**: Each ITCSS layer is available as a standalone minified CSS file or as part of a single bundle.
- **Modern Reset**: A global reset (Generic layer) to ensure cross-browser consistency.
- **Responsive Tools**: SASS mixins for managing breakpoints (`media-up`).
- **Layout Objects**: Reusable layout patterns like `.o-container` and `.o-stack`.

## Installation

```bash
pnpm add @dezkareid/css
```

## Usage

### Using the Full Bundle (CSS)

Import the compiled CSS in your application entry point:

```javascript
import '@dezkareid/css/dist/main.css';
```

### Using Individual Layers

```javascript
import '@dezkareid/css/dist/generic.css';
import '@dezkareid/css/dist/objects.css';
```

### Using SASS Source

Import the folders directly (Sass will automatically use the `index.scss` within them):

```scss
@use "@dezkareid/css/src/tools";

.my-element {
  @include tools.media-up('md') {
    padding: 2rem;
  }
}
```

## Layout Objects

### `.o-container` (formerly `.max-page-size`)

A layout object to constrain the maximum width of a container and center it.

```html
<div class="o-container">
  <!-- Content goes here -->
</div>
```

## ITCSS Structure

The source files are located in `src/`, following the Inverted Triangle CSS architecture:

1.  **Tools**: SASS mixins and functions (e.g., breakpoints).
2.  **Settings**: Global variables and theming.
3.  **Generic**: Reset and global styles.
4.  **Elements**: Unclassed HTML element styles.
5.  **Objects**: Class-based, non-cosmetic layout primitives.
6.  **Components**: Specific UI components (mostly handled in `@dezkareid/components`).
7.  **Utilities**: High-specificity, single-purpose helper classes.
