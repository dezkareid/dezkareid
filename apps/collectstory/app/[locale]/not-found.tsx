import { getTranslations } from 'next-intl/server';
import { Link } from '@/app/i18n/navigation';
import { ErrorLayout } from '@/components/ErrorLayout/ErrorLayout';
import { Button } from '@dezkareid/components/react-server';
import React from 'react';

export default async function NotFound() {
  const t = await getTranslations('Errors.NotFound');

  const actions = (
    <Link href="/">
      <Button variant="primary">
        {t('back_to_home')}
      </Button>
    </Link>
  );

  return (
    <ErrorLayout
      title={t('title')}
      subtitle={t('subtitle')}
      description={t('description')}
      actions={actions}
    />
  );
}
