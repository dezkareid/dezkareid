# Implementation Plan: Custom Error Pages (404 & 500)

We will implement branded error pages for the `collectstory` application using Next.js conventions (`not-found.tsx` and `error.tsx`) and the existing design system.

## User Review Required

> [!IMPORTANT]
> - We will use `next-intl` for translations on the error pages.
> - The 500 error page (`error.tsx`) will be a Client Component as required by Next.js.
> - The 404 page (`not-found.tsx`) will be placed within the `[locale]` group to maintain brand consistency and localization.

- **Proposed Error Page Design**:
    - **404 Page**: Large "404" heading, clear "Not Found" message, "Back to Home" button, and a "Recommended Links" section (Home, Browse).
    - **500 Page**: "Something went wrong" heading, polite apology, "Retry" button (client-side reload), "Report a problem" button (link to contact/support), and "Back to Home" button.

## Proposed Changes

### Internationalization (`apps/collectstory/messages/`)

#### [NEW] Add Error translations to `en.json` and `es.json`
- Add a new `Error` namespace with `NotFound` and `ServerError` keys.

### Components (`apps/collectstory/components/`)

#### [NEW] `ErrorLayout.tsx`
- A shared layout component for error pages to ensure consistent styling.
- Uses `@dezkareid/components` and existing styles.

### Application Routes (`apps/collectstory/app/[locale]/`)

#### [NEW] `not-found.tsx`
- Custom 404 page.
- Uses `next-intl` for localized content.

#### [NEW] `error.tsx`
- Custom 500 page (Client Component).
- Receives `error` and `reset` props from Next.js.
- Implements the "Retry" logic using the `reset` function.

## Verification Plan

### Automated Tests
- **Unit Tests**: Test the `ErrorLayout` component with different props.
- **Integration Tests**: Verify that `not-found.tsx` and `error.tsx` render correctly with localized strings.

### Manual Verification
1. **Test 404**: Navigate to a non-existent URL (e.g., `/en/this-does-not-exist`) and verify the custom 404 page is displayed.
2. **Test 500**: Temporarily throw an error in a page component (e.g., `app/[locale]/page.tsx`) and verify the custom 500 page is displayed.
3. **Verify Links**: Check that the "Back to Home", "Retry", and "Report a problem" buttons work as expected.
4. **Verify Localization**: Switch languages and ensure error messages are translated.
