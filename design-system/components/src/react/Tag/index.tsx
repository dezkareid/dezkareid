import type { HTMLAttributes } from 'react';
import cx from 'classnames';
import type { TagProps } from '../../shared/types/tag';
import styles from '../../css/tag.module.css';

type Props = TagProps & HTMLAttributes<HTMLSpanElement>;

export function Tag({ variant = 'default', children, className, ...rest }: Props) {
  return (
    <span
      className={cx(styles.tag, styles[`tag--${variant}`], className)}
      {...rest}
    >
      {children}
    </span>
  );
}
