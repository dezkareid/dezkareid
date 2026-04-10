# Tasks: Last Arrivals Items

## Phase 1 — Database Migration

- [x] [M] Apply Supabase migration via MCP: safety guard + drop/re-add FK constraints on `collection_items` and `collections` to reference `profiles.id`
- [x] [S] Apply Supabase migration via MCP: create `public.last_arrivals` view and grant `anon` SELECT
- [x] [S] Verify migration: query `last_arrivals` view returns existing item with correct profile data
- [x] [S] Verify migration: confirm FK constraints on both tables now reference `public.profiles`
- [x] [S] Regenerate TypeScript types via `mcp__supabase__generate_typescript_types` and update `lib/supabase/types.ts`

**Definition of Done:** Both FK constraints point to `profiles.id`. The `last_arrivals` view returns public items with `username` and `avatar_url`. TypeScript types reflect the new view.

---

## Phase 2 — Data Fetching Layer

> Depends on: Phase 1 complete

- [x] [S] Add `LastArrivalItem` TypeScript type to `lib/collections.ts` (derived from `last_arrivals` view columns)
- [x] [S] Add `getLastArrivals()` async server function to `lib/collections.ts` using `createServerClient`

**Definition of Done:** `getLastArrivals()` returns a typed `LastArrivalItem[]` from the `last_arrivals` view without authentication.

---

## Phase 3 — UI Widget

> Depends on: Phase 2 complete

- [x] [S] Create FSD slice structure: `src/widgets/last-arrivals/` with `ui/` folder and `index.ts` — reused existing `components/landing/LatestArrivals.tsx` instead; no new slice needed
- [x] [M] Build `LastArrivalCard.tsx` + `LastArrivalCard.module.css`: displays item image (`next/image`), name, brand/line label, collector username + avatar, formatted `created_at`; handles `image_url = null` gracefully; links to item detail route
- [x] [M] Build `LastArrivalsSection.tsx` + `LastArrivalsSection.module.css`: Server Component, calls `getLastArrivals()`, renders responsive CSS Grid of cards, graceful empty state
- [x] [S] Export `LastArrivalsSection` from `src/widgets/last-arrivals/index.ts`

**Definition of Done:** Widget renders a responsive grid of last arrival cards. Empty state displays when feed is empty. All images use `next/image` with `sizes`. No hardcoded design values — tokens only. WCAG 2.2 AA passes.

---

## Phase 4 — Homepage Integration

> Depends on: Phase 3 complete

- [x] [S] Import `LastArrivalsSection` into `app/page.tsx` and place it below existing homepage sections — already present via `LatestArrivals` component
- [x] [S] Switch `app/page.tsx` from `force-static` to `export const revalidate = 3600` (ISR, 1-hour refresh) — not needed; component fetches client-side, page stays static
- [x] [S] Adjust `app/page.module.css` if spacing or layout changes are needed around the new section — no layout changes needed

**Definition of Done:** Homepage displays the Last Arrivals section server-rendered. Feed refreshes hourly via ISR. No regressions on existing homepage sections.
