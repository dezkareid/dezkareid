# Feature Specification: Sync "Other" Strategy & `--from` Option

## Overview

The `ai-context-sync` CLI currently offers three fixed sync strategies (claude, gemini, gemini-md) in its interactive menu and a `--strategy` flag for non-interactive use. The source file for symlink creation is always hardcoded to `AGENTS.md`.

This feature adds two orthogonal enhancements:

1. **"Other" strategy** — allows users to define one or more custom target filenames (e.g. `CURSOR.md`, `COPILOT.md`) that will be created as symlinks pointing to the source file. Selected when none of the built-in strategies fits.
2. **`--from` option** — allows users to specify a different source file path (instead of the hardcoded `AGENTS.md`) from which symlinks are generated.

Both new values are persisted to the configuration file (`.ai-context-configrc`) so the user is not prompted again on subsequent runs.

---

## Requirements

### Functional Requirements

#### FR-1: "Other" option in the interactive strategies menu

- The `checkbox` prompt shown during `sync` must include an additional choice labelled **"Other (custom files)"** with value `other`.
- When `other` is among the selected strategies, a follow-up prompt appears asking:
  `"Enter custom file name(s) to create as symlinks (comma-separated):"`
- The answer is split on `,`, trimmed, and each token becomes the `targetFilename` of a dynamically-created `SymlinkStrategy` instance.
- The custom filenames are stored in the config file under a new key `otherFiles: string[]`.

#### FR-2: `--files` flag on `sync` command (non-interactive)

- A new CLI option `--files <names>` (alias `-f`) accepts a comma-separated list of custom target filenames.
- When provided, it behaves as if `other` was selected in strategies and the user entered those filenames.
- It can be combined with other strategies (e.g. `--strategy claude,other --files CURSOR.md`).
- If `--strategy` includes `other` but `--files` is absent and the value is not in config, the CLI must error with a clear message: `'Strategy "other" requires --files or a saved "otherFiles" config entry.'`

#### FR-3: `--from` option on `sync` command

- A new CLI option `--from <path>` specifies the source file whose content is used and which symlinks point to.
- Default value: `AGENTS.md` (current hardcoded behaviour, matching `AGENTS_FILENAME` constant).
- The path is resolved relative to `--dir` (project root).
- Value is persisted to config under the key `from: string`.
- On subsequent runs without `--from`, the saved value is read from config and used automatically.
- The `SyncEngine.sync()` signature must be updated to accept `fromFile?: string`.
- `SymlinkStrategy` must be updated to use the provided source file instead of the hardcoded `AGENTS_FILE`.

#### FR-4: Configuration persistence

The `.ai-context-configrc` JSON schema is extended:

```json
{
  "strategies": ["claude", "gemini", "other"],
  "otherFiles": ["CURSOR.md", "COPILOT.md"],
  "from": "AGENTS.md"
}
```

- Reading config: load `otherFiles` and `from` alongside `strategies`.
- Writing config: always write all three keys when they have values (skip absent/undefined keys).
- `--skip-config` continues to bypass both reading and writing.

#### FR-5: Engine and strategy wiring

- `SyncEngine` must accept `fromFile` and `otherFiles` and construct dynamic `SymlinkStrategy` instances for the `other` entries.
- `SymlinkStrategy.sync()` must accept the source path as a parameter (or through constructor injection) instead of relying on the module-level `AGENTS_FILE` constant.

---

### Non-Functional Requirements

- **Backward compatibility**: existing config files without the new keys continue to work unchanged.
- **Validation**: custom filenames must be non-empty strings; reject blank entries after splitting.
- **No breaking changes** to `SyncEngine`'s existing public API for callers that don't use the new options.

---

## Scope

### In Scope

- Adding "Other (custom files)" choice to the interactive checkbox prompt.
- Follow-up prompt for custom filenames when "other" is selected.
- `--files` / `-f` CLI flag.
- `--from` CLI flag.
- Reading/writing `otherFiles` and `from` in `.ai-context-configrc`.
- Updating `SyncEngine.sync()` signature to accept `fromFile` and `otherFiles`.
- Updating `SymlinkStrategy` to use the dynamic source file path.
- Unit tests for the updated engine and strategy wiring.

### Out of Scope

- Changing existing built-in strategies (claude, gemini, gemini-md).
- GUI or web interface.
- Watching files for changes.
- Validating that the custom filenames are "safe" or follow naming conventions beyond non-empty.
- Migrating old config files automatically.

---

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-1 | Running `sync` interactively shows "Other (custom files)" as a checkbox choice. |
| AC-2 | Selecting "Other" triggers a text prompt for comma-separated filenames. |
| AC-3 | Each entered filename results in a symlink pointing to the source file in the target directory. |
| AC-4 | `sync --strategy other --files CURSOR.md,COPILOT.md` runs non-interactively and creates the correct symlinks. |
| AC-5 | `sync --strategy other` without `--files` and no config entry exits with a descriptive error. |
| AC-6 | `sync --from MY_AGENTS.md` uses `MY_AGENTS.md` as the symlink source and reads its content. |
| AC-7 | After first interactive run, subsequent `sync` calls (without flags) read `otherFiles` and `from` from config and skip all prompts. |
| AC-8 | `sync --skip-config` never reads or writes `.ai-context-configrc`. |
| AC-9 | Existing config files without `otherFiles` or `from` keys continue to work correctly. |
| AC-10 | All existing tests continue to pass. |

---

## Decisions

1. **Ordering of `other` symlinks vs built-in strategies**: custom symlinks are created **after** all built-in strategies, in the order the filenames were entered.
2. **`--from` resolution**: only paths **relative to `--dir`** are supported. Absolute paths are not accepted.
3. **Config overwrite behaviour**: when `--files` is provided and config already has `otherFiles`, the new values are **merged (union)** — existing entries are kept and new ones are added. Duplicates are deduplicated.
4. **Prompt for `--from` in interactive mode**: `--from` is **only available as a CLI flag**, not prompted interactively. Users who want a custom source file must pass `--from` explicitly.
