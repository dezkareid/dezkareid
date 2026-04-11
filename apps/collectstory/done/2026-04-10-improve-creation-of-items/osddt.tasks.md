# Task List: Improve Creation of Items

## Phase 1 — Add Item dialog (replaces navigation)

- [x] [S] Read `CollectionActions.tsx` and `CollectionActions.module.css` (or note inline styles) to understand current structure before modifying
- [x] [M] Convert `CollectionActions` inline styles to a CSS Module (`CollectionActions.module.css`)
- [x] [M] Add `brands`, `franchises`, and `collectionId` props to `CollectionActions` and render `AddItemModal` inside it; replace the `<a href="/items/new">` with a button that opens the modal
- [x] [M] Update `CollectionContent` in `app/[username]/[collectionSlug]/page.tsx` to fetch `brands`, `franchises`, and verify `collectionId` are available and passed to `CollectionActions` (parallelise with `Promise.all`)

**Dependencies**: CSS Module conversion (task 2) before modal integration (task 3); data fetching (task 4) before end-to-end test.

**Definition of Done**: Clicking `+ Add Item` on an owned collection opens `AddItemModal` in a dialog. Submitting a new item closes the dialog and the item appears in the grid without page navigation. The `/items/new` route still works when visited directly.

---

## Phase 2 — Centering fixes (CSS only)

- [x] [S] Inspect `CreateCollectionModal.module.css` and the rendered `<dialog>` to identify any CSS that displaces the modal from browser-default viewport centering; remove or correct it
- [x] [S] Locate the empty-collection-state element/component in `app/[username]/[collectionSlug]/page.tsx` and its CSS module; add flex centering to the container and constrain the inline form to `max-width: 480px`

**Dependencies**: None — independent of Phase 1 and Phase 3.

**Definition of Done**: The "New Collection" modal appears vertically and horizontally centred in the viewport. On an empty collection page, clicking the add-item button shows a centred inline form.

---

## Phase 3 — "I have this" image upload

- [x] [S] Read `CopyItemModal.tsx` and `src/features/copy-item/ui/IHaveThisButton.tsx` in full to understand current data flow and modal lifecycle
- [x] [M] Add client-side source-image fetch + upload logic to `useCopyItemModalData` in `CopyItemModal.tsx`: fetch `item.image_url` as a blob, POST to `/api/upload`, store result URL or failure flag in state (run in parallel with collections/brands/franchises load)
- [x] [S] Update `resolveInitialData` (or its call site) to use the uploaded image URL instead of the raw `item.image_url`
- [x] [S] Render an inline warning inside `CopyItemModalContent` when `imageUploadFailed` is `true`: "⚠ The image could not be copied. You can add one manually."

**Dependencies**: Tasks within Phase 3 are sequential (upload logic → initial data → UI warning).

**Definition of Done**: Copying a public item that has an image results in the new item referencing a Cloudinary URL under the copying user's folder (`collectstory/{userId}`). If the source image is unreachable, the copy succeeds without an image and the warning is shown. If the source item has no image, no upload is attempted and no warning appears.
