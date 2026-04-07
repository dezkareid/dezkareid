import type { HTMLAttributes, Ref } from 'react';
import cx from 'classnames';
import type { CardProperties } from '../../shared/types/card';
import styles from '../../css/card.module.css';

export interface Properties extends CardProperties, HTMLAttributes<HTMLDivElement> {
  /**
   * Optional ref forwarded to the div element.
   * In React 19+, 'ref' is a standard prop and forwardRef is deprecated.
   */
  ref?: Ref<HTMLDivElement>;
}

export function Card({ elevation = 'raised', children, className, ref, ...rest }: Properties) {
  return (
    <div ref={ref} className={cx(styles.card, styles[`card--${elevation}`], className)} {...rest}>
      {children}
    </div>
  );
}
