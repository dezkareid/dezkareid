import { Check } from '@dezkareid/icons/react';

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Check
      className={className}
      label="Verified store"
      style={{ '--icon-size': '14px' } as React.CSSProperties}
    />
  );
}
