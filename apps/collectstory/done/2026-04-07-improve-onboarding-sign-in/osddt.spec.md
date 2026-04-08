# Feature Spec: Improve Onboarding & Sign In

## Overview

New users arriving at Collectstory have no clear path to start building their collection. When a user visits their profile page (`/<username>`) with no collections, they see a generic empty message with no call to action. Additionally, after signing in, users are not returned to where they came from — they always land on a fixed page regardless of context.

This feature improves the new-user experience by: (1) showing an encouraging empty state on `/<username>` with a quick-start form to create a first collection and add a first item, and (2) making the sign-in flow context-aware so users return to the right place after authenticating.

---

## Business Context

This feature directly supports two strategic outcomes for Dezkareid Enterprise:

- **Innovation & Growth** — Expanding the Collectstory user base by 50% requires reducing friction at the very first moment a user tries to engage. An empty profile with no guidance is a drop-off point; an actionable empty state converts visitors into active collectors.
- **High-Quality User Experience** — The onboarding moment is the most critical UX touchpoint. Providing a clear, focused path to create a first collection aligns with the goal of delivering products that are easy to discover and use.

Architecture alignment: The solution must remain simple (no over-engineering), accessible (WCAG-compliant), and performant.

---

## Requirements

### 1. Profile Empty State — Onboarding CTA

**When** an authenticated user who owns the profile visits `/<username>` and has **no collections**, the page must:

1. Display a motivating empty state (replacing the current plain "No public collections yet" message) that communicates the value of starting a collection.
2. Show a primary call-to-action button labelled **"Add your first item"** (or equivalent) that opens a quick-start form.

**When** the quick-start form is opened:

3. The form must contain:
   - A **collection name** field (text input, required) — the name of the new collection to create.
   - An **item name** field (text input, required) — the name of the first item to add to that collection.
4. On submission, the system must:
   - Create a new collection with the provided name (assigned to the current user).
   - Create a new item with the provided name inside that collection.
   - Redirect the user to the newly created collection page (`/<username>/<collectionSlug>`).
5. The form must show appropriate inline validation errors when required fields are empty.
6. The form must show a loading/submitting state while the request is in flight.

**Scope note:** This empty state and CTA are only shown to the **profile owner** when they are signed in. Visitors viewing another user's empty profile continue to see a standard (non-actionable) empty state.

---

### 2. Sign-In Redirect — Context-Aware Return

**When** a user initiates the sign-in flow:

1. If the user was on the **home page** (`/`), after successful sign-in they must be redirected to `/<username>`.
2. If the user was on **any other page**, after successful sign-in they must be returned to that same page (the page they were on when they triggered sign-in).
3. The redirect destination must survive the full OAuth round-trip (the user leaves the app and returns via the OAuth callback).

---

## Scope

### In Scope

- Empty state redesign on `/<username>` for the authenticated profile owner with no collections.
- Quick-start inline form: collection name + item name fields, create-on-submit logic, redirect on success.
- Context-aware post-sign-in redirect (home → profile, other pages → same page).
- Removal of the `/collection` route (the "My Collection" vault page) — it is no longer needed now that `/<username>` is the primary authenticated home.
- Migrating all server actions currently in `app/collection/actions.ts` to appropriate locations so dependent components continue to work after the file is removed.
- Updating all internal links, redirects, and fallback destinations that currently point to `/collection` to point to `/<username>` instead.

### Out of Scope

- Image upload in the quick-start form (users can add images later from the full item edit page).
- Collection description, visibility settings, or other metadata in the quick-start form.
- Onboarding for users who have collections but no items.
- Email/password sign-in (not currently supported).
- Onboarding tours, tooltips, or multi-step wizards.

---

## Acceptance Criteria

### Onboarding Empty State

1. **AC-1**: When a signed-in user visits their own `/<username>` page and has zero collections, an onboarding empty state is shown with a CTA button.
2. **AC-2**: When a visitor (unauthenticated or different user) views a `/<username>` page with no collections, no CTA button or form is shown.
3. **AC-3**: Clicking the CTA opens the quick-start form with a "collection name" field and an "item name" field.
4. **AC-4**: Submitting the form with both fields filled creates a new collection and a new item, then navigates to `/<username>/<newCollectionSlug>`.
5. **AC-5**: Submitting the form with an empty required field shows a validation error on that field; submission is blocked.
6. **AC-6**: While the form is submitting, the submit button is disabled and indicates loading state.
7. **AC-7**: After the collection and item are created, the `/<username>` page no longer shows the onboarding empty state.

### Sign-In Redirect

8. **AC-8**: A user who clicks "Sign In" from `/` is redirected to `/<username>` after successful authentication.
9. **AC-9**: A user who clicks "Sign In" from any page other than `/` is returned to that same page after successful authentication.
10. **AC-10**: The return URL is preserved correctly through the full OAuth callback round-trip.
11. **AC-11**: The return URL cannot redirect the user to an external domain (open-redirect protection).

### /collection Removal

12. **AC-12**: Navigating to `/collection` returns a 404 (route no longer exists).
13. **AC-13**: All links and programmatic redirects that previously pointed to `/collection` now point to `/<username>` for the authenticated user, or to `/login` for unauthenticated users.
14. **AC-14**: All functionality previously available at `/collection` (sign-out, item/collection mutations) continues to work from its new location.
15. **AC-15**: The OAuth callback no longer uses `/collection` as a fallback redirect destination.

---

## Decisions

1. **Quick-start item visibility default**: `public` — maximises discoverability and supports the growth outcome.
2. **Quick-start collection visibility default**: `public` — same reasoning as above.
3. **Sign-in trigger location**: The `SiteHeader` is currently the only sign-in entry point; context-aware redirect only needs to be applied there.
4. **Empty state design**: Include an illustration with animation to capture user attention, alongside text and the CTA button.
