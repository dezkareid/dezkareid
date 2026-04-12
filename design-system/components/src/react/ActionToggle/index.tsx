'use client';

import { useState, type ButtonHTMLAttributes, type Ref } from 'react';
import cx from 'classnames';
import type { ActionToggleProperties } from '../../shared/types/action-toggle';
import styles from '../../css/action-toggle.module.css';

export interface Properties extends ActionToggleProperties, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  ref?: Ref<HTMLButtonElement>;
}

export function ActionToggle({
  active: controlledActive,
  defaultActive = false,
  onChange,
  variant = 'default',
  className,
  disabled,
  children,
  ref,
  onClick,
  ...rest
}: Properties) {
  const [internalActive, setInternalActive] = useState(defaultActive);
  const isControlled = controlledActive !== undefined;
  const active = isControlled ? controlledActive : internalActive;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const nextActive = !active;
    if (!isControlled) {
      setInternalActive(nextActive);
    }

    onChange?.(nextActive);
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={cx(
        styles['action-toggle'],
        active && styles['action-toggle--active'],
        variant !== 'default' && styles[`action-toggle--${variant}`],
        className,
      )}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={active}
      {...rest}
    >
      <span className={cx(styles['action-toggle__icon'])}>
        {children}
      </span>
    </button>
  );
}
