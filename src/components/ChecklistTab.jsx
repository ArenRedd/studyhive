import { useState } from 'react';
import { Plus, PlusCircle, Sparkles, X } from 'lucide-react';
import ChecklistRow from '@/components/ChecklistRow';

export default function ChecklistTab({
  unit,
  completedSet,
  revisionSet,
  onToggle,
  onStar,
  pulseId,
  onAddQuestion,
  onDeleteQuestion,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    if (onAddQuestion) {
      onAddQuestion(unit.id, questionText, answerText);
    }
    setQuestionText('');
    setAnswerText('');
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setQuestionText('');
    setAnswerText('');
  };

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

      {/* Questions list */}
      <div className="flex flex-col gap-2">
        {unit.questions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#3A3123] bg-[#16120D] p-6 text-center">
            <p className="text-xs font-semibold text-[var(--cream)]">
              No questions in Unit {unit.id} yet
            </p>
            <p className="mt-1 text-[11px] text-[var(--taupe)]">
              Click the button below to add your first question to this unit's checklist.
            </p>
          </div>
        ) : (
          unit.questions.map((question) => (
            <ChecklistRow
              key={question.id}
              question={question}
              completed={completedSet.has(question.id)}
              starred={revisionSet.has(question.id)}
              pulse={pulseId === question.id}
              onToggle={() => onToggle(question.id)}
              onStar={() => onStar(question.id)}
              onDelete={onDeleteQuestion ? () => onDeleteQuestion(question.id) : undefined}
            />
          ))
        )}

        {/* Add Question Expandable Form or Trigger Button */}
        {showAddForm ? (
          <form
            onSubmit={handleSubmit}
            className="mt-2.5 rounded-xl border border-[var(--amber)]/40 bg-[#16120D] p-3.5 shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--cream)]">
                <PlusCircle size={14} className="text-[var(--amber)]" />
                Add Question to Unit {unit.id} ({unit.shortTitle})
              </span>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded p-1 text-[var(--taupe)] hover:text-[var(--cream)] transition-colors"
                title="Cancel"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[var(--taupe)]">
                  Question Prompt *
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. Explain memory organization and register banks of 8051..."
                  rows={2}
                  autoFocus
                  required
                  className="w-full rounded-lg border border-[#3A3123] bg-[#0E0B08] p-2.5 text-xs text-[var(--cream)] placeholder:text-[#6D6353] focus:border-[var(--amber)] focus:outline-none focus:ring-1 focus:ring-[var(--amber)]/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[var(--taupe)]">
                  Answer / Notes (Optional for flashcard quiz)
                </label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Key concepts, formula, or summary answer..."
                  rows={2}
                  className="w-full rounded-lg border border-[#3A3123] bg-[#0E0B08] p-2 text-[11.5px] text-[#D8CBB2] placeholder:text-[#6D6353] focus:border-[var(--amber)] focus:outline-none focus:ring-1 focus:ring-[var(--amber)]/50"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#2A2318]">
              <span className="flex items-center gap-1 text-[10px] text-[var(--gold)]">
                <Sparkles size={11} />
                +10 Honey when completed
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg px-3 py-1.5 text-xs text-[var(--taupe)] hover:text-[var(--cream)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!questionText.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--amber)] px-4 py-1.5 text-xs font-bold text-[#14110D] hover:bg-[var(--gold)] disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
                >
                  <Plus size={14} />
                  Add Question
                </button>
              </div>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--amber)]/35 bg-[var(--amber)]/5 px-4 py-2.5 text-xs font-semibold text-[var(--amber)] hover:border-[var(--amber)] hover:bg-[var(--amber)]/10 hover:text-[var(--cream)] transition-all cursor-pointer shadow-sm group"
          >
            <Plus
              size={15}
              className="text-[var(--amber)] group-hover:scale-110 transition-transform"
            />
            <span>Add Question to Unit {unit.id}</span>
          </button>
        )}
      </div>
    </div>
  );
}
