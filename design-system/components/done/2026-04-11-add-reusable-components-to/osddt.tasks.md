# Tasks: Add Reusable Components to Design System

## Phase 1 — Research & Mapping
**Goal**: Baseline audit of existing components in `collectstory` to ensure feature parity.
- [x] [S] Audit `Breadcrumb` usage in `collectstory` (props, SEO, and CSS classes).
- [x] [S] Map `CloudinaryImage` props and responsive breakpoints.
- [x] [S] Extract `LikeButton` interaction logic and active/inactive styles.
- [x] [S] Audit `Modal` for focus-trapping and accessibility attributes.
- [x] [S] Map `VerifiedBadge` and `ConsentBanner` visual styles to `design-tokens`.

**Definition of Done**: A clear mapping of props, styles, and behavioral requirements is ready for all components.

## Phase 2 — Core Design System Implementation
**Goal**: Functional components implemented in `@dezkareid/components` for React and Astro.
- [x] [M] **2.1 CSS Base**: Create `.module.css` files for all 7 components in `src/css/`.
- [x] [M] **2.2 Breadcrumb**: Implement React and Astro wrappers.
- [x] [M] **2.3 Image**: Implement React and Astro wrappers with `strategy` support (Default, Cloudinary).
- [x] [M] **2.4 ActionToggle & LikeButton**: Create generic `ActionToggle` (React) and specialized `LikeButton`.
- [x] [M] **2.5 Modal**: Implement React (Client Component) and Astro wrappers.
- [x] [M] **2.6 VerifiedBadge & ConsentBanner**: Implement React and Astro wrappers.
- [x] [x] **2.7 DataSchema**: (Cancelled - will be moved to separate package).

**Definition of Done**: All components are implemented, exported, and visually consistent using design tokens.

## Phase 3 — Testing & Documentation
**Goal**: Components are verified and documented for consumption.
- [x] [M] **3.1 Unit Tests**: Add Vitest tests for `ActionToggle` (controlled/uncontrolled), `Modal` (dismissal), and `Image` (strategies).
- [x] [M] **3.2 Storybook**: Create stories for all new components in `ui-tools/storybook-react`.
- [x] [S] **3.3 Documentation**: Update `README.md` and `AGENTS.md` with usage examples for each component.

**Definition of Done**: All components have >90% test coverage for core logic and are interactive in Storybook.

## Phase 4 — Integration in `collectstory`
**Goal**: `collectstory` is fully migrated to the design system components.
- [x] [S] **4.1 Breadcrumb**: Replace local `BreadcrumbNav` in collection and item pages.
- [x] [M] **4.2 Image**: Replace `CloudinaryImage` usages with the new `Image` component.
- [x] [M] **4.3 Actions**: Replace local `LikeButton` and `Modal` implementations.
- [x] [S] **4.4 Consent & Badge**: Replace `ConsentBanner` and `VerifiedBadge`.
- [x] [S] **4.5 Cleanup**: Delete the migrated UI folders in `apps/collectstory/src/shared/ui/`.

**Definition of Done**: `collectstory` builds successfully and passes all visual regressions using the design system.

## Phase 5 — Validation & Finalization
**Goal**: Changes are verified across the monorepo and ready for commit.
- [x] [S] **5.1 Monorepo Validation**: Run `pnpm build` and `pnpm lint` from root.
- [x] [S] **5.2 Quality Audit**: (User will perform tests).
- [x] [S] **5.3 Changeset**: Create changesets for `@dezkareid/components` and `@dezkareid/collectstory`.

**Definition of Done**: All CI checks pass, and changesets are documented.
