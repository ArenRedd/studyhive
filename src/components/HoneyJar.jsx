import { useEffect, useRef, useState } from 'react';

const Wave = ({ className, fill, opacity = 1 }) => (
  <svg
    className={`pointer-events-none absolute left-0 w-[200%] ${className}`}
    viewBox="0 0 400 24"
    preserveAspectRatio="none"
    aria-hidden="true"
    style={{ opacity }}
  >
    <path
      d="M0 12 Q12.5 2 25 12 T50 12 T75 12 T100 12 T125 12 T150 12 T175 12 T200 12 T225 12 T250 12 T275 12 T300 12 T325 12 T350 12 T375 12 T400 12 V24 H0 Z"
      fill={fill}
    />
  </svg>
);

export default function HoneyJar({ percent, completed, total }) {
  const [display, setDisplay] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = current.current;
    const to = percent;
    if (from === to) return;
    if (reduce) {
      current.current = to;
      setDisplay(to);
      return;
    }
    let frame;
    const start = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      const value = Math.round(from + (to - from) * eased);
      current.current = value;
      setDisplay(value);
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [percent]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-[186px] w-[172px] sm:h-[200px] sm:w-[186px]">
        {/* cork lid */}
        <div
          className="absolute -top-1 left-1/2 z-20 h-6 w-[52px] -translate-x-1/2 rounded-[3px]"
          style={{ background: 'linear-gradient(180deg,#B98A57,#7E5730)' }}
        />
        <div
          className="absolute top-4 left-1/2 z-20 h-2.5 w-[70px] -translate-x-1/2 rounded-full"
          style={{
            background: 'linear-gradient(180deg,#A87B4C,#6E4B29)',
            boxShadow: 'inset 0 1px 0 rgba(244,235,217,0.25)',
          }}
        />
        {/* twine */}
        <div className="absolute top-[26px] left-1/2 z-20 h-[2px] w-[86px] -translate-x-1/2 rounded-full bg-[#C9A46A]/70" />

        {/* jar body */}
        <div
          className="hex relative h-full w-full overflow-hidden"
          style={{
            background: 'linear-gradient(180deg,#2C2418 0%,#1A1610 70%)',
            boxShadow: 'inset 0 0 0 2px #4A3B22',
          }}
        >
          {/* honey fill */}
          <div
            className="absolute inset-x-0 bottom-0 transition-[height] duration-700 ease-out"
            style={{ height: `${percent}%` }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg,#FFC93C 0%,#F5B301 42%,#B9760A 100%)' }}
            />
            <Wave className="-top-[9px] h-[18px] wave-a" fill="#FFD66B" />
            <Wave className="-top-[6px] h-[14px] wave-b" fill="#FFC93C" opacity={0.75} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
          </div>

          {/* glass highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-none bg-gradient-to-br from-white/[0.06] via-transparent to-black/25" />

          {/* text */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center pt-3">
            <span className="text-[clamp(26px,3.3vw,34px)] font-extrabold leading-none tracking-tight text-[var(--cream)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
              {display}%
            </span>
            <span className="mt-1 text-[clamp(10px,1vw,12px)] font-semibold text-[#FFF3D6] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
              Progress
            </span>
            <span className="mt-2 rounded-full bg-black/35 px-2 py-0.5 text-[9.5px] font-semibold text-[#FFE9B0]">
              {completed} of {total} done
            </span>
          </div>
        </div>

        {/* drip */}
        <div
          className="absolute -bottom-2 left-1/2 h-3 w-2 -translate-x-1/2 rounded-b-full"
          style={{ background: 'linear-gradient(180deg,#F5B301,#C98A05)' }}
        />
        <div className="absolute -bottom-4 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[rgba(245,179,1,0.7)]" />
      </div>
    </div>
  );
}