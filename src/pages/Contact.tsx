import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-12 pt-8 md:pt-16 max-w-4xl mx-auto"
    >
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-rose-400">
          {isVi ? "Liên hệ với tôi" : "Get In Touch"}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {isVi 
            ? "Bạn có câu hỏi, đề xuất hoặc cơ hội hợp tác? Đừng ngần ngại liên hệ với tôi qua email bên dưới." 
            : "Have questions, suggestions, or collaboration opportunities? Feel free to reach out to me via the email below."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Email Card */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col items-center justify-center text-center gap-6 group hover:border-rose-500 transition-colors">
          <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
            <Mail className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Email</h3>
            <a href="mailto:chuthanhdung5@gmail.com" className="text-lg font-medium text-rose-600 dark:text-rose-400 hover:underline">
              chuthanhdung5@gmail.com
            </a>
          </div>
        </div>

        {/* CTA Card */}
        <div className="flex flex-col gap-4">
           <div className="bg-gradient-to-br from-rose-500 to-orange-500 p-8 rounded-3xl text-white shadow-lg flex-1 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
             
             <div className="relative z-10">
               <h3 className="text-2xl font-bold mb-4">{isVi ? "Hãy kết nối!" : "Let's Connect!"}</h3>
               <p className="text-rose-100 mb-8 leading-relaxed">
                 {isVi ? "Tôi luôn mở cửa đón nhận những dự án mới, ý tưởng sáng tạo hay cơ hội để trở thành một phần trong tầm nhìn của bạn." : "I'm always open to new projects, creative ideas, or opportunities to be part of your vision."}
               </p>
               <a href="mailto:chuthanhdung5@gmail.com" className="inline-flex items-center gap-2 bg-white text-rose-600 px-6 py-3 rounded-xl font-bold hover:bg-rose-50 transition-colors shadow-md">
                 <Mail className="w-5 h-5" /> {isVi ? "Gửi Email Ngay" : "Send Email Now"}
               </a>
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
