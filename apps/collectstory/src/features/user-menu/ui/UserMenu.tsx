'use client';

import Image from 'next/image';
import { signOut } from '@/app/actions';
import { DropdownMenu, DropdownMenuItem, DropdownDivider } from '@/src/shared/ui/dropdown-menu';
import styles from './UserMenu.module.css';

type Properties = {
  username: string | undefined;
  avatarUrl: string | undefined;
  email: string | undefined;
};

export function UserMenu({ username, avatarUrl, email }: Properties) {
  const initial = email?.[0]?.toUpperCase() ?? '?';

  return (
    <DropdownMenu
      trigger={open => (
        <button
          type="button"
          className={styles['user-menu__trigger']}
          aria-label="User menu"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {avatarUrl
            ? (
                <Image
                  src={avatarUrl}
                  alt={username ?? 'User avatar'}
                  width={32}
                  height={32}
                  className={styles['user-menu__avatar-image']}
                />
              )
            : initial}
        </button>
      )}
      align="right"
    >
      <DropdownMenuItem variant="anchor" href="/profile/edit">
        Profile
      </DropdownMenuItem>
      {username && (
        <DropdownMenuItem variant="anchor" href={`/${username}`}>
          Vault
        </DropdownMenuItem>
      )}
      <DropdownDivider />
      <DropdownMenuItem variant="action" onClick={() => signOut()}>Sign Out</DropdownMenuItem>
    </DropdownMenu>
  );
}
