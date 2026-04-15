# Plan: Fix Cache Issues & Add Delete Operations

## Architecture Overview

### Key findings from codebase audit

**Cache bug root cause — two separate issues:**

1. `addItem` action (used by the modal's `AddItemForm`) calls `revalidatePath` and `revalidateTag` but then immediately calls `redirect()`. The redirect happens before the cache revalidation fully propagates in the streaming context. The `AddItemModal` uses `router.refresh()` on success, which re-fetches the page — but the `use cache` function (`getPublicItemsInCollection`) still returns stale data because `revalidateTag` with `'max'` scoped to only the collection tag may not match the cached entry if the `username`/`collectionSlug` were not passed in the form data correctly.

2. `createCollectionItem` (the `useActionState` path from `AddItemForm`) calls `revalidatePath`/`revalidateTag` but `username` and `collection_slug` come from hidden form fields that **are not present** in `AddItemForm` — only `collection_id` is passed as a hidden input. So `username` and `collectionSlug` are `undefined`, making the revalidateTag call a no-op and the revalidatePath call `"/undefined/undefined"`.

**Database cascade gap:**
The FK `collection_items.collection_id → collections.id` has `ON DELETE SET NULL`, not `ON DELETE CASCADE`. Deleting a collection orphans its items rather than removing them. A migration is required.

**item_links table:**
The `item_links` table does not appear in the current Supabase schema (not returned by `list_tables`). The `addItemLink`/`removeItemLink` actions reference it — it may exist but not be reflected, or it may need creation. This needs verification before implementing delete-item cascade.

**Double user fetch in client:**
`AddItemForm` calls `getLinesByBrand` (a server action) on brand change, which internally calls `createClient()` → `supabase.auth.getUser()`. This auth call is made every time the brand selector changes. Additionally, `OwnerCollectionActions` (RSC) already fetches the user once. The duplicate call happens because the client form re-invokes server actions that re-authenticate. Adding TanStack Query (`@tanstack/react-query`) will deduplicate these calls and cache the results client-side.

**Owner vs non-owner rendering strategy:**
- **Non-owner** (visitor): No interactivity on the collection grid. The item grid (`CollectionContent`) should stay a pure Server Component — it already uses `use cache`. No change needed here except fixing the cache key.
- **Owner** (authenticated): The collection grid needs interactivity (delete buttons per item, add item button). This should be a Client Component that receives the pre-fetched items as serializable props from a Server Component wrapper. The pattern mirrors `OwnerCollectionActions` (RSC shell + client UI).

**Empty state strategy:**
- Non-owner on empty collection → static RSC message, no CTA.
- Owner on empty collection → `OwnerEmptyStateFallback` (already exists, streams in via Suspense). Keep this pattern; extend it to show the "Add Item" button prominently.

### Architecture decisions

1. **Cache fix**: Pass `username` and `collection_slug` as hidden fields in `AddItemForm` whenever it is used inside `AddItemModal`. Fix `createCollectionItem` to require these fields and make `revalidateTag` reliable. Also add `revalidateTag('collection-items:{collectionId}')` as a fallback tag since `collectionId` is always available.

2. **No page reload on mutations — optimistic UI with React Query**: Instead of `router.refresh()` after add/delete, use TanStack Query's `useMutation` + `optimisticUpdate` pattern for the owner item list. The owner item grid is a Client Component that holds the items in a `useQuery` cache seeded with SSR data (`initialData` from the RSC). On add: the new item is inserted into the local cache immediately and the server action runs in the background; on error the cache is rolled back. On delete: the item is removed from the local cache immediately before the server action confirms. This eliminates the full-page round-trip for the owner while the cached RSC path (for visitors) is still invalidated via `revalidateTag`.

3. **Owner item grid**: `OwnerItemGrid` is a Client Component under `src/features/owner-item-actions/` that manages its own item list via `useQuery` (seeded by the RSC). A thin RSC wrapper (`OwnerItemActions`) checks ownership via `connection()` + auth and, if owner, renders `OwnerItemGrid` with the pre-fetched items as `initialData`. Non-owners continue to see the existing static cached RSC grid — no change to their path.

4. **Delete item**: New `deleteItem` server action in `actions.ts`. `OwnerItemGrid` handles optimistic removal locally. `DeleteItemModal` provides the confirmation step.

5. **Delete collection**: The server action already exists. Wire it to a `DeleteCollectionModal` in `src/features/owner-collection-actions/` and surface it in:
   - `OwnerCollectionActionsClient` (collection detail page header) — add a "Delete" button.
   - Collection card on the profile page — add an owner-aware card variant with a delete affordance.
   Collection delete cannot be optimistic (it navigates away), so it uses `router.push('/{username}')` after the server action confirms — no refresh needed.

6. **React Query**: Install `@tanstack/react-query`. Create a `QueryProvider` in `src/shared/lib/query/`. Use `useQuery` for the owner item list (seeded from RSC) and `useQuery` for `getLinesByBrand` in `AddItemForm` to deduplicate brand→lines fetches. Do not use React Query for collection/item lists on the non-owner path — those stay in RSC + `use cache`.

7. **Database migration**: Add a migration to change `collection_items_collection_id_fkey` from `ON DELETE SET NULL` to `ON DELETE CASCADE`.

---

## Implementation Phases

### Phase 1 — Database migration (prerequisite)

**Goal**: Ensure deleting a collection cascades to its items at the DB level.

**Steps:**

1.1. Create a new Supabase migration:
```
npx supabase migration new fix_collection_items_cascade_delete
```

1.2. Migration content — drop and re-add the FK with `ON DELETE CASCADE`:
```sql
ALTER TABLE public.collection_items
  DROP CONSTRAINT collection_items_collection_id_fkey;

ALTER TABLE public.collection_items
  ADD CONSTRAINT collection_items_collection_id_fkey
    FOREIGN KEY (collection_id)
    REFERENCES public.collections(id)
    ON DELETE CASCADE;
```

1.3. Apply via Supabase MCP (`mcp__supabase__apply_migration`).

1.4. Rename local migration file timestamp to match the remote version if there is a mismatch (per CLAUDE.md convention).

---

### Phase 2 — Fix cache invalidation

**Goal**: After any mutation (add item, update item, update collection, copy item), the public-facing pages reflect the change immediately.

**Steps:**

2.1. **Fix `AddItemForm`** — Add hidden inputs `username` and `collection_slug` to the form. These are passed as props from `AddItemModal`, which receives them from `OwnerCollectionActionsClient`, which receives them from the RSC.

2.2. **Fix `OwnerCollectionActionsClient`** — Pass `username` and `collectionSlug` down to `AddItemModal` as props.

2.3. **Fix `AddItemModal`** — Accept and pass `username` and `collectionSlug` to `AddItemForm`.

2.4. **Fix `createCollectionItem` action** — Add `revalidateTag('collection-items:{collection_id}', 'max')` as a second tag invalidation (using `collection_id` which is always available in the form data), so cache busting works even when username/slug are missing. Remove the `redirect()` call — the modal handles navigation via `router.refresh()`.

2.5. **Fix `copyItemToCollection` action** — Add `revalidateTag` calls matching the pattern used in `createCollectionItem` (currently only uses `revalidatePath`).

2.6. **Verify `updateItem` and `updateCollection`** — Confirm both already call `revalidateTag`. They do — no change needed.

---

### Phase 3 — Add React Query for optimistic UI and deduplication

**Goal**: Eliminate full-page reloads on add/delete. Owner item list updates instantly in the client. Eliminate the double auth call on brand change.

**Steps:**

3.1. Install `@tanstack/react-query` as an exact version dependency in `apps/collectstory/package.json`.

3.2. Create `src/shared/lib/query/QueryProvider.tsx` — a Client Component wrapping `QueryClientProvider` with a stable `QueryClient` instance (created once with `useState`, not at module level to avoid SSR shared state).

3.3. Add `QueryProvider` to `app/layout.tsx` wrapping the children (below the theme script, above the content).

3.4. Refactor `getLinesByBrand` calls in `AddItemForm` — replace the `useTransition`-based fetch with `useQuery({ queryKey: ['lines', brandId], queryFn: () => getLinesByBrand(brandId), enabled: !!brandId })`. This deduplicates concurrent calls and caches results for the session.

3.5. Define the query key factory in `src/features/owner-item-actions/model/keys.ts`:
```ts
export const itemKeys = {
  list: (collectionId: string) => ['items', collectionId] as const,
};
```

3.6. `OwnerItemGrid` uses `useQuery({ queryKey: itemKeys.list(collectionId), queryFn: ..., initialData: items })` where `items` is the prop passed from the RSC (SSR data seeds the cache — no loading state on first render).

3.7. **Add item optimistic update** — `useMutation` for `createCollectionItem`:
- `onMutate`: insert a temporary item object into the query cache with a placeholder `id`.
- `onError`: roll back via the context snapshot returned by `onMutate`.
- `onSettled`: call `queryClient.invalidateQueries(itemKeys.list(collectionId))` to sync with server truth.

3.8. **Delete item optimistic update** — `useMutation` for `deleteItem`:
- `onMutate`: remove the item from the query cache immediately.
- `onError`: roll back.
- `onSettled`: invalidate the query.

---

### Phase 4 — Delete item

**Goal**: Owners can delete individual items via a modal confirmation.

**Steps:**

4.1. **Server action**: Add `deleteItem(itemId: string, username: string, collectionSlug: string)` to `app/[locale]/[username]/[collectionSlug]/actions.ts`. It must:
- Authenticate via `createClient().auth.getUser()`
- Delete from `collection_items` where `id = itemId AND user_id = user.id`
- Call `revalidatePath('/{username}/{collectionSlug}')` and `revalidateTag('collection:{username}:{collectionSlug}', 'max')`
- Return `{ success: true }` or `{ error: string }`

4.2. **Delete confirmation modal**: Create `src/features/owner-item-actions/ui/DeleteItemModal.tsx` — a Client Component using the existing `Modal` component from `@dezkareid/components/react`. Modal copy: *"Delete this item? This action cannot be undone."* Two buttons: "Cancel" and "Delete".

4.3. **Owner item card overlay**: Create `src/features/owner-item-actions/ui/OwnerItemCard.tsx` — a Client Component wrapping the existing item card `<Link>` with an owner-only delete icon button. Clicking it opens `DeleteItemModal`. On confirm, triggers the `useMutation` delete which removes the item from the React Query cache optimistically — **no `router.refresh()`**.

4.4. **RSC ownership wrapper**: Create `src/features/owner-item-actions/ui/OwnerItemActions.tsx` (RSC) — uses `connection()`, checks auth, compares `user.id` against the collection owner. If owner, renders `OwnerItemGrid` (Client Component) with the pre-fetched `items` as `initialData`. If not owner, renders `null` — the existing cached RSC grid is displayed instead.

4.5. **Wire into collection page**: In `app/[locale]/[username]/[collectionSlug]/page.tsx`, wrap `CollectionContent` with an ownership fork:
- Render `CollectionContent` (cached RSC) as the static shell for non-owners and for SEO.
- Render `OwnerItemActions` in a `<Suspense>` — when it resolves as owner, it replaces the grid with the interactive `OwnerItemGrid`. When not owner, renders nothing and the cached shell is shown.
- The add-item form success path calls the React Query mutation — **no page reload**.

4.6. **Create `src/features/owner-item-actions/index.ts`** — export public API.

---

### Phase 5 — Delete collection (UI)

**Goal**: Owners can delete a collection from the collection detail page header and from the collection card on their profile.

**Steps:**

5.1. **Delete confirmation modal**: Create `src/features/owner-collection-actions/ui/DeleteCollectionModal.tsx` — a Client Component using `Modal`. Copy: *"Delete collection? All [N] items in this collection will be permanently deleted and cannot be recovered."* Two buttons: "Cancel" and "Delete Collection".

5.2. **Wire into `OwnerCollectionActionsClient`**: Add a "Delete" button that opens `DeleteCollectionModal`. On confirm, calls `deleteCollection(collectionId)` then uses `router.push('/{username}')` to redirect to the profile.

5.3. **Owner collection card on profile**: The profile page (`app/[locale]/[username]/page.tsx`) currently renders collection cards as plain `<Link>` elements with no owner affordance. Introduce `OwnerProfileCollectionCard` as a Client Component in `src/features/owner-profile-actions/` that wraps the card with a delete button. The existing `OwnerProfileActions` RSC checks ownership — extend it to also pass the collections list so it can render owner-aware cards.

5.4. **Profile page update**: Render owner cards via the extended `OwnerProfileActions` RSC (which streams in via `<Suspense>`). Non-owner visitors continue to see the plain `<Link>` card grid.

---

### Phase 6 — Validation & cleanup

**Steps:**

6.1. Verify all `revalidateTag` calls match the `cacheTag` declarations in `lib/collections.ts` — tag names must be identical.

6.2. Confirm that `deleteCollection` revalidates both `profile:{username}` and the collection tag. It does — no change needed.

6.3. Check `item_links` table existence and add cascade delete from `item_links` to `collection_items` if missing (`ON DELETE CASCADE` on `item_links.item_id`).

6.4. Create a changeset (`pnpm changeset`) — select `@dezkareid/collectstory`, bump type `minor` (new delete feature), write a user-facing summary.

---

## Technical Dependencies

| Dependency | Purpose | Action |
|---|---|---|
| `@tanstack/react-query` | Client-side query deduplication for `getLinesByBrand` | Install — exact version |
| `@dezkareid/components/react` — `Modal` | Confirmation dialogs (already available) | No install needed |
| `next/cache` — `revalidateTag`, `revalidatePath` | Cache invalidation after mutations | Already used |
| Supabase MCP | Apply DB migration | Available |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Migration timestamp mismatch between local file and Supabase MCP | Rename local file to match remote timestamp per CLAUDE.md convention |
| `item_links` table missing — cascade delete on items may leave orphaned links | Verify table existence before implementing `deleteItem`; add FK with `ON DELETE CASCADE` if absent |
| Optimistic update shows a stale item after server error | Roll back via `onError` context snapshot in `useMutation`; show an error toast so user knows the action failed |
| RSC cached grid and React Query owner grid show different data simultaneously | Owner grid replaces the RSC grid entirely (not layered on top) — only one is visible at a time |
| `initialData` from RSC is typed differently from the query result | Define a shared `CollectionItem` type in `src/features/owner-item-actions/model/types.ts` used by both the RSC fetch and the query |
| `DeleteCollectionModal` receives item count — requires passing it from RSC | Pass `item_count` from the existing `PublicCollection` data already fetched in `OwnerCollectionActions` |
| React Query `QueryClient` created in a Client Component may cause SSR issues | Use `useState` to initialise `QueryClient` (not module-level) per TanStack docs to prevent shared state between requests |
| `addItem` currently calls `redirect()` — removing it changes behaviour for the `/items/new` route | The `/items/new` page uses a separate form path; only the modal (`AddItemModal`) uses the action without redirect. Keep `redirect()` in `addItem`, fix `createCollectionItem` (the modal path) instead |

---

## Out of Scope

- Bulk delete of items or collections
- Undo / restore after deletion
- Soft delete
- Changes to global feed caching (latest arrivals, homepage)
- Real-time Supabase subscriptions
- React Query for collection/item lists (RSC + `use cache` is the right tool there)
