import { ArrowRight, Gift, Target } from 'lucide-react';

export default function QuestDock({ questCount, questTarget, questComplete, onContinue, hasNext }) {
  const percent = Math.round((questCount / questTarget) * 100);

  return (
    <div className="sticky bottom-0 z-20 mt-3 px-3 pb-3 pt-2 lg:px-5">
      <div className="glossy flex flex-col gap-3 rounded-[18px] border border-[#3A3123] bg-[#1B1710]/95 px-3.5 py-3 shadow-[0_-8px_28px_rgba(0,0,0,0.5)] backdrop-blur md:flex-row md:items-center md:gap-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="hex grid h-10 w-11 shrink-0 place-items-center bg-[#2A2318] text-[var(--amber)]">
            <Target size={18} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-bold text-[var(--cream)]">Today's Quest</p>
            <p className="truncate text-[10.5px] text-[var(--taupe)]">Complete {questTarget} questions</p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-2.5">
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[#2E271D]">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{
                width: `${percent}%`,
                background: 'linear-gradient(90deg,#C98A05,#F5B301 55%,#FFD66B)',
                boxShadow: '0 0 10px rgba(245,179,1,0.45)',
              }}
            />
          </div>
          <span
            aria-live="polite"
            className={`shrink-0 text-[11px] font-bold ${questComplete ? 'text-[var(--success)]' : 'text-[var(--cream)]'}`}
          >
            {questCount} / {questTarget}
          </span>
        </div>

        <div className="hidden h-9 w-px bg-[#3A3123] md:block" />

        <div className="flex items-center gap-2">
          <Gift size={18} strokeWidth={1.5} className="shrink-0 text-[var(--gold)]" />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-[var(--taupe)]">
              Next Reward
            </p>
            <p className="truncate text-[11.5px] font-bold text-[var(--gold)]">+50 Honey</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={!hasNext}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[11.5px] font-bold text-[#2A1F05] transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:text-[12.5px]"
          style={{
            background: 'linear-gradient(180deg,#FFD66B,#F5B301 60%,#D8A000)',
            boxShadow: '0 6px 18px rgba(245,179,1,0.28), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          Continue Quest
          <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}