export type Theme = 'light' | 'dark';

/**
 * Controls how applyTheme overrides CSS custom properties.
 *
 * - `'css'`        — Standard CSS: sets `color-scheme` on <html>. Works when
 *                    `light-dark()` is natively supported (Astro, Vite, etc.).
 * - `'lightningcss'` — LightningCSS polyfill: also flips `--lightningcss-light`
 *                    / `--lightningcss-dark` toggle variables. Required when the
 *                    bundler (Next.js/Turbopack) compiles `light-dark()` away.
 *                    Ref: https://lightningcss.dev/transpilation.html
 */
export type CssProcessor = 'css' | 'lightningcss';

export type ThemeToggleProperties = {
  /**
   * CSS processor used by the consuming app's bundler.
   * Defaults to `'css'` (native `color-scheme` / `light-dark()`).
   * Set to `'lightningcss'` for Next.js/Turbopack apps.
   */
  cssProcessor?: CssProcessor;
  /**
   * Called after the theme changes, receiving the new theme value.
   * Useful for syncing external state or analytics.
   */
  onChange?: (theme: Theme) => void;
};
