import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LikeButton } from './index';

describe('LikeButton', () => {
  it('renders correctly', () => {
    render(<LikeButton aria-label="Like" />);
    expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument();
  });

  it('shows unliked state by default', () => {
    render(<LikeButton aria-label="Like" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows liked state when active prop is true', () => {
    render(<LikeButton aria-label="Like" active={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('triggers onChange when clicked', async () => {
    const onChange = vi.fn();
    render(<LikeButton aria-label="Like" onChange={onChange} />);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', async () => {
    const onChange = vi.fn();
    render(<LikeButton aria-label="Like" disabled onChange={onChange} />);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(onChange).not.toHaveBeenCalled();
  });
});
