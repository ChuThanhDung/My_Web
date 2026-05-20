import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BrainCircuit, FolderOpen, User, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();

  const cards = [
    {
      to: '/projects',
      icon: <FolderOpen className="w-8 h-8 mb-4 text-blue-500" />,
      title: t('nav.projects'),
      bg: 'from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/5',
      delay: 0.1
    },
    {
      to: '/ml',
      icon: <BrainCircuit className="w-8 h-8 mb-4 text-primary-500" />,
      title: t('nav.ml'),
      bg: 'from-primary-500/10 to-primary-500/5 dark:from-primary-500/20 dark:to-primary-500/5',
      delay: 0.2
    },
    {
      to: '/about',
      icon: <User className="w-8 h-8 mb-4 text-emerald-500" />,
      title: t('nav.about'),
      bg: 'from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/5',
      delay: 0.3
    },
    {
      to: '/contact',
      icon: <Mail className="w-8 h-8 mb-4 text-rose-500" />,
      title: t('nav.contact'),
      bg: 'from-rose-500/10 to-rose-500/5 dark:from-rose-500/20 dark:to-rose-500/5',
      delay: 0.4
    }
  ];

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

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="flex flex-col gap-12 pt-8 md:pt-16"
    >
      <div className="max-w-3xl">
        <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium text-sm mb-6">
          {t('home.greeting')} Nitro
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
          {t('home.role')}
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          {t('home.intro')}
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors shadow-lg shadow-primary-500/30">
            {t('home.cta_primary')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors shadow-sm">
            {t('nav.contact')}
          </Link>
        </motion.div>
      </div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cards.map((card, idx) => (
          <motion.div key={idx} variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
            <Link to={card.to} className={`block h-full p-6 rounded-2xl bg-gradient-to-br ${card.bg} border border-white/50 dark:border-slate-800/50 glass-card transition-all`}>
              {card.icon}
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <div className="flex items-center gap-1 text-sm font-medium opacity-70 mt-4 group">
                Learn more →
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
