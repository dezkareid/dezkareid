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
- **Formats**:
    - `css/variables-light-dark`: Generates CSS Custom Properties with `light-dark()` support.
    - `scss/simple`: SCSS variables.
    - `js/custom-module`: ESM/CJS exports.
