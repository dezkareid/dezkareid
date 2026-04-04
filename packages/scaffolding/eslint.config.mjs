import webConfigs from '@dezkareid/eslint-plugin-web/typescript';

export default [
  ...webConfigs,
  {
    ignores: ['dist/**', 'node_modules/**', 'test-app/**', 'e2e-test-project/**'],
  },
];
