# Task List: Personal Website for Frontend Developer

## Phase 1: Foundation & Styling
- [x] [S] Add `@dezkareid/design-tokens` to `apps/main-website/package.json`
- [x] [S] Verify/Build design tokens in the workspace
- [x] [S] Create `src/styles/global.css` and import design token variables
- [x] [M] Develop `Layout.astro` with SEO, metadata, and semantic structure
- [x] [S] Add favicon assets to `public/`

**Definition of Done**: Project dependencies are set up, and a basic layout with global styles is rendering.

## Phase 2: Core UI Components
- [x] [S] Implement `Section.astro` component for consistent spacing
- [x] [M] Implement `Button.astro` with design token variants
- [x] [M] Implement `Card.astro` as a base UI component
- [x] [M] Develop `Hero.astro` section
- [x] [S] Develop `SkillsList.astro` component
- [x] [S] Develop `SocialLinks.astro` component

**Definition of Done**: Atomic UI components and core landing page sections are built and visually verified.

## Phase 3: Content & Collections
- [x] [S] Configure Content Collections in `src/content/config.ts`
- [x] [S] Create project markdown files in `src/content/projects/`
- [x] [S] Create service markdown files in `src/content/services/`
- [x] [M] Implement `ProjectCard.astro` using collection data
- [x] [M] Implement `ServiceCard.astro` using collection data

**Definition of Done**: Content schemas are defined, sample data exists, and collection-specific cards are ready.

## Phase 4: Pages & Routing
- [x] [M] Compose `src/pages/index.astro` (Home Page)
- [x] [M] Implement `src/pages/projects/index.astro` (Projects Page)
- [x] [M] Implement `src/pages/services/index.astro` (Services Page)
- [x] [S] Implement `src/pages/about.astro` (About Page)
- [x] [S] Set up Navigation links in Header/Footer

**Definition of Done**: All main pages are accessible via navigation and display their respective content.

## Phase 5: Optimization & Launch
- [x] [S] Finalize Open Graph and Meta tags across all pages
- [x] [M] Perform Accessibility audit and fix findings
- [x] [S] Optimize images using `astro:assets`
- [x] [S] Run production build and verify output

**Definition of Done**: Site is optimized for SEO, performance, and accessibility, passing a final production build check.

## Dependencies
- Phase 1 must be completed before styling components in Phase 2.
- Phase 3 must be completed before implementing the Projects and Services pages in Phase 4.
- Phase 4 should be substantially complete before final optimizations in Phase 5.
