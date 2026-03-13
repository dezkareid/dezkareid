import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import noJquery from '../src/rules/no-jquery.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

describe('no-jquery', () => {
  it('passes valid cases and fails invalid cases', () => {
    ruleTester.run('no-jquery', noJquery, {
      valid: [
        {
          code: "import jquery from 'jqueryx';",
        },
      ],
      invalid: [
        {
          code: "import jquery from 'jquery';",
          errors: [
            {
              message: 'jquery should not be used ever again',
              type: 'ImportDeclaration',
            },
          ],
        },
      ],
    });
  });
});
