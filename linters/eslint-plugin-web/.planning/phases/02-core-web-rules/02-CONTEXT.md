# Phase 2 Context: Core Web Rules Implementation (Final)

## 1. System Architecture Decisions
- **Module System:** The package MUST NOT be a module. Output must be **CommonJS (CJS)**.
- **Entry Point:** The `main` attribute in `package.json` MUST point to `dist/index.js`.
- **Build Tooling:** Standard `tsc` build. No `prepublishOnly` script required for now.
- **TypeScript Config:** Revert `module` and `moduleResolution` in `tsconfig.json` to support CJS output.
- **Dependencies:** Pin `@html-eslint/eslint-plugin` and `@html-eslint/parser` to their recent stable versions.

## 2. Rule Implementations
- **NO NEW RULES:** This phase focuses on **configurations only**.
- **Severity Defaults:** 
  - `recommended` preset: Rules from external plugins set to `"warn"`.
  - `strict` preset: Rules from external plugins set to `"error"`.

## 3. Bundled Configurations
- **Preset Name:** `recommended`.
- **Export Format:** Use a **flat object** for configuration exports.
- **Integration:** 
  - Use `@html-eslint/eslint-plugin` for HTML rules.
  - Include rules from `@eslint/css` baseline config.
- **File Patterns:** Define default glob patterns for HTML and CSS files within the presets.

## 4. Deferred Ideas
- Auto-fixing logic.
- Custom rule implementations.
- Framework-specific presets.
