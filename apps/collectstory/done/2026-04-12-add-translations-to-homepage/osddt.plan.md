# Implementation Plan: Internationalization for Homepage and User Collections

## Architecture Overview
The application uses **Next.js 16** and **next-intl** with a `[locale]` based routing structure. Translations are managed via JSON files in the `messages/` folder. We will adopt a **prop-based i18n strategy** for Design System components: components will remain agnostic of the i18n implementation, receiving translated strings directly via their existing props (e.g., `label`, `title`, `description`).

### Key Technical Decisions
- **Next-intl Integration**: Utilize `getTranslations` (server) and `useTranslations` (client) hooks to fetch strings from `en.json` and `es.json`.
- **Component Signature Refactor**: Ensure components in `apps/collectstory` are updated to match the Design System's signature (e.g., removing any internal hardcoded text and exposing necessary string props).
- **Fallback Logic**: Rely on `next-intl`'s built-in fallback mechanisms for any missing keys, following the silent fallback strategy for user-generated content defined in the spec.

## Implementation Phases

### Phase 1: Audit & Mapping
- **Goal**: Identify all hardcoded strings and map them to existing or new translation keys.
- [ ] Scan `apps/collectstory/app/[locale]/page.tsx` (homepage) for hardcoded text.
- [ ] Scan `apps/collectstory/app/[locale]/[username]/page.tsx` (user collections) for hardcoded text.
- [ ] Check `messages/en.json` and `messages/es.json` for existing keys under `Common`, `Home`, or `Collection` namespaces.

### Phase 2: Message Update
- **Goal**: Standardize the message JSON structure and add missing translations.
- [ ] Create/Update the `Home` namespace in `messages/*.json` for homepage-specific strings.
- [ ] Create/Update the `Collection` namespace for user collection specific strings (e.g., "Views", "Last updated").
- [ ] Ensure Spanish (default) and English translations are synchronized.

### Phase 3: Homepage Refactor
- **Goal**: Localize the homepage and align component signatures.
- [ ] Update `apps/collectstory/app/[locale]/page.tsx` to use `next-intl` functions.
- [ ] Pass translated strings as props to Design System components (`Button`, `Card`, etc.).

### Phase 4: User Profile Page Refactor
- **Goal**: Localize the user profile page.
- [x] Update `apps/collectstory/app/[locale]/[username]/page.tsx`.

### Phase 5: Collection Detail Page Refactor
- **Goal**: Localize the collection listing page.
- [ ] Update `apps/collectstory/app/[locale]/[username]/[collectionSlug]/page.tsx`.
- [ ] Localize metadata, breadcrumbs, and empty state.

### Phase 6: Item Detail Page Refactor
- **Goal**: Localize the individual item page.
- [ ] Update `apps/collectstory/app/[locale]/[username]/[collectionSlug]/[slug]/page.tsx`.
- [ ] Localize metadata, breadcrumbs, tags, and item details (e.g., "Brand", "Acquired on").

### Phase 7: Verification
- [ ] Verify homepage rendering for `/en` and `/es`.
- [ ] Verify user collection page rendering for `/en/[username]` and `/es/[username]`.
- [ ] Ensure no hydration errors occur due to locale mismatches.

## Technical Dependencies
- `next-intl`: Core i18n library.
- `@dezkareid/design-tokens`: For theme-related constants.
- `@dezkareid/components/react`: Target components for refactoring.

## Risks & Mitigations
- **Risk**: Hydration errors if server-side locale detection differs from client-side.
  - **Mitigation**: Use `next-intl` standard middleware and layout patterns for consistent locale propagation.
- **Risk**: Missing translations in one of the languages.
  - **Mitigation**: Implement a check to ensure `en.json` and `es.json` share the same key structure.

## Out of Scope
- Localization of the `admin` dashboard.
- Any changes to `middleware.ts` or `i18n.ts` (as the core config is already done).
- Dynamic translation of user-inputted item metadata.
