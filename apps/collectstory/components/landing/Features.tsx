import { features } from '@/lib/mock-data';
import styles from './Features.module.css';

export function Features() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Collectors Love Us</h2>
          <p className={styles.subtitle}>Everything you need to turn your hobby into a legacy.</p>
        </div>
        <div className={styles.grid}>
          {features.map(feature => (
            <div key={feature.title} className={styles.feature}>
              <div className={`${styles.iconWrapper} ${styles[`icon--${feature.color}`]}`}>
                <span className="material-symbols-outlined">{feature.icon}</span>
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
