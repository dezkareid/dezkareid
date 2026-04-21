# Feature Spec: Store Detail Page (`/stores/[store-slug]`)

## Overview

Collectstory's `/stores` directory already lists retail stores by name and location. However, users landing on that directory have no way to drill into a specific store to see what items they can buy there, where it's located, or what other collectors think of it.

This feature adds a public store detail page at `/stores/[store-slug]` that gives collectors a rich view of a single store: its catalog of available items, location details, and community reviews. This is a high-value page because it closes the loop between "I want this item" and "where can I buy it" — directly proving platform value to collectors and opening a monetisation path (e.g. verified store badges, promoted placements, affiliate links).

---

## Business Context

**Relevant company outcomes:**

- **Expand Collectstory's user base by 50% through improved organic discoverability (SEO):** Each store page is an independently indexable, keyword-rich URL that surfaces for searches like "where to buy [item] in [city]". This compounds organic reach without paid acquisition.
- **Prove and monetise platform value:** The store page is a tangible demonstration that Collectstory connects collectors to sellers. It creates the surface for premium store listings, verified badges, and future affiliate or lead-generation revenue streams.

**Alignment with architecture principles:**

- **Native Discoverability:** Store pages must be statically rendered with structured data (JSON-LD) so search engines can index store name, location, catalog, and reviews.
- **Performance-First Design:** Pages must be ISR-rendered (not fully dynamic) to achieve fast time-to-first-byte and high Lighthouse scores.
- **Universal Accessibility:** All interactive elements (tabs, maps, review forms) must meet WCAG 2.2 AA.
- **Simplicity over Complexity:** No new backend service — use existing Supabase tables (`stores`, `catalog_item_stores`, `catalog_items`). Reviews are a new table but follow the same patterns already established in the codebase.

---

## Requirements

### R1 — Store Identity
- The page must display the store's name, city, country, and website URL (when available).
- The page must display whether the store is verified by Collectstory.

### R2 — Catalog Section
- The page must list all catalog items associated with the store (via `catalog_item_stores`).
- Each catalog item must show its name, image, and franchise (when available).
- Each catalog item must link to its detail page (`/catalog/[slug]`).
- If the store has no associated catalog items, the section must display an empty state message.

### R3 — Location Section
- The page must display the store's city and country as readable text.
- If the store has latitude and longitude coordinates AND the user enables map display, the page must render a Google Maps embed showing the store's pin.
- Map display is opt-in: the user must actively choose to show the map (e.g. via a "Show map" toggle/button).

### R4 — Reviews Section
- The page must embed Google Maps reviews for the store using the Google Maps API (API key required).
- Reviews are sourced entirely from Google Maps — no platform-native review system.
- The reviews section is only shown when the store has a `google_place_id` configured.

### R5 — Page Not Found
- If no store with the given slug exists (or the store's `visible` flag is `false`), the page must return a 404 response.

### R6 — Internationalisation
- The page must be available in both supported locales (`es`, `en`) under `app/[locale]/stores/[store-slug]/`.
- All static UI strings must use the `next-intl` message system.

### R7 — SEO & Structured Data
- The page must have a descriptive `<title>` and `<meta name="description">` derived from the store name and location.
- The page must include a `LocalBusiness` JSON-LD block with at minimum: name, address (city/country), and URL.

---

## Scope

### In scope
- New public page `/stores/[store-slug]` (ISR, no auth required to view).
- Store identity block (name, city, country, URL, verified badge).
- Catalog items grid linked to existing catalog item pages.
- Location section with city/country text and opt-in Google Maps embed (shown only when user toggles it and coordinates exist).
- Reviews section: Google Maps reviews embed.
- New `slug` column on `stores` table (migration + backfill from name).
- SEO metadata and JSON-LD structured data.
- i18n string coverage for both locales.

### Out of scope
- Platform-native review system (no `store_reviews` table, no auth-gated form).
- Store images / photo galleries.
- Promoted or sponsored store placements.
- Affiliate link tracking.

---

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC1 | Navigating to `/stores/acme-toys` renders the page with the store's name, city, country, and a "Verified" badge when `stores.verified = true`. |
| AC2 | The catalog section displays all catalog items linked to the store, each with a working link to `/catalog/[slug]`. |
| AC3 | When a store has no catalog items, the catalog section shows a "No items listed yet" (or equivalent) empty state. |
| AC4 | When `lat` and `lng` are present, a "Show map" toggle is visible; activating it renders a Google Maps embed with the store's pin. |
| AC5 | The reviews section renders the Google Maps reviews embed for the store. |
| AC6 | Navigating to a slug that doesn't exist (or `visible = false`) returns a 404 page. |
| AC7 | The page `<title>` includes the store name and location. The page includes a valid `LocalBusiness` JSON-LD block. |
| AC8 | All static UI strings render correctly in both `es` and `en` locales. |
| AC9 | Lighthouse Performance score ≥ 90 on mobile for a store with 10 catalog items. |

---

## Decisions

1. **Map provider**: Google Maps (Maps Embed API + Places API, using `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`). Map display is opt-in — a "Show map" toggle must be activated by the user before the embed loads.
2. **Reviews**: Google Maps reviews embed via Places API + `google_place_id` — no platform-native review system, no `store_reviews` table.
3. **Store slug source**: Add a `slug` column to the `stores` table with a migration and backfill from the store name.
4. **Empty catalog CTA**: Plain "No items listed yet" message — no call-to-action.
