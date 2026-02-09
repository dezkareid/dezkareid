import css from "@eslint/css";

const recommended = {
  name: "web/recommended",
  files: ["**/*.html", "**/*.jsx", "**/*.tsx"],
  plugins: {
    css
  },
  languageOptions: {
    // Basic language options
  },
  rules: {
    "web/no-deprecated-html": "warn",
    "web/require-img-alt": "warn",
    "web/no-inline-event-handlers": "warn",
    "web/no-jquery": "warn",
    "web/no-allowed-packages": "warn",
    ...css.configs.baseline.rules,
  },
};

export default recommended;
