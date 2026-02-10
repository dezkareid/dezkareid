# Agent Instructions: @dezkareid/ai-context-sync

## Project Context
This package is a CLI utility designed to synchronize AI agent context files (like `CLAUDE.md` and `.gemini/settings.json`) using `AGENTS.md` as the single source of truth.

## Technical Details
- **Language**: TypeScript (NodeNext)
- **Engine**: A strategy-based architecture to support multiple AI providers.
- **Strategies**:
  - `claude`: Manages `CLAUDE.md` as a symbolic link to `AGENTS.md`.
  - `gemini`: Configures `.gemini/settings.json` to include `AGENTS.md` as a context file.

## Development Workflow
- **Install**: `pnpm install`
- **Build**: `pnpm build`
- **Run**: `pnpm start sync` or `node dist/index.js sync`

## Adding a New Strategy
1. Create a new class in `src/strategies/` implementing the `SyncStrategy` interface.
2. Register the strategy in `src/engine.ts`.
