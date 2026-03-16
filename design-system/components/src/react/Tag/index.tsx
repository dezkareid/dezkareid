import type { HTMLAttributes } from 'react';
import cx from 'classnames';
import type { TagProperties } from '../../shared/types/tag';
import styles from '../../css/tag.module.css';

type Properties = TagProperties & HTMLAttributes<HTMLSpanElement>;

export function Tag({ variant = 'default', children, className, ...rest }: Properties) {
  return (
    <span className={cx(styles.tag, styles[`tag--${variant}`], className)} {...rest}>
      {children}
    </span>
  );
}
