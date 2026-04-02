# Research: Application Styles Package Audit

## Audit Findings: `apps/main-website`
- **Generic Resets**: `box-sizing: border-box`, `margin: 0` for everything, heading resets.
- **Elements**: `body` flexbox column layout, base typography (`font-family`, `line-height`, `antialiased`).
- **Objects**: `.container` with `max-width: 1200px` and `margin: 0 auto`.
- **Utilities**: Scroll-reveal classes (`.reveal`, `.reveal-group`, `.is-visible`), `:focus-visible` global ring.

## Audit Findings: `apps/collectstory`
- **Generic Resets**: Identical `box-sizing` and heading/paragraph resets.
- **Elements**: Consistent `body` base styles, media resets (`img`, `video`, `svg`).
- **Objects**: `.shell`, `.grid`, `.page` layout patterns.
- **Utilities**: `.bg-alt` and similar visual utilities.

## ITCSS Mapping
- **settings/**: `_themes.scss` for automatic light/dark mode logic.
- **tools/**: (Existing `_breakpoints.scss`).
- **generic/**: Update `_reset.scss` with universal box-sizing, margin/padding resets, and media resets.
- **elements/**: Update `_base.scss` with `body` typography and link foundations.
- **objects/**: Create `_container.scss`, `_layout.scss` for `.o-container`, `.o-grid`, `.o-shell`.
- **utilities/**: Create `_reveal.scss` for scroll animations, `_visibility.scss` for common utility classes.

## Phase 1 Definition of Done
- [x] Audit `apps/main-website` for shared styling patterns.
- [x] Audit `apps/collectstory` for shared styling patterns.
- [x] Map ITCSS integration points for extracted styles.
