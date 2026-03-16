# @dezkareid/types

A collection of types for APIs, structured data and shared types

## Installation

```bash
npm install @dezkareid/types
```

## Usage

### Speculation Rules API

You can use the `SpeculationRules` type to define your speculation rules in a type-safe way.

```typescript
import { SpeculationRules } from '@dezkareid/types';

const rules: SpeculationRules = {
  prefetch: [
    {
      source: 'list',
      urls: ['/about', '/contact'],
      eagerness: 'eager'
    }
  ],
  prerender: [
    {
      source: 'document',
      where: {
        href_matches: '/blog/*',
        not: { href_matches: '/blog/admin/*' }
      },
      eagerness: 'moderate'
    }
  ]
};

// Use this to generate your <script type="speculationrules"> content
const scriptContent = JSON.stringify(rules);
```

## License

ISC
