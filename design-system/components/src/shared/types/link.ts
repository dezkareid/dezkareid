import type { ButtonVariant, ButtonSize } from './button';

export interface LinkProperties {
  variant?: ButtonVariant | 'link';
  size?: ButtonSize;
  disabled?: boolean;
}
