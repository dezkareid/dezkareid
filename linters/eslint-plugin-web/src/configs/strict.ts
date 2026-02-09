import css from "@eslint/css";

const strict = {
  name: "web/strict",
  files: ["**/*.html", "**/*.jsx", "**/*.tsx"],
  plugins: {
    css
  },
  rules: {
    "web/no-deprecated-html": "error",
    "web/require-img-alt": "error",
    "web/no-inline-event-handlers": "error",
    "web/no-jquery": "error",
    "web/no-allowed-packages": "error",
    ...css.configs.baseline.rules,
  },
};

export default strict;
