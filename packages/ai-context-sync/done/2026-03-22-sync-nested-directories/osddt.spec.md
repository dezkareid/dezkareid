# Specification: Sync Nested Directories

## Overview
The `ai-context-sync` CLI utility currently synchronizes AI agent context files (like `CLAUDE.md`, `GEMINI.md`) for a single directory at a time. In complex projects or monorepos, multiple directories may contain their own `AGENTS.md` file and require synchronization. 

This feature introduces the ability to configure multiple subdirectories within the `.ai-context-configrc` file. This allows users to synchronize the root project and all its subprojects in a single command execution, with the flexibility to apply different synchronization strategies to each.

## Requirements

### Configuration Support
- The `.ai-context-configrc` file must support a `projects` (or similar) property to define a list of directories to be synchronized.
- Each entry in the `projects` list can specify:
  - `path`: The relative or absolute path to the directory.
  - `strategies`: (Optional) Specific strategies for this directory.
  - `otherFiles`: (Optional) Custom filenames for the "other" strategy.
  - `from`: (Optional) The source file name (defaulting to `AGENTS.md`).

### Execution Logic
- When the `sync` command is executed, the tool should:
  1. Synchronize the current directory (or the one specified via `--dir`) using the root configuration.
  2. Iterate through all configured projects in the `.ai-context-configrc` and synchronize each one.
- If a project entry does not specify `strategies`, it should inherit the strategies defined at the root of the configuration.
- The tool must handle cases where a configured project directory does not exist or does not contain the source file (e.g., `AGENTS.md`), providing clear error or warning messages.

### User Interface
- The CLI output should clearly list each directory as it is being synchronized.
- Successful synchronization of all projects should be summarized at the end of the execution.

## Scope

### In Scope
- Updating the `SyncConfig` type and configuration parsing logic.
- Modifying the `runSync` function to support multi-project synchronization.
- Ensuring backward compatibility for existing single-project configurations.
- Clear console reporting for multi-project progress.

### Out of Scope
- Automatic recursive discovery of all `AGENTS.md` files (only configured projects are synced).
- Parallel execution of synchronization (projects will be synced sequentially for now).
- Interactive prompting for strategies on a per-subdirectory basis (subdirectories must be configured in the file or inherit from root).

## Acceptance Criteria
- Given a `.ai-context-configrc` with multiple projects, running `ai-context-sync sync` updates context files in all specified paths.
- A project with a specific strategy (e.g., only `claude`) correctly ignores other root strategies (e.g., `gemini`).
- A project without specific strategies correctly uses the root's `strategies` list.
- Invalid project paths result in a clear error message but do not necessarily crash the entire sync process (depending on implementation preference, though a single failure typically stops the CLI).
- Running the tool with `--skip-config` or without a config file continues to work as expected for the single target directory.

## Decisions
1. **Root synchronization**: Always synchronize the root directory as well as any configured projects.
2. **Nested configurations**: If a subdirectory has its own `.ai-context-configrc`, its configuration should be merged with the root configuration for that specific project.
3. **`projects` key structure**: The `projects` key will be an object keyed by the directory path for easy access and configuration.
