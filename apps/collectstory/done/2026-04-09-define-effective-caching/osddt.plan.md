# Implementation Plan: Define Effective Caching Strategy

## Architecture Overview

### Core Strategy

The caching model is built on three pillars:

1. **Partial Pre-Rendering (PPR)** for the three user-content pages (`/[username]`, `/[username]/[collectionSlug]`, `/[username]/[collectionSlug]/[slug]`). The static shell — the full public content — is pre-rendered and cached for 24 hours. A single `<Suspense>` boundary wraps only the ownership UI (edit/delete action buttons), which is dynamic and streams in per-request.

2. **`'use cache'` + `cacheLife` directives** on the data-fetching functions in `lib/collections.ts`. These are the canonical cache boundaries. All three pages call the same query functions; caching them once covers all pages.

3. **`revalidatePath`** in Server Actions (`app/[username]/[collectionSlug]/actions.ts`) for on-demand invalidation when an owner mutates content. Scope is direct-only (only the affected page is invalidated).

### Cache Tiers After PPR Adoption

| Content | Cache behaviour | Mechanism |
|---|---|---|
| Page shell (all public content) | 24h aggressive cache | `'use cache'` + custom `cacheLife` profile |
| Ownership UI slot (edit/delete buttons) | Dynamic — always fresh | `<Suspense>` + `connection()` opt-out |
| Mutated page | Invalidated on write | `revalidatePath()` in Server Actions |

The "soft tier" (5-minute TTL for logged-in non-owners) is fully replaced by PPR. Non-owners get the same fast cached shell as anonymous visitors; only the ownership slot — which non-owners never see — is dynamic.

### Language / i18n Cache Keying

URL prefix is the language signal: `/es/[username]`, `/en/[username]`. The current English routes have no prefix. The cache key is the full URL path, so different-language pages are naturally separate cache entries. No additional keying work is needed for the `'use cache'` approach — it is URL-native.

When Spanish is added, the new `/es/` route tree will have its own cache entries automatically. The data-fetching layer will need a `locale` parameter passed to queries; the cache key will include it via `cacheTag` or as part of the function arguments.

### Named `cacheLife` Profiles

TTL values are defined once in `next.config.ts` as named profiles, not hardcoded in query functions:

```ts
// next.config.ts
cacheLife: {
  'user-content': {
    stale: 60 * 60 * 24,      // 24h — serve stale while revalidating
    revalidate: 60 * 60 * 24, // 24h — background revalidation interval
    expire: 60 * 60 * 24 * 7  // 7d — hard expiry
  }
}
```

All three pages' query functions use `cacheLife('user-content')`.

### `cacheTag` for Targeted Invalidation

Each cached function is tagged with a resource-scoped tag so `revalidateTag` can target it precisely. Tags follow the pattern:

| Resource | Tag |
|---|---|
| User profile collections | `profile:[username]` |
| Single collection | `collection:[username]:[collectionSlug]` |
| Single item | `item:[username]:[collectionSlug]:[slug]` |

Server Actions call `revalidateTag` for the specific resource tag instead of (or in addition to) `revalidatePath`.

---

## Implementation Phases

### Phase 1 — Configure `cacheLife` profiles in `next.config.ts`

**Goal:** Define the named TTL profiles as configuration; no hardcoded numbers anywhere else.

**Steps:**
1. Open `next.config.ts`.
2. Add the `cacheLife` key under `experimental` (or top-level if Next.js 16 has graduated it) with the `'user-content'` profile.
3. Verify Next.js 16 supports named `cacheLife` profiles via Context7 docs before editing.

**Files changed:** `next.config.ts`

---

### Phase 2 — Enable PPR on the three pages

**Goal:** Mark the three user-content pages as PPR so Next.js pre-renders the static shell and streams the dynamic slot.

**Steps:**
1. In each of the three page files, add `export const experimental_ppr = true` (or the Next.js 16 equivalent — verify via Context7).
2. Remove any `export const dynamic = 'force-dynamic'` or `export const revalidate` segment config that conflicts with PPR on these pages.
3. Confirm the page builds without errors. The shell should render at build time.

**Files changed:**
- `app/[username]/page.tsx`
- `app/[username]/[collectionSlug]/page.tsx`
- `app/[username]/[collectionSlug]/[slug]/page.tsx`

---

### Phase 3 — Add `'use cache'` + `cacheLife` + `cacheTag` to query functions

**Goal:** Cache the data-fetching functions that back the three pages at the function level.

**Steps:**
1. Open `lib/collections.ts`.
2. For each of the four public query functions, add:
   - `'use cache';` as the first statement inside the function body.
   - `cacheLife('user-content');`
   - `cacheTag(...)` with the appropriate resource tag.

   Functions to update:
   - `getPublicCollectionsByUsername(username)` → tag: `profile:${username}`
   - `getPublicCollectionBySlug(username, collectionSlug)` → tag: `collection:${username}:${collectionSlug}`
   - `getPublicItemsInCollection(collectionId)` — note: `collectionId` is a UUID, not slug; tag: `collection-items:${collectionId}` (also tag the parent collection: `collection:${username}:${collectionSlug}` — pass slug as additional parameter or tag both)
   - `getPublicItemBySlug(username, collectionSlug, slug)` → tag: `item:${username}:${collectionSlug}:${slug}`

3. Verify imports: `cacheLife` and `cacheTag` are imported from `'next/dist/server/use-cache/cache-life'` or the public `next` export — confirm exact import path via Context7.

**Files changed:** `lib/collections.ts`

---

### Phase 4 — Extract the ownership UI into a dynamic `<Suspense>` slot

**Goal:** Isolate the ownership-sensitive UI (edit/delete buttons, owner-only actions) into a `<Suspense>` boundary backed by a Server Component that calls `connection()` to opt out of static rendering. Everything outside this boundary remains in the static shell.

**Steps:**

#### Item detail page (`app/[username]/[collectionSlug]/[slug]/page.tsx`)
1. Identify all owner-conditional rendering (the `isOwner` check and the action components it gates).
2. Create `app/[username]/[collectionSlug]/[slug]/_components/OwnerActions.tsx` — an async Server Component that:
   - Calls `connection()` to force dynamic rendering for this subtree.
   - Calls `getSessionAndRole()` to determine ownership.
   - Renders the edit/delete buttons if owner, otherwise renders `null`.
3. In the page, replace the inline owner check with `<Suspense fallback={null}><OwnerActions .../></Suspense>`.
4. Remove the `getSessionAndRole()` call from the page-level data fetching (it now lives only inside `OwnerActions`).

#### Collection page (`app/[username]/[collectionSlug]/page.tsx`)
1. Identify owner-conditional UI (edit collection button, add item button).
2. Create `app/[username]/[collectionSlug]/_components/CollectionOwnerActions.tsx` with the same pattern.
3. Wrap with `<Suspense fallback={null}>`.

#### Profile page (`app/[username]/page.tsx`)
1. Identify owner-conditional UI (edit profile button, create collection button).
2. Create `app/[username]/_components/ProfileOwnerActions.tsx` with the same pattern.
3. Wrap with `<Suspense fallback={null}>`.

**Files changed / created:**
- `app/[username]/page.tsx`
- `app/[username]/_components/ProfileOwnerActions.tsx` *(new)*
- `app/[username]/[collectionSlug]/page.tsx`
- `app/[username]/[collectionSlug]/_components/CollectionOwnerActions.tsx` *(new)*
- `app/[username]/[collectionSlug]/[slug]/page.tsx`
- `app/[username]/[collectionSlug]/[slug]/_components/OwnerActions.tsx` *(new)*

---

### Phase 5 — Update Server Actions to use `revalidateTag`

**Goal:** After each mutation, invalidate only the directly affected cached resource using `revalidateTag`.

**Steps:**
1. Open `app/[username]/[collectionSlug]/actions.ts`.
2. For each mutation, replace or supplement existing `revalidatePath()` calls with `revalidateTag()`:

   | Action | Tag to invalidate |
   |---|---|
   | `createCollectionItem()` | `collection:${username}:${collectionSlug}` (new item appears in collection list) |
   | `updateItem(username, collectionSlug, slug)` | `item:${username}:${collectionSlug}:${slug}` |
   | `updateItemImage(username, collectionSlug, slug)` | `item:${username}:${collectionSlug}:${slug}` |
   | `addItemLink()` / `removeItemLink()` | `item:${username}:${collectionSlug}:${slug}` |
   | `updateCollection(username, collectionSlug)` | `collection:${username}:${collectionSlug}` |
   | `deleteCollection(username, collectionSlug)` | `collection:${username}:${collectionSlug}`, `profile:${username}` |

3. Check whether profile mutations (edit profile) live in a separate actions file and apply the same pattern for `profile:${username}`.

**Files changed:**
- `app/[username]/[collectionSlug]/actions.ts`
- `app/profile/edit/actions.ts` (if it exists — verify)

---

### Phase 6 — Verify i18n cache key readiness

**Goal:** Confirm that the URL-prefix approach produces distinct cache entries per language and that no code change is needed today — only documentation of the contract.

**Steps:**
1. Confirm that `'use cache'` keying is URL-path-based by default in Next.js 16 (verify via Context7).
2. Confirm that adding `/es/` route segment in the future will produce separate cache entries automatically.
3. Add a comment in `lib/collections.ts` above each cached function noting that when a `locale` parameter is added, it must be included as a function argument (not derived from headers/cookies) so it becomes part of the cache key.
4. Document the URL prefix convention in the working-on notes.

**Files changed:** `lib/collections.ts` (comments only)

---

### Phase 7 — Smoke test and validation

**Goal:** Confirm the strategy works end-to-end before shipping.

**Steps:**
1. Run `pnpm turbo run build --filter=@dezkareid/collectstory` — verify the three pages build as PPR (Next.js build output should show `◐` partial prerender symbol).
2. Start the production server locally (`pnpm turbo run start --filter=@dezkareid/collectstory`).
3. Visit each of the three pages as anonymous → confirm fast cached response; repeat visit confirms no DB hit (check Supabase logs).
4. Log in as a non-owner → same pages serve cached shell; ownership slot streams `null`.
5. Log in as the owner → ownership slot streams the action buttons.
6. Mutate content as owner → revisit the page as anonymous → confirm updated content is visible (cache was invalidated).
7. Verify `/stores` and `/franchises/*` still work (no regression).

---

## Technical Dependencies

| Dependency | Version / Notes |
|---|---|
| Next.js | 16.2.1 — PPR, `'use cache'`, `cacheLife`, `cacheTag`, `connection()` all available |
| `next/cache` | `revalidateTag`, `revalidatePath` — already in use |
| Supabase SSR | `@supabase/ssr` 0.9.0 — session read in `OwnerActions` Server Components |
| `cacheLife` profiles | Named profiles in `next.config.ts` under `experimental.cacheLife` |

> Before implementing, verify exact API signatures for `cacheLife` named profiles and `experimental_ppr` page export in Next.js 16 using **Context7 MCP** (`mcp__context7__resolve-library-id` + `mcp__context7__query-docs`).

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| PPR not yet stable in Next.js 16 for these route shapes | Low | Verify build output; fall back to segment-level `revalidate = 86400` + explicit dynamic slot if PPR is unavailable |
| `cacheTag` string collisions across users | Low | Tag format includes username as namespace: `item:${username}:...` |
| Owner actions slot adds visible layout shift (CLS) | Medium | Size the `<Suspense>` fallback to reserve the same space as the action buttons (e.g. a same-height invisible placeholder) |
| `getPublicItemsInCollection` uses `collectionId` (UUID) not slug | Medium | Pass both `collectionId` and `collectionSlug`/`username` to the function, or tag with the UUID and also call `revalidateTag` with the UUID in the Server Action |
| Stale `generateMetadata` output not covered by `revalidateTag` | Low | `generateMetadata` calls the same cached query functions — invalidating the tag invalidates metadata too |
| Session cookie read inside `OwnerActions` adds latency | Low | Session read is a local cookie parse (no network call) via `@supabase/ssr`; negligible overhead |

---

## Out of Scope

- CDN/edge-level cache headers (`Cache-Control`, `s-maxage`, `stale-while-revalidate`) — application layer only.
- Admin pages (`/admin/*`) — already handled with per-action `revalidatePath`.
- `/stores`, `/franchises/*` — already have `'use cache'` + `cacheLife('hours')`.
- Full i18n implementation (route tree, translations, language switcher).
- Client-side data fetching optimisation (SWR, React Query) — not used in this app.
- Pagination cache strategy for `getPublicItemsInCollection` — page 2+ are separate URL paths and are cached independently by Next.js.
