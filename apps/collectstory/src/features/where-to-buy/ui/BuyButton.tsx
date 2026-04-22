'use client';

import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import { Link } from '@dezkareid/components/react';

interface BuyButtonProperties {
  catalogSlug: string;
  locale: string;
  className?: string;
}

export function BuyButton({ catalogSlug, locale, className }: BuyButtonProperties) {
  const t = useTranslations('Catalog');

  return (
    <Link
      component={NextLink}
      href={`/${locale}/catalog/${catalogSlug}/stores`}
      variant="primary"
      size="sm"
      className={className}
    >
      {t('buy_button')}
    </Link>
  );
}
