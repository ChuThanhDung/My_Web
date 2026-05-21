import { motion } from 'framer-motion';
import { Mail, Send, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { pageEnter, stagger, fadeUp, zoomReveal, inViewport } from '../lib/motion';
import { useIsDark } from '../hooks/useIsDark';

export default function Contact() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const isDark = useIsDark();

  const cardStyle: React.CSSProperties = isDark
    ? { background: 'rgba(15,23,42,0.55)', border: '1px solid rgba(255,255,255,0.08)' }
    : { background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.85)' };

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-16 pt-8 md:pt-16 max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.div variants={fadeUp} className="mb-6">
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(251,146,60,0.15))',
              border: '1px solid rgba(244,63,94,0.3)',
              color: isDark ? '#fb7185' : '#e11d48',
            }}
            whileHover={{ scale: 1.04 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isVi ? 'Kết nối ngay' : 'Say Hello'}
          </motion.span>
        </motion.div>

        <motion.h1
          variants={zoomReveal}
          className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, #fb7185 0%, #f97316 100%)' }}
        >
          {isVi ? 'Liên hệ với tôi' : 'Get In Touch'}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: isDark ? '#94a3b8' : '#475569' }}
        >
          {isVi
            ? 'Bạn có câu hỏi, đề xuất hoặc cơ hội hợp tác? Đừng ngần ngại liên hệ.'
            : 'Have questions, suggestions, or collaboration opportunities? Feel free to reach out.'}
        </motion.p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewport}
        className="grid md:grid-cols-2 gap-8"
      >
        {/* Email card */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 350, damping: 28 } }}
          className="rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden"
          style={{ ...cardStyle, backdropFilter: 'blur(20px)' }}
        >
          <motion.div
            className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.25) 0%, transparent 70%)', filter: 'blur(24px)' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-20 h-20 rounded-2xl flex items-center justify-center relative z-10"
            style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(251,146,60,0.2))', border: '1px solid rgba(244,63,94,0.3)' }}
            whileHover={{ rotate: -6, scale: 1.12 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Mail className="w-9 h-9 text-rose-400" />
          </motion.div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>Email</h3>
            <a
              href="mailto:chuthanhdung5@gmail.com"
              className="text-lg font-medium text-rose-400 hover:text-rose-300 transition-colors"
            >
              chuthanhdung5@gmail.com
            </a>
          </div>
        </motion.div>

        {/* CTA card */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 350, damping: 28 } }}
          className="rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #e11d48, #f97316)', color: '#fff' }}
        >
          {/* Decorative orbs */}
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'rgba(255,255,255,0.12)', filter: 'blur(20px)', transform: 'translate(30%, -30%)' }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: 'rgba(255,165,0,0.2)', filter: 'blur(20px)', transform: 'translate(-30%, 30%)' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />

          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">{isVi ? 'Hãy kết nối!' : "Let's Connect!"}</h3>
            <p className="text-rose-100 mb-8 leading-relaxed text-base">
              {isVi
                ? 'Tôi luôn mở cửa với những dự án mới, ý tưởng sáng tạo hay cơ hội hợp tác.'
                : "I'm always open to new projects, creative ideas, or opportunities to work together."}
            </p>
            <motion.a
              href="mailto:chuthanhdung5@gmail.com"
              className="inline-flex items-center gap-2 bg-white text-rose-600 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Send className="w-4 h-4" />
              {isVi ? 'Gửi Email Ngay' : 'Send Email Now'}
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
