# Feature Specification: Optimization and Visual Improvements

## Overview
This feature aims to enhance the landing page's visual professionalism and social discoverability, while also streamlining the core "copy item" interaction. By optimizing OpenGraph metadata, updating hero visuals with official branding, and refining the user flow for adding items from others' collections, we improve both the first impression and the active engagement of the platform.

## Business Context
This feature directly supports the strategic objective of **Innovation & Growth** and **High-Quality User Experience** for Collecstory:
- **Innovation & Growth**: Improved OpenGraph optimization enhances native discoverability (SEO), helping expand the user base through better social sharing previews.
- **High-Quality User Experience**: Replacing placeholder visuals with official images increases professional visibility and trust. Optimizing the "copy item" flow reduces friction, leading to higher engagement and faster collection growth.
- **Architecture Alignment**: Adheres to **Native Discoverability** by following structured metadata patterns and **Performance-First Design** by reducing interaction latency in the copy flow.

## Requirements

### 1. OpenGraph Optimization
- **Metadata Enhancement**: Add comprehensive OpenGraph (`og:image`, `og:type`, etc.) and Twitter Card (`twitter:card`, `twitter:image`) metadata to the root layout and homepage.
- **Visual Preview**: Use the official branded image: `https://res.cloudinary.com/ddyovtxd2/image/upload/v1776197303/BBB66E34-9FCD-4BC5-A6B0-F0E2375DFE33_1_105_c_f7nhpy.jpg`.
- **Locale Support**: Metadata must remain compatible with the existing `next-intl` internationalization system.

### 2. Official Hero Images
- **Visual Update**: Replace placeholder images in the Hero section with these official assets:
  1. `https://res.cloudinary.com/ddyovtxd2/image/upload/v1776196233/A80D42C4-8CE4-4FD8-AFD3-5827B132E503_1_105_c_cvbdmk.jpg`
  2. `https://res.cloudinary.com/ddyovtxd2/image/upload/v1776196287/074787A5-57AF-425A-AC0C-5C6BB4430A4C_1_105_c_phehos.jpg`
  3. `https://res.cloudinary.com/ddyovtxd2/image/upload/v1776196360/A142697F-1EBA-4019-95F9-F5EB3742C448_1_105_c_brvrr3.jpg`
- **Performance**: Ensure new images are optimized via `next/image` with correct `priority` and `sizes` attributes for optimal Core Web Vitals (LCP).

### 3. Copy Item Flow Optimization
- **Reduced Friction**: Streamline the "I have this item" (CopyItemModal) process to minimize the number of steps required to add an item.
- **Smart Defaults**: Automatically select the user's only collection if they have one, or the most recent one.
- **Cost Efficiency**: Defer the image cloning/upload process until the user actually clicks "Save" or "Copy". Currently, images are uploaded when the modal opens, generating unnecessary costs if the user cancels.
- **Lean Form**: Ensure the confirmation form only requires essential fields, defaulting others from the source item.

## Scope
- **In Scope**:
  - `app/[locale]/layout.tsx` and `app/[locale]/page.tsx` metadata.
  - `components/landing/Hero.tsx` and `lib/mock-data.ts` image updates.
  - Refactoring `src/features/copy-item/ui/CopyItemModal.tsx` and the `copyItemToCollection` server action to defer image uploading.
- **Out of Scope**:
  - Changing the overall FSD architecture.
  - Implementing bulk copy functionality.

## Acceptance Criteria
- [ ] Homepage shares on social platforms show the branded Cloudinary image.
- [ ] Homepage Hero section displays new official images with proper optimization.
- [ ] Users can copy items without an immediate Cloudinary upload occurring upon opening the modal.
- [ ] The "cloning image" logic happens within the server action or a final confirmation step.
- [ ] All updated components pass WCAG 2.2 accessibility standards.
