import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';
import { FranchiseForm } from '@/components/admin/FranchiseForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { updateFranchise } from '../../actions';
import { deleteLocalizedName } from '../localized-names/actions';
import styles from '../../../form.module.css';
import listStyles from '../../../list.module.css';

export const metadata: Metadata = { title: 'Edit Franchise' };

export default async function EditFranchisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connection();
  const supabase = await createClient();

  const { data: franchise } = await supabase
    .from('franchises')
    .select('id, name, slug, description, image_url, franchise_localized_names(id, locale, name, slug)')
    .eq('id', id)
    .single();

  if (!franchise) notFound();

  const action = updateFranchise.bind(undefined, id);
  const localizedNames = Array.isArray(franchise.franchise_localized_names)
    ? franchise.franchise_localized_names
    : [];

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Franchise</h1>
      <FranchiseForm
        action={action}
        cancelHref="/admin/franchises"
        defaultName={franchise.name}
        defaultSlug={franchise.slug}
        defaultDescription={franchise.description ?? undefined}
        defaultImageUrl={franchise.image_url}
        submitLabel="Save Changes"
      />

      <section style={{ marginTop: 'var(--spacing-48)' }}>
        <div className={listStyles.pageHeader}>
          <h2 className={listStyles.heading} style={{ fontSize: 'var(--font-size-500)' }}>
            Localised Names
          </h2>
          <Link href={`/admin/franchises/${id}/localized-names/new`} className={listStyles.newButton}>
            + Add Name
          </Link>
        </div>

        {localizedNames.length > 0
          ? (
              <table className={listStyles.table}>
                <thead>
                  <tr>
                    <th className={listStyles.th}>Locale</th>
                    <th className={listStyles.th}>Name</th>
                    <th className={listStyles.th}>Slug</th>
                    <th className={listStyles.th} aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {localizedNames.map((ln: { id: string; locale: string; name: string; slug: string }) => (
                    <tr key={ln.id} className={listStyles.tr}>
                      <td className={listStyles.tdMuted}>{ln.locale}</td>
                      <td className={listStyles.td}>{ln.name}</td>
                      <td className={listStyles.tdMuted}>{ln.slug}</td>
                      <td className={listStyles.tdActions}>
                        <Link
                          href={`/admin/franchises/${id}/localized-names/${ln.id}/edit`}
                          className={listStyles.editLink}
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          id={ln.id}
                          label={ln.name}
                          deleteAction={deleteLocalizedName}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          : (
              <p className={listStyles.empty}>
                {'No localised names yet. '}
                <Link href={`/admin/franchises/${id}/localized-names/new`}>Add one.</Link>
              </p>
            )}
      </section>
    </div>
  );
}
