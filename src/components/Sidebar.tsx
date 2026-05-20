import { Home, BrainCircuit, FolderOpen, User, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink as RouterNavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

export default function Sidebar() {
  const { t } = useTranslation();
  
  const navItems = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: t('nav.home') },
    { path: '/ml', icon: <BrainCircuit className="w-5 h-5" />, label: t('nav.ml') },
    { path: '/projects', icon: <FolderOpen className="w-5 h-5" />, label: t('nav.projects') },
    { path: '/about', icon: <User className="w-5 h-5" />, label: t('nav.about') },
    { path: '/contact', icon: <Mail className="w-5 h-5" />, label: t('nav.contact') },
  ];

  return (
    <aside className="fixed bottom-0 w-full md:w-64 md:h-screen md:sticky md:top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transition-colors duration-300">
      <div className="hidden md:flex items-center gap-3 p-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl">
          N
        </div>
        <span className="font-bold text-xl tracking-tight dark:text-white">Portfolio</span>
      </div>
      
      <nav className="flex-1 px-4 py-2 md:py-6 flex md:flex-col justify-around md:justify-start gap-2 overflow-x-auto md:overflow-visible">
        {navItems.map((item) => (
          <RouterNavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            {item.icon}
            <span className="text-xs md:text-sm">{item.label}</span>
          </RouterNavLink>
        ))}
      </nav>
      
      <div className="hidden md:flex flex-col gap-4 p-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </aside>
  );
}
