# Tasks: Fix Cache Issues & Add Delete Operations

## Phase 1 — Database migration (prerequisite)

> Must complete before Phase 4 (delete item) and Phase 5 (delete collection).

- [x] [S] Create migration file `fix_collection_items_cascade_delete` via `npx supabase migration new`
- [x] [S] Write migration SQL: drop `collection_items_collection_id_fkey` and re-add with `ON DELETE CASCADE`
- [x] [S] Apply migration to remote via Supabase MCP (`mcp__supabase__apply_migration`)
- [x] [S] Rename local migration file timestamp to match remote if there is a mismatch

**Definition of Done**: Deleting a collection in Supabase Dashboard causes all its `collection_items` rows to be deleted automatically (verified via SQL or MCP).

---

## Phase 2 — Fix cache invalidation

> No dependencies. Can start immediately.

- [x] [S] Fix `createCollectionItem` action: add `revalidateTag('collection-items:{collection_id}', 'max')` as fallback tag using `collection_id` from form data (always present)
- [x] [S] Fix `AddItemModal`: accept `username` and `collectionSlug` as props and forward them to `AddItemForm`
- [x] [S] Fix `OwnerCollectionActionsClient`: pass `username` and `collectionSlug` down to `AddItemModal`
- [x] [S] Fix `AddItemForm`: accept `username` and `collectionSlug` as props and render them as hidden `<input>` fields so `createCollectionItem` can read them from `formData`
- [x] [S] Fix `copyItemToCollection` action: add `revalidateTag('collection:{username}:{collectionSlug}', 'max')` and `revalidateTag('collection-items:{collectionId}', 'max')` after insert (currently missing)
- [x] [S] Audit `lib/collections.ts` `cacheTag` declarations vs all `revalidateTag` call sites — confirm tag name strings match exactly

**Definition of Done**: Adding an item via the modal causes the item to appear in the collection page on next load without a manual hard-refresh, and no `revalidateTag` call passes `undefined` arguments.

---

## Phase 3 — React Query setup and optimistic UI

> Depends on Phase 2 (cache tags must be correct before wiring mutations). Must complete before Phase 4.

- [x] [S] Install `@tanstack/react-query` exact version in `apps/collectstory/package.json` (run `pnpm install` from monorepo root)
- [x] [S] Create `src/shared/lib/query/QueryProvider.tsx` — Client Component wrapping `QueryClientProvider` with `QueryClient` initialised in `useState`
- [x] [S] Create `src/shared/lib/query/index.ts` — export `QueryProvider`
- [x] [S] Add `QueryProvider` to `app/layout.tsx` wrapping page content (below theme script)
- [x] [M] Refactor `AddItemForm`: replace `useTransition`-based `getLinesByBrand` fetch with `useQuery({ queryKey: ['lines', brandId], queryFn: () => getLinesByBrand(brandId), enabled: !!brandId })` — remove `startLoadingLines` / `loadingLines` transition
- [x] [S] Create `src/features/owner-item-actions/model/types.ts` — define shared `OwnerItem` type matching the serializable shape passed from RSC to the client grid
- [x] [S] Create `src/features/owner-item-actions/model/keys.ts` — define `itemKeys.list(collectionId)` query key factory

**Definition of Done**: `QueryProvider` is present in the layout. Changing brands in `AddItemForm` no longer triggers a duplicate auth round-trip (visible in Supabase logs). `OwnerItem` type and query keys are defined.

---

## Phase 4 — Delete item + Owner item grid

> Depends on Phase 1 (cascade FK) and Phase 3 (React Query, types, keys).

- [x] [S] Add `deleteItem(itemId, username, collectionSlug)` server action to `app/[locale]/[username]/[collectionSlug]/actions.ts` — authenticate, delete from `collection_items` where `id = itemId AND user_id = user.id`, revalidate path and tags, return `{ success: true } | { error: string }`
- [x] [M] Create `src/features/owner-item-actions/ui/DeleteItemModal.tsx` — Client Component using `Modal` from `@dezkareid/components/react` with copy "Delete this item? This action cannot be undone." and Cancel / Delete buttons
- [x] [M] Create `src/features/owner-item-actions/ui/OwnerItemGrid.tsx` — Client Component with optimistic mutations and no page reload
- [x] [M] Create `src/features/owner-item-actions/ui/OwnerItemActions.tsx` (RSC) — uses `connection()`, checks auth, fetches collection ownership, if owner fetches items and brands/franchises, renders `OwnerItemGrid` with `initialData`; if not owner returns `null`
- [x] [S] Create `src/features/owner-item-actions/index.ts` — export `OwnerItemActions` as public API
- [x] [M] Update `app/[locale]/[username]/[collectionSlug]/page.tsx` — add `<Suspense>` block rendering `OwnerItemActions` that overlays the grid when ownership resolves; non-owner path unchanged

**Definition of Done**: Owner can delete an item — it disappears from the grid immediately without page reload, then a background revalidate syncs the server. Add item via the modal appends to the grid instantly. Non-owner sees the existing cached grid with no change.

---

## Phase 5 — Delete collection (UI)

> Depends on Phase 1 (cascade FK). Phase 3 not required (collection delete navigates away).

- [x] [M] Create `src/features/owner-collection-actions/ui/DeleteCollectionModal.tsx` — Client Component using `Modal`; copy: "Delete collection? All items in this collection will be permanently deleted and cannot be recovered." with Cancel and "Delete Collection" buttons; on confirm calls `deleteCollection(collectionId)` then `router.push('/{username}')`
- [x] [S] Update `OwnerCollectionActionsClient`: import and add a "Delete" button that opens `DeleteCollectionModal`; pass `collectionId`, `username`, and `itemCount` as props
- [x] [S] Update `OwnerCollectionActions` (RSC): pass `item_count` from collection data to `OwnerCollectionActionsClient`
- [x] [M] Create `src/features/owner-profile-actions/ui/OwnerProfileCollectionCard.tsx` — Client Component wrapping the collection card `<Link>` with a delete button that opens `DeleteCollectionModal` (inline, not routed)
- [x] [M] Create `OwnerProfileGrid` RSC and `OwnerProfileActions` — streams in owner-aware cards via Suspense; non-owners see cached grid unchanged
- [x] [S] Update `app/[locale]/[username]/page.tsx`: wrap collection grid in ownership fork — `<Suspense>` renders `OwnerProfileGrid` (with delete-able cards) on top of the static grid for the owner

**Definition of Done**: Owner can delete a collection from the collection page header and from the profile page collection card. Both trigger a modal with the correct warning copy. After confirmation the user is navigated to the profile page and the deleted collection is no longer shown.

---

## Phase 6 — Validation & cleanup

> Depends on all previous phases.

- [x] [S] Verify `item_links` table existence via Supabase MCP; if exists, confirm FK `item_links.item_id → collection_items.id` has `ON DELETE CASCADE` — table not found in schema (pre-existing, out of scope)
- [x] [S] Re-audit all `revalidateTag` call sites after Phase 2–5 changes — confirm no tag string uses `undefined` segments
- [x] [S] Create changeset: run `pnpm changeset` from monorepo root, select `@dezkareid/collectstory`, bump `minor`, write user-facing summary covering cache fix + delete operations

**Definition of Done**: No orphaned records after collection delete. No `undefined` in any tag string. Changeset file committed with the PR.

---

## Dependencies summary

```
Phase 1 ──► Phase 4
         └─► Phase 5

Phase 2 ──► Phase 3 ──► Phase 4

Phase 4 ──► Phase 6
Phase 5 ──► Phase 6
```

Phases 1 and 2 can start in parallel.
