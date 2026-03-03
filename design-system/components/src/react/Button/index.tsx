import type { ButtonHTMLAttributes } from 'react';
import cx from 'classnames';
import type { ButtonProps } from '../../shared/types/button';
import styles from '../../css/button.module.css';

type Props = ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  className,
  ...rest
}: Props) {
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
