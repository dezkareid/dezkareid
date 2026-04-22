# Task List: "I Want to Buy" Flow

## Phase 1: Routing & Infrastructure
- [x] [S] Create dynamic route directory `app/catalog/[slug]/stores/`
- [x] [S] Implement ISR configuration (`export const revalidate = 3600`) in `page.tsx`
- [x] [M] Implement server-side data fetching for catalog item and associated stores
- [x] [S] Implement "Not Found" handling for invalid catalog slugs

## Phase 2: Core UI Components
- [x] [M] Create `CatalogItemHeader` component for item context
- [x] [M] Create `StoreCard` component with mandatory name and optional logo/city
- [x] [S] Implement empty state UI for items with no associated stores
- [x] [S] Implement UTM parameter logic for product URLs (`?utm_source=collectstory`)

## Phase 3: Integration & Navigation
- [x] [M] Locate and update the existing "Buy" button in collection items
- [x] [S] Implement visibility logic for the "Buy" button (render only if catalog relation exists)
- [x] [S] Update "Buy" button to link to `/catalog/[slug]/stores`
- [x] [S] Implement internal navigation for the "Visit Store" button (link to store profile)

## Phase 4: Styling & Refinement
- [x] [M] Audit all new components for `DESIGN.md` token compliance (colors, spacing, typography)
- [x] [S] Add `target="_blank"` and security headers (`rel="noopener noreferrer"`) to external links
- [x] [S] Responsive design pass (Mobile, Tablet, Desktop)

## Dependencies
- Phase 1 must be completed before Phase 2 (to provide data context).
- Phase 2 must be completed before Phase 3 (to provide the navigation target).
- Phase 4 can be performed iteratively during Phase 2 and 3.

## Definition of Done
- **Phase 1**: `/catalog/[slug]/stores` resolves correctly and fetches data.
- **Phase 2**: Stores are listed with correct details and redirection logic works.
- **Phase 3**: Users can navigate from their collection to the stores list.
- **Phase 4**: The UI is visually consistent with `DESIGN.md` and fully responsive.
