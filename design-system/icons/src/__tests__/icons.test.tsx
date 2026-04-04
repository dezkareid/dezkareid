// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArrowRight } from '../react/ArrowRight.js';
import type { IconName } from '../icons.js';

describe('Icon accessibility', () => {
  it('renders with aria-hidden when no label is provided', () => {
    const { container } = render(<ArrowRight />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('aria-label')).toBeNull();
    expect(svg?.getAttribute('role')).toBeNull();
  });

  it('renders with aria-label and role="img" when label is provided', () => {
    const { container } = render(<ArrowRight label="Go forward" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('aria-hidden')).toBeNull();
    expect(svg?.getAttribute('aria-label')).toBe('Go forward');
    expect(svg?.getAttribute('role')).toBe('img');
  });
});

describe('Icon sizing', () => {
  it('applies --icon-size CSS custom property to width and height', () => {
    const { container } = render(<ArrowRight style={{ '--icon-size': '32px' } as React.CSSProperties} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    // The inline style should contain the var(--icon-size, 1em) references
    const style = svg?.getAttribute('style') ?? '';
    expect(style).toContain('var(--icon-size, 1em)');
  });
});

describe('IconName type', () => {
  it('includes all expected icon names', () => {
    // Compile-time check: these strings must be valid IconName values
    const names: IconName[] = [
      'arrow-right',
      'arrow-left',
      'arrow-up',
      'arrow-down',
      'chevron-right',
      'chevron-left',
      'chevron-up',
      'chevron-down',
      'close',
      'check',
      'plus',
      'minus',
      'edit',
      'trash',
      'search',
      'filter',
      'info',
      'warning',
      'error',
      'success',
      'play',
      'pause',
      'stop',
      'menu',
    ];
    expect(names).toHaveLength(24);
  });
});
