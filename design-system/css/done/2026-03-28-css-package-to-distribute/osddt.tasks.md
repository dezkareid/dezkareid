# Tasks: CSS Commons Package Implementation (Scaffolding + Max Page Size)

## Phase 1: Project Setup & Scaffolding
- [x] [S] Initialize `package.json` with `sass` and `lightningcss` dependencies.
- [x] [S] Create ITCSS directory structure under `src/` (settings, tools, generic, elements, objects, components, utilities).
- [x] [S] Create master `src/main.scss` and remove redundant index files.
- [x] [S] Port a modern CSS reset into `_reset.scss` in the generic folder.

**Definition of Done**: ITCSS scaffolding is in place and the project is ready for style implementation.

## Phase 2: Core Configuration (Tools)
- [x] [M] **Tools**: Implement basic SASS mixins for responsive breakpoints (e.g. `_breakpoints.scss`).

**Definition of Done**: Responsive tools are available for layout objects.

## Phase 3: Layout Implementation (Max Page Size)
- [x] [M] **Objects**: Implement the `max-page-size` layout object in `_page.scss` in the objects folder.
- [x] [S] **Elements**: Add scaffolding for base typography and link styles in `_base.scss` in the elements folder.

**Definition of Done**: The `max-page-size` utility is functional and the element layer is ready for future styles.

## Phase 4: Build & Distribution
- [x] [M] Configure `sass` and `lightningcss` build pipeline to generate `dist/index.css` from `main.scss`.
- [x] [S] Verify the output bundle contains the reset and the `max-page-size` object.
- [x] [S] Document the usage of `max-page-size` and the ITCSS structure in `README.md`.

**Definition of Done**: The package successfully builds and exports the requested layout structure.
