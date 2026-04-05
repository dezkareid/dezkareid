# @dezkareid/icons

SVG icon library for the dezkareid design system. Icons are authored from scratch, optimized with SVGO, and compiled to typed React and Astro components.

## Installation

```bash
pnpm add @dezkareid/icons
```

## Usage

### React

```tsx
import { ArrowRight, Search, Close } from '@dezkareid/icons/react';

// Basic usage — icon is decorative (aria-hidden by default)
<ArrowRight />

// Accessible icon with a label
<Search label="Search" />

// Custom size via CSS custom property
<Close style={{ '--icon-size': '32px' } as React.CSSProperties} />
```

### Astro

```astro
---
import { ArrowRight, Search, Github } from '@dezkareid/icons/astro';
---

<!-- Decorative icon (aria-hidden by default) -->
<ArrowRight />

<!-- Accessible icon with a label -->
<Search label="Search" />

<!-- Custom class for sizing/styling -->
<Github class="social-icon" />
```

#### Astro icon props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Accessible name. When set: `aria-label` + `role="img"`. When omitted: `aria-hidden="true"`. |
| `class` | `string` | `undefined` | CSS class forwarded to the `<svg>` element. |

### Controlling size

Use the `--icon-size` CSS custom property. The default is `1em` (inherits from the surrounding text size).

```css
/* Set size on a parent or class */
.my-icon {
  --icon-size: 20px;
}

.icon-container {
  --icon-size: 24px;
}
```

In Astro, scope via `:global()` when targeting generated icon SVGs:

```astro
<style>
  :global(.social-icon) {
    --icon-size: 1.125rem;
  }
</style>
```

### Controlling color

Icons use `currentColor` for stroke/fill. Set `color` on the icon or any ancestor:

```css
.danger-icon {
  color: var(--color-error);
}
```

### TypeScript — icon name autocomplete

The `IconName` union type lists all valid icon names:

```ts
import type { IconName } from '@dezkareid/icons/react';

const icon: IconName = 'arrow-right'; // autocomplete works
```

## Available icons

| Category   | Icons |
|------------|-------|
| Navigation | `arrow-right`, `arrow-left`, `arrow-up`, `arrow-down`, `chevron-right`, `chevron-left`, `chevron-up`, `chevron-down` |
| Actions    | `close`, `check`, `plus`, `minus`, `edit`, `trash`, `search`, `filter`, `menu` |
| Status     | `info`, `warning`, `error`, `success` |
| Media      | `play`, `pause`, `stop` |
| Social     | `github`, `linkedin`, `twitter-x`, `mail`, `rss` |
| Theme      | `sun`, `moon` |

## Adding a new icon

1. Create a new SVG file in `src/svg/` using kebab-case: `my-icon.svg`
2. Follow these conventions:
   - `viewBox="0 0 24 24"` — 24×24 grid
   - Use `stroke="currentColor"` or `fill="currentColor"` — no hardcoded colors
   - No `width` or `height` attributes — size is controlled via CSS
   - No `id`, `class`, or `style` attributes (SVGO removes them anyway)
3. Run `pnpm --filter @dezkareid/icons generate` (or `pnpm build`) to regenerate components
4. The new icon is immediately available as `MyIcon` from both `@dezkareid/icons/react` and `@dezkareid/icons/astro`

## Accessibility

| Prop | Behavior |
|------|----------|
| No `label` prop | `aria-hidden="true"` — decorative, hidden from assistive technology |
| `label="..."` | `aria-label="..."` + `role="img"` — accessible name announced to screen readers |

## Build

The build pipeline:
1. `scripts/build-icons.ts` — reads `src/svg/*.svg`, runs SVGO in-memory, emits typed React components to `src/react/` and Astro components to `src/astro/`
2. `tsup` — bundles `src/react/index.ts` → `dist/react.mjs` + `dist/react.d.mts` (Astro ships as source files)

```bash
# From the monorepo root:
pnpm turbo run build --filter=@dezkareid/icons

# Or just regenerate components (no tsup step):
pnpm --filter @dezkareid/icons generate
```

## License

MIT
