# Agent Instructions: @dezkareid/design-tokens

## Overview
This project serves as the single source of truth for the `dezkareid` design system's visual language. It manages design tokens (colors, typography, spacing, etc.) using **Style Dictionary** to transform JSON definitions into platform-specific outputs for CSS, SCSS, and JavaScript/TypeScript.

## Tech Stack & Versions
- **Node.js**: >= 22.x
- **Package Manager**: pnpm 10.x
- **Style Dictionary**: 5.2.0
- **Testing**: Vitest 4.0.18
- **Linting**: ESLint 9.39.2

## Project Structure
```text
design-system/design-tokens/
├── dist/                   # Build outputs (auto-generated)
│   ├── css/variables.css   # CSS Custom Properties with light-dark() support
│   ├── scss/_variables.scss# Simple SCSS variables
│   └── js/tokens.{js,mjs,d.ts} # JS/TS constants and declarations
├── scripts/                # Utility scripts
│   ├── export-catalog.js   # CLI to generate token documentation
│   └── contrast-check.js   # Accessibility validation script
├── src/
│   ├── tokens/             # Token source of truth (JSON)
│   │   ├── color/          # Global and semantic color definitions
│   │   ├── spacing/        # Layout and spacing scales
│   │   └── typography/     # Font scales and families
│   └── utils/              # Build transforms and naming logic
├── sd.config.js            # Style Dictionary configuration
└── package.json            # Project manifests and scripts
```

## Token Reference & Patterns
The build process generates tokens following these patterns. Use these as a reference for expected token names.

### CSS Patterns (`dist/css/variables.css`)
- `--color-base-{blue,green,red,gray}-{100,400,500,600,900}`
- `--color-base-{white,black}`
- `--spacing-{0,4,8,12,16,24,32,48,64}`
- `--font-family-{base,mono}`
- `--font-size-{100-900}`
- `--font-weight-{light,regular,medium,bold}`
- `--font-line-height-{none,tight,normal,relaxed}`
- `--font-letter-spacing-{tight,normal,wide}`
- `--breakpoint-{small,medium,large,extra-large}-{min,max}`
- `--border-radius-{none,small,medium,large,pill}`
- `--shadow-{none,subtle,card,card-hover}`
- `--{light,dark}-color-{primary,success,danger,background-primary,background-secondary,text-primary,text-secondary,text-inverse}`
- `--color-{primary,success,danger,background-primary,background-secondary,text-primary,text-secondary,text-inverse}`

**Example:**
```css
:root {
  --color-base-blue-500: #3b82f6;
  --color-text-secondary: light-dark(var(--light-color-text-secondary), var(--dark-color-text-secondary));
  --border-radius-pill: 9999px;
  --spacing-16: 1rem;
}
```

### SCSS Patterns (`dist/scss/_variables.scss`)
- `$color-base-{blue,green,red,gray}-{100,400,500,600,900}`
- `$color-base-{white,black}`
- `$color-semantic-{light,dark}-{primary,success,danger,background-primary,background-secondary,text-primary,text-secondary,text-inverse}`
- `$spacing-{0,4,8,12,16,24,32,48,64}`
- `$font-family-{base,mono}`
- `$font-size-{100-900}`
- `$font-weight-{light,regular,medium,bold}`
- `$breakpoint-{small,medium,large,extra-large}-{min,max}`
- `$border-radius-{none,small,medium,large,pill}`
- `$shadow-{none,subtle,card,card-hover}`

**Example:**
```scss
$color-base-blue-500: #3b82f6;
$border-radius-pill: 9999px;
$spacing-16: 1rem;
```

### JS Patterns (`dist/js/tokens.{js,mjs,d.ts}`)
- `ColorBase{Blue,Green,Red,Gray}{100,400,500,600,900}`
- `ColorBase{White,Black}`
- `{Light,Dark}Color{Primary,Success,Danger,BackgroundPrimary,BackgroundSecondary,TextPrimary,TextSecondary,TextInverse}`
- `Spacing{0,4,8,12,16,24,32,48,64}`
- `FontFamily{Base,Mono}`
- `FontSize{100-900}`
- `FontWeight{Light,Regular,Medium,Bold}`
- `Breakpoint{Small,Medium,Large,ExtraLarge}{Min,Max}`
- `BorderRadius{None,Small,Medium,Large,Pill}`
- `Shadow{None,Subtle,Card,CardHover}`

**Example:**
```javascript
export const ColorBaseBlue500 = "#3b82f6";
export const BorderRadiusPill = "9999px";
export const Spacing16 = "1rem";
```

## Development Workflow
- **Build Tokens**: `pnpm build` - Transforms JSON tokens into all platform formats.
- **Generate Catalog**: `pnpm tokens:catalog` - Generates a markdown reference of all tokens.
- **Visualizer**: `pnpm visualizer` - Opens a local interactive dashboard to explore tokens.
- **Linting**: `pnpm lint` / `pnpm lint:fix` - Ensures token definitions follow naming conventions.

## Testing Conventions
- **Unit Testing**: `pnpm test` - Uses Vitest to verify token transformation logic and naming utilities.
- **Accessibility**: `pnpm contrast-check` - Validates color combinations against WCAG 2.1 contrast requirements.
- **Validation**: The build process checks for dangling aliases or invalid references in JSON files.

## Coding Standards & Style

### Component Architecture
Tokens follow a multi-tier architecture to ensure maintainability:
1.  **Global Tokens (Tier 1)**: Raw values (e.g., `#3b82f6`). Defined in `src/tokens/color/global.json`.
2.  **Semantic Tokens (Tier 2)**: Design intent aliases (e.g., `color-primary`). Defined in `src/tokens/color/semantic.json`.
3.  **Theme Tokens (Tier 3)**: Nesting `light` and `dark` values within semantic tokens to support system-level theming.

### Design Tokens & Theme
- **Implementation**: Managed via `sd.config.js`.
- **Theming**: Uses the modern `light-dark()` CSS function in `dist/css/variables.css` for seamless theme switching.
- **Naming**: Controlled by `src/utils/token-naming.js`. Reference this file when adding new token categories.

### Visual & Unit Testing
- New transformation logic in `sd.config.js` or `src/utils/` MUST have a corresponding Vitest spec.
- All new color pairs MUST be validated with the `contrast-check` script.

### Documentation & Storybook
- **Internal**: Use `pnpm tokens:catalog` for a quick CLI/Markdown reference.
- **External**: Tokens are consumed by `ui-tools/storybook-react` for component documentation.
- **Interactive**: Use the local `visualizer` for a graphical overview.

### Skills
The following skills/agents are essential for this project:
- `accessibility` / `web-quality:accessibility`: For validating color contrast and typography readability.

### MCP Servers
- `context7` : When you need documentation for Style Dictionary, Vitest, or any other external library — do not rely on training data alone.
## Debugging
- **Build Errors**: Check the console output during `pnpm build`. Style Dictionary provides detailed error messages for circular references or missing values.
- **Output Inspection**: If a token isn't appearing as expected, inspect the relevant file in `dist/`.
- **Naming Issues**: If JS exports or CSS variables have unexpected names, verify the logic in `src/utils/token-naming.js`.
- **Cache**: If changes don't reflect, delete the `dist/` folder and rebuild.
