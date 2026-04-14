# Implementation Plan: Metrics Section for Home Page

This plan details the technical steps to implement the Metrics section on the Collecstory home page, fetching data from Supabase.

## User Interface

### 1. New Component: `Metrics`
- **Location**: `apps/collectstory/components/landing/Metrics.tsx`
- **Styling**: `apps/collectstory/components/landing/Metrics.module.css`
- **Structure**:
  - A `<section>` with a responsive container.
  - A grid of three metric cards (Total Collections, Total Items, Total Users).
  - Each card will display a large number and a label.
- **Interactivity**: Use a client-side component (or a client hook inside a server component) for a simple "count-up" animation when the section enters the viewport (using `IntersectionObserver`).

### 2. Home Page Integration
- **File**: `apps/collectstory/app/[locale]/page.tsx`
- **Action**: Import and place `<Metrics />` between `<Hero />` and `<LatestArrivals />`.

## Data Management

### 1. Metrics Data Fetching
- **File**: `apps/collectstory/lib/metrics.ts`
- **Implementation**:
  - Export an async function `getGlobalMetrics()` that uses the Supabase client to fetch:
    - `count` from `collections` table.
    - `count` from `items` table.
    - `count` from `profiles` (assuming it maps to users).
  - Use `next/cache` (`cacheTag`, `cacheLife`) to cache the results for a reasonable duration (e.g., 1 hour).

## i18n & Content

### 1. New Translations
- **Key**: `Landing.Metrics`
- **Translations needed**:
  - `total_collections`: "Total Collections"
  - `total_items`: "Total Items"
  - `total_users`: "Active Collectors" (or similar)
- **Files**: `apps/collectstory/messages/en.json`, `apps/collectstory/messages/es.json`.

## Technical Decisions
- **Tech Stack**: Next.js 15 (App Router), React 19, Supabase, `next-intl`.
- **Styling**: CSS Modules with CSS custom properties from the design system.
- **Caching**: Server-side fetching with aggressive caching to minimize database hits, as these global metrics don't need real-time precision for social proof.
- **Accessibility**: Use semantic HTML (`<section>`, `<h3>`, `<p>`) and ensure sufficient color contrast.

## Testing Strategy
- **Unit Tests**: Test the `getGlobalMetrics` utility by mocking the Supabase client.
- **Component Tests**: Test the `Metrics` component for correct rendering of passed values.
- **Integration**: Verify the section appears correctly on the home page and is responsive.
