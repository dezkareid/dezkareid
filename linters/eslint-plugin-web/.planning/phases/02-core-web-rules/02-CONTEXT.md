# Phase 2 Context: Core Web Rules Implementation

## 1. System Architecture Decisions
- **Module System:** The package MUST NOT be a module. Output must be **CommonJS (CJS)**.
- **TypeScript Config:** Revert `module` and `moduleResolution` in `tsconfig.json` to support CJS output (e.g., `Node10` or `CommonJS`).
- **Dependencies:** Explicitly recommend/require `@html-eslint/parser` for `.html` file support.

## 2. Rule Implementations
- **Severity Defaults:** 
  - `recommended` preset: All rules set to `"warn"`.
  - `strict` preset: All rules set to `"error"`.
- **Coverage Scope:**
  - Files: `.html`, `.jsx`, `.tsx`.
  - Targeted Elements: Standard HTML tags only. Custom JSX components are EXCLUDED for this phase.
- **Specific Rule Logic:**
  - **Alt Text:** `alt=""` and `aria-hidden="true"` MUST still trigger a warning. Accessibility must be explicit.
  - **Deprecated Elements:** Focus on modern web deprecations (`<center>`, `<font>`, etc.).

## 3. Bundled Configurations
- **Preset Name:** `recommended`.
- **Integration:** Include rules from `@eslint/css` baseline config within our `recommended` preset.
- **File Patterns:** Define default glob patterns for HTML and JSX files within the presets so users get "out of the box" support.

## 4. Deferred Ideas
- Auto-fixing logic for all rules.
- Support for custom JSX image components (e.g., `<NextImage>`).
- Framework-specific presets (Vue, Svelte).
