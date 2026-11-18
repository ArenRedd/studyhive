import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  CheckSquare,
  Clock,
  HelpCircle,
  Plus,
  PlusCircle,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SegmentBar from '@/components/SegmentBar';
import ChecklistTab from '@/components/ChecklistTab';
import RevisionTab from '@/components/RevisionTab';
import QuizTab from '@/components/QuizTab';
import { useSubject } from '@/context/SubjectContext';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  { id: 'revision', label: 'Revision', icon: RotateCcw },
  { id: 'quiz', label: 'Practice Quiz', icon: HelpCircle },
];

export default function MainPanel({
  unit,
  units = [],
  stat,
  tab,
  onTabChange,
  completedSet,
  revisionSet,
  revisionIds,
  allQuestions,
  onToggle,
  onStar,
  onGotIt,
  pulseId,
  hasQuestions = true,
  onAddQuestion,
  onDeleteQuestion,
}) {
  const navigate = useNavigate();
  const { currentSubject } = useSubject();
  const [showModal, setShowModal] = useState(false);
  const [modalUnitId, setModalUnitId] = useState(unit?.id || 'I');
  const [modalText, setModalText] = useState('');
  const [modalAnswer, setModalAnswer] = useState('');

  const sessionLabel =
    currentSubject.session === 'FN' ? 'Forenoon (FN)' : 'Afternoon (AN)';

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalText.trim()) return;

    if (onAddQuestion) {
      onAddQuestion(modalUnitId, modalText, modalAnswer);
    }
    setModalText('');
    setModalAnswer('');
    setShowModal(false);
    if (tab !== 'checklist') {
      onTabChange('checklist');
    }
  };

  // If a subject has no questions yet, show the curated notice WITH the option to add questions!
  if (!hasQuestions) {
    return (
      <section className="flex min-w-0 flex-col">
        <div
          className="glossy rounded-[20px] border p-6 sm:p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[380px]"
          style={{
            background: 'linear-gradient(180deg,#1E1A12 0%,#191510 100%)',
            borderColor: 'rgba(245,179,1,0.22)',
            boxShadow: '0 0 0 1px rgba(245,179,1,0.06), 0 18px 40px rgba(0,0,0,0.35)',
          }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--amber)]/40 bg-[var(--amber)]/10 text-[var(--amber)] text-xs font-bold tracking-wider uppercase">
            <BookOpen size={13} />
            <span>{currentSubject.code} · {currentSubject.shortName}</span>
          </div>

          <h2 className="text-[clamp(24px,2.5vw,36px)] font-extrabold text-[var(--cream)] tracking-tight">
            Questions coming soon
          </h2>

          <p className="text-[clamp(13px,1.1vw,15px)] text-[var(--taupe)] max-w-[56ch] leading-relaxed">
            Question sets and revision checklists for{' '}
            <span className="text-[var(--cream)] font-semibold">{currentSubject.fullName}</span>{' '}
            are being prepared for the Nov/Dec 2026 examination sitting ({currentSubject.examDate} · {sessionLabel}).
          </p>

          <div className="flex items-center gap-2 text-xs text-[#8C7E6A] pt-1">
            <Clock size={13} />
            <span>You can switch subjects or add your own questions</span>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--amber)] bg-[var(--amber)] px-4 py-2.5 text-xs font-bold text-[#14110D] hover:bg-[var(--gold)] transition-colors cursor-pointer shadow-md"
            >
              <Plus size={15} />
              Add Question
            </button>
            <button
              type="button"
              onClick={() => navigate('/subjects')}
              className="inline-flex items-center gap-2 rounded-xl border border-[#3A3123] bg-[#221D15] px-4 py-2.5 text-xs font-semibold text-[var(--cream)] hover:border-[var(--amber)] transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              Switch Subject
            </button>
          </div>
        </div>

        {/* Modal for adding question to empty subject */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-[var(--amber)]/40 bg-[#1A1610] p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#2E271D]">
                <h3 className="text-sm font-bold text-[var(--cream)] flex items-center gap-2">
                  <PlusCircle size={16} className="text-[var(--amber)]" />
                  Add Question — {currentSubject.code}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded p-1 text-[var(--taupe)] hover:text-[var(--cream)]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleModalSubmit} className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--taupe)]">
                    Target Unit
                  </label>
                  <select
                    value={modalUnitId}
                    onChange={(e) => setModalUnitId(e.target.value)}
                    className="w-full rounded-lg border border-[#3A3123] bg-[#0E0B08] p-2 text-xs text-[var(--cream)] focus:border-[var(--amber)] focus:outline-none"
                  >
                    <option value="I">Unit I</option>
                    <option value="II">Unit II</option>
                    <option value="III">Unit III</option>
                    <option value="IV">Unit IV</option>
                    <option value="V">Unit V</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--taupe)]">
                    Question Prompt *
                  </label>
                  <textarea
                    value={modalText}
                    onChange={(e) => setModalText(e.target.value)}
                    placeholder="Enter question text..."
                    rows={3}
                    autoFocus
                    required
                    className="w-full rounded-lg border border-[#3A3123] bg-[#0E0B08] p-2.5 text-xs text-[var(--cream)] focus:border-[var(--amber)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--taupe)]">
                    Answer / Notes (Optional)
                  </label>
                  <textarea
                    value={modalAnswer}
                    onChange={(e) => setModalAnswer(e.target.value)}
                    placeholder="Optional key points or answer..."
                    rows={2}
                    className="w-full rounded-lg border border-[#3A3123] bg-[#0E0B08] p-2.5 text-xs text-[#D8CBB2] focus:border-[var(--amber)] focus:outline-none"
                  />
                </div>

                <div className="mt-2 flex items-center justify-end gap-2 pt-2 border-t border-[#2E271D]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-lg px-3 py-1.5 text-xs text-[var(--taupe)] hover:text-[var(--cream)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!modalText.trim()}
                    className="rounded-lg bg-[var(--amber)] px-4 py-1.5 text-xs font-bold text-[#14110D] hover:bg-[var(--gold)] disabled:opacity-40 transition-colors"
                  >
                    Add Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="flex min-w-0 flex-col">
      {/* Tab Switcher */}
      <div className="mb-2.5 flex gap-2">
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-pressed={active}
              className={cn(
                'tab-clip flex flex-1 items-center justify-center gap-2 py-2.5 text-[clamp(10px,0.92vw,12.5px)] font-semibold transition-colors duration-200 cursor-pointer',
                active
                  ? 'amber-grad text-[#2A1F05]'
                  : 'bg-[#1E1A14] text-[#C9BCA4] hover:text-[var(--cream)]',
              )}
              style={active ? undefined : { boxShadow: 'inset 0 0 0 1px #3A3123' }}
            >
              <Icon size={15} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Unit Card */}
      <div
        className="glossy rounded-[16px] border p-3.5 sm:p-4"
        style={{
          background: 'linear-gradient(180deg,#1E1A12 0%,#191510 100%)',
          borderColor: 'rgba(245,179,1,0.22)',
          boxShadow: '0 0 0 1px rgba(245,179,1,0.06), 0 18px 40px rgba(0,0,0,0.35)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="h-5 w-[3px] shrink-0 rounded-full"
            style={{ background: 'linear-gradient(180deg,#FFD66B,#F5B301)' }}
          />
          <h2 className="min-w-0 flex-1 truncate text-[clamp(12px,1.15vw,16px)] font-bold text-[var(--cream)]">
            Unit {unit.id} – {unit.title}
          </h2>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setModalUnitId(unit.id);
                setShowModal(true);
              }}
              className="flex items-center gap-1 rounded-lg border border-[var(--amber)]/40 bg-[var(--amber)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--amber)] hover:bg-[var(--amber)] hover:text-[#14110D] transition-colors cursor-pointer"
              title={`Add question to Unit ${unit.id}`}
            >
              <Plus size={13} strokeWidth={2} />
              <span className="hidden sm:inline">Add Question</span>
            </button>

            <p className="text-[clamp(9.5px,0.85vw,11.5px)] font-semibold text-[#C9BCA4]">
              {stat.completed} / {stat.total} Completed
            </p>
          </div>
        </div>

        <div className="my-3">
          <SegmentBar total={stat.total} completed={stat.completed} />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${unit.id}-${tab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {tab === 'checklist' && (
              <ChecklistTab
                unit={unit}
                completedSet={completedSet}
                revisionSet={revisionSet}
                onToggle={onToggle}
                onStar={onStar}
                pulseId={pulseId}
                onAddQuestion={onAddQuestion}
                onDeleteQuestion={onDeleteQuestion}
              />
            )}
            {tab === 'revision' && (
              <RevisionTab
                allQuestions={allQuestions}
                revisionSet={revisionSet}
                revisionIds={revisionIds}
                completedSet={completedSet}
                onToggle={onToggle}
                onStar={onStar}
              />
            )}
            {tab === 'quiz' && (
              <QuizTab
                key={unit.id}
                unit={unit}
                completedSet={completedSet}
                onGotIt={onGotIt}
                onRevise={onStar}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Unit Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--amber)]/40 bg-[#1A1610] p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E271D]">
              <h3 className="text-sm font-bold text-[var(--cream)] flex items-center gap-2">
                <PlusCircle size={16} className="text-[var(--amber)]" />
                Add Question — Unit {modalUnitId}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded p-1 text-[var(--taupe)] hover:text-[var(--cream)]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--taupe)]">
                  Select Unit
                </label>
                <select
                  value={modalUnitId}
                  onChange={(e) => setModalUnitId(e.target.value)}
                  className="w-full rounded-lg border border-[#3A3123] bg-[#0E0B08] p-2 text-xs text-[var(--cream)] focus:border-[var(--amber)] focus:outline-none"
                >
                  {(units.length > 0 ? units : [{ id: 'I', title: 'Unit I' }]).map((u) => (
                    <option key={u.id} value={u.id}>
                      Unit {u.id} — {u.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--taupe)]">
                  Question Prompt *
                </label>
                <textarea
                  value={modalText}
                  onChange={(e) => setModalText(e.target.value)}
                  placeholder="Enter the question text..."
                  rows={3}
                  autoFocus
                  required
                  className="w-full rounded-lg border border-[#3A3123] bg-[#0E0B08] p-2.5 text-xs text-[var(--cream)] placeholder:text-[#6D6353] focus:border-[var(--amber)] focus:outline-none focus:ring-1 focus:ring-[var(--amber)]/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--taupe)]">
                  Answer / Notes (Optional for Quiz Flashcard)
                </label>
                <textarea
                  value={modalAnswer}
                  onChange={(e) => setModalAnswer(e.target.value)}
                  placeholder="Optional summary or key points..."
                  rows={2}
                  className="w-full rounded-lg border border-[#3A3123] bg-[#0E0B08] p-2.5 text-xs text-[#D8CBB2] placeholder:text-[#6D6353] focus:border-[var(--amber)] focus:outline-none focus:ring-1 focus:ring-[var(--amber)]/50"
                />
              </div>

              <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#2E271D]">
                <span className="flex items-center gap-1 text-[10px] text-[var(--gold)]">
                  <Sparkles size={11} />
                  +10 Honey when completed
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-lg px-3 py-1.5 text-xs text-[var(--taupe)] hover:text-[var(--cream)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!modalText.trim()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--amber)] px-4 py-1.5 text-xs font-bold text-[#14110D] hover:bg-[var(--gold)] disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    Add Question
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
