# Agent Instructions: @dezkareid/design-tokens

## Project Context
This project contains design tokens (colors, typography, spacing, etc.) for the `dezkareid` design system.
It uses **Style Dictionary** to transform JSON token definitions into platform-specific outputs (CSS, SCSS, JS/TS).

## Setup & Build
- **Package Manager**: pnpm
- **Install**: `pnpm install`
- **Build**: `pnpm build` (runs `style-dictionary build --config sd.config.js`)
- **Release**: `pnpm release` (semantic-release only in CI/CD pipeline)

## Token Architecture
- **Global Tokens**: Raw values (e.g., `blue-500: #3b82f6`). Defined in `src/tokens/color/global.json`.
- **Semantic Tokens**: Aliases mapped to globals (e.g., `color-primary: {color.base.blue.500}`). Defined in `src/tokens/color/semantic.json`.
- **Theming**: Supported via `light` and `dark` nesting in semantic tokens.

## Build Configuration
- `sd.config.js`: Controls the build process.
- **Formats & Outputs**:
    - **CSS**: `dist/css/variables.css` (`css/variables-light-dark`) - CSS Custom Properties with `light-dark()` support.
        - *Patterns*:
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
        - *Example*:
            ```css
            :root {
              --color-base-blue-500: #3b82f6;
              --color-base-gray-400: #9ca3af;
              --color-text-secondary: light-dark(var(--light-color-text-secondary), var(--dark-color-text-secondary));
              --font-letter-spacing-tight: -0.02em;
              --border-radius-pill: 9999px;
              --shadow-card: 0 2px 8px rgba(0,0,0,0.08);
              --spacing-16: 1rem;
              --breakpoint-medium-min: 37.5rem;
            }
            ```
    - **SCSS**: `dist/scss/_variables.scss` (`scss/simple`) - Simple SCSS variables.
        - *Patterns*:
            - `$color-base-{blue,green,red,gray}-{100,400,500,600,900}`
            - `$color-base-{white,black}`
            - `$color-semantic-{light,dark}-{primary,success,danger,background-primary,background-secondary,text-primary,text-secondary,text-inverse}`
            - `$spacing-{0,4,8,12,16,24,32,48,64}`
            - `$font-family-{base,mono}`
            - `$font-size-{100-900}`
            - `$font-weight-{light,regular,medium,bold}`
            - `$font-line-height-{none,tight,normal,relaxed}`
            - `$font-letter-spacing-{tight,normal,wide}`
            - `$breakpoint-{small,medium,large,extra-large}-{min,max}`
            - `$border-radius-{none,small,medium,large,pill}`
            - `$shadow-{none,subtle,card,card-hover}`
        - *Example*:
            ```scss
            $color-base-blue-500: #3b82f6;
            $font-letter-spacing-tight: -0.02em;
            $border-radius-pill: 9999px;
            $shadow-card: 0 2px 8px rgba(0,0,0,0.08);
            $spacing-16: 1rem;
            $breakpoint-medium-min: 37.5rem;
            ```
    - **JS**:
        - `dist/js/tokens.js` (`js/custom-module`) - CommonJS/ESM hybrid.
        - `dist/js/tokens.mjs` (`js/custom-module`) - ESM.
        - `dist/js/tokens.d.ts` (`typescript/custom-declarations`) - TypeScript declarations.
        - *Patterns*:
            - `ColorBase{Blue,Green,Red,Gray}{100,400,500,600,900}`
            - `ColorBase{White,Black}`
            - `{Light,Dark}Color{Primary,Success,Danger,BackgroundPrimary,BackgroundSecondary,TextPrimary,TextSecondary,TextInverse}`
            - `Spacing{0,4,8,12,16,24,32,48,64}`
            - `FontFamily{Base,Mono}`
            - `FontSize{100-900}`
            - `FontWeight{Light,Regular,Medium,Bold}`
            - `FontLineHeight{None,Tight,Normal,Relaxed}`
            - `FontLetterSpacing{Tight,Normal,Wide}`
            - `Breakpoint{Small,Medium,Large,ExtraLarge}{Min,Max}`
            - `BorderRadius{None,Small,Medium,Large,Pill}`
            - `Shadow{None,Subtle,Card,CardHover}`
        - *Example*:
            ```javascript
            export const ColorBaseBlue500 = "#3b82f6";
            export const ColorBaseGray400 = "#9ca3af";
            export const FontLetterSpacingTight = "-0.02em";
            export const BorderRadiusPill = "9999px";
            export const ShadowCard = "0 2px 8px rgba(0,0,0,0.08)";
            export const Spacing16 = "1rem";
            export const BreakpointMediumMin = "37.5rem";
            ```
