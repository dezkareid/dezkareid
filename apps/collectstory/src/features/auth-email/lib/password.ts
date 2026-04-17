export function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) errors.push('min_length');
  if (password.length > 60) errors.push('max_length');
  if (!/[A-Z]/.test(password)) errors.push('uppercase');
  if (!/[0-9]/.test(password)) errors.push('digit');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('symbol');
  return errors;
}
