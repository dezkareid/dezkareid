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
      </Card>,
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
    const element = container.firstChild as HTMLElement;
    expect(element.className).toMatch(/card--flat/);
    expect(element.className).not.toMatch(/card--raised/);
  });

  it('applies raised elevation when explicitly set', () => {
    const { container } = render(<Card elevation="raised">Content</Card>);
    expect((container.firstChild as HTMLElement).className).toMatch(/card--raised/);
  });

  it('forwards role prop to root element', () => {
    render(<Card role="article">Content</Card>);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('applies card--flat class when elevation is flat', () => {
    const { container } = render(<Card elevation="flat">Content</Card>);
    expect((container.firstChild as HTMLElement).className).toMatch(/card--flat/);
  });
});
