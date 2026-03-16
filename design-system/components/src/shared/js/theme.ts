import type { Theme } from '../types/theme-toggle';

const STORAGE_KEY = 'color-scheme';

export function getInitialTheme(): Theme {
  if (globalThis.window === undefined) return 'light';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  if (globalThis.window === undefined) return;
  document.documentElement.setAttribute('color-scheme', theme);
}

export function persistTheme(theme: Theme): void {
  if (globalThis.window === undefined) return;
  localStorage.setItem(STORAGE_KEY, theme);
}
