import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/data/nav';

export default function Sidebar() {
  return (
    <aside className="relative z-20 hidden w-[204px] shrink-0 flex-col gap-1.5 px-3 pb-2 pt-1 md:flex xl:w-[228px] xl:px-4">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} aria-label={item.label}>
            {({ isActive }) => (
              <span
                className={cn(
                  'nav-clip flex items-center justify-center gap-3 px-3.5 py-2.5 text-[clamp(11px,0.95vw,13px)] font-semibold transition-all duration-200 hover:translate-x-1 lg:justify-start',
                  isActive
                    ? 'amber-grad text-[#2A1F05] shadow-[0_6px_18px_rgba(245,179,1,0.22)]'
                    : 'bg-[#1B1710] text-[#CFC3AC] hover:text-[var(--cream)]',
                )}
                style={
                  isActive
                    ? undefined
                    : { boxShadow: 'inset 0 0 0 1px #38301F' }
                }
              >
                <Icon size={17} strokeWidth={1.5} className="shrink-0" />
                <span className="hidden truncate lg:inline">{item.label}</span>
              </span>
            )}
          </NavLink>
        );
      })}
    </aside>
  );
}