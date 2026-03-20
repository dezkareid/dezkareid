import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import noAllowedPackages from '../src/rules/no-allowed-packages.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

describe('no-allowed-packages', () => {
  it('passes valid cases and fails invalid cases', () => {
    ruleTester.run('no-allowed-packages', noAllowedPackages, {
      valid: [
        {
          code: "import react from 'react';",
        },
        {
          code: "import vue from 'vue';",
          options: [],
        },
      ],
      invalid: [
        {
          code: "import moment from 'moment';",
          options: ['moment'],
          errors: [
            {
              message: 'moment should not be used ever again',
              type: 'ImportDeclaration',
            },
          ],
        },
        {
          code: "import moment from 'moment'; ",
          options: ['bower', 'moment', 'jquery'],
          errors: [
            {
              message: 'moment should not be used ever again',
              type: 'ImportDeclaration',
            },
          ],
        },
      ],
    });
  });
});
