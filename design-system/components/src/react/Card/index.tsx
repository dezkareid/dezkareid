import type { HTMLAttributes } from 'react';
import cx from 'classnames';
import type { CardProperties } from '../../shared/types/card';
import styles from '../../css/card.module.css';

type Properties = CardProperties & HTMLAttributes<HTMLDivElement>;

export function Card({ elevation = 'raised', children, className, ...rest }: Properties) {
  return (
    <div className={cx(styles.card, styles[`card--${elevation}`], className)} {...rest}>
      {children}
    </div>
  );
}
