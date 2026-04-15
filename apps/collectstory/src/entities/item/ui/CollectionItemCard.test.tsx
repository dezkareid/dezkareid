import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/src/shared/lib/testing/render';
import { CollectionItemCard } from './CollectionItemCard';

// Mocking react to handle experimental/canary features
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    ViewTransition: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mocking @dezkareid/components to avoid issues with server components in jsdom
vi.mock('@dezkareid/components/react-server', () => ({
  Tag: ({ children }: { children: React.ReactNode }) => <span data-testid="tag">{children}</span>,
  // eslint-disable-next-line @next/next/no-img-element
  Image: ({ alt }: { alt: string }) => <img alt={alt} data-testid="image" />,
}));

describe('CollectionItemCard', () => {
  const defaultProps = {
    slug: 'test-item',
    name: 'Test Item',
    imageUrl: 'https://example.com/image.jpg',
    brand: 'Test Brand',
    line: 'Test Line',
    category: 'Test Category',
    description: 'Test Description',
    dateAcquired: '2023-01-01T12:00:00Z',
  };

  it('should render the item name and description', () => {
    render(<CollectionItemCard {...defaultProps} />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render tags when provided', () => {
    render(<CollectionItemCard {...defaultProps} />);

    const tags = screen.getAllByTestId('tag');
    expect(tags).toHaveLength(3);
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('Test Line')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('should render a placeholder when no image is provided', () => {
    render(<CollectionItemCard {...defaultProps} imageUrl={undefined} />);

    expect(screen.queryByTestId('image')).not.toBeInTheDocument();
    expect(screen.getByText('◻')).toBeInTheDocument();
  });

  it('should render the formatted date', () => {
    render(<CollectionItemCard {...defaultProps} />);

    // Jan 1, 2023
    expect(screen.getByText(/Jan 1, 2023/)).toBeInTheDocument();
  });

  const visibilityCases = [
    { prop: 'brand', value: undefined, label: 'brand' },
    { prop: 'line', value: undefined, label: 'line' },
    { prop: 'category', value: undefined, label: 'category' },
    { prop: 'description', value: undefined, label: 'description' },
    { prop: 'dateAcquired', value: undefined, label: 'date' },
  ];

  it.each(visibilityCases)(
    'should not render %s when it is missing',
    ({ prop, value }) => {
      const properties = { ...defaultProps, [prop]: value };
      render(<CollectionItemCard {...properties} />);

      if (prop === 'description') {
        expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
      }
      else if (prop === 'dateAcquired') {
        expect(screen.queryByText(/Acquired/)).not.toBeInTheDocument();
      }
      else {
        // For tags, we check if the specific text is missing
        expect(screen.queryByText(`Test ${prop.charAt(0).toUpperCase() + prop.slice(1)}`)).not.toBeInTheDocument();
      }
    },
  );
});
