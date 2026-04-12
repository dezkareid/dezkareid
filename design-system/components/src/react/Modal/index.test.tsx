import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Modal } from './index';

describe('Modal', () => {
  beforeEach(() => {
    // Mock dialog methods since jsdom doesn't implement them
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.open = false;
    });
  });

  it('renders when open', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );

    await userEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes dialog when open becomes false', () => {
    const { rerender } = render(
      <Modal open={true} onClose={() => {}} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );

    rerender(
      <Modal open={false} onClose={() => {}} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });
});
