import React from 'react';
import styles from './ErrorLayout.module.css';

interface ErrorLayoutProperties {
  title: string;
  subtitle: string;
  description: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
}

export const ErrorLayout: React.FC<ErrorLayoutProperties> = ({
  title,
  subtitle,
  description,
  actions,
  footer,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <h2 className={styles.subtitle}>{subtitle}</h2>
        <p className={styles.description}>{description}</p>

        {actions && <div className={styles.actions}>{actions}</div>}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>

      <div className={styles.blob1} />
      <div className={styles.blob2} />
    </div>
  );
};
