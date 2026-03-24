import tsBase from '@dezkareid/eslint-config-ts-base';
import reactConfig from '@dezkareid/eslint-plugin-web/react';

export default [
  {
    ignores: ['dist/', 'node_modules/', '.next/', 'next-env.d.ts'],
  },
  ...tsBase,
  ...reactConfig,
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
