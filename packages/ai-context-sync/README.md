# @dezkareid/ai-context-sync

A CLI utility to synchronize AI agent context files across different providers, using `AGENTS.md` as the source of truth.

## Features

- **Source of Truth**: Uses `AGENTS.md` to define project context, rules, and workflows.
- **Multi-provider support**:
  - **Claude**: Generates/updates `CLAUDE.md`.
  - **Gemini**: Configures `.gemini/settings.json` to use `AGENTS.md`.
  - **Gemini Markdown**: Generates/updates `GEMINI.md`.
- **Plugin Architecture**: Easily extendable to support other AI agents.

## Installation

```bash
pnpm install @dezkareid/ai-context-sync
```

## Usage

### Synchronize context

Run the sync command in your project root (where `AGENTS.md` is located):

```bash
npx @dezkareid/ai-context-sync sync
```

You can select the strategy using the `--strategy` (or `-s`) option:

```bash
npx @dezkareid/ai-context-sync sync --strategy claude
npx @dezkareid/ai-context-sync sync --strategy gemini
npx @dezkareid/ai-context-sync sync --strategy all
npx @dezkareid/ai-context-sync sync --strategy "claude, gemini"
```

If no strategy is provided, an interactive checkbox menu will appear to let you toggle which strategies to run.

### Configuration

The tool can save your selected strategies in a `.ai-context-configrc` file in the project root. This avoids being prompted every time you run the command.

To bypass reading or creating this configuration file, use the `--skip-config` flag:

```bash
npx @dezkareid/ai-context-sync sync --skip-config
```

### Monorepo / Multi-project Sync

In complex projects or monorepos, you can configure multiple subdirectories to be synchronized in a single command. The tool will sequentially sync the root project and then each configured subdirectory.

#### Managing Projects

Use the `project` command to manage your configured projects:

```bash
# Add a new project (interactive)
npx @dezkareid/ai-context-sync project add apps/web

# Add a project with specific strategies
npx @dezkareid/ai-context-sync project add packages/ui --strategy "claude, gemini"

# Add a project with custom files
npx @dezkareid/ai-context-sync project add packages/lib --strategy other --files "CUSTOM.md"
```

#### Configuration Structure

Configured projects are stored in the `.ai-context-configrc` file at the root:

```json
{
  "strategies": ["claude"],
  "projects": {
    "apps/web": {
      "strategies": ["gemini"]
    },
    "packages/ui": {
      "strategies": ["claude", "gemini"]
    }
  }
}
```

When you run `npx @dezkareid/ai-context-sync sync`, it will:
1. Sync the root using the top-level `strategies`.
2. Sync `apps/web` using the `gemini` strategy.
3. Sync `packages/ui` using `claude` and `gemini` strategies.

If a project doesn't define its own `strategies`, it will inherit the root's `strategies`.


### Directory option

The `-d, --dir` option allows you to specify where the root `AGENTS.md` and configuration file live. All project paths are resolved relative to this directory.

## How it works

1. The tool looks for an `AGENTS.md` file in the target directory (root and each configured project).
2. It reads the content of `AGENTS.md`.
3. It applies different strategies sequentially.
4. If a specific synchronization fails, it reports the error but continues with the next project (fail-soft).
5. A summary is displayed at the end if any errors occurred.

## License

ISC
