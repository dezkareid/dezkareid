import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/landing/Hero';
import { Metrics, MetricsSkeleton } from '@/components/landing/Metrics';
import { LatestArrivals } from '@/components/landing/LatestArrivals';
import { Features } from '@/components/landing/Features';
import { CallToAction } from '@/components/landing/CallToAction';
import { Footer } from '@/components/landing/Footer';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('HomePage.metadata');
  const ogImage = 'https://res.cloudinary.com/ddyovtxd2/image/upload/v1776197303/BBB66E34-9FCD-4BC5-A6B0-F0E2375DFE33_1_105_c_f7nhpy.jpg';

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      title: t('title'),
      description: t('description'),
      images: [ogImage],
    },
  };
}

export default function HomePage() {
  return (
    <>
      <div>
        <Hero />
        <Suspense fallback={<MetricsSkeleton />}>
          <Metrics />
        </Suspense>
        <LatestArrivals />
        <Features />
        <CallToAction />
      </div>
      <Footer />
    </>
  );
}
