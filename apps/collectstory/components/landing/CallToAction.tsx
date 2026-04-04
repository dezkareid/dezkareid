import Link from 'next/link';
import { Button } from '@dezkareid/components/react-server';
import { ctaSection } from '@/lib/mock-data';
import styles from './CallToAction.module.css';

export function CallToAction() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.content}>
            <h2 className={styles.title}>{ctaSection.title}</h2>
            <p className={styles.description}>{ctaSection.description}</p>
            <Link href="/login">
              <Button size="large" className={styles.button}>
                {ctaSection.buttonLabel}
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
