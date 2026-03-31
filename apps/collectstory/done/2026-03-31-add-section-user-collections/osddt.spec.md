# Feature Specification: User Collection Public Sections

## Overview

Collectstory currently lacks public-facing, shareable URLs for user collections. The only public entry point to a user's items is a direct link to an individual item (`/{username}/items/{slug}`), with no discoverable collection or profile page. This feature introduces a structured, SEO-optimized public routing layer so collectors can share their collections — organized by collections and navigated through a clean URL hierarchy — while also fixing several UX issues in the authenticated experience.

This directly supports the company goal of expanding the Collectstory user base through improved organic discoverability and community engagement.

---

## Business Context

### Alignment with Company Outcomes

- **Innovation & Growth**: Public collection pages make Collectstory inherently shareable and indexable. Collectors can share links to their collections or individual items on social media, driving organic user acquisition. This directly targets the 50% user base growth KR via SEO and community engagement.
- **High-Quality User Experience**: Fixing the home page CTA and post-login redirect removes friction from the core user journey, contributing to user trust and satisfaction.
- **Native Discoverability (Architecture Principle)**: The new URL structure is designed with semantic, crawler-friendly paths and appropriate metadata (title, description, Open Graph), fulfilling the "Native Discoverability" architecture principle.

---

## Requirements

### R1 — Public User Profile Page (`/{username}`)

- A public page exists at `/{username}` that displays all **public collections** belonging to that user.
- The page is accessible without authentication.
- The page displays the user's username and avatar.
- Each collection is listed with its name and a link to `/{username}/{collection-name}`.
- If the username does not exist, the page returns a 404.
- The page includes SEO metadata: title, meta description, and Open Graph tags derived from the user's profile.

### R2 — Public Collection Page (`/{username}/{collection-name}`)

- A public page exists at `/{username}/{collection-name}` that displays all **public items** within that collection.
- The page is accessible without authentication.
- Each item is displayed with its name, image (if available), and a link to `/{username}/{collection-name}/{item-name}`.
- If the collection does not exist or has no public items, the page returns a 404.
- The page includes SEO metadata: title, meta description, and Open Graph tags derived from the collection name and owner.

### R3 — Public Item Detail Page (`/{username}/{collection-name}/{item-name}`)

- A public page exists at `/{username}/{collection-name}/{item-name}` that displays the full detail of a single collection item.
- The page is accessible without authentication.
- The item detail shows all relevant fields: name, image, brand, line, category, description, date acquired.
- If the item does not exist or is not public, the page returns a 404.
- The page includes SEO metadata: title, meta description, and Open Graph tags derived from the item's fields.

### R4 — Collection Data Model

- Users can have multiple named collections (e.g., "Funko Pops", "Star Wars Figures").
- Each collection item belongs to exactly one collection (via a `collection_id` foreign key).
- Collections have a name and a slug (unique per user).
- Collections have a visibility setting (public/private).

### R5 — Data Model Fixes

- **Line → Category relationship**: Lines are associated with one or more categories. The category of a collection item is determined through its line, not set independently on the item.
- **Collection item model**: A collection item has a relation only to a `line` (not independently to brand or category). Brand and category are derived through the line's relationships.
- **Username uniqueness**: Usernames in the `profiles` table must be enforced as unique at the database level (already present but must be validated in the profile edit flow with a user-facing error).

### R6 — Image Fields for Reference Data

- **Categories**, **brands**, and **lines** each gain an `image_url` field for an optional cover/representative image.
- These images are displayed in admin CRUD pages and optionally on public-facing collection pages.

### R7 — Post-Login Redirect

- After a successful login, the user is redirected to `/{username}` (their public profile page) instead of `/collection`.
- If the user's profile does not yet have a username set, they are redirected to the profile setup page to choose a username before proceeding.

### R8 — Home Page CTA Button

- The home page CTA button currently reads "Sign In to Your Collection" and always links to `/login`, regardless of auth state.
- When the user is authenticated, this button must change to a contextual label (e.g., "Go to My Collections") and link to `/{username}`.
- When the user is not authenticated, the button remains as-is, linking to `/login`.

---

## Scope

### In Scope

- New public routes: `/{username}`, `/{username}/{collection-name}`, `/{username}/{collection-name}/{item-name}`
- SEO metadata (title, description, Open Graph) on all three new public pages
- `collections` table/entity to group items per user
- Migration: collection items gain `collection_id`; direct `category_id` and `brand_id` FKs removed from `collection_items`
- `line` → `category` relationship added
- `image_url` field on `categories`, `brands`, and `lines`
- Username uniqueness enforced in the profile edit UI with a meaningful error
- Post-login redirect changed from `/collection` to `/{username}`
- Home page CTA button is auth-aware

### Out of Scope

- Collection privacy granularity beyond public/private
- Follower/social features
- Pagination or filtering on public collection pages (initial release)
- Migration of existing items into collections (items without a collection can be placed in a default collection automatically)
- Admin management of collections
- Search indexing or sitemaps

---

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC1 | Visiting `/{username}` for an existing user shows their public collections |
| AC2 | Visiting `/{username}` for a non-existent user returns a 404 page |
| AC3 | Visiting `/{username}/{collection-name}` shows public items in that collection |
| AC4 | Visiting `/{username}/{collection-name}/{item-name}` shows the item's full detail |
| AC5 | All three public pages include `<title>`, `<meta name="description">`, and Open Graph tags |
| AC6 | Collection items in the admin/add flow only expose a line selector (brand and category derived from the line) |
| AC7 | Attempting to save a profile with a taken username shows an inline error, not a crash |
| AC8 | After login, the user lands on `/{username}` (or profile setup if no username yet) |
| AC9 | On the home page, an authenticated user sees a button linking to `/{username}`, not `/login` |
| AC10 | Categories, brands, and lines each have an `image_url` field visible in admin CRUD forms |
| AC11 | A line has a category association visible in the admin lines CRUD |

---

## Decisions

1. **Collections — manual creation vs automatic**: Users must explicitly create a collection before adding items. There is no auto-created default collection on signup.

2. **Existing items without a collection**: Existing items with no `collection_id` will be auto-assigned to a single default collection per user (e.g., "My Collection") via a data migration.

3. **Line → Category cardinality**: One-to-one. A line belongs to exactly one category.

4. **Brand derivation from line**: `brand_id` is fully removed from `collection_items`. Brand is always derived through the line's `brand_id` relationship.
