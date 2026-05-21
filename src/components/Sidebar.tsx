import { Home, BrainCircuit, Shuffle, FolderOpen, User, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink as RouterNavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

interface SidebarProps { isDark: boolean }

export default function Sidebar({ isDark }: SidebarProps) {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: <Home className="w-4 h-4 flex-shrink-0" />, label: t('nav.home') },
    { path: '/ml', icon: <BrainCircuit className="w-4 h-4 flex-shrink-0" />, label: t('nav.ml') },
    { path: '/sampling', icon: <Shuffle className="w-4 h-4 flex-shrink-0" />, label: t('nav.sampling') },
    { path: '/projects', icon: <FolderOpen className="w-4 h-4 flex-shrink-0" />, label: t('nav.projects') },
    { path: '/about', icon: <User className="w-4 h-4 flex-shrink-0" />, label: t('nav.about') },
    { path: '/contact', icon: <Mail className="w-4 h-4 flex-shrink-0" />, label: t('nav.contact') },
  ];

  const bg     = isDark ? 'rgba(0,0,0,0.8)'     : 'rgba(255,255,255,0.85)';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const nameColor   = isDark ? '#ffffff' : '#000000';
  const inactiveClr = isDark ? '#a1a1aa' : '#52525b';
  const hoverBg     = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

  const activeStyle: React.CSSProperties = isDark
    ? { background: '#ffffff', color: '#000000', boxShadow: '0 4px 12px rgba(255,255,255,0.1)' }
    : { background: '#000000', color: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };

  return (
    <>
      {/* ── Desktop Top Header Navigation ── */}
      <header
        className="hidden md:flex flex-row items-center justify-between w-full h-16 sticky top-0 z-50 px-8"
        style={{
          background: bg,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${border}`,
          transition: 'background 0.5s ease, border-color 0.5s ease',
        }}
      >
        {/* Left Section: Logo & Brand Name */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #d946ef, #6366f1)',
              boxShadow: '0 0 16px rgba(217,70,239,0.3)',
            }}
          >
            K
          </div>
          <span
            className="font-extrabold text-lg tracking-tight"
            style={{ color: nameColor, transition: 'color 0.5s' }}
          >
            KaSao
          </span>
        </div>

        {/* Middle Section: Links */}
        <nav className="flex items-center gap-1.5">
          {navItems.map((item) => (
            <RouterNavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className="flex items-center px-4 py-1.5 rounded-xl font-semibold text-xs transition-all duration-200 gap-2"
              style={({ isActive }) => ({
                ...(isActive ? activeStyle : { color: inactiveClr }),
                minHeight: 36,
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                const isActive = el.classList.contains('active');
                if (!isActive) {
                  el.style.background = hoverBg;
                  el.style.color = nameColor;
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                const isActive = el.classList.contains('active');
                if (!isActive) {
                  el.style.background = 'transparent';
                  el.style.color = inactiveClr;
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </RouterNavLink>
          ))}
        </nav>

        {/* Right Section: Toggles */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </header>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 py-2"
        style={{
          background: isDark ? 'rgba(0,0,0,0.88)' : 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: `1px solid ${border}`,
        }}
      >
        {navItems.map((item) => (
          <RouterNavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 text-[10px] font-semibold"
            style={({ isActive }) => isActive ? activeStyle : { color: inactiveClr }}
          >
            {item.icon}
            <span>{item.label}</span>
          </RouterNavLink>
        ))}
        {/* Theme + Language on mobile — in bottom nav area */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </nav>
    </>
  );
}
