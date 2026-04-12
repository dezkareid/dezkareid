# Specification: Improve Image Item Performance

**Status**: Draft
**Date**: 2026-04-12
**Feature Name**: `improve-image-item-performance`
**Branch**: `feat/improve-image-item-performance`

---

## Overview

The image items in Collecstory are a central part of the user experience. Currently, these images are loaded using React Suspense, which can introduce unnecessary overhead and "flicker" during the initial page load or navigation. Since the primary interaction with these images is limited to a "Replace" button, the heavy use of Suspense for the initial display is not providing significant UX benefits compared to its performance cost.

The goal of this feature is to optimize how these images are delivered and rendered to ensure a faster, more stable interface that aligns with our enterprise performance standards.

### Business Context

This feature directly supports the **Dezkareid Enterprise: High-Quality User Experience** objective and the **Performance-First Design** architecture principle.

- **Alignment with Company Outcomes**: Contributes to the goal of achieving a Google Lighthouse performance score of 90+ on core product pages.
- **Alignment with Architecture Principles**: Prioritizes "Simplicity over Complexity" by removing unnecessary architectural abstractions (Suspense) for static content and focuses on "Performance-First Design" to improve system responsiveness.

---

## Requirements

- **R1: Optimized Initial Render**: The initial paint of the image items must be as fast as possible, minimizing the time users spend looking at loading states.
- **R2: Native Lazy Loading**: Use browser-native lazy loading for images that are not in the initial viewport to reduce initial bandwidth usage.
- **R3: Visual Stability**: Prevent layout shifts (CLS) by ensuring images have reserved dimensions before they are fully loaded.
- **R4: Interaction Preservation**: The "Replace" button functionality must remain fully functional and intuitive.
- **R5: Resource Efficiency**: Only load the necessary image assets for the current device size/resolution (responsive images).

---

## Scope

### In Scope
- Refactoring the image loading logic in the item components.
- Removing or optimizing the use of Suspense for image rendering where it blocks initial visibility.

### Out of Scope
- Backend image processing or transformation logic.
- Implementing responsive image patterns (e.g., `srcset`, `sizes`).
- Optimizing image formats (e.g., AVIF/WebP).
- Changes to the "Replace" image workflow/modal itself (only the trigger is in scope).
- Global application loading strategy (only specific to item images).

---

## Acceptance Criteria

- **AC1**: Core Web Vitals (LCP and FCP) for pages containing many items show a measurable improvement (at least 15%).
- **AC2**: Cumulative Layout Shift (CLS) remains below 0.1 for the items section.
- **AC3**: The "Replace" button remains accessible and triggers the expected action without delay.
- **AC4**: Images that are far down the list are not loaded until the user scrolls near them.
- **AC5**: No visible "Suspense" loading spinners are shown for images that are already cached or can be loaded instantly.

---

## Decisions

1. **Component Loading Strategy**: We will focus on modifying the component's loading logic (removing/optimizing Suspense) rather than modifying the image assets themselves.
2. **Infrastructure**: Image optimization infrastructure is not the focus; we are optimizing the React/Astro component lifecycle.
3. **Interactions**: No additional interactive elements (like drag-and-drop or hover effects) are required beyond the existing "Replace" button functionality.
