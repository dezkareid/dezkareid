# Agent Instructions: @dezkareid/eslint-plugin-web

## Project Context

Custom ESLint plugin that provides shared lint configurations and custom rules for web projects in the monorepo. Consumers import named config entrypoints into their `eslint.config.mjs`.

## Package Structure

```
linters/eslint-plugin-web/
├── src/
│   ├── index.ts                    # Plugin entry — exports meta, rules, configs
│   ├── declarations.d.ts           # Ambient type declarations for untyped deps
│   ├── configs/
│   │   ├── typescript.ts           # Config: TypeScript (via eslint-config-ts-base)
│   │   ├── react.ts                # Config: React (via @eslint-react/eslint-plugin)
│   │   ├── astro.ts                # Config: Astro (via eslint-plugin-astro)
│   │   └── css.ts                  # Config: CSS (via @eslint/css)
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
- **Version**: Read at runtime from `package.json` via `createRequire` — always in sync with the published version, no hardcoding.

## Entrypoints

Each config is a separate named export in `package.json`. Consumers import only what they need, making the required peer dependencies explicit per entrypoint.

| Entrypoint | Import path | Required peer |
|---|---|---|
| Default (all) | `@dezkareid/eslint-plugin-web` | — |
| typescript | `@dezkareid/eslint-plugin-web/typescript` | none |
| react | `@dezkareid/eslint-plugin-web/react` | `@eslint-react/eslint-plugin` |
| astro | `@dezkareid/eslint-plugin-web/astro` | `eslint-plugin-astro` |
| css | `@dezkareid/eslint-plugin-web/css` | none (`@eslint/css` is bundled) |

## Configs

| Config key   | Source file           | Plugin(s) used                                         | Target files       |
|--------------|-----------------------|--------------------------------------------------------|--------------------|
| `typescript` | `configs/typescript.ts` | `@dezkareid/eslint-config-ts-base`                   | `**/*.{ts,tsx}`    |
| `react`      | `configs/react.ts`    | `@eslint-react/eslint-plugin`, `eslint-plugin-unicorn` | `**/*.{jsx,tsx}`   |
| `css`        | `configs/css.ts`      | `@eslint/css`                                          | `**/*.css`         |
| `astro`      | `configs/astro.ts`    | `eslint-plugin-astro`, `eslint-plugin-unicorn`         | `**/*.astro`       |

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

1. Create `src/configs/<name>.ts` exporting a `Linter.Config[]`.
2. Import and re-export it in `src/index.ts` under `configs`.
3. Add a new named export in `package.json` under `exports` (e.g., `./<name>": "./dist/configs/<name>.js"`).
4. Add the plugin dependency to `package.json`:
   - If optional (framework-specific): add to `peerDependencies` + `peerDependenciesMeta` (optional: true) + `devDependencies`.
   - If always needed: add to `dependencies`.
5. Document the entrypoint, its peer, and usage in `README.md` and this file.

## Adding a New Rule

1. Create `src/rules/<rule-name>.ts` implementing `Rule.RuleModule`.
2. Export it from `src/index.ts` under `rules`.
3. Add tests in `tests/<rule-name>.test.ts`.
4. Document the rule in `README.md` and this file.
