# Implementation Plan: "I Want to Buy" Flow

## Architecture Overview
The "I Want to Buy" flow will be implemented using **Next.js 16** with the **App Router**. The core of this feature is the integration between the user's collection and the product catalog, specifically focusing on the new `/catalog/[slug]/stores` page.

### Key Technical Decisions
- **Framework**: Next.js 16 (App Router).
- **Caching & Performance**: Use **Incremental Static Regeneration (ISR)** with a revalidation period of 1 hour (`revalidate: 3600`). This ensures the store list remains relatively up-to-date while maintaining high performance.
- **Redirection Logic**:
  - The "I want to buy" button in the collection item will resolve the catalog item's slug and link to `/catalog/[slug]/stores`.
  - Store cards will link to external product URLs with UTM parameters (`?utm_source=collectstory`).
- **Theming & UI**: Use semantic tokens from `@dezkareid/design-tokens` as defined in `DESIGN.md`.
- **Data Fetching**: Use Server Components for initial data fetching of catalog items and associated stores.

## Implementation Phases

### Phase 1: Routing & Page Structure
1. **Create Route**: Define the dynamic route `apps/collectstory/app/catalog/[slug]/stores/page.tsx`.
2. **ISR Configuration**: Implement `export const revalidate = 3600;` on the page.
3. **Data Fetching**: Implement a server-side function to fetch catalog item details and its associated stores by slug.

### Phase 2: UI Components (Catalog Stores)
1. **Item Context Header**: Create a component to display the catalog item's main information (image, name, etc.) at the top of the stores page.
2. **Store Listing**:
   - Map through the fetched stores.
   - Implement the Store Card component with Logo (fallback supported), Name (mandatory), and City (fallback supported).
3. **Redirection Logic**:
   - Implement the primary card link to the external Product URL (with UTM).
   - Implement the secondary "Visit Store" button linking to the internal store profile.
4. **Empty State**: Design and implement a minimalistic empty state for when no stores carry the item.

### Phase 3: Collection Integration
1. **Button Update**: Update the existing "Buy" button in collection items (likely a React component in `packages/react-components` or local to `collectstory`).
2. **Visibility Logic**: Ensure the button is only rendered if a valid catalog relation exists.
3. **Navigation**: Link the button to the new `/catalog/[slug]/stores` page.

### Phase 4: Styling & Polish
1. **Apply Design Tokens**: Ensure all elements use the spacing, typography, and color tokens from `DESIGN.md`.
2. **Responsive Audit**: Verify the layout works seamlessly across mobile, tablet, and desktop breakpoints.
3. **New Tab Behavior**: Ensure all external links use `target="_blank"` and `rel="noopener noreferrer"`.

## Technical Dependencies
- **Next.js 16**: Core framework.
- **@dezkareid/design-tokens**: For consistent styling.
- **Internal API/SDK**: For fetching catalog and store data (assumed to exist).

## Risks & Mitigations
- **Broken Product Links**: External URLs might become invalid. *Mitigation*: Ensure the UI handles missing or malformed URLs gracefully.
- **Data Inconsistency**: Catalog relations might be missing. *Mitigation*: Implement robust error boundaries and "Not Found" handling for the stores page.
- **Stale Cache**: ISR means data could be 1 hour old. *Mitigation*: 1 hour is considered acceptable for this specific use case, but we can lower the threshold if needed.

## Out of Scope
- Real-time stock counts.
- Price comparisons across stores.
- Direct checkout integrations.
