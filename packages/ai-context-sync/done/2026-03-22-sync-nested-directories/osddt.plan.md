# Implementation Plan: Sync Nested Directories

## Architecture Overview

### Configuration & Types
Update the `SyncConfig` structure in `src/index.ts` to support multiple project definitions:
- **`ProjectConfig`**: Represents the sync parameters for a specific directory (`strategies`, `otherFiles`, `from`).
- **`SyncConfig`**: Extends `ProjectConfig` (for root sync) and adds a `projects` property (a record where keys are relative paths and values are `ProjectConfig`).

### Core Execution Logic
The `runSync` function will be refactored to:
1.  **Resolve Root Sync**: Determine strategies and files for the current directory.
2.  **Iterate Projects**: Sequential loop through all configured `projects` in the configuration file.
3.  **Fail-Soft Loop**: Use `try-catch` within the iteration to ensure one failure doesn't halt the entire process.
4.  **Configuration Merging**: For each project:
    - Base configuration from the root `.ai-context-configrc`.
    - Local project configuration from its own `.ai-context-configrc` (if it exists).
    - Overrides defined for that specific project in the root `.ai-context-configrc`.
5.  **Final Summary**: Report successful synchronizations and provide a clear warning summary for any that failed.

### New CLI Subcommand
Add a `project` subcommand using `commander` for easier configuration:
- `ai-context-sync project add <path>`: Prompts for or accepts flags for project-specific strategies and adds it to `.ai-context-configrc`.

## Implementation Phases

### Phase 1: Refactor Types and Configuration
- Update `SyncConfig` and `SyncOptions` types.
- Enhance `readConfig` and `applyConfig` to handle nested projects and merging logic.
- **Verification**: Unit test the configuration merging logic.

### Phase 2: Sequential Sync & Reporting
- Refactor `runSync` to implement the sequential loop.
- Implement error accumulation and the final summary report.
- Enhance console output to show project-specific progress (e.g., `[root] Synchronized...`, `[apps/web] Synchronized...`).
- **Verification**: Run `sync` on a mock monorepo structure with some valid and some invalid paths.

### Phase 3: Project Management CLI
- Implement `ai-context-sync project add` with options for strategies and custom files.
- Update `ai-context-sync sync` to accept a `--projects-only` flag if users want to skip root sync (optional, as per decisions).
- **Verification**: Verify that `project add` correctly updates the root `.ai-context-configrc`.

### Phase 4: Documentation & Use Cases
- Update `README.md` with examples for monorepo setups.
- Update `AGENTS.md` with the new technical architecture and command options.
- Document specific use cases (e.g., different AI agents for different packages).

## Technical Dependencies
- `commander`: Current CLI framework (will use subcommands).
- `fs-extra`: For directory and JSON handling.
- `inquirer`: For interactive prompts in the `project add` command.

## Risks & Mitigations
- **Path Resolution**: Relative paths must be consistently resolved relative to the configuration file location. Mitigation: Use `path.resolve(configDir, projectPath)`.
- **Infinite Loops**: A project path pointing back to the root or a circular reference. Mitigation: Limit depth or check for duplicate absolute paths.
- **Breaking Changes**: Ensure existing `.ai-context-configrc` files continue to work without modification.

## Out of Scope
- **Parallel Sync**: All operations will be sequential to maintain predictable console output.
- **Glob Patterns**: Projects must be explicitly added by path; no automatic discovery of `AGENTS.md` via glob patterns for now.
