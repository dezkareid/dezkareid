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

vi.mock('next/link', () => ({
  default: ({ href, children, ...properties }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} {...properties}>{children}</a>
  ),
}));

vi.mock('@dezkareid/components/react', () => ({
  Button: ({ children, disabled, type, onClick, ...properties }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => (
    <button type={type} disabled={disabled} onClick={onClick} {...properties}>{children}</button>
  ),
  Modal: ({ children, open, title }: { children: React.ReactNode; open: boolean; onClose: () => void; title: string }) =>
    open ? <div role="dialog" aria-label={title}>{children}</div> : undefined,
}));

vi.mock('@/app/[locale]/login/actions', () => ({
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
}));

import { EmailPasswordForm } from './EmailPasswordForm';

describe('EmailPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActionState.mockReturnValue([undefined, vi.fn(), false]);
  });

  it('renders email and password fields', () => {
    render(<EmailPasswordForm />);
    expect(screen.getByLabelText('sign_in.email_label')).toBeInTheDocument();
    expect(screen.getByLabelText('sign_in.password_label')).toBeInTheDocument();
  });

  it('renders submit button with idle text', () => {
    render(<EmailPasswordForm />);
    expect(screen.getByRole('button', { name: 'sign_in.submit' })).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    render(<EmailPasswordForm />);
    const link = screen.getByRole('link', { name: 'sign_in.forgot_password' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/en/reset-password');
  });

  it('renders create account button', () => {
    render(<EmailPasswordForm />);
    expect(screen.getByRole('button', { name: 'sign_up.button' })).toBeInTheDocument();
  });

  it('displays error message from action state', () => {
    mockUseActionState.mockReturnValue([{ error: 'Invalid credentials' }, vi.fn(), false]);
    render(<EmailPasswordForm />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('opens sign up modal when create account button is clicked', async () => {
    const user = userEvent.setup();
    render(<EmailPasswordForm />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'sign_up.button' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('disables fields and shows pending text while submitting', () => {
    mockUseActionState.mockReturnValue([undefined, vi.fn(), true]);
    render(<EmailPasswordForm />);
    expect(screen.getByLabelText('sign_in.email_label')).toBeDisabled();
    expect(screen.getByLabelText('sign_in.password_label')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'sign_in.submitting' })).toBeDisabled();
  });

  it('does not show error when no error state', () => {
    render(<EmailPasswordForm />);
    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toBeEmptyDOMElement();
  });
});
