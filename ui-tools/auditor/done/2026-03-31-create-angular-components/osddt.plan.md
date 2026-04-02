# Implementation Plan: Angular Support for Design System Components

## Architecture Overview
The Angular implementation will follow the official **Angular Package Format (APF)**. Unlike the Astro and Vue "Source Export" pattern, the Angular components will be pre-compiled into a portable library. This ensures maximum compatibility with Angular's AOT compiler and prevents build-time issues in consumer applications.

### Key Technical Decisions
- **Framework**: Angular 21.
- **Architecture**: Standalone Components.
- **Reactivity**: Signals-based API (`input`, `output`, `computed`).
- **Change Detection**: `OnPush` strategy.
- **Styling**: `ViewEncapsulation.None` to leverage the global BEM-based CSS.
- **Build Tool**: `ng-packagr` to handle pre-compilation and metadata generation (metadata.json, d.ts, etc.).
- **Testing**: Vitest with `@analogjs/vitest-angular` (or standard Angular testing utilities) to ensure 100% coverage of core interactions.
- **Package Export**: Exported via `@dezkareid/components/angular` pointing to the `dist/angular` output.

## Implementation Phases

### Phase 1: Infrastructure & Scaffolding
- **Goal**: Prepare the library for Angular compilation and testing.
- **Tasks**:
  - Add `@angular/core`, `@angular/common`, and `@angular/compiler` to `peerDependencies`.
  - Install `ng-packagr` and `tslib` as `devDependencies`.
  - Configure `ng-package.json` for the `@dezkareid/components/angular` subpath.
  - Setup Vitest for Angular testing in `vitest.config.ts`.

### Phase 2: Component Implementation & Unit Testing
- **Goal**: Port components and verify behavior with tests.
- **Tasks**:
  - **Button**: Implement `ButtonComponent` with signals. Add tests for variants, sizes, and click emission.
  - **Tag**: Implement `TagComponent`. Add tests for slot content and variant classes.
  - **Card**: Implement `CardComponent`. Add tests for elevation states.
  - **ThemeToggle**: Implement `ThemeToggleComponent`. Add tests for theme switching and localStorage interaction.

### Phase 3: Build & Export
- **Goal**: Generate the compiled package and update exports.
- **Tasks**:
  - Update `scripts` in `package.json` to include an Angular build step (e.g., `pnpm build:angular`).
  - Update `package.json` `exports` to point `./angular` to the `dist/angular/` directory.
  - Integrate Angular build into the main `turbo.json` pipeline.

### Phase 4: Validation
- **Goal**: Verify the compiled package in the Auditor app.
- **Tasks**:
  - Consume the compiled `@dezkareid/components/angular` in `ui-tools/auditor`.
  - Verify that no source-compilation errors occur and that styles are correctly applied.

## Technical Dependencies
- `@angular/core` (v21.0.0+)
- `ng-packagr` (for APF compilation)
- `@analogjs/vitest-angular` (for testing)
- `tslib`

## Risks & Mitigations
- **Risk**: Angular version mismatch between the library and the consumer.
- **Mitigation**: Use wide `peerDependencies` and follow the standard APF to ensure compatibility.
- **Risk**: CSS collision with Angular's default styles.
- **Mitigation**: Use `ViewEncapsulation.None` and ensure the global CSS is loaded at the app level as per the "Global CSS" decision.

## Out of Scope
- Adding new components not present in the current React/Vue set.
- Refactoring the main Rollup configuration for non-Angular frameworks.
