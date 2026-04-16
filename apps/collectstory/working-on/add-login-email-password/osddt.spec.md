# Feature Specification: Email & Password Authentication

## Overview

Collectstory currently supports account creation and login exclusively through Google OAuth. This feature adds email and password as a second authentication strategy, giving users who prefer not to link a Google account a way to register and sign in independently.

The feature must integrate with the existing Supabase Auth setup, preserve the current Google OAuth flow untouched, and meet the same security and accessibility standards applied across the product.

## Business Context

### Alignment with Company Outcomes

- **User Base Growth (Innovation & Growth)**: Offering email/password as an alternative removes a barrier for users who are unwilling or unable to sign in with Google, directly supporting the 50% user-base expansion goal for Collectstory.
- **High-Quality User Experience**: The new authentication flow must be fast, accessible, and consistent with the existing design — in line with the "High Quality" performance rating and 100% accessibility compliance targets.
- **Efficiency & Velocity**: Reusing Supabase Auth's native email/password provider avoids introducing new dependencies or custom credential management, keeping the implementation minimal and maintainable.

### Alignment with Architecture Principles

- **Simplicity over Complexity**: Supabase's built-in email/password provider handles credential hashing, token issuance, and session management — no custom auth logic needed.
- **Statelessness and Modularity**: The new strategy slots into the existing session model (cookie-based JWT managed by `@supabase/ssr`) without altering session handling.
- **Documentation as a Primary Artifact**: All new routes, actions, and flows must be documented alongside the code.

## Session Context

The following decisions were made during the planning session and are recorded here to remove ambiguity from the spec:

- **Single combined form**: The `/login` page will present a single email/password form that handles both sign-in and sign-up — not separate tabs or views. The same form is used for both actions; the system determines whether to create or authenticate based on whether the email is already registered, or via explicit action buttons ("Sign in" / "Create account").
- **No email confirmation gate**: Users are granted access immediately after signing up, without waiting for email confirmation. The confirmation email is still sent (for security and deliverability verification) but does not block access.
- **Dedicated password reset route**: The password reset flow lives at a dedicated `/reset-password` page, not inline on `/login`.

## Requirements

### Sign Up

1. A user can create a new account by providing an email address and a password from the `/login` page.
2. The system must validate that the email is well-formed before submission.
3. The system must enforce a minimum password length (at least 8 characters).
4. After a successful sign-up, the user is signed in immediately and redirected to `/profile/edit` — no email confirmation is required to access the app.
5. A confirmation email is still sent after sign-up for security purposes, but it does not gate access.
6. If the email is already registered (via email/password or Google), the system informs the user without revealing which provider was used.

### Sign In

7. A user with an existing email/password account can sign in by entering their email and password from the `/login` page.
8. The system must display a clear error message when credentials are invalid, without specifying whether the email or the password is wrong.
9. After a successful sign in, the user is redirected to their profile — matching the existing post-login behaviour for Google OAuth users.

### Password Reset

10. A user who has forgotten their password can follow a "Forgot password?" link from `/login` to `/reset-password`.
11. On `/reset-password`, the user enters their registered email address to receive a reset link.
12. The system sends a password reset email with a secure, time-limited link.
13. Following the reset link, the user lands on `/reset-password` (or a dedicated confirmation step) and can set a new password.
14. After setting a new password, the user is signed in automatically and redirected.

### Login Page Integration

15. The existing `/login` page presents both "Continue with Google" and the email/password form within a single, unified view.
16. The UI for both strategies must be visually consistent with the existing design system.

### Profile Creation

17. Upon first sign-in, an email/password user is redirected to `/profile/edit` to set their username — the same onboarding flow used for Google OAuth users.
18. The user's profile row in the `profiles` table is created automatically, consistent with the existing `handle_new_user` database trigger.

## Scope

### In Scope

- Combined email/password sign-in and sign-up form on the `/login` page
- Immediate post-signup access (no confirmation gate)
- Confirmation email sent on signup (Supabase-managed, informational only)
- Dedicated `/reset-password` page for password reset request and new password entry
- Integration with the existing `profiles` trigger and onboarding redirect
- Error states and validation feedback on all forms

### Out of Scope

- Magic link (passwordless email) sign-in
- Social providers beyond Google (e.g. GitHub, Apple)
- Changing a password from the account settings page (can be a separate feature)
- Account merging between a Google OAuth account and an email/password account sharing the same email
- Admin-initiated password reset or forced password change

## Acceptance Criteria

1. A new visitor can complete sign-up with a valid email and password and is immediately redirected to `/profile/edit` — no confirmation step required.
2. A confirmation email is received after sign-up (verified via email client), but the user can use the app without clicking it.
3. A returning user can sign in with existing email/password credentials and is redirected to their profile.
4. Submitting an invalid email or a password shorter than 8 characters shows a clear validation error before the form is submitted.
5. Submitting wrong credentials on sign-in shows an error that does not reveal which field is incorrect.
6. Clicking "Forgot password?" on `/login` navigates the user to `/reset-password`.
7. Submitting a registered email on `/reset-password` sends a reset link within a reasonable time.
8. Following the reset link, entering a new password, and submitting signs the user in and redirects them correctly.
9. The `/login` page renders both the Google OAuth button and the email/password form in a single unified view; existing Google OAuth behaviour is unchanged.
10. All new forms meet accessibility standards: keyboard navigable, screen-reader friendly labels, visible focus states, and no critical/serious axe-core violations.
