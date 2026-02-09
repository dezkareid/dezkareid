---
phase: 02-core-web-rules
plan: 02
subsystem: Rule Implementation
tags: [rules, html, jsx]
requires: [cjs-setup]
provides: [core-rules]
affects: [rules]
tech-stack:
  added: []
key-files:
  created:
    - src/rules/no-deprecated-html.ts
    - src/rules/require-img-alt.ts
    - src/rules/no-inline-event-handlers.ts
  modified:
    - src/index.ts
decisions:
  - Implemented dual AST support (HTML and JSX) for all rules.
  - Warn on `alt=""` per accessibility requirements.
duration: 15min
completed: 2026-02-09
---

# Phase 02 Plan 02: Rule Implementation Summary

**Implemented core web accessibility and best practice rules for HTML and JSX.**

## Accomplishments
- Implemented `no-deprecated-html` rule for both raw HTML and JSX elements.
- Implemented `require-img-alt` rule with strict accessibility warning for empty alt attributes.
- Implemented `no-inline-event-handlers` rule targeting standard `on*` attributes.
- Integrated all new rules into the plugin's entry point.

## Task Commits
- `feat(02-02): implement core web rules` (Manual execution)

## Self-Check: PASSED
- All 3 rule files exist with TypeScript implementation.
- `index.ts` correctly exports all 5 rules.
