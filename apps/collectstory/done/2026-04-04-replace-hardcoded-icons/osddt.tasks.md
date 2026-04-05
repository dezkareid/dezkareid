# Tasks: Replace Hardcoded Icons with Design System Icons

## Dependencies

- Phase 1 must complete before Phase 2
- Phase 2 must complete before Phases 3–9
- Phases 3–9 are independent of each other and can run in parallel
- Phases 10–11 must complete after Phases 3–9
- Phase 12 must be last

---

## Phase 1 — Add missing SVGs to `@dezkareid/icons`

- [x] [S] Author `design-system/icons/src/svg/share.svg` (24×24, `fill="currentColor"`, share/network shape)
- [x] [S] Author `design-system/icons/src/svg/globe.svg` (24×24, `fill="currentColor"` or `stroke="currentColor"`, circle with meridian lines)
- [x] [S] Author `design-system/icons/src/svg/box.svg` (24×24, `stroke="currentColor"`, simple box/package outline)
- [x] [S] Author `design-system/icons/src/svg/chart.svg` (24×24, `stroke="currentColor"`, line chart / upward trend)
- [x] [M] Author `design-system/icons/src/svg/shelves.svg` — rewrite `ShelvesIcon.tsx` geometry using `fill="currentColor"` (no prop interpolation), preserve all rect positions and opacity values, omit `width`/`height` on root `<svg>`
- [x] [S] Run `pnpm turbo run build --filter=@dezkareid/icons` and verify `Share.tsx`, `Globe.tsx`, `Box.tsx`, `Chart.tsx`, `Shelves.tsx` are generated in `src/react/` and exported from `index.ts`

**Definition of Done:** `@dezkareid/icons` builds without errors and all 5 new components are importable from `@dezkareid/icons/react`.

---

## Phase 2 — Add `@dezkareid/icons` dependency to `apps/collectstory`

- [x] [S] Add `"@dezkareid/icons": "workspace:*"` to `dependencies` in `apps/collectstory/package.json`
- [x] [S] Run `pnpm install` from the monorepo root to update the lockfile

**Definition of Done:** `import { Check } from '@dezkareid/icons/react'` resolves without error in collectstory's TypeScript compiler.

---

## Phase 3 — Refactor `lib/mock-data.ts`

- [x] [M] Import `Box`, `Chart`, `Share` from `@dezkareid/icons/react` in `lib/mock-data.ts`
- [x] [S] Define `IconComponent` type alias (`ComponentType<SVGProps<SVGSVGElement> & { label?: string }>`)
- [x] [S] Update `features` array type to use `icon: IconComponent` instead of `icon: string`
- [x] [S] Replace string values `'inventory_2'` → `Box`, `'monitoring'` → `Chart`, `'share'` → `Share`

**Definition of Done:** `lib/mock-data.ts` compiles with no type errors; `features` array entries carry component references.

---

## Phase 4 — Update `components/landing/Features.tsx`

- [x] [S] Remove `<span className="material-symbols-outlined">{feature.icon}</span>`
- [x] [S] Render icon component reference: `const Icon = feature.icon; <Icon aria-hidden />`

**Definition of Done:** No `material-symbols-outlined` references remain; component renders icon from `features` data without type errors.

---

## Phase 5 — Update `components/landing/Footer.tsx`

- [x] [S] Import `Share`, `Globe` from `@dezkareid/icons/react`
- [x] [S] Replace `<span className="material-symbols-outlined">share</span>` with `<Share aria-hidden />`
- [x] [S] Replace `<span className="material-symbols-outlined">public</span>` with `<Globe aria-hidden />`

**Definition of Done:** No `material-symbols-outlined` references remain in `Footer.tsx`.

---

## Phase 6 — Update `components/landing/LatestArrivals.tsx`

- [x] [S] Import `ChevronLeft`, `ChevronRight` from `@dezkareid/icons/react`
- [x] [S] Replace `<span className="material-symbols-outlined">chevron_left</span>` with `<ChevronLeft aria-hidden />`
- [x] [S] Replace `<span className="material-symbols-outlined">chevron_right</span>` with `<ChevronRight aria-hidden />`

**Definition of Done:** No `material-symbols-outlined` references remain in `LatestArrivals.tsx`.

---

## Phase 7 — Update `components/VerifiedBadge.tsx`

- [x] [S] Import `Check` from `@dezkareid/icons/react`
- [x] [M] Replace entire inline `<svg>` with `<Check label="Verified store" style={{ '--icon-size': '14px' } as React.CSSProperties} className={className} />`
- [x] [S] Remove unused SVG markup and any now-redundant imports

**Definition of Done:** `VerifiedBadge.tsx` contains no inline SVG markup; renders `Check` with accessible label and correct size.

---

## Phase 8 — Update `components/admin/VerifiedToggle.tsx`

- [x] [S] Import `Check` from `@dezkareid/icons/react`
- [x] [M] Replace inline `<svg aria-hidden="true">` in the verified branch with `<Check aria-hidden style={{ '--icon-size': '12px' } as React.CSSProperties} />`
- [x] [S] Remove unused inline SVG markup

**Definition of Done:** `VerifiedToggle.tsx` contains no inline SVG markup; renders `Check` with correct size in the verified state.

---

## Phase 9 — Replace `ShelvesIcon` with `<Shelves />` from design system

- [x] [S] Import `Shelves` from `@dezkareid/icons/react` in `components/SiteHeader.tsx`
- [x] [S] Replace `<ShelvesIcon size={20} />` with `<Shelves aria-hidden style={{ '--icon-size': '20px' } as React.CSSProperties} />` in `SiteHeader.tsx`
- [x] [S] Import `Shelves` from `@dezkareid/icons/react` in `components/landing/Footer.tsx`
- [x] [S] Replace `<ShelvesIcon size={20} />` with `<Shelves aria-hidden style={{ '--icon-size': '20px' } as React.CSSProperties} />` in `Footer.tsx`
- [x] [S] Delete `components/icons/ShelvesIcon.tsx`
- [x] [S] Delete `components/icons/` directory if empty

**Definition of Done:** No imports of `ShelvesIcon` remain; `components/icons/` directory is gone; both consumers render `Shelves` from the design system.

---

## Phase 10 — Remove Material Symbols font from `app/layout.tsx`

- [x] [S] Remove the `other` key (containing the Google Fonts Material Symbols stylesheet URL) from the `metadata` object in `app/layout.tsx`

**Definition of Done:** `app/layout.tsx` `metadata` contains no reference to `fonts.googleapis.com` or `Material+Symbols`.

---

## Phase 11 — Remove dead CSS from `SiteHeader.module.css`

- [x] [S] Delete the `.brand span[class*="material-symbols-outlined"]` rule from `components/SiteHeader.module.css`

**Definition of Done:** No `material-symbols-outlined` string appears anywhere in `apps/collectstory`.

---

## Phase 12 — Verify build integrity

- [x] [S] Run `pnpm turbo run build --filter=@dezkareid/icons` — must exit 0
- [x] [M] Run `pnpm turbo run build --filter=@dezkareid/collectstory` — must exit 0
- [x] [S] Grep for `material-symbols-outlined` across `apps/collectstory` — must return no matches
- [x] [S] Grep for `material-symbols-outlined` across `apps/collectstory` — must return no matches in `app/layout.tsx`
- [x] [S] Confirm `components/icons/` directory no longer exists

**Definition of Done:** Both packages build clean; zero `material-symbols-outlined` references remain; no local icon components remain in collectstory.
