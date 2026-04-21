'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/app/i18n/navigation';
import { ErrorLayout } from '@/components/ErrorLayout/ErrorLayout';
import { Button } from '@dezkareid/components/react';
import { ReportProblemButton } from '@/src/widgets/report-problem/ui/ReportProblemButton';
import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Errors.ServerError');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const actions = (
    <>
      <Button variant="primary" onClick={() => reset()}>
        {t('retry')}
      </Button>
      <Link href="/">
        <Button variant="secondary">
          {t('back_to_home')}
        </Button>
      </Link>
      <ReportProblemButton />
    </>
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
