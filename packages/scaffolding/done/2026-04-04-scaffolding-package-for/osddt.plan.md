# Implementation Plan: Project Scaffolding CLI

## Architecture Overview
The CLI will be built as a standalone Node.js application using TypeScript. It will follow a modular architecture to allow for easy template expansion.

- **CLI Layer**: Built with `commander`. Handles argument parsing and command execution.
- **Interaction Layer**: Built with `prompts`. Provides an interactive experience for users to provide metadata if not passed via arguments.
- **Template Engine**: A directory-based template system. Templates are stored as static files with placeholders (e.g., `{{name}}`) that are replaced during the scaffolding process.
- **FileSystem Layer**: Built with `fs-extra`. Manages directory creation, file copying, and placeholder replacement.
- **Build System**: `tsup` for fast, zero-config bundling of the CLI itself into a single executable entry point.
- **Testing**: `vitest` for unit and integration testing.

## Implementation Phases

### Phase 1: Project Foundation
- Initialize the package with `tsup`, `vitest`, and TypeScript.
- Set up the basic CLI structure using `commander`.
- Define the `create` command with arguments for `name` and `description`.

### Phase 2: Template System
- Implement the template discovery and copying logic using `fs-extra`.
- Create the "TS/JS Library" template with standard Dezkareid Enterprise configurations:
    - `package.json` with `publishConfig` (public by default).
    - `tsconfig.json`.
    - ESLint and Prettier configurations.
    - Vitest setup.
    - Initial docs: `README.md`, `AGENTS.md`.
- Implement simple placeholder replacement for project name, description, and author.

### Phase 3: Interactivity & UX
- Integrate `prompts` to ask for missing information if arguments are not provided.
- Add progress indicators and informative logging for a better user experience.
- Implement automated `git init` in the scaffolded project directory (only if it is not already a git repository).

### Phase 4: Validation & Distribution
- Write unit tests for template generation and placeholder replacement.
- Perform end-to-end tests by scaffolding a dummy project and running `pnpm install`, `build`, and `test`.
- Configure `package.json` for distribution via `npx` (setting `bin` and `files`).

## Technical Dependencies
- `commander`: Command-line interface builder.
- `prompts`: Interactive CLI prompts.
- `fs-extra`: Enhanced file system methods.
- `tsup`: TypeScript bundler.
- `vitest`: Testing framework.
- `chalk` or `picocolors`: For terminal styling.
- `execa`: To run `git init` and other shell commands.

## Risks & Mitigations
- **Template Maintenance**: Hardcoded templates can get outdated.
    - *Mitigation*: Design the template system to be easily updatable and separate from the core logic.
- **Placeholder Collision**: Placeholders might collide with actual code.
    - *Mitigation*: Use a unique, recognizable syntax for placeholders (e.g., `{{__DEZKAREID_NAME__}}`) or a proper template engine like `handlebars` if complexity grows. For v1, a simple string replacement will suffice.
- **Compatibility**: Scaffolding might fail due to system-specific file permissions.
    - *Mitigation*: Use `fs-extra` for consistent cross-platform behavior and include error handling for permission issues.

## Out of Scope
- Support for complex template logic (conditionals, loops) in v1.
- Integration with external CI/CD providers during scaffolding.
- Monorepo package injection (v1 is standalone only).
