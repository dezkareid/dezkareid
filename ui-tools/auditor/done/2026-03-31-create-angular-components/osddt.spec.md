# Specification: Angular Support for Design System Components

## Overview
The `@dezkareid/components` library is the central source of UI primitives for the Dezkareid ecosystem, currently supporting React, Astro, and Vue. To achieve full software consistency and enable Angular-based applications (such as the Web Quality Auditor) to leverage the shared design system, the library must be extended to provide native, idiomatic Angular components.

## Requirements
- **Framework Integration**: Provide a suite of Angular components that mirror the functionality and aesthetics of the existing React, Astro, and Vue implementations.
- **Core Components**: Implement the following initial set of components:
  - `Button`: Support for various variants (primary, secondary, ghost) and sizes.
  - `Tag`: Informational labels with status-based coloring.
  - `Card`: Container component for content grouping.
  - `ThemeToggle`: Interactive element to switch between light and dark modes.
- **Design Token Adherence**: All components must consume visual values exclusively from `@dezkareid/design-tokens` via CSS custom properties.
- **Styling Consistency**: Utilize the library's existing CSS (BEM naming, OOCSS) to ensure 1:1 visual parity across frameworks.
- **Modern Angular Idioms**: Components must be implemented using Standalone architecture, Signals for state management where appropriate, and the `OnPush` change detection strategy for optimal performance.

## Scope
- **In-Scope**:
  - Development of Angular versions for `Button`, `Tag`, `Card`, and `ThemeToggle`.
  - Packaging and exporting these components under the `@dezkareid/components/angular` entry point.
  - Integration with the existing build pipeline (Rollup/Vite) to ensure Angular metadata is correctly generated.
- **Out-of-Scope**:
  - Adding new components that do not currently exist in the React/Vue/Astro versions of the library.
  - Refactoring existing framework implementations.
  - Implementing complex application-level business logic within these UI primitives.

## Acceptance Criteria
- Angular components are successfully exported and can be imported into an Angular project (e.g., `@dezkareid/auditor`).
- Components render with 1:1 visual parity compared to their React/Astro counterparts.
- Functional requirements (e.g., Button click events, ThemeToggle state changes) are met using Angular-idiomatic patterns.
- Components pass basic accessibility checks (ARIA labels, keyboard navigation) consistent with the design system's standards.
- Documentation/README for `@dezkareid/components` is updated to include Angular usage instructions.

## Decisions
1. **Package Entry Point**: Use the `angular` subpath (`@dezkareid/components/angular`).
2. **Shared CSS Distribution**: Use the Global CSS option; the consumer application is responsible for importing `@dezkareid/components/css` globally, maintaining consistency with React, Astro, and Vue implementations.
3. **Storybook Integration**: No separate Angular Storybook instance will be created at this time.
