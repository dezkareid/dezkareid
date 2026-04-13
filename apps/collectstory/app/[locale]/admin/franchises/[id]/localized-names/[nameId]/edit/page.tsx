import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';
import { LocalizedNameForm } from '@/components/admin/LocalizedNameForm';
import { updateLocalizedName } from '../../actions';
import styles from '../../../../../form.module.css';

export const metadata: Metadata = { title: 'Edit Localised Name' };

export default async function EditLocalizedNamePage({
  params,
}: {
  params: Promise<{ id: string; nameId: string }>;
}) {
  const { id, nameId } = await params;
  await connection();
  const supabase = await createClient();

  const { data: record } = await supabase
    .from('franchise_localized_names')
    .select('id, locale, name, franchise_id')
    .eq('id', nameId)
    .single();

  if (!record || record.franchise_id !== id) notFound();

  const action = updateLocalizedName.bind(undefined, nameId, id);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Localised Name</h1>
      <LocalizedNameForm
        action={action}
        cancelHref={`/admin/franchises/${id}/edit`}
        defaultLocale={record.locale}
        defaultName={record.name}
        submitLabel="Save Changes"
      />
    </div>
  );
}
