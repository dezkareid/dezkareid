# Implementation Plan: Email & Password Authentication

## Architecture Overview

### Guiding Principles

- **Supabase Auth native provider** — use `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()` directly; no custom credential logic.
- **Server Actions only** — all auth mutations (sign-up, sign-in, reset) go through `app/**/actions.ts`; no Route Handlers added.
- **SSG login page preserved** — `/login` stays `force-static`. The email/password form is a Client Component that calls Server Actions via `useFormState` / `useActionState`.
- **FSD placement** — the email/password form belongs in `src/features/auth-email/`; shared form primitives (input, label) stay in `src/shared/ui/` only if reused elsewhere.
- **No new dependencies** — all auth logic uses the existing `@supabase/ssr` setup; validation is done with native HTML5 + server-side checks.
- **CSS Modules + design tokens** — BEM naming, OOCSS structure/skin separation, CSS custom properties only.
- **Supabase MCP** — all database/auth config changes (enabling email provider, disabling confirmation gate) are applied via `mcp__supabase__*` tools, not manual dashboard edits.

### Key Technical Decisions

| Decision | Choice | Reason |
|---|---|---|
| Sign-in vs sign-up discrimination | Two explicit submit buttons in one form ("Sign in" / "Create account") | Spec mandates single combined form with explicit action |
| Validation | HTML5 `required`/`minlength` + server-side Supabase error mapping | Progressive enhancement; no JS dependency for basic validation |
| Confirmation gate | Disabled in Supabase Auth settings | Spec: users get immediate access post-signup |
| Password reset entry point | Dedicated `/reset-password` page | Spec decision; simpler than inline flow |
| Reset link landing | Same `/reset-password` page with `?type=recovery` hash param | Supabase sends `#access_token&type=recovery` — detected client-side to show new-password step |
| Error messages | Generic ("Invalid credentials") | Spec: do not reveal which field is wrong |
| Post-signup redirect | `/profile/edit` | Matches existing Google OAuth onboarding flow |
| Post-signin redirect | Profile page or `?next=` param | Matches existing OAuth callback behaviour |
| RSC boundary | Form is `'use client'`; page stays Server Component | Form needs `useActionState` for progressive error display |

---

## Implementation Phases

### Phase 1 — Supabase Auth Configuration (via MCP)

**Goal**: Enable email/password provider and configure confirmation settings without blocking access.

**Steps**:

1. Use `mcp__supabase__execute_sql` to verify the `handle_new_user` trigger exists and will fire for email/password signups (same as OAuth).
2. Use `mcp__supabase__search_docs` / Supabase MCP to confirm email provider is enabled and `email_confirm_required` is `false`.
3. Apply any required Auth config changes via `mcp__supabase__apply_migration` (e.g., disabling the confirmation gate if it's schema-controlled) or note that it must be toggled in the Supabase dashboard Auth settings (Email → Confirm email: OFF).
4. Verify no RLS changes are needed — `profiles` trigger auto-creates the row; email/password users follow the same path as OAuth users.

**Output**: Supabase project accepts email/password signups and grants immediate sessions.

---

### Phase 2 — Server Actions: Sign-in, Sign-up, Reset

**Goal**: All auth mutations in `app/login/actions.ts` and `app/reset-password/actions.ts`.

**Files to create/modify**:

- `app/login/actions.ts` — add `signInWithEmail` and `signUpWithEmail` actions
- `app/reset-password/actions.ts` — add `requestPasswordReset` and `updatePassword` actions

**`signInWithEmail(formData)`**:
```ts
'use server'
// 1. getSessionAndRole() — skip if already signed in? Or allow re-auth
// 2. supabase.auth.signInWithPassword({ email, password })
// 3. On error → return { error: 'Invalid email or password.' }
// 4. On success → redirect(postLoginUrl) — same as OAuth callback
```

**`signUpWithEmail(formData)`**:
```ts
'use server'
// 1. supabase.auth.signUp({ email, password, options: { emailRedirectTo } })
// 2. On error (user already exists) → return { error: 'An account with this email already exists.' }
// 3. On success → redirect('/profile/edit')
```

**`requestPasswordReset(formData)`**:
```ts
'use server'
// 1. supabase.auth.resetPasswordForEmail(email, { redirectTo: '/reset-password' })
// 2. Always return success (do not reveal if email is registered)
// 3. Redirect or return { success: true } to show confirmation message
```

**`updatePassword(formData)`**:
```ts
'use server'
// 1. Requires active session (user clicks reset link → Supabase sets session via URL hash)
// 2. supabase.auth.updateUser({ password })
// 3. On success → redirect('/collection') or profile
```

**React best practices applied**:
- `server-auth-actions`: authenticate (check session) before any mutation.
- `async-parallel`: independent reads use `Promise.all`.
- Use `unstable_rethrow` inside any `try/catch` that wraps `redirect()` (Next.js requirement).

---

### Phase 3 — FSD Feature Slice: `src/features/auth-email/`

**Goal**: Client Component form that progressively enhances with `useActionState`.

**Slice structure**:
```
src/features/auth-email/
├── ui/
│   ├── EmailPasswordForm.tsx       # Combined sign-in / sign-up form
│   ├── EmailPasswordForm.module.css
│   ├── ResetPasswordRequestForm.tsx  # Email input → request reset link
│   ├── ResetPasswordRequestForm.module.css
│   ├── NewPasswordForm.tsx         # New password entry (after reset link)
│   └── NewPasswordForm.module.css
└── index.ts                        # Public API exports
```

**`EmailPasswordForm` behaviour**:
- Single `<form>` with email + password fields.
- Two submit buttons: `name="action" value="signin"` and `name="action" value="signup"`.
- `useActionState` wraps a dispatcher that routes to `signInWithEmail` or `signUpWithEmail` based on the `action` field.
- Inline error messages rendered from action state (`aria-live="polite"` region).
- "Forgot password?" link → `/reset-password`.
- Divider between Google OAuth button and this form (visual separator, no logic).

**CSS conventions (BEM + OOCSS)**:
```css
/* Structure */
.auth-form { }
.auth-form__field { }
.auth-form__actions { }
.auth-form__divider { }
/* Skin */
.auth-form__error { color: var(--color-error); }  /* TODO(design-system): needs --color-error token */
.auth-form__input { border: 1px solid var(--color-border); border-radius: var(--border-radius-small); }
```

**`ResetPasswordRequestForm` behaviour**:
- Email field + "Send reset link" button.
- On success: show confirmation message ("Check your inbox").
- On error: generic message (never reveal registration status).

**`NewPasswordForm` behaviour**:
- Rendered when URL contains `?type=recovery` hash — detected via `useEffect` reading `window.location.hash`.
- Password + confirm-password fields (client-side equality check before submit).
- Calls `updatePassword` action on submit.

**React best practices applied**:
- `rerender-no-inline-components`: no component definitions inside render.
- `rerender-derived-state-no-effect`: derive "is recovery mode" from URL once, not in ongoing effects.
- `rendering-conditional-render`: use ternary for show/hide, not `&&` with non-boolean left side.
- `bundle-dynamic-imports`: `NewPasswordForm` is dynamically imported since it only renders in recovery flow.

---

### Phase 4 — Update `/login` Page

**Goal**: Integrate `EmailPasswordForm` alongside existing Google OAuth button.

**Files to modify**:
- `app/login/page.tsx` — import and render `EmailPasswordForm` below the Google button
- `app/login/login.module.css` — add divider and layout styles

**Layout**:
```
┌─────────────────────────────┐
│  [Continue with Google]     │
│  ─────── or ────────        │
│  Email ___________________  │
│  Password ________________  │
│  [Sign in]  [Create account]│
│  Forgot password?           │
└─────────────────────────────┘
```

**Next.js best practices applied**:
- Page stays `force-static`; form is `'use client'` — RSC boundary is clean.
- No `useSearchParams` at the page level (would force dynamic rendering); if a `?next=` redirect is needed, it's read inside the Server Action via `headers()`.
- Metadata unchanged (no new `generateMetadata` needed for login page).

---

### Phase 5 — New `/reset-password` Page

**Goal**: Dedicated route for both password reset request and new-password entry.

**Files to create**:
- `app/reset-password/page.tsx` — SSG (`force-static`); renders `ResetPasswordRequestForm` and conditionally `NewPasswordForm`
- `app/reset-password/page.module.css`
- `app/reset-password/actions.ts` — `requestPasswordReset`, `updatePassword`

**Routing logic**:
- By default: shows `ResetPasswordRequestForm`.
- When Supabase reset link is followed, the URL hash contains `#access_token=...&type=recovery`. A `'use client'` component reads the hash on mount, exchanges the token for a session (`supabase.auth.setSession` or `supabase.auth.exchangeCodeForSession` depending on PKCE), then shows `NewPasswordForm`.

**Next.js best practices applied**:
- Page is SSG; session exchange happens client-side after hydration (hash is not sent to server).
- `generateMetadata` added for the reset page (`title: 'Reset Password'`).
- `forbidden` / `unauthorized` from `next/navigation` used if `updatePassword` is called without a valid session.

---

### Phase 6 — Change Password (Account Settings)

**Goal**: Allow authenticated users to change their password from the profile/account settings area.

**Files to create/modify**:
- `src/features/auth-email/ui/ChangePasswordForm.tsx` — `'use client'` form with current-password + new-password + confirm fields
- `src/features/auth-email/ui/ChangePasswordForm.module.css`
- `app/profile/edit/actions.ts` — add `changePassword` Server Action (file already exists)
- `app/profile/edit/page.tsx` — render `ChangePasswordForm` below existing profile fields (only for email/password users; hide for Google OAuth-only users)

**`changePassword(formData)` Server Action**:
```ts
'use server'
// 1. getSessionAndRole() — throw if unauthenticated
// 2. Verify user has email/password provider (check identities list on the user object)
// 3. supabase.auth.updateUser({ password: newPassword })
// 4. On success → return { success: true } / revalidatePath('/profile/edit')
// 5. On error → return { error: 'Could not update password.' }
```

**`ChangePasswordForm` behaviour**:
- New-password + confirm-password fields (client-side equality check before submit).
- Current password field is NOT required — Supabase `updateUser` does not re-verify the old password; the active session is the proof of identity.
- `useActionState` for server error/success feedback.
- Conditionally rendered: only shown when the authenticated user has an `email` identity (not exclusively a Google OAuth user). Provider check done in the Server Component page via `supabase.auth.getUser()` → `user.identities`.

**CSS conventions**: same BEM + OOCSS pattern as other auth forms in this feature.

**React / Next.js best practices applied**:
- `server-auth-actions`: `getSessionAndRole()` first in the action.
- Page section stays in Server Component; form is `'use client'` with minimal state.
- `rendering-conditional-render`: ternary to show/hide the section, not `&&`.

---

### Phase 7 — Accessibility & Quality Audit (was Phase 6)

**Goal**: Zero critical/serious axe-core violations on `/login` and `/reset-password`.

**Checklist**:
- All form fields have associated `<label>` elements (explicit `for`/`id` pairing).
- Error messages linked to inputs via `aria-describedby`.
- Live region (`aria-live="polite"`) announces server-side errors after form submission.
- Both submit buttons have clear, descriptive text.
- Focus management: after form error, focus moves to first error or error summary.
- Keyboard navigation: Tab order is logical; no focus traps.
- Visible focus states on all interactive elements (`:focus-visible` with design token outline).
- Run axe-core audit via `mcp__chrome-user-session__evaluate_script` before closing the feature.

**Skills to invoke**: `web-quality:accessibility`

---

### Phase 8 — Changeset

**Goal**: Record the change for versioning.

- Run `pnpm changeset` from monorepo root.
- Select `@dezkareid/collectstory`, bump: `minor` (new user-facing feature).
- Summary: "Add email and password authentication as an alternative to Google OAuth on the login page, with a dedicated password reset flow."

---

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| `@supabase/ssr` | Already installed | Used for `createServerClient` and `createBrowserClient` |
| Supabase Auth email provider | Config change needed | Enable in Supabase dashboard; disable confirm gate |
| `handle_new_user` trigger | Verify exists | Must fire for email/password users too |
| `@dezkareid/components/react` Button | Already available | Use for submit buttons |
| `useActionState` (React 19) | Available (React 19.2.4) | No polyfill needed |
| `next/navigation` `redirect`, `unauthorized` | Available (Next.js 16) | Used in Server Actions |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Supabase email provider disabled by default | Low | Verify with MCP before Phase 2; toggle in dashboard if needed |
| `handle_new_user` trigger not firing for email/password users | Low | Trigger fires on `auth.users` INSERT regardless of provider; verify with SQL query |
| Hash-based recovery token detection fails on Safari | Medium | Use `supabase.auth.onAuthStateChange` as fallback to detect `PASSWORD_RECOVERY` event |
| `force-static` on `/login` conflicts with Server Action redirect | None | Server Actions can redirect regardless of page rendering mode |
| "Already registered" error reveals provider type | Medium | Map Supabase error codes to generic messages; do not expose raw error strings |
| Reset email goes to spam | Low | Supabase default sender domain; user-facing guidance to check spam |

---

## Out of Scope

- Magic link (passwordless email) sign-in
- GitHub, Apple, or other social providers
- Account merging (Google + email/password sharing same email)
- Admin-initiated password reset
- Rate limiting or CAPTCHA on auth forms (handled by Supabase)
- Custom email templates (use Supabase defaults)
