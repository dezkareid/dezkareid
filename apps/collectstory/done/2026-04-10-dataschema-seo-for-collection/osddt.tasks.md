# Task List: DataSchema SEO for Collection Pages and Items

## Checklist

### Phase 1: Environment & Dependencies
- [x] [S] Install `schema-dts` in `apps/collectstory` package.
- [x] [S] Audit `apps/collectstory` to identify existing SEO components and JSON-LD logic.
  - Found `DataSchema` in `src/shared/ui/DataSchema`.
  - Found `getItemSchema` in `src/entities/item/lib/schema.ts`.
  - Found `getCollectionSchema` in `src/entities/collection/lib/schema.ts`.
- [x] [S] Locate the collection item detail page and collection listing page source files.
  - Detail page: `app/[username]/[collectionSlug]/[slug]/page.tsx`.
  - Listing page: `app/[username]/[collectionSlug]/page.tsx`.

### Phase 2: Schema Definition & Utility Creation
- [x] [M] Create type-safe schema generator utilities in `apps/collectstory/lib/seo/`.
- [x] [x] Implement `generateCollectionItemSchema` (ImageObject with `creator`).
- [x] [x] Implement `generateCollectionListingSchema` (ItemList of ImageObjects).
- [x] [S] Ensure all generators strictly use `schema-dts` for Google Rich Result compliance.

### Phase 3: Integration & Migration
- [x] [M] Refactor the collection item detail page to use the new `ImageObject` schema.
- [x] [M] Refactor the collection listing page to use the new `ItemList` schema.
- [x] [S] Remove legacy `Product` schema usage from collection-related pages.
- [x] [S] Confirm JSON-LD serialization and injection into the page `<head>`.

### Phase 4: Validation & Testing
- [x] [S] Add unit tests for the new schema generator functions.
- [x] [M] Validate final JSON-LD output using the [Schema Markup Validator](https://validator.schema.org/).
- [x] [S] Verify no regressions in other SEO metadata.

## Dependencies
- Phase 1 must be completed before starting Phase 2.
- Schema generators in Phase 2 must be ready before integration in Phase 3.
- Unit tests can be written alongside Phase 2 or 3, but final validation in Phase 4 requires Phase 3 completion.

## Definition of Done

### Phase 1
- `schema-dts` is available in `package.json`.
- Target files for migration are identified and listed in the working notes.

### Phase 2
- Schema generator functions are defined, type-safe, and reflect the `osddt.spec.md` decisions.

### Phase 3
- Collection pages emit the correct `ItemList` and `ImageObject` JSON-LD.
- `Product` schema is no longer present on these pages.

### Phase 4
- All unit tests pass.
- Schema validator reports 0 errors and 0 warnings for the new structures.
