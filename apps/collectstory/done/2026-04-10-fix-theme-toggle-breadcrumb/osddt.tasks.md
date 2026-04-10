# Tasks: Fix Theme Toggle, Breadcrumb, Images & Last Arrivals

Feature: `fix-theme-toggle-breadcrumb`
Working dir: `apps/collectstory/working-on/fix-theme-toggle-breadcrumb/`

---

## Phase 0 — Turbo & Build Tooling

**Goal**: `typecheck` and `lint:fix` tasks run correctly for all packages including `design-system/components`.

- [x] [S] **0.1** Add `"outputs": []` to the `lint:fix` task in `turbo.json` (monorepo root)
- [x] [S] **0.2** Add `"lint:fix": "turbo run lint:fix --affected"` to `scripts` in root `package.json`
- [x] [S] **0.3** Add `"typecheck": "tsc --noEmit"` to `scripts` in `design-system/components/package.json`

**Definition of Done**: `pnpm lint:fix` runs from the repo root without error; `pnpm turbo run typecheck --filter=@dezkareid/components` executes (does not skip).

---

## Phase 1 — ThemeToggle: Remove Visible Border

**Goal**: ThemeToggle has no visible border in light or dark mode. Reuses `Button variant="ghost"` instead of custom border styling.

> Depends on: Phase 0 complete (so typecheck catches regressions)

- [x] [S] **1.1** Read `design-system/components/src/css/button.module.css` — confirm `.button--ghost` uses `border: 1px solid transparent` (invisible, no layout shift) and hover/focus-visible states are intact
- [x] [M] **1.2** Refactor `design-system/components/src/react/ThemeToggle/index.tsx` — replace the raw `<button>` with `<Button variant="ghost">`; pass `aria-label`, `aria-pressed`, `onClick`, and dark-mode class via `className`; also fix pre-existing `onChange` type conflict by using `Omit<HTMLAttributes<HTMLSpanElement>, 'onChange'>`
- [x] [S] **1.3** Update `design-system/components/src/css/theme-toggle.module.css` — remove `border` declarations from `.theme-toggle` base skin and `.theme-toggle--dark` modifier; retain structural overrides (padding, font-size) that differ from Button defaults
- [x] [S] **1.4** Run `pnpm turbo run build --filter=@dezkareid/components` — build succeeded

**Definition of Done**: ThemeToggle renders with no visible border in both light and dark mode; hover and focus-visible states still work; no duplicate border CSS remains. ✅

---

## Phase 2 — Cloudinary Image Optimization

**Goal**: All collection item images served directly from Cloudinary CDN via a native `<img srcset>` — correct size at every viewport, no Next.js proxy, no JS required.

> Previous fixed-width approach (tasks 2.1–2.4) replaced. New design uses `srcset` + `sizes` pointing directly at Cloudinary URLs.

- [x] [S] ~~**2.1** Create `lib/image/cloudinary.ts` with `getCloudinaryUrl(url, { width, height?, fit? })`~~ — superseded
- [x] [S] ~~**2.2–2.4** Apply fixed-width Cloudinary URL to three sites~~ — superseded
- [x] [S] **2.1r** Rewrite `apps/collectstory/lib/image/cloudinary.ts` — replace fixed-width function with `getCloudinaryUrl(url, width)`, `getCloudinarySrcset(url)`, and `CLOUDINARY_SRCSET_WIDTHS` constant
- [x] [M] **2.2r** Create `apps/collectstory/src/shared/ui/CloudinaryImage/CloudinaryImage.tsx` — zero-JS `<img srcset sizes>` component; accepts `src`, `alt`, `sizes`, `aspectRatio`, `priority`, `className`; non-Cloudinary URLs fall back to plain `<img>`; export from `index.ts`
- [x] [M] **2.3r** Replace `next/image` with `<CloudinaryImage>` in `CollectionItemCard`, `LatestArrivals`, and collection grid page — remove `fill`, `position: relative` image wrapper dependency, and `getCloudinaryUrl` imports
- [x] [M] **2.4r** Replace `next/image` with `<CloudinaryImage priority>` in `ItemImageSection.tsx` — `sizes="(max-width: 768px) 100vw, 480px"`, keep `.item-page__image-media` CSS class for `object-fit: contain` override
- [x] [S] **2.5r** Remove `res.cloudinary.com` from `next.config.ts` `remotePatterns` (no longer needed once `next/image` is no longer used for Cloudinary URLs)

**Definition of Done**: All image render sites produce a native `<img srcset>` with Cloudinary CDN URLs; no `/_next/image` proxy requests for Cloudinary images; non-Cloudinary URLs (Google avatar) render as plain `<img>` without srcset; no JS required.

---

## Phase 3 — Breadcrumb: Human-Readable Labels & BreadcrumbList Schema

**Goal**: Breadcrumbs show entity names, not slugs. Both pages emit `BreadcrumbList` JSON-LD.

- [x] [S] **3.1** Locate `DataSchema` component — confirmed at `@/src/shared/ui/DataSchema`; uses `next/script` with `type="application/ld+json"`; updated to accept optional `id` prop (defaults to `"data-schema"`) to support multiple instances per page
- [x] [M] **3.2** Update `BreadcrumbNav` in `apps/collectstory/app/[username]/[collectionSlug]/page.tsx` — fetches `collection.name` via `getPublicCollectionBySlug`; falls back to slug
- [x] [M] **3.3** Update `BreadcrumbNav` in `apps/collectstory/app/[username]/[collectionSlug]/[slug]/page.tsx` — fetches `collection.name` then `item.name` sequentially (collection ID needed for item query); falls back to slugs
- [x] [S] **3.4** Create `apps/collectstory/src/shared/lib/schema/breadcrumb.ts` — `getBreadcrumbSchema(items: BreadcrumbItem[])` returning `WithContext<BreadcrumbList>`
- [x] [M] **3.5** Inject `<DataSchema id="breadcrumb-schema">` with `BreadcrumbList` in collection `BreadcrumbNav` — two items: profile + collection
- [x] [M] **3.6** Inject `<DataSchema id="breadcrumb-schema">` with `BreadcrumbList` in item detail `BreadcrumbNav` — three items: profile + collection + item

**Definition of Done**: Collection and item detail pages show human-readable names in the breadcrumb trail; both pages include a valid `BreadcrumbList` JSON-LD block. ✅

---

## Phase 4 — Last Arrivals: Fix Item Link

**Goal**: Each Last Arrivals card links to the individual item page, not the collection.

- [x] [S] **4.1** Update `apps/collectstory/components/landing/LatestArrivals.tsx` — `href` changed to `/${item.username}/${item.collection_slug}/${item.slug}`

**Definition of Done**: Clicking a Last Arrivals card navigates to `/{username}/{collectionSlug}/{itemSlug}`. ✅

---

## Phase 5 — View Transition: Card → Item Page

**Goal**: Smooth shared-element transition between a collection item card image and the item detail page hero image. Degrades gracefully on unsupported browsers.

- [x] [S] **5.1** Verified `<ViewTransition>` availability — React 19.2.4 in node_modules does NOT export it, but Next.js 16 aliases `react` to its internal canary (`19.3.0-canary`) at build time, which does. Import from `react` is safe in App Router code.
- [x] [S] **5.2** Added `experimental: { viewTransition: true }` to `apps/collectstory/next.config.ts`
- [x] [M] **5.3** Added `slug` prop to `CollectionItemCard` (`src/entities/item/ui/CollectionItemCard.tsx`); wrapped image with `<ViewTransition name={`item-image-${slug}`}>`. No active call sites required updating (component not yet rendered in pages).
- [x] [M] **5.4** Threaded `slug` prop through `OwnerImageSection` → `ItemImageSection`; wrapped hero `<Image>` with `<ViewTransition name={`item-image-${slug}`}>` in `ItemImageSection.tsx`
- [x] [S] **5.5** Wrapped card image in `LatestArrivals.tsx` with `<ViewTransition name={`item-image-${item.slug}`}>`

**Definition of Done**: Navigating from a Last Arrivals card to the item detail page shows a smooth image transition in supported browsers; navigation works normally in unsupported browsers. ✅

---

## Phase 6 — Changeset

- [x] [S] **6.1** Created `.changeset/fix-theme-toggle-breadcrumb.md` — `@dezkareid/collectstory` patch; `@dezkareid/components` is in changeset ignore list so no separate entry needed

**Definition of Done**: A `.changeset/*.md` file exists and is staged for commit.

---

## Dependencies Summary

```
Phase 0 → Phase 1 (typecheck catches ThemeToggle regressions)
Phase 2 → Phase 5 (ViewTransition wraps the optimized image)
Phase 4 → Phase 5 (card must link to correct page before transition)
Phase 3.1 → Phase 3.5, 3.6 (must locate DataSchema before injecting)
All phases → Phase 6 (changeset last)
```

Phases 2, 3, and 4 are independent of each other and can be implemented in any order.
