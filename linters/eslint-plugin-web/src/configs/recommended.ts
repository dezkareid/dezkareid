import css from "@eslint/css";
import * as htmlParser from "@html-eslint/parser";
import htmlPlugin from "@html-eslint/eslint-plugin";

const recommended = [
  {
    name: "web/recommended-html",
    files: ["**/*.html"],
    plugins: {
      html: htmlPlugin,
    },
    languageOptions: {
      parser: htmlParser,
    },
    rules: {
      "html/no-obsolete-tags": "warn",
      "html/require-img-alt": "warn",
      "html/no-inline-styles": "warn",
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
