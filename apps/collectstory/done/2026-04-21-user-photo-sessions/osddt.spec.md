# Feature Specification: User Photo Sessions

## Overview

Collectors on Collecstory take photos of their figures or sets to capture them from multiple angles, in different lighting conditions, or in themed poses. This feature introduces **Photo Sessions**: a top-level entity under a user profile where the collector groups multiple photos under a named session (e.g. "Outdoor shoot", "Battle diorama", "2025 Summer Collection"). Sessions are not tied to a single item — they are a creative space owned by the user.

Sessions live at `/{username}/sessions/` and each session has its own detail page at `/{username}/sessions/{session-slug}/`. On the session detail page, photos are displayed in a grid and can be opened in a full-screen carousel explorer — visually and behaviourally identical to the "Explore collection" experience on collection pages. Sessions support likes so the community can engage with the best photo setups.

---

## Business Context

- **Innovation & Growth**: Photo sessions give collectors a creative canvas beyond item tracking, increasing content depth and reasons to return — supporting the 50% user-base growth goal through richer community engagement.
- **High-Quality User Experience**: The drag-and-drop reorder interface and familiar "Explore"-style photo viewer deliver a polished, friction-free experience aligned with the "High Quality performance rating" key result. Auto-saving on drop eliminates friction.
- **Native Discoverability**: Sessions have dedicated URLs with slugs derived from their names, making them indexable and shareable, supporting organic SEO growth.
- **Architecture Principles — Simplicity & Modularity**: Sessions are a standalone entity under a user profile, parallel to collections, with no structural changes to existing items or collections.

---

## Requirements

### Session Management (Owner)

1. An authenticated user can create a new photo session from their sessions list page (`/{username}/sessions/`).
2. Each session has a **name** (required) and an optional **description**. A URL slug is automatically derived from the name.
3. A user can have a maximum of **5 photo sessions**.
4. The owner can **rename** or **delete** a session from the session detail page or the sessions list.
5. Deleting a session permanently removes it and all its photos.

### Photo Management (Owner)

6. Within a session the owner can upload multiple photos. The existing upload pipeline is reused (Cloudinary + Sharp optimization, 5 MB per-file limit).
7. A session can hold a maximum of **20 photos**.
8. The owner can **drag and drop** photos within a session to reorder them. The new order is **auto-saved on drop** — no explicit save action is required.
9. The owner can delete individual photos from a session.
10. Photo management is accessible on the session detail page when the viewer is the session owner.

### Session Discovery — List Page

11. `/{username}/sessions/` lists all of the user's sessions as cards showing the session name, photo count, and like count.
12. The list page is publicly visible (sessions are public by default). An empty state is shown if the user has no sessions.

### Session Detail Page

13. `/{username}/sessions/{session-slug}/` displays the session name, description, all photos in a grid in their saved order, and the like count.
14. An **"Explore session"** button (consistent in appearance and placement with the existing "Explore collection" button on collection pages) is shown when the session has at least one photo.
15. Clicking "Explore session" opens the **Photo Session Explorer** modal — a full-screen carousel experience visually and behaviourally consistent with the existing "Explore collection" modal: keyboard navigation (arrow keys), swipe gestures on touch, and Escape to close.
16. Each slide in the carousel displays the photo and a position counter ("2 of 7").
17. The owner sees photo management controls (upload, drag-to-reorder, delete) on the detail page; visitors do not.

### Likes

18. Each session has a **like count** displayed on both the list card and the detail page.
19. The like count display is numeric only, consistent with how item likes are displayed on collection pages.
20. Authenticated visitors can like or unlike a session. A user can like any session (including their own).
21. The like action is instant and optimistic in the UI.
22. Unauthenticated visitors see the like count but cannot interact; clicking the like button prompts login.

### General

23. Session slugs are derived from the session name (kebab-case, unique per user).
24. Sessions are always public — there is no per-session visibility toggle; they are not tied to item visibility.

---

## Scope

### In Scope

- Sessions list page: `/{username}/sessions/`
- Session detail page: `/{username}/sessions/{session-slug}/`
- Session CRUD for owners (create, rename, delete).
- Photo upload, drag-and-drop reorder (auto-save on drop), and delete within a session.
- Photo Session Explorer modal on the detail page ("Explore session" button).
- Per-session like/unlike for authenticated users (numeric count only).
- Like count display for unauthenticated visitors.
- Maximum 5 sessions per user, 20 photos per session, 5 MB per photo.

### Out of Scope

- Sessions attached to or filterable by a specific collection item.
- Comments on sessions or individual photos.
- Per-session visibility toggle (public/private).
- Video uploads.
- Photo editing or filters after upload.
- Session analytics / view counts.
- Notifications when a session is liked.
- Any changes to the existing single item cover image or the "Explore collection" feature on collection pages.
- Linking into Photo Session Explorer from within the "Explore collection" carousel.

---

## Acceptance Criteria

1. **Session creation**: An authenticated user navigates to `/{username}/sessions/`, creates a new session with a name, and it appears in the list with a slug derived from the name and a photo count of 0.
2. **Session limit**: Attempting to create a 6th session shows an error and prevents creation.
3. **Photo upload**: An owner on a session detail page uploads a photo; it appears in the grid immediately without a page reload.
4. **Photo limit**: Attempting to upload a photo when 20 already exist shows an error and rejects the upload.
5. **Reorder auto-save**: An owner drags a photo to a new position; after releasing, the new order is persisted — visible to another browser session after reload without any additional save action.
6. **Delete photo**: An owner deletes a photo from a session; it is removed from the grid immediately.
7. **"Explore session" button visible**: A session detail page with at least one photo shows the "Explore session" button.
8. **"Explore session" button hidden**: A session detail page with no photos does not show the "Explore session" button.
9. **Explorer opens**: Clicking "Explore session" opens the full-screen carousel on the first photo.
10. **Explorer navigation**: Arrow keys (next/prev) and swipe gestures advance through photos; Escape closes the modal.
11. **Explorer counter**: The carousel shows the current position and total ("2 of 7").
12. **Like — authenticated**: A logged-in user clicks the like button on a session; the count increments immediately and persists after page refresh.
13. **Unlike — authenticated**: The same user clicks the like button again; the count decrements and persists.
14. **Like — unauthenticated**: An unauthenticated visitor clicks the like button and is prompted to log in.
15. **Session list public**: A visitor (not the owner) can access `/{username}/sessions/` and see the sessions list.
16. **Owner controls hidden for visitors**: A visitor on a session detail page sees no upload, reorder, or delete controls.
17. **Session rename**: An owner renames a session; the new name is reflected on the list and detail pages (slug remains unchanged to avoid broken links).
18. **Session delete**: An owner deletes a session; it is removed from the list and `/{username}/sessions/{slug}/` returns 404.

---

## Session Context

From the clarification conversation:

- Sessions are **not attached to individual items** — they are a top-level user entity, parallel to collections.
- The route structure is `/{username}/sessions/` (list) and `/{username}/sessions/{slug}/` (detail).
- The "Explore session" experience on the detail page mirrors the "Explore collection" widget on collection pages — same modal, same UX patterns.
- Likes are numeric only, consistent with existing item like counts.
- Photo reorder is auto-saved on drop (no explicit save button).
- The per-file size limit (5 MB) applies as it does for item photos.
- Maximum 5 sessions per user, 20 photos per session.
