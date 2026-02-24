# Task List: Sync "Other" Strategy & `--from` Option

## Dependencies

```
Phase 1 → Phase 2 → Phase 3 → Phase 4
```

All phases are sequential. Phase 2 requires Phase 1 to be complete. Phase 3 requires Phase 2. Phase 4 can be done incrementally alongside phases but must finalise after all implementation is done.

---

## Phase 1 — Update `SymlinkStrategy` to accept a dynamic source path

> **Definition of Done**: `SymlinkStrategy` and `GeminiStrategy` both accept an optional `fromFile` constructor param. All existing tests still pass. No symlink behaviour changes when `fromFile` is omitted.

- [x] [S] Add optional `fromFile` constructor parameter (default: `AGENTS_FILE`) to `SymlinkStrategy` in `src/strategies/symlink.ts` and replace the hardcoded `AGENTS_FILE` reference in `sync()` with `this.fromFile`
- [x] [S] Update `GeminiStrategy` in `src/strategies/gemini.ts` to accept an optional `fromFile` constructor parameter (default: `AGENTS_FILE`) and use it instead of the hardcoded `AGENTS_FILE` import in `sync()`
- [x] [S] Verify `ClaudeStrategy` and `GeminiMdStrategy` require no changes (they extend `SymlinkStrategy` with no constructor — confirm they still compile and behave identically)

---

## Phase 2 — Add `OtherStrategy` and update `SyncEngine`

> **Definition of Done**: `SyncEngine.sync()` accepts `fromFile` and `otherFiles`. Passing `strategy: ['other']` with `otherFiles: ['CURSOR.md']` creates the correct symlink. Passing `strategy: ['other']` without `otherFiles` throws a descriptive error. All existing engine tests still pass.

*Depends on: Phase 1*

- [x] [S] Create `src/strategies/other.ts` — export `OtherStrategy extends SymlinkStrategy` with a `targetFilename` constructor param and an optional `fromFile` param forwarded to `super()`
- [x] [M] Update `SyncEngine.sync()` in `src/engine.ts` to accept two new optional params: `fromFile?: string` and `otherFiles?: string[]`
- [x] [M] Inside `SyncEngine.sync()`, pass `fromFile` to each built-in strategy constructor when building `strategiesToRun` (move strategy instantiation inside `sync()` or make it lazy so `fromFile` is available)
- [x] [S] Inside `SyncEngine.sync()`, when `normalizedList` includes `'other'`: validate `otherFiles` is non-empty (throw `'Strategy "other" requires otherFiles to be specified.'` if not), then construct one `OtherStrategy(filename, fromFile)` per entry and append to `strategiesToRun` (after built-in strategies)
- [x] [S] Update the source-file path resolution in `SyncEngine.sync()` to use `fromFile ?? AGENTS_FILENAME` when building `agentsPath`

---

## Phase 3 — Update CLI (`src/index.ts`)

> **Definition of Done**: `--files` and `--from` flags exist and work. Interactive flow shows "Other (custom files)" and prompts for filenames when selected. Config reads/writes `otherFiles` and `from`. `--skip-config` still bypasses everything. `sync --strategy other` without `--files` or saved config exits with a clear error.

*Depends on: Phase 2*

- [x] [S] Add `--files <names>` (`-f`) and `--from <path>` options to the `sync` command definition
- [x] [S] Extend the config-reading block to also load `otherFiles` and `from` from `.ai-context-configrc` when present
- [x] [M] Implement `--files` resolution: parse comma-separated value, trim and filter blanks, then union-merge with any `otherFiles` already loaded from config (deduplicate via `Set`)
- [x] [S] Implement `--from` resolution: use flag value as relative path (validate it is not absolute — throw error if `path.isAbsolute(options.from)`); flag value takes precedence over config value
- [x] [M] Add "Other (custom files)" choice to the interactive strategies `checkbox` prompt; add a conditional follow-up `input` prompt for comma-separated filenames when `other` is selected and `otherFiles` is not already populated from config
- [x] [S] Add validation: if the resolved strategy list includes `'other'` and `otherFiles` is empty/undefined after all resolution steps, exit with `'Strategy "other" requires --files or a saved "otherFiles" config entry.'`
- [x] [S] Extend the config-writing block to include `otherFiles` (merged union) and `from` when they have values
- [x] [S] Update the `engine.sync()` call to pass `fromFile` and `otherFiles` as the new fourth and fifth arguments

---

## Phase 4 — Tests

> **Definition of Done**: All new behaviour is covered by unit tests. All pre-existing tests continue to pass. `pnpm test` (or `vitest run`) exits with zero failures.

*Depends on: Phases 1–3 (can write tests incrementally, must finalise after all implementation)*

- [x] [S] Add unit tests in `src/strategies/other.test.ts`: `OtherStrategy` creates symlink with correct `targetFilename`; `OtherStrategy` uses custom `fromFile` when provided
- [x] [M] Add unit tests in `src/engine.test.ts`:
  - `sync()` with `otherFiles: ['CURSOR.md']` creates `CURSOR.md` symlink pointing to source file
  - `sync()` with multiple `otherFiles` creates all symlinks
  - `sync()` with `fromFile: 'MY_AGENTS.md'` uses that file as the symlink source (create it in `tempDir` first)
  - `sync()` with `strategy: 'other'` but no `otherFiles` throws descriptive error
  - `sync()` with `['claude', 'other']` + `otherFiles` runs both built-in and custom strategies; custom symlinks appear after `CLAUDE.md`
- [x] [S] Confirm all pre-existing tests in `src/engine.test.ts`, `src/strategies/symlink.test.ts`, `src/strategies/claude.test.ts`, `src/strategies/gemini.test.ts`, and `src/strategies/gemini-md.test.ts` still pass without modification
- [x] [S] Run full test suite (`pnpm --filter @dezkareid/ai-context-sync test`) and confirm zero failures
