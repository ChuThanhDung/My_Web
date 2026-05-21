import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import PCAContent from '../components/topics/PCAContent';
import KMeansContent from '../components/topics/KMeansContent';
import NaiveBayesContent from '../components/topics/NaiveBayesContent';
import LogisticRegressionContent from '../components/topics/LogisticRegressionContent';
import SVMContent from '../components/topics/SVMContent';
import { pageEnter } from '../lib/motion';
import { useIsDark } from '../hooks/useIsDark';

export default function TopicDetails() {
  const { topicId } = useParams();
  const { t } = useTranslation();
  const isDark = useIsDark();

  const title = t(`ml.${topicId}.title`, { defaultValue: 'Topic Not Found' });

  const cardStyle: React.CSSProperties = isDark
    ? { background: 'rgba(15,23,42,0.65)', border: '1px solid rgba(255,255,255,0.08)' }
    : { background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.90)' };

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="py-8 max-w-4xl"
    >
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
      >
        <Link
          to="/ml"
          className="inline-flex items-center gap-2 mb-8 font-semibold transition-all group"
          style={{ color: isDark ? '#94a3b8' : '#64748b', textDecoration: 'none' }}
        >
          <motion.span
            className="inline-flex"
            whileHover={{ x: -4 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.span>
          Back to Topics
        </Link>
      </motion.div>

      {/* Content card — zooms in */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.15 }}
        className="rounded-3xl relative overflow-hidden"
        style={{ ...cardStyle, backdropFilter: 'blur(20px)' }}
      >
        {/* Gradient accent bar */}
        <div
          className="w-full h-1"
          style={{ background: 'linear-gradient(90deg, #d946ef, #6366f1, #38bdf8)' }}
        />

        <div className="p-8 md:p-12">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 150 }}
            className="text-3xl md:text-5xl font-black mb-6"
            style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
          >
            {title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            {topicId === 'pca'                  ? <PCAContent /> :
             topicId === 'kmeans'               ? <KMeansContent /> :
             topicId === 'naive_bayes'          ? <NaiveBayesContent /> :
             topicId === 'logistic_regression'  ? <LogisticRegressionContent /> :
             topicId === 'svm'                  ? <SVMContent /> : (
              <p className="text-lg" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                Content coming soon for <strong>{title}</strong>.
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
