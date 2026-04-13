import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/landing/Hero';
import { LatestArrivals } from '@/components/landing/LatestArrivals';
import { Features } from '@/components/landing/Features';
import { CallToAction } from '@/components/landing/CallToAction';
import { Footer } from '@/components/landing/Footer';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('HomePage.metadata');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  };
}

export default function HomePage() {
  return (
    <>
      <div>
        <Hero />
        <LatestArrivals />
        <Features />
        <CallToAction />
      </div>
      <Footer />
    </>
  );
}
