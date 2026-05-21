import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BrainCircuit, FolderOpen, User, Mail, Sparkles } from 'lucide-react';
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
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

// ── Animated card ──────────────────────────────────────────────────────────
const cardColors: Record<string, { glow: string; icon: string; gradient: string }> = {
  projects: { glow: 'rgba(59,130,246,0.35)',  icon: 'text-blue-400',    gradient: 'from-blue-500/20 to-blue-500/5' },
  ml:       { glow: 'rgba(217,70,239,0.35)',  icon: 'text-fuchsia-400', gradient: 'from-fuchsia-500/20 to-fuchsia-500/5' },
  about:    { glow: 'rgba(16,185,129,0.35)',  icon: 'text-emerald-400', gradient: 'from-emerald-500/20 to-emerald-500/5' },
  contact:  { glow: 'rgba(244,63,94,0.35)',   icon: 'text-rose-400',    gradient: 'from-rose-500/20 to-rose-500/5' },
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

  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const subtextColor = isDark ? '#94a3b8' : '#475569';
  const secondBtnStyle: React.CSSProperties = isDark
    ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: '#f8fafc' }
    : { background: 'rgba(0,0,0,0.04)',       border: '1px solid rgba(0,0,0,0.10)',       color: '#0f172a' };
  const cardBg: React.CSSProperties = isDark
    ? { background: 'rgba(15,23,42,0.55)', border: '1px solid rgba(255,255,255,0.07)' }
    : { background: 'rgba(255,255,255,0.60)', border: '1px solid rgba(255,255,255,0.80)' };

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-20 pt-8 md:pt-20"
    >
      {/* ── Hero ── */}
      <motion.div variants={stagger(0.12)} initial="hidden" animate="visible" className="max-w-4xl">

        {/* Pill badge */}
        <motion.div variants={fadeUp} className="mb-8">
          <motion.span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, rgba(217,70,239,0.15), rgba(99,102,241,0.15))',
              border: '1px solid rgba(217,70,239,0.3)',
              color: isDark ? '#e879f9' : '#a21caf',
              backdropFilter: 'blur(8px)',
            }}
            whileHover={{ scale: 1.04 }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-fuchsia-500"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Sparkles className="w-3.5 h-3.5" />
            {t('home.greeting')} KaSao
          </motion.span>
        </motion.div>

        {/* Headline — cinematic zoom */}
        <motion.h1 variants={zoomReveal} className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.05]">
          <motion.span
            className="block"
            style={{ color: textColor }}
          >
            {t('home.role').split(' ').slice(0, -2).join(' ')}
          </motion.span>
          <motion.span
            className="block bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #d946ef 0%, #a78bfa 40%, #6366f1 100%)' }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          >
            {t('home.role').split(' ').slice(-2).join(' ')}
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-xl md:text-2xl mb-10 leading-relaxed font-medium max-w-2xl"
          style={{ color: subtextColor }}
        >
          {t('home.intro')}
        </motion.p>

        {/* CTAs — magnetic buttons */}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-5">
          <MagneticButton
            to="/projects"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '16px 32px', borderRadius: '16px', fontWeight: 700, fontSize: '18px',
              background: 'linear-gradient(135deg, #d946ef, #6366f1)',
              color: '#fff',
              boxShadow: '0 0 32px rgba(217,70,239,0.45)',
              textDecoration: 'none',
            }}
          >
            {t('home.cta_primary')}
            <ArrowRight className="w-5 h-5" />
          </MagneticButton>

          <MagneticButton
            to="/contact"
            style={{ ...secondBtnStyle, display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '16px 32px', borderRadius: '16px', fontWeight: 700, fontSize: '18px',
              backdropFilter: 'blur(12px)', textDecoration: 'none',
            }}
          >
            {t('nav.contact')}
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* ── Floating decoration orb ── */}
      <motion.div
        className="absolute top-24 right-8 md:right-24 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(217,70,239,0.4), transparent 70%)',
          filter: 'blur(24px)',
        }}
        {...floatAnimation}
      />

      {/* ── Cards grid — scroll-driven stagger ── */}
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
                    className="block h-full p-8 rounded-3xl relative overflow-hidden group"
                    style={{ ...cardBg, backdropFilter: 'blur(16px)', minHeight: 200 }}
                  >
                    {/* Glow orb */}
                    <motion.div
                      className="absolute -right-12 -top-12 w-40 h-40 rounded-full pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`, filter: 'blur(20px)' }}
                      initial={{ scale: 1, opacity: 0.6 }}
                      whileHover={{ scale: 1.8, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="relative z-10">
                      <motion.div
                        className={`w-12 h-12 mb-6 ${c.icon}`}
                        whileHover={{ rotate: -8, scale: 1.15 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Icon className="w-full h-full" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3" style={{ color: textColor }}>{card.title}</h3>
                      <motion.div
                        className={`flex items-center gap-2 text-sm font-bold ${c.icon} opacity-70`}
                        whileHover={{ x: 4, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        Explore <ArrowRight className="w-4 h-4" />
                      </motion.div>
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
