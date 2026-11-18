import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Trash2 } from 'lucide-react';
import BeeSvg from '@/components/BeeSvg';
import { cn } from '@/lib/utils';

export default function ChecklistRow({
  question,
  completed,
  starred,
  pulse,
  onToggle,
  onStar,
  onDelete,
}) {
  const [resting, setResting] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleToggle = () => {
    if (!completed) {
      setResting(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setResting(false), 1600);
    }
    onToggle();
  };

  const handleKeyDown = (event) => {
    if (event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div data-qid={question.id} className="relative">
      <span
        className={cn(
          'absolute -left-[22px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all duration-300',
          completed ? 'bg-[var(--amber)] shadow-[0_0_8px_rgba(245,179,1,0.9)]' : 'bg-[#3A3123]',
        )}
      />

      <div
        role="button"
        tabIndex={0}
        aria-pressed={completed}
        aria-label={`${completed ? 'Mark as not done' : 'Mark as done'}: ${question.text}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'row-clip group relative flex cursor-pointer items-center gap-2.5 py-2 pl-1.5 pr-16 transition-colors duration-300',
          completed ? 'text-[var(--cream)]' : 'text-[#CFC3AC] hover:text-[var(--cream)]',
        )}
        style={
          completed
            ? {
                backgroundImage:
                  'linear-gradient(90deg, rgba(245,179,1,0.26) 0%, rgba(245,179,1,0.13) 45%, rgba(27,23,16,0.98) 100%)',
                boxShadow: 'inset 0 0 0 1.5px rgba(245,179,1,0.7)',
              }
            : {
                backgroundImage: 'linear-gradient(90deg,#221D15,#1B1711)',
                boxShadow: 'inset 0 0 0 1px #3A3123',
              }
        }
      >
        <motion.span
          className="hex relative grid h-[30px] w-[34px] shrink-0 place-items-center"
          animate={completed ? { scale: [1, 1.16, 1] } : { scale: 1 }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          style={{
            background: completed ? 'linear-gradient(180deg,#4CAF7A,#2E7350)' : '#181410',
            boxShadow: completed ? '0 0 10px rgba(76,175,122,0.35)' : 'inset 0 0 0 1.5px #6B5B3C',
          }}
        >
          {completed ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <motion.path
                d="M5 12.6l4.4 4.4L19 7.2"
                fill="none"
                stroke="#F4EBD9"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </svg>
          ) : (
            <span className="hex h-3.5 w-4 border border-[#6B5B3C]" />
          )}
        </motion.span>

        <p
          className="min-w-0 flex-1 text-[clamp(10.5px,0.92vw,12.5px)] font-medium leading-[1.28]"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {question.text}
        </p>
      </div>

      <div className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 items-center gap-1">
        {onDelete && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(question.id);
            }}
            aria-label={`Delete "${question.text}"`}
            className="rounded-full p-1 text-[#665946] transition-colors hover:text-red-400 opacity-60 hover:opacity-100"
            title="Delete question"
          >
            <Trash2 size={13} strokeWidth={1.5} />
          </button>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onStar();
          }}
          aria-label={starred ? `Remove "${question.text}" from revision` : `Add "${question.text}" to revision`}
          aria-pressed={starred}
          className="rounded-full p-1 text-[#7D7263] transition-colors hover:text-[var(--gold)]"
        >
          <Star
            size={14}
            strokeWidth={1.5}
            className={starred ? 'fill-[var(--amber)] text-[var(--amber)]' : ''}
          />
        </button>
      </div>

      {pulse && (
        <span
          className="pointer-events-none absolute inset-0 row-clip animate-pulse"
          style={{ boxShadow: 'inset 0 0 0 2px var(--amber)' }}
        />
      )}

      <AnimatePresence>
        {resting && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.7 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute right-12 top-1/2 z-20 -translate-y-1/2"
          >
            <BeeSvg className="h-6 w-8" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
