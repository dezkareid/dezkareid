# Agent Instructions: dezkareid monorepo

This file provides critical context and dependency information for AI agents working on the `dezkareid` monorepo.

## Critical Dependency Versions

The following versions are established across the project's packages and should be respected when adding new dependencies or troubleshooting.

### Core Languages & Runtimes
- **TypeScript**: `5.9.3`

### Build & Bundling Tools
- **Rollup**: `4.56.0`
- **Webpack**: `5.104.1`
- **Vite**: `5.1.2` (via `@vitejs/plugin-react`)
- **Style Dictionary**: `5.2.0` (for design tokens)
- **Turbo**: (used in workspace, see `turbo.json`)

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

## Design System & Tokens
When selecting colors, breakpoints, or spacing, you MUST refer to the tokens defined in the `design-system/design-tokens` package. See `@/design-system/design-tokens/AGENTS.md` for detailed token architecture and usage patterns.

## Relevant Agent Files
- `@/packages/ai-context-sync/AGENTS.md`: Specific instructions for the AI context synchronization utility.
