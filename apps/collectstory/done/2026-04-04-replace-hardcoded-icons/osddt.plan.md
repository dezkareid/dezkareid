# Implementation Plan: Replace Hardcoded Icons with Design System Icons

## Architecture Overview

The migration follows a strict dependency order: extend `@dezkareid/icons` first, then consume it in `apps/collectstory`. No external icon libraries may be added — only optimisation tooling (SVGO, already present) is permitted.

**Icon system after migration:**

| Before | After |
|--------|-------|
| `<span className="material-symbols-outlined">chevron_left</span>` | `<ChevronLeft />` from `@dezkareid/icons/react` |
| `<span className="material-symbols-outlined">chevron_right</span>` | `<ChevronRight />` from `@dezkareid/icons/react` |
| `<span className="material-symbols-outlined">share</span>` | `<Share />` from `@dezkareid/icons/react` |
| `<span className="material-symbols-outlined">public</span>` | `<Globe />` from `@dezkareid/icons/react` |
| `<span className="material-symbols-outlined">inventory_2</span>` | `<Box />` from `@dezkareid/icons/react` |
| `<span className="material-symbols-outlined">monitoring</span>` | `<Chart />` from `@dezkareid/icons/react` |
| Inline SVG checkmark in `VerifiedBadge.tsx` | `<Check />` from `@dezkareid/icons/react` |
| Inline SVG checkmark in `VerifiedToggle.tsx` | `<Check />` from `@dezkareid/icons/react` |
| Local `<ShelvesIcon>` in `SiteHeader.tsx` and `Footer.tsx` | `<Shelves />` from `@dezkareid/icons/react` |

**Mock data refactor:** `features` array in `lib/mock-data.ts` changes from storing icon name strings (`icon: 'inventory_2'`) to storing React component references (`icon: Box`). `Features.tsx` renders the component directly instead of interpolating a string into a `<span>`.

**Material Symbols removal:** The Google Fonts stylesheet URL in `app/layout.tsx` `metadata.other` is removed. The `.brand span[class*="material-symbols-outlined"]` CSS rule in `SiteHeader.module.css` is removed.

**React 19 compatibility:** All generated icon components use standard `SVGProps<SVGSVGElement>` — no deprecated APIs. `dangerouslySetInnerHTML` is the established pattern in `@dezkareid/icons` and is safe here (SVG source is internal, not user input).

---

## Implementation Phases

### Phase 1 — Add missing SVGs to `@dezkareid/icons`

**Goal:** Make the icon library the complete source of truth for all icons needed by collectstory.

**Files to create** (all in `design-system/icons/src/svg/`):

| File | Source | Description |
|------|--------|-------------|
| `share.svg` | Material Symbol `share` | Two nodes connected to a central node (share/network) |
| `globe.svg` | Material Symbol `public` | Circle with meridian/latitude lines |
| `box.svg` | Material Symbol `inventory_2` | Simple box/package outline |
| `chart.svg` | Material Symbol `monitoring` | Line chart / trend upward |
| `shelves.svg` | Local `ShelvesIcon.tsx` | Two shelf boards with small item silhouettes |

**SVG authoring rules** (from `AGENTS.md`):
- `viewBox="0 0 24 24"`
- `stroke="currentColor"` or `fill="currentColor"` — never hardcoded colours
- No `width` or `height` attributes on root `<svg>`
- No `id`, `class`, or `style` attributes

**`shelves.svg` authoring note:** The current `ShelvesIcon.tsx` uses `fill={color}` via a React prop and `width={size}` / `height={size}` props — both are non-standard for the icons package. The SVG source must be rewritten to use `fill="currentColor"` directly in markup (no prop interpolation) and omit `width`/`height` (SVGO strips them; size is controlled by `--icon-size`). The `opacity` values on individual `<rect>` elements are preserved as-is.

**Build step:** Run `pnpm turbo run build --filter=@dezkareid/icons` after all 5 SVGs are added. Verify the generated `src/react/` files include `Share.tsx`, `Globe.tsx`, `Box.tsx`, `Chart.tsx`, `Shelves.tsx` and the barrel `index.ts` exports them.

---

### Phase 2 — Add `@dezkareid/icons` as a dependency of `apps/collectstory`

**Goal:** Wire the workspace dependency so collectstory can import from `@dezkareid/icons/react`.

**File:** `apps/collectstory/package.json`

Add to `dependencies`:
```json
"@dezkareid/icons": "workspace:*"
```

No version pin needed — it is a workspace package. Turborepo's `^build` chain ensures `@dezkareid/icons` is built before `@dezkareid/collectstory`.

---

### Phase 3 — Refactor `lib/mock-data.ts`

**Goal:** Replace icon name strings with React component references; preserve type safety.

**Current shape of `features` array:**
```ts
{ title: string; description: string; icon: string; color: string }
```

**New shape:**
```ts
import type { ComponentType, SVGProps } from 'react';
import { Box, Chart, Share } from '@dezkareid/icons/react';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { label?: string }>;

export const features: Array<{
  title: string;
  description: string;
  icon: IconComponent;
  color: string;
}> = [
  { title: 'AI Inventory', ..., icon: Box, color: 'blue' },
  { title: 'Value Tracking', ..., icon: Chart, color: 'indigo' },
  { title: 'Public Vaults', ..., icon: Share, color: 'purple' },
];
```

The type alias `IconComponent` can be inlined or exported if reused elsewhere.

---

### Phase 4 — Update `components/landing/Features.tsx`

**Goal:** Render the icon component reference from mock data instead of interpolating a string into `<span>`.

**Current:**
```tsx
<span className="material-symbols-outlined">{feature.icon}</span>
```

**New:**
```tsx
const Icon = feature.icon;
<Icon aria-hidden />
```

Or inline: `<feature.icon aria-hidden />` — whichever is cleaner in context. Since these are purely decorative (the feature title describes the meaning), `aria-hidden` is correct; no `label` prop needed.

---

### Phase 5 — Update `components/landing/Footer.tsx`

**Goal:** Replace the two Material Symbols `<span>` elements with typed icon components.

**Current:**
```tsx
<span className="material-symbols-outlined">share</span>
<span className="material-symbols-outlined">public</span>
```

**New:**
```tsx
import { Share, Globe } from '@dezkareid/icons/react';

<Share aria-hidden />
<Globe aria-hidden />
```

The buttons already have `aria-label` on the `<button>` element, so the icons themselves should be `aria-hidden`.

---

### Phase 6 — Update `components/landing/LatestArrivals.tsx`

**Goal:** Replace the chevron `<span>` elements with typed icon components.

**Current:**
```tsx
<span className="material-symbols-outlined">chevron_left</span>
<span className="material-symbols-outlined">chevron_right</span>
```

**New:**
```tsx
import { ChevronLeft, ChevronRight } from '@dezkareid/icons/react';

<ChevronLeft aria-hidden />
<ChevronRight aria-hidden />
```

The buttons already carry `aria-label="Previous"` / `aria-label="Next"`, so the icons are decorative.

---

### Phase 7 — Update `components/VerifiedBadge.tsx`

**Goal:** Replace the inline SVG checkmark with `<Check />` from the design system.

**Current:** Full inline `<svg>` with `aria-label="Verified store"` and `role="img"`.

**New:**
```tsx
import { Check } from '@dezkareid/icons/react';

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Check
      className={className}
      label="Verified store"
      style={{ '--icon-size': '14px' } as React.CSSProperties}
    />
  );
}
```

The `label` prop activates `aria-label` + `role="img"` on the generated component — matching current accessibility behaviour. Size is controlled via `--icon-size` CSS custom property as per the design system convention (not `width`/`height` props).

---

### Phase 8 — Update `components/admin/VerifiedToggle.tsx`

**Goal:** Replace the inline SVG checkmark with `<Check />`.

**Current:** Inline `<svg aria-hidden="true">` inside the verified branch of the button.

**New:**
```tsx
import { Check } from '@dezkareid/icons/react';

// inside the verified branch:
<Check aria-hidden style={{ '--icon-size': '12px' } as React.CSSProperties} />
```

The button already carries `aria-label` and `aria-pressed`, so the icon is purely decorative (`aria-hidden`).

---

### Phase 9 — Replace `ShelvesIcon` with `<Shelves />` from design system

**Goal:** Remove the local `ShelvesIcon` component and replace all its usages with the new design system component. Delete the `components/icons/` directory.

**Consumers** (both identified in the research):
- `components/landing/Footer.tsx` — `import { ShelvesIcon } from '@/components/icons/ShelvesIcon'`
- `components/SiteHeader.tsx` — `import { ShelvesIcon } from '@/components/icons/ShelvesIcon'`

**New import in both files:**
```tsx
import { Shelves } from '@dezkareid/icons/react';
```

**API change:** The current `ShelvesIcon` accepts `size` (number) and `color` (string) props. The design system component uses `--icon-size` CSS custom property for size and inherits color via `currentColor`. Update call sites:

```tsx
// Before
<ShelvesIcon size={20} />

// After — size via CSS custom property
<Shelves aria-hidden style={{ '--icon-size': '20px' } as React.CSSProperties} />
```

After updating both consumers, delete `components/icons/ShelvesIcon.tsx` and (if empty) the `components/icons/` directory.

---

### Phase 10 — Remove Material Symbols from `app/layout.tsx`

**Goal:** Remove the Google Fonts stylesheet reference that loads the Material Symbols font.

**Current** (`app/layout.tsx`, `metadata.other`):
```ts
other: {
  rel: 'stylesheet',
  url: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
},
```

**Action:** Remove the `other` key from the `metadata` object entirely (no other fields use it).

---

### Phase 11 — Remove dead CSS from `SiteHeader.module.css`

**Goal:** Remove the CSS rule that targeted `.material-symbols-outlined` inside `.brand`.

**Current** (`SiteHeader.module.css`):
```css
.brand span[class*="material-symbols-outlined"] {
  font-size: 24px;
}
```

**Action:** Delete this rule. `ShelvesIcon` (used in `SiteHeader`) is an SVG component, not a span, so this rule was already non-functional for it — it only ever applied to Material Symbols spans, which no longer exist.

---

### Phase 12 — Verify build integrity

**Goal:** Confirm both packages build cleanly end-to-end.

```bash
# From monorepo root
pnpm turbo run build --filter=@dezkareid/icons
pnpm turbo run build --filter=@dezkareid/collectstory
```

TypeScript compilation will fail at build time if any icon import references a non-existent export — this is the type-safety guarantee from the decisions.

---

## Technical Dependencies

| Dependency | Role | Status |
|------------|------|--------|
| `@dezkareid/icons` | Design system icon library | Exists — needs 4 new SVGs |
| `svgo` `4.0.1` | SVG optimisation in `build-icons.ts` | Already in `@dezkareid/icons` devDeps |
| `tsup` `8.5.1` | Bundles icon components to `dist/` | Already in `@dezkareid/icons` devDeps |
| React `19.2.4` | Consumer runtime | Already in `@dezkareid/collectstory` deps |

No new external libraries are introduced. The constraint (no external icon libraries; only optimisation tooling permitted) is fully respected.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| New SVGs (`box.svg`, `chart.svg`, `globe.svg`, `share.svg`) are authored with hardcoded colours or incorrect `viewBox` | Follow AGENTS.md SVG authoring rules strictly; verify with `pnpm turbo run build --filter=@dezkareid/icons` before moving to Phase 2 |
| `VerifiedBadge` size changes visually after switching to `--icon-size` CSS var | The current inline SVG uses `width="14" height="14"`. Set `--icon-size: 14px` via the `style` prop to preserve exact sizing |
| `ShelvesIcon` visual fidelity changes after SVG rewrite | The source uses `fill={color}` prop with `opacity` on individual rects. The `shelves.svg` must preserve the same rect geometry and opacity values; only replace prop interpolation with `fill="currentColor"` |
| `features` type in mock-data becomes incompatible with other consumers | Verify all imports of `features` from `lib/mock-data` before changing the type — `Features.tsx` is the only consumer |
| Turborepo cache serves stale `@dezkareid/icons` dist | The `^build` dependency chain in `turbo.json` ensures icons are rebuilt when their sources change; no manual cache clearing needed |

---

## Out of Scope

- Adding Astro or Vue entry points to `@dezkareid/icons`
- Any icon usage outside `apps/collectstory`
- Restyling or redesigning UI components beyond the icon swap
- Storybook stories for the 4 new icons (can be done as a follow-up)
