# Implementation Plan: Add Reusable Components to Design System

## Architecture Overview
The migration follows the established architecture of the `@dezkareid/components` monorepo package. Components will be implemented as framework-agnostic CSS Modules with framework-specific wrappers (React, Astro, Vue).

### Key Technical Decisions
1.  **Framework-Agnostic Styling**: Use CSS Modules in `design-system/components/src/css/` to ensure styles are reusable across React, Astro, and Vue.
2.  **React 19 Standards**: Use React 19 features (e.g., direct `ref` prop passing, `useActionState` if needed).
3.  **Astro & Vue Support**: For every component, provide at least a React and an Astro implementation to support the core apps (`collectstory` is Next.js, `main-website` is Astro).
4.  **Testing Strategy**:
    - **React**: Vitest + React Testing Library for behavioral verification.
    - **Visual**: Storybook for manual and visual regression testing.
5.  **Multi-Strategy Image**: The `Image` component will implement a Strategy Pattern via a `strategy` prop to handle different providers (Default vs. Cloudinary).

## Implementation Phases

### Phase 1 — Research & Mapping
- [ ] Map exact props and CSS from `collectstory` components: `Breadcrumb`, `CloudinaryImage`, `ActionToggle` (base for LikeButton), `Modal`, `VerifiedBadge`, `ConsentBanner`.
- [ ] Identify shared layout/spacing tokens in `design-system/design-tokens` to replace hardcoded values.

### Phase 2 — Core Design System Implementation
- [ ] **2.1 CSS Base**: Create CSS Modules in `src/css/` for all components using BEM and design tokens.
- [ ] **2.2 React Wrappers**: Implement React components in `src/react/` (or `src/react-server/` / `src/react-client/` as appropriate).
- [ ] **2.3 Astro Wrappers**: Implement Astro components in `src/astro/`.
- [ ] **2.4 Image Strategy**: Implement the specific `Cloudinary` strategy in the `Image` component.

### Phase 3 — Testing & Documentation
- [ ] **3.1 Unit Tests**: Add Vitest tests for React components (`*.test.tsx`).
- [ ] **3.2 Storybook**: Create stories for all new components in `ui-tools/storybook-react`.
- [ ] **3.3 README/AGENTS**: Update documentation in `design-system/components/README.md` and `AGENTS.md`.

### Phase 4 — Integration in `collectstory`
- [ ] **4.1 Breadcrumb**: Replace `BreadcrumbNav` in collection and item detail pages.
- [ ] **4.2 Image**: Replace `CloudinaryImage` with the new `@dezkareid/components` `Image` (strategy="cloudinary").
- [ ] **4.3 Actions**: Replace `LikeButton` (refactored to use `ActionToggle`) and `Modal` usages.
- [ ] **4.4 Cleanup**: Remove the migrated UI code from `apps/collectstory/src/shared/ui/`.

### Phase 5 — Validation & Finalization
- [ ] **5.1 Build & Lint**: Run `pnpm build` and `pnpm lint` from the monorepo root.
- [ ] **5.2 Changeset**: Create a changeset for `@dezkareid/components` and `@dezkareid/collectstory`.

## Technical Dependencies
- `@dezkareid/design-tokens`: For color and spacing variables.
- `react` 19.x: Peer dependency.
- `vitest` / `testing-library/react`: For component testing.
- `storybook`: For UI documentation.

## Risks & Mitigations
- **Breaking Changes**: Moving components might break existing styles in `collectstory`. **Mitigation**: Perform visual side-by-side comparison using local development.
- **Next.js Server Components**: Some components (like `Modal`) require `use client`. **Mitigation**: Properly separate `react-server` and `react-client` exports in the design system.

## Out of Scope
- Full migration to `@dezkareid/seo` (handled by a future task).
- Complex feature logic (e.g., Supabase data fetching).
