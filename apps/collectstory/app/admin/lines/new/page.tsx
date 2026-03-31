import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { LineForm } from '@/components/admin/LineForm';
import { createLine } from '../actions';
import styles from '../../form.module.css';

export const metadata: Metadata = { title: 'New Line' };

export default async function NewLinePage() {
  const supabase = await createClient();
  const [{ data: brands }, { data: categories }] = await Promise.all([
    supabase.from('brands').select('id, name').order('name'),
    supabase.from('categories').select('id, name').order('name'),
  ]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>New Line</h1>
      <LineForm
        action={createLine}
        brands={brands ?? []}
        categories={categories ?? []}
        submitLabel="Create Line"
      />
    </div>
  );
}
