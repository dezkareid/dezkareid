# Task List: User Photo Sessions

> Feature: `user-photo-sessions` | Branch: `feat/user-photo-sessions`
> Working dir: `apps/collectstory/working-on/user-photo-sessions/`

---

## Phase 1 — Database & API Foundation

> **Dependencies**: none — start here.
> **Definition of Done**: All three tables exist in Supabase with correct RLS and triggers. Query helpers compile with strict TypeScript. Local migration files match remote timestamps.

- [x] [M] Apply Supabase migration: create `photo_sessions`, `session_photos`, `session_likes` tables with correct columns, foreign keys, and cascade rules
- [x] [S] Apply Supabase migration: add `likes_count` increment/decrement triggers on `session_likes` insert/delete (same pattern as `collection_items.likes_count`)
- [x] [M] Apply Supabase migration: add RLS policies — public SELECT on all three tables; owner-scoped INSERT/UPDATE/DELETE on `photo_sessions` and `session_photos`; authenticated user INSERT/DELETE on own `session_likes` rows
- [x] [S] Rename local migration files to match remote timestamps (per AGENTS.md pitfall)
- [x] [M] Create `lib/sessions.ts` with TypeScript types (`PublicSession`, `SessionPhoto`) and query helpers: `getSessionsByUsername`, `getSessionBySlug`, `getSessionPhotos`, `getUserSessionCount`, `getSessionPhotoCount`, `isSessionLikedByUser`

---

## Phase 2 — Server Actions & Route Handlers

> **Dependencies**: Phase 1 complete (tables + query helpers must exist).
> **Definition of Done**: All mutations are auth-guarded, enforce limits, call `revalidatePath`, and return typed responses. Route handlers return correct HTTP status codes.

- [x] [M] Create `app/[locale]/[username]/sessions/actions.ts` with `createSession` (auth check, ≤5 limit, slug generation, insert, revalidate), `renameSession` (auth + ownership, update name, revalidate), `deleteSession` (auth + ownership, cascade delete, revalidate)
- [x] [M] Create `app/[locale]/[username]/sessions/[sessionSlug]/actions.ts` with `deleteSessionPhoto` (auth + ownership via join, Cloudinary delete + DB delete, revalidate), `likeSession` (auth, insert, revalidate), `unlikeSession` (auth, delete, revalidate)
- [x] [S] Extract `optimizeImage` from `app/api/upload/route.ts` into `lib/image/optimize.ts` so it can be imported by both upload handlers without circular deps
- [x] [M] Create `app/api/sessions/[sessionId]/photos/route.ts` (POST): auth + ownership check, ≤20 photo limit, Sharp → Cloudinary pipeline (reuse `optimizeImage`), assign `position`, return `{ id, image_url, position }`
- [x] [M] Create `app/api/sessions/[sessionId]/photos/reorder/route.ts` (PATCH): auth + ownership check, accept `{ orderedIds: string[] }`, batch-update `position` values, call `revalidatePath`

---

## Phase 3 — Shared Hook Extraction

> **Dependencies**: None (pure refactor, no DB dependency).
> **Definition of Done**: `useKeyboardNav` and `useSwipe` live in `src/shared/lib/explorer/`. `CollectionExplorerView` imports from there. Existing collection explorer behaviour is unchanged (manual smoke test).

- [x] [S] Create `src/shared/lib/explorer/useKeyboardNav.ts` — copy hook from `CollectionExplorerView.tsx` verbatim
- [x] [S] Create `src/shared/lib/explorer/useSwipe.ts` — copy hook from `CollectionExplorerView.tsx` verbatim
- [x] [S] Create `src/shared/lib/explorer/index.ts` — export both hooks
- [x] [S] Update `CollectionExplorerView.tsx` to import `useKeyboardNav` and `useSwipe` from `@/src/shared/lib/explorer`; remove inline definitions

---

## Phase 4 — Entity & Feature Components

> **Dependencies**: Phase 2 (actions must exist for mutations), Phase 3 (shared hooks must exist for explorer).
> **Definition of Done**: Each component renders correctly in isolation. Owner controls visible only to owner. DnD reorder triggers API call. Upload validates client-side before POST.

- [x] [S] Create `src/entities/session/ui/SessionCard.tsx` + `SessionCard.module.css` + `src/entities/session/index.ts` — displays thumbnail, name, photo count, like count; links to `/{username}/sessions/{slug}`
- [x] [M] Create `src/features/like-session/ui/SessionLikeButton.tsx` + `SessionLikeButton.module.css` + `src/features/like-session/index.ts` — optimistic like/unlike using `likeSession`/`unlikeSession` actions; unauthenticated users redirected to `/login?redirectTo=...`
- [x] [S] Create `src/features/explore-session/ui/SessionExploreButton.tsx` — client component, secondary Button + Shelves icon, opens `SessionExplorerView`; returns `null` when `photos.length === 0`
- [x] [M] Create `src/features/explore-session/ui/SessionExplorerView.tsx` + `SessionExplorerView.module.css` — carousel modal using `useKeyboardNav` + `useSwipe`; portal rendering; position counter; no pagination (max 20 photos)
- [x] [S] Create `src/features/explore-session/index.ts` — export `SessionExploreButton`
- [x] [L] Create `src/features/session-photos/ui/SessionPhotoGrid.tsx` + `SessionPhotoGrid.module.css` — `@dnd-kit/sortable` for owner; optimistic reorder on `onDragEnd` → debounced PATCH to reorder route; delete button per photo calling `deleteSessionPhoto`; static grid for visitors
- [x] [M] Create `src/features/session-photos/ui/PhotoUploadZone.tsx` + `PhotoUploadZone.module.css` — file input + drop area; client-side type/size validation; POST to `/api/sessions/{sessionId}/photos`; optimistic append; disabled + error when count ≥ 20
- [x] [S] Create `src/features/session-photos/index.ts` — export `SessionPhotoGrid`, `PhotoUploadZone`
- [x] [M] Create `src/features/owner-session-actions/ui/CreateSessionModal.tsx` + `CreateSessionModal.module.css` — name + description fields; calls `createSession`; disabled when session count ≥ 5
- [x] [M] Create `src/features/owner-session-actions/ui/SessionActionsMenu.tsx` + `SessionActionsMenu.module.css` — uses `DropdownMenu`/`DropdownMenuItem`; Rename (inline or small modal → `renameSession`); Delete (confirmation → `deleteSession` → redirect)
- [x] [S] Create `src/features/owner-session-actions/index.ts` — export `CreateSessionModal`, `SessionActionsMenu`
- [x] [S] Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` at exact versions from monorepo root via `pnpm add`

---

## Phase 5 — Pages & Routing

> **Dependencies**: Phase 4 complete (all components must exist).
> **Definition of Done**: Both pages render via ISR. `notFound()` returns 404 for unknown usernames/slugs. `generateMetadata` returns correct title/OG. Sitemap includes session URLs. Nav link appears on profile page.

- [x] [M] Create `app/[locale]/[username]/sessions/page.tsx` + `page.module.css` — ISR; fetches `getSessionsByUsername`; renders `SessionCard` grid; owner sees `CreateSessionModal` trigger; empty state for no sessions
- [x] [S] Create `app/[locale]/[username]/sessions/page.tsx` `generateStaticParams` — same pattern as collection pages (one `_placeholder` per locale)
- [x] [M] Add `generateMetadata` to sessions list page — title `"{name}'s Photo Sessions"`, OG image = first photo of first session or fallback logo
- [x] [L] Create `app/[locale]/[username]/sessions/[sessionSlug]/page.tsx` + `page.module.css` — ISR; `Promise.all` for session + photos + liked status; `notFound()` on missing session; renders `SessionPhotoGrid` or static grid; `SessionExploreButton`; `SessionLikeButton`; owner gets `PhotoUploadZone` + `SessionActionsMenu`
- [x] [S] Add `generateStaticParams` to session detail page — same `_placeholder` pattern per locale
- [x] [M] Add `generateMetadata` to session detail page — title, description, OG image = first photo
- [x] [S] Add session URLs to `app/sitemap.ts` — query all `photo_sessions`, emit `/{username}/sessions/` and `/{username}/sessions/{slug}/`
- [x] [S] Add "Sessions" nav link to `app/[locale]/[username]/page.tsx` — alongside existing collections list

---

## Phase 6 — Upload Config Extension

> **Dependencies**: Phase 2 task "Extract `optimizeImage`" must be complete before this phase.
> **Definition of Done**: `optimizeImage` imported from `lib/image/optimize.ts` in both upload handlers. `app/api/upload/route.ts` unchanged in behaviour.

- [x] [S] Update `app/api/upload/route.ts` to import `optimizeImage` from `lib/image/optimize.ts` instead of defining it inline
- [x] [S] Add `session` upload config entry to `UPLOAD_CONFIG` in `lib/image/optimize.ts` (same settings as `item`: 5 MB, 1200 px, WebP 80)

---

## Phase 7 — Analytics, SEO & i18n

> **Dependencies**: Phase 5 complete (pages must exist for i18n keys to have context).
> **Definition of Done**: Analytics events fire on like/unlike/explore-open/create. JSON-LD present on detail page. All UI strings use translation keys (no hardcoded English in JSX).

- [x] [S] Add analytics events to `src/shared/lib/analytics/events.ts`: `create_session`, `like_session`, `unlike_session`, `explore_session_open`
- [x] [S] Wire `track()` calls into `CreateSessionModal`, `SessionLikeButton`, `SessionExploreButton`
- [x] [S] Add `ImageGallery` JSON-LD structured data to session detail page using `DataSchema` component
- [x] [M] Add all i18n translation keys for session UI (button labels, empty states, error messages, metadata strings, aria-labels) to locale message files

---

## Cross-Cutting

> These tasks apply across all phases.

- [x] [S] Create changeset (`pnpm changeset`) — bump type `minor`, description: "Add Photo Sessions feature: `/{username}/sessions/` list and detail pages with photo upload, drag-and-drop reorder, and session likes"
- [x] [M] Smoke-test golden path: create session → upload photos → reorder → like → visit as visitor → open explorer → navigate carousel
- [x] [S] Accessibility check on both new pages using axe-core via `chrome-user-session` MCP (zero critical/serious violations)
