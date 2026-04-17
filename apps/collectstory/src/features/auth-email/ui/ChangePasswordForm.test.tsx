import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

vi.mock('@/app/[locale]/profile/edit/actions', () => ({
  changePassword: vi.fn(),
}));

import { ChangePasswordForm } from './ChangePasswordForm';

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActionState.mockReturnValue([undefined, vi.fn(), false]);
  });

  it('renders password and confirm fields', () => {
    render(<ChangePasswordForm />);
    expect(screen.getByLabelText('change_password.password_label')).toBeInTheDocument();
    expect(screen.getByLabelText('change_password.confirm_label')).toBeInTheDocument();
  });

  it('renders submit button with idle text', () => {
    render(<ChangePasswordForm />);
    expect(screen.getByRole('button', { name: 'change_password.submit' })).toBeInTheDocument();
  });

  it('shows success message from action state', () => {
    mockUseActionState.mockReturnValue([{ success: true }, vi.fn(), false]);
    render(<ChangePasswordForm />);
    expect(screen.getByText('change_password.success')).toBeInTheDocument();
  });

  it('displays error message from action state', () => {
    mockUseActionState.mockReturnValue([{ error: 'Current password is incorrect' }, vi.fn(), false]);
    render(<ChangePasswordForm />);
    expect(screen.getByText('Current password is incorrect')).toBeInTheDocument();
  });

  it('disables fields and shows pending text while submitting', () => {
    mockUseActionState.mockReturnValue([undefined, vi.fn(), true]);
    render(<ChangePasswordForm />);
    expect(screen.getByLabelText('change_password.password_label')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'change_password.submitting' })).toBeDisabled();
  });

  it('shows confirm error when passwords do not match on submit', async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm />);

    await user.type(screen.getByLabelText('change_password.password_label'), 'password123');
    await user.type(screen.getByLabelText('change_password.confirm_label'), 'different456');
    await user.click(screen.getByRole('button', { name: 'change_password.submit' }));

    expect(screen.getByText('change_password.confirm_error')).toBeInTheDocument();
  });

  it('does not show confirm error when passwords match', async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm />);

    await user.type(screen.getByLabelText('change_password.password_label'), 'password123');
    await user.type(screen.getByLabelText('change_password.confirm_label'), 'password123');

    expect(screen.queryByText('change_password.confirm_error')).not.toBeInTheDocument();
  });

  it('renders as a section with accessible heading', () => {
    render(<ChangePasswordForm />);
    expect(screen.getByRole('heading', { name: 'change_password.section_title' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'change_password.section_title' })).toBeInTheDocument();
  });
});
