# Task List: Homepage Real Data & Cleanup

## Checklist

### Phase 1: Backend & Data Layer
- [x] [M] Implement `getLatestPublicItems` in `lib/collections.ts` with profile joins.
- [x] [S] Create API Route Handler at `app/api/latest-arrivals/route.ts`.
- [x] [S] Verify API response structure via local manual test or simple script.

### Phase 2: UI Cleanup & Refinement
- [x] [S] Remove `<Stats />` from `app/page.tsx` and delete unused component/styles if appropriate.
- [x] [S] Filter "Features" in `components/landing/Features.tsx` to remove Value AI/Tracking.
- [x] [M] Update `components/landing/Footer.tsx`:
    - [x] Remove "Public" button.
    - [x] Integrate `SocialShare` feature.
    - [x] Fix `navLinks` in `lib/mock-data.ts` (remove Community, update Contact mailto).
- [x] [S] Verify footer links and sharing behavior.

### Phase 3: Real Data Integration
- [x] [M] Refactor `components/landing/LatestArrivals.tsx` to fetch from `/api/latest-arrivals`.
- [x] [S] Implement loading/skeleton state for `LatestArrivals`.
- [x] [S] Implement empty state (no items) for `LatestArrivals`.

### Phase 4: Legal & Policy Pages
- [x] [S] Create `app/terms/page.tsx` with standard boilerplate.
- [x] [S] Create `app/privacy/page.tsx` with standard boilerplate.
- [x] [S] Link Footer components to `/terms` and `/privacy`.

### Phase 5: Final Validation
- [x] [S] Manual verification of "Latest Arrivals" with real DB data.
- [x] [S] Verify "Contact" link recipient is `elmaildeldezkareid@gmail.com`.
- [x] [M] Run `pnpm lint` and `pnpm tsc` (type check) to ensure no regressions.

## Dependencies
- Phase 1 must be completed before Phase 3.
- Phase 2 and Phase 4 are independent but both modify the Footer.

## Definition of Done
- **Phase 1**: API returns real data from Supabase with author usernames.
- **Phase 2**: Homepage layout is cleaned up; Footer is functional and matches the spec.
- **Phase 3**: Homepage displays real latest arrivals with dynamic data.
- **Phase 4**: Terms and Privacy pages are accessible and correctly linked.
- **Phase 5**: Full application build and linting pass; all acceptance criteria from the spec are met.
