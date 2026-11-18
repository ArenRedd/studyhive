import { useNavigate } from 'react-router-dom';
import { Bell, Droplets, Flame, BookOpen, Calendar, ArrowLeft } from 'lucide-react';
import LogoHive from '@/components/LogoHive';
import { useProgress } from '@/components/ProgressProvider';
import { useSubject } from '@/context/SubjectContext';

export default function TopBar() {
  const navigate = useNavigate();
  const { honey, streak } = useProgress();
  const { currentSubject } = useSubject();

  const sessionLabel =
    currentSubject.session === 'FN' ? 'Forenoon (FN)' : 'Afternoon (AN)';

  return (
    <header className="relative z-30 flex h-[74px] shrink-0 items-center gap-2.5 px-3 sm:gap-4 sm:px-4 lg:px-5">
      {/* Brand Logo */}
      <button
        type="button"
        onClick={() => navigate('/subjects')}
        className="flex items-center gap-2.5 rounded-2xl border border-[#3A3123] bg-[#1B1710] px-3 py-2 sm:px-4 cursor-pointer hover:border-[var(--amber)]/50 transition-colors"
        title="Return to Bookshelf"
      >
        <LogoHive />
        <span className="text-[clamp(15px,1.6vw,20px)] font-extrabold leading-none tracking-tight">
          <span className="text-[var(--cream)]">Study</span>
          <span className="text-[var(--amber)]">Hive</span>
        </span>
      </button>

      {/* Switch Subject Button */}
      <button
        type="button"
        onClick={() => navigate('/subjects')}
        className="flex items-center gap-1.5 rounded-xl border border-[var(--amber)]/40 bg-[#251E14] hover:bg-[var(--amber)] hover:text-[#14110D] px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold text-[var(--amber)] transition-colors cursor-pointer shrink-0 shadow-sm"
        title="Return to subject chooser bookshelf"
      >
        <ArrowLeft size={14} className="shrink-0" />
        <span className="hidden sm:inline">Switch Subject</span>
        <span className="sm:hidden">Switch</span>
      </button>

      <div className="hidden h-11 w-px bg-[#2E271D] lg:block" />

      {/* Current Subject Header Info */}
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="hex hidden h-9 w-10 shrink-0 place-items-center bg-[#2A2318] text-[var(--amber)] sm:grid">
          <BookOpen size={16} strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[clamp(13px,1.35vw,20px)] font-bold leading-tight text-[var(--cream)]">
            {currentSubject.fullName}
          </h1>
          <div className="flex items-center gap-1.5 truncate text-[clamp(9.5px,0.8vw,11.5px)] font-medium text-[var(--taupe)]">
            <span className="font-bold text-[var(--amber)] tracking-wide">
              {currentSubject.code}
            </span>
            <span aria-hidden="true" className="text-[#4A3F2C]">·</span>
            <span className="flex items-center gap-1">
              <Calendar size={11} className="inline opacity-70" />
              {currentSubject.examDate}
            </span>
            <span aria-hidden="true" className="text-[#4A3F2C]">·</span>
            <span>{sessionLabel}</span>
            {currentSubject.code === 'CS3691' && (
              <>
                <span aria-hidden="true" className="text-[#4A3F2C]">·</span>
                <span className="hidden sm:inline text-[var(--cream)] font-medium">
                  26 Questions · 5 Units
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Stats & Actions */}
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="hidden items-center gap-1.5 rounded-full border border-[#3A3123] bg-[#201A12] px-3 py-1.5 lg:flex">
          <Flame size={15} strokeWidth={1.5} className="text-[var(--amber)]" />
          <span className="whitespace-nowrap text-[11px] font-semibold text-[var(--cream)]">
            {streak} Day Streak
          </span>
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
