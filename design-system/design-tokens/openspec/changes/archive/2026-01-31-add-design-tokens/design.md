## Context
We are establishing a design token system to centralize visual primitives. The current project is a blank canvas for these tokens. We need a build system that takes raw token definitions and outputs them in formats consumable by various platforms (Web, potentially others later).

## Goals / Non-Goals

**Goals:**
- Establish a scalable folder structure for token source files (JSON).
- Implement a build system using Style Dictionary.
- Generate outputs for CSS variables, SCSS variables, and JavaScript objects (both CommonJS and ES6).
- Support theming (light/dark) via token organization.

**Non-Goals:**
- UI Component library implementation (this is just the tokens).
- Mobile native outputs (Android/iOS) for this initial iteration (though the system should support it future-wise).

## Decisions

### Build System: Style Dictionary
We will use [Style Dictionary](https://amzn.github.io/style-dictionary/) as the build engine. It is the industry standard for transforming design tokens into platform-specific artifacts.

### Source of Truth
- Tokens will be defined in JSON files located in a `src/tokens/` directory.
- Structure will follow standard CTI (Category-Type-Item) or a compatible semantic hierarchy.

### Package Configuration
- The package will *not* be treated as an ES module by default (no `"type": "module"` in package.json).
- Dual exports will be handled via specific build configurations for CommonJS and ESM.

### Output Formats & Locations
Build artifacts will be generated into a `dist/` directory:
- **CSS**: `dist/css/variables.css` (Custom Properties)
- **SCSS**: `dist/scss/_variables.scss`
- **JS (CommonJS)**: `dist/js/tokens.js`
- **JS (ES6)**: `dist/js/tokens.mjs`

## Risks / Trade-offs
- **Risk**: Managing deep nesting in JSON can become verbose.
  - **Mitigation**: Split files by category (color.json, typography.json) to keep sources manageable.
- **Risk**: Naming collisions in flat outputs (like SCSS variables).
  - **Mitigation**: Strict naming transforms provided by Style Dictionary (e.g., kebab-case with prefixes).
