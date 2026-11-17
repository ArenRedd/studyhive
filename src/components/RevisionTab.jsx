import { RotateCcw } from 'lucide-react';
import ChecklistRow from '@/components/ChecklistRow';

export default function RevisionTab({ allQuestions, revisionSet, completedSet, onToggle, onStar }) {
  const items = allQuestions.filter((question) => revisionSet.has(question.id));

  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <div className="hex grid h-14 w-16 place-items-center bg-[#221D15] text-[var(--taupe)]">
          <RotateCcw size={20} strokeWidth={1.5} />
        </div>
        <p className="text-[13px] font-semibold text-[var(--cream)]">Nothing to revise yet</p>
        <p className="max-w-[260px] text-[11px] leading-relaxed text-[var(--taupe)]">
          Star a question with the ☆ icon on any checklist row and it will wait for you here.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-4 pl-7">
      {items.map((question) => (
        <div key={question.id} className="flex flex-col gap-1.5">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--amber)]">
            Unit {question.unitId} · {question.shortTitle}
          </p>
          <div className="relative">
            <ChecklistRow
              question={question}
              completed={completedSet.has(question.id)}
              starred
              onToggle={() => onToggle(question.id)}
              onStar={() => onStar(question.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}