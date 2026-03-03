# Agent Instructions: dezkareid monorepo

This file provides critical context and dependency information for AI agents working on the `dezkareid` monorepo.

## Development

Always use Context7 MCP when I need external library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

For interal libraries every project has a `README.md` file that contains the documentation for the library.

### Commiting

Always use Conventional Commits format for commit messages.

If the files changed are from a project include the project in the scope. Example: `feat(main-website): [description]` or `feat(design-tokens): [description]`

Never commit directly to `main` or `master`. If the current branch is one of them, propose creating a new branch before committing.

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

## Documentation

The README.md file is the source to use the package. The AGENTS.md is the source to understand the package for ai-assisted tools.

When you need to modify a package always look the `AGENTS.md` file for that package to understand the package for ai-assisted tools.

When a package is created or modified, consider update those files with the new information.
