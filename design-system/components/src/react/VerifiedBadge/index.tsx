import type { HTMLAttributes, Ref } from 'react';
import cx from 'classnames';
import { Check } from '@dezkareid/icons/react';
import type { VerifiedBadgeProperties } from '../../shared/types/verified-badge';
import styles from '../../css/verified-badge.module.css';

export interface Properties extends VerifiedBadgeProperties, HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
}

export function VerifiedBadge({ className, size = 14, ref, ...rest }: Properties) {
  return (
    <span ref={ref} className={cx(styles['verified-badge'], className)} {...rest}>
      <Check
        className={styles['verified-badge__icon']}
        label="Verified store"
        style={{ '--verified-badge-size': `${size}px` } as React.CSSProperties}
      />
    </span>
  );
}
