# Plan: Create Types for Speculation Rules API

## Tech Stack
- **TypeScript**: 5.9.3 (as configured in `@dezkareid/types`)
- **Testing**: `vitest` 4.0.18 for type-level verification
- **Runtime**: No runtime dependencies
- **Build Tool**: `tsc` (configured in `package.json`)
- **CI**: Integrated via `.github/workflows/ci-packages.yml` and `.github/packages.yml`

## Strategy
We have defined a robust set of types and interfaces in `packages/types/src/speculation-rules.ts` to represent the Speculation Rules API, following a reusable and extensible architecture.

### 1. Define Core Types
- `SpeculationAction`: "prefetch" | "prerender"
- `SpeculationSource`: "list" | "document"
- `SpeculationEagerness`: "immediate" | "eager" | "moderate" | "conservative"
- `SpeculationReferrerPolicy`: Standard referrer policies (e.g., "no-referrer", "strict-origin-when-cross-origin", etc.)

### 2. Define Reusable Rule Interfaces
- `SpeculationRuleBase`: Contains common properties like `eagerness`, `referrer_policy`, and `target_hint`.
- `SpeculationListRule`: Extends `SpeculationRuleBase` with `source: "list"` and `urls: string[]`.
- `SpeculationDocumentRule`: Extends `SpeculationRuleBase` with `source: "document"` and `where: SpeculationDocumentFilter`.

### 3. Define Filters for Document Source
- `SpeculationDocumentFilter`: Supports properties like `href_matches`, `selector_matches`, `and`, `or`, `not`.

### 4. Define Top-Level Container
- `SpeculationRules`: An object with keys for `prefetch` and `prerender`, each being an array of `SpeculationRule`.

### 5. Testing and Documentation
- Implemented `vitest` suite in `src/speculation-rules.test.ts` for automated verification.
- Created `AGENTS.md` with guidelines for future type additions.
- Updated `README.md` with usage examples and installation instructions.

## Tasks
- [x] Research the latest Speculation Rules API draft for accurate property names.
- [x] Implement the types in `packages/types/src/speculation-rules.ts`.
- [x] Export the new types from `packages/types/src/index.ts`.
- [x] Set up `vitest` for type testing.
- [x] Create automated tests in `src/speculation-rules.test.ts`.
- [x] Create `AGENTS.md` with development instructions.
- [x] Update `README.md` with usage examples.
- [x] Integrate package into CI pipeline via `.github/packages.yml`.
- [x] Run `npm run build` in `packages/types` to verify compilation.

## Verification
- Run `pnpm run test` in `packages/types` to verify type safety.
- Run `pnpm run build` in `packages/types` to verify distribution build.
- Confirm CI configuration recognizes changes in `packages/types/**`.
