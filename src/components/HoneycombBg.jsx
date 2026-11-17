const R = 26;
const hexPath = (cx, cy) => {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = ((60 * i - 90) * Math.PI) / 180;
    return `${(cx + R * Math.cos(angle)).toFixed(1)},${(cy + R * Math.sin(angle)).toFixed(1)}`;
  });
  return `M${points.join('L')}Z`;
};

const CELLS = [
  [22.5, 26],
  [67.5, 26],
  [0, 65],
  [45, 65],
  [90, 65],
];

export default function HoneycombBg({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="honeycomb" width="90" height="78" patternUnits="userSpaceOnUse">
            {CELLS.map(([cx, cy]) => (
              <path
                key={`${cx}-${cy}`}
                d={hexPath(cx, cy)}
                fill="none"
                stroke="#F5B301"
                strokeOpacity="0.09"
                strokeWidth="1"
              />
            ))}
          </pattern>
          <radialGradient id="honeycomb-fade" cx="50%" cy="42%" r="72%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="58%" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="honeycomb-mask">
            <rect width="100%" height="100%" fill="url(#honeycomb-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#honeycomb)" mask="url(#honeycomb-mask)" />
      </svg>
    </div>
  );
}