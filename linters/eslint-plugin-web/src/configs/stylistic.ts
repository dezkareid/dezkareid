import type { Linter } from 'eslint';
import stylistic from '@stylistic/eslint-plugin';

const config: Linter.Config[] = [
  stylistic.configs.customize({
    semi: true,
    quotes: 'single',
    indent: 2,
    jsx: true,
  }),
];

export default config;
