import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteBrand } from './actions';
import styles from '../list.module.css';

export const metadata: Metadata = { title: 'Brands' };

export default async function BrandsPage() {
  const supabase = await createClient();
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, slug')
    .order('name');

  const hasBrands = brands && brands.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Brands</h1>
        <Link href="/admin/brands/new" className={styles.newButton}>+ New Brand</Link>
      </div>

      {hasBrands
        ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Slug</th>
                  <th className={styles.th} aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {brands.map(brand => (
                  <tr key={brand.id} className={styles.tr}>
                    <td className={styles.td}>{brand.name}</td>
                    <td className={styles.tdMuted}>{brand.slug}</td>
                    <td className={styles.tdActions}>
                      <Link href={`/admin/brands/${brand.id}/edit`} className={styles.editLink}>Edit</Link>
                      <DeleteButton
                        id={brand.id}
                        label={brand.name}
                        deleteAction={deleteBrand}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        : (
            <p className={styles.empty}>
              {'No brands yet. '}
              <Link href="/admin/brands/new">Add one.</Link>
            </p>
          )}
    </div>
  );
}
