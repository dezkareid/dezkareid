import type { Linter } from 'eslint';
import nextPlugin from '@next/eslint-plugin-next';
import reactConfig from './react.js';

const config: Linter.Config[] = [
  ...reactConfig,
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    // generateStaticParams is a Next.js App Router reserved export name that cannot be renamed.
    rules: {
      'unicorn/prevent-abbreviations': ['error', {
        allowList: { Ref: true, ref: true, generateStaticParams: true },
      }],
      // Next.js App Router uses PascalCase for component files and lowercase for route files.
      'unicorn/filename-case': ['error', {
        cases: {
          kebabCase: true,
          pascalCase: true,
        },
      }],
    },
  },
  {
    files: ['**/use*.ts', '**/use*.tsx'],
    rules: {
      'unicorn/filename-case': ['error', {
        cases: {
          camelCase: true,
          pascalCase: true,
          kebabCase: true,
        },
      }],
    },
  },
  {
    files: ['middleware.ts', 'proxy.ts'],
    rules: {
      'unicorn/prefer-string-raw': 'off',
    },
  },
];

export default config;
