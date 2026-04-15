import { describe, it, expect } from 'vitest';
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
});
