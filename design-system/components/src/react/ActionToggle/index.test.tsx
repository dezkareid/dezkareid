import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ActionToggle } from './index';

describe('ActionToggle', () => {
  it('renders correctly', () => {
    render(<ActionToggle aria-label="Toggle">Icon</ActionToggle>);
    expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
  });

  it('handles uncontrolled state', async () => {
    const onChange = vi.fn();
    render(<ActionToggle aria-label="Toggle" onChange={onChange}>Icon</ActionToggle>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenCalledWith(true);

    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('handles controlled state', async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ActionToggle aria-label="Toggle" active={false} onChange={onChange}>
        Icon
      </ActionToggle>,
    );
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(button);
    expect(onChange).toHaveBeenCalledWith(true);
    // Should NOT change internally because it's controlled
    expect(button).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <ActionToggle aria-label="Toggle" active={true} onChange={onChange}>
        Icon
      </ActionToggle>,
    );
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not toggle when disabled', async () => {
    const onChange = vi.fn();
    render(<ActionToggle aria-label="Toggle" disabled onChange={onChange}>Icon</ActionToggle>);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(onChange).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });
});
