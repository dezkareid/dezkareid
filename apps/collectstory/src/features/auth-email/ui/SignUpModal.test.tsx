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
  Modal: ({ children, open, title, onClose }: { children: React.ReactNode; open: boolean; onClose: () => void; title: string }) =>
    open
      ? (
          <div role="dialog" aria-label={title}>
            <button onClick={onClose}>close</button>
            {children}
          </div>
        )
      : undefined,
}));

vi.mock('@/app/[locale]/login/actions', () => ({
  signUpWithEmail: vi.fn(),
  signInWithEmail: vi.fn(),
}));

import { SignUpModal } from './SignUpModal';

describe('SignUpModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActionState.mockReturnValue([undefined, vi.fn(), false]);
  });

  it('does not render when closed', () => {
    render(<SignUpModal open={false} onClose={onClose} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders all fields when open', () => {
    render(<SignUpModal open={true} onClose={onClose} />);
    expect(screen.getByLabelText('sign_up.email_label')).toBeInTheDocument();
    expect(screen.getByLabelText('sign_up.username_label')).toBeInTheDocument();
    expect(screen.getByLabelText('sign_up.password_label')).toBeInTheDocument();
    expect(screen.getByLabelText('sign_up.confirm_label')).toBeInTheDocument();
  });

  it('renders submit button disabled initially because password requirements are not met', () => {
    render(<SignUpModal open={true} onClose={onClose} />);
    expect(screen.getByRole('button', { name: 'sign_up.submit' })).toBeDisabled();
  });

  it('renders all 5 password requirement rules', () => {
    render(<SignUpModal open={true} onClose={onClose} />);
    expect(screen.getByText('sign_up.rule_min_length')).toBeInTheDocument();
    expect(screen.getByText('sign_up.rule_max_length')).toBeInTheDocument();
    expect(screen.getByText('sign_up.rule_uppercase')).toBeInTheDocument();
    expect(screen.getByText('sign_up.rule_digit')).toBeInTheDocument();
    expect(screen.getByText('sign_up.rule_symbol')).toBeInTheDocument();
  });

  it('enables submit button only when all password rules are met', async () => {
    const user = userEvent.setup();
    render(<SignUpModal open={true} onClose={onClose} />);

    const input = screen.getByLabelText('sign_up.password_label');
    expect(screen.getByRole('button', { name: 'sign_up.submit' })).toBeDisabled();

    await user.type(input, 'ValidPass1!');
    expect(screen.getByRole('button', { name: 'sign_up.submit' })).not.toBeDisabled();
  });

  it('keeps submit disabled when password is too short', async () => {
    const user = userEvent.setup();
    render(<SignUpModal open={true} onClose={onClose} />);

    await user.type(screen.getByLabelText('sign_up.password_label'), 'Ab1!');
    expect(screen.getByRole('button', { name: 'sign_up.submit' })).toBeDisabled();
  });

  it('keeps submit disabled when password lacks uppercase', async () => {
    const user = userEvent.setup();
    render(<SignUpModal open={true} onClose={onClose} />);

    await user.type(screen.getByLabelText('sign_up.password_label'), 'validpass1!');
    expect(screen.getByRole('button', { name: 'sign_up.submit' })).toBeDisabled();
  });

  it('keeps submit disabled when password lacks a digit', async () => {
    const user = userEvent.setup();
    render(<SignUpModal open={true} onClose={onClose} />);

    await user.type(screen.getByLabelText('sign_up.password_label'), 'ValidPass!');
    expect(screen.getByRole('button', { name: 'sign_up.submit' })).toBeDisabled();
  });

  it('keeps submit disabled when password lacks a symbol', async () => {
    const user = userEvent.setup();
    render(<SignUpModal open={true} onClose={onClose} />);

    await user.type(screen.getByLabelText('sign_up.password_label'), 'ValidPass1');
    expect(screen.getByRole('button', { name: 'sign_up.submit' })).toBeDisabled();
  });

  it('renders username hint', () => {
    render(<SignUpModal open={true} onClose={onClose} />);
    expect(screen.getByText('sign_up.username_hint')).toBeInTheDocument();
  });

  it('displays error message from action state', () => {
    mockUseActionState.mockReturnValue([{ error: 'Username already taken' }, vi.fn(), false]);
    render(<SignUpModal open={true} onClose={onClose} />);
    expect(screen.getByText('Username already taken')).toBeInTheDocument();
  });

  it('all fields are disabled when pending', () => {
    mockUseActionState.mockReturnValue([undefined, vi.fn(), true]);
    render(<SignUpModal open={true} onClose={onClose} />);
    expect(screen.getByLabelText('sign_up.email_label')).toBeDisabled();
    expect(screen.getByLabelText('sign_up.username_label')).toBeDisabled();
    expect(screen.getByLabelText('sign_up.password_label')).toBeDisabled();
    expect(screen.getByLabelText('sign_up.confirm_label')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'sign_up.submitting' })).toBeDisabled();
  });
});
