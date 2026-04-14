import { useTranslations } from 'next-intl';
import { features } from '@/lib/mock-data';
import styles from './Features.module.css';

function FeatureItem({
  feature,
  title,
  description,
}: {
  feature: (typeof features)[number];
  title: string;
  description: string;
}) {
  const Icon = feature.icon;
  return (
    <div className={styles.feature}>
      <div className={`${styles.iconWrapper} ${styles[`icon--${feature.color}`]}`}>
        <Icon aria-hidden />
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}

export function Features() {
  const t = useTranslations('Landing.Features');

  // Map features to their translation keys based on their original title in mock-data
  const featureKeys: Record<string, string> = {
    'AI Inventory': 'ai_inventory',
    'Value Tracking': 'value_tracking',
    'Public Vaults': 'public_vaults',
  };

  const filteredFeatures = features.filter(f => f.title === 'Public Vaults');

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('header.title')}</h2>
          <p className={styles.subtitle}>{t('header.subtitle')}</p>
        </div>
        <div className={styles.grid}>
          {filteredFeatures.map((feature) => {
            const key = featureKeys[feature.title];
            return (
              <FeatureItem
                key={feature.title}
                feature={feature}
                title={t(`${key}.title`)}
                description={t(`${key}.description`)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
