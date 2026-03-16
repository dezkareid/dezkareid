import type { ButtonHTMLAttributes } from 'react';
import cx from 'classnames';
import type { ButtonProperties } from '../../shared/types/button';
import styles from '../../css/button.module.css';

type Properties = ButtonProperties & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  className,
  ...rest
}: Properties) {
  return (
    <button
      className={cx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        disabled && styles['button--disabled'],
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
