import css from "@eslint/css";
import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: ["dist/**", ".gemini/**", "inspect-css.js"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["src/**/*.ts", "tests/**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-require-imports": "off",
            "no-undef": "off", // TypeScript handles this better
        }
    },
    {
        files: ["**/*.css"],
        plugins: {
            css
        },
        language: "css/css",
        rules: {
            ...css.configs.recommended.rules,
        },
    },
];
