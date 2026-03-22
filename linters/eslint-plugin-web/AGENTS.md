# Agent Instructions: @dezkareid/eslint-plugin-web

## Project Context

Custom ESLint plugin that provides shared lint configurations and custom rules for web projects in the monorepo. Consumers spread its configs into their `eslint.config.mjs`.

## Package Structure

```
linters/eslint-plugin-web/
├── src/
│   ├── index.ts                    # Plugin entry — exports meta, rules, configs
│   ├── declarations.d.ts           # Ambient type declarations for untyped deps
│   └── rules/
│       ├── no-jquery.ts            # Rule: forbid jQuery imports
│       └── no-allowed-packages.ts  # Rule: forbid configurable package list
├── tests/
│   ├── no-jquery.test.ts
│   └── no-allowed-packages.test.ts
├── dist/                           # Compiled output (tsc)
├── package.json
└── tsconfig.json
```

## Technical Details

- **Language**: TypeScript (NodeNext module resolution)
- **Build**: `tsc` → `dist/`
- **Test**: Vitest

## Configs

All configs are exported from `src/index.ts` under `configs` and are arrays of `Linter.Config[]`.

| Config key   | Plugin(s) used                                      | Target files       |
|--------------|-----------------------------------------------------|--------------------|
| `typescript` | `@dezkareid/eslint-config-ts-base`                  | `**/*.{ts,tsx}`    |
| `react`      | `@eslint-react/eslint-plugin`, `eslint-plugin-unicorn` | `**/*.{jsx,tsx}` |
| `css`        | `@eslint/css`                                       | `**/*.css`         |
| `astro`      | `eslint-plugin-astro`, `eslint-plugin-unicorn`      | `**/*.astro`       |

### CSS config rules

| Rule | Severity | Option |
|------|----------|--------|
| `css/no-duplicate-imports` | error | — |
| `css/no-empty-blocks` | error | — |
| `css/no-invalid-at-rules` | error | — |
| `css/no-invalid-properties` | error | — |
| `css/use-baseline` | warn | `{ available: 'widely' }` |

The `css` config requires `as unknown as Linter.Config` casting because `@eslint/css` uses its own language-specific types that don't overlap with ESLint's generic `Linter.Config`.

## Custom Rules

### `no-jquery`
- **Type**: `problem`
- **What it does**: Reports any `import` from `'jquery'`.
- **Options**: none

### `no-allowed-packages`
- **Type**: `problem`
- **What it does**: Reports imports from any package in the provided list.
- **Options**: array of package name strings (e.g., `['lodash', 'moment']`)

## Development Workflow

```bash
pnpm install          # install deps
pnpm build            # tsc → dist/
pnpm test             # vitest --run
```

## Adding a New Config

1. Import the plugin in `src/index.ts`.
2. Add the dependency to `package.json` (exact version, no `^` or `~`).
3. Add a new key to the `configs` object.
4. If the plugin's types are incompatible with `Linter.Config`, use `as unknown as Linter.Config`.
5. Document the config in `README.md` and this file.

## Adding a New Rule

1. Create `src/rules/<rule-name>.ts` implementing `Rule.RuleModule`.
2. Export it from `src/index.ts` under `rules`.
3. Add tests in `tests/<rule-name>.test.ts`.
4. Document the rule in `README.md` and this file.
