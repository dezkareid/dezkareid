import type { Linter } from 'eslint';
import css from '@eslint/css';

const config: Linter.Config[] = [
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    rules: {
      'css/no-duplicate-imports': 'error',
      'css/no-empty-blocks': 'error',
      'css/no-invalid-at-rules': 'error',
      'css/no-invalid-properties': 'error',
      'css/use-baseline': ['warn', { available: 'widely' }],
    },
  } as unknown as Linter.Config,
];

export default config;
