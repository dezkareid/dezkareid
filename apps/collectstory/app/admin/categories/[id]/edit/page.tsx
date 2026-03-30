import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { NameOnlyForm } from '@/components/admin/NameOnlyForm';
import { updateCategory } from '../../actions';
import styles from '../../../form.module.css';

export const metadata: Metadata = { title: 'Edit Category' };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('id, name')
    .eq('id', id)
    .single();

  if (!category) notFound();

  const action = updateCategory.bind(undefined, id);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Category</h1>
      <NameOnlyForm action={action} cancelHref="/admin/categories" defaultName={category.name} submitLabel="Save Changes" />
    </div>
  );
}
