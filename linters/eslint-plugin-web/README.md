# @dezkareid/eslint-plugin-web

Custom ESLint plugin with shared configurations and rules for web projects in the `dezkareid` monorepo.

## Installation

```bash
pnpm add -D @dezkareid/eslint-plugin-web
```

## Usage

Each config is available as a **named entrypoint**. Import only the config(s) you need — this way you only need to install the peer dependencies relevant to your project.

```js
// eslint.config.mjs
import tsBase from '@dezkareid/eslint-config-ts-base';
import reactConfig from '@dezkareid/eslint-plugin-web/react';

export default [
  ...tsBase,
  ...reactConfig,
];
```

## Configs

### `typescript`

**Entrypoint**: `@dezkareid/eslint-plugin-web/typescript`

Extends `@dezkareid/eslint-config-ts-base`. Applies TypeScript-aware linting rules using `typescript-eslint`.

**Peer dependencies**: none beyond `eslint`.

```js
import typescriptConfig from '@dezkareid/eslint-plugin-web/typescript';

export default [
  ...typescriptConfig,
];
```

---

### `react`

**Entrypoint**: `@dezkareid/eslint-plugin-web/react`

Linting for React projects. Includes:
- [`@eslint-react/eslint-plugin`](https://github.com/Rel1cx/eslint-react) recommended rules
- [`eslint-plugin-unicorn`](https://github.com/sindresorhus/eslint-plugin-unicorn) recommended rules
- Override to allow `Ref`/`ref` abbreviations (conflicts with `@eslint-react/naming-convention/ref-name`)

**Required peer**:
```bash
pnpm add -D @eslint-react/eslint-plugin
```

```js
import reactConfig from '@dezkareid/eslint-plugin-web/react';

export default [
  ...reactConfig,
];
```

---

### `next`

**Entrypoint**: `@dezkareid/eslint-plugin-web/next`

Linting for Next.js projects. Extends [`react`](#react) and includes:
- [`@next/eslint-plugin-next`](https://github.com/vercel/next.js/tree/canary/packages/next-eslint-plugin-next) recommended and `core-web-vitals` rules
- Override for `unicorn/prefer-string-raw`: disabled for `middleware.ts` and `proxy.ts` (common Next.js middleware filenames)

**Required peer**:
```bash
pnpm add -D @next/eslint-plugin-next @eslint-react/eslint-plugin
```

```js
import nextConfig from '@dezkareid/eslint-plugin-web/next';

export default [
  ...nextConfig,
];
```

---

### `astro`

**Entrypoint**: `@dezkareid/eslint-plugin-web/astro`

Linting for Astro projects. Includes:
- [`eslint-plugin-astro`](https://github.com/ota-meshi/eslint-plugin-astro) recommended rules
- [`eslint-plugin-unicorn`](https://github.com/sindresorhus/eslint-plugin-unicorn) recommended rules
- Overrides for Astro filename conventions (PascalCase and kebab-case)
- Suppresses `@typescript-eslint/no-unused-vars` for `Properties` (implicit via `Astro.props`)

**Required peer**:
```bash
pnpm add -D eslint-plugin-astro
```

```js
import astroConfig from '@dezkareid/eslint-plugin-web/astro';

export default [
  ...astroConfig,
];
```

---

### `css`

**Entrypoint**: `@dezkareid/eslint-plugin-web/css`

Linting for CSS files using [`@eslint/css`](https://github.com/eslint/css). Targets `**/*.css` files.

**Peer dependencies**: none beyond `eslint` (`@eslint/css` is bundled).

| Rule | Severity | Description |
|------|----------|-------------|
| `css/no-duplicate-imports` | error | Disallows duplicate `@import` statements |
| `css/no-empty-blocks` | error | Disallows empty rule blocks |
| `css/no-invalid-at-rules` | error | Disallows unknown at-rules |
| `css/no-invalid-properties` | error | Disallows invalid CSS property/value pairs |
| `css/use-baseline` | warn | Warns when using CSS features not yet **widely** available across browsers |

```js
import cssConfig from '@dezkareid/eslint-plugin-web/css';

export default [
  ...cssConfig,
];
```

---

## Rules

The plugin also exposes custom rules. To use them, import the full plugin:

### `web/no-jquery`

Disallows importing `jquery`. Reports an error on any `import` from `'jquery'`.

```js
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

---

## Requirements

- Node >= 22
- ESLint `>=9.39.2` (peer dependency)
