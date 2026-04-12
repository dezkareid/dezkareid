# Tasks: Rendering Performance — Collections

## Phase 1 — OwnerProfileActions (`/<username>`)

- [x] [S] Create `src/features/owner-profile-actions/ui/OwnerProfileActions.tsx` — dynamic server component: `connection()` + `auth.getUser()` + `getPublicCollectionsByUsername()`, renders `<CreateCollectionModal>` only if owner
- [x] [S] Create `src/features/owner-profile-actions/index.ts` — export `OwnerProfileActions`
- [x] [M] Update `app/[username]/page.tsx` — replace `<UserProfileActions>` with `<OwnerProfileActions>`, remove public content from outer `<Suspense>` (move `ProfileHeader` and `ProfileCollections` to render synchronously; keep inner `<Suspense fallback={undefined}>` only around `OwnerProfileActions` inside `ProfileHeader`)

**Dependencies**: tasks run in order (component must exist before page update)

**Definition of Done**: `view-source` on `/<username>` shows full collection grid HTML without JS; owner control streams in for authenticated owner; no `useEffect` auth call in browser network panel

---

## Phase 2 — OwnerCollectionActions + NonOwnerItemActions (`/<username>/<collection>`)

- [x] [S] Create `src/features/owner-collection-actions/ui/OwnerCollectionActions.tsx` — dynamic server component: `connection()` + `auth.getUser()` + `getPublicCollectionBySlug()`, renders Add Item + Edit links only if owner (copy button styles from deleted `CollectionActions`)
- [x] [S] Create `src/features/owner-collection-actions/index.ts` — export `OwnerCollectionActions`
- [x] [S] Create `src/features/non-owner-item-actions/ui/NonOwnerItemActions.tsx` — dynamic server component: `connection()` + `auth.getUser()` + `getPublicCollectionBySlug()`, renders `<IHaveThisButton>` only if NOT owner; add `// TODO(feature): consider consolidating NonOwnerItemActions and OwnerCollectionActions into a single unified owner-context provider to avoid two separate auth checks per item` annotation
- [x] [S] Create `src/features/non-owner-item-actions/index.ts` — export `NonOwnerItemActions`
- [x] [M] Update `app/[username]/[collectionSlug]/page.tsx` — remove `createClient` + `auth.getUser()` + `isOwner` from `CollectionContent`; replace `<CollectionActions>` with `<OwnerCollectionActions>` in `<Suspense fallback={undefined}>`; replace `{!isOwner && <IHaveThisButton>}` with `<NonOwnerItemActions>` per item; remove outer `<Suspense>` from `CollectionContent` and `BreadcrumbNav` at page level

**Dependencies**: feature components must exist before page update

**Definition of Done**: `view-source` on `/<username>/<collection>` shows full item grid HTML; Add Item + Edit stream in for owner; `IHaveThisButton` absent for owner, present for non-owner; no client auth call in network panel

---

## Phase 3 — OwnerItemActions (`/<username>/<collection>/<slug>`)

- [x] [S] Create `src/features/owner-item-actions/ui/OwnerItemActions.tsx` — dynamic server component: accepts `userId: string` prop; `connection()` + `auth.getUser()`, compares `user?.id === userId`, renders Edit item link only if owner (copy button styles from deleted `ItemActions`)
- [x] [S] Create `src/features/owner-item-actions/index.ts` — export `OwnerItemActions`
- [x] [M] Update `app/[username]/[collectionSlug]/[slug]/page.tsx` — replace `<ItemActions>` with `<OwnerItemActions username collectionSlug userId={item.user_id} />` in existing `<Suspense>`; remove outer `<Suspense>` from `ItemDetail` and `BreadcrumbNav` at page level

**Dependencies**: feature component must exist before page update

**Definition of Done**: `view-source` on `/<username>/<collection>/<slug>` shows full item detail HTML; Edit item streams in for owner; no client auth call in network panel

---

## Phase 4 — Delete legacy client components

- [x] [S] Delete `components/username/UserProfileActions.tsx`
- [x] [S] Delete `components/username/CollectionActions.tsx`
- [x] [S] Delete `components/username/ItemActions.tsx`
- [x] [S] Verify no remaining imports: search codebase for `UserProfileActions`, `CollectionActions`, `ItemActions`
- [x] [S] Remove `components/username/` directory if empty

**Dependencies**: must run after Phases 1–3 are complete

**Definition of Done**: no `'use client'` ownership-check components remain in `components/username/`; build passes

---

## Phase 5 — Verify

- [x] [M] Unauthenticated view: `view-source` on all three routes confirms full public content in initial HTML, no owner controls present
- [x] [M] Owner view: authenticated owner sees streaming owner controls; browser network panel shows no Supabase auth/profile REST calls for ownership determination on initial load
- [x] [S] Non-owner authenticated view: owner controls absent from DOM
- [x] [S] Interaction smoke test: Like button, social share, copy-item (`IHaveThisButton`), and where-to-find features work correctly — note: `BAILOUT_TO_CLIENT_SIDE_RENDERING` template element from `next/dynamic` (AnalyticsClient in root layout) is pre-existing on all routes, not a regression
- [x] [S] TypeScript build: `pnpm turbo run build --filter=@dezkareid/collectstory` passes with no type errors

**Dependencies**: must run after Phase 4

**Definition of Done**: all acceptance criteria from `osddt.spec.md` verified; build passes clean
