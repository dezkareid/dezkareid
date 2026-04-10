# Specification: Add New Colors to Design System

## Overview
The `dezkareid` design system needs to incorporate several new color tokens that have been identified as missing during the development of the `collectstory` and `main-website` applications. These tokens will bridge the gap between hardcoded values in the applications and a centralized, maintainable design language.

## Requirements
- **Global Tokens (Tier 1):**
    - Add `rose-500` (`#f43f6e`) to global tokens.
    - Add `orange-400` (`#fb923c`) to global tokens.
- **Semantic Tokens (Tier 2):**
    - **"Like" UI Functionality:**
        - `--color-like`: Points to `rose-500` for standard state.
        - `--color-like-hover-bg`: Points to `rose-500` at 8% opacity for hover states.
        - `--color-like-gradient-from`: Points to `rose-500` for gradients.
        - `--color-like-gradient-to`: Points to `orange-400` for gradients.
    - **Semantic Error State:**
        - `--color-error`: A semantic token for form validation and error messaging (fallback value `#e53e3e`).
    - **Secondary Text Content:**
        - Ensure `--color-text-secondary` is properly defined with sufficient contrast headroom (aiming for `light-dark(#4b5563, #9ca3af)`).

## Scope
- **In Scope:**
    - Updating `src/tokens/color/global.json` with new base color values.
    - Updating `src/tokens/color/semantic.json` with new semantic aliases for both light and dark themes.
    - Validating contrast for all new semantic tokens against WCAG 2.1 standards.
    - Rebuilding the design system outputs (CSS, SCSS, JS).
- **Out of Scope:**
    - Refactoring application code to consume these new tokens (this should be done as a separate task for the application owners).
    - Implementing complex color logic (like dynamic opacity calculation) if not currently supported by Style Dictionary setup.

## Acceptance Criteria
1. Global tokens for `rose-500` and `orange-400` are successfully defined in `global.json`.
2. New semantic tokens for "like" functionality (`--color-like`, `--color-like-hover-bg`, `--color-like-gradient-from`, `--color-like-gradient-to`) are available in all output formats.
3. The semantic token `--color-error` is available and aliased to a suitable global token (e.g., `red-500` or a new `red` shade).
4. Contrast checks pass for all new semantic tokens in both light and dark modes.
5. All generated assets (`dist/`) reflect the new token definitions.

## Decisions
1. **Error Token Definition**: `--color-error` will have its own distinct semantic definition (not a direct alias of `--color-danger`) to allow for future divergence in visual design.
2. **Opacity Support**: We will add support for color manipulation (alpha) to the Style Dictionary configuration to handle the 8% opacity for `--color-like-hover-bg`.
3. **Theming Strategy**: The `rose` and `orange` shades will have theme-specific global values (light and dark) to ensure optimal contrast and aesthetics in both modes.
