# Implementation Plan: Optimization and Visual Improvements

This plan outlines the technical steps to enhance the landing page's professional look, optimize OpenGraph metadata, and streamline the "copy item" flow with cost-efficiency in mind.

## Architecture Overview
- **Metadata**: Leverage Next.js 16's `generateMetadata` in root layout and page files for dynamic, localized OpenGraph and Twitter metadata.
- **Hero Images**: Replace existing placeholder URLs in `lib/mock-data.ts` with official Cloudinary assets. Add `res.cloudinary.com` to `next.config.ts` `remotePatterns`.
- **Copy Flow**: Refactor `CopyItemModal` to use the source image URL directly without cloning it to the user's storage. This eliminates the cost of duplicate image generation and simplifies the modal's loading state.

## Implementation Phases

### Phase 1: Metadata & Assets Update
1. **Cloudinary Configuration**: Add `res.cloudinary.com` to `remotePatterns` in `apps/collectstory/next.config.ts`.
2. **Hero Data Update**: Replace placeholder URLs in `apps/collectstory/lib/mock-data.ts` with the 3 provided official hero image URLs.
3. **OpenGraph Integration**:
   - Update `app/[locale]/layout.tsx` to include default metadata for `twitter`.
   - Update `app/[locale]/page.tsx`'s `generateMetadata` to include `openGraph.images` using the official branded OG image.

### Phase 2: Copy Item Optimization
1. **Refactor Modal Logic**:
   - Open `src/features/copy-item/ui/CopyItemModal.tsx`.
   - Remove `uploadImageFromUrl` function and the corresponding `useEffect` call.
   - Update `resolveInitialData` to use `item.image_url` directly.
   - Remove `LoadingState` related to image uploading.
2. **UI Cleanup**:
   - Remove image-related warning/error logic since we no longer attempt to clone the image.
   - Ensure the `AddItemForm` correctly receives the `source_image_url` as the initial value for the item's image.

### Phase 3: Performance & Accessibility
1. **Hero Optimization**: In `components/landing/Hero.tsx`, ensure the `Image` component uses appropriate `priority` for LCP and `sizes` for responsive delivery.
2. **Verification**:
   - Run a production build to check for image optimization warnings.
   - Verify social preview metadata using a local metadata inspector or `next dev` inspection.
   - Test the "Copy Item" flow to ensure no network requests are made to `/api/upload` during the process.

## Technical Dependencies
- `next/image`: Core for image optimization.
- `next-intl`: For localized metadata support.
- Cloudinary: Source of official assets.

## Risks & Mitigations
- **Broken External URLs**: By using the image URL instead of cloning, the user's item depends on the source image staying live. 
  - *Mitigation*: This is the requested strategy for cost efficiency. If persistent ownership is required later, we can implement "clone-on-save" instead of "clone-on-open".
- **LCP Regression**: Adding higher resolution official images could impact LCP.
  - *Mitigation*: Use `priority` and properly tuned `sizes` attribute.

## Out of Scope
- Implementing "clone-on-save" (user explicitly wants to use the image URL instead of copy).
- Modifying `api/upload` endpoint.
- Bulk image processing.
