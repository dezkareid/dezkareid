import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getSessionAndRole } from '@/lib/auth/role';
import styles from './CopyToCatalogButton.module.css';

interface CopyToCatalogButtonProperties {
  itemId: string;
  catalogItemId?: string | null;
}

export async function CopyToCatalogButton({ itemId, catalogItemId }: CopyToCatalogButtonProperties) {
  const session = await getSessionAndRole();
  if (!session || session.role !== 'admin') return null;

  const t = await getTranslations('Common.profile.item.admin');

  return (
    <div className={styles['copy-to-catalog']}>
      {catalogItemId && (
        <p className={styles['copy-to-catalog__warning']} role="status">
          {t('already_linked')}
        </p>
      )}
      <Link
        href={`/admin/catalog-items/new?source_item_id=${itemId}`}
        className={styles['copy-to-catalog__link']}
      >
        {t('copy_to_catalog')}
      </Link>
    </div>
  );
}
