import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@dezkareid/components/react-server';
import { heroData } from '@/lib/mock-data';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>{heroData.badge}</span>
          <h1 className={styles.title}>{heroData.title}</h1>
          <p className={styles.description}>{heroData.description}</p>
          <div className={styles.actions}>
            <Link href="/login">
              <Button size="large" className={styles.ctaPrimary}>
                {heroData.ctaPrimary.label}
              </Button>
            </Link>
            <Link href="/stores">
              <Button variant="outline" size="large" className={styles.ctaSecondary}>
                {heroData.ctaSecondary.label}
              </Button>
            </Link>
          </div>
        </div>
        <div className={styles.visuals}>
          <div className={styles.bentoGrid}>
            <div className={styles.bentoMain}>
              <Image
                src={heroData.images[0].src}
                alt={heroData.images[0].alt}
                fill
                className={styles.image}
                priority
              />
            </div>
            <div className={styles.bentoSideTop}>
              <Image
                src={heroData.images[1].src}
                alt={heroData.images[1].alt}
                fill
                className={styles.image}
              />
            </div>
            <div className={styles.bentoSideBottom}>
              <Image
                src={heroData.images[2].src}
                alt={heroData.images[2].alt}
                fill
                className={styles.image}
              />
            </div>
          </div>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
        </div>
      </div>
    </section>
  );
}
