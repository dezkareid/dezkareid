## 1. Setup & Scaffolding

- [x] 1.1 Create `scripts/visualizer/` directory
- [x] 1.2 Create `scripts/visualizer/visualizer.html` with basic HTML5 structure
- [x] 1.3 Link `dist/css/variables.css` in the HTML head
- [x] 1.4 Add a script tag to import `dist/js/tokens.mjs` as a module

## 2. Core UI Structure

- [x] 2.1 Create container sections for Colors, Spacing, Typography, and Breakpoints
- [x] 2.2 Implement base styles for the visualizer dashboard (Vanilla CSS)

## 3. Dynamic Rendering Implementation

- [x] 3.1 Implement logic to categorize tokens from the imported `tokens.mjs` module
- [x] 3.2 Implement color swatch rendering with border and background fill
- [x] 3.3 Implement semantic grouping logic for simultaneous light/dark color pairs
- [x] 3.4 Implement spacing scale visualization showing actual gaps
- [x] 3.5 Implement breakpoint display showing raw token values
- [x] 3.6 Ensure every token item displays its corresponding CSS variable name
- [x] 3.7 Implement clean naming mapping (PascalCase JS to kebab-case CSS variables)
- [x] 3.8 Ensure `Val` prefix is correctly handled and stripped where appropriate

## 4. Integration & Documentation

- [x] 4.1 Add a `visualizer` command to `package.json` to easily open the tool
- [x] 4.2 Install `http-server` as a dev dependency to serve the visualizer
- [x] 4.3 Update `visualizer` script to serve from project root
- [x] 4.4 Update `visualizer.html` to use relative paths for ESM imports
- [x] 4.5 Verify the visualizer correctly reflects changes after a `npm run build`
- [x] 4.6 Add basic instructions to the README on how to use the visualizer
- [x] 4.7 Simplify visualizer UI by removing unnecessary theme toggles and adaptive swatches
