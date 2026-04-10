# Task List: Add New Colors to Design System

## Implementation Checklist

### Phase 1: Alpha Support in Style Dictionary
- [x] [M] **1.1** Register a custom transform in `sd.config.js` to handle `alpha` properties on color tokens.
- [x] [S] **1.2** Update the CSS platform to utilize the new alpha transform for `rgba()` generation.
- [x] [S] **1.3** Verify with a temporary token (e.g., `test-alpha: { value: "{color.base.blue.500}", alpha: 0.5 }`).

### Phase 2: Global Tokens Update
- [x] [S] **2.1** Add `rose` palette (`500`, `100`, `900`) to `src/tokens/color/global.json`.
- [x] [S] **2.2** Add `orange` palette (`400`, \`100\`, \`900\`) to \`src/tokens/color/global.json\`.
- [x] [M] **2.3** Refine values for dark mode consistency and contrast headroom.

### Phase 3: Semantic Tokens Update
- [x] [S] **3.1** Define `like` tokens in `src/tokens/color/semantic.json` (using the `alpha` mechanism for hover).
- [x] [S] **3.2** Define `error` semantic token in `src/tokens/color/semantic.json`.
- [x] [S] **3.3** Verify/Update `text-secondary` token to use `light-dark(#4b5563, #9ca3af)`.

### Phase 4: Catalog & Agent Discovery Update
- [x] [S] **4.1** Modify `sd.config.js` to change catalog build path to `catalogs/` in the project root.
- [x] [S] **4.2** Update `scripts/export-catalog.js` if it contains hardcoded paths to `dist/`.
- [x] [S] **4.3** Finalize `AGENTS.md` updates to encourage searching in `catalogs/`.

### Phase 5: Build & Validation
- [x] [S] **5.1** Execute `pnpm build` and verify all platform outputs (CSS, SCSS, JS, Markdown).
- [x] [S] **5.2** Run `pnpm test` to confirm no regression in naming or transformation.
- [x] [x] [M] **5.3** Run `pnpm contrast-check` and resolve any WCAG compliance issues for new tokens.

## Dependencies
- **Task 1.1** is a prerequisite for **Task 3.1** (for `like-hover-bg`).
- **Phase 1, 2, and 3** must be completed before starting **Phase 5**.

## Definition of Done
### Final Completion
- [x] All new color tokens (`rose`, `orange`, `like`, `error`) are exported in CSS, SCSS, and JS.
- [x] The `alpha` transformation works correctly (hover background is transparent).
- [x] Catalogs are generated in the root `catalogs/` directory.
- [x] `pnpm test` and `pnpm contrast-check` pass without errors.
