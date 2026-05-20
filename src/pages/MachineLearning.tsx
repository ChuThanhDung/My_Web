import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Network, SplitSquareHorizontal, Layers, Percent, Activity, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api';

interface Article {
  id: number;
  slug: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  category: string;
}


export default function MachineLearning() {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles');
        setArticles(response.data);
      } catch (err) {
        setError('Failed to load articles from the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const getIcon = (slug: string) => {
    switch(slug) {
      case 'pca': return <SplitSquareHorizontal className="w-10 h-10 mb-4 text-indigo-500" />;
      case 'kmeans': return <Network className="w-10 h-10 mb-4 text-emerald-500" />;
      case 'naive_bayes': return <Percent className="w-10 h-10 mb-4 text-blue-500" />;
      case 'logistic_regression': return <Activity className="w-10 h-10 mb-4 text-orange-500" />;
      case 'svm': return <Layers className="w-10 h-10 mb-4 text-purple-500" />;
      default: return <Layers className="w-10 h-10 mb-4 text-slate-500" />;
    }
  };

  const getColor = (slug: string) => {
    switch(slug) {
      case 'pca': return 'indigo';
      case 'kmeans': return 'emerald';
      case 'naive_bayes': return 'blue';
      case 'logistic_regression': return 'orange';
      case 'svm': return 'purple';
      default: return 'slate';
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
        <p className="text-slate-500">{isVi ? 'Đang tải dữ liệu...' : 'Loading articles...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="py-8"
    >
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
          {t('ml.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          {t('ml.subtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => {
          const color = getColor(article.slug);
          return (
          <motion.div key={article.id} variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} className="h-full">
            <Link 
              to={`/ml/${article.slug}`}
              className="block h-full p-8 rounded-3xl glass-card bg-white dark:bg-dark-card group relative overflow-hidden"
            >
              <div className={`absolute -right-12 -top-12 w-40 h-40 bg-${color}-500/10 dark:bg-${color}-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`}></div>
              
              <div className="relative z-10">
                {getIcon(article.slug)}
                <h3 className="text-2xl font-bold mb-3 dark:text-white">
                  {isVi ? article.title_vi : article.title_en}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">
                  {isVi ? article.description_vi : article.description_en}
                </p>
                <div className={`inline-flex items-center text-sm font-semibold text-${color}-600 dark:text-${color}-400 group-hover:translate-x-2 transition-transform`}>
                  {t('ml.learn_more')}
                </div>
              </div>
            </Link>
          </motion.div>
        )})}
      </div>
    </motion.div>
  );
}
