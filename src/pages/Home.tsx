import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BrainCircuit, FolderOpen, User, Mail, Sparkles, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { pageEnter, stagger, fadeUp, zoomReveal, cardHover, floatAnimation, inViewport } from '../lib/motion';
import { useIsDark } from '../hooks/useIsDark';

// ── Magnetic button effect ─────────────────────────────────────────────────
function MagneticButton({ children, className, to, style }: {
  children: React.ReactNode;
  className?: string;
  to: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 25 });
  const sy = useSpring(y, { stiffness: 300, damping: 25 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.28);
    y.set((e.clientY - cy) * 0.28);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={to}
      style={{ x: sx, y: sy, ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {children}
    </motion.a>
  );
}

// ── Parallax wrapper ───────────────────────────────────────────────────────
function ParallaxLayer({ children, speed = 0.15 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  return <motion.div ref={ref} style={{ y }}>{children}</motion.div>;
}

// ── Animated card styling ──────────────────────────────────────────────────
const cardColors: Record<string, { icon: string }> = {
  projects: { icon: 'text-blue-500' },
  ml:       { icon: 'text-purple-500' },
  about:    { icon: 'text-emerald-500' },
  contact:  { icon: 'text-rose-500' },
};

// ── Cluster points generator ───────────────────────────────────────────────
const generateClusterPoints = () => {
  const points = [];
  // Left cluster (c: 'red')
  for (let i = 0; i < 4; i++) {
    points.push({
      id: `left-${i}`,
      x: 35 + Math.random() * 25,
      y: 15 + Math.random() * 30,
      color: 'bg-red-500',
    });
  }
  // Right cluster (c: 'slate')
  for (let i = 0; i < 4; i++) {
    points.push({
      id: `right-${i}`,
      x: 125 + Math.random() * 25,
      y: 15 + Math.random() * 30,
      color: 'bg-slate-400',
    });
  }
  return points;
};

export default function Home() {
  const { t } = useTranslation();
  const isDark = useIsDark();

  const cards = [
    { to: '/projects', icon: FolderOpen, key: 'projects', title: t('nav.projects') },
    { to: '/ml',       icon: BrainCircuit, key: 'ml',     title: t('nav.ml') },
    { to: '/about',    icon: User,        key: 'about',   title: t('nav.about') },
    { to: '/contact',  icon: Mail,        key: 'contact', title: t('nav.contact') },
  ];

  const textColor = isDark ? '#ffffff' : '#000000';
  const subtextColor = isDark ? '#a1a1aa' : '#4b5563';

  const badgeStyle: React.CSSProperties = isDark
    ? { background: '#e2ff3b', border: '1px solid #e2ff3b', color: '#000000' }
    : { background: '#000000', border: '1px solid #000000', color: '#ffffff' };

  const primaryBtnStyle: React.CSSProperties = isDark
    ? {
        background: '#e2ff3b',
        color: '#000000',
        border: '1px solid #e2ff3b',
        boxShadow: '0 4px 20px rgba(226,255,59,0.15)',
      }
    : {
        background: '#000000',
        color: '#ffffff',
        border: '1px solid #000000',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      };

  const secondaryBtnStyle: React.CSSProperties = isDark
    ? { background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', color: '#ffffff' }
    : { background: 'transparent', border: '1px solid rgba(0,0,0,0.18)', color: '#000000' };

  const cardBg: React.CSSProperties = isDark
    ? { background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.08)' }
    : { background: 'rgba(0,0,0,0.01)', border: '1px solid rgba(0,0,0,0.08)' };

  // Parse title to extract final words for high contrast skew capsule
  const roleText = t('home.role');
  const words = roleText.split(' ');
  const mainText = words.length > 2 ? words.slice(0, -2).join(' ') : '';
  const highlightText = words.length > 2 ? words.slice(-2).join(' ') : roleText;

  // ── States for interactive Pro Tools ─────────────────────────────────────
  const [clusterPoints, setClusterPoints] = useState(() => generateClusterPoints());
  const [activeStep, setActiveStep] = useState<'IN' | 'PROC' | 'OUT'>('PROC');
  const [showKinoToast, setShowKinoToast] = useState(false);
  const [isMetersPlaying, setIsMetersPlaying] = useState(true);
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'kino'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') return 'light';
    if (localStorage.getItem('kino') === 'true') return 'kino';
    return 'dark';
  });
  const [metersMode, setMetersMode] = useState<'bass' | 'mid' | 'treble' | 'boost'>('boost');

  // Compute centroids dynamically
  const leftPoints = clusterPoints.filter(p => p.id.startsWith('left'));
  const rightPoints = clusterPoints.filter(p => p.id.startsWith('right'));
  const leftCentroid = {
    x: leftPoints.length ? leftPoints.reduce((sum, p) => sum + p.x, 0) / leftPoints.length : 50,
    y: leftPoints.length ? leftPoints.reduce((sum, p) => sum + p.y, 0) / leftPoints.length : 30,
  };
  const rightCentroid = {
    x: rightPoints.length ? rightPoints.reduce((sum, p) => sum + p.x, 0) / rightPoints.length : 130,
    y: rightPoints.length ? rightPoints.reduce((sum, p) => sum + p.y, 0) / rightPoints.length : 30,
  };

  const handleThemeChange = (theme: 'dark' | 'light' | 'kino') => {
    setThemeMode(theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      localStorage.setItem('kino', 'false');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      if (theme === 'kino') {
        localStorage.setItem('kino', 'true');
        setShowKinoToast(true);
        setTimeout(() => setShowKinoToast(false), 3000);
      } else {
        localStorage.setItem('kino', 'false');
      }
    }
    window.dispatchEvent(new Event('theme-changed'));
  };

  const cycleTheme = () => {
    const next = themeMode === 'dark' ? 'light' : themeMode === 'light' ? 'kino' : 'dark';
    handleThemeChange(next);
  };

  const cycleStep = () => {
    setActiveStep(prev => {
      if (prev === 'IN') return 'PROC';
      if (prev === 'PROC') return 'OUT';
      return 'IN';
    });
  };

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-16 md:gap-24 pt-8 md:pt-16 pb-12"
    >
      {/* ── Kino Toast Notification ── */}
      <AnimatePresence>
        {showKinoToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-[#e2ff3b] text-black font-black px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs border border-black/10 tracking-widest uppercase"
          >
            <Sparkles className="w-4 h-4 animate-spin text-black" />
            KINO Cinematic Mode Activated!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <motion.div variants={stagger(0.12)} initial="hidden" animate="visible" className="max-w-7xl relative z-10">

        {/* Cinematic Badge */}
        <motion.div variants={fadeUp} className="mb-6">
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"
            style={badgeStyle}
            whileHover={{ scale: 1.04 }}
          >
            <motion.span
              className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-black' : 'bg-white'}`}
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Sparkles className="w-3.5 h-3.5" />
            {t('home.greeting')} KaSao
          </motion.span>
        </motion.div>

        {/* Headline — cinematic editorial style */}
        <motion.h1 variants={zoomReveal} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1] md:leading-[1.05]">
          <span className="block" style={{ color: textColor }}>
            {mainText}
          </span>
          <span className="inline-block mt-3 md:mt-4">
            <span
              className="inline-block bg-[#e2ff3b] text-black font-black rotate-[-1.5deg] skew-x-[-3deg] px-5 py-1.5 md:py-2.5 rounded-sm"
              style={{ color: '#000000' }}
            >
              {highlightText}
            </span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl mb-10 leading-relaxed font-medium max-w-2xl"
          style={{ color: subtextColor }}
        >
          {t('home.intro')}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
          <MagneticButton
            to="/projects"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: '12px', fontWeight: 800, fontSize: '16px',
              textDecoration: 'none',
              ...primaryBtnStyle,
            }}
          >
            {t('home.cta_primary')}
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>

          <MagneticButton
            to="/contact"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: '12px', fontWeight: 800, fontSize: '16px',
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
              ...secondaryBtnStyle,
            }}
          >
            {t('nav.contact')}
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Cinematic light leak */}
      <motion.div
        className="absolute top-24 right-8 md:right-24 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(226,255,59,0.05), transparent 70%)',
          filter: 'blur(32px)',
        }}
        {...floatAnimation}
      />

      {/* ── Pro Tools Bento Section ── */}
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="flex flex-col gap-6 relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#e2ff3b] rounded-full" />
          <h2 className="text-xl md:text-2xl font-black tracking-tight" style={{ color: textColor }}>
            {t('home.pro_tools.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tool 1: PCA/Clustering */}
          <motion.div
            variants={fadeUp}
            onClick={() => setClusterPoints(generateClusterPoints())}
            className="p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 cursor-pointer select-none hover:border-red-500/30"
            style={cardBg}
          >
            <div>
              <span className="inline-block bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase">
                CLUSTER
              </span>
              <h3 className="text-base font-bold mt-4 mb-2" style={{ color: textColor }}>
                {t('home.pro_tools.tool_1_title')}
              </h3>
              <p className="text-xs leading-relaxed text-slate-400 font-medium">
                {t('home.pro_tools.tool_1_desc')}
              </p>
              {/* Coordinates display */}
              <div className="mt-3 font-mono text-[9px] text-slate-500/80 flex justify-between select-none">
                <span>{t('home.pro_tools.tool_1_centroid_a')}: ({leftCentroid.x.toFixed(0)}, {leftCentroid.y.toFixed(0)})</span>
                <span>{t('home.pro_tools.tool_1_centroid_b')}: ({rightCentroid.x.toFixed(0)}, {rightCentroid.y.toFixed(0)})</span>
              </div>
            </div>
            {/* Visualizer */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setClusterPoints(generateClusterPoints());
              }}
              className="h-16 w-full mt-4 bg-slate-950/40 rounded-lg border border-slate-900 flex items-center justify-center relative overflow-hidden cursor-pointer select-none group-hover:border-red-500/40 transition-colors"
            >
              {/* Lines from points to centroids */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
                {leftPoints.map(p => (
                  <line
                    key={`line-${p.id}`}
                    x1={p.x}
                    y1={p.y}
                    x2={leftCentroid.x}
                    y2={leftCentroid.y}
                    stroke="#ef4444"
                    strokeWidth="0.8"
                  />
                ))}
                {rightPoints.map(p => (
                  <line
                    key={`line-${p.id}`}
                    x1={p.x}
                    y1={p.y}
                    x2={rightCentroid.x}
                    y2={rightCentroid.y}
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                  />
                ))}
              </svg>

              {/* Centroids */}
              <div 
                className="absolute w-2 h-2 rounded-full bg-red-500 border border-white/40 z-10 transition-all duration-300"
                style={{ left: leftCentroid.x - 4, top: leftCentroid.y - 4 }}
              />
              <div 
                className="absolute w-2 h-2 rounded-full bg-slate-400 border border-white/40 z-10 transition-all duration-300"
                style={{ left: rightCentroid.x - 4, top: rightCentroid.y - 4 }}
              />

              {/* Cluster points */}
              {clusterPoints.map(p => (
                <motion.div
                  key={p.id}
                  layoutId={p.id}
                  className={`absolute w-1.5 h-1.5 rounded-full ${p.color}`}
                  animate={{ left: p.x - 3, top: p.y - 3 }}
                  transition={{ type: 'spring', stiffness: 140, damping: 15 }}
                />
              ))}

              <div className="absolute top-1 right-2 text-[8px] font-mono text-red-400 bg-red-950/60 border border-red-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                {t('home.pro_tools.tool_1_action')}
              </div>
            </div>
          </motion.div>

          {/* Tool 2: Manual Control */}
          <motion.div
            variants={fadeUp}
            onClick={cycleStep}
            className="p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 cursor-pointer select-none hover:border-pink-500/30"
            style={cardBg}
          >
            <div>
              <span className="inline-block bg-pink-500/10 text-pink-500 border border-pink-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase">
                PIPELINE
              </span>
              <h3 className="text-base font-bold mt-4 mb-2" style={{ color: textColor }}>
                {t('home.pro_tools.tool_2_title')}
              </h3>
              <p className="text-xs leading-relaxed text-slate-400 font-medium">
                {t('home.pro_tools.tool_2_desc')}
              </p>
            </div>
            {/* Visualizer */}
            <div>
              <div className="h-16 w-full mt-4 bg-slate-950/40 rounded-lg border border-slate-900 flex items-center justify-between px-3 select-none">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStep('IN');
                  }}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all ${
                    activeStep === 'IN' 
                      ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400 font-bold' 
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded ${activeStep === 'IN' ? 'bg-pink-500 animate-pulse' : 'bg-slate-700'}`} />
                  <span className="text-[9px] font-mono">IN</span>
                </button>
                
                <div className="text-slate-750 text-xs font-mono select-none">→</div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStep('PROC');
                  }}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all ${
                    activeStep === 'PROC' 
                      ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400 font-bold' 
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${activeStep === 'PROC' ? 'bg-pink-500 animate-ping' : 'bg-slate-700'}`} />
                  <span className="text-[9px] font-mono">PROC</span>
                </button>

                <div className="text-slate-750 text-xs font-mono select-none">→</div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStep('OUT');
                  }}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all ${
                    activeStep === 'OUT' 
                      ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400 font-bold' 
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded ${activeStep === 'OUT' ? 'bg-pink-500 animate-pulse' : 'bg-slate-700'}`} />
                  <span className="text-[9px] font-mono">OUT</span>
                </button>
              </div>

              {/* Log output panel */}
              <div className="mt-3 p-2 bg-black/60 rounded border border-slate-900/60 font-mono text-[9px] text-pink-450/90 min-h-[32px] flex items-center leading-normal select-none">
                <span className="animate-pulse mr-1 text-pink-500 font-bold">›</span>
                <span>
                  {activeStep === 'IN' && t('home.pro_tools.tool_2_status_in')}
                  {activeStep === 'PROC' && t('home.pro_tools.tool_2_status_proc')}
                  {activeStep === 'OUT' && t('home.pro_tools.tool_2_status_out')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Tool 3: Themes */}
          <motion.div
            variants={fadeUp}
            onClick={cycleTheme}
            className="p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 cursor-pointer select-none hover:border-yellow-500/30"
            style={cardBg}
          >
            <div>
              <span
                className="inline-block bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase"
                style={{ color: isDark ? '#e2ff3b' : '#a1a1aa', borderColor: isDark ? 'rgba(226,255,59,0.2)' : 'rgba(0,0,0,0.1)' }}
              >
                THEME
              </span>
              <h3 className="text-base font-bold mt-4 mb-2" style={{ color: textColor }}>
                {t('home.pro_tools.tool_3_title')}
              </h3>
              <p className="text-xs leading-relaxed text-slate-400 font-medium">
                {t('home.pro_tools.tool_3_desc')}
              </p>
            </div>
            {/* Visualizer */}
            <div>
              <div className="h-16 w-full mt-4 bg-slate-950/40 rounded-lg border border-slate-900 flex items-center justify-center gap-1.5 px-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleThemeChange('dark'); }}
                  className={`flex-1 py-1 px-1 rounded border text-[9px] font-mono transition-all font-bold ${
                    themeMode === 'dark'
                      ? 'border-white bg-white text-black' 
                      : 'border-slate-800 bg-black text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t('home.pro_tools.theme_dark')}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleThemeChange('light'); }}
                  className={`flex-1 py-1 px-1 rounded border text-[9px] font-mono transition-all font-bold ${
                    themeMode === 'light'
                      ? 'border-black bg-black text-white' 
                      : 'border-slate-800 bg-black text-slate-500 hover:text-slate-350'
                  }`}
                >
                  {t('home.pro_tools.theme_light')}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleThemeChange('kino'); }}
                  className={`flex-1 py-1 px-1 rounded border text-[9px] font-mono transition-all font-bold ${
                    themeMode === 'kino' 
                      ? 'border-[#e2ff3b] bg-[#e2ff3b] text-black shadow-[0_0_12px_rgba(226,255,59,0.3)]' 
                      : 'border-[#e2ff3b]/40 bg-[#e2ff3b]/10 text-[#e2ff3b] hover:bg-[#e2ff3b]/20'
                  }`}
                >
                  {t('home.pro_tools.theme_kino')}
                </button>
              </div>

              {/* Status display */}
              <div className="mt-3 p-1.5 bg-black/60 rounded border border-slate-900/60 font-mono text-[9px] text-yellow-500/80 text-center select-none">
                {themeMode === 'dark' && `${t('home.pro_tools.theme_dark')} Mode Active`}
                {themeMode === 'light' && `${t('home.pro_tools.theme_light')} Mode Active`}
                {themeMode === 'kino' && `${t('home.pro_tools.theme_kino')} Mode Active`}
              </div>
            </div>
          </motion.div>

          {/* Tool 4: Audio meters */}
          <motion.div
            variants={fadeUp}
            onClick={() => setIsMetersPlaying(!isMetersPlaying)}
            className="p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 cursor-pointer select-none hover:border-blue-500/30"
            style={cardBg}
          >
            <div>
              <span className="inline-block bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase">
                METERS
              </span>
              <h3 className="text-base font-bold mt-4 mb-2" style={{ color: textColor }}>
                {t('home.pro_tools.tool_4_title')}
              </h3>
              <p className="text-xs leading-relaxed text-slate-400 font-medium">
                {t('home.pro_tools.tool_4_desc')}
              </p>
            </div>
            {/* Visualizer and dynamic bars */}
            <div>
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMetersPlaying(!isMetersPlaying);
                }}
                className="h-16 w-full mt-4 bg-slate-950/40 rounded-lg border border-slate-900 flex items-end justify-center gap-1.5 pb-2 px-6 relative cursor-pointer select-none group-hover:border-blue-500/40 transition-colors"
              >
                {/* Play/Pause indicators overlay */}
                <div className="absolute top-1.5 right-2 opacity-40 group-hover:opacity-80 transition-opacity">
                  {isMetersPlaying ? <Pause className="w-2.5 h-2.5 text-blue-400" /> : <Play className="w-2.5 h-2.5 text-blue-400" />}
                </div>

                {(() => {
                  const getBarHeights = () => {
                    switch (metersMode) {
                      case 'bass':   return [90, 75, 40, 20, 10];
                      case 'mid':    return [20, 60, 85, 55, 20];
                      case 'treble': return [10, 20, 45, 75, 95];
                      case 'boost':  default: return [95, 90, 95, 90, 95];
                    }
                  };
                  const barHeights = getBarHeights();
                  return barHeights.map((maxHeight, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-full rounded-t-sm ${metersMode === 'boost' ? 'bg-[#e2ff3b]/90' : 'bg-blue-500/80'}`}
                      animate={isMetersPlaying ? {
                        height: [
                          '15%',
                          `${maxHeight}%`,
                          '15%'
                        ]
                      } : {
                        height: '20%'
                      }}
                      transition={isMetersPlaying ? {
                        duration: 0.6 + index * 0.12,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut'
                      } : {
                        duration: 0.2
                      }}
                    />
                  ));
                })()}
              </div>

              {/* Mode button controllers */}
              <div className="flex gap-1 mt-3">
                {(['bass', 'mid', 'treble', 'boost'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMetersMode(mode);
                    }}
                    className={`flex-1 py-1 px-0.5 rounded border text-[8px] font-mono transition-all uppercase tracking-wider font-bold ${
                      metersMode === mode
                        ? 'border-blue-400 bg-blue-500/20 text-blue-400'
                        : 'border-slate-800 bg-black/40 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {t(`home.pro_tools.tool_4_${mode}`)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Cards grid — scroll-driven stagger ── */}
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
      >
        {cards.map((card) => {
          const c = cardColors[card.key];
          const Icon = card.icon;
          return (
            <ParallaxLayer key={card.key} speed={0.04}>
              <motion.div
                variants={fadeUp}
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <motion.div variants={cardHover}>
                  <Link
                    to={card.to}
                    className={`block h-full p-8 rounded-3xl relative overflow-hidden group transition-all duration-300 ${
                      isDark 
                        ? 'hover:border-white/20 hover:bg-white/[0.04]' 
                        : 'hover:border-black/20 hover:bg-black/[0.02]'
                    }`}
                    style={{ ...cardBg, backdropFilter: 'blur(16px)', minHeight: 200 }}
                  >
                    <div className="relative z-10">
                      <motion.div
                        className={`w-12 h-12 mb-6 ${c.icon}`}
                        whileHover={{ rotate: -8, scale: 1.15 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Icon className="w-full h-full" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3" style={{ color: textColor }}>{card.title}</h3>
                      <div
                        className={`flex items-center gap-2 text-sm font-bold ${c.icon} opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200`}
                      >
                        Explore <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            </ParallaxLayer>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
