# Task List: Like Collection Items

## Dependencies Overview

```
Phase 1 (DB) → Phase 2 (Queries) → Phase 3 (Actions) → Phase 4 (LikeButton)
                                                       ↓
                                          Phase 5 (Detail page integration)
                                          Phase 6 (List page integration)
Phase 7 (Analytics types) — can run in parallel with Phase 4
Phase 8 (TS types) — depends on Phase 1
```

---

## Phase 1 — Database Migration

> **Definition of Done**: Migration applies cleanly via `supabase db push`. `item_likes` table exists with correct RLS. `likes_count` column exists on `collection_items`. Trigger keeps the count in sync on insert/delete.

- [x] [S] Create migration file via `npx supabase migration new add_item_likes` from `apps/collectstory/`
- [x] [M] Add `likes_count INTEGER NOT NULL DEFAULT 0` column to `collection_items` in the migration
- [x] [M] Create `item_likes` table with `(user_id, item_id)` composite primary key, foreign keys to `profiles` and `collection_items` with `ON DELETE CASCADE`
- [x] [M] Create `BEFORE INSERT` trigger on `item_likes` to enforce the no-self-like rule (raises exception if `NEW.user_id` matches the item owner's `user_id`)
- [x] [M] Enable RLS on `item_likes` with policies: INSERT for authenticated user on own row (item must be public), DELETE for own row only, no public SELECT
- [x] [M] Create `sync_likes_count` trigger function (`AFTER INSERT OR DELETE` on `item_likes`) to update `collection_items.likes_count` via `COUNT(*)`
- [x] [S] Apply migration via Supabase MCP (`mcp__supabase__apply_migration`)

---

## Phase 2 — Query Layer

> **Definition of Done**: `PublicItem` and `PublicItemDetail` include `likes_count`. Queries return it without extra round-trips. `getItemLikedByUser` returns correct boolean for authenticated users.

*Depends on: Phase 1*

- [x] [S] Add `likes_count: number` field to `PublicItem` type in `lib/collections.ts`
- [x] [S] Add `likes_count: number` field to `PublicItemDetail` type in `lib/collections.ts`
- [x] [S] Update `getPublicItemsInCollection` select query to include `likes_count` from `collection_items`
- [x] [S] Update `getPublicItemBySlug` select query to include `likes_count`
- [x] [M] Add `getItemLikedByUser(itemId: string, userId: string): Promise<boolean>` function using `createServerClient`, with `'use cache'`, `cacheTag(\`item-like:${userId}:${itemId}\`)`, and short `cacheLife`

---

## Phase 3 — Server Actions

> **Definition of Done**: `likeItem` and `unlikeItem` Server Actions are authenticated, idempotent, and revalidate the correct cache tags. Self-like and unauthenticated attempts are rejected.

*Depends on: Phase 1, Phase 2*

- [x] [M] Add `likeItem(itemId: string)` Server Action to `app/[username]/[collectionSlug]/actions.ts`: authenticate with `getSessionAndRole()`, upsert into `item_likes` with `ON CONFLICT DO NOTHING`, revalidate item and like cache tags
- [x] [M] Add `unlikeItem(itemId: string)` Server Action to `app/[username]/[collectionSlug]/actions.ts`: authenticate, delete matching row from `item_likes`, revalidate same cache tags

---

## Phase 4 — LikeButton Feature Slice

> **Definition of Done**: `LikeButton` renders correctly for authenticated, unauthenticated, and owner states. Heart animation fires on like transition only. Accessible via keyboard. Analytics events fire on like/unlike.

*Depends on: Phase 3*

- [x] [S] Scaffold FSD slice: create `src/features/like-item/ui/`, `src/features/like-item/index.ts`
- [x] [M] Register `'like_item'` and `'unlike_item'` action types in `src/shared/lib/analytics/events.ts`
- [x] [L] Implement `LikeButton.tsx` Client Component:
  - Props: `itemId`, `initialCount`, `initialLiked`, `isOwner`, `isAuthenticated`
  - `useState` for `count` and `liked`, seeded from props
  - `useTransition` wrapping `likeItem` / `unlikeItem` Server Action calls with local state update on success
  - Unauthenticated redirect to `/login?origin=<pathname>`
  - Returns `null` for owner
  - `aria-label` and `aria-pressed` attributes
  - Inline heart SVG (outline for unliked, filled for liked)
  - Analytics tracking via `useAnalytics`
- [x] [M] Implement `LikeButton.module.css`:
  - Heart icon styles using `--color-primary` (liked) and `--color-text-secondary` (unliked)
  - `@keyframes like-pop` animation (scale up → slight overshoot → settle)
  - Animation class applied only on liked → via JS-toggled CSS class, not on mount
  - Count display styles
  - Disabled/pending state styles
- [x] [S] Export `LikeButton` from `src/features/like-item/index.ts`

---

## Phase 5 — Integration: Item Detail Page

> **Definition of Done**: `LikeButton` appears on the item detail page for non-owners of public items. Auth check streams in via Suspense without blocking the cached shell. Like count updates without full page reload.

*Depends on: Phase 4*

- [x] [M] Create `LikeSection` async Server Component (inline or in `_components/`) that fetches auth state and calls `getItemLikedByUser`, then renders `<LikeButton>` with correct props
- [x] [S] Create `LikeButtonSkeleton` static placeholder (heart icon + cached count) for the Suspense fallback
- [x] [M] Add `<Suspense fallback={<LikeButtonSkeleton count={item.likes_count} />}><LikeSection ... /></Suspense>` to `ItemMeta` in `app/[username]/[collectionSlug]/[slug]/page.tsx` alongside `SocialShare` and `IHaveThisButton`

---

## Phase 6 — Integration: Collection List Page

> **Definition of Done**: Like count badge is visible on item cards when `likes_count > 0`. No like action on the list — count only. Correct styles applied via CSS Modules.

*Depends on: Phase 2*

- [x] [S] Add like count badge markup to the item card render loop in `app/[username]/[collectionSlug]/page.tsx` (show only when `item.likes_count > 0`)
- [x] [S] Add `.item-card__like-count` BEM styles to `app/[username]/[collectionSlug]/page.module.css` using design tokens (heart icon + count inline, `--color-text-secondary`)

---

## Phase 7 — Analytics Event Registration

> **Definition of Done**: `AnalyticsEvent` type includes `like_item` and `unlike_item`. TypeScript enforces correct shape when tracking these events.

*Can run in parallel with Phase 4*

- [x] [S] Add `'like_item'` and `'unlike_item'` to the `AnalyticsEvent` action union type in `src/shared/lib/analytics/events.ts`

> Note: This task overlaps with the analytics step in Phase 4 — complete it before implementing `LikeButton.tsx`.

---

## Phase 8 — TypeScript Types

> **Definition of Done**: `lib/supabase/types.ts` reflects the new `item_likes` table and `likes_count` column. No TypeScript errors in the project.

*Depends on: Phase 1*

- [x] [S] Regenerate `lib/supabase/types.ts` via Supabase MCP (`mcp__supabase__generate_typescript_types`) after migration is applied
- [x] [S] Verify `PublicItem.likes_count` and `PublicItemDetail.likes_count` align with the generated DB types (no type mismatch)

---

## Phase 9 — Changeset

> **Definition of Done**: A changeset file is committed alongside the feature PR describing the user-facing change.

*Depends on: all previous phases*

- [x] [S] Run `pnpm changeset` from the monorepo root, select `@dezkareid/collectstory`, bump type `minor`, and write a user-facing summary (e.g. "Users can now like collection items to show appreciation and help surface popular items")
