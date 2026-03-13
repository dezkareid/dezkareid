import tsBase from '@dezkareid/eslint-config-ts-base';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', '.turbo/', 'webpack/']
  },
  ...tsBase,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: pluginReact
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-undef': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
