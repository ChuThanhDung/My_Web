import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shuffle, Layers, Hash, Boxes, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { pageEnter, stagger, fadeUp, zoomReveal, inViewport } from '../lib/motion';
import { useIsDark } from '../hooks/useIsDark';

interface SamplingMethod {
  id: string;
  slug: string;
  icon: typeof Shuffle;
  glow: string;
  badges_en: string[];
  badges_vi: string[];
}

const METHODS: SamplingMethod[] = [
  {
    id: 'simple_random',
    slug: 'simple_random',
    icon: Shuffle,
    glow: '#e2ff3b', // Lime accent
    badges_en: ['Equal Probability', 'Pure Randomness', 'Gold Standard'],
    badges_vi: ['Xác suất Đồng đều', 'Ngẫu nhiên Thuần túy', 'Tiêu chuẩn Vàng']
  },
  {
    id: 'stratified',
    slug: 'stratified',
    icon: Layers,
    glow: '#10b981', // Emerald accent
    badges_en: ['Homogeneous Strata', 'High Precision', 'Subgroup Coverage'],
    badges_vi: ['Phân lớp Đồng nhất', 'Độ chính xác Cao', 'Bao phủ Nhóm phụ']
  },
  {
    id: 'systematic',
    slug: 'systematic',
    icon: Hash,
    glow: '#3b82f6', // Blue accent
    badges_en: ['Regular Interval (k)', 'Operational Ease', 'Uniform Spread'],
    badges_vi: ['Bước nhảy Định kỳ (k)', 'Vận hành Dễ dàng', 'Trải đều Hệ thống']
  },
  {
    id: 'cluster',
    slug: 'cluster',
    icon: Boxes,
    glow: '#f59e0b', // Orange/Amber accent
    badges_en: ['Heterogeneous Clusters', 'Logistical Efficiency', 'Reduced Cost'],
    badges_vi: ['Cụm Dị biệt', 'Hiệu quả Vận hành', 'Tiết kiệm Chi phí']
  }
];

function MethodCard({ method, isVi, delay, t }: { method: SamplingMethod; isVi: boolean; delay: number; t: (k: string) => string }) {
  const isDark = useIsDark();
  const Icon = method.icon;

  const cardStyle: React.CSSProperties = isDark
    ? { background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,255,255,0.07)' }
    : { background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)' };

  const badges = isVi ? method.badges_vi : method.badges_en;

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 350, damping: 28 } }}
      className="h-full"
    >
      <Link
        to={`/sampling/${method.slug}`}
        className="block h-full p-8 md:p-10 rounded-[2rem] relative overflow-hidden group"
        style={{ ...cardStyle, backdropFilter: 'blur(20px)', textDecoration: 'none' }}
      >
        {/* Glow orb */}
        <motion.div
          className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${method.glow}26 0%, transparent 70%)`, filter: 'blur(24px)' }}
          initial={{ scale: 1, opacity: 0.6 }}
          whileHover={{ scale: 1.5, opacity: 0.9 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            {/* Animated Icon */}
            <motion.div
              className="mb-6 inline-block"
              whileHover={{ rotate: 12, scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-all"
                style={{ 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
                }}
              >
                <Icon className="w-8 h-8" style={{ color: method.glow }} />
              </div>
            </motion.div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {badges.map((badge, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full border"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
                    color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            <h3 className="text-2xl font-black mb-3 leading-tight tracking-tight" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
              {t(`sampling.${method.id}.title`)}
            </h3>
            <p className="text-sm md:text-base leading-relaxed mb-8" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
              {t(`sampling.${method.id}.desc`)}
            </p>
          </div>

          {/* CTA Arrow */}
          <motion.div
            className="inline-flex items-center gap-2 text-sm font-black tracking-tight"
            style={{ color: method.glow }}
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {isVi ? 'Khám phá Phương pháp' : 'Explore Method'} <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

function HeroHeader({ t }: { t: (k: string) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <motion.div ref={ref} style={{ y, opacity }} className="mb-16">
      <motion.h1
        variants={zoomReveal}
        className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent"
        style={{ backgroundImage: 'linear-gradient(135deg, #e2ff3b 0%, #10b981 50%, #3b82f6 100%)' }}
      >
        {t('sampling.title')}
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="text-lg md:text-xl max-w-3xl leading-relaxed font-semibold text-slate-400"
      >
        {t('sampling.subtitle')}
      </motion.p>
    </motion.div>
  );
}

export default function SamplingTechniques() {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  return (
    <motion.div variants={pageEnter} initial="hidden" animate="visible" exit="exit" className="py-12 px-2 md:px-0">
      <motion.div variants={stagger(0.12)} initial="hidden" animate="visible">
        <HeroHeader t={t} />
      </motion.div>

      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {METHODS.map((method, i) => (
          <MethodCard key={method.id} method={method} isVi={isVi} delay={i * 0.05} t={t} />
        ))}
      </motion.div>
    </motion.div>
  );
}
