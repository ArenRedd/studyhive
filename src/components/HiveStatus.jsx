import { Check, Hourglass, Hexagon } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { useProgress } from '@/components/ProgressProvider';

const Badge = ({ icon: Icon, value, label, tone }) => (
  <div className="flex min-w-0 flex-1 flex-col items-center">
    <div className="relative h-[80px] w-[70px] p-[2px] hex-pointy bg-[#4A3B22]">
      <div className="hex-pointy relative flex h-full w-full flex-col items-center justify-center bg-[#1A1610] px-1">
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#F5B301]/15 to-transparent" />
        <Icon size={15} strokeWidth={1.5} className={tone} />
        <span className="mt-0.5 text-[clamp(15px,1.5vw,19px)] font-extrabold leading-none text-[var(--cream)]">
          {value}
        </span>
        <span className="mt-0.5 max-w-full truncate text-[8.5px] font-semibold text-[var(--taupe)]">{label}</span>
      </div>
    </div>
  </div>
);

export default function HiveStatus() {
  const { progress } = useProgress();

  return (
    <section className="glossy rounded-[14px] border border-[#2E271D] bg-[#1B1710] px-3 py-3">
      <SectionHeading>Hive Status</SectionHeading>
      <div className="mt-3 flex items-start gap-1">
        <Badge icon={Check} value={progress.completed} label="Completed" tone="text-[#4CAF7A]" />
        <Badge icon={Hourglass} value={progress.remaining} label="Remaining" tone="text-[var(--amber)]" />
        <Badge icon={Hexagon} value={progress.total} label="Total" tone="text-[var(--gold)]" />
      </div>
    </section>
  );
}