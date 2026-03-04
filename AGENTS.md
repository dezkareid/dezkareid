# Agent Instructions: dezkareid monorepo

This file provides critical context and dependency information for AI agents working on the `dezkareid` monorepo.

## Monorepo Structure

The monorepo is managed by `pnpm` and `turbo` across 6 workspace directories:

```
/dezkareid
├── apps/                          # Production applications
│   └── main-website/              # Astro-based marketing website
├── packages/                      # Shared libraries and utilities
│   ├── react-components/          # Reusable React component library
│   ├── react-hooks/               # Custom React hooks
│   ├── ai-context-sync/           # CLI to sync AI agent context files
│   ├── multi-format/              # Multi-format library
│   ├── website/                   # Legacy website package (outdated)
│   ├── cra-template-js-app/       # CRA JavaScript template
│   └── module-federated-libs/     # Module Federation sample modules
├── configs/                       # Shared ESLint configurations
│   ├── eslint-config-js-base/     # ESLint config for JS projects
│   └── eslint-config-ts-base/     # ESLint config for TS projects (ESLint 9)
├── linters/                       # Custom ESLint plugins
│   └── eslint-plugin-web/         # Custom ESLint rules for web projects
├── design-system/                 # Design tokens and UI components
│   ├── design-tokens/             # Style Dictionary tokens (colors, spacing, etc.)
│   └── components/                # Multi-framework UI component library
├── ui-tools/                      # Development tools
│   └── storybook-react/           # Storybook for React component development
├── AGENTS.md                      # This file
├── turbo.json                     # Turbo workspace configuration
└── pnpm-workspace.yaml            # pnpm workspace configuration
```

## Workspace Packages

### Apps

#### `main-website` (`@dezkareid/main-website`) — `apps/main-website/`
Astro 5 marketing website.
- **Dependencies**: `@dezkareid/components`, `@dezkareid/design-tokens`
- **Scripts**: `dev` (astro dev), `build` (astro build), `preview`

### Packages

#### `react-components` (`@dezkareid/react-components`) — `packages/react-components/`
Collection of reusable React components.
- **Build**: Rollup (ESM/CJS) + Webpack (UMD/browser)
- **Output**: `dist/cjs`, `dist/es`, `dist/browser`
- **Dependencies**: `@dezkareid/react-hooks`

#### `react-hooks` (`@dezkareid/react-hooks`) — `packages/react-hooks/`
Custom React hooks (e.g., `useLocalStorage`, `useEventListener`).
- **Build**: Rollup (ESM/CJS/types) + Webpack (UMD)
- **Output**: `dist/cjs`, `dist/es`, `dist/types`, `dist/browser`

#### `ai-context-sync` (`@dezkareid/ai-context-sync`) — `packages/ai-context-sync/`
CLI tool that syncs AI agent context files using `AGENTS.md` as source of truth.
- **CLI bin**: `ai-context-sync`
- **Providers**: Claude, Gemini, Gemini Markdown
- **Config**: `.ai-context-configrc` file
- **Build**: TypeScript (NodeNext)

#### `multi-format` (`@dezkareid/multi-format`) — `packages/multi-format/`
Multi-format output library.
- **Build**: Vite (ESM/CJS/UMD)

#### `module-federated-libs` (`@dezkareid/module-federated-libs`) — `packages/module-federated-libs/`
Sample exposed modules demonstrating Webpack Module Federation.

#### `website` (`@dezkareid/website`) — `packages/website/`
**Legacy package** — uses outdated dependencies (React 17, Jest 27, ESLint 7). Do not use as reference.

#### `cra-template-js-app` (`@dezkareid/cra-template-js-app`) — `packages/cra-template-js-app/`
Create React App JavaScript project template.

### Configs

#### `eslint-config-js-base` (`@dezkareid/eslint-config-js-base`) — `configs/eslint-config-js-base/`
Shared ESLint config for JavaScript projects. Based on Airbnb base + Prettier (ESLint 8).

#### `eslint-config-ts-base` (`@dezkareid/eslint-config-ts-base`) — `configs/eslint-config-ts-base/`
Shared ESLint config for TypeScript projects. Uses ESLint 9 flat config format + typescript-eslint.
- **Export**: `./index.mjs`
- **Requires**: Node >= 22

### Linters

#### `eslint-plugin-web` (`@dezkareid/eslint-plugin-web`) — `linters/eslint-plugin-web/`
Custom ESLint plugin with rules for web projects.

### Design System

#### `design-tokens` (`@dezkareid/design-tokens`) — `design-system/design-tokens/`
Design tokens built with Style Dictionary. Source of truth for all visual values.
- **Token categories**: Colors (global + semantic light/dark), Spacing, Typography, Breakpoints
- **Output formats**:
  - CSS: `dist/css/variables.css` (CSS custom properties, light/dark theme support)
  - SCSS: `dist/scss/_variables.scss`
  - JS: `dist/js/tokens.js` (CJS/ESM hybrid), `dist/js/tokens.mjs`, `dist/js/tokens.d.ts`
- **CLI**: `color-catalog` command for token export

#### `components` (`@dezkareid/components`) — `design-system/components/`
Multi-framework UI component library (React, Astro, Vue).
- **Components**: Button, Tag, Card, ThemeToggle
- **Exports**:
  - `@dezkareid/components/react` → `dist/react.js` + `.d.ts`
  - `@dezkareid/components/astro` → `src/astro/index.ts` (compiled by Astro consumer)
  - `@dezkareid/components/vue` → `src/vue/index.ts` (compiled by Vite consumer)
  - `@dezkareid/components/css` → `dist/components.min.css`
- **Build**: Rollup (for CSS Modules extraction)
- **CSS conventions**: BEM naming, OOCSS, CSS custom properties only, semantic tokens for theming
- **Dependencies**: `@dezkareid/design-tokens`

### UI Tools

#### `storybook-react` — `ui-tools/storybook-react/`
Storybook 10 instance for developing and documenting React components. **Private (not published).**
- **Dependencies**: `@dezkareid/components`, `@dezkareid/design-tokens`
- **Addons**: a11y, docs, vitest, Chromatic (visual regression)
- **Scripts**: `storybook` (port 6006), `build-storybook`

## Development

Always use Context7 MCP when I need external library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

For internal libraries every project has a `README.md` file that contains the documentation for the library.

### Building Web UI

When building or modifying any UI (components, pages, apps):

1. **Use the `frontend-design` skill** — invoke it for any web UI task. It produces distinctive, production-grade interfaces and avoids generic AI aesthetics.

2. **Use design tokens** — never hardcode colors, spacing, or typography. Always reference `@dezkareid/design-tokens`:
   - In CSS/SCSS: import `@dezkareid/components/css` or `dist/css/variables.css` and use CSS custom properties (e.g., `var(--color-primary)`)
   - In JS/TS: import from `@dezkareid/design-tokens`
   - Use the `design-tokens` skill for authoritative token reference (colors, spacing, breakpoints)

3. **Use existing components** — before writing new UI, check `@dezkareid/components` for available primitives: Button, Tag, Card, ThemeToggle. Import by framework:
   - React: `import { Button } from '@dezkareid/components/react'`
   - Astro: `import { Button } from '@dezkareid/components/astro'`
   - Vue: `import { Button } from '@dezkareid/components/vue'`
   - CSS: `import '@dezkareid/components/css'`

4. **Preview components in Storybook** — run `pnpm storybook` from the root to open the component explorer at `http://localhost:6006`.

5. **Design system gaps** — if the desired design cannot be achieved with existing tokens or components, do not hardcode values or create one-off solutions. Instead, add a `TODO` annotation in the code at the point of use:
   ```
   // TODO(design-system): needs token for <description> (e.g. "card shadow elevation 2")
   // TODO(design-system): needs component <name> (e.g. "Tooltip")
   ```
   This flags the gap so it can be considered for promotion to `design-system/design-tokens` or `design-system/components`.

### Turbo Tasks

| Task | Behavior |
|------|----------|
| `build` | Depends on upstream `^build`, outputs to `dist/` |
| `dev` | Persistent, no cache |
| `test` | Inputs source files, no outputs |
| `lint` | Inputs source files, no outputs |
| `storybook` | Persistent, no cache |

### Committing

Always use Conventional Commits format for commit messages.

If the files changed are from a project include the project in the scope. Example: `feat(main-website): [description]` or `feat(design-tokens): [description]`

Never commit directly to `main` or `master`. If the current branch is one of them, propose creating a new branch before committing.

## Critical Dependency Versions

The following versions are established across the project's packages and should be respected when adding new dependencies or troubleshooting.

Always prefer use exact versions for dependencies. Do not use `^` or `~`.

### Core Languages & Runtimes
- **TypeScript**: `5.9.3`

### Build & Bundling Tools
- **Rollup**: `4.56.0`
- **Webpack**: `5.104.1`
- **Vite**: `7.3.1` (via `@vitejs/plugin-react`)
- **@vitejs/plugin-react**: `5.1.4`
- **Style Dictionary**: `5.2.0` (for design tokens)
- **Turbo**: `2.8.0`

### Testing Frameworks
- **Vitest**: `4.0.18`
- **React Testing Library**: `16.3.2`
- **jsdom**: `27.4.0`

### Linting & Formatting
- **ESLint**: `9.39.2`
- **Prettier**: `3.8.1`

### Type Definitions
- **@types/node**: `25.0.10`
- **@types/react**: `19.2.9`
- **@types/fs-extra**: `11.0.4`
- **@types/jest**: `30.0.0`

### Key Libraries
- **React**: `19.2.4` (Peer dependency: `^18.0.0 || ^19.0.0`)
- **React DOM**: `19.2.4`
- **Commander**: `12.0.0` (for CLI tools)
- **fs-extra**: `11.2.0`
- **globby**: `14.0.1`

## Project Structure & Conventions
- **Package Manager**: `pnpm` is the required package manager.
- **Monorepo Management**: Uses `turbo` for task orchestration and `pnpm workspaces`.
- **Naming Convention**: Packages are scoped under `@dezkareid/` (e.g., `@dezkareid/react-hooks`).

## Documentation

The README.md file is the source to use the package. The AGENTS.md is the source to understand the package for ai-assisted tools.

When you need to modify a package always look the `AGENTS.md` file for that package to understand the package for ai-assisted tools.

When a package is created or modified, consider updating those files with the new information.
