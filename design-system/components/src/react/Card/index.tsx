import type { HTMLAttributes } from 'react';
import cx from 'classnames';
import type { CardProps } from '../../shared/types/card';
import styles from '../../css/card.module.css';

type Props = CardProps & HTMLAttributes<HTMLDivElement>;

export function Card({ elevation = 'raised', children, className, ...rest }: Props) {
  return (
    <div className={cx(styles.card, styles[`card--${elevation}`], className)} {...rest}>
      {children}
    </div>
  );
}
