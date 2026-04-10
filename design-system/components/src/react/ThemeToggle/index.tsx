'use client';

import { useState, useEffect, type HTMLAttributes, type Ref } from 'react';
import cx from 'classnames';
import type { Theme, ThemeToggleProperties } from '../../shared/types/theme-toggle';
import { getInitialTheme, applyTheme, persistTheme } from '../../shared/js/theme';
import { Button } from '../Button';
import styles from '../../css/theme-toggle.module.css';

export interface Properties extends ThemeToggleProperties, Omit<HTMLAttributes<HTMLSpanElement>, 'onChange'> {
  /**
   * Optional ref forwarded to the wrapper span element.
   * In React 19+, 'ref' is a standard prop and forwardRef is deprecated.
   */
  ref?: Ref<HTMLSpanElement>;
}

const SunIcon = (
  <svg
    aria-hidden="true"
    className={styles['theme-toggle__icon']}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = (
  <svg
    aria-hidden="true"
    className={styles['theme-toggle__icon']}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export function ThemeToggle({
  cssProcessor = 'css',
  onChange,
  className,
  ref,
  ...rest
}: Properties) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const initial = getInitialTheme();
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setTheme(initial);
    applyTheme(initial, cssProcessor);
  }, [cssProcessor]);

  function toggle() {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next, cssProcessor);
    persistTheme(next);
    onChange?.(next);
  }

  const isDark = theme === 'dark';
  const label = isDark ? 'Dark' : 'Light';

  return (
    <span ref={ref} className={cx(styles['theme-toggle__wrapper'], className)} {...rest}>
      <Button
        variant="ghost"
        className={cx(styles['theme-toggle'], isDark && styles['theme-toggle--dark'])}
        onClick={toggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={isDark}
      >
        {isDark ? MoonIcon : SunIcon}
        {label}
      </Button>
      <span aria-live="polite" className={styles['sr-only']}>
        {`${label} mode active`}
      </span>
    </span>
  );
}
