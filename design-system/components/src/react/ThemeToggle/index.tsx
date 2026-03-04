import { useState, useEffect } from 'react';
import cx from 'classnames';
import type { Theme } from '../../shared/types/theme-toggle';
import { getInitialTheme, applyTheme, persistTheme } from '../../shared/js/theme';
import styles from '../../css/theme-toggle.module.css';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function toggle() {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
    persistTheme(next);
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={cx(styles['theme-toggle'], isDark && styles['theme-toggle--dark'])}
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
    >
      {isDark ? 'Dark' : 'Light'}
    </button>
  );
}
