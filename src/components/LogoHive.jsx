const cells = [
  { x: 14, y: 10, fill: '#8A6339' },
  { x: 30, y: 10, fill: '#F5B301' },
  { x: 6, y: 23, fill: '#6E4E2C' },
  { x: 22, y: 23, fill: '#FFD66B' },
  { x: 38, y: 23, fill: '#8A6339' },
  { x: 14, y: 36, fill: '#F5B301' },
  { x: 30, y: 36, fill: '#6E4E2C' },
];

const hexPoints = (cx, cy, r = 8) => {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = ((60 * i - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
  });
  return points.join(' ');
};

export default function LogoHive({ className = 'h-8 w-11' }) {
  return (
    <svg viewBox="0 0 46 46" className={className} aria-hidden="true">
      {cells.map((cell, index) => (
        <polygon key={index} points={hexPoints(cell.x, cell.y)} fill={cell.fill} />
      ))}
    </svg>
  );
}