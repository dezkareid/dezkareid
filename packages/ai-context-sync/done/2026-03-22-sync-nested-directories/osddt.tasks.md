# Task List: Sync Nested Directories

## Phase 1: Refactor Types and Configuration
- [x] [S] Update `SyncConfig` and `ProjectConfig` types in `src/index.ts`.
- [x] [S] Update `SyncOptions` to include `--projects-only` and other future-proofing fields.
- [x] [M] Refactor `readConfig` and `applyConfig` to support the new object-based `projects` structure.
- [x] [M] Implement configuration merging logic (root config + nested project config + root project overrides).
- [x] [S] Add unit tests for configuration resolution and merging.

**Definition of Done**: `SyncConfig` supports multiple projects, and the merging logic is verified by tests.

## Phase 2: Sequential Sync & Reporting
- [x] [M] Refactor `runSync` to separate root sync logic into a reusable function (e.g., `syncProject`).
- [x] [M] Implement the main loop in `runSync` to iterate over root and all configured projects.
- [x] [S] Implement fail-soft logic (try-catch within the loop) and error accumulation.
- [x] [S] Enhance console output to prefix logs with project names/paths.
- [x] [S] Implement the final summary report (success count, failure warnings).
- [x] [M] Create a integration test or reproduction script with a mock monorepo structure.

**Definition of Done**: `sync` command processes multiple projects sequentially, reports progress clearly, and doesn't halt on single-project failures.

## Phase 3: Project Management CLI
- [x] [M] Implement `project` command group and `project add <path>` subcommand.
- [x] [S] Add flags to `project add` for `--strategy`, `--files`, and `--from`.
- [x] [M] Implement interactive prompts for `project add` when flags are missing.
- [x] [S] Update `.ai-context-configrc` persistence logic to save new projects.

**Definition of Done**: Users can add new projects to the configuration via the CLI with validation and interactive support.

## Phase 4: Documentation & Use Cases
- [x] [S] Update `README.md` with "Monorepo / Multi-project Sync" section and examples.
- [x] [S] Update `AGENTS.md` with new technical details, types, and command references.
- [x] [S] Add a `USE_CASES.md` or similar (or include in README) showing different strategy configurations for different subdirectories.

**Definition of Done**: Documentation is complete and accurately reflects the new features and configuration options.

## Dependencies
- Phase 2 depends on Phase 1 (Refactored types).
- Phase 3 depends on Phase 1 (Configuration persistence logic).
- Phase 4 depends on Phases 2 & 3.
