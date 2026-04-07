import type { Metadata } from 'next';
import { Hero } from '@/components/landing/Hero';
import { Stats } from '@/components/landing/Stats';
import { LatestArrivals } from '@/components/landing/LatestArrivals';
import { Features } from '@/components/landing/Features';
import { CallToAction } from '@/components/landing/CallToAction';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Collectstory — Track Your Collection',
  description:
    'Collectstory is the premier platform for serious collectors. Catalog your S.H. Figuarts, Marvel Legends, and every figure in your collection — organized by brand, line, and category.',
  openGraph: {
    title: 'Collectstory — Track Your Collection',
    description:
      'The premier platform for serious collectors. Organize every figure by brand, line, and category.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <div>
        <Hero />
        <Stats />
        <LatestArrivals />
        <Features />
        <CallToAction />
      </div>
      <Footer />
    </>
  );
}
