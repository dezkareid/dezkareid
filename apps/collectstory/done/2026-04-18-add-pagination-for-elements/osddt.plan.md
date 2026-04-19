# Implementation Plan: Pagination for Collections and Items

This plan outlines the technical approach to implementing pagination for collections and items in the Collecstory application using Supabase for data fetching and React Query for client-side state and caching.

## Architecture Overview

### 1. Methodology & Standards
- **FSD (Feature-Sliced Design)**: Logic will be organized into slices. 
  - **Shared**: Pagination components and Supabase helpers.
  - **Entities**: Collection and Item data models/types.
  - **Features**: Pagination logic and data fetching hooks.
- **BDD (Behavior Driven Development)**: Define user behaviors (Given/When/Then) before implementation.
- **Table Driven Development**: Use data tables for testing complex pagination edge cases (e.g., last page, out of bounds, single item).
- **Vercel/React Best Practices**: 
  - Leverage **Next.js 16 App Router** features like `use cache` and `revalidateTag`.
  - Use **React Query** for client-side optimistic UI and efficient caching.

### 2. Data Fetching Strategy
- **Server-Side (RSC)**: Initial page load (page 1) will be handled by React Server Components using the `use cache` directive in `lib/collections.ts`. This ensures SEO-friendly content and fast initial paint.
- **Client-Side (React Query)**: Subsequent pagination requests handled by `@tanstack/react-query`.
- **Supabase Range Pagination**: Use `.range(from, to)` for efficient retrieval.

### 3. Addition & Invalidation
- **Flow**: When a new item or collection is added:
  1. Perform the server action to insert.
  2. Call `revalidateTag` for the relevant counters and lists.
  3. **Redirect to Page 1**: Navigate the user back to the first page to ensure the newly added item (ordered by `created_at` desc) is immediately visible.
  4. Invalidate React Query cache for the first page.

## Implementation Phases

### Phase 1: Database & Library Enhancements (Shared/Entities)
- **Task 1.1**: Update `PublicCollection` and `PublicItem` types to include pagination metadata (`total_count`).
- **Task 1.2**: Refactor `getPublicCollectionsByUsername` in `lib/collections.ts` to support `page` and `limit` using `.range()`.
- **Task 1.3**: Refactor `getPublicItemsInCollection` and `getOwnerItemsInCollection` to support pagination.
- **Task 1.4**: Ensure `total_count` is returned using `{ count: 'exact' }`.

### Phase 2: Features & React Query Hooks
- **Task 2.1**: Implement `useCollectionsQuery` and `useItemsQuery` using `useQuery`.
- **Task 2.2**: Create a helper to calculate Supabase range: `(page - 1) * limit` to `page * limit - 1`.
- **Task 2.3**: Update insertion actions to include `revalidateTag` and redirect to page 1.

### Phase 3: UI Components (Shared/Features)
- **Task 3.1**: Create `PaginationControls` in `src/shared/ui` (Simple "Next" and "Previous" buttons).
- **Task 3.2**: Update `ProfileContent` and `OwnerProfileGrid` to use paginated data.
- **Task 3.3**: Update collection items view to include pagination.

### Phase 4: SEO & Caching Optimizations
- **Task 4.1**: Update `generateMetadata` for profile and collection pages to include canonical URLs with `page` parameters.
- **Task 4.2**: Configure `cacheLife` and `cacheTag` for paginated functions.
- **Task 4.3**: Implement logic to reset pagination to page 1 when active filters are changed.

### Phase 5: Testing (BDD & Table-Driven)
- **Task 5.1**: Write Vitest tests using table-driven patterns for range calculation.
- **Task 5.2**: Write integration tests for the pagination flow (navigation, URL sync).

## Technical Dependencies
- **Supabase JS SDK**: For `.range()` pagination.
- **TanStack React Query**: For client-side state management.
- **Next.js (App Router)**: For URL synchronization and `use cache`.

## Risks & Mitigations
- **Risk**: Cache inconsistency when adding items.
- **Mitigation**: Strict use of `revalidateTag` and immediate redirect to page 1.
- **Risk**: SEO duplicate content.
- **Mitigation**: Use `<link rel="canonical">` reflecting the current page.

## Out of Scope
- Infinite scrolling.
- User-selectable page sizes (fixed at 20).
- Full numbered pagination bar.
