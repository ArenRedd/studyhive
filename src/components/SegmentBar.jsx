import { Fragment } from 'react';
import { motion } from 'framer-motion';

export default function SegmentBar({ total, completed }) {
  if (!total) return null;
  return (
    <div className="flex w-full items-center" aria-hidden="true">
      {Array.from({ length: total }).map((_, index) => {
        const filled = index < completed;
        return (
          <Fragment key={index}>
            {index > 0 && <span className="h-[2px] flex-1 bg-[#3A3123]" />}
            <motion.span
              key={`${index}-${filled}`}
              initial={filled ? { scale: 0.55, opacity: 0.45 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              className={`hex h-7 w-8 shrink-0 transition-colors duration-300 ${filled ? 'honey-grad' : 'bg-[#1A1610]'}`}
              style={
                filled
                  ? { filter: 'drop-shadow(0 0 7px rgba(245,179,1,0.45))' }
                  : { boxShadow: 'inset 0 0 0 1.5px #4A4030' }
              }
            />
          </Fragment>
        );
      })}
    </div>
  );
}