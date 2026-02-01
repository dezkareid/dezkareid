## 1. Token Definition

- [x] 1.1 Create `src/tokens/breakpoints.json`
- [x] 1.2 Define `small`, `medium`, `large`, and `extra-large` breakpoints with `min` and `max` values

## 2. Configuration & Build

- [x] 2.1 Update `sd.config.js` to include `src/tokens/breakpoints.json` source
- [x] 2.2 Verify if existing formats support media query output or if a custom format is needed
- [x] 2.3 Remove `css/custom-media` format and ensure standard variable output covers min/max tokens

## 3. Verification

- [x] 3.1 Run build command to generate tokens
- [x] 3.2 Verify `dist/` contains new breakpoint variables/mixins
- [x] 3.3 Verify values match the `rem` specifications
