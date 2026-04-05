import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';
import { LocalizedNameForm } from '@/components/admin/LocalizedNameForm';
import { createLocalizedName } from '../actions';
import styles from '../../../../form.module.css';

export const metadata: Metadata = { title: 'Add Localised Name' };

export default async function NewLocalizedNamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connection();
  const supabase = await createClient();

  const { data: franchise } = await supabase
    .from('franchises')
    .select('id, name')
    .eq('id', id)
    .single();

  if (!franchise) notFound();

  const action = createLocalizedName.bind(undefined, id);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Add Localised Name</h1>
      <p style={{ marginBottom: 'var(--spacing-24)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-300)' }}>
        Franchise: <strong>{franchise.name}</strong>
      </p>
      <LocalizedNameForm
        action={action}
        cancelHref={`/admin/franchises/${id}/edit`}
        submitLabel="Add Name"
      />
    </div>
  );
}
