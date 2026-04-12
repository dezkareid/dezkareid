export interface ActionToggleProperties {
  active?: boolean;
  defaultActive?: boolean;
  onChange?: (active: boolean) => void;
  variant?: 'default' | 'like';
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}
