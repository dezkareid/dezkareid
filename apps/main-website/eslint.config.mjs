import tsBase from '@dezkareid/eslint-config-ts-base';
import webPlugin from '@dezkareid/eslint-plugin-web';

export default [
  {
    ignores: ['dist/', 'node_modules/', '.astro/']
  },
  ...tsBase,
  ...webPlugin.configs.astro,
];
