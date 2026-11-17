import { Hexagon } from 'lucide-react';
import { units } from '@/data/units';

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 py-6 lg:px-6">
      <div className="relative overflow-hidden rounded-[18px] border border-[#2E271D] bg-[#1B1710] px-5 py-8 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-[rgba(245,179,1,0.1)] blur-3xl" />
        <div className="hex grid h-14 w-16 place-items-center bg-[#2A2318] text-[var(--amber)]">
          <Hexagon size={22} strokeWidth={1.5} />
        </div>
        <h1 className="mt-4 text-[clamp(18px,2.1vw,26px)] font-extrabold text-[var(--cream)]">{title}</h1>
        <p className="mt-2 max-w-[520px] text-[12.5px] leading-relaxed text-[var(--taupe)]">
          {description || 'This nest is being built. Your progress here will follow the same honey theme.'}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {units.map((unit) => (
            <span
              key={unit.id}
              className="hex-pointy flex h-10 w-11 items-center justify-center bg-[#221D15] text-[11px] font-bold text-[#D8CBB2]"
            >
              {unit.id}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}