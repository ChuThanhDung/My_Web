import { useState, useEffect } from 'react';
import { Home, BrainCircuit, Shuffle, FolderOpen, User, Mail, Terminal, ChevronUp, ChevronDown, Sliders, Settings, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { playClickSound, playSwitchSound } from '../lib/audio';

const ACCENT_COLORS = [
  { name: 'Indigo', hex: '#6366f1', rgb: '99 102 241' },
  { name: 'Violet', hex: '#8b5cf6', rgb: '139 92 246' },
  { name: 'Emerald', hex: '#10b981', rgb: '16 185 129' },
  { name: 'Rose', hex: '#f43f5e', rgb: '244 63 94' },
  { name: 'Amber', hex: '#f59e0b', rgb: '245 158 11' },
  { name: 'Cyan', hex: '#06b6d4', rgb: '6 182 212' },
];

interface SidebarProps { isDark: boolean }

export default function Sidebar({ isDark }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  const [isHeaderPinned, setIsHeaderPinned] = useState(() => {
    return localStorage.getItem('header_pinned') === 'true';
  });

  const [isHeaderVisible, setIsHeaderVisible] = useState(() => {
    const pinned = localStorage.getItem('header_pinned') === 'true';
    if (pinned) return true;
    const saved = localStorage.getItem('header_visible');
    return saved !== 'false';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [particleDensity, setParticleDensity] = useState(() => localStorage.getItem('particles_density') || 'medium');
  const [particleInteractive, setParticleInteractive] = useState(() => localStorage.getItem('particles_interactive') !== 'false');
  const [reduceMotion, setReduceMotion] = useState(() => localStorage.getItem('reduce_motion') === 'true');
  const [systemSounds, setSystemSounds] = useState(() => localStorage.getItem('system_sounds') !== 'false');
  const [accentColorHex, setAccentColorHex] = useState(() => localStorage.getItem('accent_color_hex') || '#6366f1');


  useEffect(() => {
    const handleToggleSettings = () => {
      setIsSettingsOpen(prev => !prev);
    };
    window.addEventListener('toggle-settings', handleToggleSettings);
    return () => {
      window.removeEventListener('toggle-settings', handleToggleSettings);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('header_visible', String(isHeaderVisible));
  }, [isHeaderVisible]);

  useEffect(() => {
    if (isHeaderPinned) {
      setIsHeaderVisible(true);
    }
  }, [isHeaderPinned]);

  const navItems = [
    { path: '/', icon: <Home className="w-4 h-4 flex-shrink-0" />, label: t('nav.home') },
    { path: '/ml', icon: <BrainCircuit className="w-4 h-4 flex-shrink-0" />, label: t('nav.ml') },
    { path: '/sampling', icon: <Shuffle className="w-4 h-4 flex-shrink-0" />, label: t('nav.sampling') },
    { path: '/pro-tools', icon: <Sliders className="w-4 h-4 flex-shrink-0" />, label: t('nav.pro_tools') },
    { path: '/tools', icon: <Terminal className="w-4 h-4 flex-shrink-0" />, label: t('nav.tools') },
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
      <AnimatePresence initial={false}>
        {isHeaderVisible ? (
          <>
            <motion.header
            key="desktop-header"
            initial={{ height: 0, opacity: 0, y: -64 }}
            animate={{ height: 64, opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -64 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden md:flex flex-row items-center justify-between w-full h-16 sticky top-0 z-50 px-8 overflow-hidden"
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
                  background: 'linear-gradient(135deg, #d946ef, rgb(var(--color-accent)))',
                  boxShadow: '0 0 16px rgb(var(--color-accent) / 0.35)',
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
                  onClick={() => playClickSound()}
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
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageToggle />

              {/* Settings Toggle Button */}
              <button
                onClick={() => {
                  playClickSound();
                  setIsSettingsOpen(!isSettingsOpen);
                }}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                title={isVi ? 'Cài đặt hệ thống' : 'System Settings'}
                aria-label="System Settings"
                style={{ color: isSettingsOpen ? 'rgb(var(--color-accent))' : inactiveClr }}
              >
                <Settings className={`w-5 h-5 ${isSettingsOpen ? 'rotate-45' : ''} transition-transform duration-300`} />
              </button>

              {!isHeaderPinned && (
                <button
                  onClick={() => {
                    playClickSound();
                    setIsHeaderVisible(false);
                  }}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                  title={t('nav.hide_header')}
                  aria-label={t('nav.hide_header')}
                  style={{ color: inactiveClr }}
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.header>

          {/* Settings panel placed outside header to avoid overflow-hidden clipping */}
          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed right-4 md:right-8 top-20 w-[calc(100%-2rem)] md:w-80 rounded-2xl p-5 border shadow-2xl z-[60] backdrop-blur-xl animate-fadeUp"
                style={{
                  background: isDark ? 'rgba(8, 8, 8, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                  color: nameColor
                }}
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">
                    {t('settings.title')}
                  </span>
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsSettingsOpen(false);
                    }}
                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
                  {/* Pin navigation setting */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4 select-none">
                      <span className="block text-xs font-bold">
                        {t('settings.pin_menu')}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">
                        {t('settings.pin_menu_desc')}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const next = !isHeaderPinned;
                        setIsHeaderPinned(next);
                        localStorage.setItem('header_pinned', String(next));
                        playSwitchSound(next);
                        if (next) {
                          setIsHeaderVisible(true);
                          localStorage.setItem('header_visible', 'true');
                        }
                      }}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 flex-shrink-0 ${
                        isHeaderPinned ? 'bg-accent' : 'bg-slate-400 dark:bg-slate-700'
                      }`}
                    >
                      <motion.div
                        layout
                        className="bg-white w-4 h-4 rounded-full shadow-md"
                        animate={{ x: isHeaderPinned ? 16 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  {/* Accent Color setting */}
                  <div className="flex flex-col gap-2 select-none border-t border-slate-200 dark:border-slate-800 pt-3">
                    <div>
                      <span className="block text-xs font-bold">
                        {t('settings.accent_color')}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">
                        {t('settings.accent_color_desc')}
                      </span>
                    </div>
                    <div className="flex gap-2.5 mt-1.5 flex-wrap justify-start">
                      {ACCENT_COLORS.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            playClickSound();
                            setAccentColorHex(c.hex);
                            localStorage.setItem('accent_color_hex', c.hex);
                            localStorage.setItem('accent_color_rgb', c.rgb);
                            window.dispatchEvent(new Event('settings-changed'));
                          }}
                          className="w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
                          style={{
                            backgroundColor: c.hex,
                            borderColor: accentColorHex === c.hex
                              ? (isDark ? '#ffffff' : '#000000')
                              : 'transparent',
                            boxShadow: accentColorHex === c.hex
                              ? `0 0 8px ${c.hex}`
                              : 'none',
                            transform: accentColorHex === c.hex ? 'scale(1.1)' : 'scale(1)'
                          }}
                          title={c.name}
                          aria-label={`Select accent color ${c.name}`}
                        />
                      ))}
                    </div>
                  </div>


                  {/* Particle density setting */}
                  <div className="flex flex-col gap-1.5 select-none border-t border-slate-200 dark:border-slate-800 pt-3">
                    <div>
                      <span className="block text-xs font-bold">
                        {t('settings.particle_density')}
                      </span>
                      <span className="block text-[10px] text-slate-400 leading-normal">
                        {t('settings.particle_density_desc')}
                      </span>
                    </div>
                    <div className="flex gap-1 mt-1 bg-black/5 dark:bg-black/40 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                      {(['none', 'low', 'medium', 'high'] as const).map((density) => (
                        <button
                          key={density}
                          onClick={() => {
                            playClickSound();
                            setParticleDensity(density);
                            localStorage.setItem('particles_density', density);
                            window.dispatchEvent(new Event('settings-changed'));
                          }}
                          className={`flex-1 py-1 rounded-md text-[9px] font-mono font-bold uppercase transition-all ${
                            particleDensity === density
                              ? 'bg-white dark:bg-white text-black font-black shadow-sm'
                              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                          }`}
                        >
                          {density === 'none' ? (isVi ? 'Tắt' : 'Off') : density}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Particle interactive setting */}
                  <div className="flex justify-between items-start border-t border-slate-200 dark:border-slate-800 pt-3">
                    <div className="flex-1 pr-4 select-none">
                      <span className="block text-xs font-bold">
                        {t('settings.mouse_interaction')}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">
                        {t('settings.mouse_interaction_desc')}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const next = !particleInteractive;
                        setParticleInteractive(next);
                        localStorage.setItem('particles_interactive', String(next));
                        playSwitchSound(next);
                        window.dispatchEvent(new Event('settings-changed'));
                      }}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 flex-shrink-0 ${
                        particleInteractive ? 'bg-accent' : 'bg-slate-400 dark:bg-slate-700'
                      }`}
                    >
                      <motion.div
                        layout
                        className="bg-white w-4 h-4 rounded-full shadow-md"
                        animate={{ x: particleInteractive ? 16 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  {/* Reduce Motion setting */}
                  <div className="flex justify-between items-start border-t border-slate-200 dark:border-slate-800 pt-3">
                    <div className="flex-1 pr-4 select-none">
                      <span className="block text-xs font-bold">
                        {t('settings.reduce_motion')}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">
                        {t('settings.reduce_motion_desc')}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const next = !reduceMotion;
                        setReduceMotion(next);
                        localStorage.setItem('reduce_motion', String(next));
                        playSwitchSound(next);
                        window.dispatchEvent(new Event('settings-changed'));
                      }}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 flex-shrink-0 ${
                        reduceMotion ? 'bg-accent' : 'bg-slate-400 dark:bg-slate-700'
                      }`}
                    >
                      <motion.div
                        layout
                        className="bg-white w-4 h-4 rounded-full shadow-md"
                        animate={{ x: reduceMotion ? 16 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  {/* Sound Effects setting */}
                  <div className="flex justify-between items-start border-t border-slate-200 dark:border-slate-800 pt-3">
                    <div className="flex-1 pr-4 select-none">
                      <span className="block text-xs font-bold">
                        {t('settings.sound_effects')}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">
                        {t('settings.sound_effects_desc')}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const next = !systemSounds;
                        setSystemSounds(next);
                        localStorage.setItem('system_sounds', String(next));
                        playSwitchSound(next);
                      }}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 flex-shrink-0 ${
                        systemSounds ? 'bg-accent' : 'bg-slate-400 dark:bg-slate-700'
                      }`}
                    >
                      <motion.div
                        layout
                        className="bg-white w-4 h-4 rounded-full shadow-md"
                        animate={{ x: systemSounds ? 16 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </>
        ) : (
          <motion.button
            key="show-header-btn"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              playClickSound();
              setIsHeaderVisible(true);
            }}
            className="fixed top-4 right-8 z-50 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-xl border hover:scale-105 transition-all"
            style={{
              background: bg,
              borderColor: border,
              color: nameColor,
            }}
            title={t('nav.show_header')}
          >
            <ChevronDown className="w-4 h-4 text-accent" />
            <span>{t('nav.show_header')}</span>
          </motion.button>
        )}
      </AnimatePresence>
 
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
            onClick={() => playClickSound()}
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
          <button
            onClick={() => {
              playClickSound();
              setIsSettingsOpen(!isSettingsOpen);
            }}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
            style={{ color: isSettingsOpen ? 'rgb(var(--color-accent))' : inactiveClr }}
            title={t('settings.title')}
            aria-label="Settings"
          >
            <Settings className={`w-4 h-4 ${isSettingsOpen ? 'rotate-45' : ''} transition-transform duration-300`} />
          </button>
        </div>
      </nav>
    </>
  );
}
