import tsBase from '@dezkareid/eslint-config-ts-base';
import pluginAstro from 'eslint-plugin-astro';

export default [
  {
    ignores: ['dist/', 'node_modules/', '.astro/']
  },
  ...tsBase,
  ...pluginAstro.configs.recommended,
];
