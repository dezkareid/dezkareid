import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorLayout } from './ErrorLayout';
import React from 'react';

describe('ErrorLayout', () => {
  it('renders title, subtitle and description', () => {
    render(
      <ErrorLayout
        title="404"
        subtitle="Not Found"
        description="This page does not exist."
      />,
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
    expect(screen.getByText('This page does not exist.')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <ErrorLayout
        title="404"
        subtitle="Not Found"
        description="Test"
        actions={<button>Action Button</button>}
      />,
    );

    expect(screen.getByRole('button', { name: /Action Button/i })).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <ErrorLayout
        title="404"
        subtitle="Not Found"
        description="Test"
        footer={<div>Footer Content</div>}
      />,
    );

    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });
});
