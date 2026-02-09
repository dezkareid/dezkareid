# Phase 02: Core Web Rules Implementation - Research

**Researched:** 2026-02-09
**Domain:** ESLint 9 Plugin Development (CJS, HTML, JSX)
**Confidence:** HIGH

## Summary

This research establishes the technical foundation for refactoring the `@dezkareid/eslint-plugin-web` to CommonJS while implementing core web accessibility and best practice rules. We have identified the specific AST selectors for both raw HTML (using `@html-eslint/parser`) and JSX (using the default ESLint parser).

**Primary recommendation:** Use `module.exports` for the plugin entry point and presets to ensure CJS compatibility, and utilize `no-restricted-syntax` style AST selectors internally to share logic where possible between HTML and JSX rules.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Module System:** MUST NOT be a module. Output must be **CommonJS (CJS)**.
- **TypeScript Config:** Revert `module` and `moduleResolution` to support CJS output.
- **Dependencies:** Require `@html-eslint/parser` for `.html` support.
- **Severity:** `recommended` = warn, `strict` = error.
- **Coverage:** `.html`, `.jsx`, `.tsx`. Standard tags only.
- **Rule Nuance:** `alt=""` MUST trigger a warning.
- **Presets:** Include `@eslint/css` baseline. Define default glob patterns.

### Claude's Discretion
- Technical implementation of rule logic.
- Specific deprecated elements to target.

### Deferred Ideas (OUT OF SCOPE)
- Auto-fixing logic.
- Custom JSX components (e.g., `<NextImage>`).
- Framework-specific presets (Vue, Svelte).
</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `eslint` | ^9.0.0 | Linter core | Flat config support |
| `typescript` | ^5.0.0 | Rule development | Type safety |
| `@html-eslint/parser` | latest | HTML parsing | AST support for `.html` |
| `@eslint/css` | latest | CSS integration | Baseline support |

**Installation:**
```bash
pnpm add -D @html-eslint/parser @html-eslint/eslint-plugin
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── rules/
│   ├── no-deprecated-html.ts
│   ├── require-img-alt.ts
│   └── no-inline-event-handlers.ts
├── configs/
│   ├── recommended.ts
│   └── strict.ts
└── index.ts
```

### Pattern 1: CommonJS Export (ESLint 9)
**What:** Exporting the plugin object using `module.exports`.
**Example:**
```typescript
// src/index.ts
import recommended from './configs/recommended';
import noJquery from './rules/no-jquery';

const plugin = {
  configs: { recommended },
  rules: { 'no-jquery': noJquery }
};

module.exports = plugin; // Critical for CJS output
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTML Parsing | Custom Regex | `@html-eslint/parser` | Handles edge cases, provides real AST |
| CSS Rules | Custom CSS Parser | `@eslint/css` | Official ESLint CSS support |

## Common Pitfalls

### Pitfall 1: Dual AST Handling
**What goes wrong:** Rules written for JSX often fail on raw HTML because the AST node names differ (e.g., `JSXOpeningElement` vs `Tag`).
**How to avoid:** Use a "visitor map" strategy where the core logic is a function that accepts properties (tag name, attributes) regardless of the AST source.

### Pitfall 2: `module: NodeNext` in `tsconfig`
**What goes wrong:** `NodeNext` often forces `.js` extensions and ESM behavior.
**How to avoid:** Set `"module": "commonjs"` and `"moduleResolution": "node"` in `tsconfig.json`.

## Code Examples

### AST Selector: Alt Text (JSX)
```javascript
// Selector for img without alt
"JSXOpeningElement[name.name='img']:not([attributes.some(attr => attr.name.name === 'alt')])"
```

### AST Selector: Alt Text (HTML)
```javascript
// Using @html-eslint/parser
"Tag[name='img']:not([attributes.some(attr => attr.name === 'alt')])"
```

### AST Selector: Inline Event Handlers (JSX)
```javascript
"JSXAttribute[name.name=/^on[A-Z]/]"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `.eslintrc` | `eslint.config.js` | ESLint 9 | Flat config is object-based |
| `eslint-plugin-html` | `@html-eslint/parser` | 2023+ | Better AST-based linting |

## Open Questions

1. **How to bundle @eslint/css configs?**
   - **What we know:** `@eslint/css` provides a `baseline` config.
   - **What's unclear:** Can we directly spread `css.configs.baseline.rules` into our exported config object?
   - **Recommendation:** Yes, since flat config is just objects, we can merge them in `src/configs/recommended.ts`.

## Sources

### Primary (HIGH confidence)
- ESLint Official Docs - Flat Config Plugin Migration
- `@html-eslint/parser` GitHub README
- `typescript-eslint` CJS Configuration Guide

## Metadata
**Confidence breakdown:**
- Standard stack: HIGH
- Architecture: HIGH
- Pitfalls: MEDIUM (AST differences need careful implementation)

**Research date:** 2026-02-09
**Valid until:** 2026-03-09
