# Feature Spec: Last Arrivals Items

## Overview

Collectstory currently has no way to surface recently added collection items to visitors or authenticated users. This feature introduces a "Last Arrivals" section that displays the most recently added public collection items across all users, and fixes the data integrity issue where `collection_items` relates directly to `auth.users` instead of going through `profiles`.

Two distinct concerns are addressed together because they share the same migration boundary:

1. **Data relation fix**: `collection_items.user_id` currently points to `auth.users.id`. It must instead relate to `profiles.id`, making `profiles` the single identity anchor for all user-owned data. `collections` has the same issue and must also be fixed.
2. **Last arrivals feed**: A new database view (or materialized store) that exposes the N most recently created public collection items, joinable with profile and catalog data, to power a homepage or dedicated section.

## Business Context

### Alignment with Company Outcomes

- **Innovation & Growth**: A "Last Arrivals" feed increases organic discoverability — new items appear on the homepage, giving collectors and visitors a reason to return and share content, directly supporting the 50% user-base growth target.
- **High-Quality User Experience**: Surfacing fresh community content adds dynamism to the product and rewards active collectors, improving engagement.
- **Integrity and Auditability**: Fixing the `auth.users` ↔ `profiles` ↔ `collection_items` relation chain enforces correct ownership semantics and supports audit trails — every item is traceable to a profile, not a raw auth identity.

### Alignment with Architecture Principles

- **Simplicity over Complexity**: Use a database view for the feed rather than a separate aggregation service.
- **Integrity and Auditability**: Proper FK chain (`auth.users → profiles → collection_items`) ensures ownership is always verifiable and consistent.
- **Native Discoverability**: Last arrivals exposed via a clean API endpoint supports SEO-friendly server-rendered pages.

## Current State (Schema Findings)

| Table | Current FK | Problem |
|---|---|---|
| `collection_items` | `user_id → auth.users.id` | Bypasses `profiles`; breaks profile-level ownership queries |
| `collections` | `user_id → auth.users.id` | Same issue |
| `profiles` | `id → auth.users.id` | Correct — profiles are tied to auth users |

`collection_items` does **not** currently have a direct FK to `profiles`. The fix is to change `collection_items.user_id` (and `collections.user_id`) to reference `profiles.id` instead of `auth.users.id`. Since `profiles.id = auth.users.id` (same UUID), no data migration of values is needed — only the FK constraint target changes.

## Requirements

### R1 — Relation Fix

1. `collection_items.user_id` must reference `profiles.id`, not `auth.users.id`.
2. `collections.user_id` must reference `profiles.id`, not `auth.users.id`.
3. The ownership chain must be: `auth.users → profiles → collections → collection_items`.
4. Existing data must remain intact (no UUID value changes are required since `profiles.id = auth.users.id`).
5. RLS policies on `collection_items` and `collections` that currently use `auth.uid()` must continue to work correctly after the FK change.

### R2 — Last Arrivals Feed

1. The system must expose the most recently created **public** collection items across all users.
2. Each entry in the feed must include: item name, image URL, slug, `created_at`, and the owning collector's `username` and `avatar_url` from `profiles`.
3. The feed must be ordered by `created_at` descending.
4. The feed must be limited to a configurable number of items (default: 10).
5. Only items with `visibility = 'public'` must appear in the feed.
6. The feed must be queryable without authentication (publicly readable).

## Scope

### In Scope

- Database migration to fix FK constraints on `collection_items` and `collections`.
- Database view `last_arrivals` (or equivalent) to power the feed.
- RLS policy review and update if needed after FK change.
- API / data-fetching layer in `apps/collectstory` to query the feed.
- UI component on the homepage (or a dedicated section) to render last arrivals.

### Out of Scope

- Per-user "my recent arrivals" view (authenticated feed).
- Pagination of the last arrivals feed beyond the default limit.
- Push notifications or real-time updates for new arrivals.
- Changes to `stores`, `brands`, `lines`, or other catalog tables.
- Admin tooling for moderating the feed.

## Acceptance Criteria

1. **AC1**: After migration, `collection_items.user_id` has a FK to `profiles.id` and the old FK to `auth.users.id` is removed.
2. **AC2**: After migration, `collections.user_id` has a FK to `profiles.id` and the old FK to `auth.users.id` is removed.
3. **AC3**: Existing collection items and collections remain accessible and their `user_id` values are unchanged.
4. **AC4**: A user can create a new collection item and it is correctly linked to their profile.
5. **AC5**: The last arrivals feed returns at most 10 public items ordered newest-first.
6. **AC6**: Each feed item includes item name, image URL, slug, `created_at`, collector username, and collector avatar URL.
7. **AC7**: Items with `visibility != 'public'` do not appear in the feed.
8. **AC8**: The feed is accessible without authentication.
9. **AC9**: The homepage (or dedicated section) renders the last arrivals feed visually.

## Decisions

1. **FK re-targeting strategy**: Re-target `user_id` on both `collection_items` and `collections` to reference `profiles.id` instead of `auth.users.id`. Constraint-only change — no data migration needed since `profiles.id = auth.users.id`.
2. **Feed limit**: Default limit of 10 items.
3. **Feed implementation**: Postgres view (`last_arrivals`) in Supabase, queried from a Next.js Server Component. No Edge Function needed.
4. **UI placement**: Homepage only — add a Last Arrivals section to the existing `app/page.tsx`. No new route.
