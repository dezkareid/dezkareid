import type { SVGProps } from 'react';

export function ShelvesIcon({
  size = 24,
  color = 'currentColor',
  ...properties
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...properties}
    >
      {/* Top shelf board */}
      <rect x="2" y="9" width="20" height="2" rx="1" fill={color} />

      {/* Bottom shelf board */}
      <rect x="2" y="17" width="20" height="2" rx="1" fill={color} />

      {/* Left bracket */}
      <rect x="2" y="9" width="1.5" height="10" rx="0.75" fill={color} />

      {/* Right bracket */}
      <rect x="20.5" y="9" width="1.5" height="10" rx="0.75" fill={color} />

      {/* Top shelf — item 1: tall slim figure */}
      <rect x="5" y="4" width="2.5" height="5" rx="0.75" fill={color} opacity="0.55" />

      {/* Top shelf — item 2: medium cube */}
      <rect x="9" y="5.5" width="3" height="3.5" rx="0.75" fill={color} opacity="0.8" />

      {/* Top shelf — item 3: short wide item */}
      <rect x="14" y="6.5" width="4" height="2.5" rx="0.75" fill={color} opacity="0.55" />

      {/* Bottom shelf — item 1: round-top figure */}
      <rect x="5" y="13" width="2.5" height="4" rx="1.25" fill={color} opacity="0.8" />

      {/* Bottom shelf — item 2: tall slim */}
      <rect x="9.5" y="12" width="2" height="5" rx="0.75" fill={color} opacity="0.55" />

      {/* Bottom shelf — item 3: medium box */}
      <rect x="13.5" y="13.5" width="3" height="3.5" rx="0.75" fill={color} opacity="0.8" />

      {/* Bottom shelf — item 4: tiny accent */}
      <rect x="18" y="14.5" width="2" height="2.5" rx="0.75" fill={color} opacity="0.55" />
    </svg>
  );
}
