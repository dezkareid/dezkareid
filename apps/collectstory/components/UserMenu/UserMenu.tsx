'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CloudinaryImage } from '@/src/shared/ui/CloudinaryImage';
import { signOut } from '@/app/actions';
import styles from './UserMenu.module.css';

type UserMenuProperties = {
  username: string | undefined;
  avatarUrl: string | undefined;
  email: string | undefined;
};

export function UserMenu({ username, avatarUrl, email }: UserMenuProperties) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    function onClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        close();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
    }

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  const initial = email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="User menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(previous => !previous)}
      >
        {avatarUrl
          ? (
              <CloudinaryImage
                mode="fixed"
                src={avatarUrl}
                alt={username ?? 'User avatar'}
                width={32}
                height={32}
                className={styles.avatarImage}
              />
            )
          : initial}
      </button>

      {open && (
        <div role="menu" className={styles.menu}>
          <Link
            href="/profile/edit"
            role="menuitem"
            className={styles.menuItem}
            onClick={close}
          >
            Profile
          </Link>
          {username && (
            <Link
              href={`/${username}`}
              role="menuitem"
              className={styles.menuItem}
              onClick={close}
            >
              Vault
            </Link>
          )}
          <div className={styles.divider} role="separator" />
          <form action={signOut}>
            <button type="submit" role="menuitem" className={styles.menuItem}>
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
