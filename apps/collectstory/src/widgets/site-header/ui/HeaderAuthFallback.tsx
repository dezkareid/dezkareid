import { ThemeToggleWrapper } from '@/src/features/theme';
import { LanguageSwitcher } from '@/src/features/language-switcher';
import styles from './SiteHeader.module.css';

export function HeaderAuthFallback() {
  return (
    <div className={styles['site-header__nav-actions']}>
      <nav className={styles['site-header__nav']} aria-label="Main navigation" />
      <div className={styles['site-header__actions']}>
        <LanguageSwitcher />
        <ThemeToggleWrapper />
        <div className={styles['site-header__avatar-placeholder']} aria-hidden="true" />
      </div>
    </div>
  );
}
