# AI Agent Context for @dezkareid/scaffolding

This file provides critical context for AI agents working on the scaffolding tool.

## Architecture

The tool is a Node.js CLI built with:
- **Commander**: For CLI structure and argument parsing.
- **Prompts**: For interactive user input.
- **fs-extra**: For robust filesystem operations.
- **Tsup**: For bundling the source into a single executable `dist/index.js`.
- **Vitest**: For unit and E2E testing.

### Key Logic
- `src/index.ts`: Entry point, defines commands and handles interactivity.
- `src/utils/template.ts`: Core logic for discovering templates and copying files with placeholder replacement (`{{placeholder}}`).
- `templates/`: Contains the actual project boilerplate files.

## Guidelines for Adding Templates
1. Create a new directory under `templates/`.
2. Use placeholders for dynamic content.
3. Use `_gitignore` for the gitignore file (it will be renamed to `.gitignore` during scaffolding).
4. Update `src/index.ts` to support the new template type if necessary.
