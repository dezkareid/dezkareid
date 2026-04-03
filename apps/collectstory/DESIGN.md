# Design System: collectstory

**Project ID:** `projects/collectstory`

## Visual Theme & Atmosphere
- **Mood:** Delightful, aesthetic, and minimalistic. The application should feel like a premium digital showcase for personal collections.
- **Density:** Spacious and focused. We prioritize visual clarity to let the collection items (images and descriptions) take center stage.
- **Philosophy:** Mobile-first, responsive, and accessible. The interface invites users to share collections and discover new items through a clean, engaging, and modern experience.

## Color Palette & Roles
We strictly use semantic design tokens from `@dezkareid/design-tokens` to ensure automatic theme consistency (light/dark mode).

- **Background (Primary):** `var(--color-background-primary)` — Main surface for pages and layouts.
- **Background (Secondary):** `var(--color-background-secondary)` — Used for cards, sidebars, and grouping elements.
- **Primary Action:** `var(--color-primary)` — Main brand color for buttons, active states, and highlights.
- **Text (Primary):** `var(--color-text-primary)` — Primary content color with maximum readability.
- **Text (Secondary):** `var(--color-text-secondary)` — Used for supporting information and metadata.
- **Text (Inverse):** `var(--color-text-inverse)` — Used on top of primary color backgrounds (e.g., button labels).
- **Success:** `var(--color-success)` — Validation and positive feedback.
- **Danger:** `var(--color-danger)` — Errors and destructive actions.

*Note: Avoid hardcoded colors. If a specific color is missing, use a `TODO(design-system)` annotation to request a new token.*

## Typography Rules
- **Font Family:** `var(--font-family-base)` (IBM Plex Sans) — Standard UI font for a modern and clean look.
- **Mono Font:** `var(--font-family-mono)` (IBM Plex Mono) — Used for technical identifiers or specific technical data.
- **Hierarchy:**
  - **Hero Headers:** `var(--font-size-900)` with `var(--font-weight-bold)`.
  - **Section Headers:** `var(--font-size-700)` with `var(--font-weight-medium)`.
  - **Body Text:** `var(--font-size-300)` for standard text, `var(--font-size-400)` for featured descriptions.
  - **Small/Labels:** `var(--font-size-100)` to `var(--font-size-200)`.
- **Line Heights:**
  - `var(--font-line-height-tight)` for headings.
  - `var(--font-line-height-normal)` for general body text.
- **Letter Spacing:**
  - `var(--font-letter-spacing-tight)` for large headings to improve impact.

## Layout & Spacing
- **Base Unit:** 4px grid system, fully mapped to `var(--spacing-*)` tokens.
- **Spacing Scale:**
  - Small gaps (icons/text): `var(--spacing-4)`, `var(--spacing-8)`.
  - Content padding (cards/buttons): `var(--spacing-12)`, `var(--spacing-16)`, `var(--spacing-24)`.
  - Section spacing: `var(--spacing-32)`, `var(--spacing-48)`, `var(--spacing-64)`.
- **Breakpoints:**
  - **Mobile:** `min-width: var(--breakpoint-small-min)` (0).
  - **Tablet:** `min-width: var(--breakpoint-medium-min)` (37.5rem).
  - **Desktop:** `min-width: var(--breakpoint-large-min)` (60rem).
  - **Extra Large:** `min-width: var(--breakpoint-extra-large-min)` (90rem).
- **Strategy:** Mobile-first approach for all responsive layouts.

## Component Stylings
- **Buttons:**
  - Border Radius: `var(--border-radius-medium)` for standard buttons, `var(--border-radius-pill)` for floating actions.
  - Padding: `var(--spacing-12)` (vertical) and `var(--spacing-24)` (horizontal).
- **Cards (Collection Items):**
  - Background: `var(--color-background-secondary)`.
  - Border Radius: `var(--border-radius-large)`.
  - Shadow: `var(--shadow-card)` (elevates to `var(--shadow-card-hover)` on interaction).
  - Padding: `var(--spacing-16)`.
- **Inputs:**
  - Border Radius: `var(--border-radius-small)`.
  - Focused State: `2px solid var(--color-primary)`.

## Do’s and Don’ts (Guardrails)
- **Do:** Use semantic tokens to ensure seamless light/dark mode transitions.
- **Do:** Prioritize accessibility by ensuring all text elements use `primary` or `secondary` text tokens.
- **Do:** Use `var(--border-radius-large)` for main container elements to maintain a "delightful" and soft aesthetic.
- **Don't:** Hardcode HEX values, pixel sizes for spacing, or font weights.
- **Don't:** Use tokens from the "base" category (e.g., `--color-base-blue-500`) directly in app components; always prefer semantic tokens.
- **Don't:** Introduce complex gradients that contradict the minimalistic visual style.
