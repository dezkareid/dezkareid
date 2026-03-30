import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StoreForm } from '@/components/admin/StoreForm';
import { updateStore } from '../../actions';
import styles from '../../../form.module.css';

export const metadata: Metadata = { title: 'Edit Store' };

export default async function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: store } = await supabase
    .from('stores')
    .select('id, name, url, country, city, lat, lng')
    .eq('id', id)
    .single();

  if (!store) notFound();

  const action = updateStore.bind(undefined, id);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Store</h1>
      <StoreForm
        action={action}
        defaultValues={{
          ...store,
          url: store.url ?? undefined,
          country: store.country ?? undefined,
          city: store.city ?? undefined,
          lat: store.lat ?? undefined,
          lng: store.lng ?? undefined,
        }}
        submitLabel="Save Changes"
      />
    </div>
  );
}
