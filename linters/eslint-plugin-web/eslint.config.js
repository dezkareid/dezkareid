import css from "@eslint/css";

export default [
    {
        files: ["**/*.css"],
        plugins: {
            css
        },
        language: "css/css",
        rules: {
            ...css.configs.baseline.rules,
        },
    },
];
