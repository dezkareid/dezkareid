---
feature: upload-collection-item
status: in-progress
date: 2026-03-30
---

# Tasks: Upload Collection Item

## Dependencies Overview

```
Phase 1 (DB) → Phase 2 (Upload Route) → Phase 3 (Slug util)
                                       → Phase 9 (Edit Profile) → Phase 8 (Item Detail)
Phase 3 → Phase 4 (Server Actions) → Phase 5 (Add Item Form) → Phase 6 (Modal + Collection Page)
Phase 6 → Phase 7 (Last Additions)
Phase 8 → Phase 10 (Image Update)
```

---

## Phase 1 — Database Migration

**Definition of Done**: Migrations applied to Supabase; `collection_items` has `visibility` and `slug` columns with constraints; `profiles` has `username` and `avatar_url`; all RLS policies in place.

- [x] [S] Write migration `004_collection_items_upload.sql`: add `visibility` column (enum check, default `'public'`), `slug` column, unique constraint `(user_id, slug)`, and `collection_items_public_read` RLS policy
- [x] [S] Write migration `005_profiles_username.sql`: add `username` column (unique, format check), `avatar_url` column, `profiles_public_read` policy, `profiles_update_own` policy
- [x] [S] Apply both migrations via Supabase MCP or CLI

---

## Phase 2 — Cloudinary Upload Route Handler

**Definition of Done**: `POST /api/upload` accepts a file, validates it, uploads to Cloudinary in the correct folder, and returns the URL. Returns 401 for unauthenticated requests and 400 for invalid files.

- [x] [S] Add `cloudinary` npm package to `apps/collectstory` at exact version
- [x] [S] Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to `.env.local.example`
- [x] [M] Create `app/api/upload/route.ts`: authenticate session, validate file (type: JPEG/PNG/WebP, size ≤ 5 MB), upload to Cloudinary under `collectstory/<user-id>/` (or `collectstory/avatars/<user-id>/` for avatars based on a `type` param), return `{ url }` or `{ error }`

---

## Phase 3 — Slug Generation Utility

**Definition of Done**: `toSlug` and `generateUniqueSlug` are exported from `lib/slug.ts` and handle edge cases (special chars, collisions, long names).

- [x] [S] Create `lib/slug.ts` with `toSlug(name: string): string` (lowercase, kebab, max 60 chars)
- [x] [S] Add `generateUniqueSlug(supabase, userId, name): Promise<string>` that queries existing slugs and appends `-2`/`-3` suffix on collision

---

## Phase 4 — Server Actions for Item Creation

**Definition of Done**: `createCollectionItem` inserts a row with all fields and returns the new item or an error. `updateItemImage` updates `image_url` and revalidates paths.

- [x] [M] Create (or extend) `app/collection/actions.ts` with `createCollectionItem(prevState, formData)`: validate name, generate slug, insert into `collection_items`, return `{ error }` or `{ success, item }`
- [x] [S] Add `updateItemImage(itemId, imageUrl)` Server Action: verify ownership, update `image_url`, call `revalidatePath`
- [x] [S] Add `getLinesByBrand(brandId)` Server Action: query `lines` filtered by `brand_id`, return array for form cascade

---

## Phase 5 — Add Item Form Component

**Definition of Done**: Form renders all fields, validates name client-side, enforces 5 MB file limit, cascades lines on brand change, calls upload Route Handler then Server Action, and displays errors/success.

- [x] [M] Create `components/AddItemForm/AddItemForm.tsx` (`'use client'`): all fields (name, image, brand, line, category, description, date acquired, visibility), `useActionState` wired to `createCollectionItem`
- [x] [S] Add client-side file validation: type check (JPEG/PNG/WebP) and size check (≤ 5 MB) with error display before submission
- [x] [S] Implement brand → line cascade: on brand change call `getLinesByBrand`, populate line select, clear selection when brand is cleared
- [x] [S] Add image upload step in submit handler: if file selected, POST to `/api/upload`, append returned URL to FormData before calling Server Action
- [x] [S] Create `components/AddItemForm/AddItemForm.module.css`

---

## Phase 6 — Add Item Modal on Collection Page

**Definition of Done**: "Add Item" button on `/collection` opens a dialog modal containing the form. On success the modal closes and the collection list refreshes.

- [x] [S] Create `components/AddItemModal/AddItemModal.tsx` (`'use client'`): wraps `AddItemForm` in a `<dialog>`, opens via `showModal()`, closes on success and calls `router.refresh()`
- [x] [M] Update `app/collection/page.tsx`: fetch brands and categories server-side, pass to `AddItemModal`, render "Add Item" button in page header
- [x] [S] Add modal/button styles to `app/collection/page.module.css`

---

## Phase 7 — Last Additions Section

**Definition of Done**: Collection home shows a "Last Additions" strip with up to 6 most recent items above the full grid. Section is hidden when user has no items.

- [x] [M] Split `app/collection/page.tsx` into `<LastAdditions />` and `<AllItems />` async server sub-components; `LastAdditions` queries top 6 by `created_at` desc
- [x] [S] Style `LastAdditions` as a visually distinct horizontal scroll strip in `page.module.css`

---

## Phase 8 — Item Detail Page

**Definition of Done**: `/<username>/items/[slug]` renders for `public` items without auth. Returns 404 for missing username, missing slug, or non-public items. `<title>` includes item name.

- [x] [S] Verify `middleware.ts` matcher does not accidentally protect `/<username>/items/*`
- [x] [M] Create `app/[username]/items/[slug]/page.tsx`: resolve username → user_id via `profiles`, fetch item by `(user_id, slug)` with `visibility = 'public'`, call `notFound()` on miss, render item detail layout
- [x] [S] Export `generateMetadata` from the page: `title: '<name> — Collectstory'`, `description` from item or default
- [x] [S] Create `app/[username]/items/[slug]/page.module.css`

---

## Phase 9 — Edit Profile Form

**Definition of Done**: Authenticated users can navigate to `/profile/edit`, set a unique username (with availability feedback), upload a profile picture, and save. Avatar appears in the collection layout header.

- [x] [S] Create `lib/reserved-usernames.ts`: export array of reserved slugs (`collection`, `login`, `admin`, `stores`, `api`, `auth`, `profile`, `items`)
- [x] [S] Add `updateProfile(prevState, formData)` Server Action in `app/profile/edit/actions.ts`: validate username format, check reserved list, update `profiles` row, handle `23505` unique constraint error, `revalidatePath('/collection')`
- [x] [S] Add `checkUsernameAvailable(username)` Server Action: query `profiles` for existing username, return `{ available: boolean }`
- [x] [M] Create `components/EditProfileForm/EditProfileForm.tsx` (`'use client'`): username field with on-blur availability check, avatar file input (≤ 3 MB), upload avatar via `/api/upload` on submit, call `updateProfile` via `useActionState`
- [x] [S] Create `app/profile/edit/page.tsx`: fetch current profile server-side, render `<EditProfileForm>` pre-populated
- [x] [S] Add "Edit Profile" link in `app/collection/layout.tsx` header
- [x] [S] Display avatar in collection layout header when `avatar_url` is set
- [x] [S] Create `components/EditProfileForm/EditProfileForm.module.css`

---

## Phase 10 — Image Update on Item Detail

**Definition of Done**: The item owner sees an "Edit Image" button on the item detail page. Uploading a new image updates the item and the page reflects the change.

- [x] [S] In `app/[username]/items/[slug]/page.tsx`, check session server-side; if viewer is item owner, render `<UpdateImageForm itemId={...} />`
- [x] [M] Create `components/UpdateImageForm/UpdateImageForm.tsx` (`'use client'`): file input with preview, POST to `/api/upload`, call `updateItemImage` Server Action, show loading/error/success states
- [x] [S] Create `components/UpdateImageForm/UpdateImageForm.module.css`
