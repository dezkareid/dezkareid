import type { AnchorHTMLAttributes, ElementType, ReactNode } from 'react';
import cx from 'classnames';
import type { LinkProperties } from '../../shared/types/link';
import styles from '../../css/button.module.css';

export interface Properties extends LinkProperties, AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * The component to use for the link. Defaults to 'a'.
   * This allows using platform-specific link components like Next.js 'Link'.
   */
  component?: ElementType;
  children: ReactNode;
}

export function Link({
  variant = 'link',
  size = 'md',
  disabled = false,
  component: Component = 'a',
  children,
  className,
  ...rest
}: Properties) {
  // If variant is 'link', we don't apply button styles by default,
  // but we still want to support button-like links.
  const isButton = variant !== 'link';

  return (
    <Component
      className={cx(
        isButton && styles.button,
        isButton && styles[`button--${variant}`],
        isButton && styles[`button--${size}`],
        disabled && styles['button--disabled'],
        className,
      )}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </Component>
  );
}
