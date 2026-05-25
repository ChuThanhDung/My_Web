import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';

export default function NaiveBayesContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  const Section = ({ title, children, id, icon }: { title: string, children: React.ReactNode, id: string, icon?: string }) => (
    <section id={id} className="mb-16 scroll-mt-24">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white text-base shadow-md">
            {icon}
          </div>
        )}
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
        {children}
      </div>
    </section>
  );

  const InfoBox = ({ children, variant = 'info' }: { children: React.ReactNode, variant?: 'info' | 'warning' }) => {
    const isWarn = variant === 'warning';
    return (
      <div className={`p-5 my-6 border-l-4 rounded-r-xl shadow-sm ${
        isWarn 
          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500' 
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
      }`}>
        {children}
      </div>
    );
  };

  const pythonCode = `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics import accuracy_score, classification_report

# 1. Sample text data (Spam vs Ham)
texts = [
    "Win a free iPhone now", "Claim your cash prize", "Exclusive discount offer",
    "Meeting schedule for tomorrow", "Project report deadline", "Lunch with the team"
]
labels = [1, 1, 1, 0, 0, 0] # 1: Spam, 0: Ham

# 2. Convert text to word count vectors (Bag of Words)
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)

# 3. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.33, random_state=42)

# 4. Initialize and train Multinomial Naive Bayes
model = MultinomialNB()
model.fit(X_train, y_train)

# 5. Predict on test set
y_pred = model.predict(X_test)

# 6. Evaluation
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Report:\\n", classification_report(y_test, y_pred))

# Test with new data
new_email = ["Free cash prize for the winner!"]
X_new = vectorizer.transform(new_email)
print("Prediction for new email:", "Spam" if model.predict(X_new)[0] == 1 else "Ham")`;

  /* ───────────── Spam Classifier Interactive Simulator ───────────── */
  function SpamClassifierDemo() {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState<{ isSpam: boolean, confidence: number, breakdown: {word: string, pSpam: number, pHam: number}[] } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Simplified vocab with predefined likelihood probabilities P(word | class)
    const vocab: Record<string, {spam: number, ham: number}> = {
      'win': { spam: 0.15, ham: 0.01 },
      'free': { spam: 0.20, ham: 0.02 },
      'prize': { spam: 0.10, ham: 0.01 },
      'click': { spam: 0.12, ham: 0.03 },
      'cash': { spam: 0.08, ham: 0.01 },
      'winner': { spam: 0.09, ham: 0.005 },
      'urgent': { spam: 0.05, ham: 0.05 },
      'buy': { spam: 0.07, ham: 0.02 },
      'discount': { spam: 0.06, ham: 0.01 },
      'meeting': { spam: 0.01, ham: 0.15 },
      'project': { spam: 0.01, ham: 0.12 },
      'deadline': { spam: 0.01, ham: 0.10 },
      'team': { spam: 0.02, ham: 0.14 },
      'report': { spam: 0.01, ham: 0.11 },
      'schedule': { spam: 0.01, ham: 0.09 },
      'lunch': { spam: 0.02, ham: 0.08 }
    };
    
    const P_SPAM = 0.4;
    const P_HAM = 0.6;
    const SMOOTHING = 0.001; // Laplace smoothing fallback

    const analyzeText = () => {
      if (!inputText.trim()) return;
      setIsAnalyzing(true);
      setResult(null);
      
      setTimeout(() => {
        const words = inputText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
        
        let logPSpam = Math.log(P_SPAM);
        let logPHam = Math.log(P_HAM);
        const breakdown: {word: string, pSpam: number, pHam: number}[] = [];
        
        words.forEach(word => {
          if (word.length < 2) return;
          const stats = vocab[word] || { spam: SMOOTHING, ham: SMOOTHING };
          // For visualization, only show words we know
          if (vocab[word]) {
            breakdown.push({ word, pSpam: stats.spam, pHam: stats.ham });
          }
          logPSpam += Math.log(stats.spam);
          logPHam += Math.log(stats.ham);
        });
        
        // Convert log probs back to probabilities (using exp trick to avoid underflow)
        const maxLog = Math.max(logPSpam, logPHam);
        const probSpam = Math.exp(logPSpam - maxLog);
        const probHam = Math.exp(logPHam - maxLog);
        const normalizedSpam = probSpam / (probSpam + probHam);
        
        // Sort breakdown by strongest spam indicators
        breakdown.sort((a, b) => (b.pSpam / (b.pHam + 0.0001)) - (a.pSpam / (a.pHam + 0.0001)));
        
        setResult({
          isSpam: normalizedSpam > 0.5,
          confidence: normalizedSpam > 0.5 ? normalizedSpam : 1 - normalizedSpam,
          breakdown: breakdown.slice(0, 5) // top 5 words
        });
        setIsAnalyzing(false);
      }, 600);
    };

    const samples = [
      "Win a free iPhone! Click here to claim your cash prize",
      "Meeting schedule for tomorrow regarding project deadline",
      "Urgent: Buy now to get exclusive discount as winner",
      "Lunch with the team after report submission"
    ];

    return (
      <div className="rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900 mt-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            {isVi ? 'Spam Filter Demo' : 'Spam Filter Demo'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 text-white">
          <div className="border-b lg:border-b-0 lg:border-r border-slate-800 p-6 flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                {isVi ? 'Nhập nội dung email/tin nhắn' : 'Enter email/message content'}
              </label>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isVi ? "Nhập một câu vào đây..." : "Type something here..."}
                className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none placeholder-slate-500 text-slate-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {isVi ? 'Mẫu gợi ý' : 'Suggestions'}
              </p>
              <div className="flex flex-wrap gap-2">
                {samples.map((sample, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setInputText(sample)}
                    className="text-left text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded-lg border border-slate-700 transition-colors truncate max-w-[200px]"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={analyzeText}
              disabled={isAnalyzing || !inputText.trim()}
              className="mt-auto w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white text-sm font-bold rounded-xl border border-blue-500 transition-colors shadow-lg shadow-blue-900/50 flex justify-center items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isVi ? 'Đang phân tích...' : 'Analyzing...'}
                </>
              ) : (
                isVi ? 'Phân loại bằng Naive Bayes' : 'Classify with Naive Bayes'
              )}
            </button>
          </div>

          <div className="p-6 bg-slate-800/20 relative min-h-[300px] flex flex-col items-center justify-center">
            {!result && !isAnalyzing && (
              <div className="text-center text-slate-500 flex flex-col items-center">
                <svg className="w-16 h-16 mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">{isVi ? 'Nhập tin nhắn và ấn Phân loại để xem kết quả' : 'Enter message and click Classify to see results'}</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-blue-400 flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-medium animate-pulse">{isVi ? 'Tính toán xác suất...' : 'Calculating probabilities...'}</p>
              </div>
            )}

            {result && !isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center h-full justify-start"
              >
                <div className={`px-6 py-2 rounded-full font-black text-2xl tracking-widest uppercase border-2 shadow-xl mb-6 ${
                  result.isSpam 
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-rose-900/50' 
                    : 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-emerald-900/50'
                }`}>
                  {result.isSpam ? 'SPAM' : 'NOT SPAM (HAM)'}
                </div>

                <div className="w-full max-w-sm mb-8">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    <span>Confidence</span>
                    <span>{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full ${result.isSpam ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 pb-2 border-b border-slate-700/50">
                    {isVi ? 'Từ khóa phân tích' : 'Keyword Analysis'}
                  </p>
                  
                  {result.breakdown.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-4">
                      {isVi ? 'Không tìm thấy từ khóa mạnh nào.' : 'No strong keywords found.'}
                    </p>
                  ) : (
                    <div className="space-y-3 w-full">
                      {result.breakdown.map((item, idx) => {
                        const isSpamIndicator = item.pSpam > item.pHam;
                        const ratio = isSpamIndicator ? (item.pSpam / item.pHam) : (item.pHam / item.pSpam);
                        
                        return (
                          <div key={idx} className="flex items-center gap-3 w-full bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
                            <span className="text-sm font-mono text-slate-300 w-24 truncate">{item.word}</span>
                            <div className="flex-1 flex items-center gap-2">
                               {isSpamIndicator ? (
                                 <>
                                   <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 w-12 text-center">+Spam</span>
                                   <div className="h-1.5 bg-rose-500/50 rounded-full" style={{ width: `${Math.min(ratio * 5, 100)}%` }} />
                                 </>
                               ) : (
                                 <>
                                   <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 w-12 text-center">+Ham</span>
                                   <div className="h-1.5 bg-emerald-500/50 rounded-full" style={{ width: `${Math.min(ratio * 5, 100)}%` }} />
                                 </>
                               )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-3/4">
        
        {/* 1. Hero Section */}
        <section id="hero" className="mb-16 scroll-mt-24">
          <div className="p-10 rounded-3xl bg-gradient-to-br from-blue-900 via-sky-800 to-cyan-900 text-white shadow-2xl relative overflow-hidden border border-blue-700/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-sky-300 mb-3 bg-blue-800/60 px-3 py-1 rounded-full border border-blue-700">
                {isVi ? 'Học có giám sát' : 'Supervised Learning'}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Naive Bayes</h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
                {isVi 
                  ? "Thuật toán kinh điển dựa trên Định lý Bayes. Đơn giản, tốc độ chớp nhoáng và cực kỳ hiệu quả trong phân loại văn bản, lọc thư rác."
                  : "A classic algorithm based on Bayes' Theorem. Simple, lightning-fast, and extremely effective for text classification and spam filtering."}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-5">
                {['Probability', 'Bayes Theorem', 'Fast Training', 'NLP'].map(tag => (
                  <span key={tag} className="text-xs font-semibold text-blue-200 bg-blue-700/50 px-3 py-1 rounded-full border border-blue-600/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Introduction */}
        <Section id="intro" title={isVi ? "Giới thiệu" : "Introduction"} icon="🔍">
          <p>
            {isVi 
              ? "Naive Bayes là một họ thuật toán phân loại dựa trên xác suất, cốt lõi là Định lý Bayes. Nó được gọi là 'Naive' (ngây thơ) vì nó đặt ra một giả định rất mạnh: Tất cả các đặc trưng (features) đều độc lập với nhau, nghĩa là sự xuất hiện của một đặc trưng không ảnh hưởng đến sự xuất hiện của đặc trưng khác."
              : "Naive Bayes is a family of probabilistic classification algorithms based on Bayes' Theorem. It is called 'Naive' because it makes a very strong assumption: All features are independent of each other, meaning the presence of one feature does not affect the presence of another."}
          </p>
          <p>
            {isVi
              ? "Dù giả định này hiếm khi đúng trong thực tế, Naive Bayes vẫn hoạt động cực kỳ tốt, đặc biệt là với dữ liệu văn bản (NLP) có số chiều rất lớn."
              : "Even though this assumption is rarely true in reality, Naive Bayes still performs exceptionally well, especially with text data (NLP) that has high dimensionality."}
          </p>
        </Section>

        {/* 3. Bayes Theorem */}
        <Section id="bayes" title={isVi ? "Định lý Bayes (Bayes' Theorem)" : "Bayes' Theorem"} icon="📐">
          <p>
            {isVi 
              ? "Định lý Bayes mô tả xác suất của một sự kiện dựa trên các kiến thức đã biết trước đó có liên quan đến sự kiện. Công thức cơ bản:"
              : "Bayes' theorem describes the probability of an event based on prior knowledge of conditions that might be related to the event. The basic formula is:"}
          </p>
          <div className="bg-slate-900 p-6 rounded-2xl my-6 flex justify-center text-white overflow-x-auto shadow-inner">
            <BlockMath math="P(C|X) = \frac{P(X|C) \cdot P(C)}{P(X)}" />
          </div>
          <p className="text-sm mb-4">
            {isVi ? "Trong Machine Learning, ta áp dụng như sau:" : "In Machine Learning, we apply it as follows:"}
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
            <li><InlineMath math="P(C|X)" />: <strong>Posterior Probability</strong> - {isVi ? "Xác suất rớt vào lớp C khi đã biết đặc trưng X (Điều ta cần dự đoán)." : "Probability of class C given feature X (What we want to predict)."}</li>
            <li><InlineMath math="P(X|C)" />: <strong>Likelihood</strong> - {isVi ? "Xác suất thấy đặc trưng X nếu dữ liệu thực sự thuộc lớp C." : "Probability of feature X given that the class is C."}</li>
            <li><InlineMath math="P(C)" />: <strong>Prior Probability</strong> - {isVi ? "Xác suất tổng quát của lớp C trong tập dữ liệu." : "General probability of class C in the dataset."}</li>
            <li><InlineMath math="P(X)" />: <strong>Evidence</strong> - {isVi ? "Xác suất của đặc trưng X." : "Probability of feature X."}</li>
          </ul>
        </Section>

        {/* 4. Naive Assumption & Math */}
        <Section id="math" title={isVi ? "Giả định 'Ngây thơ' & Toán học" : "Naive Assumption & Math"} icon="🧠">
          <p>
            {isVi
              ? "Với một mẫu dữ liệu có nhiều đặc trưng $X = (x_1, x_2, ..., x_n)$, việc tính chính xác $P(x_1, x_2, ..., x_n | C)$ là không thể vì nó cần quá nhiều dữ liệu. Thay vào đó, thuật toán đưa ra giả định ngây thơ rằng các $x_i$ độc lập với nhau:"
              : "With a sample having multiple features $X = (x_1, x_2, ..., x_n)$, calculating the exact $P(x_1, x_2, ..., x_n | C)$ is impossible as it requires too much data. Instead, the algorithm makes the naive assumption that all $x_i$ are independent:"}
          </p>
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-inner my-6">
            <BlockMath math="P(X|C) \approx P(x_1|C) \cdot P(x_2|C) \cdot ... \cdot P(x_n|C) = \prod_{i=1}^{n} P(x_i|C)" />
            <div className="border-t border-slate-700/50 pt-4">
              <div className="text-sm text-slate-400 mb-2 font-semibold">
                {isVi ? "Công thức phân loại dự đoán lớp c có xác suất cao nhất:" : "Classification formula predicts the class c with highest probability:"}
              </div>
              <BlockMath math="\hat{y} = \arg\max_{c} P(c) \prod_{i=1}^{n} P(x_i|c)" />
            </div>
          </div>
          
          <InfoBox>
            <strong>{isVi ? "Logarithmic Trick (Mẹo dùng Log)" : "Logarithmic Trick"}:</strong> 
            <br />
            {isVi 
              ? "Việc nhân nhiều số xác suất rất nhỏ (VD: 0.01 * 0.005 * 0.001) sẽ gây ra lỗi tràn số dưới (underflow) trên máy tính. Giải pháp là sử dụng Logarit để biến phép nhân thành phép cộng, giúp tính toán cực kỳ ổn định."
              : "Multiplying many small probability numbers causes floating-point underflow. The solution is to use Logarithms to convert multiplication into addition, ensuring stable calculation."}
            <div className="mt-2 text-center text-slate-800 dark:text-slate-200 bg-white/50 dark:bg-slate-800/50 p-2 rounded">
              <InlineMath math="\arg\max_{c} \left[ \log P(c) + \sum_{i=1}^{n} \log P(x_i|c) \right]" />
            </div>
          </InfoBox>
        </Section>

        {/* 5. Interactive Simulator */}
        <Section id="simulator" title={isVi ? "Mô phỏng tương tác: Lọc Spam" : "Interactive Simulator: Spam Filter"} icon="🎮">
          <p className="mb-4 text-sm">
            {isVi
              ? 'Thử nhập một đoạn văn bản hoặc chọn mẫu gợi ý. Mô hình Naive Bayes đơn giản bên dưới sẽ phân tích xác suất của các từ khóa và quyết định xem đây là SPAM hay HAM (tin bình thường).'
              : 'Try entering some text or choose a suggestion. The simple Naive Bayes model below will analyze keyword probabilities and decide if it is SPAM or HAM (normal message).'}
          </p>
          <SpamClassifierDemo />
        </Section>

        {/* 6. Variants */}
        <Section id="variants" title={isVi ? "Các biến thể của Naive Bayes" : "Variants of Naive Bayes"} icon="🧬">
           <p className="mb-4">
             {isVi
               ? "Tùy thuộc vào kiểu dữ liệu của các đặc trưng, ta sử dụng công thức tính xác suất hợp lý P(x_i | c) phù hợp:"
               : "Depending on the feature data types, we choose the appropriate probability estimation method for P(x_i | c):"}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
               <div>
                 <h4 className="font-extrabold text-blue-600 dark:text-blue-400 mb-3 text-lg">Multinomial NB</h4>
                 <p className="text-sm mb-4 leading-relaxed">
                   {isVi 
                     ? "Áp dụng cho dữ liệu đếm tần suất (VD: số lần từ xuất hiện trong văn bản). Phổ biến nhất cho Phân loại văn bản." 
                     : "Applied to frequency counts (e.g. word frequency in text). Most popular variant for Text Classification."}
                 </p>
               </div>
               <div className="bg-slate-950 p-3 rounded-xl text-xs overflow-x-auto border border-slate-800">
                 <BlockMath math="P(x_i|c) = \frac{N_{ci} + \alpha}{N_c + d\alpha}" />
                 <p className="text-[10px] text-slate-500 mt-2 text-center">
                   {isVi ? "Kỹ thuật Laplace Smoothing tránh xác suất bằng 0." : "Laplace Smoothing prevents zero probability."}
                 </p>
               </div>
             </div>

             <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
               <div>
                 <h4 className="font-extrabold text-sky-600 dark:text-sky-400 mb-3 text-lg">Bernoulli NB</h4>
                 <p className="text-sm mb-4 leading-relaxed">
                   {isVi 
                     ? "Áp dụng khi đặc trưng chỉ ở dạng Nhị phân (0 hoặc 1), ví dụ: một từ có xuất hiện hay không xuất hiện trong văn bản." 
                     : "Applied when features are Binary (0 or 1), indicating presence or absence of a word in a document."}
                 </p>
               </div>
               <div className="bg-slate-950 p-3 rounded-xl text-xs overflow-x-auto border border-slate-800">
                 <BlockMath math="P(x_i|c) = (P_{i,c})^{x_i}(1 - P_{i,c})^{1 - x_i}" />
                 <p className="text-[10px] text-slate-500 mt-2 text-center">
                   {isVi ? "Với x_i là 0 hoặc 1." : "Where x_i is either 0 or 1."}
                 </p>
               </div>
             </div>

             <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
               <div>
                 <h4 className="font-extrabold text-cyan-600 dark:text-cyan-400 mb-3 text-lg">Gaussian NB</h4>
                 <p className="text-sm mb-4 leading-relaxed">
                   {isVi 
                     ? "Áp dụng cho đặc trưng là số thực liên tục (VD: chiều cao, cân nặng). Giả định dữ liệu tuân theo Phân phối chuẩn." 
                     : "Applied to continuous real-valued features (e.g. height, weight). Assumes features follow a normal distribution."}
                 </p>
               </div>
               <div className="bg-slate-950 p-3 rounded-xl text-xs overflow-x-auto border border-slate-800">
                 <BlockMath math="P(x_i|c) = \frac{1}{\sqrt{2\pi\sigma_{ci}^2}} e^{-\frac{(x_i - \mu_{ci})^2}{2\sigma_{ci}^2}}" />
                 <p className="text-[10px] text-slate-500 mt-2 text-center">
                   <InlineMath math="\mu_{ci}" />: {isVi ? "trung bình, " : "mean, "} <InlineMath math="\sigma_{ci}^2" />: {isVi ? "phương sai." : "variance."}
                 </p>
               </div>
             </div>
           </div>
        </Section>

        {/* 7. Spam Example Walkthrough */}
        <Section id="spam-example" title={isVi ? "Ví dụ chi tiết: Lọc Email Spam" : "Detailed Example: Spam Email Classification"} icon="📧">
          <p>
            {isVi
              ? "Hãy cùng giải chi tiết bài toán phân loại email mới E_4 là Spam (S) hay Not Spam (N) dựa trên từ điển chứa 7 từ dưới đây, sử dụng Laplace Smoothing với alpha = 1."
              : "Let's walk through a detailed calculation to classify a new email E_4 as Spam (S) or Not Spam (N) using a 7-word dictionary and Laplace Smoothing with alpha = 1."}
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 overflow-hidden mt-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-3">
              {isVi ? "Bước 1: Tính xác suất tiên nghiệm P(c)" : "Step 1: Calculate Prior Probability P(c)"}
            </h4>
            <p className="text-sm mb-4">
              {isVi
                ? "Giả sử tập huấn luyện có 3 email (E_1, E_2, E_3), trong đó có 1 email là Spam, 2 email là Not Spam."
                : "Suppose our training set has 3 emails (E_1, E_2, E_3), with 1 classified as Spam and 2 as Not Spam."}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">P(Spam)</span>
                <span className="text-lg font-mono font-black text-blue-500">1 / 3 ≈ 33.3%</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">P(Not Spam)</span>
                <span className="text-lg font-mono font-black text-emerald-500">2 / 3 ≈ 66.7%</span>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              {isVi ? "Bước 2: Tính xác suất có điều kiện P(E_4 | c) với Laplace Smoothing (alpha = 1)" : "Step 2: Calculate Likelihood P(E_4 | c) with Laplace Smoothing (alpha = 1)"}
            </h4>
            <p className="text-sm mb-4">
              {isVi
                ? "Sử dụng Laplace Smoothing để tránh việc một từ chưa từng xuất hiện trong tập huấn luyện làm triệt tiêu toàn bộ tích xác suất (lỗi zero probability):"
                : "Using Laplace Smoothing to prevent any zero-frequency word from zeroing out the entire product calculation:"}
            </p>
            <div className="bg-slate-950 p-4 rounded-xl text-white font-mono text-xs overflow-x-auto mb-4">
              <BlockMath math="P(w_i|c) = \frac{\text{Số lần từ } w_i \text{ xuất hiện trong lớp } c + 1}{\text{Tổng số từ trong lớp } c + \text{Kích thước từ điển } d}" />
            </div>
            <p className="text-sm leading-relaxed mb-6">
              {isVi
                ? "Tính toán tích xác suất cho email mới E_4 gồm các từ xuất hiện trong từ điển:"
                : "Multiply the word probabilities for the words present in E_4:"}
              <br />
              • <InlineMath math="P(Spam|E_4) \propto P(Spam) \times \prod P(w_i|Spam) \propto 0.0046" />
              <br />
              • <InlineMath math="P(Not Spam|E_4) \propto P(Not Spam) \times \prod P(w_i|Not Spam) \propto 0.0092" />
            </p>

            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              {isVi ? "Bước 3: Chuẩn hóa xác suất và Đưa ra kết luận" : "Step 3: Normalize Probabilities and Classify"}
            </h4>
            <p className="text-sm mb-4">
              {isVi
                ? "Ta đưa các xác suất tỉ lệ thuận ở trên về dạng phần trăm bằng cách chia cho tổng của chúng (0.0046 + 0.0092 = 0.0138):"
                : "We normalize the proportional values to actual percentages by dividing them by their sum (0.0046 + 0.0092 = 0.0138):"}
            </p>
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>{isVi ? "Xác suất là Spam" : "Spam Probability"}</span>
                  <span>33.4%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '33.4%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>{isVi ? "Xác suất là Not Spam" : "Not Spam Probability"}</span>
                  <span>66.6%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '66.6%' }} />
                </div>
              </div>
            </div>
            <InfoBox variant="warning">
              💡 {isVi
                ? "Vì xác suất Not Spam (66.6%) cao hơn Spam (33.4%), mô hình quyết định phân loại email E_4 là NOT SPAM."
                : "Since Not Spam probability (66.6%) is higher than Spam (33.4%), the model classifies email E_4 as NOT SPAM."}
            </InfoBox>
          </div>
        </Section>

        {/* 7. Pros/Cons */}
        <Section id="pros-cons" title={isVi ? "Ưu & Nhược điểm" : "Pros & Cons"} icon="⚖️">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                <span className="text-xl">✅</span> {isVi ? "Ưu điểm" : "Pros"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Huấn luyện cực kỳ nhanh (chỉ đếm tần suất)." : "Extremely fast to train (just counting frequencies)."}</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Hoạt động tốt với tập dữ liệu nhỏ." : "Performs well even with small datasets."}</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Xử lý tuyệt vời không gian đa chiều (như hàng chục ngàn từ vựng)." : "Handles highly dimensional spaces excellently (like tens of thousands of words)."}</span></li>
              </ul>
            </div>
            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span> {isVi ? "Nhược điểm" : "Cons"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">•</span> <span>{isVi ? "Giả định các đặc trưng độc lập hiếm khi thực tế (VD: từ 'New' và 'York' thường đi cùng nhau)." : "The assumption of feature independence is rarely realistic."}</span></li>
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">•</span> <span>{isVi ? "Zero Frequency: Nếu từ mới xuất hiện, xác suất = 0, làm toàn bộ tích = 0 (cần dùng Laplace Smoothing)." : "Zero Frequency problem requires Laplace smoothing."}</span></li>
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">•</span> <span>{isVi ? "Ước lượng xác suất không được chuẩn (Bad estimator)." : "Known as a bad estimator, so the output probabilities shouldn't be taken too seriously."}</span></li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 8. Python Code */}
        <Section id="python" title={isVi ? "Triển khai Python" : "Python Implementation"} icon="💻">
          <p className="mb-4">
            {isVi 
              ? "Triển khai hệ thống phân loại Spam bằng Multinomial Naive Bayes và CountVectorizer:"
              : "Implementing a Spam classification system using Multinomial Naive Bayes and CountVectorizer:"}
          </p>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
            <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-xs text-slate-400 font-mono ml-2">spam_classifier.py</span>
            </div>
            <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers customStyle={{ margin: 0, padding: '1.5rem', background: '#0f172a' }}>
              {pythonCode}
            </SyntaxHighlighter>
          </div>
        </Section>
      </div>

      {/* Table of contents sidebar */}
      <div className="hidden lg:block lg:w-1/4">
        <div className="sticky top-24 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none">
          <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
            {isVi ? "Nội dung" : "Contents"}
          </h3>
          <nav className="flex flex-col space-y-2.5 text-sm font-medium">
            {[
              { id: 'hero', text: isVi ? "1. Tổng quan" : "1. Overview" },
              { id: 'intro', text: isVi ? "2. Giới thiệu" : "2. Introduction" },
              { id: 'bayes', text: isVi ? "3. Định lý Bayes" : "3. Bayes Theorem" },
              { id: 'math', text: isVi ? "4. Toán học" : "4. Math" },
              { id: 'simulator', text: isVi ? "5. Mô phỏng Spam" : "5. Simulator" },
              { id: 'variants', text: isVi ? "6. Các biến thể" : "6. Variants" },
              { id: 'spam-example', text: isVi ? "7. Ví dụ Lọc Spam" : "7. Spam Walkthrough" },
              { id: 'pros-cons', text: isVi ? "8. Ưu / Nhược" : "8. Pros & Cons" },
              { id: 'python', text: isVi ? "9. Code Python" : "9. Python" },
            ].map(item => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
              >
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
