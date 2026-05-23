import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BrainCircuit, FolderOpen, User, Mail, Sparkles, Shuffle, Terminal, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
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
  projects:  { icon: 'text-blue-500' },
  ml:        { icon: 'text-purple-500' },
  sampling:  { icon: 'text-lime-500' },
  pro_tools: { icon: 'text-red-500' },
  tools:     { icon: 'text-violet-500' },
  about:     { icon: 'text-emerald-500' },
  contact:   { icon: 'text-rose-500' },
};



export default function Home() {
  const { t } = useTranslation();
  const isDark = useIsDark();

  const cards = [
    { to: '/projects',  icon: FolderOpen,   key: 'projects',  title: t('nav.projects') },
    { to: '/ml',        icon: BrainCircuit, key: 'ml',        title: t('nav.ml') },
    { to: '/sampling',  icon: Shuffle,      key: 'sampling',  title: t('nav.sampling') },
    { to: '/pro-tools', icon: Sliders,      key: 'pro_tools', title: t('nav.pro_tools') },
    { to: '/tools',     icon: Terminal,     key: 'tools',     title: t('nav.tools') },
    { to: '/about',     icon: User,         key: 'about',     title: t('nav.about') },
    { to: '/contact',   icon: Mail,         key: 'contact',   title: t('nav.contact') },
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




  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-16 md:gap-24 pt-8 md:pt-16 pb-12"
    >


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



      {/* ── Cards grid — scroll-driven stagger ── */}
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
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
