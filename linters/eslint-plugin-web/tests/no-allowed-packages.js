const { RuleTester } = require("eslint");
const rule = require("../src/rules/no-allowed-packages");

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
});

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
