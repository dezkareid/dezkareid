import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { VerifiedToggle } from '@/components/admin/VerifiedToggle';
import { softDeleteStore, toggleStoreVerified } from './actions';
import styles from '../list.module.css';

export const metadata: Metadata = { title: 'Stores' };

export default async function StoresPage() {
  const supabase = await createClient();
  const { data: stores } = await supabase
    .from('stores')
    .select('id, name, city, country, url, verified, visible')
    .order('name');

  const hasStores = stores && stores.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Stores</h1>
        <Link href="/admin/stores/new" className={styles.newButton}>+ New Store</Link>
      </div>

      {hasStores
        ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>City</th>
                  <th className={styles.th}>Country</th>
                  <th className={styles.th}>URL</th>
                  <th className={styles.th}>Verified</th>
                  <th className={styles.th}>Visible</th>
                  <th className={styles.th} aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {stores.map(store => (
                  <tr key={store.id} className={styles.tr}>
                    <td className={styles.td}>{store.name}</td>
                    <td className={styles.td}>{store.city ?? '—'}</td>
                    <td className={styles.td}>{store.country ?? '—'}</td>
                    <td className={styles.tdMuted}>
                      {store.url
                        ? <a href={store.url} target="_blank" rel="noopener noreferrer">{store.url}</a>
                        : '—'}
                    </td>
                    <td className={styles.td}>
                      <VerifiedToggle
                        id={store.id}
                        verified={store.verified ?? false}
                        toggleAction={toggleStoreVerified}
                      />
                    </td>
                    <td className={styles.td}>
                      {store.visible ? 'Yes' : 'Hidden'}
                    </td>
                    <td className={styles.tdActions}>
                      <Link href={`/admin/stores/${store.id}/edit`} className={styles.editLink}>Edit</Link>
                      {store.visible
                        ? (
                            <DeleteButton
                              id={store.id}
                              label={store.name}
                              deleteAction={softDeleteStore}
                            />
                          )
                        : undefined}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        : (
            <p className={styles.empty}>
              {'No stores yet. '}
              <Link href="/admin/stores/new">Add one.</Link>
            </p>
          )}
    </div>
  );
}
