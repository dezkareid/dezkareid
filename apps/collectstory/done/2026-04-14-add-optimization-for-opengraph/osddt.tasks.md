# Task List: Optimization and Visual Improvements

## Phase 1: Metadata & Assets Update
- [x] [S] Update `apps/collectstory/next.config.ts` to include `res.cloudinary.com` in `remotePatterns`.
- [x] [S] Update `apps/collectstory/lib/mock-data.ts` with official hero image URLs.
- [x] [S] Add default Twitter metadata to `apps/collectstory/app/[locale]/layout.tsx`.
- [x] [S] Update `apps/collectstory/app/[locale]/page.tsx` with OpenGraph image metadata using the official branded image.

## Phase 2: Copy Item Optimization
- [x] [M] Refactor `apps/collectstory/src/features/copy-item/ui/CopyItemModal.tsx`:
    - Remove `uploadImageFromUrl` function and image cloning logic.
    - Simplify `useCopyItemModalData` to remove upload states.
    - Update `resolveInitialData` to pass the original `image_url` directly to the form.
    - Remove image-related warning UI and upload loading state.
- [x] [S] Verify that the "I Have This" flow no longer triggers an image upload.

## Phase 3: Performance & Verification
- [x] [S] Review `apps/collectstory/components/landing/Hero.tsx` for optimal `priority` and `sizes` attributes.
- [x] [S] Update `apps/collectstory/components/landing/Hero.tsx` to use the design system's `Image` component with `strategy="cloudinary"`.
- [x] [M] Run `pnpm turbo run build --filter=@dezkareid/collectstory` to verify no regressions in build or image optimization.
- [x] [S] Verify metadata headers in development mode.

## Dependencies
- Phase 1 must be completed before visual verification.
- Phase 2 can be developed in parallel but depends on the Cloudinary config for image display if applicable.

## Definition of Done
### Phase 1
- Official hero images are visible on the homepage.
- Sharing the homepage on social media shows the correct branded OG image.

### Phase 2
- Clicking "I Have This" on an item opens the modal instantly without an image upload progress indicator.
- Saving the copied item correctly references the original image URL in the database.

### Phase 3
- Lighthouse/Performance audit confirms no major LCP regressions from the new assets.
- Production build succeeds without errors.
