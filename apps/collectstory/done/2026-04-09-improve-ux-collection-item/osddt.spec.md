# Feature Spec: Improve UX of Collection Item Page

**Feature:** `improve-ux-collection-item`
**Branch:** `feat/improve-ux-collection-item`
**Date:** 2026-04-09

---

## Overview

The collection item detail page is the primary surface where collectors showcase individual items in their collection. Currently the page feels static and incomplete: it surfaces limited metadata, buries contextual information in a cluttered "Where to Find" section, has an unintuitive image change flow, and the share button triggers the native OS share sheet rather than targeting social networks directly.

This feature improves the collection item page across four dimensions: richer item information display, a modal-based "Where to Find" experience, a more interactive and clearly afforded image management flow, and a social-network-first sharing experience.

---

## Business Context

### Alignment with Company Outcomes

- **Expand Collecstory user base by 50% through organic discoverability and community engagement** — A richer, more engaging item page increases the value of sharing collection items on social networks, driving referral traffic and new user acquisition. Fixing the share flow directly enables this path.
- **High-Quality User Experience** — The current static, information-sparse page does not meet the "High Quality" performance/usability bar. This work directly addresses that gap.
- **Increase frequency of meaningful product updates by 20%** — This improvement standardizes and elevates the item detail pattern, which benefits future feature work on the same surface.

### Alignment with Architecture Principles

- **Simplicity over Complexity** — Moving "Where to Find" to a modal reduces visual noise on the primary reading surface without removing the feature.
- **Native Discoverability** — Enriching the item page with more structured metadata supports SEO and semantic indexing.
- **Universal Accessibility** — All interactive improvements (modal, image upload, share dropdown) must meet accessibility standards.
- **Performance-First Design** — Any new UI elements must not regress page performance; modal and image interactions should be loaded progressively.

---

## Requirements

### 1. Richer Item Information

1.1 The page must display all available item metadata prominently: name, brand, product line, variant, category, franchise, description, and acquisition date.

1.2 Metadata that is currently shown only as tags must also be surfaced in a readable, labeled format so users understand what each piece of data means without needing to decode tag labels.

1.3 Empty metadata fields must be hidden — the page must not display empty sections or placeholder labels for data that does not exist.

### 2. "Where to Find" Modal

2.1 The "Where to Find" section must be removed from the main page layout.

2.2 A clearly labeled button (e.g., "Where to find") must replace the inline section on the page.

2.3 Clicking the button must open a modal overlay containing the list of linked stores and custom links.

2.4 The modal must be closeable via a close button, pressing Escape, or clicking the backdrop.

2.5 The modal must be accessible from both public (read-only) and owner (read + edit) views.

2.6 For item owners, the custom link management interface (`ItemLinksManager`) must be available inside the modal.

2.7 If no stores or links are associated with the item and the viewer is not the owner, the button must not be shown.

### 3. Image Management UX

3.1 The image change flow must feel interactive and intentional — not a flat toggle.

3.2 When the user activates image editing, a visually distinct UI state must indicate that the image is in "edit mode" (e.g., overlay, visual affordance, or dedicated panel).

3.3 The upload area must support drag-and-drop, file picker, and clipboard paste as currently implemented, but with improved visual feedback at each state (idle, dragging, uploading, saving, done, error).

3.4 A cancel action must be clearly available during edit mode to return to the read-only image view without losing the current image.

3.5 A successful image update must visually confirm the result (e.g., brief success state) before returning to the read-only view.

### 4. Social-Network Share Flow

4.1 The share button must NOT trigger the native OS share sheet.

4.2 Clicking the share button must open an in-app share UI (e.g., a small dropdown or popover) with direct sharing options.

4.3 The share UI must include at minimum: Twitter/X, Facebook, and a "Copy link" option.

4.4 LinkedIn sharing is desirable but optional (out of scope for this iteration if it adds complexity).

4.5 The "Copy link" option must copy the item URL to the clipboard and provide brief visual feedback (e.g., "Copied!" for 2 seconds).

4.6 All shared URLs must include UTM parameters as currently implemented.

4.7 The share UI must be dismissible by clicking outside or pressing Escape.

---

## Scope

### In Scope

- Collection item detail page (`/[username]/[collectionSlug]/[slug]`)
- "Where to Find" modal (stores + custom links)
- Image section: edit mode affordance, upload states, cancel/confirm flow
- Share button: replace OS share sheet with in-app social share UI
- Displaying richer item metadata on the page
- Accessibility compliance for all new interactive elements (modal, share dropdown, image edit overlay)

### Out of Scope

- Adding or editing item metadata fields (name, description, acquisition date, variant, etc.)
- Changes to the collection list page or collection detail page
- LinkedIn sharing (deferred)
- Store management (adding/removing stores from an item)
- Mobile-specific share sheet as a fallback (native share API is being intentionally replaced)
- Any backend data model changes

---

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-1 | All available item metadata fields (name, brand, line, variant, category, franchise, description, acquisition date) are visible on the page. Fields with no data are not shown. |
| AC-2 | No "Where to Find" section exists inline on the page. A "Where to find" button is displayed in its place when there is data to show. |
| AC-3 | Clicking "Where to find" opens a modal with the list of linked stores and/or custom links. |
| AC-4 | The modal can be closed with the close button, Escape key, and backdrop click. |
| AC-5 | Item owners can manage custom links from within the modal. |
| AC-6 | The "Where to find" button is hidden when there are no stores or links and the viewer is not the owner. |
| AC-7 | The image section enters a visually distinct edit mode when the owner activates image change. |
| AC-8 | A cancel button is visible in edit mode and returns the image section to its default state. |
| AC-9 | Upload status (uploading, saving, success, error) is clearly communicated to the user. |
| AC-10 | Clicking the share button does NOT open the native OS share sheet. |
| AC-11 | A share popover/dropdown appears with Twitter/X, Facebook, and Copy Link options. |
| AC-12 | Selecting a social network opens the respective sharing URL in a new tab. |
| AC-13 | "Copy link" copies the UTM-tagged URL to clipboard and shows "Copied!" feedback. |
| AC-14 | The share UI is dismissible by clicking outside or pressing Escape. |
| AC-15 | All new interactive elements (modal, share dropdown, image edit mode) pass keyboard navigation and screen reader checks. |

---

## Decisions

1. **"Where to Find" button placement**: Keep the button in the same position as the current section (below description/date) — do not move it.
2. **Share button behavior on mobile**: Replace the native OS share sheet entirely on all devices — always show the in-app social share UI.
3. **Metadata display format**: Display additional metadata as structured label/value pairs (e.g., "Brand: Funko").
