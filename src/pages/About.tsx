import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BrainCircuit, Shuffle, GraduationCap, Sparkles, Terminal, Cpu } from 'lucide-react';
import { pageEnter, stagger, fadeUp, zoomReveal, inViewport } from '../lib/motion';
import { useIsDark } from '../hooks/useIsDark';

export default function About() {
  const { t } = useTranslation();
  const isDark = useIsDark();

  const textColor = isDark ? '#ffffff' : '#0f172a';
  const subtextColor = isDark ? '#94a3b8' : '#475569';

  const cardStyle: React.CSSProperties = isDark
    ? { background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,255,255,0.07)' }
    : { background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)' };

  const iconBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const iconBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const features = [
    {
      icon: BrainCircuit,
      glow: '#d946ef', // Fuchsia
      title: t('about.ml_title'),
      desc: t('about.ml_desc'),
    },
    {
      icon: Shuffle,
      glow: '#e2ff3b', // Lime/Yellow
      title: t('about.sampling_title'),
      desc: t('about.sampling_desc'),
    },
    {
      icon: GraduationCap,
      glow: '#10b981', // Emerald
      title: t('about.academic_title'),
      desc: t('about.academic_desc'),
    },
    {
      icon: Sparkles,
      glow: '#3b82f6', // Blue
      title: t('about.ui_title'),
      desc: t('about.ui_desc'),
    },
  ];

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-16 md:gap-24 pt-8 md:pt-16 max-w-7xl mx-auto px-2 md:px-0"
    >
      {/* ── Header ── */}
      <motion.div variants={stagger(0.12)} initial="hidden" animate="visible" className="w-full">
        <motion.h1
          variants={zoomReveal}
          className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, #d946ef 0%, #e2ff3b 50%, #3b82f6 100%)' }}
        >
          {t('about.title')}
        </motion.h1>
        
        <motion.p
          variants={fadeUp}
          className="text-xl md:text-2xl leading-relaxed font-semibold text-slate-400 max-w-3xl mb-8"
        >
          {t('about.subtitle')}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="p-8 md:p-10 rounded-3xl relative overflow-hidden"
          style={{ ...cardStyle, backdropFilter: 'blur(20px)' }}
        >
          {/* Accent border highlight */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 via-lime-400 to-blue-500" />
          <p className="text-base md:text-lg leading-relaxed font-medium" style={{ color: subtextColor }}>
            {t('about.intro')}
          </p>
        </motion.div>
      </motion.div>

      {/* ── Features Bento Grid ── */}
      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#e2ff3b] rounded-full" />
          <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: textColor }}>
            {t('about.features_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.01, transition: { type: 'spring', stiffness: 350, damping: 28 } }}
                className="p-8 rounded-[2rem] relative overflow-hidden group"
                style={{ ...cardStyle, backdropFilter: 'blur(20px)' }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${feat.glow}1f 0%, transparent 70%)`, filter: 'blur(24px)' }}
                  initial={{ scale: 1, opacity: 0.6 }}
                  whileHover={{ scale: 1.4, opacity: 0.9 }}
                  transition={{ duration: 0.6 }}
                />

                <div className="relative z-10">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center border mb-6"
                    style={{ backgroundColor: iconBg, borderColor: iconBorder }}
                  >
                    <Icon className="w-7 h-7" style={{ color: feat.glow }} />
                  </div>

                  <h3 className="text-xl font-bold mb-3" style={{ color: textColor }}>
                    {feat.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: subtextColor }}>
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── System Stack Footer ── */}
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="flex flex-col gap-6 pb-12"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#3b82f6] rounded-full" />
          <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: textColor }}>
            {t('about.tech_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Frontend tech info */}
          <motion.div
            variants={fadeUp}
            className="p-8 rounded-[2rem]"
            style={cardStyle}
          >
            <div className="flex items-center gap-4 mb-4">
              <Terminal className="w-6 h-6 text-lime-400" />
              <h3 className="text-lg font-bold" style={{ color: textColor }}>{t('about.tech_frontend')}</h3>
            </div>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: subtextColor }}>
              {t('about.tech_frontend_details')}
            </p>
          </motion.div>

          {/* Backend tech info */}
          <motion.div
            variants={fadeUp}
            className="p-8 rounded-[2rem]"
            style={cardStyle}
          >
            <div className="flex items-center gap-4 mb-4">
              <Cpu className="w-6 h-6 text-fuchsia-400" />
              <h3 className="text-lg font-bold" style={{ color: textColor }}>{t('about.tech_backend')}</h3>
            </div>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: subtextColor }}>
              {t('about.tech_backend_details')}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
