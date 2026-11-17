import { cn } from '@/lib/utils';

/**
 * Generic honeycomb cell: a hexagon whose inner honey level is `percent`.
 */
export default function HoneyHex({
  percent = 0,
  selected = false,
  onClick,
  className = '',
  innerClassName = '',
  pointy = true,
  ariaLabel,
  children,
}) {
  const clip = pointy ? 'hex-pointy' : 'hex';
  const Tag = onClick ? 'button' : 'div';

  return (
    <div
      className={cn(
        'relative shrink-0 p-[2px] transition-transform duration-300',
        clip,
        selected ? 'bg-[var(--amber)]' : 'bg-[#3A3123]',
        className,
      )}
      style={selected ? { filter: 'drop-shadow(0 0 12px rgba(245,179,1,0.45))' } : undefined}
    >
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={onClick ? selected : undefined}
        className={cn(
          'relative block h-full w-full overflow-hidden bg-[#181410] text-center transition-colors duration-300',
          clip,
          onClick && 'cursor-pointer hover:bg-[#211B13]',
          innerClassName,
        )}
      >
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 honey-grad opacity-80 transition-[height] duration-700 ease-out"
          style={{ height: `${Math.max(0, Math.min(100, percent))}%` }}
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent" />
        <span className="relative z-10 flex h-full w-full flex-col items-center justify-center px-1.5">
          {children}
        </span>
      </Tag>
    </div>
  );
}