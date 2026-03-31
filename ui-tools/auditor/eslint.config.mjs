import tsBase from '@dezkareid/eslint-config-ts-base';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'server/src/generated/', 'server/dist/'],
  },
  ...tsBase,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    }
  }
];
