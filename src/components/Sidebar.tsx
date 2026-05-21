import { Home, BrainCircuit, FolderOpen, User, Mail, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

interface SidebarProps { isDark: boolean }

export default function Sidebar({ isDark }: SidebarProps) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/', icon: <Home className="w-5 h-5 flex-shrink-0" />, label: t('nav.home') },
    { path: '/ml', icon: <BrainCircuit className="w-5 h-5 flex-shrink-0" />, label: t('nav.ml') },
    { path: '/projects', icon: <FolderOpen className="w-5 h-5 flex-shrink-0" />, label: t('nav.projects') },
    { path: '/about', icon: <User className="w-5 h-5 flex-shrink-0" />, label: t('nav.about') },
    { path: '/contact', icon: <Mail className="w-5 h-5 flex-shrink-0" />, label: t('nav.contact') },
  ];

  const bg     = isDark ? 'rgba(2,6,23,0.70)'     : 'rgba(241,245,249,0.85)';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const nameColor   = isDark ? '#ffffff' : '#0f172a';
  const inactiveClr = isDark ? '#94a3b8' : '#475569';
  const hoverBg     = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const toggleBtnBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const activeStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #d946ef, #6366f1)',
    boxShadow: '0 4px 20px rgba(217,70,239,0.35)',
  };

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 280 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="hidden md:flex flex-col h-screen sticky top-0 z-50 overflow-hidden"
        style={{
          background: bg,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: `1px solid ${border}`,
          transition: 'background 0.5s ease',
          minWidth: collapsed ? 72 : 280,
        }}
      >
        {/* ── TOP BAR: Logo + Controls + Collapse btn ── */}
        <div
          className="flex items-center px-4 py-5 gap-3"
          style={{ borderBottom: `1px solid ${border}` }}
        >
          {/* Logo icon — always visible */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #d946ef, #6366f1)',
              boxShadow: '0 0 20px rgba(217,70,239,0.4)',
            }}
          >
            K
          </div>

          {/* Name + controls — hidden when collapsed */}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="expanded-header"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 flex-1 overflow-hidden"
              >
                <span
                  className="font-extrabold text-xl tracking-tight whitespace-nowrap flex-1"
                  style={{ color: nameColor, transition: 'color 0.5s' }}
                >
                  KaSao
                </span>
                {/* Theme + Language — moved to top */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <ThemeToggle />
                  <LanguageToggle />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse toggle button */}
          <motion.button
            onClick={() => setCollapsed(c => !c)}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: toggleBtnBg, color: inactiveClr }}
            whileHover={{ scale: 1.1, color: nameColor }}
            whileTap={{ scale: 0.92 }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {collapsed ? (
                <motion.span
                  key="open"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15 }}
                >
                  <PanelLeftClose className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ── Nav links ── */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <RouterNavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              title={collapsed ? item.label : undefined}
              className="flex items-center rounded-xl font-semibold text-[15px] transition-all duration-200 overflow-hidden"
              style={({ isActive }) => ({
                ...(isActive ? activeStyle : { color: inactiveClr }),
                padding: collapsed ? '12px' : '12px 20px',
                gap: collapsed ? 0 : 16,
                justifyContent: collapsed ? 'center' : 'flex-start',
                minHeight: 48,
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                if (!el.style.background.includes('gradient')) {
                  el.style.background = hoverBg;
                  el.style.color = nameColor;
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                if (!el.style.background.includes('gradient')) {
                  el.style.background = 'transparent';
                  el.style.color = inactiveClr;
                }
              }}
            >
              {item.icon}
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    key={`label-${item.path}`}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </RouterNavLink>
          ))}
        </nav>
      </motion.aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 py-2"
        style={{
          background: isDark ? 'rgba(2,6,23,0.88)' : 'rgba(241,245,249,0.90)',
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
            style={({ isActive }) => isActive ? { ...activeStyle, color: '#fff' } : { color: inactiveClr }}
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
