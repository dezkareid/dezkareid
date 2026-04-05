import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Admin Dashboard' };

const resources = [
  { href: '/admin/brands', label: 'Brands', description: 'Manage collectible brands' },
  { href: '/admin/lines', label: 'Lines', description: 'Manage product lines by brand' },
  { href: '/admin/categories', label: 'Categories', description: 'Manage collection categories' },
  { href: '/admin/stores', label: 'Stores', description: 'Manage store directory' },
  { href: '/admin/franchises', label: 'Franchises', description: 'Manage IP franchise catalog' },
];

export default function AdminPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Dashboard</h1>
      <div className={styles.grid}>
        {resources.map(r => (
          <Link key={r.href} href={r.href} className={styles.card}>
            <span className={styles.cardLabel}>{r.label}</span>
            <span className={styles.cardDescription}>{r.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
