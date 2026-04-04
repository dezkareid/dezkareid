import webConfigs from '@dezkareid/eslint-plugin-web/typescript';

export default [
  ...webConfigs,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
