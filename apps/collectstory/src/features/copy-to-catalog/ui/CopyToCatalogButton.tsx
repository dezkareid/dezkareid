import Link from 'next/link';
import { getSessionAndRole } from '@/lib/auth/role';
import styles from './CopyToCatalogButton.module.css';

interface CopyToCatalogButtonProperties {
  itemId: string;
  catalogItemId?: string | null;
}

export async function CopyToCatalogButton({ itemId, catalogItemId }: CopyToCatalogButtonProperties) {
  const session = await getSessionAndRole();
  if (!session || session.role !== 'admin') return null;

  return (
    <div className={styles['copy-to-catalog']}>
      {catalogItemId && (
        <p className={styles['copy-to-catalog__warning']} role="status">
          Already linked to a catalog entry.
        </p>
      )}
      <Link
        href={`/admin/catalog-items/new?source_item_id=${itemId}`}
        className={styles['copy-to-catalog__link']}
      >
        Copy to Catalog
      </Link>
    </div>
  );
}
