# Spec: Improve Accessibility, SEO, and Performance for Projects Pages

## Overview

The projects index page and individual project pages have several accessibility and usability issues identified through an audit and manual inspection, as well as gaps in SEO metadata and performance optimisation. These issues reduce usability for users relying on assistive technologies, users on mobile devices, and users with visual impairments; limit discoverability through search engines; and may degrade perceived load performance. This feature addresses all identified issues to bring the pages in line with WCAG 2.1 AA standards, improve search engine visibility, and optimise page load performance.

## Requirements

### Contrast Ratio

1. All text elements must meet a minimum contrast ratio of 4.5:1 against their background (for normal text) and 3:1 (for large text and UI components), per WCAG 2.1 AA.
2. The project type badges (personal, work, contribution) must have sufficient contrast between their text and background colors in both light and dark themes.
3. Description text in project cards, the projects index page, and individual project pages must use a color that achieves well above the 4.5:1 minimum — `--color-base-gray-500` (`#6b7280`) sits at the boundary (~4.6:1) and must be replaced with a safer value. Resolved with `light-dark(#4b5563, #9ca3af)` (~7:1 light, ~7.2:1 dark).
4. Tech tag text must have sufficient contrast against the tag background.
5. Project link icons (GitHub, NPM, Live Demo) must not rely on opacity for their resting color — an explicit color token must be used to guarantee contrast in both themes.

### Touch Targets

6. All interactive elements (project card links, icon links, buttons) must have a minimum touch target size of 24×24 CSS pixels, with at least 24px spacing between adjacent targets (per WCAG 2.5.8 AA — Target Size Minimum).
7. The small icon links (GitHub, NPM, Live Demo icons at 1.25rem / ~20px) in the ProjectCard footer must be enlarged to meet the minimum target size.

### Heading Hierarchy

8. Heading levels on the projects index page must be sequentially descending without skipping levels (e.g., h1 → h2 → h3, not h1 → h3).
9. Currently, the index page uses h1 for "My Projects" and then h3 for individual project card titles, skipping h2. The project card heading must be changed to h2.
10. On individual project pages, the heading hierarchy must be valid: h1 for the project title, then h2 for content sections — no levels skipped.

### Mobile Spacing

11. Individual project pages must have horizontal padding/spacing between the page content and the viewport edges on mobile screen sizes, preventing content from touching the screen edges.
12. The projects index page must also maintain adequate horizontal spacing from the viewport on mobile.

### SEO

13. The projects index page must have a unique, descriptive `<title>` and `<meta name="description">` tag relevant to the projects listing.
14. Each individual project page must have a unique `<title>` and `<meta name="description">` derived from the project's own name and description.
15. Project pages must include Open Graph (`og:title`, `og:description`, `og:url`) meta tags to support link previews when shared on social platforms.
16. The projects index page must include a canonical URL tag.
17. Project card links on the index page must have descriptive, accessible link text (not just an icon or generic label) so search engines and assistive technologies understand the link destination.
18. Both the projects index page and individual project pages must include JSON-LD structured data (`CollectionPage` and `SoftwareSourceCode` respectively) to improve rich result eligibility in search engines.

### Performance

18. Project cover images must use appropriate `loading` attributes: images below the fold should use `loading="lazy"`, and the first visible image (if above the fold) should use `loading="eager"` or be preloaded.
19. Project cover images must specify `width` and `height` attributes (or equivalent `aspect-ratio` CSS) to prevent Cumulative Layout Shift (CLS) during load.
20. The projects index page must not block rendering with unnecessary synchronous resources.

## Scope

### In Scope

- Projects index page (`/projects`)
- Individual project pages (`/projects/[slug]`)
- `ProjectCard` component (used on the index page)
- CSS color tokens or direct color values producing contrast failures
- Touch target sizes for interactive elements in both pages
- Heading levels in both pages and in `ProjectCard`
- Mobile horizontal padding/margin for project pages
- SEO meta tags (`<title>`, `<meta description>`, Open Graph, canonical) for both page types
- Image loading strategy and CLS prevention for project cover images

### Out of Scope

- Other pages not related to projects
- Redesigning the visual style or layout beyond what is needed to fix the issues
- Adding new features or functionality
- Dark/light theme redesign
- Fixing any issues not identified in the audit or description above
- Full site-wide SEO or performance audit

## Acceptance Criteria

1. **Contrast — text:** All body text, descriptions, and labels on both project pages pass a contrast ratio of 4.5:1 (AA) with comfortable headroom (target ≥7:1) in both light and dark themes. Description elements use `light-dark(#4b5563, #9ca3af)` until a secondary text design token is available.
2. **Contrast — badges:** Project type badge text passes 4.5:1 against the badge background in both themes.
3. **Contrast — icons:** Project link icons pass a 3:1 contrast ratio against the card background in their default (non-hover) state. Resting color uses `var(--color-base-gray-500)` instead of opacity.
4. **Touch targets — minimum size:** All interactive elements on the project pages are at least 24×24px in clickable area.
5. **Touch targets — icon links:** GitHub, NPM, and Live Demo icon links in project cards meet minimum size requirements (visual or via padding expansion).
6. **Heading order — index page:** The projects index page has a valid heading structure: h1 ("My Projects") → h2 (each project card title), with no skipped levels.
7. **Heading order — project page:** Individual project pages maintain a valid structure: h1 (project name) → h2 (content section headers).
8. **Mobile spacing — project page:** On viewport widths ≤ 600px, individual project pages show visible horizontal spacing (padding) between content and the screen edge on both left and right sides.
9. **Mobile spacing — index page:** On viewport widths ≤ 600px, the projects index page content does not touch the viewport edges.
10. **No regressions:** All existing visual styles, hover states, and functionality remain intact after changes.
11. **SEO — meta tags:** Both page types have unique, populated `<title>` and `<meta name="description">` tags visible in the page source.
12. **SEO — Open Graph:** Individual project pages and the index page include `og:title`, `og:description`, and `og:url` tags.
13. **SEO — canonical:** The projects index page includes a `<link rel="canonical">` pointing to its own URL.
14. **SEO — link text:** Project card links have accessible, descriptive text (visible or via `aria-label`) readable by screen readers and crawlers.
15. **Performance — lazy loading:** Project images below the fold use `loading="lazy"`.
16. **Performance — CLS:** Project images have an `aspect-ratio` or explicit dimensions so no layout shift occurs as images load.
17. **SEO — JSON-LD:** Projects index page emits a `CollectionPage` JSON-LD block. Each project page emits a `SoftwareSourceCode` JSON-LD block with `name`, `description`, `url`, `programmingLanguage`, and optional `codeRepository`/`installUrl`.

## Decisions

- **Description color:** `--color-base-gray-500` (`#6b7280`) is at the WCAG AA boundary (~4.6:1). Replaced with `light-dark(#4b5563, #9ca3af)` for comfortable headroom. A `TODO(design-system)` annotation marks the gap for a proper `--color-text-secondary` token.
- **Badge colors:** Verified all three badge types (personal, work, contribution) pass contrast in both themes — no changes needed.
- **Icon link opacity:** Replaced `opacity: 0.6` resting state with `color: var(--color-base-gray-500)` to decouple visibility from contrast.

## Open Questions

_None — all requirements are clearly defined from the audit results and user observations._

## Data Schema

### JSON-LD Structured Data

#### Projects index page — `CollectionPage`

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Projects",
  "description": "...",
  "url": "https://dezkareid.com/projects",
  "author": {
    "@type": "Person",
    "name": "Joel Humberto Gomez Paredes",
    "url": "https://dezkareid.com"
  }
}
```

#### Individual project page — `SoftwareSourceCode`

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "<title>",
  "description": "<description>",
  "url": "https://dezkareid.com/projects/<slug>",
  "codeRepository": "<githubUrl>",
  "installUrl": "<liveUrl>",
  "programmingLanguage": ["TypeScript", "..."],
  "author": {
    "@type": "Person",
    "name": "Joel Humberto Gomez Paredes",
    "url": "https://dezkareid.com"
  }
}
```

`codeRepository` and `installUrl` are only emitted when the corresponding field is present. `programmingLanguage` is sourced from `techStack`.
