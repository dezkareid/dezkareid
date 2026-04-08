# Technical Plan: Social Sharing and Reporting

## Architecture Overview
This feature will be implemented using a modular approach following the Feature-Sliced Design (FSD) principles already present in the codebase.

### Social Sharing
- **Component**: A `SocialShare` feature component will handle the logic for Web Share API and fallbacks.
- **Tracking**: All shared URLs will be appended with UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`) for marketing analysis.
- **Icons**: New social icons (Facebook, Instagram) will be added to the `@dezkareid/icons` package to ensure consistent branding.

### Problem Reporting
- **Component**: A `ReportProblem` widget will be added globally to the `RootLayout`.
- **Visibility**: Controlled by a `useUser` hook (or equivalent) to ensure it's only visible to authenticated users.
- **Action**: Initially, it will trigger a `mailto:` link with a pre-filled subject and body containing contextual information (current URL).

## Implementation Phases

### Phase 1: Design System & Assets
1. **Add missing icons**: Add `facebook.svg` and `instagram.svg` to `design-system/icons/src/svg/`.
2. **Rebuild icons package**: Ensure the new icons are exported and available for use in the application.

### Phase 2: Social Sharing Logic
1. **Create `SocialShare` component**:
    - Implement Web Share API detection and invocation.
    - Implement a fallback dropdown menu for desktop browsers.
    - Create a utility function for generating UTM-tagged URLs.
2. **Implement "Copy Link" strategy**:
    - Use `navigator.clipboard` with a visual "Copied!" feedback (toast or tooltip).
3. **Integration**:
    - Add sharing buttons to Profile (`[username]/page.tsx`), Collection (`[username]/[collectionSlug]/page.tsx`), and Item pages.

### Phase 3: Problem Reporting
1. **Create `ReportProblemButton`**:
    - Floating fixed position (bottom-right).
    - Styling using `@dezkareid/design-tokens` and `@dezkareid/components`.
2. **Authentication Check**: Integrate with the app's auth state to show/hide the button.
3. **Global Integration**: Add the component to `apps/collectstory/app/layout.tsx`.

## Technical Dependencies
- **Web Share API**: Native browser API for mobile/modern desktop sharing.
- **`navigator.clipboard`**: For "Copy Link" functionality.
- **`@dezkareid/icons`**: For social and action icons.
- **`@dezkareid/components`**: For Button and layout primitives.

## Risks & Mitigations
- **Web Share API Availability**: Mitigated by providing robust platform-specific fallback links and "Copy Link" options.
- **Design System Consistency**: Mitigated by adding missing icons to the central package instead of hardcoding them in the app.
- **Spam/Misuse of Reporting**: Mitigated by restricting the reporting mechanism to authenticated users only.

## Out of Scope
- Backend storage for problem reports (initial version is email-based).
- Automatic screenshot capture for problem reports.
- Advanced social analytics integration beyond UTM parameters.
