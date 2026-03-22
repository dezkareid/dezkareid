# @dezkareid/eslint-plugin-web

Custom ESLint plugin with shared configurations and rules for web projects in the `dezkareid` monorepo.

## Installation

```bash
pnpm add -D @dezkareid/eslint-plugin-web
```

## Usage

Import the plugin and spread the desired config(s) into your `eslint.config.mjs`:

```js
import web from '@dezkareid/eslint-plugin-web';

export default [
  ...web.configs.typescript,
  ...web.configs.react,
  ...web.configs.css,
];
```

## Configs

### `typescript`

Extends `@dezkareid/eslint-config-ts-base`. Applies TypeScript-aware linting rules using `typescript-eslint`.

```js
import web from '@dezkareid/eslint-plugin-web';

export default [
  ...web.configs.typescript,
];
```

### `react`

Linting for React projects. Includes:
- [`@eslint-react/eslint-plugin`](https://github.com/Rel1cx/eslint-react) recommended rules
- [`eslint-plugin-unicorn`](https://github.com/sindresorhus/eslint-plugin-unicorn) recommended rules
- Override to allow `Ref`/`ref` abbreviations (conflicts with `@eslint-react/naming-convention/ref-name`)

```js
import web from '@dezkareid/eslint-plugin-web';

export default [
  ...web.configs.react,
];
```

### `css`

Linting for CSS files using [`@eslint/css`](https://github.com/eslint/css). Targets `**/*.css` files.

| Rule | Severity | Description |
|------|----------|-------------|
| `css/no-duplicate-imports` | error | Disallows duplicate `@import` statements |
| `css/no-empty-blocks` | error | Disallows empty rule blocks |
| `css/no-invalid-at-rules` | error | Disallows unknown at-rules |
| `css/no-invalid-properties` | error | Disallows invalid CSS property/value pairs |
| `css/use-baseline` | warn | Warns when using CSS features not yet **widely** available across browsers |

```js
import web from '@dezkareid/eslint-plugin-web';

export default [
  ...web.configs.css,
];
```

### `astro`

Linting for Astro projects. Includes:
- [`eslint-plugin-astro`](https://github.com/ota-meshi/eslint-plugin-astro) recommended rules
- [`eslint-plugin-unicorn`](https://github.com/sindresorhus/eslint-plugin-unicorn) recommended rules
- Overrides for Astro filename conventions (PascalCase and kebab-case)
- Suppresses `@typescript-eslint/no-unused-vars` for `Properties` (implicit via `Astro.props`)

```js
import web from '@dezkareid/eslint-plugin-web';

export default [
  ...web.configs.astro,
];
```

## Rules

### `web/no-jquery`

Disallows importing `jquery`. Reports an error on any `import` from `'jquery'`.

```js
// eslint.config.mjs
import web from '@dezkareid/eslint-plugin-web';

export default [
  {
    plugins: { web },
    rules: {
      'web/no-jquery': 'error',
    },
  },
];
```

### `web/no-allowed-packages`

Disallows importing from a configurable list of forbidden packages.

**Options**: array of package name strings to forbid.

```js
// eslint.config.mjs
import web from '@dezkareid/eslint-plugin-web';

export default [
  {
    plugins: { web },
    rules: {
      'web/no-allowed-packages': ['error', 'lodash', 'moment'],
    },
  },
];
```

## Requirements

- Node >= 22
- ESLint `9.39.2` (peer dependency)
