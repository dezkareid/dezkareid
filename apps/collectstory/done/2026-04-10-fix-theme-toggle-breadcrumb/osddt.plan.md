# Implementation Plan: Fix Theme Toggle, Breadcrumb, Images & Last Arrivals

## Architecture Overview

This plan covers five discrete work areas across two packages:

1. **`turbo.json` + root `package.json` (monorepo root)** — add `outputs: []` to `lint:fix` turbo task; add `lint:fix` script to root `package.json` (alongside the existing `typecheck` script).
2. **`design-system/components`** — add `typecheck` npm script; fix ThemeToggle border by replacing the custom `<button>` with `Button variant="ghost"`.
3. **`apps/collectstory` — Images** — introduce a Cloudinary URL transformation utility; apply it in `CollectionItemCard`, `LatestArrivals`, and the collection page inline image block.
4. **`apps/collectstory` — Breadcrumb** — replace raw slug text with human-readable names in both `BreadcrumbNav` components; add `BreadcrumbList` JSON-LD to both collection and item detail pages.
5. **`apps/collectstory` — Last Arrivals link** — fix the `href` to include the item `slug`.
6. **`apps/collectstory` — View Transition** — card-to-item-page transition using React `<ViewTransition>` + Next.js `experimental.viewTransition`; degrades gracefully on unsupported browsers.

All changes are isolated to the React component sub-tree of the design system and the Next.js app. No new dependencies are introduced. No database schema changes are needed.

---

## Technical Dependencies

- `schema-dts` — already used in `apps/collectstory` for typed JSON-LD. `BreadcrumbList` and `ListItem` types are available.
- `@dezkareid/components/react` — `Button` component with `ghost` variant; already a dependency of `apps/collectstory`.
- Cloudinary URL transformation — handled via plain string manipulation (no SDK). Pattern: insert `/c_fill,w_{width},h_{height},q_auto,f_auto/` before the version/filename segment.
- `turbo.json` `typecheck` and `lint:fix` tasks — already defined at monorepo root; only `design-system/components` is missing the `typecheck` npm script.
- Root `package.json` — has `typecheck` script (`turbo run typecheck --affected`) but is missing `lint:fix`; needs `"lint:fix": "turbo run lint:fix --affected"` added.

---

## Implementation Phases

### Phase 0 — Turbo & Build Tooling

**Goal**: Ensure `typecheck` and `lint:fix` tasks work for `design-system/components`.

#### Task 0.1 — Add `outputs: []` to `turbo.json` `lint:fix`

`turbo.json` `lint:fix` task is missing `outputs: []`. Without it, Turbo may cache the task result and skip re-running it when source files change. Since lint:fix modifies files (side effects), it must never be cached.

```json
// turbo.json
"lint:fix": {
  "inputs": [...],
  "outputs": []
}
```

#### Task 0.2 — Add `lint:fix` script to root `package.json`

The root `package.json` has `"typecheck": "turbo run typecheck --affected"` but no equivalent for `lint:fix`. Add:

```json
"lint:fix": "turbo run lint:fix --affected"
```

This makes `pnpm lint:fix` runnable from the monorepo root, consistent with the existing `lint`, `typecheck`, and `test` scripts.

#### Task 0.3 — Add `typecheck` script to `design-system/components/package.json`

The `turbo.json` `typecheck` task is defined but `@dezkareid/components` has no `typecheck` npm script, so Turbo skips it. Add:

```json
"typecheck": "tsc --noEmit"
```

The `tsconfig.json` in `design-system/components` already exists and covers the `src/` tree, so `tsc --noEmit` will work without additional configuration.

---

### Phase 1 — ThemeToggle: Remove Border (design-system/components)

**Goal**: ThemeToggle renders without a visible border in both light and dark mode. Reuse `Button variant="ghost"` to eliminate duplicate style logic.

#### Task 1.1 — Assess Button ghost variant CSS

Confirm that `.button--ghost` in `src/css/button.module.css` has:
- `background-color: transparent`
- `border: 1px solid transparent` (invisible border, no layout shift)
- Hover: `background-color: var(--color-background-secondary)`
- Focus-visible outline preserved

The ghost variant uses `border: 1px solid transparent` — it does not remove the border from the DOM (to avoid layout shift) but renders it invisibly. This satisfies the requirement: no visible border.

#### Task 1.2 — Refactor `ThemeToggle/index.tsx` to use Button

Replace the custom `<button>` element with `<Button variant="ghost">` from `@dezkareid/components/react`:

- Import `Button` from the same package (internal cross-import within the same build entry is fine since we're in `react/`).
- Remove `styles['theme-toggle']` class from the button element — it carries the border skin. The layout/structure rules (padding, flex) must be preserved; move them to a wrapper or keep the relevant structural rules in the CSS.
- Keep `styles['theme-toggle__wrapper']` for the outer `<span>`.
- Keep `styles['theme-toggle__icon']` for the SVG wrapper.
- Keep `aria-label`, `aria-pressed`, `onClick` props — pass through to `Button` (it forwards `...rest` to the native `<button>`).
- The `theme-toggle--dark` modifier only changed border color and text color — with `Button ghost`, text color inherits from the button's skin. We may need to retain a color modifier class on the Button for the dark-mode primary color, or add a `className` prop to set it.

**Decision**: Keep `styles['theme-toggle--dark']` as an additive class passed via `className` to `Button` — it will only carry the `color` override, not the border rule.

#### Task 1.3 — Update `theme-toggle.module.css`

- Remove the `border` declarations from the base `.theme-toggle` skin section and the `.theme-toggle--dark` modifier.
- Keep structural rules (padding, border-radius, font, display, gap) if they differ from Button's defaults, OR remove them if Button ghost already provides the right structure.
  - Button `md` size has its own padding — verify it matches ThemeToggle's expected size. If not, keep ThemeToggle's structural class or use a `className` override.
- Keep `.theme-toggle__icon`, `.theme-toggle__wrapper`, `.sr-only` unchanged.

#### Task 1.4 — Rebuild and verify

Run `pnpm turbo run build --filter=@dezkareid/components` to produce updated `dist/`.

---

### Phase 2 — Cloudinary Image Optimization (apps/collectstory)

**Goal**: All collection item images are served directly from Cloudinary's CDN at the correct size for each viewport — no fixed-width guess, no Next.js image proxy, no JS required.

#### Why replace `next/image` for Cloudinary images

The previous approach passed a single fixed-width Cloudinary URL to `next/image`. This has two problems:

1. **Wrong size**: A 300px URL served to a 320px mobile viewport wastes nothing, but the same 300px URL on a 1440px desktop shows a blurry upscaled image. A fixed width is always wrong for at least part of the viewport range.
2. **Double proxy**: `next/image` fetches from `/_next/image?url=...`, which re-fetches from Cloudinary origin on the Next.js server. We add a proxy hop for images that Cloudinary's CDN can already serve optimally.

The correct approach is a custom `<CloudinaryImage>` component that generates a native `<img srcset="..." sizes="...">` pointing directly at Cloudinary CDN URLs — no JS, no proxy, works in any RSC or Client Component.

#### Task 2.1 — Rewrite `lib/image/cloudinary.ts`

Replace the fixed-width `getCloudinaryUrl` with two exports:

```ts
// lib/image/cloudinary.ts

/** Widths for the Cloudinary srcset. Covers all layout contexts in the app. */
export const CLOUDINARY_SRCSET_WIDTHS = [320, 480, 640, 960, 1280, 1600] as const;

/**
 * Builds a single Cloudinary URL at a specific width with auto quality and format.
 * Returns the original URL unchanged if it is not a Cloudinary URL.
 */
export function getCloudinaryUrl(
  url: string,
  width: number,
): string {
  const uploadSegment = '/image/upload/';
  const idx = url.indexOf(uploadSegment);
  if (idx === -1) return url;

  const base = url.slice(0, idx + uploadSegment.length);
  const rest = url.slice(idx + uploadSegment.length);
  return `${base}c_fill,w_${width},q_auto,f_auto/${rest}`;
}

/**
 * Builds a `srcset` string of Cloudinary URLs for all standard widths.
 * Returns undefined if the URL is not a Cloudinary URL (caller uses plain <img>).
 */
export function getCloudinarySrcset(url: string): string | undefined {
  if (!url.includes('res.cloudinary.com')) return undefined;
  return CLOUDINARY_SRCSET_WIDTHS
    .map(w => `${getCloudinaryUrl(url, w)} ${w}w`)
    .join(', ');
}
```

#### Task 2.2 — Create `src/shared/ui/CloudinaryImage/CloudinaryImage.tsx`

A zero-JS server-safe image component:

```tsx
// src/shared/ui/CloudinaryImage/CloudinaryImage.tsx

import { getCloudinarySrcset, getCloudinaryUrl, CLOUDINARY_SRCSET_WIDTHS } from '@/lib/image/cloudinary';

type Properties = {
  src: string | undefined;
  alt: string;
  sizes: string;
  /** CSS aspect-ratio value (e.g. "3/4", "1/1", "16/9"). Prevents CLS without JS. */
  aspectRatio: string;
  className?: string;
  priority?: boolean;
};

export function CloudinaryImage({ src, alt, sizes, aspectRatio, className, priority }: Properties) {
  if (!src) return null;

  const srcset = getCloudinarySrcset(src);

  // Non-Cloudinary URL (e.g. Google avatar) — plain img, no srcset
  if (!srcset) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ aspectRatio, width: '100%', objectFit: 'cover' }}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }

  // Use smallest srcset width as the src fallback for browsers without srcset support
  const fallbackSrc = getCloudinaryUrl(src, CLOUDINARY_SRCSET_WIDTHS[0]);

  return (
    <img
      src={fallbackSrc}
      srcSet={srcset}
      sizes={sizes}
      alt={alt}
      style={{ aspectRatio, width: '100%', objectFit: 'cover' }}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );
}
```

**Why this works without JS:**
- `srcset` + `sizes` is pure HTML — the browser picks the right Cloudinary URL at parse time
- `style="aspect-ratio: 3/4; width: 100%"` defines the box dimensions in CSS — no layout shift
- `fetchPriority="high"` on LCP images is a browser hint, not JS
- Works in Server Components, Client Components, and static HTML

Export from `src/shared/ui/CloudinaryImage/index.ts`.

#### Task 2.3 — Remove `next/image` and apply `CloudinaryImage` to all card image sites

Replace `<Image fill sizes=... />` with `<CloudinaryImage>` in:

| Site | `sizes` | `aspectRatio` | `priority` |
|------|---------|---------------|------------|
| `CollectionItemCard` | `(max-width: 480px) 100vw, (max-width: 768px) 50vw, 300px` | `"3/4"` | `false` |
| `LatestArrivals` (first item) | `(min-width: 60rem) 25vw, (min-width: 37.5rem) 50vw, 100vw` | `"3/4"` | `true` (index 0) |
| `LatestArrivals` (rest) | same | `"3/4"` | `false` |
| Collection grid | `(max-width: 420px) 100vw, (max-width: 720px) 50vw, (max-width: 1024px) 33vw, 25vw` | `"3/4"` | `false` |

Remove the `getCloudinaryUrl` import and call from each site. Also remove the `position: relative` requirement from image wrappers if it was only needed for `fill` layout.

#### Task 2.4 — Apply `CloudinaryImage` to the item detail hero

`ItemImageSection.tsx` uses `next/image` with `fill`, `sizes="(max-width: 768px) 100vw, 480px"`, and `priority`. The hero uses `object-fit: contain` (not cover).

Use `CloudinaryImage` with `priority={true}` and add an `objectFit` prop or CSS class override for `contain` behaviour:

```tsx
<CloudinaryImage
  src={currentImageUrl}
  alt={name}
  sizes="(max-width: 768px) 100vw, 480px"
  aspectRatio="3/4"
  priority
  className={styles['item-page__image-media']}
/>
```

The existing `.item-page__image-media { object-fit: contain }` CSS class overrides the inline `object-fit: cover` default — no change to CSS needed.

#### Task 2.5 — Remove `next/image` remote pattern for Cloudinary from `next.config.ts`

Once all Cloudinary images bypass `next/image`, the `res.cloudinary.com` remotePattern is no longer needed. Remove it to reduce the attack surface. Keep `lh3.googleusercontent.com` for Google avatar images (still used as plain `<img>` via the non-Cloudinary branch of `CloudinaryImage`).

> **Note**: If any other site still uses `next/image` with Cloudinary URLs, skip this step.

---

### Phase 3 — Breadcrumb: Human-Readable Labels (apps/collectstory)

**Goal**: Both `BreadcrumbNav` components display entity names; both pages emit `BreadcrumbList` JSON-LD.

#### Task 3.1 — Collection page `BreadcrumbNav` — fetch collection name

`BreadcrumbNav` in `app/[username]/[collectionSlug]/page.tsx` currently only has access to params (slugs). To display the collection `name`, it needs to fetch the collection.

The collection data is already fetched in `CollectionContent` (same page, sibling Suspense). To avoid a second DB call, pass the collection name as a prop to `BreadcrumbNav`, or fetch it directly inside `BreadcrumbNav` (it's an async Server Component — no issue with parallel Suspense).

**Decision**: Fetch inside `BreadcrumbNav` using the existing collection query helper. Both `BreadcrumbNav` and `CollectionContent` fetch in parallel via Suspense — Next.js deduplicates identical fetches with `fetch` caching.

```tsx
async function BreadcrumbNav({ params }) {
  const { username, collectionSlug } = await params;
  const collection = await getCollectionBySlug(username, collectionSlug); // existing helper
  const collectionName = collection?.name ?? collectionSlug; // fallback to slug if not found

  return (
    <nav aria-label="Breadcrumb">
      <Link href={`/${username}`}>@{username}</Link>
      <span aria-hidden="true">/</span>
      <span>{collectionName}</span>
    </nav>
  );
}
```

#### Task 3.2 — Item detail page `BreadcrumbNav` — fetch collection and item names

`BreadcrumbNav` in `app/[username]/[collectionSlug]/[slug]/page.tsx` needs both `collection.name` and `item.name`.

The item data is already fetched in `ItemContent` (same page). Same deduplication applies.

```tsx
async function BreadcrumbNav({ params }) {
  const { username, collectionSlug, slug } = await params;
  const [collection, item] = await Promise.all([
    getCollectionBySlug(username, collectionSlug),
    getItemBySlug(username, collectionSlug, slug),
  ]);

  return (
    <nav aria-label="Breadcrumb">
      <Link href={`/${username}`}>@{username}</Link>
      <span aria-hidden="true">/</span>
      <Link href={`/${username}/${collectionSlug}`}>{collection?.name ?? collectionSlug}</Link>
      <span aria-hidden="true">/</span>
      <span>{item?.name ?? slug}</span>
    </nav>
  );
}
```

#### Task 3.3 — Add `getBreadcrumbSchema` utility

Create `src/shared/lib/schema/breadcrumb.ts` (or extend existing schema files):

```ts
// apps/collectstory/src/shared/lib/schema/breadcrumb.ts
import type { BreadcrumbList, ListItem, WithContext } from 'schema-dts';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(
  items: BreadcrumbItem[],
  baseUrl: string
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    } as ListItem)),
  };
}
```

#### Task 3.4 — Inject BreadcrumbList into collection page metadata/head

The existing pattern in the item detail page uses a `<DataSchema>` component. Locate `DataSchema` (likely in `src/shared/ui/` or similar) and verify it renders a `<script type="application/ld+json">` tag.

In `app/[username]/[collectionSlug]/page.tsx`, generate and render the breadcrumb schema alongside the existing `CollectionPage` schema:

```tsx
// In the page component or a dedicated async component:
const breadcrumbSchema = getBreadcrumbSchema([
  { name: `@${username}`, url: `${baseUrl}/${username}` },
  { name: collection.name, url: `${baseUrl}/${username}/${collectionSlug}` },
], baseUrl);

// Render:
<DataSchema schema={breadcrumbSchema} />
```

#### Task 3.5 — Inject BreadcrumbList into item detail page

Same approach in `app/[username]/[collectionSlug]/[slug]/page.tsx`:

```tsx
const breadcrumbSchema = getBreadcrumbSchema([
  { name: `@${username}`, url: `${baseUrl}/${username}` },
  { name: collection.name, url: `${baseUrl}/${username}/${collectionSlug}` },
  { name: item.name, url: `${baseUrl}/${username}/${collectionSlug}/${slug}` },
], baseUrl);

<DataSchema schema={breadcrumbSchema} />
```

---

### Phase 4 — Last Arrivals: Fix Item Link (apps/collectstory)

**Goal**: Cards link to `/username/collection_slug/item_slug`.

#### Task 4.1 — Update `LatestArrivals.tsx` link href

`item.slug` is already present on `LastArrivalItem`. Change:

```tsx
// Before:
href={`/${item.username}/${item.collection_slug}`}

// After:
href={`/${item.username}/${item.collection_slug}/${item.slug}`}
```

No type changes needed. No API changes needed.

---

### Phase 5 — View Transition: Card → Item Page (apps/collectstory)

**Goal**: Apply a smooth visual transition when the user navigates from a collection item card to the item detail page, using React's View Transitions API with Next.js integration. The API is experimental but degrades gracefully — browsers without support simply skip the animation, so there is no risk of breaking the experience.

#### Research Summary (from Context7 / Next.js v16.1.6 docs)

**API overview:**
- React ships a `<ViewTransition>` component (available in the Canary channel, importable from `react`)
- Next.js adds `experimental.viewTransition: true` in `next.config.ts` for deeper framework integration (e.g. auto-adding transition types on navigation)
- Next.js-specific transition types are not yet implemented — the flag currently only enables the React base component integration

**How it works:**
1. Enable in `next.config.ts`:
   ```ts
   experimental: {
     viewTransition: true,
   }
   ```
2. Import `<ViewTransition>` from `react`:
   ```tsx
   import { ViewTransition } from 'react';
   ```
3. Wrap the element you want to animate (e.g. the card image or card container) with `<ViewTransition>` and assign a stable `view-transition-name` CSS property that matches on both the source (card) and the destination (item page):
   ```tsx
   // In CollectionItemCard or LatestArrivals card:
   <ViewTransition name={`item-image-${item.slug}`}>
     <Image src={...} alt={...} ... />
   </ViewTransition>

   // In the item detail page, wrap the hero image with the same name:
   <ViewTransition name={`item-image-${slug}`}>
     <Image src={...} alt={...} ... />
   </ViewTransition>
   ```
4. The browser natively animates the image from its card position/size to its hero position/size on navigation.

#### Task 5.1 — Enable `experimental.viewTransition` in `next.config.ts`

```ts
// apps/collectstory/next.config.ts
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
  // ...existing config
};
```

#### Task 5.2 — Wrap card image in `<ViewTransition>` in `CollectionItemCard`

`src/entities/item/ui/CollectionItemCard.tsx` — wrap the `<Image>` (and its container) with `<ViewTransition>`. The component receives `name` as a prop or derives it from the item slug (needs slug added to `CollectionItemCard` props).

```tsx
import { ViewTransition } from 'react';

// Add `slug` to CollectionItemCard props:
type Properties = {
  slug: string;
  // ...existing props
};

// In the render:
<ViewTransition name={`item-image-${slug}`}>
  <div className={styles['collection-item-card__image-wrapper']}>
    <Image src={optimizedUrl} alt={name} fill ... />
  </div>
</ViewTransition>
```

#### Task 5.3 — Wrap hero image in `<ViewTransition>` on item detail page

In `app/[username]/[collectionSlug]/[slug]/page.tsx`, find the item hero image and wrap it with a matching `<ViewTransition name>`:

```tsx
import { ViewTransition } from 'react';

<ViewTransition name={`item-image-${slug}`}>
  <div className={styles['item-page__hero-image']}>
    <Image src={item.image_url} alt={item.name} fill priority />
  </div>
</ViewTransition>
```

The `name` value must be identical on both ends — `item-image-${slug}` — for the browser to connect the two elements and animate between them.

#### Task 5.4 — Apply to `LatestArrivals` cards (optional)

Same pattern as Task 5.2 — wrap the card image in `LatestArrivals.tsx` with `<ViewTransition name={`item-image-${item.slug}`}>`. Since `LatestArrivals` is a Client Component, `<ViewTransition>` (also a client-side feature) works without additional constraints.

#### Caveats & Risks

| Risk | Notes |
|---|---|
| `experimental.viewTransition` flag may behave differently across Next.js patch releases | Pin attention to Next.js changelog when upgrading; the flag has no stable API contract yet |
| React `<ViewTransition>` requires Canary | Confirm `react` version in `apps/collectstory` includes `<ViewTransition>` — React 19.2.4 (currently used) may not include it; check if it needs a canary build |
| `view-transition-name` must be unique per page | If multiple cards render on the same page, each must have a unique name — using `item-image-${slug}` achieves this as slugs are unique |
| Graceful degradation | Browsers that don't support View Transitions API simply skip the animation — no broken UI, confirmed safe to ship |

---

### Phase 6 — Changeset

#### Task 6.1 — Create changeset for `@dezkareid/collectstory`

Run `pnpm changeset` from the monorepo root. Select `@dezkareid/collectstory`, bump type `patch`, summary:

```
Fix theme toggle border, Cloudinary image optimization for LCP, human-readable breadcrumbs with BreadcrumbList schema, and Last Arrivals direct item links.
```

If `@dezkareid/components` version bump is needed (ThemeToggle change is user-observable), also include it as `patch`.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| `Button ghost` padding/sizing differs from current ThemeToggle | Compare computed sizes in Storybook after the change; adjust with a `className` override if needed |
| `getCollectionBySlug` called twice per collection page (BreadcrumbNav + CollectionContent) | Next.js `fetch` deduplication handles this for same-request identical fetches; verify the query helper uses `fetch` with caching or Supabase's built-in dedup |
| Cloudinary URL format varies (no version segment, different path structure) | `getCloudinaryUrl` returns the original URL unchanged if the pattern doesn't match; images just render at full resolution as before — no regression |
| `DataSchema` component location unknown | Must be located before Task 3.4; search `app/[username]/[collectionSlug]/[slug]/page.tsx` imports |
| `tsc --noEmit` fails in `design-system/components` due to Angular types | Run `pnpm turbo run typecheck --filter=@dezkareid/components` to verify; if Angular types cause issues, scope tsconfig to exclude Angular or use a separate `tsconfig.check.json` |

---

## Out of Scope

- Image upload logic or Cloudinary account/preset configuration
- Breadcrumbs on any page other than collection and item detail
- Vue, Astro, or Angular ThemeToggle implementations (React only)
- New structured data types beyond BreadcrumbList
- Adding tests for changed components (test suite not yet established for collectstory)
