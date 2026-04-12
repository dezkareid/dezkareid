import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VerifiedBadge } from './index';

describe('VerifiedBadge', () => {
  it('renders correctly', () => {
    render(<VerifiedBadge />);
    // The icon inside has an aria-label="Verified store"
    expect(screen.getByLabelText('Verified store')).toBeInTheDocument();
  });

  it('applies custom size via CSS variable', () => {
    const { container } = render(<VerifiedBadge size={20} />);
    const icon = container.querySelector('svg');
    expect(icon).toHaveStyle('--verified-badge-size: 20px');
  });

  it('applies custom className', () => {
    const { container } = render(<VerifiedBadge className="custom-badge" />);
    expect(container.firstChild).toHaveClass('custom-badge');
  });
});
