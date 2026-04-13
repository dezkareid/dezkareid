export interface ModalProperties {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Accessible label for the close button.
   * @default "Close"
   */
  closeLabel?: string;
}
