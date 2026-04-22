'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@dezkareid/components/react';
import { createClient } from '@/lib/supabase/client';
import { useAnalytics } from '@/src/shared/lib/analytics/useAnalytics';
import type { PublicItem, PublicItemDetail } from '@/lib/collections';
import styles from './IHaveThisButton.module.css';
import { CopyItemModal } from './CopyItemModal';

type Properties = {
  item: PublicItem | PublicItemDetail;
};

export function IHaveThisButton({ item }: Properties) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { track } = useAnalytics();
  const t = useTranslations('Common.profile.item.actions');

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    track({
      action: 'cta_click',
      category: 'interaction',
      label: 'copy_item',
    });

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?origin=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={styles.button}
        onClick={handleClick}
      >
        <span className={styles.icon}>+</span>
        {t('i_have_this')}
      </Button>
      {isModalOpen && (
        <CopyItemModal
          item={item}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
