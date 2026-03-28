import type { Theme, CssProcessor } from '../types/theme-toggle';

const STORAGE_KEY = 'color-scheme';

export function getInitialTheme(): Theme {
  if (globalThis.window === undefined) return 'light';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme, cssProcessor: CssProcessor = 'css'): void {
  if (globalThis.window === undefined) return;
  document.documentElement.style.colorScheme = theme;

  if (cssProcessor === 'lightningcss') {
    // LightningCSS (used by Next.js/Turbopack) compiles light-dark() into
    // --lightningcss-light / --lightningcss-dark toggle variables driven by
    // @media (prefers-color-scheme: dark). Override them manually so JS-driven
    // theme switching works regardless of the OS preference.
    // Ref: https://lightningcss.dev/transpilation.html
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--lightningcss-light', ' ');
      document.documentElement.style.setProperty('--lightningcss-dark', 'initial');
    }
    else {
      document.documentElement.style.setProperty('--lightningcss-light', 'initial');
      document.documentElement.style.setProperty('--lightningcss-dark', ' ');
    }
  }
}

export function persistTheme(theme: Theme): void {
  if (globalThis.window === undefined) return;
  localStorage.setItem(STORAGE_KEY, theme);
}
