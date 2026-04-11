# Implementation Plan: Rendering Performance — Collections

## Architecture Overview

The fix applies the **cached shell + dynamic owner boundary** pattern consistently across all three routes. This pattern already exists for the image section on the item detail page (`OwnerImageSection`) and must be extended to owner action controls on all three routes.

### Core principle

```
Page
├── [cached Server Component] — public content, fully rendered in initial HTML
│   └── 'use cache' + cacheTag → safe for crawlers, no client fetches
└── <Suspense fallback={undefined}>
    └── [dynamic Server Component] — calls connection() + supabase.auth.getUser()
        └── renders owner controls only if isOwner === true
```

The `<Suspense fallback={undefined}` boundary means:
- On **first SSR request** (crawler / unauthenticated): the public content renders fully; the dynamic boundary resolves server-side before the response is sent.
- On **client navigation** (authenticated owner): the Suspense boundary allows the shell to paint immediately while the owner section streams in — the brief delay is acceptable per the spec decision.

### What changes

| Component | Current | Target |
|---|---|---|
| `UserProfileActions` | `'use client'` + `useEffect` auth check | Delete — replaced by `OwnerProfileActions` server component |
| `CollectionActions` | `'use client'` + `useEffect` auth check | Delete — replaced by `OwnerCollectionActions` server component |
| `ItemActions` | `'use client'` + `useEffect` auth check | Delete — replaced by `OwnerItemActions` server component |
| `/<username>` page | `ProfileHeader` + `ProfileContent` both in `<Suspense>` | Public content rendered outside Suspense; owner controls in dynamic `<Suspense>` |
| `/<username>/<collection>` page | `CollectionContent` mixes cached data + `auth.getUser()` | Split: cached public shell + dynamic `OwnerCollectionActions` |
| `/<username>/<collection>/<slug>` page | `ItemActions` client component in `<Suspense>` | Replace with `OwnerItemActions` server component in `<Suspense>` |

### FSD placement

New owner action server components belong in `src/features/` following FSD conventions (one slice per user interaction):

- `src/features/owner-profile-actions/` — Create Collection button for profile owners
- `src/features/owner-collection-actions/` — Add Item + Edit buttons for collection owners
- `src/features/owner-item-actions/` — Edit item button for item owners

Each uses `connection()` from `next/server` to opt out of caching, then `createClient()` to check `auth.getUser()`.

---

## Implementation Phases

### Phase 1 — Create `OwnerProfileActions` server component

**Goal**: Replace `UserProfileActions` (client component) with a dynamic server component that resolves ownership server-side.

**Steps**:

1. Create `src/features/owner-profile-actions/ui/OwnerProfileActions.tsx`:
   - Mark with `await connection()` (opts out of `'use cache'`)
   - Call `createClient()` → `auth.getUser()`
   - Call `getPublicCollectionsByUsername(username)` to get the `userId`
   - Compare `user?.id === userId` → if owner, render `<CreateCollectionModal username={username} />`
   - If not owner, return `null`
2. Create `src/features/owner-profile-actions/index.ts` — export `OwnerProfileActions`
3. Update `app/[username]/page.tsx`:
   - Remove `import { UserProfileActions }` from `@/components/username/UserProfileActions`
   - Import `{ OwnerProfileActions }` from `@/src/features/owner-profile-actions`
   - In `ProfileHeader`: replace `<UserProfileActions username={username} />` with `<OwnerProfileActions username={username} />`
   - Keep the wrapping `<Suspense fallback={undefined}>` around `OwnerProfileActions`
4. Remove `UserProfileActions` wrapping `<Suspense>` from `ProfileHeader` — it is already there; keep it as the dynamic boundary
5. **Fix SEO issue**: Move `ProfileHeader` and `ProfileContent` out of `<Suspense>` at the page level — public content must render synchronously in the initial response. Only the `OwnerProfileActions` inside `ProfileHeader` stays behind a `<Suspense>` boundary.

> **Note on `getPublicCollectionsByUsername` in `OwnerProfileActions`**: this cached function will be called again inside the dynamic component. Because it uses `'use cache'` with `cacheTag`, Next.js request deduplication means the result is reused from the same render cycle — no extra DB round-trip.

---

### Phase 2 — Create `OwnerCollectionActions` server component

**Goal**: Replace `CollectionActions` (client component) with a dynamic server component; also fix the inline `auth.getUser()` call inside `CollectionContent`.

**Steps**:

1. Create `src/features/owner-collection-actions/ui/OwnerCollectionActions.tsx`:
   - `await connection()`
   - `createClient()` → `auth.getUser()`
   - `getPublicCollectionBySlug(username, collectionSlug)` to get `userId`
   - Compare `user?.id === userId` → render Add Item + Edit links if owner
   - Copy button styles from the existing `CollectionActions` component
2. Create `src/features/owner-collection-actions/index.ts`
3. Update `app/[username]/[collectionSlug]/page.tsx`:
   - Remove `import { CollectionActions }` from `@/components/username/CollectionActions`
   - Import `{ OwnerCollectionActions }` from `@/src/features/owner-collection-actions`
   - In `CollectionContent`: remove the `supabase.auth.getUser()` + `isOwner` check entirely
   - Remove `createClient` import if no longer used in this file
   - Replace `<CollectionActions .../>` with `<OwnerCollectionActions username={username} collectionSlug={collectionSlug} />`
   - Keep the wrapping `<Suspense fallback={undefined}>` around `OwnerCollectionActions`
   - **Fix `IHaveThisButton` condition**: currently guarded by `!isOwner` in `CollectionContent`. Since `isOwner` is being removed from `CollectionContent`, create a `NonOwnerItemActions` dynamic server component (similar to `OwnerCollectionActions`) that wraps `IHaveThisButton` and only renders it when the current user is **not** the owner. Add a `// TODO(feature): consider consolidating NonOwnerItemActions and OwnerCollectionActions into a single unified owner-context provider to avoid two separate auth checks per item` annotation in the component.
   - **Fix SEO issue**: `CollectionContent` is wrapped in `<Suspense>` at the page level — remove this outer Suspense so collection items render in the initial HTML. Keep only the inner Suspense for `OwnerCollectionActions`.

---

### Phase 3 — Create `OwnerItemActions` server component

**Goal**: Replace `ItemActions` (client component) with a dynamic server component on the item detail page.

**Steps**:

1. Create `src/features/owner-item-actions/ui/OwnerItemActions.tsx`:
   - `await connection()`
   - `createClient()` → `auth.getUser()`
   - `getPublicCollectionBySlug` + `getPublicItemBySlug` to get `item.user_id`
   - OR accept `userId` as a prop (preferred — avoids re-fetching data already available at the call site)
   - Compare `user?.id === userId` → render Edit item link if owner
   - Copy button styles from the existing `ItemActions` component
2. Create `src/features/owner-item-actions/index.ts`
3. Update `app/[username]/[collectionSlug]/[slug]/page.tsx`:
   - Remove `import { ItemActions }` from `@/components/username/ItemActions`
   - Import `{ OwnerItemActions }` from `@/src/features/owner-item-actions`
   - In `ItemMeta`: replace `<ItemActions username collectionSlug itemId />` with `<OwnerItemActions username={username} collectionSlug={collectionSlug} userId={item.user_id} />`
   - Keep the wrapping `<Suspense>` around it
   - **Fix SEO issue**: `ItemDetail` is wrapped in `<Suspense>` at the page level — remove this outer Suspense so item content renders in the initial HTML. The `OwnerImageSection` and `OwnerItemActions` boundaries remain as the only Suspense boundaries for dynamic content.

---

### Phase 4 — Delete legacy client components

**Goal**: Remove the now-unused `'use client'` ownership components from `components/username/`.

**Steps**:

1. Delete `components/username/UserProfileActions.tsx`
2. Delete `components/username/CollectionActions.tsx`
3. Delete `components/username/ItemActions.tsx`
4. Verify no other files import these components: `grep -r "UserProfileActions\|CollectionActions\|ItemActions" app/ src/ components/`
5. If `components/username/` is now empty, remove the directory.

---

### Phase 5 — Verify and test

**Goal**: Confirm all acceptance criteria are met.

**Steps**:

1. Start the dev server: `pnpm turbo run dev --filter=@dezkareid/collectstory`
2. **Unauthenticated view**: open `/<username>`, `/<username>/<collection>`, `/<username>/<collection>/<slug>` — verify full content renders without JS (use `view-source:`), confirm no owner controls present
3. **Owner view**: log in as the profile owner — verify owner controls appear (Create Collection / Add Item + Edit / Edit item) after streaming; confirm no Supabase auth/REST calls in the Network panel on initial load
4. **Non-owner authenticated view**: log in as a different user — verify owner controls are absent
5. **Network panel check**: on initial page load, no requests to `*.supabase.co/auth/v1/user` or `*.supabase.co/rest/v1/profiles` from the browser for the purpose of determining ownership
6. **Interactions**: verify Like button, social share, copy-item, and where-to-find features still work
7. Run TypeScript check: `pnpm turbo run build --filter=@dezkareid/collectstory --dry-run` then full build

---

## Technical Dependencies

| Dependency | Version | Notes |
|---|---|---|
| `next/server` → `connection()` | Next.js 16 | Opts a Server Component out of `'use cache'` — required for dynamic auth checks |
| `@/lib/supabase/server` → `createClient()` | existing | Cookie-based session client — reads auth from request cookies |
| `@/lib/collections` → cached query fns | existing | `'use cache'` functions; safe to call inside dynamic components (deduped) |
| `@dezkareid/components/react` → `Button` | existing | For any button UI in new components |

No new dependencies required.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Removing outer `<Suspense>` from page causes waterfall | Medium | The cached query functions dedupe within a render cycle; parallel fetches in `ProfileContent` + `ProfileHeader` must be verified to not block each other. Use `Promise.all` if needed. |
| Two auth checks per item card on collection page | Low | `NonOwnerItemActions` and `OwnerCollectionActions` each call `auth.getUser()` — they share the same session cookie so Next.js dedupes the auth call within the render cycle. A TODO annotation is left for a future consolidation. |
| `connection()` called in `OwnerProfileActions` but `getPublicCollectionsByUsername` is cached — mixing dynamic + cached in one component | Low | `connection()` only opts the current component out of caching; the cached function call inside it is still served from cache. This is the documented Next.js pattern. |
| `BreadcrumbNav` still in `<Suspense>` on collection + item pages | Low | `BreadcrumbNav` fetches cached public data — it can be moved out of `<Suspense>` along with the content components to ensure full initial HTML. Address as part of Phases 2 and 3. |

---

## Out of Scope

- Static generation (`generateStaticParams`) — routes remain fully dynamic SSR
- Edit forms (`EditCollectionForm`, `EditItemForm`, `AddItemPageForm`) — owner-only authenticated routes
- Like feature changes beyond initial state (already server-rendered)
- Any routes outside `/<username>`, `/<username>/<collection>`, `/<username>/<collection>/<slug>`
- Performance improvements to other apps in the monorepo
