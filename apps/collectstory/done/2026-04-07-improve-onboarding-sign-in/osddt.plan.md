# Implementation Plan: Improve Onboarding & Sign In

## Architecture Overview

Two independent streams with no shared implementation:

**Stream A — Context-aware sign-in redirect**
The existing OAuth flow already supports a `next` query parameter in the callback URL (`app/auth/callback/route.ts:7`). The only missing piece is that `signInWithGoogle()` does not forward any `next` value into the `redirectTo` URL. The fix is surgical: accept an optional `next` param in the action, append it to the callback URL, and thread it from the sign-in trigger in the `SiteHeader`.

**Stream B — Onboarding empty state on `/<username>`**
The profile page (`app/[username]/page.tsx`) renders a plain text empty state when `collections.length === 0`. The empty state needs to:
1. Detect whether the viewer is the profile owner (server-side auth check).
2. If owner: render an animated illustration + CTA that opens a quick-start form.
3. If visitor: render the existing plain empty state unchanged.

The quick-start form is a new Client Component (FSD: `features/quick-start-collection`) with a new Server Action that atomically creates a collection + item and redirects to the new collection page.

**No new routes, no new DB tables, no new dependencies.**

---

## Implementation Phases

### Phase 1 — Context-Aware Sign-In Redirect

**Goal:** After sign-in, users return to where they came from (or to `/<username>` when coming from `/`).

**Steps:**

1. **Update `signInWithGoogle` action** (`app/login/actions.ts`)
   - Add an optional `next: string` parameter.
   - If `next` is provided and is a valid internal path (starts with `/`, not `//`), append `?next=<encoded>` to the `redirectTo` callback URL.
   - If `next` is `/` or absent, omit the param (existing callback logic already redirects to `/<username>`).

2. **Update `SiteHeader` sign-in trigger** (`src/widgets/site-header/ui/SiteHeader.tsx` or wherever the sign-in button is rendered)
   - The sign-in trigger must read the current `pathname` from the request headers (Server Component context) or pass it through a hidden input.
   - If `pathname === '/'`, do not pass `next` (let callback default to `/<username>`).
   - Otherwise pass `next=<current-pathname>`.
   - Because `SiteHeader` is a Server Component, use `headers()` to read `x-pathname` (set by middleware) — or read the URL from the request. Verify how the current pathname is available at render time.

3. **Verify callback handler** (`app/auth/callback/route.ts`)
   - Already validates `next` for open-redirect protection (line 8-9). No changes needed.
   - Confirm the `nextParameter === '/collection'` branch still works correctly as the "no explicit next" case after the action change.

---

### Phase 2 — Onboarding Empty State (Server-side owner detection)

**Goal:** Conditionally show owner-specific UI on the profile page.

**Steps:**

1. **Add owner check to `ProfileContent`** (`app/[username]/page.tsx`)
   - Call `createClient()` + `supabase.auth.getUser()` inside `ProfileContent` (or a new async helper).
   - Compare `user?.id` to `result.userId` (already returned by `getPublicCollectionsByUsername`).
   - Pass `isOwner: boolean` as a prop to the collections renderer.

2. **Branching empty state logic**
   - If `collections.length === 0 && isOwner`: render `<OnboardingEmptyState username={username} />` (new component, Phase 3).
   - If `collections.length === 0 && !isOwner`: keep existing plain text empty state.

---

### Phase 3 — Onboarding Empty State UI

**Goal:** Illustrated, animated empty state with CTA for the profile owner.

**FSD placement:** `src/features/quick-start-collection/`

**Steps:**

1. **Create the empty state component** (`src/features/quick-start-collection/ui/OnboardingEmptyState.tsx`)
   - `'use client'` — manages open/close state of the quick-start form dialog.
   - Renders an SVG illustration (inline or imported) with a CSS animation (subtle float or fade-in).
   - Headline: e.g. "Start your first collection" with a short motivational subline.
   - CTA button: "Add your first item" — opens the quick-start form (inline or as a `<dialog>`).
   - Illustration: CSS keyframe animation via CSS Module (no JS animation library needed).

2. **Create the quick-start form** (`src/features/quick-start-collection/ui/QuickStartForm.tsx`)
   - `'use client'` — uses `useActionState` with the new Server Action (Phase 4).
   - Fields:
     - Collection name (text input, required, auto-focused)
     - Item name (text input, required)
   - Hidden fields: `username` (for redirect after success).
   - Submit button with loading state (disabled + spinner text while pending).
   - Inline field-level validation errors from action state.
   - On success: `router.push(`/${username}/${slug}`)` — the action returns the slug.

3. **CSS** (`OnboardingEmptyState.module.css`, `QuickStartForm.module.css`)
   - Use only CSS custom properties from `@dezkareid/design-tokens`.
   - Illustration animation: `@keyframes float` (gentle vertical oscillation) or `@keyframes fadeInUp`.
   - Form layout: vertical stack, comfortable spacing.
   - No hardcoded colors, spacing, or font sizes.

4. **Export from slice index** (`src/features/quick-start-collection/index.ts`)
   - Export `OnboardingEmptyState`.

---

### Phase 4 — Quick-Start Server Action

**Goal:** A single atomic Server Action that creates collection + item and returns the slug for redirect.

**Steps:**

1. **Create new Server Action** (`app/[username]/actions.ts` — new file, co-located with the profile route)
   - `'use server'`
   - `quickStartCollection(prevState, formData)`:
     1. Authenticate: `getSessionAndRole()` or `supabase.auth.getUser()` — return error if not authed.
     2. Validate `collectionName` and `itemName` — return field errors if blank.
     3. Generate unique collection slug via `generateUniqueCollectionSlug()`.
     4. Insert collection: `{ user_id, name, slug, visibility: 'public' }`.
     5. Generate unique item slug via `generateUniqueSlug()`.
     6. Insert item: `{ user_id, collection_id: newCollection.id, name, slug, visibility: 'public' }`.
     7. `revalidatePath(`/${username}`)`.
     8. Return `{ success: true; collectionSlug: string }`.
   - Return type: `{ error: string; field?: 'collectionName' | 'itemName' } | { success: true; collectionSlug: string } | undefined`.
   - Both inserts must succeed; if the item insert fails, the collection insert is orphaned (acceptable for MVP — no transaction needed since Supabase JS client doesn't expose client-side transactions cleanly, and RLS ensures data integrity).

---

### Phase 5 — Remove `/collection` Route

**Goal:** Delete the `/collection` vault page and migrate all its dependencies so nothing breaks.

**Context:** `app/collection/actions.ts` exports 9 server actions consumed by multiple components and the user menu. The page itself (`app/collection/page.tsx`) and its layout/error files are the only things being deleted. The actions must be relocated before deletion.

**Steps:**

1. **Relocate server actions** — move the functions out of `app/collection/actions.ts` to co-located `actions.ts` files near their consumers:
   - `signOut` → `app/profile/edit/actions.ts` (already has an actions file) or a new `app/actions.ts` at the root (global action).
   - `createCollection` → `app/[username]/actions.ts` (new file created in Phase 4; add it there).
   - `createCollectionItem` → `app/[username]/[collectionSlug]/actions.ts` (already exists alongside `addItem`).
   - `addItemLink`, `removeItemLink` → `app/[username]/[collectionSlug]/actions.ts`.
   - `updateItemImage` → `app/[username]/[collectionSlug]/items/[itemId]/edit/` (co-located with the edit page).
   - `getAllFranchises`, `getLinesByBrand` → `app/[username]/[collectionSlug]/actions.ts` (used by item forms).
   - `deleteCollection` → `app/[username]/[collectionSlug]/actions.ts` or `app/[username]/actions.ts`.

2. **Update all import sites** — fix the import path in every file that currently imports from `@/app/collection/actions`:
   - `src/features/user-menu/ui/UserMenu.tsx` (imports `signOut`)
   - `components/UserMenu/UserMenu.tsx` (imports `signOut`)
   - `components/AddItemForm/AddItemForm.tsx` (imports `createCollectionItem`, `getLinesByBrand`)
   - `components/CreateCollectionModal/CreateCollectionModal.tsx` (imports `createCollection`)
   - `components/UpdateImageForm/UpdateImageForm.tsx` (imports `updateItemImage`)
   - `components/ItemLinksManager/ItemLinksManager.tsx` (imports `addItemLink`, `removeItemLink`)
   - `app/collection/page.tsx` (imports `getAllFranchises` — page being deleted, no fix needed)

3. **Update `/collection` references in redirect logic:**
   - `app/auth/callback/route.ts`: change fallback `next` default from `'/collection'` to `'/'` (the homepage), and update the "no explicit next" branch so it always resolves to `/${username}` (or `/collection/edit` for profile setup — rename this to `/profile/edit`).
   - `app/admin/layout.tsx`: update redirect from `/collection` to `/`.
   - `app/profile/edit/actions.ts`: check for any redirect to `/collection` after profile save — update to `/${username}`.
   - `components/HomeCta.tsx`: update `setHref('/collection')` to `setHref(`/${username}`)` (requires passing the username or reading from session).

4. **Update middleware** (`middleware.ts`): any redirect rule that sends unauthenticated users from `/collection` to `/login` should be updated or removed since the route will no longer exist.

5. **Delete the `/collection` route files:**
   - `app/collection/page.tsx`
   - `app/collection/page.module.css`
   - `app/collection/layout.tsx`
   - `app/collection/layout.module.css`
   - `app/collection/error.tsx`
   - `app/collection/error.module.css`
   - `app/collection/actions.ts` (only after all imports have been updated)

6. **Check `/collection/edit`** — this sub-route is used for profile username setup after first sign-in. It is **not** being deleted; it may need to move to `/profile/edit` if it lives under the `collection` layout, or be left as-is if it has its own route segment. Verify the route structure before deleting the layout.

---

### Phase 6 — Wire Up & Validate

**Goal:** Ensure everything is connected and acceptance criteria pass.

**Steps:**

1. **Import `OnboardingEmptyState`** into `app/[username]/page.tsx` from `@/src/features/quick-start-collection`.
2. **Pass `username` prop** so the form can include it as a hidden field for the post-submit redirect.
3. **Manual walkthrough** of all AC items:
   - AC-1 through AC-7: sign in as owner, visit own profile with no collections.
   - AC-8: sign out, go to `/`, click sign-in, complete auth → lands on `/<username>`.
   - AC-9: sign out, go to `/stores`, click sign-in → returns to `/stores`.
   - AC-10: verify `next` param is present in OAuth state URL before leaving the app.
   - AC-11: attempt `next=//evil.com` — verify redirect falls back to `/`.
   - AC-12: navigate to `/collection` → 404.
   - AC-13: all former `/collection` links resolve to `/<username>` or `/login`.
   - AC-14: sign-out, create collection, add item, update image — all still work from new locations.
   - AC-15: complete fresh sign-in with no `next` param → lands on `/<username>`, not `/collection`.

---

## Technical Dependencies

| Dependency | Status | Notes |
|---|---|---|
| `@supabase/ssr` | Existing | Auth, cookie session, `signInWithOAuth` |
| `createClient` (server) | Existing | Used in new Server Action |
| `generateUniqueCollectionSlug` | Existing (`lib/slug.ts`) | Reused in Phase 4 |
| `generateUniqueSlug` | Existing (`lib/slug.ts`) | Reused for item slug |
| `createCollection` (action) | Existing (`app/collection/actions.ts`) | **Relocated** to `app/[username]/actions.ts` in Phase 5 |
| CSS custom properties | Existing (`@dezkareid/design-tokens`) | All styling references tokens |
| `useActionState` | React 19 built-in | Used in quick-start form |
| `useRouter` (next/navigation) | Existing | Client-side redirect after success |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `pathname` not available in Server Component for sign-in redirect | Medium — redirect falls back to `/` | Read `x-invoke-path` or `referer` from `headers()` in the Server Component; if unavailable, pass via a hidden form input rendered client-side |
| Collection insert succeeds but item insert fails | Low — orphaned empty collection | Return error to user; collection is harmless and will be visible on the profile, prompting a natural retry. Acceptable for MVP. |
| Animation causes layout shift (CLS) | Low | Use `transform` only (no layout properties) in keyframes; set explicit dimensions on illustration container |
| ISR cache on `/<username>` shows stale state after quick-start | Low — `revalidatePath` called in action | Confirm `revalidatePath(`/${username}`)` fires on success; profile page uses `connection()` which opts into dynamic rendering per request |
| Open redirect via crafted `next` param | High | Existing validation in callback (`startsWith('/') && !startsWith('//')`) already handles this. Reinforce in `signInWithGoogle` before appending. |
| `/collection/edit` lives under the collection layout | Medium — deleting the layout breaks profile setup | Verify whether `/collection/edit` is a sub-route of `app/collection/` or a standalone route; move it to `app/profile/edit/` if needed before deleting the layout. |
| Orphaned references to `/collection` in `middleware.ts` | Medium — redirect loops or broken auth guards | Audit middleware redirect rules and update or remove the `/collection` guard. |

---

## Out of Scope

- Image upload in quick-start form.
- Collection description or visibility picker in quick-start form.
- Onboarding for users who have collections but no items.
- Multi-step wizards or tooltip tours.
- Email/password sign-in support.
- Transaction rollback if item insert fails after collection insert.
