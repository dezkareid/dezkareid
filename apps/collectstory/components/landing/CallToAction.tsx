import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@dezkareid/components/react-server';
import styles from './CallToAction.module.css';

export function CallToAction() {
  const t = useTranslations('Landing.CTA');

  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.content}>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.description}>{t('description')}</p>
            <Link href="/login">
              <Button size="large" className={styles.button}>
                {t('button')}
              </Button>
            </Link>
          </div>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
        </div>
      </div>
    </section>
  );
}
