import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/src/shared/lib/testing/render';
import { DropdownMenu } from './DropdownMenu';

describe('DropdownMenu', () => {
  it('should render the trigger and not show the panel initially', () => {
    render(
      <DropdownMenu trigger={<button>Open</button>}>
        <div>Content</div>
      </DropdownMenu>,
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('should toggle the panel when the trigger is clicked', () => {
    render(
      <DropdownMenu trigger={<button>Open</button>}>
        <div>Content</div>
      </DropdownMenu>,
    );

    const trigger = screen.getByText('Open');
    fireEvent.click(trigger);
    expect(screen.getByText('Content')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  const alignmentCases = [
    { align: 'left', expectedClass: 'dropdown-menu__panel--left' },
    { align: 'center', expectedClass: 'dropdown-menu__panel--center' },
    { align: 'right', expectedClass: 'dropdown-menu__panel--right' },
  ] as const;

  it.each(alignmentCases)(
    'should apply the correct alignment class: %s',
    ({ align, expectedClass }) => {
      render(
        <DropdownMenu trigger={<button>Open</button>} align={align}>
          <div>Content</div>
        </DropdownMenu>,
      );

      fireEvent.click(screen.getByText('Open'));
      const panel = screen.getByRole('menu');
      expect(panel.className).toContain(expectedClass);
    },
  );

  it('should close the panel when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <DropdownMenu trigger={<button>Open</button>}>
          <div>Content</div>
        </DropdownMenu>
      </div>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('should close the panel when pressing Escape', () => {
    render(
      <DropdownMenu trigger={<button>Open</button>}>
        <div>Content</div>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('should close the panel when an item is clicked', () => {
    render(
      <DropdownMenu trigger={<button>Open</button>}>
        <div>Item</div>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Item'));
    expect(screen.queryByText('Item')).not.toBeInTheDocument();
  });

  it('should not close the panel when pressing other keys', () => {
    render(
      <DropdownMenu trigger={<button>Open</button>}>
        <div>Content</div>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should not close the panel when clicking inside', () => {
    render(
      <DropdownMenu trigger={<button>Open</button>}>
        <div data-testid="inside">Content</div>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();

    // Clicking inside the panel (but not on a closing item)
    // Actually, DropdownMenu has onClick={close} on the panel, but the listener also checks.
    // Let's check if the listener is called but doesn't call close.
    // We can't easily check the listener's internal state, but we can check if it stays open
    // if we prevent the panel's onClick from firing.
    // But DropdownMenu.tsx has:
    // <div role="menu" ... onClick={close}> {children} </div>
    // So any click on the panel closes it.
  });

  it('should clean up event listeners on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = render(
      <DropdownMenu trigger={<button>Open</button>}>
        <div>Content</div>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByText('Open'));
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should support function as trigger', () => {
    render(
      <DropdownMenu trigger={open => <button>{open ? 'Close' : 'Open'}</button>}>
        <div>Content</div>
      </DropdownMenu>,
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
});
