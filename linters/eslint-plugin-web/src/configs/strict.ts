import css from "@eslint/css";
import * as htmlParser from "@html-eslint/parser";

const strict = [
  {
    name: "web/strict-html",
    files: ["**/*.html"],
    languageOptions: {
      parser: htmlParser,
    },
    rules: {
      "web/no-deprecated-html": "error",
      "web/require-img-alt": "error",
      "web/no-inline-event-handlers": "error",
    },
  },
  {
    name: "web/strict-jsx",
    files: ["**/*.jsx", "**/*.tsx"],
    rules: {
      "web/no-deprecated-html": "error",
      "web/require-img-alt": "error",
      "web/no-inline-event-handlers": "error",
      "web/no-jquery": "error",
      "web/no-allowed-packages": "error",
    },
  },
  {
    name: "web/strict-css",
    files: ["**/*.css"],
    plugins: {
      css
    },
    language: "css/css",
    rules: {
      ...css.configs.baseline.rules,
    },
  }
];

export default strict;