import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';
import { LineForm } from '@/components/admin/LineForm';
import { updateLine } from '../../actions';
import styles from '../../../form.module.css';

export const metadata: Metadata = { title: 'Edit Line' };

export default async function EditLinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connection();
  const supabase = await createClient();

  const [{ data: line }, { data: brands }, { data: categories }] = await Promise.all([
    supabase.from('lines').select('id, name, brand_id, category_id, image_url, variants').eq('id', id).single(),
    supabase.from('brands').select('id, name').order('name'),
    supabase.from('categories').select('id, name').order('name'),
  ]);

  if (!line) notFound();

  const action = updateLine.bind(undefined, id);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Line</h1>
      <LineForm
        action={action}
        brands={brands ?? []}
        categories={categories ?? []}
        defaultName={line.name}
        defaultBrandId={line.brand_id}
        defaultCategoryId={line.category_id ?? undefined}
        defaultImageUrl={line.image_url ?? undefined}
        defaultVariants={Array.isArray(line.variants) ? (line.variants as { value: string; display_name: string }[]) : []}
        submitLabel="Save Changes"
      />
    </div>
  );
}
