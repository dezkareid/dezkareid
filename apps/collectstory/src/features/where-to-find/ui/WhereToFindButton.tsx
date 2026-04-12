'use client';

import { useState } from 'react';
import { Button, Modal } from '@dezkareid/components/react';
import { useAnalytics } from '@/src/shared/lib/analytics/useAnalytics';
import { WhereToFindContent } from './WhereToFindContent';
import type { Store, ItemLink } from '@/app/[username]/[collectionSlug]/actions';
import styles from './WhereToFind.module.css';

interface WhereToFindButtonProperties {
  itemId: string;
  isOwner: boolean;
  linkedStores: Store[];
  initialLinks: ItemLink[];
}

export function WhereToFindButton({
  itemId,
  isOwner,
  linkedStores,
  initialLinks,
}: WhereToFindButtonProperties) {
  const [open, setOpen] = useState(false);
  const { track } = useAnalytics();

  const handleOpen = () => {
    track({
      action: 'cta_click',
      category: 'interaction',
      label: 'where_to_find',
    });
    setOpen(true);
  };

  return (
    <>
      <Button
        variant="secondary"
        className={styles['where-to-find__trigger']}
        onClick={handleOpen}
      >
        Where to find
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Where to find it"
      >
        <WhereToFindContent
          itemId={itemId}
          isOwner={isOwner}
          linkedStores={linkedStores}
          initialLinks={initialLinks}
        />
      </Modal>
    </>
  );
}
