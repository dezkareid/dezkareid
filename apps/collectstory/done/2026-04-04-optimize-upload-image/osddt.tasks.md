# Tasks: Optimize Upload Image

## Phase 1 — Add `sharp` dependency

- [x] [S] Add `sharp` (exact version) to `dependencies` and `@types/sharp` to `devDependencies` in `apps/collectstory/package.json`
- [x] [S] Run `pnpm install` from the monorepo root and verify lockfile is updated

**Definition of Done:** `sharp` imports without error in a Next.js Route Handler; `pnpm typecheck` passes for `apps/collectstory`.

**Dependencies:** none

---

## Phase 2 — Server-side optimization in the upload route

- [x] [M] Replace scattered constants (`MAX_BYTES`, `MAX_AVATAR_BYTES`, inline Cloudinary transformation) with a centralized `UPLOAD_CONFIG` object in `app/api/upload/route.ts`
- [x] [M] Implement `optimizeImage(buffer, type)` function using `sharp`: resize (longest-edge, no upscale), convert to WebP, apply quality 80
- [x] [S] Add output-size guard: if optimized buffer is larger than input buffer, return a 500 error
- [x] [S] Wire `optimizeImage` into the upload handler: call it after validation, pass its output buffer to Cloudinary `upload_stream`
- [x] [S] Remove the `transformation` array from the Cloudinary `upload_stream` options
- [x] [S] Wrap `optimizeImage` call in try/catch; return a 500 error response on failure (no fallback to original)

**Definition of Done:** uploading a JPEG via the API returns a Cloudinary URL pointing to a `.webp` file smaller than the original; uploading an oversized file still returns the correct validation error.

**Dependencies:** Phase 1 must be complete.

---

## Phase 3 — Client-side metadata stripping

- [x] [M] Create `lib/image/strip-metadata.ts` with a `stripMetadata(file: File): Promise<File>` utility using the Canvas API (draw to canvas, export via `toBlob`, return new `File` preserving name and MIME type)
- [x] [S] Call `stripMetadata(file)` in `uploadFile` helper in `app/[username]/[collectionSlug]/items/new/AddItemPageForm.tsx` before appending to `FormData`
- [x] [S] Call `stripMetadata(file)` in `uploadFile` helper in `app/[username]/[collectionSlug]/items/[itemId]/edit/EditItemForm.tsx` before appending to `FormData`

**Definition of Done:** uploading a JPEG with EXIF data results in the file sent to the server having no EXIF metadata; `pnpm typecheck` passes.

**Dependencies:** Phase 2 should be complete but this phase can be developed in parallel.

---

## Phase 4 — Validation consistency cleanup

- [x] [S] Update the client-side `ALLOWED_TYPES` and `MAX_BYTES` constants in `AddItemPageForm.tsx` to reference or match the values in `UPLOAD_CONFIG` (item limits)
- [x] [S] Update the same constants in `EditItemForm.tsx`

**Definition of Done:** client-side and server-side validation limits are consistent; no magic numbers remain in the form components.

**Dependencies:** Phase 2 must be complete (so `UPLOAD_CONFIG` values are established).
