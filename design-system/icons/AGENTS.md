# AI Agent Context for @dezkareid/icons

This file provides critical context for AI agents working on this package.

## Architecture

`@dezkareid/icons` is a build-time SVG icon library. Raw SVG files are the source of truth; a build pipeline transforms them into typed, tree-shakeable React components.

### Data flow

```
src/svg/*.svg
    ↓  scripts/build-icons.ts (Node.js script, run via tsx)
    ↓  SVGO optimization (in-memory, per file)
    ↓  PascalCase component generation
src/react/*.tsx        ← generated, gitignored
src/react/index.ts     ← generated barrel, gitignored
src/icons.ts           ← generated IconName union type, gitignored
    ↓  tsup (ESM bundle + .d.ts)
dist/react.mjs
dist/react.d.mts
```

### Key directories

| Path | Purpose |
|------|---------|
| `src/svg/` | Source SVG files — hand-authored, kebab-case filenames |
| `src/react/` | **Generated** — do not edit manually; regenerated on every build |
| `scripts/build-icons.ts` | Codegen script: SVG → React components |
| `dist/` | tsup output — what consumers import |

## Tech Stack

- **TypeScript** `5.9.3`
- **tsup** `8.5.1` — bundler (ESM output, splitting + treeshake enabled)
- **tsx** `4.21.0` — runs the codegen script without pre-compiling
- **SVGO** `4.0.1` — SVG optimization (in-memory, not CLI)
- **Vitest** `4.1.2` — test runner
- **@testing-library/react** `16.3.2` — component tests

## SVG Authoring Conventions

All source SVGs in `src/svg/` must follow these rules:

1. **Filename**: kebab-case, e.g. `arrow-right.svg` → exported as `ArrowRight`
2. **viewBox**: always `viewBox="0 0 24 24"`
3. **Color**: use `stroke="currentColor"` or `fill="currentColor"` — never hardcode colors
4. **Size**: no `width` or `height` attributes on the root `<svg>` — SVGO removes them; size is controlled via `--icon-size` CSS custom property
5. **No decorators**: no `id`, `class`, or `style` attributes (SVGO strips them)

## Build Scripts

Always run from the monorepo root:

```bash
# Full build (codegen + tsup)
pnpm turbo run build --filter=@dezkareid/icons

# Regenerate components only (no bundle step)
pnpm --filter @dezkareid/icons generate

# Tests
pnpm turbo run test --filter=@dezkareid/icons
```

## Package Exports

```json
{
  "exports": {
    "./react": {
      "import": "./dist/react.mjs",
      "types": "./dist/react.d.mts"
    }
  }
}
```

Future entry points (not yet implemented): `./astro`, `./vue`

## Generated File Contracts

`scripts/build-icons.ts` emits components with this shape:

```tsx
export function ArrowRight({ label, style, ...props }: ArrowRightProps) {
  return (
    <svg
      {/* SVGO-optimized attrs, camelCase for JSX */}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      style={{ width: 'var(--icon-size, 1em)', height: 'var(--icon-size, 1em)', ...style }}
      {...props}
      dangerouslySetInnerHTML={{ __html: "..." }}
    />
  );
}
```

Key invariants:
- `dangerouslySetInnerHTML` is used only for SVG inner content (paths, circles, etc.) — safe because the source comes from our own SVG files, not user input
- Accessibility: no label → `aria-hidden="true"`; with label → `aria-label` + `role="img"`
- Sizing: always `var(--icon-size, 1em)` for both width and height

## Adding Icons

Drop a new `.svg` file in `src/svg/`. The next `pnpm build` (or `pnpm generate`) picks it up automatically — no manual wiring needed.

## Out of Scope (this iteration)

- Angular entry point (`@dezkareid/icons/angular`) — deferred
- Astro entry point (`@dezkareid/icons/astro`) — deferred
- Animated icons, icon fonts, sprite sheets
- Brand/logo icons
