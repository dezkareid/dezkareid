import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { NameOnlyForm } from '@/components/admin/NameOnlyForm';
import { updateBrand } from '../../actions';
import styles from '../../../form.module.css';

export const metadata: Metadata = { title: 'Edit Brand' };

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from('brands')
    .select('id, name')
    .eq('id', id)
    .single();

  if (!brand) notFound();

  const action = updateBrand.bind(undefined, id);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Brand</h1>
      <NameOnlyForm action={action} cancelHref="/admin/brands" defaultName={brand.name} submitLabel="Save Changes" />
    </div>
  );
}
