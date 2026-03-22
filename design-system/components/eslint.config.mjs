import tsBase from '@dezkareid/eslint-config-ts-base';
import reactConfig from '@dezkareid/eslint-plugin-web/react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', '.turbo/', '**/*.d.ts'],
  },
  ...tsBase,
  ...reactConfig,
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
