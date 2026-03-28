import type { Linter, Rule } from 'eslint';
import { createRequire } from 'node:module';
import noJquery from './rules/no-jquery.js';
import noAllowedPackages from './rules/no-allowed-packages.js';
import typescriptConfig from './configs/typescript.js';
import reactConfig from './configs/react.js';
import nextConfig from './configs/next.js';
import cssConfig from './configs/css.js';
import astroConfig from './configs/astro.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json') as { version: string };

export const meta = {
  name: '@dezkareid/eslint-plugin-web',
  version,
};

export const rules = {
  'no-jquery': noJquery,
  'no-allowed-packages': noAllowedPackages,
};

export const configs: Record<string, Linter.Config[]> = {
  typescript: typescriptConfig,
  react: reactConfig,
  next: nextConfig,
  css: cssConfig,
  astro: astroConfig,
};

const plugin: {
  meta: typeof meta;
  rules: Record<string, Rule.RuleModule>;
  configs: Record<string, Linter.Config[]>;
} = { meta, rules, configs };

export default plugin;
