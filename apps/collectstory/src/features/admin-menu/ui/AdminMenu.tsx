'use client';

import { DropdownMenu, DropdownMenuItem } from '@/src/shared/ui/dropdown-menu';
import styles from './AdminMenu.module.css';

const ADMIN_LINKS = [
  { href: '/admin/brands', label: 'Brands' },
  { href: '/admin/lines', label: 'Lines' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/stores', label: 'Stores' },
  { href: '/admin/franchises', label: 'Franchises' },
] as const;

export function AdminMenu() {
  return (
    <DropdownMenu
      trigger={open => (
        <button
          type="button"
          className={styles['admin-menu__trigger']}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          Admin
          <svg
            className={`${styles['admin-menu__chevron']} ${open ? styles['admin-menu__chevron--open'] : ''}`}
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      align="center"
    >
      {ADMIN_LINKS.map(({ href, label }) => (
        <DropdownMenuItem key={href} variant="anchor" href={href}>
          {label}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
