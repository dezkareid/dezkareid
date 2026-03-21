# @dezkareid/eslint-config-ts-base

Shared eslint configuration for typescript projects

## Installation

```bash
npm install @dezkareid/eslint-config-ts-base
```

## Usage

Add the configuration to your `eslint.config.mjs` (or `eslint.config.js` with `"type": "module"`):

```javascript
import baseConfig from '@dezkareid/eslint-config-ts-base';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Your project-specific overrides
    },
  },
];
```

## License

ISC
