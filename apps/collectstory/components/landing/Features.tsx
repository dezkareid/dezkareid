import { features } from '@/lib/mock-data';
import styles from './Features.module.css';

function FeatureItem({ feature }: { feature: (typeof features)[number] }) {
  const Icon = feature.icon;
  return (
    <div className={styles.feature}>
      <div className={`${styles.iconWrapper} ${styles[`icon--${feature.color}`]}`}>
        <Icon aria-hidden />
      </div>
      <h3 className={styles.featureTitle}>{feature.title}</h3>
      <p className={styles.featureDescription}>{feature.description}</p>
    </div>
  );
}

export function Features() {
  const filteredFeatures = features.filter(f => f.title === 'Public Vaults');
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Collectors Love Us</h2>
          <p className={styles.subtitle}>Everything you need to turn your hobby into a legacy.</p>
        </div>
        <div className={styles.grid}>
          {filteredFeatures.map(feature => (
            <FeatureItem key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
