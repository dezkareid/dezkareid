import tsBase from '@dezkareid/eslint-config-ts-base';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...tsBase,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'working-on/**', 'done/**'],
  },
];
