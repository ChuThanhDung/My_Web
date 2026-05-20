import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

export default function Layout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100">
      <Sidebar />
      
      <main className="flex-1 w-full relative pb-20 md:pb-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
              K
            </div>
            <span className="font-bold text-lg dark:text-white">KaSao Portfolio</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
