# Agent Instructions: dezkareid monorepo

This file provides critical context and dependency information for AI agents working on the `dezkareid` monorepo.

## Overview

`dezkareid` is a pnpm + Turborepo monorepo containing production applications, a multi-framework design system, shared packages, and internal tooling. It is structured to share design tokens, components, and utilities across Astro, React, Vue, and Angular applications.

## Monorepo Structure

```
/dezkareid
├── apps/                          # Production applications
│   ├── main-website/              # Astro-based marketing website
│   └── collectstory/              # Collectstory application
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
│   ├── storybook-react/           # Storybook for React component development
│   └── auditor/                   # Web Quality Auditor (NestJS + Angular)
├── AGENTS.md                      # This file
├── Makefile                       # AI agent launchers (loads env vars)
├── turbo.json                     # Turbo workspace configuration
└── pnpm-workspace.yaml            # pnpm workspace configuration
```

## Tech Stack & Versions

### Core Runtimes & Package Manager
- **Node.js**: `>=22`
- **pnpm**: required package manager (do not use npm or yarn)
- **Turbo**: `2.8.0`

### Core Languages
- **TypeScript**: `5.9.3`

### Build & Bundling Tools
- **Rollup**: `4.56.0`
- **Webpack**: `5.104.1`
- **Vite**: `7.3.1` (via `@vitejs/plugin-react`)
- **@vitejs/plugin-react**: `5.1.4`
- **Style Dictionary**: `5.2.0` (for design tokens)

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

> Always use exact versions for dependencies. Do not use `^` or `~`.

## Project Structure & Conventions

- **Package Manager**: `pnpm` is the required package manager.
- **Monorepo Management**: Uses `turbo` for task orchestration and `pnpm workspaces`.
- **Naming Convention**: Packages are scoped under `@dezkareid/` (e.g., `@dezkareid/react-hooks`).

### Workspace Packages

#### Apps

##### `main-website` (`@dezkareid/main-website`) — `apps/main-website/`
Astro 6 marketing website.
- **Dependencies**: `@dezkareid/components`, `@dezkareid/design-tokens`
- **Scripts**: `dev` (astro dev), `build` (astro build), `preview`

##### `collectstory` (`@dezkareid/collectstory`) — `apps/collectstory/`
Collectstory application.
- **Scripts**: `dev` (astro dev), `build` (astro build), `preview`

#### Packages

##### `react-components` (`@dezkareid/react-components`) — `packages/react-components/`
Collection of reusable React components.
- **Build**: Rollup (ESM/CJS) + Webpack (UMD/browser)
- **Output**: `dist/cjs`, `dist/es`, `dist/browser`
- **Dependencies**: `@dezkareid/react-hooks`

##### `react-hooks` (`@dezkareid/react-hooks`) — `packages/react-hooks/`
Custom React hooks (e.g., `useLocalStorage`, `useEventListener`).
- **Build**: Rollup (ESM/CJS/types) + Webpack (UMD)
- **Output**: `dist/cjs`, `dist/es`, `dist/types`, `dist/browser`

##### `ai-context-sync` (`@dezkareid/ai-context-sync`) — `packages/ai-context-sync/`
CLI tool that syncs AI agent context files using `AGENTS.md` as source of truth.
- **CLI bin**: `ai-context-sync`
- **Providers**: Claude, Gemini, Gemini Markdown
- **Config**: `.ai-context-configrc` file
- **Build**: TypeScript (NodeNext)

##### `multi-format` (`@dezkareid/multi-format`) — `packages/multi-format/`
Multi-format output library.
- **Build**: Vite (ESM/CJS/UMD)

##### `module-federated-libs` (`@dezkareid/module-federated-libs`) — `packages/module-federated-libs/`
Sample exposed modules demonstrating Webpack Module Federation.

##### `cra-template-js-app` (`@dezkareid/cra-template-js-app`) — `packages/cra-template-js-app/`
Create React App JavaScript project template.

#### Configs

##### `eslint-config-js-base` (`@dezkareid/eslint-config-js-base`) — `configs/eslint-config-js-base/`
Shared ESLint config for JavaScript projects. Based on Airbnb base + Prettier (ESLint 8).

##### `eslint-config-ts-base` (`@dezkareid/eslint-config-ts-base`) — `configs/eslint-config-ts-base/`
Shared ESLint config for TypeScript projects. Uses ESLint 9 flat config format + typescript-eslint.
- **Export**: `./index.mjs`
- **Requires**: Node >= 22

#### Linters

##### `eslint-plugin-web` (`@dezkareid/eslint-plugin-web`) — `linters/eslint-plugin-web/`
Custom ESLint plugin with rules for web projects.

#### Design System

##### `design-tokens` (`@dezkareid/design-tokens`) — `design-system/design-tokens/`
Design tokens built with Style Dictionary. Source of truth for all visual values.
- **Token categories**: Colors (global + semantic light/dark), Spacing, Typography, Breakpoints
- **Output formats**:
  - CSS: `dist/css/variables.css` (CSS custom properties, light/dark theme support)
  - SCSS: `dist/scss/_variables.scss`
  - JS: `dist/js/tokens.js` (CJS/ESM hybrid), `dist/js/tokens.mjs`, `dist/js/tokens.d.ts`
- **CLI**: `color-catalog` command for token export

##### `components` (`@dezkareid/components`) — `design-system/components/`
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

#### UI Tools

##### `storybook-react` — `ui-tools/storybook-react/`
Storybook 10 instance for developing and documenting React components. **Private (not published).**
- **Dependencies**: `@dezkareid/components`, `@dezkareid/design-tokens`
- **Addons**: a11y, docs, vitest, Chromatic (visual regression)
- **Scripts**: `storybook` (port 6006), `build-storybook`

##### `auditor` (`@dezkareid/auditor`) — `ui-tools/auditor/`
Internal tool to systematically measure, monitor, and ensure high standards of performance and accessibility across the product portfolio. **Private (not published).**
- **Backend**: NestJS 11 + Prisma 7 + SQLite
- **Frontend**: Angular 21 (Standalone, Signals, OnPush) + Chart.js
- **Audit Engine**: Lighthouse 13 + Headless Chrome (Puppeteer)
- **Scripts**: `dev:server` (NestJS watch), `dev:client` (Angular serve), `build:server`, `build:client`
- **Turbo tasks**: `pnpm turbo run dev:server --filter=@dezkareid/auditor`, `pnpm turbo run dev:client --filter=@dezkareid/auditor`
- **Database**: SQLite at `ui-tools/auditor/dev.db`; initialize with `npx prisma migrate dev --name init` from `ui-tools/auditor/`

#### Deprecated / Legacy Packages

- **`website` (`@dezkareid/website`) — `packages/website/`**: Legacy package using outdated dependencies (React 17, Jest 27, ESLint 7). Do not use as a reference.

## Development

### Initial Setup

```bash
# Install all workspace dependencies from the monorepo root
pnpm install
```

### Environment Variables

The monorepo uses a `Makefile` to load environment variables before launching AI agents. Copy the example file and fill in your values:

```bash
cp env.local.example .env.local
```

`.env.local` is git-ignored. It is loaded automatically by `make` targets via `-include .env.local`. Required variables:

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLOUD_PROJECT` | GCP project ID used by Gemini |
| `STITCH_API_KEY` | API key for the Stitch MCP server (`stitch-collectstory`) |

### Starting AI Agents

Use the `Makefile` targets to launch AI agents with environment variables pre-loaded from `.env.local`. This ensures MCP servers that require API keys (e.g., `stitch-collectstory`) are properly configured.

```bash
# Launch Claude Code with env vars loaded
make claude

# Launch Gemini CLI with env vars loaded
make gemini

# Launch Claude Code in an isolated git worktree
make claude-worktree feature=<feature-name>

# Launch Gemini CLI in an isolated git worktree
make gemini-worktree feature=<feature-name>
```

The worktree targets pass `--worktree <feature-name>` to the agent, creating an isolated branch and working directory for the feature. Useful when working on a feature in parallel without affecting the main working tree.

> **Why `make` instead of running the CLI directly?** The `Makefile` uses `-include .env.local` + `export` to inject all local environment variables into the shell before starting the agent. Running `claude` or `gemini` directly will miss these vars and MCP servers that depend on them (e.g., `stitch-collectstory` which needs `STITCH_API_KEY`) will fail to authenticate.

### Always use Context7 MCP

Always use Context7 MCP when you need external library/API documentation, code generation, setup or configuration steps — without needing to be explicitly asked. Prefer it over web search for library docs.

### Internal Libraries

For internal libraries, every package has a `README.md` (usage reference) and an `AGENTS.md` (AI agent instructions). When making modifications to an internal library, always read that package's `AGENTS.md` first.

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

### Turbo Tasks

| Task | Behavior |
|------|----------|
| `build` | Depends on upstream `^build`, outputs to `dist/` |
| `dev` | Persistent, no cache |
| `test` | Inputs source files, no outputs |
| `lint` | Inputs source files, no outputs |
| `storybook` | Persistent, no cache |

> **Always run tasks from the monorepo root.** Never run `build`, `dev`, `test`, `lint`, or `storybook` directly inside a package directory. Doing so bypasses Turborepo and skips the `^build` dependency chain, causing failures when internal packages haven't been built yet.

```bash
# Build all packages (respects dependency order)
pnpm build

# Build a specific app/package
pnpm turbo run build --filter=@dezkareid/main-website

# Run dev for a specific app
pnpm turbo run dev --filter=@dezkareid/main-website

# Run tests for a specific package
pnpm turbo run test --filter=@dezkareid/react-hooks
```

### Adding a New Workspace Package

1. Create the package directory under the appropriate workspace (`apps/`, `packages/`, `design-system/`, etc.)
2. Add a `package.json` with the `@dezkareid/` scope
3. Add a `README.md` (usage docs) and an `AGENTS.md` (AI agent instructions)
4. Run `pnpm install` from the monorepo root to link the workspace

## Coding Standards & Style

### TypeScript
- Strict TypeScript is required. Do not use `any` unless unavoidable, and always add a comment explaining why.
- Use `NodeNext` module resolution for CLI/Node packages.
- All new packages must include type declarations (`*.d.ts`).

### ESLint & Prettier
- All packages use ESLint for linting. TypeScript projects use `@dezkareid/eslint-config-ts-base` (ESLint 9 flat config). JS projects use `@dezkareid/eslint-config-js-base` (ESLint 8).
- Prettier is used for formatting. Do not manually format — rely on the configured Prettier setup.
- Run lint from the monorepo root: `pnpm turbo run lint --filter=<package>`

### CSS Conventions (Design System & Components)
- BEM naming methodology for class names.
- OOCSS principles for reusable structure.
- CSS custom properties only — no hardcoded color, spacing, or typography values.
- Semantic design tokens for theming (light/dark support).

### Import Conventions
- Use workspace package names for internal imports (e.g., `import { useLocalStorage } from '@dezkareid/react-hooks'`).
- Do not use relative paths to cross package boundaries.

### Dependencies
- Always use exact versions. Do not use `^` or `~`.
- Do not add dependencies without checking if an existing package in the monorepo already provides the functionality.

## Testing Conventions

- **Test runner**: Vitest `4.0.18`
- **Component testing**: React Testing Library `16.3.2` with jsdom `27.4.0`
- **Run tests**: Always from the monorepo root via Turbo:
  ```bash
  pnpm turbo run test --filter=@dezkareid/<package>
  ```
- **File naming**: Test files use the `.test.ts` / `.test.tsx` suffix and are co-located with the source file they test.
- **Approach**: Unit tests for hooks and utilities. Integration tests for components (render + interaction). Do not mock internal workspace packages — import and use them directly.

## Debugging

### Turbo Pipeline Issues
- Use `--verbosity=2` for detailed Turbo output:
  ```bash
  pnpm turbo run build --filter=@dezkareid/main-website --verbosity=2
  ```
- Use `--dry-run` to preview what Turbo would execute without running it:
  ```bash
  pnpm turbo run build --dry-run
  ```
- If a task unexpectedly uses a cached result, clear the cache:
  ```bash
  pnpm turbo run build --force
  ```

### Common Pitfalls
- **Missing `dist/` from upstream packages**: If a downstream package fails to import an internal dep, the upstream package likely hasn't been built. Run `pnpm build` from the root first.
- **Workspace resolution errors**: After adding a new package, always run `pnpm install` from the monorepo root to update the lockfile and symlinks.
- **MCP server auth failures**: If an MCP server (e.g., `stitch-collectstory`) fails to authenticate, ensure you launched the agent via `make claude`, `make gemini`, `make claude-worktree`, or `make gemini-worktree` so `.env.local` is loaded. Running the CLI directly will not have the required environment variables.
- **`eslint-config-ts-base` Node version**: This config requires Node >= 22. Ensure your Node version meets this before running lint on TypeScript packages.

## Committing

Always use Conventional Commits format for commit messages.

If the files changed are from a project include the project in the scope. Example: `feat(main-website): [description]` or `feat(design-tokens): [description]`

Never commit directly to `main` or `master`. If the current branch is one of them, propose creating a new branch before committing.

## Documentation

The `README.md` file is the source for how to use the package. The `AGENTS.md` is the source for understanding the package for AI-assisted tools.

When you need to modify a package, always read that package's `AGENTS.md` first. When a package is created or significantly modified, update both `README.md` and `AGENTS.md` accordingly.
