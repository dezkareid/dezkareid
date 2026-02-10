import css from "@eslint/css";
import * as htmlParser from "@html-eslint/parser";
import htmlPlugin from "@html-eslint/eslint-plugin";

const strict = [
  {
    name: "web/strict-html",
    files: ["**/*.html"],
    plugins: {
      html: htmlPlugin,
    },
    languageOptions: {
      parser: htmlParser,
    },
    rules: {
      "html/no-obsolete-tags": "error",
      "html/require-img-alt": "error",
      "html/no-inline-styles": "error",
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
      ...css.configs.recommended.rules,
    },
  }
];

export default strict;
