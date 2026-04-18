import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockUseActionState } = vi.hoisted(() => ({
  mockUseActionState: vi.fn(),
}));

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return { ...actual, useActionState: mockUseActionState };
});

const translate = (key: string) => key;

vi.mock('next-intl', () => ({
  useTranslations: () => translate,
}));

vi.mock('@dezkareid/components/react', () => ({
  Button: ({ children, disabled, type, ...properties }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => (
    <button type={type} disabled={disabled} {...properties}>{children}</button>
  ),
}));

vi.mock('@/app/[locale]/reset-password/actions', () => ({
  requestPasswordReset: vi.fn(),
}));

import { ResetPasswordRequestForm } from './ResetPasswordRequestForm';

describe('ResetPasswordRequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActionState.mockReturnValue([undefined, vi.fn(), false]);
  });

  it('renders email field and submit button', () => {
    render(<ResetPasswordRequestForm />);
    expect(screen.getByLabelText('reset_password.email_label')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'reset_password.submit' })).toBeInTheDocument();
  });

  it('shows success message after successful submission', () => {
    mockUseActionState.mockReturnValue([{ success: true }, vi.fn(), false]);
    render(<ResetPasswordRequestForm />);
    expect(screen.getByText('reset_password.success')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('reset_password.email_label')).not.toBeInTheDocument();
  });

  it('displays error message from action state', () => {
    mockUseActionState.mockReturnValue([{ error: 'Something went wrong' }, vi.fn(), false]);
    render(<ResetPasswordRequestForm />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('disables field and shows pending text while submitting', () => {
    mockUseActionState.mockReturnValue([undefined, vi.fn(), true]);
    render(<ResetPasswordRequestForm />);
    expect(screen.getByLabelText('reset_password.email_label')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'reset_password.submitting' })).toBeDisabled();
  });

  it('does not show error when no error state', () => {
    render(<ResetPasswordRequestForm />);
    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toBeEmptyDOMElement();
  });
});
