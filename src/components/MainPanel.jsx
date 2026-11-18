import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { useSubject } from '@/context/SubjectContext';

export default function MainPanel() {
  const navigate = useNavigate();
  const { currentSubject } = useSubject();

  const sessionLabel =
    currentSubject.session === 'FN' ? 'Forenoon (FN)' : 'Afternoon (AN)';

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
          Question sets, unit-wise practice banks, and revision checklists for{' '}
          <span className="text-[var(--cream)] font-semibold">{currentSubject.fullName}</span>{' '}
          are being curated for the Nov/Dec 2026 examination sitting ({currentSubject.examDate} · {sessionLabel}).
        </p>

        <div className="flex items-center gap-2 text-xs text-[#8C7E6A] pt-1">
          <Clock size={13} />
          <span>Questions will be provided soon for this subject</span>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => navigate('/subjects')}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--amber)] bg-[var(--amber)] px-5 py-2.5 text-xs font-bold text-[#14110D] hover:bg-[var(--gold)] transition-colors cursor-pointer shadow-lg shadow-[rgba(245,179,1,0.2)]"
          >
            <ArrowLeft size={15} />
            Switch Subject
          </button>
        </div>
      </div>
    </section>
  );
}
