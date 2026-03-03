import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './index';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders arbitrary children', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Body</p>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('applies raised elevation by default', () => {
    const { container } = render(<Card>Content</Card>);
    expect((container.firstChild as HTMLElement).className).toMatch(/card--raised/);
  });

  it('applies flat elevation when set', () => {
    const { container } = render(<Card elevation="flat">Content</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/card--flat/);
    expect(el.className).not.toMatch(/card--raised/);
  });

  it('applies raised elevation when explicitly set', () => {
    const { container } = render(<Card elevation="raised">Content</Card>);
    expect((container.firstChild as HTMLElement).className).toMatch(/card--raised/);
  });
});
