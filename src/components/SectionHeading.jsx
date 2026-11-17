export default function SectionHeading({ children }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#3A3123]" />
      <span className="hex h-2 w-2.5 bg-[var(--amber)]" />
      <h2 className="whitespace-nowrap text-[clamp(11px,1vw,13px)] font-bold uppercase tracking-[0.16em] text-[var(--cream)]">
        {children}
      </h2>
      <span className="hex h-2 w-2.5 bg-[var(--amber)]" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#3A3123]" />
    </div>
  );
}