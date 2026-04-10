import type { Metadata } from 'next';
import Link from 'next/link';
import { CloudinaryImage } from '@/src/shared/ui/CloudinaryImage';
import { notFound, redirect, RedirectType } from 'next/navigation';
import {
  getAllFranchiseSlugs,
  getFranchiseBySlug,
  getOfficialSlugByLocalizedSlug,
} from '@/lib/franchises';
import styles from './page.module.css';

type Properties = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllFranchiseSlugs();
  const parameters = slugs.map(slug => ({ slug }));
  // cacheComponents requires at least one entry; use a placeholder when the catalog is empty
  return parameters.length > 0 ? parameters : [{ slug: '_placeholder' }];
}

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { slug } = await params;
  const franchise = await getFranchiseBySlug(slug);
  if (!franchise) return {};

  const aliases = franchise.localized_names.map(ln => ln.name).join(', ');
  const description = franchise.description
    ?? `Browse all ${franchise.name} collectibles on Collectstory.${aliases ? ` Also known as ${aliases}.` : ''}`;

  return {
    title: `${franchise.name} — Collectstory`,
    description,
    openGraph: {
      title: `${franchise.name} Collectibles — Collectstory`,
      description,
      images: [{ url: franchise.image_url, alt: franchise.name }],
      type: 'website',
    },
  };
}

export default async function FranchiseDetailPage({ params }: Properties) {
  const { slug } = await params;

  const franchise = await getFranchiseBySlug(slug);

  if (!franchise) {
    // Try to resolve as a localised slug → 301 redirect to canonical
    const officialSlug = await getOfficialSlugByLocalizedSlug(slug);
    if (officialSlug) {
      redirect(`/franchises/${officialSlug}`, RedirectType.replace);
    }
    notFound();
  }

  return (
    <div className={styles.main}>
      <Link href="/franchises" className={styles.backLink}>
        ← All Franchises
      </Link>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.coverWrap}>
          <CloudinaryImage
            src={franchise.image_url}
            alt={franchise.name}
            sizes="(max-width: 768px) 100vw, 240px"
            className={styles.coverImage}
            priority
          />
        </div>
        <div className={styles.heroMeta}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} aria-hidden="true" />
            <span className={styles.eyebrowText}>Franchise</span>
          </div>
          <h1 className={styles.franchiseName}>{franchise.name}</h1>
          {franchise.description && (
            <p className={styles.description}>{franchise.description}</p>
          )}
          {franchise.localized_names.length > 0 && (
            <div className={styles.namesSection}>
              <p className={styles.namesSectionLabel}>Also known as</p>
              <ul className={styles.namesList} aria-label="Localised names">
                {franchise.localized_names.map(ln => (
                  <li key={ln.id} className={styles.nameItem}>
                    <span className={styles.nameItemText}>{ln.name}</span>
                    <span className={styles.nameItemLocale}>{ln.locale}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <section className={styles.itemsSection}>
        <h2 className={styles.sectionTitle}>
          {franchise.items.length > 0
            ? `${franchise.items.length} ${franchise.items.length === 1 ? 'Item' : 'Items'} in the Community`
            : 'Community Collection'}
        </h2>

        {franchise.items.length > 0
          ? (
              <ul className={styles.itemsGrid} role="list">
                {franchise.items.map((item) => {
                  const href = item.username && item.collectionSlug
                    ? `/${item.username}/${item.collectionSlug}/${item.slug}`
                    : undefined;

                  const inner = (
                    <>
                      <div className={styles.itemImageWrap}>
                        {item.image_url
                          ? (
                              <CloudinaryImage
                                src={item.image_url}
                                alt={item.name}
                                sizes="(max-width: 640px) 50vw, 200px"
                                className={styles.itemImage}
                              />
                            )
                          : (
                              <div className={styles.itemImagePlaceholder} aria-hidden="true">◻</div>
                            )}
                      </div>
                      <p className={styles.itemName}>{item.name}</p>
                    </>
                  );

                  return (
                    <li key={item.id}>
                      {href
                        ? <Link href={href} className={styles.itemCard}>{inner}</Link>
                        : <div className={styles.itemCard}>{inner}</div>}
                    </li>
                  );
                })}
              </ul>
            )
          : (
              <div className={styles.emptyItems}>
                <p className={styles.emptyItemsText}>
                  No public items linked to this franchise yet.
                </p>
              </div>
            )}
      </section>
    </div>
  );
}
