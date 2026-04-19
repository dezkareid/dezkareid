import { useTranslations } from 'next-intl';
import { Image } from '@dezkareid/components/react';
import { HomeCTA } from '@/components/HomeCta';
import { heroData } from '@/lib/mock-data';
import styles from './Hero.module.css';

export function Hero() {
  const t = useTranslations('Landing.Hero');

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>{t('badge')}</span>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.description}>{t('description')}</p>
          <div className={styles.actions}>
            <HomeCTA primaryClassName={styles.ctaPrimary} />
          </div>
        </div>
        <div className={styles.visuals}>
          <div className={styles.bentoGrid}>
            <div className={styles.bentoMain}>
              <Image
                src={heroData.images[0].src}
                alt={heroData.images[0].alt}
                strategy="cloudinary"
                sizes="(min-width: 60rem) 33vw, 66vw"
                className={styles.image}
                priority
              />
            </div>
            <div className={styles.bentoSideTop}>
              <Image
                src={heroData.images[1].src}
                alt={heroData.images[1].alt}
                strategy="cloudinary"
                sizes="(min-width: 60rem) 17vw, 33vw"
                className={styles.image}
              />
            </div>
            <div className={styles.bentoSideBottom}>
              <Image
                src={heroData.images[2].src}
                alt={heroData.images[2].alt}
                strategy="cloudinary"
                sizes="(min-width: 60rem) 17vw, 33vw"
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
