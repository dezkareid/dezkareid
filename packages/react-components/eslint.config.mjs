import tsBase from '@dezkareid/eslint-config-ts-base';
import webPlugin from '@dezkareid/eslint-plugin-web';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', '.turbo/', 'webpack/', '**/*.d.ts']
  },
  ...tsBase,
  ...webPlugin.configs.react,
];
