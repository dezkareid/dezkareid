# Task List: Project Scaffolding CLI

## Phase 1: Project Foundation
- [x] [S] Initialize npm package and install core dependencies (`tsup`, `vitest`, `commander`, `typescript`, `@types/node`).
- [x] [S] Configure development environment: `tsconfig.json` and `tsup.config.ts`.
- [x] [M] Implement CLI entry point with `commander` setup and `create` command argument parsing.

**Definition of Done**: CLI runs via `tsx` or `node` and parses basic arguments without errors.

## Phase 2: Template System
- [x] [M] Design and implement template discovery logic (locating template files relative to the executable).
- [x] [M] Create "TS/JS Library" template files (package.json, tsconfig, lint/test configs, README.md, AGENTS.md).
- [x] [M] Implement `fs-extra` based copying with placeholder replacement logic.

**Definition of Done**: Running the CLI generates a project folder with files where placeholders are correctly replaced.

## Phase 3: Interactivity & UX
- [x] [M] Integrate `prompts` to gather `name`, `description`, and `author` if not provided via arguments.
- [x] [S] Enhance CLI output with `picocolors` for status messages and progress.
- [x] [S] Implement conditional `git init` (check if `.git` exists before running).

**Definition of Done**: CLI is user-friendly, handles missing input gracefully, and initializes git when appropriate.

## Phase 4: Validation & Distribution
- [x] [M] Write unit tests in `vitest` for the template engine and placeholder replacement.
- [x] [L] Create E2E test script to verify a scaffolded project can be built and tested.
- [x] [S] Configure `package.json` `bin`, `files`, and `publishConfig` for npm/npx distribution.

**Definition of Done**: All tests pass, and the package is ready for publication.

## Dependencies
- Phase 2 depends on Phase 1 (basic CLI structure).
- Phase 3 depends on Phase 2 (interactive input feeds into the template engine).
- Phase 4 depends on all previous phases for full verification.
