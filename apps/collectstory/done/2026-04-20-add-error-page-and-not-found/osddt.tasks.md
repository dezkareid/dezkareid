# Tasks: Custom Error Pages (404 & 500)

## Phase 1: Preparation & I18n
- [x] [S] Add error translations for English in `messages/en.json`
- [x] [S] Add error translations for Spanish in `messages/es.json`

## Phase 2: Components
- [x] [M] Create `ErrorLayout` component for shared error page structure and styling
- [x] [S] Add unit tests for `ErrorLayout`

## Phase 3: Routing & Implementation
- [x] [M] Implement `app/[locale]/not-found.tsx` for custom 404 handling
- [x] [M] Implement `app/[locale]/error.tsx` for custom 500 handling (Client Component)

## Phase 4: Verification
- [x] [M] Add integration tests for 404 and 500 pages
- [x] [S] Manual verification of 404 page behavior and styling
- [x] [S] Manual verification of 500 page behavior, "Retry" functionality, and "Report a problem" link
- [x] [S] Verify localization on both error pages

## Dependencies
- Phase 1 must be completed before Phases 3 and 4.
- `ErrorLayout` (Phase 2) must be implemented before the specific error pages in Phase 3.

## Definition of Done
### Phase 1 & 2
- Translations are available for all planned error messages.
- `ErrorLayout` is styled consistently with the application and passes its unit tests.

### Phase 3 & 4
- Navigating to a non-existent URL correctly triggers the branded 404 page.
- Application errors trigger the branded 500 page with functional "Retry" and "Report" actions.
- All tests pass, and manual verification confirms correct behavior across languages.
