# Task List: Email & Password Authentication

## Dependencies

```
Phase 1 → Phase 2 → Phase 3 → Phase 4
                            → Phase 5
                            → Phase 6
Phase 4, 5, 6 → Phase 7 → Phase 8
```

---

## Phase 1 — Supabase Auth Configuration

> **Definition of Done**: Supabase project accepts email/password signups; `handle_new_user` trigger confirmed to fire for all providers; no email confirmation gate.

- [x] [S] Verify `handle_new_user` trigger exists and fires on all `auth.users` inserts via `mcp__supabase__execute_sql`
- [x] [S] Confirm email provider is enabled and `email_confirm_required` is `false` via Supabase MCP / dashboard check
- [x] [S] Verify no RLS changes needed for `profiles` table (email/password users follow same trigger path as OAuth)

---

## Phase 2 — Server Actions: Sign-in, Sign-up, Reset

> **Definition of Done**: All four Server Actions exist, return typed results, use `unstable_rethrow` around `redirect()`, and authenticate the session before any mutation.

- [x] [M] Add `signInWithEmail(formData)` to `app/login/actions.ts` — calls `supabase.auth.signInWithPassword`, returns generic error on failure, redirects on success
- [x] [M] Add `signUpWithEmail(formData)` to `app/login/actions.ts` — calls `supabase.auth.signUp`, maps "already registered" error to generic message, redirects to `/profile/edit` on success
- [x] [S] Create `app/reset-password/actions.ts` with `requestPasswordReset(formData)` — calls `supabase.auth.resetPasswordForEmail`, always returns success (no email enumeration)
- [x] [M] Add `updatePassword(formData)` to `app/reset-password/actions.ts` — requires active session, calls `supabase.auth.updateUser({ password })`, redirects on success

---

## Phase 3 — FSD Feature Slice: `src/features/auth-email/`

> **Definition of Done**: All three UI components export from `index.ts`; BEM + OOCSS CSS conventions followed; no hardcoded colors or spacing; `useActionState` used for all server-action-driven forms.

- [x] [M] Create `src/features/auth-email/ui/EmailPasswordForm.tsx` — single form with email + password fields, two submit buttons (`signin` / `signup`), `useActionState` dispatcher, `aria-live` error region, "Forgot password?" link
- [x] [M] Create `src/features/auth-email/ui/EmailPasswordForm.module.css` — BEM classes (`auth-form`, `auth-form__field`, `auth-form__actions`, `auth-form__divider`, `auth-form__error`), design token custom properties only
- [x] [M] Create `src/features/auth-email/ui/ResetPasswordRequestForm.tsx` — email field, "Send reset link" button, `useActionState` for success/error state, never reveals registration status
- [x] [S] Create `src/features/auth-email/ui/ResetPasswordRequestForm.module.css`
- [x] [M] Create `src/features/auth-email/ui/NewPasswordForm.tsx` — password + confirm fields, client-side equality check, calls `updatePassword`; dynamically imported (`next/dynamic`) since only rendered in recovery flow
- [x] [S] Create `src/features/auth-email/ui/NewPasswordForm.module.css`
- [x] [S] Create `src/features/auth-email/index.ts` — export `EmailPasswordForm`, `ResetPasswordRequestForm`, `NewPasswordForm`

---

## Phase 4 — Update `/login` Page

> **Definition of Done**: `/login` renders Google OAuth button and email/password form in a unified view; page stays `force-static`; existing Google OAuth flow is unchanged.

- [x] [S] Update `app/login/page.tsx` — import `EmailPasswordForm` from FSD public API; render below Google button with a visual divider; RSC boundary stays clean
- [x] [M] Update `app/login/login.module.css` — add divider styles (`.login__divider`) and layout adjustments for the expanded form; BEM + design tokens only

---

## Phase 5 — New `/reset-password` Page

> **Definition of Done**: `/reset-password` shows request form by default; switches to new-password form when URL hash contains `type=recovery`; `generateMetadata` exported; page is `force-static`.

- [x] [M] Create `app/reset-password/page.tsx` — SSG (`force-static`), renders `ResetPasswordRequestForm` and dynamically imports `NewPasswordForm`; exports `generateMetadata` with `title: 'Reset Password'`
- [x] [S] Create `app/reset-password/page.module.css` — layout styles for the reset page container
- [x] [M] Implement recovery-mode detection in a `'use client'` wrapper component — reads `window.location.hash` on mount, listens to `supabase.auth.onAuthStateChange` for `PASSWORD_RECOVERY` event as Safari fallback, exchanges token, shows `NewPasswordForm`

---

## Phase 6 — Change Password (Account Settings)

> **Definition of Done**: `ChangePasswordForm` is visible on `/profile/edit` only for email/password users; `changePassword` action authenticates the session and calls `supabase.auth.updateUser`; form shows success/error feedback via `useActionState`.

- [x] [M] Add `changePassword(formData)` Server Action to `app/profile/edit/actions.ts` — `getSessionAndRole()` first, verify `email` identity exists on the user, call `supabase.auth.updateUser({ password })`, return typed result
- [x] [M] Create `src/features/auth-email/ui/ChangePasswordForm.tsx` — new-password + confirm-password fields (client equality check), `useActionState` for feedback; no current-password field (session proves identity)
- [x] [S] Create `src/features/auth-email/ui/ChangePasswordForm.module.css` — same BEM pattern as other auth forms
- [x] [S] Export `ChangePasswordForm` from `src/features/auth-email/index.ts`
- [x] [M] Update `app/profile/edit/page.tsx` — fetch `user.identities` server-side, conditionally render `ChangePasswordForm` section only when user has an `email` provider identity

---

## Phase 7 — Accessibility & Quality Audit

> **Definition of Done**: Zero critical/serious axe-core violations on `/login`, `/reset-password`, and `/profile/edit` (change password section); keyboard navigation confirmed; screen reader labels verified.

- [x] [S] Audit all form fields: explicit `<label for>` / `id` pairing on every input across all three pages
- [x] [S] Add `aria-describedby` linking error messages to their respective inputs in all forms
- [x] [S] Verify `aria-live="polite"` region present and announces server-side errors after submission
- [x] [S] Confirm visible `:focus-visible` states on all interactive elements (inputs, buttons, links) using design token values
- [x] [M] Run axe-core audit on `/login` via `mcp__chrome-user-session__evaluate_script` — fix any critical/serious violations
- [x] [M] Run axe-core audit on `/reset-password` via `mcp__chrome-user-session__evaluate_script` — fix any critical/serious violations
- [x] [M] Run axe-core audit on `/profile/edit` (change password section) via `mcp__chrome-user-session__evaluate_script` — fix any critical/serious violations

---

## Phase 8 — Changeset

> **Definition of Done**: A changeset file exists under `.changeset/` committed with the PR; bump type is `minor`.

- [x] [S] Run `pnpm changeset` from monorepo root — select `@dezkareid/collectstory`, bump `minor`, summary: "Add email/password authentication with sign-in, sign-up, password reset, and change-password flows alongside existing Google OAuth"
