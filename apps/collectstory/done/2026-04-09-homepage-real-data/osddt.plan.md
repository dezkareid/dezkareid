# Implementation Plan: Homepage Real Data & Cleanup

## Architecture Overview
The project follows a Feature-Sliced Design (FSD) architecture. We will implement the "latest arrivals" feature by adding a new data-fetching utility in the `entities/collection` layer (mapped to `lib/collections.ts` for simplicity in this project) and exposing it via a Next.js Route Handler. The UI will be updated by refining existing components in the `components/landing/` directory.

### Key Decisions
- **Data Fetching**: Implement `getLatestPublicItems` in `lib/collections.ts` to fetch the 4 most recent public items from Supabase, joining with the `profiles` table to get the author's username.
- **API Endpoint**: Create `/api/latest-arrivals` to allow for flexible data fetching and easier caching control.
- **Caching Strategy**: The homepage will use Next.js's built-in data fetching with a revalidation period (e.g., 1 hour) to balance real-time updates and performance.
- **Sharing Strategy**: Use the existing `SocialShare` component from `src/features/social-share` in the footer to provide a consistent sharing experience across the app.
- **Legal Content**: Use standard placeholders for "Terms of Service" and "Privacy Policy" in dedicated pages.

## Implementation Phases

### Phase 1: Backend & Data Layer
- **Step 1.1**: Update `lib/collections.ts` to include `getLatestPublicItems`.
- **Step 1.2**: Create `app/api/latest-arrivals/route.ts` that uses this utility.
- **Step 1.3**: Verify the endpoint returns correctly structured JSON.

### Phase 2: UI Cleanup & Refinement
- **Step 2.1**: Remove the `<Stats />` component from `app/page.tsx`.
- **Step 2.2**: Update `components/landing/Features.tsx` to filter out non-applicable features (Value AI, Value Tracking).
- **Step 2.3**: Update `components/landing/Footer.tsx`:
  - Remove the "Public" button.
  - Implement the "Share" button using `SocialShare`.
  - Update `siteData` in `lib/mock-data.ts` to fix the `navLinks` (remove Community, fix Contact).
  - Ensure the "Contact" link uses `mailto:elmaildeldezkareid@gmail.com`.

### Phase 3: Real Data Integration
- **Step 3.1**: Update `components/landing/LatestArrivals.tsx` to fetch data from `/api/latest-arrivals`.
- **Step 3.2**: Handle empty/loading states gracefully in the UI.

### Phase 4: Legal & Policy Pages
- **Step 4.1**: Create `app/terms/page.tsx` with standard Terms of Service text.
- **Step 4.2**: Create `app/privacy/page.tsx` with standard Privacy Policy text.
- **Step 4.3**: Update footer links to point to `/terms` and `/privacy`.

### Phase 5: Validation & Testing
- **Step 5.1**: Verify the "Last Item Added" displays correctly on the homepage.
- **Step 5.2**: Test the "Share" functionality in the footer.
- **Step 5.3**: Confirm the "Contact" link opens a mail client with the correct recipient.
- **Step 5.4**: Run lint and type checks across the project.

## Technical Dependencies
- `next`: For routing, API handlers, and server/client components.
- `@supabase/supabase-js`: For real-time data fetching.
- `@dezkareid/components`: Shared UI components and icons.

## Risks & Mitigations
- **Database Load**: Increased queries to Supabase for every homepage visit. *Mitigation*: Implement a 1-hour `revalidate` cache on the API route and the homepage component.
- **Broken Images**: Real user-uploaded images might fail or be slow to load. *Mitigation*: Ensure `next/image` handles fallback states and has appropriate `sizes` attributes.
- **Privacy Policy/ToS Compliance**: Using standard templates might not be legally perfect. *Mitigation*: Mark these as "Standard Templates" in the footer/content to indicate their generic nature.

## Out of Scope
- Implementing the "Value AI Inventory" or "Value Tracking" logic.
- Building a custom "Community" platform.
- Dynamic statistics (e.g., total item count across all users).
