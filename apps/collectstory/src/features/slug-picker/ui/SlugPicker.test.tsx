import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SlugPicker } from './SlugPicker';
import type { SlugOption } from '../model/useSlugDisambiguation';

const OPTIONS: SlugOption[] = [
  { priority: 1, slug: 'barbie-masters-of-the-universe', label: 'name + line' },
  { priority: 2, slug: 'barbie-red', label: 'name + variant' },
  { priority: 7, slug: 'barbie-ab12c', label: 'name + ID' },
];

const SINGLE_OPTION: SlugOption[] = [
  { priority: 7, slug: 'barbie-xk9z1', label: 'name + ID' },
];

const DEFAULT_LEGEND = 'Choose a unique URL for your item:';
const DEFAULT_HINT = 'Or edit the name above to use a different one.';

describe('SlugPicker', () => {
  afterEach(cleanup);

  // ─── rendering ─────────────────────────────────────────────────────────────

  it.each([
    ['renders all options when 3 are provided', OPTIONS, 3],
    ['renders single option', SINGLE_OPTION, 1],
  ])('%s', (_label, options, expectedCount) => {
    render(<SlugPicker options={options} selectedSlug={null} onSelect={vi.fn()} legend={DEFAULT_LEGEND} hint={DEFAULT_HINT} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(expectedCount);
  });

  it('renders each slug inside a <code> element', () => {
    render(<SlugPicker options={OPTIONS} selectedSlug={null} onSelect={vi.fn()} legend={DEFAULT_LEGEND} hint={DEFAULT_HINT} />);
    for (const option of OPTIONS) {
      const code = screen.getByText(option.slug);
      expect(code.tagName.toLowerCase()).toBe('code');
    }
  });

  it('renders option labels alongside slugs', () => {
    render(<SlugPicker options={OPTIONS} selectedSlug={null} onSelect={vi.fn()} legend={DEFAULT_LEGEND} hint={DEFAULT_HINT} />);
    expect(screen.getByText('name + line')).toBeInTheDocument();
    expect(screen.getByText('name + variant')).toBeInTheDocument();
    expect(screen.getByText('name + ID')).toBeInTheDocument();
  });

  it('renders a legend with the disambiguation prompt', () => {
    render(<SlugPicker options={OPTIONS} selectedSlug={null} onSelect={vi.fn()} legend={DEFAULT_LEGEND} hint={DEFAULT_HINT} />);
    expect(screen.getByText(DEFAULT_LEGEND)).toBeInTheDocument();
  });

  it('renders inside a <fieldset>', () => {
    const { container } = render(<SlugPicker options={OPTIONS} selectedSlug={null} onSelect={vi.fn()} legend={DEFAULT_LEGEND} hint={DEFAULT_HINT} />);
    expect(container.querySelector('fieldset')).not.toBeNull();
  });

  // ─── selection ─────────────────────────────────────────────────────────────

  it('marks the selectedSlug radio as checked', () => {
    render(<SlugPicker options={OPTIONS} selectedSlug="barbie-red" onSelect={vi.fn()} legend={DEFAULT_LEGEND} hint={DEFAULT_HINT} />);
    const checkedRadio = screen.getByRole('radio', { checked: true });
    expect(checkedRadio).toBeChecked();
    expect(checkedRadio).toHaveAttribute('value', 'barbie-red');
  });

  it('marks no radio as checked when selectedSlug is null', () => {
    render(<SlugPicker options={OPTIONS} selectedSlug={null} onSelect={vi.fn()} legend={DEFAULT_LEGEND} hint={DEFAULT_HINT} />);
    const radios = screen.getAllByRole('radio');
    for (const radio of radios) {
      expect(radio).not.toBeChecked();
    }
  });

  it('calls onSelect with the slug when a radio is clicked', async () => {
    const onSelect = vi.fn();
    render(<SlugPicker options={OPTIONS} selectedSlug={null} onSelect={onSelect} legend={DEFAULT_LEGEND} hint={DEFAULT_HINT} />);

    await userEvent.click(screen.getByRole('radio', { name: /barbie-red/i }));

    expect(onSelect).toHaveBeenCalledWith('barbie-red');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('calls onSelect with correct slug for each option', async () => {
    for (const option of OPTIONS) {
      const onSelect = vi.fn();
      render(<SlugPicker options={OPTIONS} selectedSlug={null} onSelect={onSelect} legend={DEFAULT_LEGEND} hint={DEFAULT_HINT} />);
      await userEvent.click(screen.getByRole('radio', { name: new RegExp(option.slug, 'i') }));
      expect(onSelect).toHaveBeenCalledWith(option.slug);
      cleanup();
    }
  });

  // ─── keyboard navigation ───────────────────────────────────────────────────

  it('is keyboard-navigable — Tab key moves focus to the first radio', async () => {
    render(<SlugPicker options={OPTIONS} selectedSlug={null} onSelect={vi.fn()} legend={DEFAULT_LEGEND} hint={DEFAULT_HINT} />);
    await userEvent.tab();
    const firstRadio = screen.getAllByRole('radio')[0];
    expect(firstRadio).toHaveFocus();
  });
});
