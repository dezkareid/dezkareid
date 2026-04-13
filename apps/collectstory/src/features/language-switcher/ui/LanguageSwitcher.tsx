'use client';

import { useLocale } from 'next-intl';
import { Globe } from '@dezkareid/icons/react';
import { Button } from '@dezkareid/components/react-client';
import { routing } from '@/app/i18n/routing';
import { usePathname, getPathname } from '@/app/i18n/navigation';
import { DropdownMenu, DropdownMenuItem } from '@/src/shared/ui/dropdown-menu';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  function onLanguageSelect(nextLocale: string) {
    // Explicitly set the cookie to ensure the preference is picked up by the middleware
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

    const nextPathname = getPathname({
      locale: nextLocale as 'es' | 'en',
      href: pathname,
    });

    // Use absolute URL to ensure correct navigation and force a full page reload
    globalThis.location.href = globalThis.location.origin + nextPathname + globalThis.location.search + globalThis.location.hash;
  }

  const currentLabel = locale === 'es' ? 'Español' : 'English';

  return (
    <DropdownMenu
      id="language-switcher"
      align="right"
      trigger={open => (
        <Button
          variant="ghost"
          aria-label={`Select language. Current: ${currentLabel}`}
          aria-haspopup="menu"
          aria-expanded={open}
          className={styles.trigger}
        >
          <Globe aria-hidden className={styles.icon} />
          <span className={styles.label}>{locale.toUpperCase()}</span>
        </Button>
      )}
    >
      {routing.locales.map(current => (
        <DropdownMenuItem
          key={current}
          variant="action"
          onClick={() => onLanguageSelect(current)}
          className={current === locale ? styles.active : ''}
        >
          {current === 'es' ? 'Español' : 'English'}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
