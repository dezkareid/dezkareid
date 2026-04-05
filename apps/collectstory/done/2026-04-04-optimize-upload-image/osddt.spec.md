# Spec: Optimize Upload Image

## Overview

When users upload images for their collection items, the raw files are sent directly to Cloudinary with only a width cap (`width: 1200, crop: 'limit'`). No format conversion, quality compression, or client-side resizing is applied. Large images — even ones already within the 5 MB limit — consume excessive Cloudinary bandwidth and transformation credits, and result in slower page loads for visitors browsing collections.

This feature introduces server-side image optimization at upload time: images are compressed, converted to an efficient format, and resized appropriately before or during Cloudinary upload, reducing storage cost and improving load speed for end users.

## Business Context

### Alignment with Company Outcomes

- **High-Quality User Experience** — Page load speed is a core quality signal. Unoptimized images inflate LCP and degrade the perceived performance of collection browsing pages, directly threatening the "High Quality" performance rating target for product interfaces.
- **Innovation & Growth** — Faster, lighter collection pages improve SEO (Core Web Vitals are a ranking signal), which directly supports the 50% user-base growth goal for Collectstory through improved organic discoverability.
- **Operational Excellence / Efficiency** — Reducing Cloudinary bandwidth and transformation usage lowers infrastructure cost and supports the efficiency objective. Smaller uploads also reduce time-to-resolve for upload-related user issues.

### Alignment with Architecture Principles

- **Performance-First Design** — Every architectural decision must consider resource efficiency and system responsiveness. Optimizing images at upload time is a direct application of this principle.
- **Configuration-Driven Behavior** — Optimization parameters (target dimensions, quality, output format) should not be hard-coded. They must be centralized in a single configuration object so they can be adjusted without touching business logic.
- **Simplicity over Complexity** — The solution should not introduce a separate processing pipeline or additional infrastructure. It must work within the existing upload flow.

## Requirements

1. Before an image is sent to Cloudinary, the system must reduce its file size by converting it to WebP format and applying compression.
2. Item images must be resized to a maximum of **1200 × 1200 px** (longest edge), preserving aspect ratio. Images smaller than this must not be upscaled.
3. Avatar images must be resized to a maximum of **400 × 400 px** (longest edge), preserving aspect ratio. Images smaller than this must not be upscaled.
4. The optimization step must apply to all accepted input formats: JPEG, PNG, and WebP.
5. The optimization must produce output that is visually acceptable for collection item photography (no visible compression artefacts at typical viewing sizes).
6. After optimization, the resulting file must always be smaller than or equal to the original file size.
7. The existing file-type and file-size validation rules must remain in force before optimization is attempted.
8. Users must not experience a change in the upload interaction — the upload form, feedback messages, and returned image URL must behave identically.
9. The optimization configuration (dimensions and quality settings per upload type) must be expressed as a single, centralized configuration object rather than scattered constants.

## Scope

### In Scope

- Server-side image optimization in `app/api/upload/route.ts` prior to Cloudinary upload
- Optimization for both upload types: `item` and `avatar`
- Conversion to WebP output format
- Configurable max dimensions and quality per upload type
- Centralizing existing size/dimension constants into the new configuration structure

### Out of Scope

- Client-side resizing or compression before the file reaches the server
- Changing the image CDN provider (Cloudinary remains the storage and delivery layer)
- Generating multiple responsive image variants or srcsets
- Animated image support (GIF)
- Changing the file-type allowlist (JPEG, PNG, WebP remain the accepted inputs)
- Changes to the upload UI or upload form components

## Acceptance Criteria

1. Given a user uploads a 4 MB JPEG item image, when the upload completes successfully, then the image stored in Cloudinary is in WebP format and smaller than the original file.
2. Given a user uploads a PNG item image wider than 1200 px, when the upload completes, then the stored image is no wider than 1200 px and the aspect ratio is preserved.
3. Given a user uploads a PNG avatar image wider than 400 px, when the upload completes, then the stored image is no wider than 400 px and the aspect ratio is preserved.
4. Given a user uploads an image smaller than the configured dimension limits, when the upload completes, then the image dimensions are unchanged (no upscaling).
5. Given a user uploads a file larger than the allowed size limit, when validation runs, then the upload is rejected with the existing error message before any optimization is attempted.
6. Given a user uploads a file with a disallowed type (e.g. PDF), when validation runs, then the upload is rejected before any optimization is attempted.
7. Given a developer inspects the upload route, then all dimension and quality parameters are defined in a single configuration object (not scattered inline constants).

## Decisions

1. **Target quality level**: Use WebP quality **80** for all image types (JPEG, PNG, WebP inputs).
2. **Fallback on optimization failure**: If optimization fails, **reject the upload** with an error — do not fall back to uploading the original unoptimized file.
