import css from "@eslint/css";
import * as htmlParser from "@html-eslint/parser";

const recommended = [
  {
    name: "web/recommended-html",
    files: ["**/*.html"],
    languageOptions: {
      parser: htmlParser,
    },
    rules: {
      "web/no-deprecated-html": "warn",
      "web/require-img-alt": "warn",
      "web/no-inline-event-handlers": "warn",
    },
  },
  {
    name: "web/recommended-jsx",
    files: ["**/*.jsx", "**/*.tsx"],
    rules: {
      "web/no-deprecated-html": "warn",
      "web/require-img-alt": "warn",
      "web/no-inline-event-handlers": "warn",
      "web/no-jquery": "warn",
      "web/no-allowed-packages": "warn",
    },
  },
  {
    name: "web/recommended-css",
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

export default recommended;