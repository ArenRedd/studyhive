import { Bell, Droplets, Flame, Layers } from 'lucide-react';
import LogoHive from '@/components/LogoHive';
import { useProgress } from '@/components/ProgressProvider';
import { TOTAL_QUESTIONS, units } from '@/data/units';

export default function TopBar() {
  const { honey, streak } = useProgress();

  return (
    <header className="relative z-30 flex h-[74px] shrink-0 items-center gap-3 px-3 sm:gap-4 sm:px-4 lg:px-5">
      <div className="flex items-center gap-2.5 rounded-2xl border border-[#3A3123] bg-[#1B1710] px-3 py-2 sm:px-4">
        <LogoHive />
        <span className="text-[clamp(15px,1.6vw,20px)] font-extrabold leading-none tracking-tight">
          <span className="text-[var(--cream)]">Study</span>
          <span className="text-[var(--amber)]">Hive</span>
        </span>
      </div>

      <div className="hidden h-11 w-px bg-[#2E271D] lg:block" />

      <div className="flex min-w-0 items-center gap-2.5">
        <div className="hex hidden h-9 w-10 shrink-0 place-items-center bg-[#2A2318] text-[var(--amber)] sm:grid">
          <Layers size={17} strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[clamp(13px,1.45vw,22px)] font-bold leading-tight text-[var(--cream)]">
            CS3691 – Embedded Systems &amp; IoT
          </h1>
          <p className="truncate text-[clamp(9px,0.8vw,11px)] font-medium tracking-wide text-[var(--taupe)]">
            {TOTAL_QUESTIONS} Questions · {units.length} Units
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="hidden items-center gap-1.5 rounded-full border border-[#3A3123] bg-[#201A12] px-3 py-1.5 sm:flex">
          <Flame size={15} strokeWidth={1.5} className="text-[var(--amber)]" />
          <span className="whitespace-nowrap text-[11px] font-semibold text-[var(--cream)]">{streak} Day Streak</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[#3A3123] bg-[#201A12] px-3 py-1.5">
          <Droplets size={15} strokeWidth={1.5} className="text-[var(--gold)]" />
          <span aria-live="polite" className="whitespace-nowrap text-[11px] font-semibold text-[var(--cream)]">
            {honey} Honey
          </span>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-8 w-8 place-items-center rounded-full border border-[#3A3123] bg-[#201A12] text-[#C9BCA4] transition-colors hover:text-[var(--cream)]"
        >
          <Bell size={15} strokeWidth={1.5} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--amber)] shadow-[0_0_6px_rgba(245,179,1,0.9)]" />
        </button>
        <button
          type="button"
          aria-label="Your profile"
          className="grid h-8 w-8 place-items-center rounded-full border border-[#4A4030] bg-gradient-to-b from-[#3A2E1D] to-[#241D13] text-[11px] font-bold text-[var(--gold)] transition-transform hover:scale-105"
        >
          S
        </button>
      </div>
    </header>
  );
}