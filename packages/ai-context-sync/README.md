# @dezkareid/ai-context-sync

A CLI utility to synchronize AI agent context files across different providers, using `AGENTS.md` as the source of truth.

## Features

- **Source of Truth**: Uses `AGENTS.md` to define project context, rules, and workflows.
- **Multi-provider support**:
  - **Claude**: Generates/updates `CLAUDE.md`.
  - **Gemini**: Configures `.gemini/settings.json` to use `AGENTS.md`.
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

Or specify a directory:

```bash
npx @dezkareid/ai-context-sync sync --dir ./my-package
```

## How it works

1. The tool looks for an `AGENTS.md` file in the target directory.
2. It reads the content of `AGENTS.md`.
3. It applies different strategies to update provider-specific files:
   - **Claude**: Creates a symbolic link `CLAUDE.md` pointing to `AGENTS.md`.
   - **Gemini**: Updates `.gemini/settings.json` to include `AGENTS.md` in the `context.fileName` list.

## License

ISC
