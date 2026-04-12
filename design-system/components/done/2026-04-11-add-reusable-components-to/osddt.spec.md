# Specification: Add Reusable Components to Design System

## Overview
This feature involves the migration and generalization of several UI components currently residing in the **Collectstory** application into the core `@dezkareid/components` library. The primary goal is to centralize UI primitives to ensure visual stability, cross-platform consistency, and high-quality user experience across the entire Dezkareid product portfolio.

By moving these components to the design system, we align with the enterprise's strategic objectives of **Operational Excellence** (through standardized documentation) and **Efficiency & Velocity** (by reducing code duplication and accelerating future feature development).

## Business Context
This migration aligns with the following **Dezkareid Enterprise** strategic outcomes:

- **High-Quality User Experience**: Centralizing components ensures 100% compliance with accessibility standards and high-performance interfaces.
- **Efficiency & Velocity**: Standardizing common design patterns across apps (Next.js, Astro) allows for faster iteration and a 20% increase in meaningful updates.
- **Architecture Principles**:
  - **Simplicity over Complexity**: We move from inline, duplicated logic to clean, modular components.
  - **Universal Accessibility**: All migrated components will be audited for WCAG compliance.
  - **Native Discoverability**: Components like `Breadcrumb` and `DataSchema` will natively support structured data for SEO.

## Requirements

### Functional Requirements
1. **Breadcrumb Component**:
   - Must support a dynamic list of trail items (label + optional URL).
   - Must be stylistically consistent with the design system.
   - Must support accessibility features (e.g., `aria-label="Breadcrumb"`).
2. **Responsive Image Component**:
   - Must support different image resolutions based on viewport size.
   - Must implement strategies for aspect-ratio preservation and lazy loading.
   - Must support optional integration with image providers (e.g., Cloudinary).
3. **ActionToggle Component**:
   - A generic base component for boolean interactions (e.g., Like, Check, Favorite, Bookmark).
   - Must support controlled and uncontrolled states.
   - Must be stylable for different semantic meanings (e.g., heart for Like, checkmark for Check).
   - The "Like Button" will be a specialized implementation of this base component, rendering only the interactive icon (count is excluded).
4. **Modal Component**:
   - A standardized wrapper for overlays and dialogs.
   - Must handle focus trapping, "Escape" key dismissal, and background locking.
5. **Verified Badge**:
   - A small UI primitive to indicate verified status (user, product, or collection).
6. **Consent Banner**:
   - A reusable component for cookie consent and legal notifications.
7. **Data Schema (SEO Utility)**:
   - A utility component for injecting JSON-LD structured data into the `<head>` or body.

## Scope

### In Scope
- Migration and refactoring of identified components into `@dezkareid/components`.
- Complete styling using `@dezkareid/design-tokens`.
- Documentation of the new components (e.g., README or Storybook entries).
- Refactoring `collectstory` to consume these components from the design system.

### Out of Scope
- Migrating domain-specific business logic or data-fetching logic.
- Building complex, non-reusable "feature-slices" (e.g., `CatalogItemPicker`).
- Modification of existing design tokens (colors, spacing) unless critical gaps are found.

## Acceptance Criteria
- [ ] All identified components are exported by `@dezkareid/components`.
- [ ] Each component uses CSS custom properties from `@dezkareid/design-tokens`.
- [ ] The `Breadcrumb` component correctly renders in both Next.js and Astro environments within the monorepo.
- [ ] The `Image` component demonstrates responsive behavior (e.g., loading smaller assets on mobile).
- [ ] Components are fully keyboard-navigable and screen-reader accessible.
- [ ] `collectstory` displays identical visual behavior after switching to the design system components.

## Decisions
1. **Image Component Strategy**: The `Image` component will have a `strategy` attribute (values: `default`, `cloudinary`). It will return the appropriate image based on this strategy.
2. **SEO Breadcrumb**: The SEO component (e.g., automated JSON-LD injection) is out of scope for this feature. A `TODO` will be added to move it to a future `@dezkareid/seo` package.
3. **Like Button State**: The `LikeButton` will support both controlled (via props) and uncontrolled (internal state) usage to maximize flexibility.
