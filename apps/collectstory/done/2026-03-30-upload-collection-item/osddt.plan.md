---
feature: upload-collection-item
status: draft
date: 2026-03-30
---

# Plan: Upload Collection Item

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 16 App Router (Server Components + Server Actions)
- **Database**: Supabase (PostgreSQL + RLS)
- **Media Storage**: Cloudinary — upload via signed upload preset or server-side SDK; images stored under `collectstory/<user-id>/`
- **Styling**: CSS Modules + `@dezkareid/design-tokens` CSS custom properties

### Key Design Decisions

1. **Image upload flow**: Client-side file selection → validate size/type → POST to a Next.js Route Handler (`/api/upload`) which signs and uploads to Cloudinary server-side (avoids exposing API secret). Route Handler returns the Cloudinary URL, which is then included in the Server Action form submission.

2. **Form architecture**: The Add Item form is a `'use client'` component using `useActionState` (React 19) to call a Server Action. Brand/line cascade is handled with local `useState` in the client form — selecting a brand fetches lines via a separate Server Action call.

3. **Visibility column**: Add a `visibility` enum column (`public`, `private`, `draft`) to `collection_items`. Default is `public`. RLS policy for public SELECT on the item detail page checks `visibility = 'public'`.

4. **Slug**: Add a `slug` text column to `collection_items`. Generated server-side from the item name (kebab-case). Uniqueness is scoped per user (unique constraint on `(user_id, slug)`). Collisions get a `-2`, `-3`, ... suffix.

5. **Item detail page**: Public route `app/[username]/items/[slug]/page.tsx` — scopes items under the owner's username namespace. Fetches by `(username, slug)` join through `profiles`. Only renders if `visibility = 'public'`, otherwise calls `notFound()`.

6. **Collection page refactor**: Split `CollectionItems` into two server sub-components — `LastAdditions` (top 6 by `created_at`) and `AllItems` (full grid). Add Item button opens a `<dialog>` modal managed by a client wrapper.

7. **Image update**: The item detail page (`/<username>/items/[slug]`) includes an "Edit Image" button visible only to the authenticated owner, invoking the same upload Route Handler + a `updateItemImage` Server Action.

---

## Implementation Phases

### Phase 1 — Database Migration

**Goal**: Extend `collection_items` with the new columns needed for this feature.

- Add migration `004_collection_items_upload.sql`:
  - Add `visibility` column: `text not null default 'public' check (visibility in ('public', 'private', 'draft'))`
  - Add `slug` column: `text not null default ''`
  - Add unique constraint: `unique (user_id, slug)`
  - Add RLS policy: allow unauthenticated SELECT on `collection_items` when `visibility = 'public'` (for item detail pages — needed since the detail route is public)
  - Update `updated_at` trigger (already exists, no change needed)

### Phase 2 — Cloudinary Upload Route Handler

**Goal**: Server-side image upload to Cloudinary, returning the stored URL.

- Create `app/api/upload/route.ts` (POST)
  - Accept `multipart/form-data` with a single `file` field and `userId` claim from session
  - Validate: file must be JPEG/PNG/WebP, ≤ 5 MB
  - Use Cloudinary Node SDK (`cloudinary` package) to upload with:
    - `folder: collectstory/<user-id>`
    - `resource_type: image`
    - `transformation: [{ width: 1200, crop: 'limit' }]` (limit max size)
  - Return `{ url: string }` on success, `{ error: string }` on failure
  - Route is authenticated — reads session from cookies; returns 401 if no session
- Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to `.env.local.example`

### Phase 3 — Slug Generation Utility

**Goal**: Reusable server-side slug generator with per-user collision handling.

- Create `lib/slug.ts`:
  - `toSlug(name: string): string` — lowercase, replace non-alphanumeric with `-`, collapse/trim hyphens, truncate to 60 chars
  - `generateUniqueSlug(supabase, userId, name): Promise<string>` — calls `toSlug`, queries existing slugs for that user matching `slug LIKE '<base>%'`, appends `-2`/`-3` etc. if collision

### Phase 4 — Add Item Server Action

**Goal**: Server Action that creates a new `collection_items` row with all fields.

- Create `app/collection/actions.ts` (extend existing file or new file):
  - `createCollectionItem(prevState, formData: FormData)`:
    - Validate: `name` required
    - Call `generateUniqueSlug` for the item name
    - Insert row into `collection_items` with all fields including `slug` and `visibility`
    - Return `{ error }` or `{ success: true, item: ... }`
  - `updateItemImage(itemId: string, imageUrl: string)`:
    - Verify item belongs to current user
    - Update `image_url` on the row
    - Call `revalidatePath('/items/[slug]')` and `revalidatePath('/collection')`

### Phase 5 — Add Item Form Component

**Goal**: Client-side form component that orchestrates image upload + item creation.

- Create `components/AddItemForm/AddItemForm.tsx` (`'use client'`):
  - Fields: Name, Image (file input), Brand (select), Line (select, cascades from Brand), Category (select), Description (textarea), Date Acquired (date input), Visibility (select: Public/Private/Draft)
  - On file select: validate size (≤ 5 MB) and type client-side; show error if invalid
  - On form submit:
    1. If file selected: POST to `/api/upload`, get back `imageUrl`
    2. Append `imageUrl` to FormData
    3. Call `createCollectionItem` Server Action via `useActionState`
  - Brand change handler: on brand select, fetch lines filtered by brand (via a Server Action `getLinesByBrand(brandId)` or inline fetch)
  - Show inline error messages from action state
  - On success: call a passed `onSuccess` callback (to close modal + trigger list refresh)
- Fetch brands and categories server-side, pass as props to the form
- Create `components/AddItemForm/AddItemForm.module.css`

### Phase 6 — Add Item Modal on Collection Page

**Goal**: Wire the form into the collection page behind an "Add Item" button.

- Create `components/AddItemModal/AddItemModal.tsx` (`'use client'`):
  - Renders a `<dialog>` element; opens via `showModal()` on button click
  - Renders `<AddItemForm>` inside the dialog
  - On `onSuccess`: closes dialog, calls `router.refresh()` to re-fetch the server-rendered collection list
- Update `app/collection/page.tsx`:
  - Fetch brands and categories server-side
  - Render `<AddItemModal brands={brands} categories={categories} />` (client component)
  - Add "Add Item" button in `pageHeader`

### Phase 7 — Last Additions Section

**Goal**: Show the 6 most recently added items in a distinct section at the top of the collection page.

- Update `app/collection/page.tsx`:
  - Split into two async server sub-components: `<LastAdditions />` and `<AllItems />`
  - `LastAdditions`: query `collection_items` ordered by `created_at` desc, limit 6
  - Render as a horizontal scroll strip with `<CollectionItemCard>` — visually differentiated by a section heading and background
  - Only render the section if the user has at least 1 item
- Add styles for `lastAdditions` section in `page.module.css`

### Phase 8 — Item Detail Page

**Goal**: Public `/<username>/items/[slug]` page for `public` items, with SEO metadata.

- Add `username` column to the `profiles` table (migration `005_profiles_username.sql`):
  - `username text unique not null` — chosen at signup or derived from OAuth display name; needs a separate onboarding step (out of scope here, use user ID prefix as fallback for now)
- Create `app/[username]/items/[slug]/page.tsx`:
  - `dynamic = 'force-dynamic'` or ISR with short revalidation (e.g. 5 min)
  - Fetch profile by `username` → get `user_id`; call `notFound()` if no matching profile
  - Fetch item by `(user_id, slug)` from `collection_items` where `visibility = 'public'` (public Supabase client, no auth)
  - Call `notFound()` if item not found or not public
  - Render item detail: large image, name, brand/line/category tags, description, date acquired
  - Export `generateMetadata`: `title: '<name> — Collectstory'`, `description` from item description or a default
  - Add `<link rel="canonical">` via metadata
- Create `app/[username]/items/[slug]/page.module.css`
- Update `middleware.ts` to ensure `/<username>/items/*` is NOT protected — verify the matcher only covers `/collection` and `/admin/*`

### Phase 9 — Edit Profile Form

**Goal**: Let users set their username and upload a profile picture — prerequisite for public item URLs.

- Extend `profiles` table with `username` and `avatar_url` (migration `005` above).
- Create `app/profile/edit/page.tsx` (authenticated, SSR):
  - Fetch current profile server-side and pre-populate the form.
  - Render `<EditProfileForm>` client component.
- Create `components/EditProfileForm/EditProfileForm.tsx` (`'use client'`):
  - **Username field**: text input; pattern `^[a-z0-9-]{3,}$` enforced client-side; on blur, call a `checkUsernameAvailable(username)` Server Action to show real-time availability.
  - **Avatar field**: file input (JPEG/PNG/WebP, ≤ 3 MB); on submit POST to `/api/upload` (reuse existing Route Handler, upload to `collectstory/avatars/<user-id>/`), get back URL.
  - Submit calls `updateProfile(prevState, formData)` Server Action:
    - Validates username format and uniqueness (catches `23505` unique constraint violation).
    - Updates `profiles` row (username, avatar_url).
    - Calls `revalidatePath('/collection')`.
  - On success: redirect to `/collection` or show success message.
- Add "Edit Profile" link in `app/collection/layout.tsx` header.
- Display avatar in the collection layout header if `avatar_url` is set.
- Reserved usernames (`collection`, `login`, `admin`, `stores`, `api`, `auth`, `profile`, `items`) are blocked at the Server Action level with a clear error message.

### Phase 10 — Image Update on Item Detail

**Goal**: Allow the authenticated owner to update the image from the item detail page.

- Add an "Edit Image" section to `app/[username]/items/[slug]/page.tsx` — only rendered if the viewing user's `user_id` matches the item owner (checked server-side via session)
- Create `components/UpdateImageForm/UpdateImageForm.tsx` (`'use client'`):
  - File input + preview
  - On submit: POST to `/api/upload`, then call `updateItemImage` Server Action
  - Show loading/error/success state

---

## Technical Dependencies

| Dependency | Version | Purpose |
|---|---|---|
| `cloudinary` | latest stable | Server-side Cloudinary upload SDK |
| `@supabase/ssr` | existing | Already in use |
| `next` | 16.2.1 | Already in use |

Only `cloudinary` is a new dependency. Add it as an exact version per monorepo conventions.

---

## Database Migration Summary

**File**: `supabase/migrations/004_collection_items_upload.sql`
**File**: `supabase/migrations/005_profiles_username.sql`

```sql
-- Add visibility and slug to collection_items
alter table collection_items
  add column visibility text not null default 'public'
    check (visibility in ('public', 'private', 'draft')),
  add column slug text not null default '';

-- Per-user slug uniqueness
alter table collection_items
  add constraint collection_items_user_slug_unique unique (user_id, slug);

-- Allow unauthenticated reads for public items (item detail pages)
create policy "collection_items_public_read"
  on collection_items for select
  using (visibility = 'public');
```

**File**: `supabase/migrations/005_profiles_username.sql`

```sql
-- Add username and avatar_url to profiles
alter table profiles
  add column username text unique
    check (username ~ '^[a-z0-9-]{3,}$'),
  add column avatar_url text;

-- Allow public read of profiles (needed to resolve username → user_id for item URLs)
create policy "profiles_public_read"
  on profiles for select using (true);

-- Allow users to update their own profile
create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

> Username is nullable initially — existing users without a username will need one before their items are publicly addressable. Item detail pages return 404 until a username is set.

> Note: The existing `collection_items_select_own` policy covers authenticated users reading their own items (all visibility states). The new `collection_items_public_read` policy covers unauthenticated reads for public items only.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Cloudinary API secret exposed in client | Upload only via server-side Route Handler; secret never leaves the server |
| Slug collision under concurrent inserts | Unique constraint on `(user_id, slug)` will cause a DB error; catch and retry with next suffix |
| Large image uploads slowing down UX | Client-side 5 MB limit; Cloudinary `crop: limit` transformation caps stored dimensions |
| `collection_items_public_read` policy bypasses user privacy | Policy checks `visibility = 'public'`; private/draft items are never returned to unauthenticated callers |
| `[username]` dynamic segment conflicts with other top-level routes | Next.js resolves static segments before dynamic ones — `/collection`, `/login`, `/admin`, `/stores`, `/items` are safe. Document reserved usernames list to prevent conflicts. |
| Users without a username set | Item detail pages return 404 until username is set; Edit Profile is surfaced prominently in the collection layout |
| Username change breaks bookmarked item URLs | Username is mutable — old URLs will 404. Acceptable for now; a redirect table can be added later if needed |
| Reserved username collision (e.g. user tries `admin`) | Blocked server-side with a clear error; list stored as a constant in `lib/reserved-usernames.ts` |
| `router.refresh()` on modal close causes full RSC re-render | Acceptable — collection page is small; no pagination yet |
| Middleware accidentally protecting `/items/*` | Verify middleware matcher pattern covers only `/collection` and `/admin`; add test route check |

---

## Out of Scope

- Editing item name, description, brand, line, category, date (separate edit feature)
- Deleting items
- Multiple images per item
- Public user profile page
- Bulk import
- Social sharing
- Admin moderation of uploads
- Global "Last Additions" feed (designed for it, not built yet)
