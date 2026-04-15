'use client';

import { memo, useState, useRef, useEffect, useCallback, type HTMLAttributes, type ReactNode } from 'react';
import styles from './DropdownMenu.module.css';

interface Properties extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode | ((open: boolean) => ReactNode);
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
}

export const DropdownMenu = memo(function DropdownMenu({ trigger, children, align = 'right', className, ...rest }: Properties) {
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

  const resolvedTrigger = typeof trigger === 'function' ? trigger(open) : trigger;

  return (
    <div
      ref={wrapperRef}
      className={`${styles['dropdown-menu']} ${className ?? ''}`}
      {...rest}
    >
      <div
        className={styles['dropdown-menu__trigger']}
        onClick={() => setOpen(previous => !previous)}
      >
        {resolvedTrigger}
      </div>

      {open && (
        <div
          role="menu"
          className={`${styles['dropdown-menu__panel']} ${styles[`dropdown-menu__panel--${align}`]}`}
          onClick={close}
        >
          {children}
        </div>
      )}
    </div>
  );
});
