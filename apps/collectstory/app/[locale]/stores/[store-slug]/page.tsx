import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAllStoreSlugs, getStoreBySlug, getStoreItems } from '@/lib/stores';
import { StoreDetailWidget } from '@/src/widgets/store-detail';

type Properties = { params: Promise<{ 'locale': string; 'store-slug': string }> };

export async function generateStaticParams() {
  const slugs = await getAllStoreSlugs();
  const parameters = slugs.map(slug => ({ 'store-slug': slug }));
  // cacheComponents requires at least one entry; use a placeholder when empty
  return parameters.length > 0 ? parameters : [{ 'store-slug': '_placeholder' }];
}

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { locale, 'store-slug': slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store || !store.visible) return {};

  const location = [store.city, store.country].filter(Boolean).join(', ');
  const title = location
    ? `${store.name} — ${location} | Collectstory`
    : `${store.name} | Collectstory`;
  const description = `Explore the collectibles catalog at ${store.name}${location ? ` in ${location}` : ''}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}/stores/${slug}`,
    },
  };
}

export default async function StoreDetailPage({ params }: Properties) {
  const { locale, 'store-slug': slug } = await params;

  const [store, t] = await Promise.all([
    getStoreBySlug(slug),
    getTranslations({ locale, namespace: 'StorePage' }),
  ]);

  if (!store || !store.visible) notFound();

  const items = await getStoreItems(store.id, slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': store.name,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': store.city ?? undefined,
      'addressCountry': store.country ?? undefined,
    },
    'url': store.url ?? undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StoreDetailWidget
        store={store}
        items={items}
        locale={locale}
        strings={{
          verified: t('verified'),
          visitStore: t('visitStore'),
          availableItems: t('availableItems'),
          noItemsListed: t('noItemsListed'),
          location: t('location'),
          showMap: t('showMap'),
          hideMap: t('hideMap'),
          reviews: t('reviews'),
          viewReviews: t('viewReviews'),
        }}
      />
    </>
  );
}
