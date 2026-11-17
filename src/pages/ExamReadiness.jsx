import HoneyHex from '@/components/HoneyHex';
import { useProgress } from '@/components/ProgressProvider';
import { units } from '@/data/units';

export default function ExamReadiness() {
  const { progress, selectUnit } = useProgress();

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-4 lg:px-6">
      <header className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--amber)]">Exam Readiness</p>
        <h1 className="mt-1 text-[clamp(18px,2.1vw,26px)] font-extrabold text-[var(--cream)]">
          How full is your hive?
        </h1>
        <p className="mt-1 text-[12px] text-[var(--taupe)]">
          Every unit's readiness is the share of questions you have marked complete.
        </p>
      </header>

      <section className="mb-4 flex flex-col gap-4 rounded-[16px] border border-[#2E271D] bg-[#1B1710] p-4 sm:flex-row sm:items-center sm:gap-6">
        <HoneyHex percent={progress.percent} className="h-[132px] w-[118px]" selected>
          <span className="text-[clamp(22px,2.6vw,30px)] font-extrabold leading-none text-[var(--cream)]">
            {progress.percent}%
          </span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-[#FFE9B0]">Ready</span>
        </HoneyHex>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-[var(--cream)]">
            {progress.completed} of {progress.total} questions complete
          </p>
          <p className="mt-1 text-[11.5px] text-[var(--taupe)]">
            {progress.remaining} cells still empty across {units.length} nests.
          </p>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#2E271D]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress.percent}%`,
                background: 'linear-gradient(90deg,#C98A05,#F5B301 55%,#FFD66B)',
              }}
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {units.map((unit) => {
          const stat = progress.byUnit[unit.id];
          return (
            <div
              key={unit.id}
              className="flex flex-col items-center gap-2 rounded-[14px] border border-[#2E271D] bg-[#1B1710] px-2 py-4"
            >
              <HoneyHex
                percent={stat.percent}
                onClick={() => selectUnit(unit.id)}
                className="h-[112px] w-[100px]"
                ariaLabel={`Unit ${unit.id} readiness ${stat.percent} percent`}
              >
                <div className="flex h-full w-full flex-col items-center justify-between py-3">
                  <span className="text-[12px] font-extrabold text-[var(--cream)]">{unit.id}</span>
                  <span className="text-[15px] font-extrabold text-[var(--cream)]">{stat.percent}%</span>
                </div>
              </HoneyHex>
              <p className="text-center text-[10.5px] font-semibold leading-tight text-[#D8CBB2]">{unit.shortTitle}</p>
              <p className="text-[9.5px] text-[var(--taupe)]">
                {stat.completed} / {stat.total} done
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}