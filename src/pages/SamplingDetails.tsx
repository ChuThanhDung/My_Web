import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import SimpleRandomSamplingContent from '../components/sampling/SimpleRandomSamplingContent';
import StratifiedSamplingContent from '../components/sampling/StratifiedSamplingContent';
import SystematicSamplingContent from '../components/sampling/SystematicSamplingContent';
import ClusterSamplingContent from '../components/sampling/ClusterSamplingContent';
import { pageEnter } from '../lib/motion';
import { useIsDark } from '../hooks/useIsDark';

const SECTIONS = [
  { id: 'overview', labelEn: '1. Overview & Definition', labelVi: '1. Tổng quan & Định nghĩa' },
  { id: 'purpose', labelEn: '2. Meaning & Purpose', labelVi: '2. Ý nghĩa & Mục đích' },
  { id: 'math', labelEn: '3. Math & Formulas', labelVi: '3. Công thức Toán học' },
  { id: 'simulator', labelEn: '4. Visual Simulator', labelVi: '4. Mô phỏng trực quan' },
  { id: 'steps', labelEn: '5. Step-by-Step Guide', labelVi: '5. Quy trình thực hiện' },
  { id: 'comparison', labelEn: '6. Method Comparison', labelVi: '6. So sánh phương pháp' },
  { id: 'mistakes', labelEn: '7. Pitfalls to Avoid', labelVi: '7. Sai lầm cần tránh' }
];

export default function SamplingDetails() {
  const { samplingId } = useParams();
  const { t, i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const isDark = useIsDark();
  const [activeSection, setActiveSection] = useState('overview');

  const title = t(`sampling.${samplingId}.title`, { defaultValue: 'Method Not Found' });

  // Handle active section highlighting on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const cardStyle: React.CSSProperties = isDark
    ? { background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,255,255,0.07)' }
    : { background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(0,0,0,0.06)' };

  const sidebarStyle: React.CSSProperties = isDark
    ? { background: 'rgba(10,10,10,0.45)', border: '1px solid rgba(255,255,255,0.06)' }
    : { background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.05)' };

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="py-8 w-full max-w-none px-2 md:px-0"
    >
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
      >
        <Link
          to="/sampling"
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
          {isVi ? 'Quay lại Phương pháp Lấy mẫu' : 'Back to Sampling Techniques'}
        </Link>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column - Main Content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.15 }}
          className="lg:col-span-3 rounded-3xl relative overflow-hidden"
          style={{ ...cardStyle, backdropFilter: 'blur(20px)' }}
        >
          {/* Lime-to-emerald gradient accent bar */}
          <div
            className="w-full h-1"
            style={{ background: 'linear-gradient(90deg, #e2ff3b, #10b981, #06b6d4)' }}
          />

          <div className="p-6 md:p-12">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 150 }}
              className="text-3xl md:text-5xl font-black mb-10 tracking-tight"
              style={{ color: isDark ? '#ffffff' : '#0f172a' }}
            >
              {title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              {samplingId === 'simple_random' ? <SimpleRandomSamplingContent /> :
               samplingId === 'stratified'    ? <StratifiedSamplingContent /> :
               samplingId === 'systematic'    ? <SystematicSamplingContent /> :
               samplingId === 'cluster'       ? <ClusterSamplingContent /> : (
                <p className="text-lg" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                  {isVi ? 'Không tìm thấy nội dung cho phương pháp này.' : 'Content not found for this method.'}
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column - Table of Contents Sidebar (sticky on desktop) */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 100, damping: 18 }}
          className="hidden lg:block lg:col-span-1 sticky top-24 rounded-2xl p-6"
          style={{ ...sidebarStyle, backdropFilter: 'blur(10px)' }}
        >
          <h4 className="font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2 text-neutral-500">
            <BookOpen className="w-4 h-4" />
            {isVi ? 'Mục lục chi tiết' : 'Table of Contents'}
          </h4>
          <nav className="space-y-1.5">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              const label = isVi ? sec.labelVi : sec.labelEn;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold tracking-tight transition-all block overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{
                    backgroundColor: isActive 
                      ? (isDark ? 'rgba(226, 255, 59, 0.08)' : 'rgba(16, 185, 129, 0.08)') 
                      : 'transparent',
                    color: isActive 
                      ? (isDark ? '#e2ff3b' : '#10b981') 
                      : (isDark ? '#a1a1aa' : '#52525b'),
                    borderLeft: isActive 
                      ? `2px solid ${isDark ? '#e2ff3b' : '#10b981'}` 
                      : '2px solid transparent'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </motion.aside>
      </div>
    </motion.div>
  );
}
