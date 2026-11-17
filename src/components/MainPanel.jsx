import { AnimatePresence, motion } from 'framer-motion';
import { CheckSquare, HelpCircle, RotateCcw } from 'lucide-react';
import SegmentBar from '@/components/SegmentBar';
import ChecklistTab from '@/components/ChecklistTab';
import RevisionTab from '@/components/RevisionTab';
import QuizTab from '@/components/QuizTab';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  { id: 'revision', label: 'Revision', icon: RotateCcw },
  { id: 'quiz', label: 'Practice Quiz', icon: HelpCircle },
];

export default function MainPanel({
  unit,
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
}) {
  return (
    <section className="flex min-w-0 flex-col">
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
                'tab-clip flex flex-1 items-center justify-center gap-2 py-2.5 text-[clamp(10px,0.92vw,12.5px)] font-semibold transition-colors duration-200',
                active ? 'amber-grad text-[#2A1F05]' : 'bg-[#1E1A14] text-[#C9BCA4] hover:text-[var(--cream)]',
              )}
              style={active ? undefined : { boxShadow: 'inset 0 0 0 1px #3A3123' }}
            >
              <Icon size={15} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

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
          <p className="shrink-0 text-[clamp(9.5px,0.85vw,11.5px)] font-semibold text-[#C9BCA4]">
            {stat.completed} / {stat.total} Completed
          </p>
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
    </section>
  );
}