# Agent Instructions: @dezkareid/ai-context-sync

## Project Context
This package is a CLI utility designed to synchronize AI agent context files (like `CLAUDE.md` and `.gemini/settings.json`) using `AGENTS.md` as the single source of truth.

## Technical Details
- **Language**: TypeScript (NodeNext)
- **Engine**: A strategy-based architecture to support multiple AI providers.
- **Multi-project Support**: Sequential synchronization with fail-soft behavior.
- **Configuration**: `.ai-context-configrc` supports a `projects` object keyed by relative path.

## Strategies
- `claude`: Manages `CLAUDE.md` as a symbolic link to `AGENTS.md`.
- `gemini`: Configures `.gemini/settings.json` to include `AGENTS.md` as a context file.
- `gemini-md`: Manages `GEMINI.md` as a symbolic link to `AGENTS.md`.
- `other`: Allows specifying custom filenames to be created as symbolic links to the source file.

## Development Workflow
- **Install**: `pnpm install`
- **Build**: `pnpm build`
- **Run**: `pnpm start sync` or `node dist/index.js sync`

## Commands

### `sync`
Synchronize context files from `AGENTS.md` for the root and all configured projects.

**Options:**
- `-d, --dir <path>`: Project directory where `AGENTS.md` and config live (defaults to `cwd`).
- `-t, --target-dir <path>`: Target directory where synced files are written (defaults to `--dir`).
- `-s, --strategy <strategy>`: Select specific strategies (e.g., `claude`, `gemini`, `all`, or `"claude, gemini"`).
- `-f, --files <names>`: Comma-separated custom filenames for the "other" strategy.
- `--from <path>`: Source file path for symlinks (default: `AGENTS.md`).
- `--skip-config`: Avoid reading/creating the `.ai-context-configrc` file.

### `project add <path>`
Add a new subdirectory to the configuration.

**Options:**
- `-s, --strategy <strategy>`: Specific sync strategy for this project.
- `-f, --files <names>`: Custom filenames for the "other" strategy.
- `--from <path>`: Source file path for symlinks.
- If no strategy is provided, the tool will prompt for it interactively.

## Adding a New Strategy
1. Create a new class in `src/strategies/` implementing the `SyncStrategy` interface.
2. Register the strategy in `src/engine.ts`.
