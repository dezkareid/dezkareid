import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/src/shared/lib/testing/render';
import { Hero } from './Hero';
import { NextIntlClientProvider } from 'next-intl';

// Mocking dependencies
vi.mock('@dezkareid/components/react', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  Image: ({ alt }: { alt: string }) => <img alt={alt} data-testid="image" />,
}));

vi.mock('@/components/HomeCta', () => ({
  HomeCTA: () => <div data-testid="home-cta" />,
}));

describe('Hero', () => {
  const messages = {
    Landing: {
      Hero: {
        badge: 'The Badge',
        title: 'The Title',
        description: 'The Description',
      },
    },
  };

  it('should render the hero section with translated content', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Hero />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText('The Badge')).toBeInTheDocument();
    expect(screen.getByText('The Title')).toBeInTheDocument();
    expect(screen.getByText('The Description')).toBeInTheDocument();
    expect(screen.getByTestId('home-cta')).toBeInTheDocument();
  });

  it('should render all hero images', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Hero />
      </NextIntlClientProvider>,
    );

    const images = screen.getAllByTestId('image');
    expect(images).toHaveLength(3);
  });
});
