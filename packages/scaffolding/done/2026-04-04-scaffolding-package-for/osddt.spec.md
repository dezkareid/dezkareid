# Specification: Project Scaffolding CLI

## Overview
A CLI tool designed to standardize and automate the creation of new software projects within the Dezkareid Enterprise ecosystem. By providing a unified way to bootstrap npm packages, CLI applications, and libraries, this tool ensures that all new software adheres to internal standards for configuration, quality, and documentation from day one. It is intended to be used via `npx` or `pnpm create` for immediate accessibility.

### Business Context
This feature aligns with several key strategic objectives and architecture principles:
- **Efficiency & Velocity**: By standardizing common business and design patterns, we increase the frequency of meaningful product updates and reduce "boilerplate" time.
- **Operational Excellence**: Standardizing project structures ensures that internal diagnostics and documentation are consistent across the portfolio.
- **Architecture Principle: Simplicity over Complexity**: The tool replaces manual, error-prone setup processes with a simple, maintainable command.
- **Architecture Principle: Documentation as a Primary Artifact**: Every scaffolded project will include high-quality, pre-configured documentation templates (README.md, AGENTS.md, etc.).

## Requirements
- The system must provide a CLI interface executable via `npx @dezkareid/scaffolding` or `pnpm create @dezkareid/scaffolding`.
- Users must be able to select from a list of project types (e.g., NPM Package, CLI Application, Library, Web App).
- The system must prompt the user for project-specific metadata (name, description, author).
- The system must generate a complete project structure, including:
    - Standardized `package.json` with recommended scripts and dependencies.
    - Pre-configured linting (ESLint) and formatting (Prettier) rules matching workspace standards.
    - A basic testing suite (Vitest/Jest) and configuration.
    - Initial documentation files (`README.md`, `AGENTS.md`).
    - Standardized TypeScript configuration (`tsconfig.json`) if applicable.
- The scaffolded project must be ready to run `pnpm install` and `pnpm build` immediately after creation.

## Scope
- **In-Scope**:
    - Interactive CLI for project initialization.
    - Templates for: Shared Libraries (TS/JS), CLI Tools, and NPM Packages.
    - Integration with internal ESLint and Prettier configs.
    - Automated Git initialization within the new project.
- **Out-of-Scope**:
    - Managing project deployments or hosting.
    - Support for non-JavaScript/TypeScript ecosystems (e.g., Rust, Python) in this initial version.
    - Automated creation of remote repositories (e.g., GitHub API integration).

## Acceptance Criteria
- Running the command successfully creates a new directory with the specified project name.
- The generated project contains all required configuration files without syntax errors.
- `pnpm install` in the generated project completes without dependency conflicts.
- `pnpm lint` and `pnpm test` in the generated project pass with the default boilerplate code.
- The project includes a `README.md` that correctly displays the project name and description provided during setup.

## Decisions
1. **Template Priority**: The initial release will prioritize General TypeScript/Node.js utilities and libraries.
2. **Monorepo Support**: The CLI will focus strictly on creating independent, standalone projects (no monorepo integration in v1).
3. **Internal Registry**: The tool will prompt the user for a custom scope or project name rather than hardcoding @dezkareid.
4. **License**: New projects will use the MIT license by default.
