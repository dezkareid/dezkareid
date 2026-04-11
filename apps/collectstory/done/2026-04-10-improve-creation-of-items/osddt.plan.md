# Implementation Plan: Improve Creation of Items

## Architecture Overview

Three independent, self-contained changes. No new dependencies, no new routes, no new shared abstractions needed.

1. **Add Item dialog** — Convert the `+ Add Item` anchor tag in `CollectionActions` from a navigation link to a button that imperatively opens the existing `AddItemModal`. `CollectionActions` already fetches auth context client-side; it will also receive and render `AddItemModal` wired to a toggle.

2. **Centering fixes** — Two CSS-only changes:
   - `CreateCollectionModal.module.css`: add `margin: auto` or `align-items: center` to the dialog's `::backdrop`/positioning so the dialog is viewport-centred. The native `<dialog>` element is centred by the browser by default when opened with `showModal()` — so if it is currently off-centre the fix is to remove any CSS overrides that displace it.
   - Empty collection state inline form: identify the component that renders the empty-state form in `app/[username]/[collectionSlug]/page.tsx` and add centred layout styles to its container.

3. **"I have this" image upload** — In `CopyItemModal`, before submitting the copy form, fetch the source `image_url` as a blob client-side, POST it to `/api/upload`, and replace `initialData.image_url` with the returned Cloudinary URL. If the fetch or upload fails, proceed with no image and surface an inline warning.

---

## Implementation Phases

### Phase 1 — Add Item dialog (replaces navigation)

**Goal**: Clicking `+ Add Item` on the collection page opens `AddItemModal` inline instead of navigating to `/items/new`.

**Files to change**:

| File | Change |
|---|---|
| `components/username/CollectionActions.tsx` | Replace the `<a href="/items/new">` with a `<button>` that opens `AddItemModal`. Render `AddItemModal` inside `CollectionActions`, receiving `brands`, `franchises`, and `collectionId` as props. |
| `app/[username]/[collectionSlug]/page.tsx` | Fetch `brands`, `franchises`, and `collectionId` server-side alongside existing data. Pass them down to `CollectionActions` (currently it receives only `username`, `collectionId`, `collectionSlug`). `CollectionActions` is rendered inside a `<Suspense>` — the added data fetches can be parallelised with `Promise.all` in `CollectionContent`. |
| `components/username/CollectionActions.tsx` — props | Add `brands: { id: string; name: string }[]`, `franchises: { id: string; name: string }[]` to the `Properties` type. |

**Notes**:
- `CollectionActions` is a client component that currently re-fetches the auth state from Supabase on the client. The `isOwner` check for rendering happens client-side. The new `brands`/`franchises`/`collectionId` props are fetched on the server and serialised down — no client fetch needed.
- `AddItemModal` already calls `router.refresh()` on success — the collection grid will update without a full navigation.
- The existing `/items/new` page stays intact as a progressive-enhancement fallback. No changes to that route.

---

### Phase 2 — Centering fixes (CSS only)

**Goal**: Both the "New Collection" modal form and the empty-collection inline item form are visually centred.

#### 2a — CreateCollectionModal centering

**File**: `components/CreateCollectionModal/CreateCollectionModal.module.css`

The native `<dialog>` opened via `showModal()` is centred by the browser's UA stylesheet by default (`position: fixed; inset-block-start: 50%; inset-inline-start: 50%; transform: translate(-50%, -50%)`). Check whether any existing styles override this. If `margin`, `top`, or positioning overrides exist on `.dialog`, remove them. If the form content inside `.body` is left-aligned, add `text-align: center` or adjust flex direction on `.form` as needed. Since the modal's width is already capped at `480px`, the fix is likely removing a `margin-top` or ensuring the dialog is not pushed toward the top.

**Approach**: Inspect `.dialog` — ensure it has no `margin-block-start` or absolute positioning override. The UA default will centre it. If `.body` content appears left-leaning, add `align-items: center` to `.form` only if fields are narrow enough that centering improves readability; otherwise keep them full-width (form fields that span the full container width are readable as-is).

#### 2b — Empty collection state inline form centering

**File**: `app/[username]/[collectionSlug]/page.tsx` and `page.module.css`

The empty-state branch currently renders a button inside `styles.grid`. The button reveals an inline form. Locate the component or element that wraps this inline form and apply:

```css
.emptyFormContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px; /* or flex: 1 if the grid is a flex container */
  width: 100%;
}
```

The inline form itself should be constrained to a readable width (e.g. `max-width: 480px; width: 100%`) so centering does not stretch it across the full viewport.

**Note**: If the inline form lives in a separate client component (e.g. an `EmptyState` component), the CSS change goes in that component's module file.

---

### Phase 3 — "I have this" image upload

**Goal**: When copying an item, the source image is fetched client-side and re-uploaded through `/api/upload` so the copied item owns its own Cloudinary asset.

**File**: `src/features/copy-item/ui/CopyItemModal.tsx`

**Change**: Add an `uploadSourceImage` utility used inside `useCopyItemModalData` (or a new `useCopyImageUpload` hook). When the modal loads and `item.image_url` is present, attempt to:

1. `fetch(item.image_url)` → get a `Blob`.
2. Build a `FormData` with the blob as a `File` (`new File([blob], 'image.jpg', { type: blob.type })`).
3. `POST /api/upload` with the `FormData`.
4. On success: store the returned `url` in state as `uploadedImageUrl`.
5. On failure: store `null` and set `imageUploadFailed: true`.

Pass `uploadedImageUrl` into `resolveInitialData` so `initialData.image_url` uses the new URL instead of the original. If `uploadedImageUrl` is `null` (failed or no source image), `initialData.image_url` is `undefined`.

If `imageUploadFailed` is `true`, render an inline notice inside `CopyItemModalContent` before the form:

```
⚠ The image could not be copied. You can add one manually.
```

**Upload timing**: Trigger the fetch+upload eagerly as soon as the modal opens (inside the existing `useEffect` in `useCopyItemModalData`, alongside the collections/brands/franchises load). This keeps the loading state unified — the form does not show until all data (including the image upload attempt) resolves.

**Error handling rules**:
- Network error fetching the source URL → `imageUploadFailed = true`, no image.
- `/api/upload` returns non-2xx → `imageUploadFailed = true`, no image.
- `item.image_url` is `null`/`undefined` → skip entirely, no warning shown.

---

## Technical Dependencies

| Dependency | Status |
|---|---|
| `AddItemModal` | Exists — `components/AddItemModal/AddItemModal.tsx` |
| `AddItemForm` | Exists — `components/AddItemForm/AddItemForm.tsx` |
| `Modal` (shared) | Exists — `src/shared/ui/modal/Modal.tsx` |
| `/api/upload` endpoint | Exists — `app/api/upload/route.ts` |
| `router.refresh()` on success | Already used in `AddItemModal.handleSuccess` |
| CSS Modules + design tokens | Already in use across all affected files |

No new npm packages needed.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `CollectionActions` receives brands/franchises as props but is rendered inside `<Suspense>` — the parent Server Component must fetch this data | Low | Parallelise with `Promise.all` in `CollectionContent`; only owner sees these anyway so the data is user-scoped |
| Source image CORS restriction prevents client-side `fetch` | Medium | Cloudinary URLs are public and do not enforce CORS for reads. If the URL is non-Cloudinary (edge case), graceful degradation already handles failure |
| Image upload in `useCopyItemModalData` runs on every modal open, adding latency | Low | Upload runs in parallel with collections/brands/franchises load; the modal stays in loading state until all resolve — no additional perceived delay |
| `CreateCollectionModal` dialog centering already handled by browser — CSS inspection may show nothing to change | Low | Inspect rendered output in dev; if UA already centres it, skip 2a or only adjust form field alignment if needed |
| `CollectionActions` currently uses inline styles (`buttonStyle`) — extending it with a modal requires mixing CSS approaches | Low | Convert the existing inline styles in `CollectionActions` to a CSS Module as part of this change (small, self-contained improvement consistent with codebase conventions) |

---

## Out of Scope

- Removing or modifying the `/items/new` route.
- Changes to the admin item creation flow.
- Changes to the item edit flow.
- Server-side image proxy or Route Handler for image fetching.
- Any state management library.
- Mobile-specific layout changes beyond what the existing modal already provides.
