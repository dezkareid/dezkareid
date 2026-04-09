# Feature Spec: Define Effective Caching Strategy

## Overview

Collectstory serves three types of public pages — **user profile**, **collection**, and **item detail** — that are currently fetched on every request without explicit caching directives. This creates unnecessary database load and slower response times for the majority of users who browse without being logged in.

The goal is to define and implement a caching strategy that maximises performance for anonymous visitors (the largest audience), reduces redundant fetches for logged-in users, and avoids serving stale data to collection owners who manage their own content. The strategy must also be designed to accommodate multi-language support (starting with English, expanding to Spanish and potentially other languages in the future).

This directly supports the company's goals of expanding Collectstory's organic discoverability, maintaining a 99.9% availability benchmark, and achieving a "High Quality" performance rating across core user devices.

## Requirements

### Functional Requirements

1. **Anonymous visitors (not logged in)** must receive aggressively cached responses for the user profile page, collection page, and item detail page — these pages change infrequently and the content is fully public.

2. **Logged-in users (non-owners)** must receive lightly cached responses for those same pages — enough to reduce redundant database reads, but short enough that updates made by owners are visible within a reasonable window (e.g., a few minutes).

3. **Collection owners** (the authenticated user viewing their own profile, collection, or item) must always receive a fresh, uncached response — they need to see their latest edits immediately.

4. **Ownership detection** must be based on whether the authenticated session matches the username in the URL, not on a user role or admin flag.

5. When a **collection owner mutates content** (adds/edits/deletes an item, edits profile, edits collection metadata), the cached versions of the affected pages must be invalidated so that subsequent visitors receive up-to-date content.

6. The caching strategy must treat **language as a cache dimension** — cached pages for the same URL path but different languages must be stored separately. Initially only English is active; the system must be ready to add Spanish (and other languages) without a redesign of the cache model.

7. The caching strategy must apply consistently to all three page types:
   - User profile page (`/[username]`)
   - Collection page (`/[username]/[collectionSlug]`)
   - Item detail page (`/[username]/[collectionSlug]/[slug]`)

### Cache Tiers

| Visitor type | Cache behaviour |
|---|---|
| Anonymous | Aggressive — long TTL, serve from cache by default |
| Logged-in (non-owner) | Soft — short TTL, revalidate in background |
| Owner | No cache — always fetch fresh |

## Scope

### In Scope

- Caching behaviour for the three public user-content pages: profile, collection, item detail.
- Owner detection logic to determine which cache tier applies.
- Cache invalidation triggered by owner mutations on those pages.
- Language-aware cache keying to support future multi-language expansion.
- Documentation of the chosen TTL values and the rationale behind them.

### Out of Scope

- Caching for admin pages (`/admin/*`) — these are already server-rendered with on-demand revalidation.
- Caching for `/stores`, `/franchises`, `/franchises/[slug]` — these already have explicit `'use cache'` + `cacheLife('hours')` in place.
- Full application-wide i18n (language switching, translation files) — the language dimension is limited to cache keying only.
- CDN-level (edge) caching configuration — the strategy is at the application layer; CDN headers may be a follow-up.
- Personalised or user-specific content beyond ownership checks.

## Acceptance Criteria

1. An anonymous visitor loading a user profile, collection, or item page receives a cached response on repeat visits within the aggressive TTL window.
2. A logged-in non-owner visiting the same pages receives a response served from a shorter-lived cache — the page does not hit the database on every individual request within that window.
3. A collection owner visiting their own pages always receives a fresh response; they never see a stale version of content they just edited.
4. After a collection owner edits content (e.g., updates an item description or adds a new item), the cached versions for anonymous and logged-in visitors are invalidated, and subsequent visitors see the updated content.
5. If a future language (e.g., `es`) is added, cached pages for `/[username]` in English and Spanish are stored independently and do not collide.
6. There is no regression in caching behaviour for `/stores` and `/franchises/*` pages.
7. The ownership check does not require an extra network round-trip for anonymous visitors — it must resolve from the existing session context with no added latency for the common (unauthenticated) case.


## Business Context

This feature directly supports the following company outcomes and architecture principles:

**Company Outcomes:**
- *Organic discoverability*: Faster page loads improve Core Web Vitals scores, which directly affect SEO rankings and support the 50% user base growth target.
- *Operational Excellence*: Reducing per-request database load helps maintain the 99.9% availability benchmark under traffic spikes.
- *High-Quality UX*: Achieving a "High Quality" performance rating requires fast, consistently responsive pages — aggressive caching for anonymous users is the primary lever here.

**Architecture Principles:**
- *Configuration-Driven Behavior*: TTL values and cache tier rules should be expressed as named configuration constants (e.g., `cacheLife('aggressive')`, `cacheLife('soft')`) rather than hard-coded numbers, so they can be tuned without code changes.
- *Performance-First Design*: Caching is the primary architectural tool for meeting the performance standard; it must be designed upfront, not retrofitted.
- *Native Discoverability*: Aggressively cached public pages with correct HTTP semantics allow crawlers and CDNs to index and serve content efficiently.
- *Simplicity over Complexity*: The three-tier model (anonymous / logged-in / owner) must remain easy to reason about; avoid per-component or per-query cache overrides that create hidden complexity.

## Decisions

1. **Aggressive TTL duration**: 24 hours for all three page types (profile, collection, item detail). Same TTL across all — the owner's on-demand revalidation on mutation is the primary freshness mechanism, not TTL expiry.
2. **Soft TTL duration**: 5 minutes for logged-in non-owners. Superseded by the decision to adopt PPR (see decision 5) — the soft tier applies only to the dynamic ownership slot, not the full page.
3. **Language signal**: URL prefix (`/es/[username]`, `/en/[username]`). Spanish is the first additional language. No prefix implies the default language (English). Cache keys are prefix-aware; CDN/edge caching works naturally with URL-based keys.
4. **Owner mutation invalidation scope**: Direct only — invalidate only the page that was directly mutated. Editing an item invalidates that item's page; it does not cascade to the collection or profile page.
5. **PPR adoption**: Yes — adopt Partial Pre-Rendering for the three user-content pages. The static shell (main content) is cached aggressively for all visitors. The dynamic `<Suspense>` slot covers only the ownership UI (edit/delete actions). This replaces the soft-cache tier for logged-in non-owners and improves performance for all user types.
