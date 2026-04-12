import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumb } from './index';

describe('Breadcrumb', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Current Item' },
  ];

  it('renders correctly with multiple items', () => {
    render(<Breadcrumb items={items} />);

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Current Item')).toBeInTheDocument();
  });

  it('renders links for items with href (except the last one)', () => {
    render(<Breadcrumb items={items} />);

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');

    const productsLink = screen.getByRole('link', { name: 'Products' });
    expect(productsLink).toHaveAttribute('href', '/products');

    // Last item should not be a link even if it had an href (though our type says href is optional)
    const currentItem = screen.getByText('Current Item');
    expect(currentItem.tagName).not.toBe('A');
  });

  it('applies custom className', () => {
    render(<Breadcrumb items={items} className="custom-class" />);
    expect(screen.getByRole('navigation')).toHaveClass('custom-class');
  });
});
