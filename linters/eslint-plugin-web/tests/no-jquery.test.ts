import { RuleTester } from "eslint";
import rule from "../src/rules/no-jquery";
import { describe, it } from "vitest";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
});

describe("no-jquery", () => {
  it("should report jquery imports", () => {
    ruleTester.run("no-jquery", rule, {
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
              message: "jquery should not be used ever again",
              type: "ImportDeclaration",
            },
          ],
        },
      ],
    });
  });
});
