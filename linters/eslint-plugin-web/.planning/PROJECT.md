# ESLint Plugin Web

## What This Is
An ESLint plugin providing modern web-related linting rules and configurations, focusing on accessibility, performance, and best practices.

## Current State (v1.0)
- Infrastructure migrated to ESLint 9 and TypeScript 5.9.
- Testing suite using Vitest.
- Integrated HTML and CSS linting via `@html-eslint` and `@eslint/css`.
- Shipped `recommended` and `strict` configuration presets.

## Next Milestone Goals (v1.1)
- Add rules for performance optimization (Prefetch/Preconnect).
- Security hardening (CSP alignment).
- Third-party script loading best practices.

## Key Decisions
- **CommonJS Output:** Locked to ensure compatibility with the ESLint plugin ecosystem.
- **Flat Config:** Fully adopted ESLint 9's new configuration system.

---
*Last updated: 2026-02-10 after v1.0 milestone*
