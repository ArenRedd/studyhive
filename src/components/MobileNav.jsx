import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOBILE_NAV_ITEMS } from '@/data/nav';

export default function MobileNav() {
  const navigate = useNavigate();

  return (
    <nav className="relative z-30 flex h-[62px] shrink-0 items-stretch justify-around border-t border-[#2E271D] bg-[#17130E] px-1 md:hidden">
      <button
        type="button"
        onClick={() => navigate('/subjects')}
        className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[var(--amber)] cursor-pointer"
        title="Switch Subject"
      >
        <span className="grid h-7 w-8 place-items-center rounded-md bg-[#251E14] border border-[var(--amber)]/30">
          <BookOpen size={16} strokeWidth={1.5} />
        </span>
        <span className="max-w-full truncate px-1 text-[9px] font-bold">
          Subjects
        </span>
      </button>

      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            aria-label={item.label}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-1"
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'grid h-7 w-8 place-items-center rounded-md transition-colors',
                    isActive ? 'amber-grad text-[#2A1F05]' : 'text-[#9A8F7C]',
                  )}
                >
                  <Icon size={16} strokeWidth={1.5} />
                </span>
                <span
                  className={cn(
                    'max-w-full truncate px-1 text-[9px] font-semibold',
                    isActive ? 'text-[var(--gold)]' : 'text-[#9A8F7C]',
                  )}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
