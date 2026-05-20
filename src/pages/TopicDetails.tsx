import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import PCAContent from '../components/topics/PCAContent';
import KMeansContent from '../components/topics/KMeansContent';
import NaiveBayesContent from '../components/topics/NaiveBayesContent';
import LogisticRegressionContent from '../components/topics/LogisticRegressionContent';
import SVMContent from '../components/topics/SVMContent';

export default function TopicDetails() {
  const { topicId } = useParams();
  const { t } = useTranslation();

  // Basic check if topic exists in translations, fallback if not
  const title = t(`ml.${topicId}.title`, { defaultValue: 'Topic Not Found' });
  const desc = t(`ml.${topicId}.desc`, { defaultValue: '' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8 max-w-4xl"
    >
      <Link to="/ml" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to Topics
      </Link>

      <div className="p-8 md:p-12 rounded-3xl glass-card bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-indigo-500"></div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white">{title}</h1>
        
        {topicId === 'pca' ? (
          <PCAContent />
        ) : topicId === 'kmeans' ? (
          <KMeansContent />
        ) : topicId === 'naive_bayes' ? (
          <NaiveBayesContent />
        ) : topicId === 'logistic_regression' ? (
          <LogisticRegressionContent />
        ) : topicId === 'svm' ? (
          <SVMContent />
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              {desc}
            </p>
            
            <div className="mt-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Content Placeholder</h3>
              <p className="text-slate-600 dark:text-slate-400">
                This is where detailed interactive content, formulas, graphs, and code snippets for <strong>{title}</strong> will be implemented.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
