# Design System: collectstory

**Project ID:** `projects/collectstory`

## Visual Theme & Atmosphere
- **Mood:** Delightful, aesthetic, and minimalistic. The application should feel like a premium digital showcase for personal collections.
- **Density:** Spacious and focused. We prioritize visual clarity to let the collection items (images and descriptions) take center stage.
- **Philosophy:** Mobile-first, responsive, and accessible. The interface invites users to share collections and discover new items through a clean, engaging, and modern experience.

## Color Palette & Roles
We strictly use semantic design tokens from `@dezkareid/design-tokens` to ensure automatic theme consistency (light/dark mode).

- **Background (Primary):** `var(--color-background-primary)` (Light: `#ffffff` / Dark: `#000000`) — Main surface for pages and layouts.
- **Background (Secondary):** `var(--color-background-secondary)` (Light: `#f3f4f6` / Dark: `#1f2937`) — Used for cards, sidebars, and grouping elements.
- **Primary Action:** `var(--color-primary)` (Light: `#2563eb` / Dark: `#dbeafe`) — Main brand color for buttons, active states, and highlights.
- **Text (Primary):** `var(--color-text-primary)` (Light: `#111827` / Dark: `#ffffff`) — Primary content color with maximum readability.
- **Text (Secondary):** `var(--color-text-secondary)` (Light: `#4b5563` / Dark: `#9ca3af`) — Used for supporting information and metadata.
- **Text (Inverse):** `var(--color-text-inverse)` (Light: `#ffffff` / Dark: `#111827`) — Used on top of primary color backgrounds (e.g., button labels).
- **Success:** `var(--color-success)` (Light: `#22c55e` / Dark: `#14532d`) — Validation and positive feedback.
- **Danger:** `var(--color-danger)` (Light: `#ef4444` / Dark: `#7f1d1d`) — Errors and destructive actions.

*Note: Avoid hardcoded colors. If a specific color is missing, use a `TODO(design-system)` annotation to request a new token.*

## Typography Rules
- **Font Family:** `var(--font-family-base)` (`'IBM Plex Sans', sans-serif`) — Standard UI font for a modern and clean look.
- **Mono Font:** `var(--font-family-mono)` (`'IBM Plex Mono', monospace`) — Used for technical identifiers or specific technical data.
- **Hierarchy:**
  - **Hero Headers:** `var(--font-size-900)` (`3rem`) with `var(--font-weight-bold)` (`700`).
  - **Section Headers:** `var(--font-size-700)` (`1.875rem`) with `var(--font-weight-medium)` (`500`).
  - **Body Text:** `var(--font-size-300)` (`1rem`) for standard text, `var(--font-size-400)` (`1.125rem`) for featured descriptions.
  - **Small/Labels:** `var(--font-size-100)` (`0.75rem`) to `var(--font-size-200)` (`0.875rem`).
- **Line Heights:**
  - `var(--font-line-height-tight)` (`1.25`) for headings.
  - `var(--font-line-height-normal)` (`1.5`) for general body text.
- **Letter Spacing:**
  - `var(--font-letter-spacing-tight)` (`-0.02em`) for large headings to improve impact.

## Layout & Spacing
- **Base Unit:** 4px grid system, fully mapped to `var(--spacing-*)` tokens.
- **Spacing Scale:**
  - Small gaps (icons/text): `var(--spacing-4)` (`0.25rem`), `var(--spacing-8)` (`0.5rem`).
  - Content padding (cards/buttons): `var(--spacing-12)` (`0.75rem`), `var(--spacing-16)` (`1rem`), `var(--spacing-24)` (`1.5rem`).
  - Section spacing: `var(--spacing-32)` (`2rem`), `var(--spacing-48)` (`3rem`), `var(--spacing-64)` (`4rem`).
- **Breakpoints:**
  - **Mobile:** `min-width: var(--breakpoint-small-min)` (`0`).
  - **Tablet:** `min-width: var(--breakpoint-medium-min)` (`37.5rem`).
  - **Desktop:** `min-width: var(--breakpoint-large-min)` (`60rem`).
  - **Extra Large:** `min-width: var(--breakpoint-extra-large-min)` (`90rem`).
- **Strategy:** Mobile-first approach for all responsive layouts.

## Component Stylings
- **Buttons:**
  - Border Radius: `var(--border-radius-medium)` (`0.5rem`) for standard buttons, `var(--border-radius-pill)` (`9999px`) for floating actions.
  - Padding: `var(--spacing-12)` (`0.75rem`) (vertical) and `var(--spacing-24)` (`1.5rem`) (horizontal).
- **Cards (Collection Items):**
  - Background: `var(--color-background-secondary)` (Light: `#f3f4f6` / Dark: `#1f2937`).
  - Border Radius: `var(--border-radius-large)` (`1rem`).
  - Shadow: `var(--shadow-card)` (`0 2px 8px rgba(0,0,0,0.08)`) (elevates to `var(--shadow-card-hover)` (`0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.1)`) on interaction).
  - Padding: `var(--spacing-16)` (`1rem`).
- **Inputs:**
  - Border Radius: `var(--border-radius-small)` (`0.25rem`).
  - Focused State: `2px solid var(--color-primary)` (Light: `#2563eb` / Dark: `#dbeafe`).

## Translation Strategy
- **Namespace-based**: Use namespaces like `Landing`, `Profile`, or `Common` to organize keys.
- **Component Agnostic**: Components should not import i18n hooks if they are intended to be reusable. Pass translated strings via props.
- **Dynamic Values**: Use ICU message format for pluralization and variables (e.g., `{count} {count, plural, =1 {item} other {items}}`).

## Do’s and Don’ts (Guardrails)
- **Do:** Use semantic tokens to ensure seamless light/dark mode transitions.
- **Do:** Prioritize accessibility by ensuring all text elements use `primary` or `secondary` text tokens.
- **Do:** Use `var(--border-radius-large)` for main container elements to maintain a "delightful" and soft aesthetic.
- **Don't:** Hardcode HEX values, pixel sizes for spacing, or font weights.
- **Don't:** Use tokens from the "base" category (e.g., `--color-base-blue-500`) directly in app components; always prefer semantic tokens.
- **Don't:** Introduce complex gradients that contradict the minimalistic visual style.
