# Task List: Social Sharing and Reporting

## Phase 1: Design System & Assets
Goal: Ensure all necessary visual assets are available in the shared design system.

- [x] [S] Add `facebook.svg` to `design-system/icons/src/svg/`
- [x] [S] Add `instagram.svg` to `design-system/icons/src/svg/`
- [x] [S] Build the `@dezkareid/icons` package to export the new icons

**Definition of Done**: Icons are correctly exported and can be imported from `@dezkareid/icons` in the main application.

## Phase 2: Social Sharing Logic
Goal: Implement sharing capabilities with UTM tracking and Web Share API.

- [x] [S] Create `share-utils.ts` with UTM tagging logic (`utm_source`, `utm_medium`, etc.)
- [x] [M] Implement `SocialShare` component with Web Share API support
- [x] [M] Implement desktop fallback menu for `SocialShare` (Twitter, Facebook, LinkedIn, Copy Link)
- [x] [S] Add "Copy Link" functionality with clipboard API and success feedback
- [x] [S] Integrate `SocialShare` into the Profile page (`[username]/page.tsx`)
- [x] [S] Integrate `SocialShare` into the Collection page (`[username]/[collectionSlug]/page.tsx`)
- [x] [S] Integrate `SocialShare` into the Item page (`[username]/[collectionSlug]/[slug]/page.tsx`)

**Definition of Done**: Users can share profiles, collections, and items via native share sheet or fallback menu; URLs include UTM parameters.

## Phase 3: Problem Reporting
Goal: Implement a persistent, authenticated-only reporting mechanism.

- [x] [M] Create `ReportProblemButton` widget with floating fixed positioning
- [x] [S] Implement authentication guard for the reporting button (only visible if logged in)
- [x] [S] Implement `mailto:` logic with pre-filled subject and current URL in body
- [x] [S] Integrate `ReportProblemButton` into the global `RootLayout`

**Definition of Done**: Authenticated users see a "Report" button on all pages that opens their email client with contextual info.

## Dependencies
- Phase 1 must be completed before Phase 2 (for social icons).
- Phase 2 tasks can be implemented in parallel after utility is created.
- Phase 3 is independent of Phase 2.
