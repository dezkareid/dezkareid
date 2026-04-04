import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteCategory } from './actions';
import styles from '../list.module.css';

export const metadata: Metadata = { title: 'Categories' };

export default async function CategoriesPage() {
  await connection();
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  const hasCategories = categories && categories.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Categories</h1>
        <Link href="/admin/categories/new" className={styles.newButton}>+ New Category</Link>
      </div>

      {hasCategories
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
                {categories.map(category => (
                  <tr key={category.id} className={styles.tr}>
                    <td className={styles.td}>{category.name}</td>
                    <td className={styles.tdMuted}>{category.slug}</td>
                    <td className={styles.tdActions}>
                      <Link href={`/admin/categories/${category.id}/edit`} className={styles.editLink}>Edit</Link>
                      <DeleteButton
                        id={category.id}
                        label={category.name}
                        deleteAction={deleteCategory}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        : (
            <p className={styles.empty}>
              {'No categories yet. '}
              <Link href="/admin/categories/new">Add one.</Link>
            </p>
          )}
    </div>
  );
}
