import type { ButtonHTMLAttributes, Ref } from 'react';
import cx from 'classnames';
import type { ButtonProperties } from '../../shared/types/button';
import styles from '../../css/button.module.css';

export interface Properties extends ButtonProperties, ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Optional ref forwarded to the button element.
   * In React 19+, 'ref' is a standard prop and forwardRef is deprecated.
   */
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  className,
  ref,
  ...rest
}: Properties) {
  return (
    <button
      ref={ref}
      className={cx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        disabled && styles['button--disabled'],
        className,
      )}
      disabled={disabled}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
