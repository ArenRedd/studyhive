import { useMemo, useState } from 'react';
import { Check, Eye, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizTab({ unit, completedSet, onGotIt, onRevise }) {
  const questions = unit.questions;
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const total = questions.length;
  const question = useMemo(() => (total ? questions[index % total] : null), [index, questions, total]);

  if (!question) {
    return <p className="py-10 text-center text-[12px] text-[var(--taupe)]">No questions in this nest yet.</p>;
  }

  const advance = () => {
    setRevealed(false);
    setIndex((value) => (value + 1) % total);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--taupe)]">
          Flashcard {index + 1} / {total}
        </p>
        <span className="rounded-full bg-[#221D15] px-2 py-0.5 text-[9.5px] font-semibold text-[var(--amber)]">
          {question.marks ? `${question.marks} marks` : 'Unit ' + unit.id}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#3A3123] bg-[#221D15] p-4">
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[rgba(245,179,1,0.1)] blur-2xl" />
        <p className="relative text-[clamp(12px,1.05vw,14px)] font-semibold leading-snug text-[var(--cream)]">
          {question.text}
        </p>

        <AnimatePresence initial={false}>
          {revealed && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28 }}
              className="relative mt-3 overflow-hidden border-t border-dashed border-[#4A4030] pt-3 text-[11.5px] leading-relaxed text-[#D8CBB2]"
            >
              {question.answer || 'Answer not added yet — open the content file and fill in the answer field.'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="tab-clip flex items-center justify-center gap-2 bg-[#2A2318] py-2.5 text-[12px] font-semibold text-[var(--gold)] transition-colors hover:bg-[#332A1C]"
          style={{ boxShadow: 'inset 0 0 0 1px #4A4030' }}
        >
          <Eye size={15} strokeWidth={1.5} /> Reveal answer
        </button>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              onGotIt(question.id);
              advance();
            }}
            className="tab-clip flex flex-1 items-center justify-center gap-2 amber-grad py-2.5 text-[12px] font-bold text-[#2A1F05]"
          >
            <Check size={15} strokeWidth={2} /> Got it
            {completedSet.has(question.id) && <span className="text-[10px] font-semibold opacity-70">(done)</span>}
          </button>
          <button
            type="button"
            onClick={() => {
              onRevise(question.id);
              advance();
            }}
            className="tab-clip flex flex-1 items-center justify-center gap-2 bg-[#2A2318] py-2.5 text-[12px] font-semibold text-[var(--cream)] transition-colors hover:bg-[#332A1C]"
            style={{ boxShadow: 'inset 0 0 0 1px #4A4030' }}
          >
            <RotateCcw size={15} strokeWidth={1.5} /> Revise later
          </button>
        </div>
      )}
    </div>
  );
}