# Implementation Plan: G4 Analytics Integration for Collecstory

## Architecture Overview

This plan integrates Google Analytics 4 (G4) into the Collecstory Next.js application using `@next/third-parties/google`. The implementation will follow a modular approach with a dedicated analytics utility and hooks to ensure consistent tracking across the application while minimizing performance impact.

### Key Technical Decisions
- **SDK & Tagging**: Use `@next/third-parties/google` for a performant, Next.js-optimized integration of the Google Tag (gtag.js).
- **Client-Side Event Tracking**: All events will be captured client-side. A dedicated `useAnalytics` hook will wrap `sendGAEvent` to provide a consistent interface and handle user identification.
- **User Identification**: Hashed User IDs will be sent to G4 only for authenticated users. Hashing will be performed on the client using the Web Crypto API (SHA-256) to maintain privacy.
- **Consent Banner & Performance**: The consent banner will be loaded lazily using a combination of `dynamic` import and `requestIdleCallback` (or a delayed `useEffect`) to ensure it doesn't block the main thread during initial page load and TTI (Time to Interactive).
- **Modular Events**: Analytics logic will be kept separate from business logic using feature-specific tracking functions.

## Implementation Phases

### Phase 1: Setup & SDK Configuration
- Install `@next/third-parties` as a project dependency.
- Define `NEXT_PUBLIC_GA_MEASUREMENT_ID` in environment variables.
- Update `RootLayout` to include the `GoogleAnalytics` component.

### Phase 2: Core Utilities & User Identification
- Create a `shared/lib/analytics` utility for:
  - Hashing the User ID (SHA-256).
  - Wrapper for standard G4 events (`page_view`, `share`, `cta_click`).
- Implement the `useAnalytics` hook to handle user context and event dispatching.

### Phase 3: Feature-Specific Event Tracking
- **Social Sharing**: Update the `social-share` feature to track `share` events when platforms are clicked.
- **Onboarding Funnel**: Add tracking to `quick-start-collection` for `onboarding_start` and `onboarding_complete`.
- **Key CTAs**: Integrate tracking into:
  - `copy-item` feature.
  - `where-to-find` feature.
  - `report-problem` widget.
- **Global Actions**: Add tracking to the `site-header` widget.

### Phase 4: Consent Management & Performance Optimization
- Implement a `ConsentBanner` component in `shared/ui`.
- Load the `ConsentBanner` lazily in the `RootLayout` using `dynamic(() => import(...), { ssr: false })`.
- Use a "wait for idle" strategy (e.g., `requestIdleCallback` or a 3s delay) before showing the banner to ensure the initial site load remains fast.
- Store consent state in `localStorage` and prevent G4 tracking until consent is granted.

### Phase 5: Verification & Testing
- Use Google Analytics DebugView and Real-Time reports to verify event firing.
- Ensure hashed User IDs are correctly populated in G4 properties.
- Verify the "lazy load" behavior of the consent banner using performance profiling (e.g., Chrome DevTools Performance tab).

## Technical Dependencies

- **@next/third-parties**: For the `GoogleAnalytics` component.
- **Web Crypto API**: Native browser API for SHA-256 hashing.
- **React Hooks**: `useEffect`, `useState`, `useCallback` for tracking and state management.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| **Performance Impact**: G4 script or consent banner delaying LCP/TTI. | Use `@next/third-parties` for optimized script loading and lazily load the banner after initial content is interactive. |
| **Privacy Compliance**: Accidental exposure of PII (Personally Identifiable Information). | Ensure all User IDs are hashed before being sent to G4 and strictly follow the consent management protocol. |
| **Event Duplication**: Double tracking in a SPA environment. | Rely on G4's automatic page view tracking where possible and ensure custom events have unique identifiers. |

## Out of Scope

- Server-side analytics tracking via Next.js middleware or server components.
- Tracking of admin dashboard actions.
- Integration with third-party Consent Management Platforms (CMPs) like Cookiebot or OneTrust (we will build a custom, lightweight banner).
