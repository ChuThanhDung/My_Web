import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Network, SplitSquareHorizontal, Layers, Percent, Activity, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { pageEnter, stagger, fadeUp, zoomReveal, inViewport } from '../lib/motion';
import { useIsDark } from '../hooks/useIsDark';

interface Article {
  id: number; slug: string;
  title_en: string; title_vi: string;
  description_en: string; description_vi: string;
  category: string;
}

const SLUG_META: Record<string, { icon: typeof SplitSquareHorizontal; glow: string; label: string }> = {
  pca:                  { icon: SplitSquareHorizontal, glow: '#6366f1', label: 'Indigo'   },
  kmeans:               { icon: Network,               glow: '#10b981', label: 'Emerald'  },
  naive_bayes:          { icon: Percent,               glow: '#3b82f6', label: 'Blue'     },
  logistic_regression:  { icon: Activity,              glow: '#f97316', label: 'Orange'   },
  svm:                  { icon: Layers,                glow: '#d946ef', label: 'Fuchsia'  },
};

function ArticleCard({ article, isVi, delay }: { article: Article; isVi: boolean; delay: number }) {
  const isDark = useIsDark();
  const meta = SLUG_META[article.slug] ?? SLUG_META['svm'];
  const Icon = meta.icon;

  const cardStyle: React.CSSProperties = isDark
    ? { background: 'rgba(15,23,42,0.55)', border: '1px solid rgba(255,255,255,0.07)' }
    : { background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.85)' };

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 350, damping: 28 } }}
      className="h-full"
    >
      <Link
        to={`/ml/${article.slug}`}
        className="block h-full p-10 rounded-[2rem] relative overflow-hidden group"
        style={{ ...cardStyle, backdropFilter: 'blur(20px)', textDecoration: 'none' }}
      >
        {/* Corner glow orb — expands on hover */}
        <motion.div
          className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${meta.glow}33 0%, transparent 70%)`, filter: 'blur(24px)' }}
          initial={{ scale: 1, opacity: 0.7 }}
          whileHover={{ scale: 1.6, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        />

        <div className="relative z-10">
          {/* Icon — tilts on hover */}
          <motion.div
            className="mb-6"
            whileHover={{ rotate: -10, scale: 1.18 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Icon className="w-12 h-12" style={{ color: meta.glow }} />
          </motion.div>

          <h3 className="text-2xl font-extrabold mb-3 leading-tight" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>
            {isVi ? article.title_vi : article.title_en}
          </h3>
          <p className="text-base leading-relaxed mb-8 line-clamp-3" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
            {isVi ? article.description_vi : article.description_en}
          </p>

          {/* Arrow CTA */}
          <motion.div
            className="inline-flex items-center gap-2 text-sm font-bold"
            style={{ color: meta.glow }}
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            Explore <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Scroll-driven header reveal ────────────────────────────────────────────
function HeroHeader({ t }: { t: (k: string) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y       = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <motion.div ref={ref} style={{ y, opacity }} className="mb-16">
      <motion.h1
        variants={zoomReveal}
        className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent"
        style={{ backgroundImage: 'linear-gradient(135deg, #d946ef 0%, #a78bfa 45%, #6366f1 100%)' }}
      >
        {t('ml.title')}
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="text-xl md:text-2xl max-w-3xl leading-relaxed font-medium text-slate-400"
      >
        {t('ml.subtitle')}
      </motion.p>
    </motion.div>
  );
}

export default function MachineLearning() {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    api.get('/articles')
      .then(r => setArticles(r.data))
      .catch(() => setError('Failed to load articles.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
        <Loader2 className="w-12 h-12 text-fuchsia-500" />
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl text-slate-400 font-medium">
        {isVi ? 'Đang tải dữ liệu...' : 'Loading articles...'}
      </motion.p>
    </div>
  );

  if (error) return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-rose-400 gap-4">
      <AlertCircle className="w-16 h-16" />
      <p className="text-xl font-bold">{error}</p>
    </motion.div>
  );

  return (
    <motion.div variants={pageEnter} initial="hidden" animate="visible" exit="exit" className="py-12">
      <motion.div variants={stagger(0.12)} initial="hidden" animate="visible">
        <HeroHeader t={t} />
      </motion.div>

      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        {articles.map((article, i) => (
          <ArticleCard key={article.id} article={article} isVi={isVi} delay={i * 0.05} />
        ))}
      </motion.div>
    </motion.div>
  );
}
