import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteLine } from './actions';
import styles from '../list.module.css';

export const metadata: Metadata = { title: 'Lines' };

export default async function LinesPage() {
  const supabase = await createClient();
  const { data: lines } = await supabase
    .from('lines')
    .select('id, name, slug, brands(name)')
    .order('name');

  const hasLines = lines && lines.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Lines</h1>
        <Link href="/admin/lines/new" className={styles.newButton}>+ New Line</Link>
      </div>

      {hasLines
        ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Brand</th>
                  <th className={styles.th}>Slug</th>
                  <th className={styles.th} aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => {
                  const brandName = Array.isArray(line.brands)
                    ? line.brands[0]?.name
                    : (line.brands as { name: string } | undefined)?.name;
                  return (
                    <tr key={line.id} className={styles.tr}>
                      <td className={styles.td}>{line.name}</td>
                      <td className={styles.td}>{brandName ?? '—'}</td>
                      <td className={styles.tdMuted}>{line.slug}</td>
                      <td className={styles.tdActions}>
                        <Link href={`/admin/lines/${line.id}/edit`} className={styles.editLink}>Edit</Link>
                        <DeleteButton
                          id={line.id}
                          label={line.name}
                          deleteAction={deleteLine}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        : (
            <p className={styles.empty}>
              {'No lines yet. '}
              <Link href="/admin/lines/new">Add one.</Link>
            </p>
          )}
    </div>
  );
}
