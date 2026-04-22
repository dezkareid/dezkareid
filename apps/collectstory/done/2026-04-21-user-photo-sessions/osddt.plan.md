# Implementation Plan: User Photo Sessions

## Architecture Overview

### Data Model

Three new Supabase tables:

**`photo_sessions`**
```
id            uuid PK default gen_random_uuid()
user_id       uuid FK → auth.users(id) ON DELETE CASCADE
name          text NOT NULL
slug          text NOT NULL
description   text
likes_count   integer NOT NULL DEFAULT 0
created_at    timestamptz NOT NULL DEFAULT now()
updated_at    timestamptz NOT NULL DEFAULT now()
UNIQUE (user_id, slug)
```

**`session_photos`**
```
id            uuid PK default gen_random_uuid()
session_id    uuid FK → photo_sessions(id) ON DELETE CASCADE
user_id       uuid FK → auth.users(id) ON DELETE CASCADE
image_url     text NOT NULL
position      integer NOT NULL DEFAULT 0
created_at    timestamptz NOT NULL DEFAULT now()
UNIQUE (session_id, position)  -- enforced at app layer, not DB unique
```

**`session_likes`**
```
session_id    uuid FK → photo_sessions(id) ON DELETE CASCADE
user_id       uuid FK → auth.users(id) ON DELETE CASCADE
created_at    timestamptz NOT NULL DEFAULT now()
PRIMARY KEY (session_id, user_id)
```

### RLS Policy Approach

- `photo_sessions`: public SELECT; authenticated INSERT (own rows only, ≤20 limit enforced in action); UPDATE/DELETE only own rows.
- `session_photos`: public SELECT; INSERT for session owner (≤20 per session enforced in action); DELETE for session owner.
- `session_likes`: public SELECT; INSERT/DELETE for authenticated user on own row only.
- `likes_count` on `photo_sessions` is maintained by two DB triggers (after INSERT/DELETE on `session_likes`) — same pattern used by `collection_items.likes_count`.

### Caching Strategy

| Route | Strategy | Revalidation |
|---|---|---|
| `/{username}/sessions/` | ISR | `revalidatePath` on session create/rename/delete |
| `/{username}/sessions/{slug}/` | ISR | `revalidatePath` on photo upload/reorder/delete, session edit |
| API: `/api/sessions/{id}/photos/reorder` | Route Handler (no cache) | triggers `revalidatePath` |
| API: `/api/sessions/{id}/like` | Server Action (no cache) | triggers `revalidatePath` |

### Rendering Boundaries

- **Server Components**: session list, session detail (photos grid, name, description, like count, "Explore session" button) — all initial data server-rendered for ISR.
- **Client Components**:
  - `SessionPhotoGrid` — drag-and-drop reorder (owner only), delete buttons
  - `PhotoUploadZone` — file input, preview, upload progress
  - `SessionExploreButton` — open/close modal state
  - `SessionExplorerView` — carousel modal (reuses `useKeyboardNav` and `useSwipe` hooks extracted from existing `CollectionExplorerView`)
  - `SessionLikeButton` — optimistic like/unlike (mirrors `LikeButton` from `like-item`)
  - `CreateSessionModal` — form to create a new session
  - `SessionActionsMenu` — rename/delete dropdown for owners

### Component Placement (FSD)

| Component | FSD Location |
|---|---|
| `SessionCard` | `src/entities/session/ui/SessionCard` |
| `SessionPhotoGrid` | `src/features/session-photos/ui/SessionPhotoGrid` |
| `PhotoUploadZone` | `src/features/session-photos/ui/PhotoUploadZone` |
| `SessionExploreButton` + `SessionExplorerView` | `src/features/explore-session/ui/` |
| `SessionLikeButton` | `src/features/like-session/ui/SessionLikeButton` |
| `CreateSessionModal` | `src/features/owner-session-actions/ui/CreateSessionModal` |
| `SessionActionsMenu` | `src/features/owner-session-actions/ui/SessionActionsMenu` |

### Drag-and-Drop Library

Use `@dnd-kit/core` + `@dnd-kit/sortable` — the project has no existing DnD library so this is a new dependency. `@dnd-kit` is accessible, touch-compatible, and has no peer-dependency conflicts with React 19. Auto-save on `onDragEnd` via a debounced Server Action call to the reorder API route.

### Explorer Reuse

Extract `useKeyboardNav` and `useSwipe` from `CollectionExplorerView.tsx` into `src/shared/lib/explorer/` so both the existing collection explorer and the new session explorer share the same hooks without duplication.

---

## Implementation Phases

### Phase 1 — Database & API Foundation

**Goal**: Supabase tables, RLS, triggers, and query helpers in place. No UI yet.

1. **Migration: create tables**
   - Use MCP Supabase (`mcp__supabase__apply_migration`) to apply migration creating `photo_sessions`, `session_photos`, `session_likes`.
   - Include `likes_count` trigger functions on `session_likes` insert/delete.
   - Rename local migration file to match remote timestamp (per AGENTS.md pitfall note).

2. **Migration: RLS policies**
   - `photo_sessions`: public SELECT, owner INSERT/UPDATE/DELETE.
   - `session_photos`: public SELECT, owner INSERT/DELETE (session ownership checked via join).
   - `session_likes`: public SELECT, authenticated INSERT/DELETE (own row).

3. **Query helpers** — add to `lib/sessions.ts`:
   - `getSessionsByUsername(username)` → list for ISR list page.
   - `getSessionBySlug(username, slug)` → detail for ISR detail page; returns `null` for 404.
   - `getSessionPhotos(sessionId)` → ordered photo list.
   - `getUserSessionCount(userId)` → used in create action to enforce ≤20 limit.
   - `getSessionPhotoCount(sessionId)` → used in upload action to enforce ≤20 limit.
   - `isSessionLikedByUser(sessionId, userId)` → used in detail page render for authenticated viewer.

4. **TypeScript types** — add to `lib/sessions.ts`:
   - `PublicSession` — `{ id, user_id, name, slug, description, likes_count, photo_count }`
   - `SessionPhoto` — `{ id, session_id, image_url, position }`

---

### Phase 2 — Server Actions & Route Handlers

**Goal**: All mutations implemented and secured. No UI changes yet.

5. **Server Actions** — `app/[locale]/[username]/sessions/actions.ts`:
   - `createSession(name, description)` — auth check, ≤5 session limit, slug derivation (reuse `toSlug`/`generateUniqueSlug` from `lib/slug.ts`), insert, `revalidatePath`.
   - `renameSession(sessionId, name)` — auth + ownership check, update name only (slug unchanged), `revalidatePath`.
   - `deleteSession(sessionId)` — auth + ownership check, delete (cascade removes photos + likes), `revalidatePath`.

6. **Server Actions** — `app/[locale]/[username]/sessions/[sessionSlug]/actions.ts`:
   - `deleteSessionPhoto(photoId)` — auth + ownership check (join to session), delete from Cloudinary + DB, `revalidatePath`.
   - `likeSession(sessionId)` — auth check, insert into `session_likes` (no-op if duplicate), `revalidatePath`.
   - `unlikeSession(sessionId)` — auth check, delete from `session_likes`, `revalidatePath`.

7. **Route Handler** — `app/api/sessions/[sessionId]/photos/route.ts` (POST):
   - Auth + ownership check.
   - ≤20 photo limit check.
   - Reuse existing upload pipeline (Sharp → Cloudinary) with `type: 'session'` (same config as `item`: 5 MB, 1200px, WebP 80).
   - Assign `position = current_max + 1`.
   - Return `{ id, image_url, position }`.

8. **Route Handler** — `app/api/sessions/[sessionId]/photos/reorder/route.ts` (PATCH):
   - Auth + ownership check.
   - Accept `{ orderedIds: string[] }` body.
   - Batch update `position` for all photos in one transaction.
   - Call `revalidatePath` for the session detail page.
   - Returns 200 on success.

---

### Phase 3 — Shared Hook Extraction

**Goal**: Refactor existing explorer hooks for reuse; no behaviour change to existing collection explorer.

9. **Extract shared explorer hooks** — `src/shared/lib/explorer/`:
   - `useKeyboardNav.ts` — extracted from `CollectionExplorerView.tsx`.
   - `useSwipe.ts` — extracted from `CollectionExplorerView.tsx`.
   - `index.ts` — public API.
   - Update `CollectionExplorerView.tsx` imports to use the shared hooks.

---

### Phase 4 — Entity & Feature Components

**Goal**: All UI components built, no pages wired yet.

10. **`SessionCard`** (`src/entities/session/ui/SessionCard.tsx`):
    - RSC-compatible (no client state).
    - Displays: first photo thumbnail (or placeholder), session name, photo count, like count.
    - Links to `/{username}/sessions/{slug}`.

11. **`SessionLikeButton`** (`src/features/like-session/ui/SessionLikeButton.tsx`):
    - Mirrors `LikeButton` from `like-item` exactly.
    - Uses `likeSession`/`unlikeSession` Server Actions.
    - Optimistic UI with rollback on error.
    - Unauthenticated → redirect to `/login?redirectTo=...`.

12. **`SessionExplorerView`** (`src/features/explore-session/ui/SessionExplorerView.tsx`):
    - Reuses `useKeyboardNav` and `useSwipe` from shared lib.
    - Simpler than `CollectionExplorerView` — no pagination fetch (all photos loaded server-side, max 20).
    - Props: `photos: SessionPhoto[], onClose: () => void`.
    - Renders portal with carousel, position counter, close button.
    - CSS Modules — same visual appearance as `CollectionExplorerView`.

13. **`SessionExploreButton`** (`src/features/explore-session/ui/SessionExploreButton.tsx`):
    - Client Component. Renders secondary Button with Shelves icon (same as `ExploreButton`).
    - Opens `SessionExplorerView` modal.
    - Hidden if `photos.length === 0` (checked server-side before rendering).

14. **`SessionPhotoGrid`** (`src/features/session-photos/ui/SessionPhotoGrid.tsx`):
    - Client Component. Owner-only.
    - Uses `@dnd-kit/sortable` (`SortableContext`, `useSortable`) for drag-and-drop.
    - On `onDragEnd`: optimistic reorder in local state → call reorder Route Handler → `revalidatePath` already triggered server-side.
    - Each photo card has a delete button (calls `deleteSessionPhoto` Server Action).
    - Non-owner: renders static grid (no DnD wrapper).

15. **`PhotoUploadZone`** (`src/features/session-photos/ui/PhotoUploadZone.tsx`):
    - Client Component. Owner-only.
    - File input + drag-and-drop file drop area.
    - Validates type (JPEG/PNG/WebP) and size (≤5 MB) client-side before upload.
    - POSTs to `/api/sessions/{sessionId}/photos`.
    - Shows upload progress; on success, optimistically appends photo to grid.
    - Disabled + error message when photo count ≥ 20.

16. **`CreateSessionModal`** (`src/features/owner-session-actions/ui/CreateSessionModal.tsx`):
    - Client Component.
    - Name (required) + Description (optional) fields.
    - Calls `createSession` Server Action.
    - Disabled when session count ≥ 5.

17. **`SessionActionsMenu`** (`src/features/owner-session-actions/ui/SessionActionsMenu.tsx`):
    - Client Component. Uses existing `DropdownMenu` / `DropdownMenuItem` from `src/shared/ui/dropdown-menu`.
    - Items: "Rename", "Delete".
    - Rename: inline input or small modal → `renameSession` Server Action.
    - Delete: confirmation prompt → `deleteSession` Server Action → `router.push(/{username}/sessions/)`.

---

### Phase 5 — Pages & Routing

**Goal**: Wire all components into Next.js routes under `[username]/sessions/`.

18. **Sessions list page** — `app/[locale]/[username]/sessions/page.tsx`:
    - ISR. Fetches `getSessionsByUsername(username)`.
    - `notFound()` if username doesn't exist (reuse existing `getProfileByUsername` check).
    - Renders `SessionCard` grid + `CreateSessionModal` button for authenticated owner.
    - Empty state for users with no sessions.
    - `generateMetadata`: title `"{name}'s Photo Sessions"`, OG image = first session's first photo.

19. **Session detail page** — `app/[locale]/[username]/sessions/[sessionSlug]/page.tsx`:
    - ISR. Fetches `getSessionBySlug(username, sessionSlug)` + `getSessionPhotos(session.id)` + `isSessionLikedByUser(session.id, userId)` in `Promise.all`.
    - `notFound()` if session not found.
    - Server renders: name, description, photo grid (static for visitors / `SessionPhotoGrid` for owner), `SessionExploreButton` (hidden if no photos), `SessionLikeButton`.
    - Owner gets `PhotoUploadZone` and `SessionActionsMenu`.
    - `generateMetadata`: title, description, OG image = first photo.

20. **`generateStaticParams`** for both pages:
    - Same pattern as collection pages: return `[{ username: '_placeholder', locale }]` per locale — actual paths are ISR-generated on first visit.

21. **Sitemap** — add session list and detail URLs to `app/sitemap.ts`:
    - Query all public `photo_sessions` rows.
    - Emit `/{username}/sessions/` and `/{username}/sessions/{slug}/` entries.

22. **Navigation link** — add "Sessions" link to the user profile page (`app/[locale]/[username]/page.tsx`) alongside the existing collections list.

---

### Phase 6 — Upload Config Extension

23. **Extend `UPLOAD_CONFIG`** in `app/api/upload/route.ts`:
    - Add `session` type: `{ maxBytes: 5 * 1024 * 1024, maxDimension: 1200, quality: 80 }`.
    - Session upload Route Handler (`app/api/sessions/[sessionId]/photos/route.ts`) calls the same `optimizeImage` helper directly (it imports from a shared util, not from the route handler file).
    - Extract `optimizeImage` to `lib/image/optimize.ts` so both upload handlers can import it without circular deps.

---

### Phase 7 — Analytics & SEO

24. **Analytics events** — add to `src/shared/lib/analytics/events.ts`:
    - `create_session`, `like_session`, `unlike_session`, `explore_session_open`.

25. **Structured data** — on session detail page:
    - Emit `ImageGallery` JSON-LD schema with `image` array pointing to each photo URL.

26. **i18n** — add translation keys for all new UI strings (button labels, empty states, error messages, metadata) in the locale message files.

---

## Technical Dependencies

| Dependency | Version | Why |
|---|---|---|
| `@dnd-kit/core` | latest stable | Drag-and-drop sortable grid (accessible, touch-compatible, React 19 compatible) |
| `@dnd-kit/sortable` | latest stable | `useSortable` hook + `SortableContext` for photo grid |
| `@dnd-kit/utilities` | latest stable | `CSS.Transform.toString` utility |

> Check latest versions at install time and pin exact versions per monorepo convention.

**No new backend dependencies** — Cloudinary, Sharp, Supabase, and next/image are already in use.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Migration timestamp mismatch after MCP apply | Rename local file to match remote timestamp per AGENTS.md instructions |
| DnD reorder race condition (multiple rapid drops) | Debounce reorder API call by 300 ms; optimistic state prevents visible flicker |
| `position` column gaps after photo deletion | Use `position` only for ordering, not as a dense sequence; ORDER BY position on read |
| ISR stale data after owner mutation | Always call `revalidatePath` in every Server Action and Route Handler that mutates session/photo/like data |
| `CollectionExplorerView` refactor breaks existing explorer | Extract hooks as a pure copy first (no deletion), update imports, run existing tests; delete old inline definitions only when tests pass |
| `session` upload type added to shared `UPLOAD_CONFIG` | Extract `optimizeImage` to `lib/image/optimize.ts` first to avoid importing from the route handler |
| Slug collision on rename (name already taken for that user) | `generateUniqueSlug` in `lib/slug.ts` already handles uniqueness — pass `user_id` as the scope parameter |

---

## Out of Scope

- Sessions attached to or filterable by a specific collection item.
- Per-session visibility toggle.
- Video uploads.
- Comments on sessions or individual photos.
- Linking from within the "Explore collection" carousel to photo sessions.
- Session analytics or view counts.
- Notifications on session likes.
- Any changes to existing item cover image handling.
