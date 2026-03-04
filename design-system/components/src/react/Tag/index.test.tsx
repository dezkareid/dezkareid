import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tag } from './index';

describe('Tag', () => {
  it('renders children content', () => {
    render(<Tag>Label</Tag>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('renders arbitrary children (elements)', () => {
    render(<Tag><strong>Bold label</strong></Tag>);
    expect(screen.getByText('Bold label')).toBeInTheDocument();
  });

  it('renders default variant', () => {
    render(<Tag variant="default">Default</Tag>);
    expect(screen.getByText('Default').className).toMatch(/tag--default/);
  });

  it('renders success variant', () => {
    render(<Tag variant="success">Success</Tag>);
    expect(screen.getByText('Success').className).toMatch(/tag--success/);
  });

  it('renders danger variant', () => {
    render(<Tag variant="danger">Danger</Tag>);
    expect(screen.getByText('Danger').className).toMatch(/tag--danger/);
  });

  it('defaults to default variant when no variant is provided', () => {
    render(<Tag>No variant</Tag>);
    expect(screen.getByText('No variant').className).toMatch(/tag--default/);
  });
});
