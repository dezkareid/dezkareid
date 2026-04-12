# Implementation Plan: Improve Image Item Performance

**Status**: Draft
**Date**: 2026-04-12
**Feature Name**: `improve-image-item-performance`

---

## Architecture Overview

The current implementation wraps the entire image section (image + owner actions) in a single dynamic server component (`OwnerImageSection`) within a `<Suspense>` boundary. This blocks the image from rendering until the server determines the user's ownership status, which requires an uncacheable request (`connection()`).

**Key Decision**: Decouple the **static image rendering** from the **dynamic ownership logic**.

1.  **Direct Image Rendering**: The image will be rendered directly in the `ItemDetail` component using a new client component `ItemImageSection`. Since `item.image_url` is already available in the initial page data, the image can start loading immediately without waiting for any dynamic server-side checks.
2.  **Isolated Owner Actions**: Owner-specific interactions (like the "Replace" button) will be moved into a separate component `OwnerImageActions`. This component will remain dynamic and wrapped in `<Suspense>`, streaming in after the static shell is delivered.

---

## Implementation Phases

### Phase 1: Research & Component Refactoring
- Identify all dependencies of the current `ItemImageSection` and `OwnerImageSection`.
- Extract the core image rendering logic (CloudinaryImage + placeholder) into a new `ItemImageSection` component that does **not** depend on `isOwner`.
- Create a new `OwnerImageActions` server component to handle ownership checks and render the `UpdateImageForm` or the "Replace" button overlay.

### Phase 2: Execution - Layout Updates
- Update `app/[username]/[collectionSlug]/[slug]/page.tsx` to render the new `ItemImageSection` immediately.
- Wrap only the `OwnerImageActions` in `<Suspense>` within the image container.
- Ensure CSS classes in `page.module.css` support the decoupled rendering without causing layout shifts.

### Phase 3: Validation & Optimization
- Verify that images render immediately on page load/navigation.
- Confirm that the "Replace" button correctly appears only for owners after a short delay (or instantly if cached).
- Measure performance improvements using local Lighthouse/DevTools (AC1 & AC2).
- Ensure "Replace" functionality remains intact (AC3).

---

## Technical Dependencies

- **Next.js 15+**: For `Suspense` and Server Components behavior.
- **Supabase**: Used for ownership checks in `OwnerImageActions`.
- **CloudinaryImage**: Existing shared UI component for optimized image delivery.

---

## Risks & Mitigations

| Risk | Mitigation |
| :--- | :--- |
| **Flicker when "Replace" button appears** | Use a stable layout for the image container so that the button is an overlay and doesn't push content. |
| **State Mismatch** | Since the image is now decoupled from the owner state, ensure that when an owner updates the image, the `ItemImageSection` correctly updates its local state. We will use a shared parent state or event listener if necessary, but ideally, the `ItemImageSection` will manage its own `currentImageUrl` as it does now. |
| **CLS from Placeholders** | Ensure the placeholder has the same aspect ratio as the intended image. |

---

## Out of Scope

- Modifying the underlying `CloudinaryImage` component logic.
- Implementing global responsive image patterns (srcset/sizes) beyond what is already there.
- Optimizing backend upload speed.
- Changing the design of the "Replace" image modal/form.
