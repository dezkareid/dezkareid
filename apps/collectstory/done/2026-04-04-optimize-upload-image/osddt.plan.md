# Plan: Optimize Upload Image

## Architecture Overview

Image optimization is applied in two complementary layers, keeping heavy processing on the server while offloading lightweight metadata stripping to the client:

### Layer 1 — Client-side: metadata stripping (browser)

Before the file is sent to the server, the browser strips EXIF and other metadata from the image using the **Canvas API** (no extra dependency). The `<canvas>` element re-encodes the image pixel data only, naturally discarding all metadata. This is done inside the existing `uploadFile` helper in the form components.

Why Canvas over a WASM library: the Canvas API is universally available in modern browsers, adds zero bundle size, and is sufficient for stripping metadata from JPEG, PNG, and WebP. A WASM library (e.g. `libvips-wasm`, `squoosh`) would add 1–4 MB to the client bundle and is unnecessary when the server already handles format conversion and quality compression.

This layer runs entirely in the browser and produces a clean `Blob` (metadata-free, same pixel content) that is sent to the server.

### Layer 2 — Server-side: resize + format conversion + compression

The API route `app/api/upload/route.ts` receives the cleaned blob and uses **`sharp`** to:
1. Resize to the configured maximum dimensions (longest-edge, no upscaling)
2. Convert to WebP
3. Apply quality 80

The result is passed as a `Buffer` to Cloudinary's `upload_stream`. The existing Cloudinary `transformation` array (currently `[{ width: 1200, crop: 'limit' }]`) is removed — `sharp` handles all transformation before upload, so Cloudinary receives an already-optimized WebP. This reduces Cloudinary transformation credit usage.

No feature flag is needed. The client-side stripping is transparent to the server, and the server-side optimization is unconditional for all upload types. A flag would add complexity without benefit given both layers are always desirable.

### Configuration object

All optimization parameters are centralized in a single `UPLOAD_CONFIG` constant at the top of the route file, replacing the current scattered `MAX_BYTES`, `MAX_AVATAR_BYTES`, and inline Cloudinary transformation values.

```ts
const UPLOAD_CONFIG = {
  item:   { maxBytes: 5 * 1024 * 1024, maxDimension: 1200, quality: 80 },
  avatar: { maxBytes: 3 * 1024 * 1024, maxDimension: 400,  quality: 80 },
} as const;
```

---

## Implementation Phases

### Phase 1 — Add `sharp` dependency

- Add `sharp` to `apps/collectstory/package.json` as a production dependency (exact version, matching project conventions).
- Add `@types/sharp` as a dev dependency.
- Run `pnpm install` from the monorepo root.
- Verify `sharp` is importable in a Next.js Route Handler context (it is: Next.js bundles server code with Node.js, and `sharp` ships native binaries for Node).

### Phase 2 — Server-side optimization in the upload route

File: `app/api/upload/route.ts`

1. Replace the two scattered byte constants (`MAX_BYTES`, `MAX_AVATAR_BYTES`) with `UPLOAD_CONFIG`.
2. Import `sharp`.
3. After the existing validation block (file type + size), add an `optimizeImage` function:
   ```ts
   async function optimizeImage(buffer: Buffer, type: 'item' | 'avatar'): Promise<Buffer> {
     const { maxDimension, quality } = UPLOAD_CONFIG[type];
     return sharp(buffer)
       .resize(maxDimension, maxDimension, { fit: 'inside', withoutEnlargement: true })
       .webp({ quality })
       .toBuffer();
   }
   ```
4. Call `optimizeImage` before the Cloudinary upload and use its output buffer.
5. Remove the `transformation` array from the Cloudinary `upload_stream` options (optimization is now pre-applied).
6. If `optimizeImage` throws, catch and return a 500 error response (per Decision 2: reject on failure).

### Phase 3 — Client-side metadata stripping

Files: `app/[username]/[collectionSlug]/items/new/AddItemPageForm.tsx` and `app/[username]/[collectionSlug]/items/[itemId]/edit/EditItemForm.tsx`

1. Extract a shared `stripMetadata(file: File): Promise<File>` utility function to `lib/image/strip-metadata.ts`:
   - Create an `HTMLImageElement`, set `src` to `URL.createObjectURL(file)`
   - Draw onto a `<canvas>` at original dimensions
   - Call `canvas.toBlob()` with the original MIME type and quality 1.0 (lossless re-encode — compression happens server-side)
   - Return a new `File` from the resulting `Blob`, preserving the original filename and type
2. In each form component's `uploadFile` helper, call `stripMetadata(file)` before appending to `FormData`.
3. The canvas re-encode produces a file without EXIF/XMP/ICC metadata, reducing typical JPEG sizes by 20–200 KB before upload.

### Phase 4 — Validation consistency cleanup

The client-side validation in `AddItemPageForm.tsx` duplicates the server constants (`ALLOWED_TYPES`, `MAX_BYTES`). After introducing `UPLOAD_CONFIG` on the server, update the client-side constants to match. This is cosmetic but keeps limits in sync.

---

## Technical Dependencies

| Dependency | Role | Notes |
|---|---|---|
| `sharp` | Server-side resize, WebP conversion, quality | Native Node.js binary; works in Next.js Route Handlers and Vercel serverless. Must be added to `package.json`. |
| Canvas API | Client-side metadata stripping | Built into all modern browsers. No npm package needed. |
| `cloudinary` v2 | Storage and delivery | Already installed (`2.9.0`). No version change needed. |

### `sharp` on Vercel

Vercel's build system automatically handles `sharp` native binaries for the Linux target. The `next.config.ts` does not need changes. However, `sharp` must be in `dependencies` (not `devDependencies`) so it is included in the production bundle.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `sharp` WebP output larger than input (e.g. tiny PNG → WebP) | Low | Spec requires output ≤ input size. Add a size guard: if the optimized buffer is larger than the original, return an error (per Decision 2). In practice this is rare with quality 80. |
| Canvas `toBlob` produces a larger file than input | Very low | The canvas re-encode is at quality 1.0 (lossless for the client step); the server handles actual compression. Client-side step only strips metadata, not compresses. |
| `sharp` not available in Edge Runtime | N/A | The upload route is a standard Node.js Route Handler, not an Edge route. No risk. |
| Existing Cloudinary `transformation` removal breaks stored URL format | None | The `transformation` param on upload only affects the *stored* asset version, not delivery URLs. Removing it means Cloudinary stores the original (already-optimized) file. Delivery URLs are unaffected. |
| Client `<canvas>` unavailable (SSR context) | None | `stripMetadata` is called inside a `'use client'` form component's async handler — always runs in the browser. |

---

## Out of Scope

- Feature flag to enable/disable optimization
- Client-side WebP conversion or quality compression (server handles this)
- WASM-based image processing libraries on the client
- Cloudinary upload presets or named transformations
- Responsive image variants / srcsets
- Animated GIF support
- Changes to the upload UI, file input, or progress indicators
