# Agent Instructions: @dezkareid/design-tokens

## Project Context
This project contains design tokens (colors, typography, spacing, etc.) for the `dezkareid` design system.
It uses **Style Dictionary** to transform JSON token definitions into platform-specific outputs (CSS, SCSS, JS/TS).

## Setup & Build
- **Package Manager**: pnpm
- **Install**: `pnpm install`
- **Build**: `pnpm build` (runs `style-dictionary build --config sd.config.js`)
- **Release**: `pnpm release` (semantic-release only in CI/CD pipeline)

## Making Changes (OpenSpec Workflow)
This project uses the **OpenSpec (opsx)** workflow for all changes. Do not modify code directly without a tracking change artifact unless it's a trivial fix.

### Workflow Cycle
1.  **Start**: Create a new change container.
    - Command: `/opsx:new <change-name>` (or `/opsx:ff` to fast-forward)
    - Creates: `openspec/changes/<change-name>/`

2.  **Plan**: Create artifacts in order.
    - **Proposal**: Why and what (`proposal.md`)
    - **Specs**: Detailed requirements (`specs/<capability>/spec.md`)
    - **Design**: Technical approach (`design.md`)
    - **Tasks**: Implementation checklist (`tasks.md`)
    - Command: `/opsx:continue` (steps through creation)

3.  **Implement**: Apply the changes to the codebase.
    - Command: `/opsx:apply`
    - Follows the checklist in `tasks.md`.

4.  **Finish**: Archive the change.
    - Command: `/opsx:archive`
    - Moves artifacts to `openspec/changes/archive/`.

### Directory Structure
- `src/tokens/`: Source JSON token definitions (The Source of Truth).
    - `color/`: Global and semantic color tokens.
    - `spacing.json`: Spacing scale.
    - `typography.json`: Fonts, weights, sizes.
- `dist/`: Generated build artifacts (CSS, SCSS, JS). **Do not edit manually.**
- `openspec/`: Change management artifacts.

## Token Architecture
- **Global Tokens**: Raw values (e.g., `blue-500: #3b82f6`). Defined in `src/tokens/color/global.json`.
- **Semantic Tokens**: Aliases mapped to globals (e.g., `color-primary: {color.base.blue.500}`). Defined in `src/tokens/color/semantic.json`.
- **Theming**: Supported via `light` and `dark` nesting in semantic tokens.

## Build Configuration
- `sd.config.js`: Controls the build process.
- **Formats & Outputs**:
    - **CSS**: `dist/css/variables.css` (`css/variables-light-dark`) - CSS Custom Properties with `light-dark()` support.
        - *Patterns*:
            - `--color-base-{blue,green,red,gray}-{100,500,900}`
            - `--color-base-{white,black}`
            - `--spacing-{0,4,8,12,16,24,32,48,64}`
            - `--font-family-{base,mono}`
            - `--font-size-{100-900}`
            - `--font-weight-{light,regular,medium,bold}`
            - `--font-line-height-{none,tight,normal,relaxed}`
            - `--{light,dark}-color-{primary,success,background-primary,background-secondary,text-primary,text-inverse}`
            - `--color-{primary,success,background-primary,background-secondary,text-primary,text-inverse}`
        - *Example*:
            ```css
            :root {
              --color-base-blue-500: #3b82f6;
              --spacing-16: 1rem;
            }
            ```
    - **SCSS**: `dist/scss/_variables.scss` (`scss/simple`) - Simple SCSS variables.
        - *Patterns*:
            - `$color-base-{blue,green,red,gray}-{100,500,900}`
            - `$color-base-{white,black}`
            - `$color-semantic-{light,dark}-{primary,success,background-primary,background-secondary,text-primary,text-inverse}`
            - `$spacing-{0,4,8,12,16,24,32,48,64}`
            - `$font-family-{base,mono}`
            - `$font-size-{100-900}`
            - `$font-weight-{light,regular,medium,bold}`
            - `$font-line-height-{none,tight,normal,relaxed}`
        - *Example*:
            ```scss
            $color-base-blue-500: #3b82f6;
            $spacing-16: 1rem;
            ```
    - **JS**:
        - `dist/js/tokens.js` (`js/custom-module`) - CommonJS/ESM hybrid.
        - `dist/js/tokens.mjs` (`js/custom-module`) - ESM.
        - `dist/js/tokens.d.ts` (`typescript/custom-declarations`) - TypeScript declarations.
        - *Patterns*:
            - `ColorBase{Blue,Green,Red,Gray}Val{100,500,900}`
            - `ColorBase{White,Black}`
            - `{Light,Dark}Color{Primary,Success,BackgroundPrimary,BackgroundSecondary,TextPrimary,TextInverse}`
            - `SpacingVal{0,4,8,12,16,24,32,48,64}`
            - `FontFamily{Base,Mono}`
            - `FontSizeVal{100-900}`
            - `FontWeight{Light,Regular,Medium,Bold}`
            - `FontLineHeight{None,Tight,Normal,Relaxed}`
        - *Example*:
            ```javascript
            export const ColorBaseBlueVal500 = "#3b82f6";
            export const SpacingVal16 = "1rem";
            ```
