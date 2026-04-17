import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import styles from './DropdownMenuItem.module.css';

interface LinkItemProperties extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant: 'anchor';
  href: string;
  children: ReactNode;
}

interface ButtonItemProperties extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'action';
  children: ReactNode;
}

type Properties = LinkItemProperties | ButtonItemProperties;

function itemClassName(className: string | undefined) {
  return `${styles['dropdown-menu__item']} ${className ?? ''}`;
}

export function DropdownMenuItem(properties: Properties) {
  if (properties.variant === 'anchor') {
    const { href, children, className, onClick, target, rel } = properties;
    return (
      <Link
        href={href}
        role="menuitem"
        className={itemClassName(className)}
        onClick={onClick}
        target={target}
        rel={rel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="submit"
      role="menuitem"
      className={itemClassName(properties.className)}
      disabled={properties.disabled}
      onClick={properties.onClick}
    >
      {properties.children}
    </button>
  );
}
