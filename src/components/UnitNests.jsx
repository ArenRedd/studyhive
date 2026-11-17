import HoneyHex from '@/components/HoneyHex';
import SectionHeading from '@/components/SectionHeading';
import BeeSvg from '@/components/BeeSvg';
import { useProgress } from '@/components/ProgressProvider';
import { units } from '@/data/units';

function UnitHex({ unit, stat, selected, onSelect }) {
  return (
    <div className="relative">
      <HoneyHex
        percent={stat ? stat.percent : 0}
        selected={selected}
        onClick={() => onSelect(unit.id)}
        className="h-[104px] w-[92px] transition-transform duration-300 hover:-translate-y-0.5"
        ariaLabel={`Unit ${unit.id} – ${unit.title}, ${stat ? stat.percent : 0}% complete`}
      >
        <div className="flex h-full w-full flex-col items-center justify-between py-3">
          <span className="text-[13px] font-extrabold leading-none text-[var(--cream)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            {unit.id}
          </span>
          <span
            className="w-full px-1 text-[8.5px] font-semibold leading-[1.15] text-[#EADFC8]"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {unit.shortTitle}
          </span>
          <span className="rounded-full bg-black/40 px-1.5 text-[10px] font-bold text-[var(--gold)]">
            {stat ? stat.percent : 0}%
          </span>
        </div>
      </HoneyHex>
      {selected && (
        <div className="pointer-events-none absolute -right-2 -top-2 rotate-12">
          <BeeSvg className="h-7 w-9 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
        </div>
      )}
    </div>
  );
}

export default function UnitNests() {
  const { progress, selectedUnit, selectUnit } = useProgress();

  const render = (unit) => (
    <UnitHex
      key={unit.id}
      unit={unit}
      stat={progress.byUnit[unit.id]}
      selected={selectedUnit === unit.id}
      onSelect={selectUnit}
    />
  );

  return (
    <section className="glossy rounded-[14px] border border-[#2E271D] bg-[#1B1710] px-3 py-3">
      <SectionHeading>Unit Nests</SectionHeading>
      <div className="mt-3 flex flex-col items-center">
        <div className="flex items-start justify-center gap-1">{units.slice(0, 3).map(render)}</div>
        <div className="-mt-5 flex items-start justify-center gap-1">{units.slice(3).map(render)}</div>
      </div>
    </section>
  );
}