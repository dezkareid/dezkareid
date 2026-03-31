import type { Linter } from 'eslint';
import reactPlugin from '@eslint-react/eslint-plugin';
import pluginUnicorn from 'eslint-plugin-unicorn';
import stylisticConfig from './stylistic.js';

const config: Linter.Config[] = [
  ...stylisticConfig,
  reactPlugin.configs.recommended as Linter.Config,
  pluginUnicorn.configs.recommended as Linter.Config,
  {
    // Allow 'Ref' suffix to satisfy @eslint-react/naming-convention/ref-name,
    // which conflicts with unicorn/prevent-abbreviations treating 'Ref' as an abbreviation.
    rules: {
      'unicorn/prevent-abbreviations': ['error', {
        allowList: { Ref: true, ref: true },
      }],
      // React hooks like useActionState/useReducer require explicit undefined as initialState
      // because the argument is positionally required by TypeScript. Unicorn's auto-fixer
      // incorrectly removes it. checkArguments:false disables the fixer only for call arguments.
      'unicorn/no-useless-undefined': ['error', { checkArguments: false }],
    },
  } as Linter.Config,
];

export default config;
