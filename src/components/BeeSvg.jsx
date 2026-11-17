import { useId } from 'react';

export default function BeeSvg({ className = '', animateWings = true }) {
  const id = useId().replace(/[:]/g, '');
  const bodyClip = `bee-body-${id}`;

  return (
    <svg viewBox="0 0 72 52" className={className} aria-hidden="true" role="presentation">
      <defs>
        <linearGradient id={`bee-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD66B" />
          <stop offset="55%" stopColor="#F5B301" />
          <stop offset="100%" stopColor="#C98A05" />
        </linearGradient>
        <clipPath id={bodyClip}>
          <ellipse cx="40" cy="30" rx="19" ry="11" transform="rotate(-8 40 30)" />
        </clipPath>
      </defs>

      {/* wings */}
      <g style={{ transformBox: 'fill-box', transformOrigin: '60% 90%' }} className={animateWings ? 'wing' : ''}>
        <ellipse cx="40" cy="14" rx="13" ry="8" fill="rgba(244,235,217,0.55)" stroke="#F4EBD9" strokeOpacity="0.65" strokeWidth="1" transform="rotate(-22 40 14)" />
        <ellipse cx="54" cy="18" rx="10" ry="6" fill="rgba(244,235,217,0.38)" stroke="#F4EBD9" strokeOpacity="0.45" strokeWidth="1" transform="rotate(14 54 18)" />
      </g>

      {/* body */}
      <ellipse cx="40" cy="30" rx="19" ry="11" transform="rotate(-8 40 30)" fill={`url(#bee-grad-${id})`} />
      <g clipPath={`url(#${bodyClip})`}>
        <rect x="34" y="16" width="5" height="30" fill="#241C10" transform="rotate(-8 40 30)" />
        <rect x="45" y="16" width="5" height="30" fill="#241C10" transform="rotate(-8 40 30)" />
        <rect x="56" y="16" width="3" height="30" fill="#241C10" transform="rotate(-8 40 30)" />
      </g>

      {/* head + antennae */}
      <circle cx="19" cy="27" r="7.5" fill="#2B2113" />
      <circle cx="21" cy="25" r="1.6" fill="#F4EBD9" />
      <path d="M15 21 C12 16, 9 15, 7 16" fill="none" stroke="#2B2113" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M19 20 C18 15, 16 13, 13 12" fill="none" stroke="#2B2113" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="7" cy="16" r="1.6" fill="#F5B301" />
      <circle cx="13" cy="12" r="1.6" fill="#F5B301" />

      {/* stinger */}
      <path d="M58 34 L63 38 L57 38 Z" fill="#2B2113" />

      {/* legs */}
      <path d="M32 39 L30 45" stroke="#2B2113" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M42 40 L42 46" stroke="#2B2113" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M50 39 L53 45" stroke="#2B2113" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}