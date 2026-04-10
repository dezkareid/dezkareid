import tsBase from '@dezkareid/eslint-config-ts-base';
import nextConfig from '@dezkareid/eslint-plugin-web/next';

export default [
  {
    ignores: ['dist/', 'node_modules/', '.next/', 'next-env.d.ts'],
  },
  ...tsBase,
  ...nextConfig,
];
