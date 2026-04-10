import type { Metadata } from 'next';
import Link from 'next/link';
import { CloudinaryImage } from '@/src/shared/ui/CloudinaryImage';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteFranchise } from './actions';
import styles from '../list.module.css';

export const metadata: Metadata = { title: 'Franchises' };

export default async function FranchisesPage() {
  await connection();
  const supabase = await createClient();

  const { data: franchises } = await supabase
    .from('franchises')
    .select('id, name, slug, image_url, franchise_localized_names(id)')
    .order('name');

  const hasFranchises = franchises && franchises.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Franchises</h1>
        <Link href="/admin/franchises/new" className={styles.newButton}>+ New Franchise</Link>
      </div>

      {hasFranchises
        ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th} aria-label="Cover" />
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Slug</th>
                  <th className={styles.th}>Localised Names</th>
                  <th className={styles.th} aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {franchises.map(franchise => (
                  <tr key={franchise.id} className={styles.tr}>
                    <td className={styles.td}>
                      {franchise.image_url && (
                        <CloudinaryImage
                          mode="fixed"
                          src={franchise.image_url}
                          alt={franchise.name}
                          width={40}
                          height={40}
                          style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                      )}
                    </td>
                    <td className={styles.td}>{franchise.name}</td>
                    <td className={styles.tdMuted}>{franchise.slug}</td>
                    <td className={styles.td}>
                      {Array.isArray(franchise.franchise_localized_names)
                        ? franchise.franchise_localized_names.length
                        : 0}
                    </td>
                    <td className={styles.tdActions}>
                      <Link href={`/admin/franchises/${franchise.id}/edit`} className={styles.editLink}>Edit</Link>
                      <DeleteButton
                        id={franchise.id}
                        label={franchise.name}
                        deleteAction={deleteFranchise}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        : (
            <p className={styles.empty}>
              {'No franchises yet. '}
              <Link href="/admin/franchises/new">Add one.</Link>
            </p>
          )}
    </div>
  );
}
