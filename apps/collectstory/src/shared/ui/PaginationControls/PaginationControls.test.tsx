import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaginationControls } from './PaginationControls';

afterEach(cleanup);

describe('PaginationControls', () => {
  // ─── Given: only one page ──────────────────────────────────────────────────

  describe('Given total pages is 1', () => {
    it('renders nothing', () => {
      const { container } = render(
        <PaginationControls page={1} totalPages={1} onPageChange={vi.fn()} />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  // ─── Given: multiple pages ─────────────────────────────────────────────────

  describe('Given multiple pages exist', () => {
    it('renders both Prev and Next buttons', () => {
      render(<PaginationControls page={2} totalPages={5} onPageChange={vi.fn()} />);
      expect(screen.getByRole('button', { name: /previous page/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /next page/i })).toBeDefined();
    });

    it('shows current page and total pages', () => {
      render(<PaginationControls page={3} totalPages={7} onPageChange={vi.fn()} />);
      expect(screen.getByText('3')).toBeDefined();
      expect(screen.getByText('7')).toBeDefined();
    });
  });

  // ─── Given: on the first page ─────────────────────────────────────────────

  describe('Given on the first page', () => {
    it('disables the Prev button', () => {
      render(<PaginationControls page={1} totalPages={3} onPageChange={vi.fn()} />);
      const previous = screen.getByRole('button', { name: /previous page/i });
      expect((previous as HTMLButtonElement).disabled).toBe(true);
    });

    it('does not disable the Next button', () => {
      render(<PaginationControls page={1} totalPages={3} onPageChange={vi.fn()} />);
      const next = screen.getByRole('button', { name: /next page/i });
      expect((next as HTMLButtonElement).disabled).toBe(false);
    });
  });

  // ─── Given: on the last page ──────────────────────────────────────────────

  describe('Given on the last page', () => {
    it('disables the Next button', () => {
      render(<PaginationControls page={5} totalPages={5} onPageChange={vi.fn()} />);
      const next = screen.getByRole('button', { name: /next page/i });
      expect((next as HTMLButtonElement).disabled).toBe(true);
    });

    it('does not disable the Prev button', () => {
      render(<PaginationControls page={5} totalPages={5} onPageChange={vi.fn()} />);
      const previous = screen.getByRole('button', { name: /previous page/i });
      expect((previous as HTMLButtonElement).disabled).toBe(false);
    });
  });

  // ─── When: user clicks Next ────────────────────────────────────────────────

  describe('When the user clicks Next', () => {
    it('calls onPageChange with page + 1', async () => {
      const onPageChange = vi.fn();
      render(<PaginationControls page={2} totalPages={5} onPageChange={onPageChange} />);
      await userEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPageChange).toHaveBeenCalledWith(3);
    });
  });

  // ─── When: user clicks Prev ────────────────────────────────────────────────

  describe('When the user clicks Prev', () => {
    it('calls onPageChange with page - 1', async () => {
      const onPageChange = vi.fn();
      render(<PaginationControls page={4} totalPages={5} onPageChange={onPageChange} />);
      await userEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPageChange).toHaveBeenCalledWith(3);
    });
  });

  // ─── When: user clicks a disabled button ──────────────────────────────────

  describe('When the user clicks a disabled Prev button', () => {
    it('does not call onPageChange', async () => {
      const onPageChange = vi.fn();
      render(<PaginationControls page={1} totalPages={5} onPageChange={onPageChange} />);
      await userEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  // ─── Accessibility ─────────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('has aria-label on the nav', () => {
      render(<PaginationControls page={2} totalPages={5} onPageChange={vi.fn()} />);
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeDefined();
    });

    it('marks current page with aria-current', () => {
      render(<PaginationControls page={3} totalPages={5} onPageChange={vi.fn()} />);
      expect(screen.getByRole('navigation').querySelector('[aria-current="page"]')).not.toBeNull();
    });
  });
});
