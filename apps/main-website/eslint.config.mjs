import tsBase from '@dezkareid/eslint-config-ts-base';
import astroConfig from '@dezkareid/eslint-plugin-web/astro';

export default [
  {
    ignores: ['dist/', 'node_modules/', '.astro/']
  },
  ...tsBase,
  ...astroConfig,
];
