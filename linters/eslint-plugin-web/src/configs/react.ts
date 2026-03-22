import type { Linter } from 'eslint';
import reactPlugin from '@eslint-react/eslint-plugin';
import pluginUnicorn from 'eslint-plugin-unicorn';

const config: Linter.Config[] = [
  reactPlugin.configs.recommended as Linter.Config,
  pluginUnicorn.configs.recommended as Linter.Config,
  {
    // Allow 'Ref' suffix to satisfy @eslint-react/naming-convention/ref-name,
    // which conflicts with unicorn/prevent-abbreviations treating 'Ref' as an abbreviation.
    rules: {
      'unicorn/prevent-abbreviations': ['error', {
        allowList: { Ref: true, ref: true },
      }],
    },
  } as Linter.Config,
];

export default config;
