# Implementation Plan: Testing Strategy for Collectstory

## Architecture Overview
We will implement a testing foundation based on **Vitest**, **React Testing Library (RTL)**, and **jsdom**. The strategy follows a **Behavior-Driven Development (BDD)** approach using **table-driven tests** to ensure robust validation across multiple data sets.

### Core Testing Principles
- **BDD & Table-Driven**: Use `test.each` or `it.each` for multi-case scenarios.
- **Component-Focused**: Prioritize testing the user-facing behavior of components in the `src/` (FSD) structure.
- **Simplicity & Separation**: Keep tests simple. If a component is difficult to test, we will either mock dependencies or refactor it into separate UI and functional components.
- **No Test Classes**: Avoid object-oriented testing patterns; favor functional, declarative test suites.
- **FSD Alignment**: Tests are co-located with their respective components/modules (e.g., `ComponentName.test.tsx`).

## Implementation Phases

### Phase 1: Infrastructure & Configuration
- **Goal**: Enable coverage reporting and integrate with the monorepo pipeline.
- **Steps**:
  1. Install `@vitest/coverage-v8`.
  2. Update `vitest.config.mts` to configure the `coverage` provider with a 50% threshold.
  3. Ensure `package.json` has `test` and `test:coverage` scripts.
  4. Verify Turbo integration (`pnpm turbo run test --filter=@dezkareid/collectstory`).

### Phase 2: Testing Helpers & Setup
- **Goal**: Standardize the testing environment.
- **Steps**:
  1. Create a `vitest.setup.ts` to handle global mocks or environment setup (if needed).
  2. Define a standard pattern for component testing with RTL.

### Phase 3: Baseline Layer Implementation
- **Goal**: Provide reference tests for each FSD layer in `src/` and critical legacy components.
- **Steps**:
  1. **Shared**: Test a generic UI primitive (e.g., `src/shared/ui/dropdown-menu`).
  2. **Entities**: Test a business entity component (e.g., `src/entities/item/ui/CollectionItemCard.tsx`).
  3. **Features**: Test a user interaction component (e.g., `src/features/theme/ui/ThemeToggleWrapper.tsx`).
  4. **Widgets**: Test a composed widget (e.g., `src/widgets/site-header/ui/SiteHeader.tsx`).
  5. **Shared API**: Test critical logic in `src/shared/lib/analytics`.
  6. **Legacy Components**: Implement tests for at least one critical component in `components/` (e.g., `components/landing`).

### Phase 4: Documentation & Finalization
- **Goal**: Ensure the strategy is maintainable and discoverable.
- **Steps**:
  1. Update `AGENTS.md` with the new testing conventions and examples.
  2. Verify all acceptance criteria are met.

## Technical Dependencies
- `vitest`: ^4.0.18
- `@vitest/coverage-v8`: (to be installed)
- `@testing-library/react`: ^16.3.2
- `jsdom`: ^27.4.0
- `@vitejs/plugin-react`: ^5.1.4

## Risks & Mitigations
- **Complexity in Server Components**: Next.js App Router components (RSC) can be tricky to test in `jsdom`. 
  - *Mitigation*: Focus on testing the Client Components within the FSD slices or mock the server-side parts if necessary.
- **Supabase/External Latency**: Although mocking is not explicitly required for now, external calls must be avoided.
  - *Mitigation*: Ensure components are either decoupled from direct API calls or use simple `vi.mock` for any leaked side effects.
- **Coverage Threshold Pressure**: 50% might be hard to reach initially if the codebase is large.
  - *Mitigation*: Focus on the most critical `src/` and `components/` slices first to maximize impact on coverage.

## Out of Scope
- End-to-End browser tests (Playwright).
- Database-level integration tests.
