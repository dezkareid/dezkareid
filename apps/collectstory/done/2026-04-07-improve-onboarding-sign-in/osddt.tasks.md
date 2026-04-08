# Task List: Improve Onboarding & Sign In

## Phase 1 — Context-Aware Sign-In Redirect

> **Definition of Done**: After completing OAuth sign-in, users land on the page they came from (or `/<username>` when coming from `/`). Open-redirect attack via crafted `next` param is blocked.

- [x] [S] Read and understand `app/login/actions.ts` and `app/auth/callback/route.ts` current implementation
- [x] [S] Update `signInWithGoogle` in `app/login/actions.ts` to accept an optional `next: string` param and append it (URL-encoded, validated) to the `redirectTo` callback URL
- [x] [S] Read `src/widgets/site-header/ui/SiteHeader.tsx` to understand current sign-in trigger structure
- [x] [M] Update `SiteHeader` sign-in trigger to read current pathname (via `headers()` or hidden input) and pass it as `next` to `signInWithGoogle` (skip if pathname is `/`)
- [x] [S] Verify `app/auth/callback/route.ts` open-redirect guard (`startsWith('/') && !startsWith('//')`) — confirm no changes needed

**Dependencies**: Tasks 2 and 4 depend on Task 1. Task 4 depends on Task 3.

---

## Phase 2 — Server-Side Owner Detection on Profile Page

> **Definition of Done**: `ProfileContent` in `app/[username]/page.tsx` correctly detects whether the viewer is the profile owner and passes `isOwner` to the empty state logic.

- [x] [S] Read `app/[username]/page.tsx` to understand current structure and how `getPublicCollectionsByUsername` returns `userId`
- [x] [M] Add `createClient()` + `supabase.auth.getUser()` inside `ProfileContent` (or a new async helper), compare `user?.id` to `result.userId`, and pass `isOwner: boolean` to the collections renderer
- [x] [S] Add branching empty state logic: if `collections.length === 0 && isOwner` render `<OnboardingEmptyState>` placeholder; if visitor keep existing plain text

**Dependencies**: Task 2 depends on Task 1. Task 3 depends on Task 2.

---

## Phase 3 — Onboarding Empty State UI

> **Definition of Done**: `OnboardingEmptyState` component renders an animated illustration, headline, subline, and CTA button. CSS uses only design tokens. Component is exported from `src/features/quick-start-collection/index.ts`.

- [x] [S] Create `src/features/quick-start-collection/` slice directory structure (`ui/`, `index.ts`)
- [x] [L] Create `src/features/quick-start-collection/ui/OnboardingEmptyState.tsx` — `'use client'`, manages dialog open/close, renders SVG illustration with CSS animation, headline, subline, and CTA button
- [x] [M] Create `src/features/quick-start-collection/ui/OnboardingEmptyState.module.css` — `@keyframes float` or `@keyframes fadeInUp`, all values via CSS custom properties from `@dezkareid/design-tokens`
- [x] [M] Create `src/features/quick-start-collection/ui/QuickStartForm.tsx` — `'use client'`, uses `useActionState`, fields for collection name + item name, hidden `username` field, loading state, field-level validation errors, `router.push` on success
- [x] [S] Create `src/features/quick-start-collection/ui/QuickStartForm.module.css` — vertical stack layout, comfortable spacing, no hardcoded values
- [x] [S] Create `src/features/quick-start-collection/index.ts` — export `OnboardingEmptyState`

**Dependencies**: Tasks 2, 3, 4, 5, 6 depend on Task 1. Task 4 depends on Phase 4 (Server Action) being complete before `useActionState` can be wired up — can be stubbed initially.

---

## Phase 4 — Quick-Start Server Action

> **Definition of Done**: `quickStartCollection` Server Action atomically creates a collection and item, revalidates the profile path, and returns `{ success: true; collectionSlug: string }` or an error object with optional `field` key.

- [x] [S] Read `lib/slug.ts`, `app/[username]/[collectionSlug]/actions.ts`, and existing `app/collection/actions.ts` to understand slug generation and insert patterns
- [x] [M] Create `app/[username]/actions.ts` with `quickStartCollection(prevState, formData)` Server Action:
  - Authenticate with `getSessionAndRole()` or `supabase.auth.getUser()`
  - Validate `collectionName` and `itemName`
  - Generate unique collection slug via `generateUniqueCollectionSlug()`
  - Insert collection (`user_id`, `name`, `slug`, `visibility: 'public'`)
  - Generate unique item slug via `generateUniqueSlug()`
  - Insert item (`user_id`, `collection_id`, `name`, `slug`, `visibility: 'public'`)
  - `revalidatePath(`/${username}`)`
  - Return `{ success: true; collectionSlug: string }` or error object
- [x] [S] Wire `quickStartCollection` into `QuickStartForm.tsx` (complete the `useActionState` binding started in Phase 3)

**Dependencies**: Task 1 must come before Task 2. Task 3 depends on Phase 3 Task 4 and Task 2 here.

---

## Phase 5 — Remove `/collection` Route

> **Definition of Done**: `/collection` returns 404. All 9 server actions from `app/collection/actions.ts` are relocated to their respective co-located `actions.ts` files. All import sites updated. No broken links or redirect loops.

- [x] [S] Audit all imports of `app/collection/actions.ts` — list every consumer file and which actions it imports
- [x] [S] Read `app/collection/actions.ts` in full to catalogue all 9 exported actions and their implementations
- [x] [M] Relocate `signOut` action to a new or existing global `app/actions.ts` (or `app/profile/edit/actions.ts`)
- [x] [M] Add `createCollection` to `app/[username]/actions.ts` (already being created in Phase 4)
- [x] [M] Relocate `createCollectionItem`, `addItemLink`, `removeItemLink`, `getAllFranchises`, `getLinesByBrand`, `deleteCollection` to `app/[username]/[collectionSlug]/actions.ts`
- [x] [M] Relocate `updateItemImage` to `app/[username]/[collectionSlug]/actions.ts` (co-located with other collection-level actions)
- [x] [M] Update all import sites: `src/features/user-menu/ui/UserMenu.tsx`, `components/UserMenu/UserMenu.tsx`, `components/AddItemForm/AddItemForm.tsx`, `components/CreateCollectionModal/CreateCollectionModal.tsx`, `components/UpdateImageForm/UpdateImageForm.tsx`, `components/ItemLinksManager/ItemLinksManager.tsx`, and app/ route files
- [x] [S] Update `app/auth/callback/route.ts`: change fallback `next` default from `'/collection'` to `'/'` and ensure the "no explicit next" branch resolves to `/${username}`
- [x] [S] Update `app/admin/layout.tsx`: change redirect from `/collection` to `/`
- [x] [S] Update `app/profile/edit/actions.ts`: replace `revalidatePath('/collection')` with `revalidatePath(`/${username}`)`
- [x] [M] Update `components/HomeCta.tsx`: replace `setHref('/collection')` with `setHref('/profile/edit')` for users without username
- [x] [S] Audit `middleware.ts`: created new middleware.ts (proxy.ts was never wired up); merged auth guards with x-pathname injection; removed `/collection` guard
- [x] [S] Verify `/collection/edit` route structure — confirmed no `/collection/edit` sub-route exists; profile edit lives at `app/profile/edit/` independently
- [x] [M] Delete route files: `app/collection/page.tsx`, `app/collection/page.module.css`, `app/collection/layout.tsx`, `app/collection/layout.module.css`, `app/collection/error.tsx`, `app/collection/error.module.css`
- [x] [S] Delete `app/collection/actions.ts` (only after all import sites are updated)

**Dependencies**: Tasks 3–7 (relocations) must complete before Task 15 (delete actions.ts). Task 8–12 (redirect updates) can run in parallel with relocations. Task 13 (verify /collection/edit) must come before Task 14 (delete layout).

---

## Phase 6 — Wire Up & Validate

> **Definition of Done**: All acceptance criteria AC-1 through AC-15 pass via manual walkthrough. `OnboardingEmptyState` renders for owner, plain text for visitor. Redirect logic works across all tested scenarios. `/collection` returns 404.

- [x] [S] Import `OnboardingEmptyState` in `app/[username]/page.tsx` from `@/src/features/quick-start-collection` and replace the placeholder added in Phase 2
- [x] [S] Pass `username` prop to `OnboardingEmptyState` for the post-submit redirect
- [x] [S] Manual walkthrough AC-1 to AC-7: sign in as owner, visit own profile with no collections — verify empty state renders, quick-start form opens, form creates collection + item, redirects correctly
- [x] [S] Manual walkthrough AC-8 to AC-10: sign-in redirect flows (from `/`, from `/stores`, verify `next` param present in OAuth URL)
- [x] [S] Manual walkthrough AC-11: attempt `next=//evil.com` — verify fallback to `/`
- [x] [S] Manual walkthrough AC-12 to AC-15: `/collection` → 404, former links resolve correctly, signOut/createCollection/addItem/updateImage still work, fresh sign-in lands on `/<username>`

**Dependencies**: All prior phases must be complete before Phase 6.
