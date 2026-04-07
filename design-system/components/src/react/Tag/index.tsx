import type { HTMLAttributes, Ref } from 'react';
import cx from 'classnames';
import type { TagProperties } from '../../shared/types/tag';
import styles from '../../css/tag.module.css';

export interface Properties extends TagProperties, HTMLAttributes<HTMLSpanElement> {
  /**
   * Optional ref forwarded to the span element.
   * In React 19+, 'ref' is a standard prop and forwardRef is deprecated.
   */
  ref?: Ref<HTMLSpanElement>;
}

export function Tag({ variant = 'default', children, className, ref, ...rest }: Properties) {
  return (
    <span ref={ref} className={cx(styles.tag, styles[`tag--${variant}`], className)} {...rest}>
      {children}
    </span>
  );
}
