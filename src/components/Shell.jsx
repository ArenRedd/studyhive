import { Outlet } from 'react-router-dom';
import { ProgressProvider } from '@/components/ProgressProvider';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import HoneycombBg from '@/components/HoneycombBg';

export default function Shell() {
  return (
    <ProgressProvider>
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[var(--bg)]">
        <HoneycombBg />
        <TopBar />
        <div className="relative z-10 flex min-h-0 flex-1">
          <Sidebar />
          <main className="thin-scroll min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
            <Outlet />
          </main>
        </div>
        <MobileNav />
      </div>
    </ProgressProvider>
  );
}