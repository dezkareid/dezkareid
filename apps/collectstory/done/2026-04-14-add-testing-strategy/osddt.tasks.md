# Task List: Testing Strategy for Collectstory

## Phase 1: Infrastructure & Configuration
*Goal: Enable coverage reporting and integrate with the monorepo pipeline.*

- [x] [S] Install `@vitest/coverage-v8` in `apps/collectstory`.
- [x] [S] Update `vitest.config.mts` to configure the `coverage` provider with a 50% threshold and appropriate exclusions.
- [x] [S] Add `test:coverage` script to `package.json` and ensure the `test` script is correct.
- [x] [S] Verify Turbo integration by running `pnpm turbo run test --filter=@dezkareid/collectstory` from the root.

**Definition of Done (Phase 1):** Tests run through Turbo, and coverage reports are generated with a 50% threshold enforcement.

## Phase 2: Testing Helpers & Setup
*Goal: Standardize the testing environment.*

- [x] [S] Create `vitest.setup.ts` and configure it in `vitest.config.mts`.
- [x] [S] Implement global mocks for `next/router` or other common Next.js APIs if necessary.
- [x] [M] Define and document a standard pattern for component testing with RTL (e.g., custom render with providers).

**Definition of Done (Phase 2):** A stable testing environment is configured with common mocks and a standardized rendering pattern.

## Phase 3: Baseline Layer Implementation
*Goal: Provide reference tests for each FSD layer in `src/` using BDD and table-driven patterns.*

- [x] [M] **Shared**: Implement table-driven tests for a generic UI primitive (e.g., `DropdownMenu`).
- [x] [M] **Entities**: Implement tests for `CollectionItemCard` ensuring correct rendering of data.
- [x] [M] **Features**: Implement tests for `ThemeToggleWrapper` to verify user interaction.
- [x] [M] **Widgets**: Implement tests for `SiteHeader` (mocking async auth if needed).
- [x] [S] **Shared API**: Implement unit tests for `src/shared/lib/analytics` logic.
- [x] [M] **Legacy Components**: Implement tests for at least one critical component in `components/` (e.g., in `components/landing`).

**Definition of Done (Phase 3):** Each FSD layer in `src/` and the legacy `components/` directory has at least one passing test file demonstrating BDD and table-driven patterns.

## Phase 4: Documentation & Finalization
*Goal: Ensure the strategy is maintainable and discoverable.*

- [x] [S] Update `AGENTS.md` with testing conventions, mocking examples, and coverage instructions.
- [x] [S] Final verification of all acceptance criteria.

**Definition of Done (Phase 4):** Documentation is updated, and the project meets all initial testing requirements.

## Dependencies
- Phase 1 must be completed before Phase 3.
- Phase 2 should ideally be completed before Phase 3 to provide consistent patterns.
- Phase 3 is required to reach the 50% coverage threshold.
