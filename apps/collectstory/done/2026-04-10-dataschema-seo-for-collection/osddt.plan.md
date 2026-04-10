# Implementation Plan: DataSchema SEO for Collection Pages and Items

## Architecture Overview

The implementation will focus on refactoring the JSON-LD generation for the **Collecstory** application (Next.js). To ensure long-term maintainability and type safety, we will leverage the `schema-dts` library to enforce Schema.org standards and Google's structured data requirements.

Although currently implemented within the Next.js app, the logic should be structured modularly to facilitate a future move into a shared library within the monorepo.

### Key Technical Decisions:
- **`schema-dts` for Type Safety**: Use `WithContext<ImageObject>` and `WithContext<ItemList>` from `schema-dts` to define the JSON-LD structures.
- **Component-Level Schema**: Move or refine existing SEO components to use the new type-safe structures.
- **Validation**: Ensure required fields like `creator`, `contentUrl`, and `position` are strictly enforced by the TypeScript types.

## Implementation Phases

### Phase 1: Environment & Dependencies
- Install `schema-dts` in the `apps/collectstory` package.
- Identify the existing components or utility functions responsible for generating JSON-LD on collection listing and item detail pages.

### Phase 2: Schema Definition & Utility Creation
- Create type-safe utility functions (e.g., `generateCollectionItemSchema`, `generateCollectionListingSchema`) using `schema-dts`.
- Incorporate the decisions:
  - Add `creator` to `ImageObject`.
  - Ensure listing pages use `ItemList` as the primary type.
  - Remove any references to `Product` schema in these specific contexts.

### Phase 3: Integration & Migration
- Replace the legacy JSON-LD generation in the item detail page (`app/collection/[id]/...` or similar) with the new `ImageObject` logic.
- Replace the legacy JSON-LD generation in the collection listing page (`app/collections/...` or similar) with the new `ItemList` logic.
- Ensure the JSON-LD is correctly serialized and injected into the page `<head>`.

### Phase 4: Validation & Testing
- Use local testing to verify the generated JSON structure matches the requirements.
- Validate the output using the [Schema Markup Validator](https://validator.schema.org/) or [Google Rich Results Test](https://search.google.com/test/rich-results) (manual or simulated).

## Technical Dependencies
- **`schema-dts`**: For Schema.org type definitions.
- **`apps/collectstory` existing SEO framework**: Likely using `next-seo` or custom meta-tag components.

## Risks & Mitigations
- **Broken SEO**: Incorrectly formatted JSON-LD can cause indexing issues. *Mitigation: Strict type checking with `schema-dts` and manual validation before deployment.*
- **Library Migration**: Moving logic to a library later might require different dependency versions. *Mitigation: Keep the logic "pure" (input-data-to-JSON-object) without direct Next.js dependencies where possible.*

## Out of Scope
- Modifying non-collection SEO (e.g., homepage, user profiles).
- Changing data fetching logic or API endpoints.
- UI changes in the browser.
