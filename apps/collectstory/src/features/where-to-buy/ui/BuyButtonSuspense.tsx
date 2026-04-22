import { Suspense } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { BuyButton } from './BuyButton';

interface BuyButtonSuspenseProperties {
  catalogItemId: string;
  locale: string;
  className?: string;
}

async function BuyButtonLoader({ catalogItemId, locale, className }: BuyButtonSuspenseProperties) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('catalog_items')
    .select('slug')
    .eq('id', catalogItemId)
    .single();

  if (!data?.slug) return null;

  return <BuyButton catalogSlug={data.slug} locale={locale} className={className} />;
}

export function BuyButtonSuspense(properties: BuyButtonSuspenseProperties) {
  return (
    <Suspense fallback={null}>
      <BuyButtonLoader {...properties} />
    </Suspense>
  );
}
