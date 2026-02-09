import { RuleTester } from "eslint";
import rule from "../src/rules/no-allowed-packages";
import { describe, it } from "vitest";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
});

describe("no-allowed-packages", () => {
  it("should report forbidden package imports", () => {
    ruleTester.run("no-allowed-packages", rule, {
      valid: [
        {
          code: "import react from 'react';",
        },
        {
          code: "import vue from 'vue';",
          options: []
        },
      ],
      invalid: [
        {
          code: "import moment from 'moment';",
          options: ["moment"],
          errors: [
            {
              message: "moment should not be used ever again",
              type: "ImportDeclaration",
            },
          ],
        },
        {
          code: "import moment from 'moment'; ",
          options: ["bower", "moment", "jquery"],
          errors: [
            {
              message: "moment should not be used ever again",
              type: "ImportDeclaration",
            },
          ],
        },
      ],
    });
  });
});
