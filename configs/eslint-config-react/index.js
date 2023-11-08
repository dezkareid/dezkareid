{
  "parser": "@babel/eslint-parser",
  "extends": ["airbnb", "airbnb/hooks", "prettier"],
  "env": {
    "node": true,
    "jest": true,
    "browser": true
  },
  "plugins": ["react", "react-hooks", "prettier"],
  "parserOptions": {
    "sourceType": "module",
    "requireConfigFile": false,
    "presets": ["@babel/preset-env", "@babel/preset-react"]
  },
  "rules": {
    "complexity": ["error", 12],
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "prettier/prettier": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  }
}