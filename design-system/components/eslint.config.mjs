import tsBase from '@dezkareid/eslint-config-ts-base';
import webPlugin from '@dezkareid/eslint-plugin-web';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', '.turbo/', '**/*.d.ts'],
  },
  ...tsBase,
  ...webPlugin.configs.react,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
