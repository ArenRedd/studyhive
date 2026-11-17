import ChecklistRow from '@/components/ChecklistRow';

export default function ChecklistTab({ unit, completedSet, revisionSet, onToggle, onStar, pulseId }) {
  if (!unit.questions.length) {
    return (
      <p className="py-10 text-center text-[12px] text-[var(--taupe)]">
        No questions in this nest yet — add them in the content file.
      </p>
    );
  }

  return (
    <div className="relative pl-7">
      <span
        className="absolute bottom-4 left-[9px] top-4 w-[2px] rounded-full"
        style={{
          background:
            'linear-gradient(180deg, rgba(245,179,1,0.08) 0%, rgba(245,179,1,0.55) 35%, rgba(245,179,1,0.55) 65%, rgba(245,179,1,0.08) 100%)',
        }}
        aria-hidden="true"
      />
      <span
        className="honey-drop-travel absolute left-[5px] h-2.5 w-2.5 rounded-full"
        style={{
          background: 'radial-gradient(circle at 32% 28%, #FFD66B, #F5B301 60%, #C98A05)',
          boxShadow: '0 0 8px rgba(245,179,1,0.9)',
        }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-2">
        {unit.questions.map((question) => (
          <ChecklistRow
            key={question.id}
            question={question}
            completed={completedSet.has(question.id)}
            starred={revisionSet.has(question.id)}
            pulse={pulseId === question.id}
            onToggle={() => onToggle(question.id)}
            onStar={() => onStar(question.id)}
          />
        ))}
      </div>
    </div>
  );
}