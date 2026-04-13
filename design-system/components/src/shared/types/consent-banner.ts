export interface ConsentBannerProperties {
  onAccept?: () => void;
  onDecline?: () => void;
  className?: string;
  /**
   * Consent message text.
   * @default "We use cookies to understand how you use our services and to improve your experience."
   */
  message?: string;
  /**
   * Label for the accept button.
   * @default "Accept"
   */
  acceptLabel?: string;
  /**
   * Label for the decline button.
   * @default "Decline"
   */
  declineLabel?: string;
}
