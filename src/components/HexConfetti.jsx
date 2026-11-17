import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const buildPieces = (seed) =>
  Array.from({ length: 28 }, (_, index) => ({
    id: `${seed}-${index}`,
    x: (Math.random() - 0.5) * 560,
    y: 150 + Math.random() * 250,
    rotate: (Math.random() - 0.5) * 540,
    delay: Math.random() * 0.18,
    duration: 1.5 + Math.random() * 0.9,
    size: 6 + Math.random() * 9,
    drop: index % 3 === 0,
  }));

export default function HexConfetti({ trigger }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!trigger) return undefined;
    setPieces(buildPieces(trigger));
    const timer = window.setTimeout(() => setPieces([]), 2800);
    return () => window.clearTimeout(timer);
  }, [trigger]);

  if (!pieces.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center" aria-hidden="true">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: piece.x, y: piece.y, opacity: 0, rotate: piece.rotate, scale: 0.6 }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeOut' }}
          className={piece.drop ? 'absolute rounded-full rounded-tl-none' : 'absolute hex'}
          style={{
            width: piece.size,
            height: piece.size * (piece.drop ? 1.4 : 1.15),
            background: piece.drop
              ? 'linear-gradient(180deg,#FFD66B,#F5B301)'
              : 'linear-gradient(180deg,#FFD66B,#F5B301 60%,#C98A05)',
            boxShadow: '0 0 10px rgba(245,179,1,0.6)',
          }}
        />
      ))}
    </div>
  );
}