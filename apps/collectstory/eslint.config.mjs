import tsBase from '@dezkareid/eslint-config-ts-base';
import nextConfig from '@dezkareid/eslint-plugin-web/next';

export default [
  {
    ignores: ['dist/', 'node_modules/', '.next/', 'next-env.d.ts'],
  },
  ...tsBase,
  ...nextConfig,
  {
    rules: {
      // Next.js App Router uses PascalCase for component files and lowercase for route files.
      // Allow both conventions.
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
    },
  },
];
