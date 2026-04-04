# @dezkareid/icons

SVG icon library for the dezkareid design system. Icons are authored from scratch, optimized with SVGO, and compiled to typed React components.

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

### Controlling size

Use the `--icon-size` CSS custom property. The default is `1em` (inherits from the surrounding text size).

```css
/* Set size on the icon directly */
.my-icon {
  --icon-size: 20px;
}

/* Or set it on a parent */
.icon-container {
  --icon-size: 24px;
}
```

### Controlling color

Icons use `currentColor` for stroke/fill. Set `color` on the icon or any ancestor:

```css
.danger-icon {
  color: var(--color-error); /* or any CSS color */
}
```

```tsx
<Close style={{ color: 'red' }} />
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

## Adding a new icon

1. Create a new SVG file in `src/svg/` using kebab-case: `my-icon.svg`
2. Follow these conventions:
   - `viewBox="0 0 24 24"` — 24×24 grid
   - Use `stroke="currentColor"` or `fill="currentColor"` — no hardcoded colors
   - No `width` or `height` attributes — size is controlled via CSS
   - No `id`, `class`, or `style` attributes (SVGO removes them anyway)
3. Run `pnpm --filter @dezkareid/icons generate` (or `pnpm build`) to regenerate components
4. The new icon is immediately available as `MyIcon` from `@dezkareid/icons/react`

## Accessibility

| Prop | Behavior |
|------|----------|
| No `label` prop | `aria-hidden="true"` — decorative, hidden from assistive technology |
| `label="..."` | `aria-label="..."` + `role="img"` — accessible name announced to screen readers |

## Build

The build pipeline:
1. `scripts/build-icons.ts` — reads `src/svg/*.svg`, runs SVGO in-memory, emits typed React components to `src/react/`
2. `tsup` — bundles `src/react/index.ts` → `dist/react.mjs` + `dist/react.d.mts`

```bash
# From the monorepo root:
pnpm turbo run build --filter=@dezkareid/icons

# Or just regenerate components (no tsup step):
pnpm --filter @dezkareid/icons generate
```

## License

MIT
