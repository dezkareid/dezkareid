# Tasks: SEO and Metadata Improvements

## Phase 1: Foundation & Setup
- [x] [S] Install `schema-dts` as a dev dependency.
- [x] [S] Create `DataSchema` component in `src/shared/ui/DataSchema/DataSchema.tsx` (FSD: Shared layer).
- [x] [S] Create public API for `DataSchema` in `src/shared/ui/DataSchema/index.ts`.
- [x] [S] Ensure `next/script` is correctly imported and used in `DataSchema`.

## Phase 2: Collection Page Improvements
- [x] [M] Update `generateMetadata` in `app/[username]/[collectionSlug]/page.tsx` for dynamic `og:image`.
- [x] [M] Implement `CollectionPage` schema generation logic.
  - *Recommendation*: Create a mapper in `src/entities/collection` (if slice exists) or a utility in `src/shared/lib`.
- [x] [S] Integrate `DataSchema` component in `app/[username]/[collectionSlug]/page.tsx` with the generated schema.

## Phase 3: Item Page Improvements
- [x] [M] Implement `Product` schema generation logic in `app/[username]/[collectionSlug]/[slug]/page.tsx`.
  - *Recommendation*: Use `src/entities/item` to house the schema mapping logic.
- [x] [S] Integrate `DataSchema` component in `app/[username]/[collectionSlug]/[slug]/page.tsx` with the generated schema.

## Phase 4: Validation
- [x] [S] Verify Open Graph tags for collections (first item image -> default brand image).
- [x] [S] Validate JSON-LD structured data for both collections and item pages.

## Dependencies
- Phase 2 and Phase 3 depend on the completion of Phase 1 (Foundation & Setup).
- Phase 4 depends on the completion of Phase 2 and Phase 3.

## Definition of Done
- `og:image` is correctly generated and present in the `<head>` of collection pages.
- `DataSchema` component renders valid JSON-LD using `next/script`.
- Collection pages include a valid `CollectionPage` or `ItemList` schema.
- Item pages include a valid `Product` schema with accurate item details.
- No negative impact on page load performance or SSR.
- All new code follows Feature-Sliced Design (FSD) architecture.
