---
phase: 02-core-web-rules
plan: 01
subsystem: Infrastructure
tags: [cjs, setup]
requires: []
provides: [cjs-setup]
affects: [build-system]
tech-stack:
  added:
    - "@html-eslint/parser"
    - "@html-eslint/eslint-plugin"
key-files:
  modified:
    - tsconfig.json
    - package.json
    - src/index.ts
decisions:
  - Reverted to CommonJS to ensure compatibility with ESLint 9 plugins and @eslint/css.
duration: 10min
completed: 2026-02-09
---

# Phase 02 Plan 01: Infrastructure Summary

**Reverted project to CommonJS and updated dependencies for ESLint 9 compatibility.**

## Accomplishments
- Updated `tsconfig.json` to target `commonjs` module system.
- Added `@html-eslint/parser` and `@html-eslint/eslint-plugin` to `package.json`.
- Updated `src/index.ts` entry point to use `module.exports` for CJS compatibility.

## Task Commits
1. **Task 1: Update tsconfig.json for CJS** - `7805303`
2. **Task 2: Update package.json and Entry Point** - `6518793`

## Self-Check: PASSED
- `tsconfig.json` correctly configured for CJS.
- `package.json` includes required parsers.
- `src/index.ts` uses `module.exports`.
