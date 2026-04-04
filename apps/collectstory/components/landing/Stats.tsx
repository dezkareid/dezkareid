import { statsData } from '@/lib/mock-data';
import styles from './Stats.module.css';

export function Stats() {
  return (
    <section className={styles.stats}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {statsData.map(stat => (
            <div key={stat.label} className={styles.stat}>
              <p className={styles.value}>{stat.value}</p>
              <p className={styles.label}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
