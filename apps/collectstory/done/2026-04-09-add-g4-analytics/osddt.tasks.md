# Tasks: G4 Analytics Integration for Collecstory

## Phase 1: Setup & SDK Configuration
- [x] [S] Install `@next/third-parties` as a project dependency.
- [x] [S] Define `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local` and `.env.local.example`.
- [x] [S] Update `RootLayout` in `src/app/layout.tsx` to include the `GoogleAnalytics` component.

**Definition of Done (Phase 1):** SDK is installed and the GA tag is being loaded in the browser (verifiable via Network tab).

## Phase 2: Core Utilities & User Identification
- [x] [M] Implement SHA-256 hashing utility using Web Crypto API in `src/shared/lib/analytics/hash.ts`.
- [x] [S] Create G4 event wrapper utility in `src/shared/lib/analytics/events.ts`.
- [x] [M] Implement `useAnalytics` hook in `src/shared/lib/analytics/useAnalytics.ts` to handle auth state, hashing, and `sendGAEvent`.

**Definition of Done (Phase 2):** Analytics utilities are ready to process hashed User IDs and dispatch events.

## Phase 3: Feature-Specific Event Tracking
- [x] [S] Track `share` events in `src/features/social-share/ui/social-share.tsx`.
- [x] [S] Track onboarding funnel in `src/features/quick-start-collection/ui/OnboardingEmptyState.tsx` and `QuickStartForm.tsx`.
- [x] [S] Track `cta_click: copy_item` in `src/features/copy-item/ui`.
- [x] [S] Track `cta_click: where_to_find` in `src/features/where-to-find/ui`.
- [x] [S] Track `cta_click: report_problem` in `src/widgets/report-problem/ui`.
- [x] [S] Track header interactions in `src/widgets/site-header/ui`.

**Definition of Done (Phase 3):** All specified high-priority user actions trigger G4 events with correct labels and platform data.

## Phase 4: Consent Management & Performance Optimization
- [x] [M] Create `ConsentBanner` UI component in `src/shared/ui/ConsentBanner`.
- [x] [S] Implement consent state management using `localStorage` in `src/shared/lib/analytics/consent.ts`.
- [x] [M] Integrate `ConsentBanner` into `RootLayout` using Next.js `dynamic` import and a "wait for idle" delay (3s).
- [x] [S] Update `useAnalytics` to respect consent state before firing events.

**Definition of Done (Phase 4):** Tracking is blocked until user consent is granted. The banner loads lazily without impacting initial PageSpeed scores.

## Phase 5: Verification & Testing
- [x] [S] Verify events and hashed User IDs in G4 DebugView/Real-Time report.
- [x] [M] Run performance profile in Chrome DevTools to confirm banner lazy-loading doesn't block TTI.

**Definition of Done (Phase 5):** End-to-end data integrity and performance goals are confirmed.

## Dependencies
- Phase 2 utilities must be completed before Phase 3 tracking can be implemented.
- Phase 1 must be active for any real-time verification.
- Phase 4's consent logic must be integrated into Phase 2/3 handlers to ensure privacy compliance.
