# Task List: Internationalization for Homepage and User Collections

## Phase 1: Audit & Mapping
- [x] [S] Scan `apps/collectstory/app/[locale]/page.tsx` for hardcoded text and map to translation keys.
- [x] [S] Scan `apps/collectstory/app/[locale]/[username]/page.tsx` for hardcoded text and map to translation keys.
- [x] [S] Audit `messages/en.json` and `messages/es.json` to identify existing reusable strings and gaps.

**Definition of Done**: All hardcoded UI strings in the target pages are identified and mapped to a namespace/key structure.

## Phase 2: Message Update
- [x] [S] Implement `Home` and `Collection` namespaces in `apps/collectstory/messages/en.json`.
- [x] [S] Implement `Home` and `Collection` namespaces in `apps/collectstory/messages/es.json`.
- [x] [S] Synchronize keys between English and Spanish translation files to prevent missing translation errors.

**Definition of Done**: `en.json` and `es.json` contain all necessary keys and values for the homepage and user collection pages.

## Phase 3: Homepage Refactor
- [x] [M] Refactor `apps/collectstory/app/[locale]/page.tsx` to use `next-intl` (using `getTranslations` for server components).
- [x] [S] Update homepage component calls to pass translated strings into props, matching Design System signatures.

**Definition of Done**: The homepage (`/`) renders fully localized text from the message files without hardcoded strings in the component source.

## Phase 4: User Profile Page Refactor
- [x] [M] Refactor `apps/collectstory/app/[locale]/[username]/page.tsx` to use `next-intl`.
- [x] [S] Update user collection component calls to pass translated strings as props.
- [x] [S] Implement proper pluralization and date/number formatting for collection statistics (e.g., "1 item" vs "2 items").

**Definition of Done**: The user profile page is fully localized.

## Phase 5: Collection Detail Page Refactor
- [x] [M] Refactor `apps/collectstory/app/[locale]/[username]/[collectionSlug]/page.tsx` to use `next-intl`.
- [x] [S] Localize metadata and breadcrumbs.
- [x] [S] Update empty state and social share title.

**Definition of Done**: The collection detail page is fully localized.

## Phase 6: Item Detail Page Refactor
- [x] [M] Refactor `apps/collectstory/app/[locale]/[username]/[collectionSlug]/[slug]/page.tsx` metadata and server components.
- [x] [S] Localize breadcrumbs and dynamic titles.
- [x] [S] Update tags and meta labels ("Brand", "Franchise", etc.) using translations.
- [x] [S] Localize "Acquired on" date and social share strings.

**Definition of Done**: The item detail page is fully localized, including metadata, SEO schemas, and breadcrumbs.

## Phase 7: Verification

- [x] [S] Manually verify the homepage renders correctly in both English (`/en`) and Spanish (`/`).
- [x] [S] Manually verify the user collection page renders correctly in both languages.
- [x] [S] Verify no hydration warnings or console errors related to `next-intl` or locale mismatches.

**Definition of Done**: All localized routes are verified to work as expected across supported locales.

## Dependencies
- Phase 2 (Message Update) requires the audit from Phase 1.
- Phase 3 & 4 (Refactoring) require the translation keys to be present (Phase 2).
- Phase 5 (Verification) requires all implementation work to be complete.
