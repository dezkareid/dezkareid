# Implementation Plan: Sync "Other" Strategy & `--from` Option

## Architecture Overview

The changes touch four layers of the existing architecture, each building on the one below:

```
src/index.ts          ← CLI layer: new flags, interactive prompts, config r/w
    └── src/engine.ts ← Engine layer: new sync() params, dynamic strategy construction
        └── src/strategies/symlink.ts  ← Strategy layer: parameterised source path
            └── src/constants.ts      ← Constants: AGENTS_FILENAME stays as default
```

### Key Design Decisions

1. **`SymlinkStrategy` receives `fromFile` via constructor** (not a method param) — keeps the `SyncStrategy` interface's `sync()` signature unchanged, preserving backward compatibility for existing callers.

2. **`OtherStrategy` is a concrete subclass of `SymlinkStrategy`** — created dynamically in `SyncEngine` per filename, reusing all existing symlink creation logic.

3. **`SyncEngine.sync()` gains two optional params**: `fromFile?: string` and `otherFiles?: string[]` — callers that omit them get the current behaviour.

4. **Config schema additive only** — new keys `otherFiles` and `from` are written only when they have values; missing keys on read are treated as undefined (backward compatible).

5. **`--from` is flag-only** — no interactive prompt for the source file path. Users must pass `--from` explicitly on the CLI; the value is saved to config for subsequent runs.

---

## Implementation Phases

### Phase 1 — Update `SymlinkStrategy` to accept a dynamic source path

**Goal**: decouple the symlink source from the module-level `AGENTS_FILE` constant.

**Files**: `src/strategies/symlink.ts`

**Steps**:
- Add a `fromFile` constructor parameter with default `AGENTS_FILE`.
- Replace the hardcoded `AGENTS_FILE` reference in `sync()` with `this.fromFile`.
- Update the existing concrete subclasses (`ClaudeStrategy`, `GeminiMdStrategy`) — they pass no argument, so they keep using the default.
- `GeminiStrategy` uses `AGENTS_FILE` independently; update it to also accept `fromFile` via constructor for consistency (it affects the `settings.json` path it writes).

**Result**: All symlink-based strategies work with a configurable source file.

---

### Phase 2 — Add `OtherStrategy` and update `SyncEngine`

**Goal**: support dynamic custom-filename strategies and thread `fromFile` through the engine.

**Files**: `src/strategies/other.ts` (new), `src/engine.ts`

**Steps**:

#### `src/strategies/other.ts`
- Export `OtherStrategy extends SymlinkStrategy`:
  ```ts
  export class OtherStrategy extends SymlinkStrategy {
    name = 'other';
    constructor(public targetFilename: string, fromFile?: string) {
      super(fromFile);
    }
  }
  ```

#### `src/engine.ts`
- Extend `sync()` signature:
  ```ts
  async sync(
    projectRoot: string,
    selectedStrategies?: string | string[],
    targetDir?: string,
    fromFile?: string,
    otherFiles?: string[]
  ): Promise<void>
  ```
- Pass `fromFile` to each strategy constructor (update instantiation of `allStrategies` to be computed inside `sync()` so `fromFile` is available, or pass it lazily).
- When `normalizedList` includes `'other'`: validate `otherFiles` is non-empty (throw if not), construct one `OtherStrategy(filename, fromFile)` per entry, append them to `strategiesToRun`.
- Update the source-file resolution: use `fromFile ?? AGENTS_FILENAME` when building `agentsPath`.
- Update the "available strategies" error message to list `other` as valid only when `otherFiles` are provided.

**Result**: Engine correctly handles custom filenames and dynamic source paths.

---

### Phase 3 — Update CLI (`src/index.ts`)

**Goal**: expose new flags and interactive prompts, persist new config keys.

**Steps**:

#### New CLI options
```ts
.option('-f, --files <names>', 'Comma-separated custom filenames for "other" strategy')
.option('--from <path>', 'Source file path for symlinks (default: AGENTS.md)')
```

#### Config reading (extend existing block)
```ts
const config = await fs.readJson(configPath);
if (config.strategies) strategy = config.strategies;
if (config.otherFiles) otherFiles = config.otherFiles;   // new
if (config.from) fromFile = config.from;                  // new
```

#### `--files` resolution
- If `options.files` is provided: parse it → `flagFiles = options.files.split(',').map(s => s.trim()).filter(Boolean)`.
- Merge with any existing `otherFiles` from config: `otherFiles = [...new Set([...(configOtherFiles ?? []), ...flagFiles])]` (union, deduplicated, config entries preserved).

#### `--from` resolution
- If `options.from` is provided: `fromFile = options.from`. Path is treated as relative to `--dir` (`path.join(projectRoot, fromFile)`). Absolute paths are not supported.
- Flag value takes precedence over config.
- No interactive prompt — `--from` is flag-only.

#### Interactive prompt changes
1. **Strategy checkbox**: add `{ name: 'Other (custom files)', value: 'other' }`.
2. **Conditional follow-up** (after strategies prompt, if `other` selected and `otherFiles` not already set from config):
   ```ts
   { type: 'input', name: 'otherFiles', message: 'Enter custom file name(s) (comma-separated):',
     validate: v => v.trim().length > 0 || 'At least one filename is required.' }
   ```
   Parse result into `otherFiles` array.

#### Validation
- If `strategy` array includes `'other'` and `otherFiles` is empty/undefined after all resolution steps → exit with error message.

#### Config writing (extend existing block)
```ts
const configData: Record<string, unknown> = { strategies: strategy };
if (otherFiles?.length) configData.otherFiles = otherFiles;  // always the merged union
if (fromFile) configData.from = fromFile;                    // save if provided via flag
await fs.writeJson(configPath, configData, { spaces: 2 });
```

#### Engine call
```ts
await engine.sync(projectRoot, strategy, targetDir, fromFile, otherFiles);
```

**Result**: Full interactive and non-interactive workflows work with the new options.

---

### Phase 4 — Tests

**Goal**: cover new behaviour without breaking existing tests.

**Files**: `src/engine.test.ts`, `src/strategies/symlink.test.ts` (and new `src/strategies/other.test.ts`)

**New test cases**:

#### `engine.test.ts`
- `sync()` with `otherFiles: ['CURSOR.md']` creates `CURSOR.md` symlink.
- `sync()` with multiple `otherFiles` creates all symlinks.
- `sync()` with `fromFile: 'MY_AGENTS.md'` uses that file as symlink source.
- `sync()` with `other` strategy but no `otherFiles` throws descriptive error.
- Combining built-in strategy + `other` works (e.g. `['claude', 'other']` + `otherFiles`).

#### `src/strategies/other.test.ts`
- `OtherStrategy` creates symlink with correct `targetFilename`.
- `OtherStrategy` uses custom `fromFile` when provided.

#### `symlink.test.ts`
- Existing tests still pass (no change in default behaviour).

---

## Technical Dependencies

| Dependency | Current version | Usage |
|---|---|---|
| `commander` | `12.0.0` | New `.option()` calls |
| `inquirer` | existing | New `input` prompt type |
| `fs-extra` | `11.2.0` | Config r/w (unchanged) |
| `vitest` | `4.0.18` | New unit tests |

No new dependencies required.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `SymlinkStrategy` constructor change breaks subclasses | Low | Default param `fromFile = AGENTS_FILE` means existing subclasses need no changes |
| `SyncEngine.sync()` signature change breaks callers | Low | New params are all optional with safe defaults |
| `GeminiStrategy` ignores `fromFile` | Medium | Update `GeminiStrategy` to also accept `fromFile` in Phase 1 for consistency; it affects the relative path written to `settings.json` |
| User passes absolute path to `--from` | Low | Validate that `fromFile` is not absolute; throw a clear error if it is |
| Config `otherFiles` growing unbounded across runs | Low | Union merge is intentional; users can clear it by editing config or using `--skip-config` |
| Blank filenames after split in `--files` | Low | `.filter(Boolean)` after trim removes empties; validate non-empty array |

---

## Out of Scope

- Changing `GeminiStrategy`'s core logic (what it writes to `settings.json`).
- Interactive prompt for `--from` (flag-only by design).
- Validating that the `--from` file exists at prompt time (deferred).
- Supporting glob patterns in `--files`.
- Auto-migrating existing configs.
- E2E / integration CLI tests.
