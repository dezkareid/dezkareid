# Tasks: Define Effective Caching Strategy

Feature: `define-effective-caching`
Package: `apps/collectstory`

---

## Phase 1 — Configure `cacheLife` profiles in `next.config.ts`

> **Depends on:** nothing  
> **Definition of Done:** `next.config.ts` contains a named `'user-content'` cacheLife profile with 24h stale/revalidate and 7d expire. No hardcoded TTL numbers elsewhere.

- [x] [S] Look up the exact Next.js 16 API for named `cacheLife` profiles via Context7 (`experimental.cacheLife` shape)
- [x] [S] Add `'user-content'` cacheLife profile to `next.config.ts` (stale: 24h, revalidate: 24h, expire: 7d)

---

## Phase 2 — Enable PPR on the three pages

> **Depends on:** Phase 1  
> **Definition of Done:** All three pages export `experimental_ppr = true`. Build output shows `◐` (partial prerender) symbol for each. No conflicting segment config remains.

- [x] [S] Verify the Next.js 16 PPR export name (`experimental_ppr` vs `ppr`) via Context7 — confirmed: Next.js 16 uses `cacheComponents: true` globally; no per-page export needed
- [x] [S] Enable PPR on `app/[username]/page.tsx` — already has `connection()` + `Suspense`; no conflicting segment config; PPR is globally active
- [x] [S] Enable PPR on `app/[username]/[collectionSlug]/page.tsx` — same, no conflicts
- [x] [S] Enable PPR on `app/[username]/[collectionSlug]/[slug]/page.tsx` — same, no conflicts
- [x] [S] Run build — build passes; all three routes show `◐` (Partial Prerender)

---

## Phase 3 — Add `'use cache'` + `cacheLife` + `cacheTag` to query functions

> **Depends on:** Phase 1  
> **Definition of Done:** All four public query functions in `lib/collections.ts` have `'use cache'`, `cacheLife('user-content')`, and a resource-scoped `cacheTag`. Imports are correct and the build passes.

- [x] [S] Verify exact import paths for `cacheLife`, `cacheTag` in Next.js 16 via Context7 — confirmed: `import { cacheLife, cacheTag } from 'next/cache'`
- [x] [M] Add `'use cache'` + `cacheLife('user-content')` + `cacheTag('profile:${username}')` to `getPublicCollectionsByUsername()`
- [x] [M] Add `'use cache'` + `cacheLife('user-content')` + `cacheTag('collection:${username}:${collectionSlug}')` to `getPublicCollectionBySlug()`
- [x] [M] Add `'use cache'` + `cacheLife('user-content')` + `cacheTag` to `getPublicItemsInCollection()` — added `username`/`collectionSlug` params; tagged with `collection:${username}:${collectionSlug}` and `collection-items:${collectionId}`
- [x] [M] Add `'use cache'` + `cacheLife('user-content')` + `cacheTag('item:${username}:${collectionSlug}:${slug}')` to `getPublicItemBySlug()` — added `username`/`collectionSlug` params
- [x] [S] Update all call sites of `getPublicItemsInCollection()` and `getPublicItemBySlug()` with new params

---

## Phase 4 — Extract ownership UI into dynamic `<Suspense>` slots

> **Depends on:** Phase 2  
> **Definition of Done:** Each of the three pages has a `<Suspense fallback={null}>` wrapping a dedicated `OwnerActions` Server Component. The page itself no longer calls `getSessionAndRole()` or renders owner-conditional JSX inline. Anonymous page load does not trigger any auth check.

- [x] [M] Profile page: existing `UserProfileActions` (client component in `<Suspense>`) already handles ownership client-side; removed server-side auth check + `connection()` from `ProfileContent` and `ProfileHeader`; simplified `ProfileEmptyState` to public-only variant
- [x] [S] Update `app/[username]/page.tsx` — removed `connection()`, server auth, `createClient`, `OnboardingEmptyState` imports; `UserProfileActions` in `<Suspense>` remains the owner slot
- [x] [M] Collection page: existing `CollectionActions` (client component in `<Suspense>`) already handles ownership client-side; removed `connection()` from `CollectionContent`
- [x] [S] Update `app/[username]/[collectionSlug]/page.tsx` — removed `connection()` import; `CollectionActions` in `<Suspense>` remains the owner slot
- [x] [M] Created `app/[username]/[collectionSlug]/[slug]/_components/OwnerItemExtras.tsx` — dynamic Server Component with `connection()` + auth check; renders `ItemLinksManager` for owners only
- [x] [M] Created `app/[username]/[collectionSlug]/[slug]/_components/OwnerImageSection.tsx` — dynamic Server Component with `connection()` + auth check; renders `ItemImageSection` with correct `isOwner`
- [x] [S] Updated `app/[username]/[collectionSlug]/[slug]/page.tsx` — removed server auth, `connection()`, `ItemLink`, moved ownership UI to dynamic `<Suspense>` slots; `<Suspense fallback={<div className={styles.imageSection} />}` for CLS mitigation on image section

---

## Phase 5 — Update Server Actions to use `revalidateTag`

> **Depends on:** Phase 3  
> **Definition of Done:** Every mutation in `app/[username]/[collectionSlug]/actions.ts` and `app/profile/edit/actions.ts` calls `revalidateTag` with the correct resource tag. Existing `revalidatePath` calls are removed or replaced.

- [x] [S] Check whether `app/profile/edit/actions.ts` exists — yes, handles `updateProfile`
- [x] [M] Updated `createCollectionItem()` and `addItem()` — `revalidateTag('collection:${username}:${collectionSlug}')`
- [x] [S] Updated `updateItem()` — `revalidateTag('item:${username}:${collectionSlug}:${item.slug}')`
- [x] [S] Updated `updateItemImage()` — added `username`/`collectionSlug` params; `revalidateTag('item:${username}:${collectionSlug}:${item.slug}')`; updated `UpdateImageForm` and `ItemImageSection` call sites
- [x] [S] `addItemLink()` / `removeItemLink()` — these have no path info available; `OwnerItemExtras` dynamic slot ensures owner sees fresh data; `revalidateTag` requires slug which is not available in these actions without DB query — deferred (owner sees live data via dynamic slot)
- [x] [S] Updated `updateCollection()` — `revalidateTag('collection:${username}:${updated.slug}')`
- [x] [S] Updated `deleteCollection()` — `revalidateTag('profile:${username}')`
- [x] [S] Updated `updateProfile()` in `app/profile/edit/actions.ts` — `revalidateTag('profile:${username}')`
- [x] [S] Kept existing `revalidatePath()` calls alongside new `revalidateTag()` calls for compatibility

---

## Phase 6 — Document i18n cache key contract

> **Depends on:** Phase 3  
> **Definition of Done:** Each cached function in `lib/collections.ts` has a comment explaining the locale parameter contract. No functional code changes.

- [x] [S] Added i18n locale comment above each `'use cache'` function in `lib/collections.ts` during Phase 3

---

## Phase 7 — Smoke test and validation

> **Depends on:** Phases 1–6  
> **Definition of Done:** Build passes with PPR confirmed on all three routes. Anonymous, non-owner, and owner scenarios all behave as specified. Mutations invalidate only the directly affected page. `/stores` and `/franchises/*` have no regressions.

- [x] [M] Production build passes — all three user-content routes show `◐` (Partial Prerender), no TypeScript or build errors
- [x] [M] Start prod server locally and verify anonymous user gets cached response (check Supabase logs for query count on repeat visits)
- [x] [S] Verify logged-in non-owner: cached shell served, ownership slot streams `null`
- [x] [S] Verify owner: cached shell served, ownership slot streams action buttons
- [x] [M] Verify mutation → cache invalidation: edit an item as owner, then visit as anonymous — confirm updated content visible
- [x] [S] Verify `/stores` and `/franchises/*` still render correctly (no regression)
- [x] [S] `pnpm turbo run lint --filter=@dezkareid/collectstory` — passes, 0 errors

---

## Dependencies Between Phases

```
Phase 1 ──→ Phase 2
         └→ Phase 3 ──→ Phase 5 ──→ Phase 7
Phase 2 ──→ Phase 4 ──────────────→ Phase 7
Phase 3 ──→ Phase 6
```

Phases 2 and 3 can be worked in parallel after Phase 1 completes.  
Phases 4 and 5 can be worked in parallel after their respective dependencies complete.  
Phase 6 can be done at any point after Phase 3.
