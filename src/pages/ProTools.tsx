import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, Play, Pause, Terminal } from 'lucide-react';
import { useState, useRef } from 'react';
import { pageEnter, stagger, fadeUp, zoomReveal, inViewport } from '../lib/motion';
import { useIsDark } from '../hooks/useIsDark';

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

// ── Scroll-driven header reveal ────────────────────────────────────────────
function HeroHeader({ t }: { t: (k: string) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <motion.div ref={ref} style={{ y, opacity }} className="mb-16">
      <motion.h1
        variants={zoomReveal}
        className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent"
        style={{ backgroundImage: 'linear-gradient(135deg, #ef4444 0%, #ec4899 50%, #3b82f6 100%)' }}
      >
        {t('pro_tools_page.title')}
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="text-xl md:text-2xl max-w-3xl leading-relaxed font-medium text-slate-400"
      >
        {t('pro_tools_page.subtitle')}
      </motion.p>
    </motion.div>
  );
}

export default function ProTools() {
  const { t } = useTranslation();
  const isDark = useIsDark();

  const textColor = isDark ? '#ffffff' : '#000000';
  const subtextColor = isDark ? '#a1a1aa' : '#4b5563';

  const cardBg: React.CSSProperties = isDark
    ? { background: 'rgba(15, 23, 42, 0.50)', border: '1px solid rgba(255,255,255,0.08)' }
    : { background: 'rgba(255, 255, 255, 0.55)', border: '1px solid rgba(0,0,0,0.08)' };

  // States
  const [activeTool, setActiveTool] = useState<'cluster' | 'pipeline' | 'theme' | 'meters'>('cluster');
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

  // Compute centroids
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

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="py-12 px-2 md:px-0"
    >
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

      <motion.div variants={stagger(0.12)} initial="hidden" animate="visible">
        <HeroHeader t={t} />
      </motion.div>

      {/* Unified Console Panel */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="rounded-[2rem] p-6 lg:p-10 transition-all duration-300"
        style={{ ...cardBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Tabs List */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 gap-3 scrollbar-none snap-x snap-mandatory">
              
              {/* Tab 1: CLUSTER */}
              <button
                onClick={() => setActiveTool('cluster')}
                className={`w-72 lg:w-full flex-shrink-0 snap-start text-left p-5 rounded-2xl transition-all duration-200 border ${
                  activeTool === 'cluster'
                    ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : isDark 
                      ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10'
                      : 'border-black/5 bg-black/[0.01] hover:bg-black/[0.03] hover:border-black/10'
                }`}
              >
                <span className="inline-block bg-red-500/15 text-red-500 border border-red-500/25 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase">
                  CLUSTER
                </span>
                <h3 className="text-base font-bold mt-2" style={{ color: activeTool === 'cluster' ? undefined : textColor }}>
                  {t('home.pro_tools.tool_1_title')}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {t('home.pro_tools.tool_1_desc')}
                </p>
              </button>

              {/* Tab 2: PIPELINE */}
              <button
                onClick={() => setActiveTool('pipeline')}
                className={`w-72 lg:w-full flex-shrink-0 snap-start text-left p-5 rounded-2xl transition-all duration-200 border ${
                  activeTool === 'pipeline'
                    ? 'bg-pink-500/10 border-pink-500/30 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.1)]'
                    : isDark 
                      ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10'
                      : 'border-black/5 bg-black/[0.01] hover:bg-black/[0.03] hover:border-black/10'
                }`}
              >
                <span className="inline-block bg-pink-500/15 text-pink-500 border border-pink-500/25 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase">
                  PIPELINE
                </span>
                <h3 className="text-base font-bold mt-2" style={{ color: activeTool === 'pipeline' ? undefined : textColor }}>
                  {t('home.pro_tools.tool_2_title')}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {t('home.pro_tools.tool_2_desc')}
                </p>
              </button>

              {/* Tab 3: THEME */}
              <button
                onClick={() => setActiveTool('theme')}
                className={`w-72 lg:w-full flex-shrink-0 snap-start text-left p-5 rounded-2xl transition-all duration-200 border ${
                  activeTool === 'theme'
                    ? isDark
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-[#e2ff3b] shadow-[0_0_15px_rgba(226,255,59,0.1)]'
                      : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 shadow-[0_0_15px_rgba(202,138,4,0.1)]'
                    : isDark 
                      ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10'
                      : 'border-black/5 bg-black/[0.01] hover:bg-black/[0.03] hover:border-black/10'
                }`}
              >
                <span
                  className="inline-block px-2.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border"
                  style={{
                    color: activeTool === 'theme' ? (isDark ? '#e2ff3b' : '#b45309') : '#94a3b8',
                    borderColor: activeTool === 'theme' ? (isDark ? 'rgba(226,255,59,0.3)' : 'rgba(180,83,9,0.3)') : 'rgba(255,255,255,0.08)',
                    background: activeTool === 'theme' ? (isDark ? 'rgba(226,255,59,0.15)' : 'rgba(253,224,71,0.15)') : 'transparent'
                  }}
                >
                  THEME
                </span>
                <h3 className="text-base font-bold mt-2" style={{ color: activeTool === 'theme' ? undefined : textColor }}>
                  {t('home.pro_tools.tool_3_title')}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {t('home.pro_tools.tool_3_desc')}
                </p>
              </button>

              {/* Tab 4: METERS */}
              <button
                onClick={() => setActiveTool('meters')}
                className={`w-72 lg:w-full flex-shrink-0 snap-start text-left p-5 rounded-2xl transition-all duration-200 border ${
                  activeTool === 'meters'
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                    : isDark 
                      ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10'
                      : 'border-black/5 bg-black/[0.01] hover:bg-black/[0.03] hover:border-black/10'
                }`}
              >
                <span className="inline-block bg-blue-500/15 text-blue-500 border border-blue-500/25 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase">
                  METERS
                </span>
                <h3 className="text-base font-bold mt-2" style={{ color: activeTool === 'meters' ? undefined : textColor }}>
                  {t('home.pro_tools.tool_4_title')}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {t('home.pro_tools.tool_4_desc')}
                </p>
              </button>

            </div>
          </div>

          {/* Right Panel: Content Area */}
          <div className="lg:col-span-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800/40 pt-6 lg:pt-0 lg:pl-8 min-h-[350px]">
            
            <div className="flex flex-col gap-6">
              {/* Title & Description */}
              <div>
                <h3 className="text-xl font-bold" style={{ color: textColor }}>
                  {activeTool === 'cluster' && t('home.pro_tools.tool_1_title')}
                  {activeTool === 'pipeline' && t('home.pro_tools.tool_2_title')}
                  {activeTool === 'theme' && t('home.pro_tools.tool_3_title')}
                  {activeTool === 'meters' && t('home.pro_tools.tool_4_title')}
                </h3>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed" style={{ color: subtextColor }}>
                  {activeTool === 'cluster' && t('home.pro_tools.tool_1_desc')}
                  {activeTool === 'pipeline' && t('home.pro_tools.tool_2_desc')}
                  {activeTool === 'theme' && t('home.pro_tools.tool_3_desc')}
                  {activeTool === 'meters' && t('home.pro_tools.tool_4_desc')}
                </p>
              </div>

              {/* Interactive Area */}
              <div className="w-full">
                
                {/* CLUSTER VIEW */}
                {activeTool === 'cluster' && (
                  <div className="flex flex-col gap-3">
                    <div className="font-mono text-[10px] text-slate-700 dark:text-slate-400 flex justify-between select-none max-w-sm mx-auto w-full">
                      <span>{t('home.pro_tools.tool_1_centroid_a')}: ({leftCentroid.x.toFixed(0)}, {leftCentroid.y.toFixed(0)})</span>
                      <span>{t('home.pro_tools.tool_1_centroid_b')}: ({rightCentroid.x.toFixed(0)}, {rightCentroid.y.toFixed(0)})</span>
                    </div>
                    <div
                      onClick={() => setClusterPoints(generateClusterPoints())}
                      className="h-20 max-w-sm w-full mx-auto bg-slate-100 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-900 flex items-center justify-center relative overflow-hidden cursor-pointer select-none hover:border-red-500/30 dark:hover:border-red-500/30 transition-colors"
                    >
                      {/* Lines */}
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
                            stroke={isDark ? "#94a3b8" : "#64748b"}
                            strokeWidth="0.8"
                          />
                        ))}
                      </svg>

                      {/* Centroids */}
                      <div
                        className="absolute w-2.5 h-2.5 rounded-full bg-red-500 border border-white/40 z-10 transition-all duration-300"
                        style={{ left: leftCentroid.x - 5, top: leftCentroid.y - 5 }}
                      />
                      <div
                        className="absolute w-2.5 h-2.5 rounded-full bg-slate-400 border border-white/40 z-10 transition-all duration-300"
                        style={{ left: rightCentroid.x - 5, top: rightCentroid.y - 5 }}
                      />

                      {/* Points */}
                      {clusterPoints.map(p => (
                        <motion.div
                          key={p.id}
                          layoutId={p.id}
                          className={`absolute w-2 h-2 rounded-full ${p.color}`}
                          animate={{ left: p.x - 4, top: p.y - 4 }}
                          transition={{ type: 'spring', stiffness: 140, damping: 15 }}
                        />
                      ))}

                      <div className="absolute top-1.5 right-2 text-[8px] font-mono text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {t('home.pro_tools.tool_1_action')}
                      </div>
                    </div>
                  </div>
                )}

                {/* PIPELINE VIEW */}
                {activeTool === 'pipeline' && (
                  <div className="flex flex-col gap-3">
                    <div className="h-16 max-w-sm w-full mx-auto bg-slate-100 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-900 flex items-center justify-between px-6 select-none">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveStep('IN');
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                          activeStep === 'IN'
                            ? 'bg-pink-500/10 dark:bg-pink-500/20 border border-pink-300 dark:border-pink-500/40 text-pink-700 dark:text-pink-400 font-bold'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${activeStep === 'IN' ? 'bg-pink-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-700'}`} />
                        <span className="text-[10px] font-mono">INPUT</span>
                      </button>

                      <div className="text-slate-400 dark:text-slate-600 text-xs font-mono select-none">→</div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveStep('PROC');
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                          activeStep === 'PROC'
                            ? 'bg-pink-500/10 dark:bg-pink-500/20 border border-pink-300 dark:border-pink-500/40 text-pink-700 dark:text-pink-400 font-bold'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${activeStep === 'PROC' ? 'bg-pink-500 animate-ping' : 'bg-slate-400 dark:bg-slate-700'}`} />
                        <span className="text-[10px] font-mono">PROCESS</span>
                      </button>

                      <div className="text-slate-400 dark:text-slate-600 text-xs font-mono select-none">→</div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveStep('OUT');
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                          activeStep === 'OUT'
                            ? 'bg-pink-500/10 dark:bg-pink-500/20 border border-pink-300 dark:border-pink-500/40 text-pink-700 dark:text-pink-400 font-bold'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${activeStep === 'OUT' ? 'bg-pink-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-700'}`} opacity-100 />
                        <span className="text-[10px] font-mono">OUTPUT</span>
                      </button>
                    </div>

                    {/* Log Panel */}
                    <div className="max-w-sm w-full mx-auto p-2 bg-slate-50 dark:bg-black/60 rounded border border-slate-200 dark:border-slate-900/60 font-mono text-[9px] text-pink-700 dark:text-pink-400 min-h-[32px] flex items-center leading-normal select-none">
                      <span className="animate-pulse mr-2 text-pink-500 font-bold">›</span>
                      <span>
                        {activeStep === 'IN' && t('home.pro_tools.tool_2_status_in')}
                        {activeStep === 'PROC' && t('home.pro_tools.tool_2_status_proc')}
                        {activeStep === 'OUT' && t('home.pro_tools.tool_2_status_out')}
                      </span>
                    </div>
                  </div>
                )}

                {/* THEME VIEW */}
                {activeTool === 'theme' && (
                  <div className="flex flex-col gap-3">
                    <div className="h-16 max-w-sm w-full mx-auto bg-slate-100 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-900 flex items-center justify-center gap-2 px-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleThemeChange('dark'); }}
                        className={`flex-1 py-1 px-1 rounded border text-[9px] font-mono transition-all font-bold ${
                          themeMode === 'dark'
                            ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-black text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300'
                        }`}
                      >
                        {t('home.pro_tools.theme_dark')}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleThemeChange('light'); }}
                        className={`flex-1 py-1 px-1 rounded border text-[9px] font-mono transition-all font-bold ${
                          themeMode === 'light'
                            ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-black text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300'
                        }`}
                      >
                        {t('home.pro_tools.theme_light')}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleThemeChange('kino'); }}
                        className={`flex-1 py-1 px-1 rounded border text-[9px] font-mono transition-all font-bold ${
                          themeMode === 'kino'
                            ? 'border-[#e2ff3b] bg-[#e2ff3b] text-black shadow-[0_0_12px_rgba(226,255,59,0.3)]'
                            : 'border-slate-200 dark:border-[#e2ff3b]/40 bg-white dark:bg-[#e2ff3b]/10 text-slate-500 dark:text-[#e2ff3b] hover:text-slate-800 dark:hover:bg-[#e2ff3b]/20'
                        }`}
                      >
                        {t('home.pro_tools.theme_kino')}
                      </button>
                    </div>

                    {/* Status */}
                    <div className="max-w-sm w-full mx-auto p-1.5 bg-slate-50 dark:bg-black/60 rounded border border-slate-200 dark:border-slate-900/60 font-mono text-[9px] text-amber-600 dark:text-yellow-500/80 text-center select-none">
                      {themeMode === 'dark' && `${t('home.pro_tools.theme_dark')} Mode Active`}
                      {themeMode === 'light' && `${t('home.pro_tools.theme_light')} Mode Active`}
                      {themeMode === 'kino' && `${t('home.pro_tools.theme_kino')} Mode Active`}
                    </div>
                  </div>
                )}

                {/* METERS VIEW */}
                {activeTool === 'meters' && (
                  <div className="flex flex-col gap-3">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMetersPlaying(!isMetersPlaying);
                      }}
                      className="h-16 max-w-sm w-full mx-auto bg-slate-100 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-900 flex items-end justify-center gap-1.5 pb-2 px-6 relative cursor-pointer select-none hover:border-blue-500/40 transition-colors"
                    >
                      <div className="absolute top-1.5 right-2 opacity-40 hover:opacity-80 transition-opacity">
                        {isMetersPlaying ? <Pause className="w-2.5 h-2.5 text-blue-500 dark:text-blue-400" /> : <Play className="w-2.5 h-2.5 text-blue-500 dark:text-blue-400" />}
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

                    {/* Filters */}
                    <div className="flex gap-1 max-w-sm w-full mx-auto">
                      {(['bass', 'mid', 'treble', 'boost'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMetersMode(mode);
                          }}
                          className={`flex-1 py-1 px-0.5 rounded border text-[8px] font-mono transition-all uppercase tracking-wider font-bold ${
                            metersMode === mode
                              ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-black/40 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300'
                          }`}
                        >
                          {t(`home.pro_tools.tool_4_${mode}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Usage Guide Segment */}
            <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800/40 flex gap-3 items-start select-none">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-[#e2ff3b] border border-slate-250 dark:border-white/10 mt-0.5">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('home.pro_tools.usage_guide_title')}
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  {activeTool === 'cluster' && t('home.pro_tools.tool_1_usage')}
                  {activeTool === 'pipeline' && t('home.pro_tools.tool_2_usage')}
                  {activeTool === 'theme' && t('home.pro_tools.tool_3_usage')}
                  {activeTool === 'meters' && t('home.pro_tools.tool_4_usage')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
