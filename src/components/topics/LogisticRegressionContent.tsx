import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Calculator, ShieldAlert, GitMerge } from 'lucide-react';

export default function LogisticRegressionContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const Section = ({ title, children, id, icon }: { title: string, children: React.ReactNode, id: string, icon?: string }) => (
    <section id={id} className="mb-16 scroll-mt-24">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-base shadow-md">
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
          : 'bg-violet-50 dark:bg-violet-900/20 border-violet-500'
      }`}>
        {children}
      </div>
    );
  };

  const pythonCode = `import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.datasets import make_classification

# 1. Generate synthetic dataset (Binary Classification)
X, y = make_classification(n_samples=1000, n_features=2, n_informative=2, 
                           n_redundant=0, n_clusters_per_class=1, random_state=42)

# 2. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 3. Feature Scaling (Crucial for Logistic Regression)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. Model Training
model = LogisticRegression(C=1.0, solver='lbfgs', random_state=42)
model.fit(X_train_scaled, y_train)

# 5. Prediction (Classes and Probabilities)
y_pred = model.predict(X_test_scaled)
y_prob = model.predict_proba(X_test_scaled)[:, 1] # Probability of Class 1

# 6. Evaluation
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Confusion Matrix:\\n", confusion_matrix(y_test, y_pred))
print("Classification Report:\\n", classification_report(y_test, y_pred))`;

  const faqs = [
    {
      q: isVi ? "Tại sao gọi là Logistic Regression nhưng lại dùng để Phân loại?" : "Why is it called Logistic Regression if it's used for classification?",
      a: isVi ? "Nó có chữ 'Regression' vì cấu trúc toán học cốt lõi của nó là Hồi quy tuyến tính (tính tổng có trọng số). Tuy nhiên, kết quả được đưa qua hàm Logistic (Sigmoid) để bóp giá trị về [0, 1], phù hợp cho mục đích phân loại xác suất." : "It contains 'Regression' because the underlying math is a linear regression (weighted sum). However, the output is passed through a Logistic (Sigmoid) function to squash the value into the [0, 1] range, making it a probabilistic classification model."
    },
    {
      q: isVi ? "Hàm Sigmoid là gì?" : "What is the sigmoid function?",
      a: isVi ? "Hàm Sigmoid là một hàm toán học có đường cong hình chữ S, biến đổi mọi số thực từ âm vô cùng đến dương vô cùng thành một khoảng giới hạn từ 0 đến 1. Nó đại diện cho xác suất của lớp Positive." : "The Sigmoid function is an S-shaped mathematical curve that maps any real-valued number into a value between 0 and 1. It represents the probability of the positive class."
    },
    {
      q: isVi ? "Ngưỡng quyết định (Decision Threshold) là gì?" : "What is the decision threshold?",
      a: isVi ? "Đây là mốc giá trị xác suất (thường là 0.5) để quyết định phân lớp. Nếu P(y=1) ≥ 0.5, dự đoán lớp 1, ngược lại dự đoán lớp 0. Ngưỡng này có thể thay đổi tùy bài toán." : "It is the probability cutoff (usually 0.5) used to classify samples. If P(y=1) ≥ 0.5, predict class 1, otherwise predict class 0. It can be tuned based on the problem."
    },
    {
      q: isVi ? "Sự khác biệt giữa Logistic Regression và Linear Regression?" : "Difference between Logistic Regression and Linear Regression?",
      a: isVi ? "Linear Regression dự đoán một giá trị liên tục (Ví dụ: giá nhà) và output có thể từ -∞ đến +∞. Logistic Regression dự đoán xác suất rớt vào một lớp (Ví dụ: Chó/Mèo) và output bị giới hạn từ 0 đến 1." : "Linear Regression predicts continuous values (e.g., house prices) with outputs from -∞ to +∞. Logistic Regression predicts class probabilities (e.g., Dog/Cat) bounded between 0 and 1."
    }
  ];

  /* ───────────── Logistic Interactive Simulator ───────────── */
  function LogisticSimulator() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedClass, setSelectedClass] = useState<1 | 0>(1);
    const [epochs, setEpochs] = useState(0);
    const [accuracy, setAccuracy] = useState('0.0%');
    const [hint, setHint] = useState(isVi ? 'Chọn Lớp và click lên canvas để vẽ điểm' : 'Select a Class and click canvas to add points');
    const [isFitting, setIsFitting] = useState(false);
    
    const pointsRef = useRef<{x:number, y:number, label:number}[]>([]);
    const weightsRef = useRef<{w1:number, w2:number, b:number}>({w1: 0, w2: 0, b: 0});
    const fitTimerRef = useRef<ReturnType<typeof setInterval>|null>(null);

    const draw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      
      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, H);
      
      // Grid dots
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (let x = 20; x < W; x += 30) for (let y = 20; y < H; y += 30) ctx.fillRect(x, y, 1.5, 1.5);
      
      const { w1, w2, b } = weightsRef.current;
      
      // Decision boundary mapping normalized [0,1] coordinates back to canvas
      if (w1 !== 0 || w2 !== 0) {
        ctx.save();
        ctx.beginPath();
        if (Math.abs(w2) > Math.abs(w1)) {
          // line intercepts x=0 and x=W
          const y1 = H * (-w1*(0/W) - b)/w2;
          const y2 = H * (-w1*(W/W) - b)/w2;
          ctx.moveTo(0, y1);
          ctx.lineTo(W, y2);
        } else {
          // line intercepts y=0 and y=H
          const x1 = W * (-w2*(0/H) - b)/w1;
          const x2 = W * (-w2*(H/H) - b)/w1;
          ctx.moveTo(x1, 0);
          ctx.lineTo(x2, H);
        }
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // draw shading
        ctx.globalAlpha = 0.1;
        if (w2 !== 0) {
           // Shade based on prediction sign
           ctx.fillStyle = '#6366f1';
           ctx.beginPath();
           if (w2 > 0) {
             ctx.moveTo(0, H * (-w1*(0/W) - b)/w2);
             ctx.lineTo(W, H * (-w1*(W/W) - b)/w2);
             ctx.lineTo(W, H);
             ctx.lineTo(0, H);
           } else {
             ctx.moveTo(0, H * (-w1*(0/W) - b)/w2);
             ctx.lineTo(W, H * (-w1*(W/W) - b)/w2);
             ctx.lineTo(W, 0);
             ctx.lineTo(0, 0);
           }
           ctx.fill();
        }
        ctx.restore();
      }
      
      // Draw points
      pointsRef.current.forEach(p => {
        const color = p.label === 1 ? '#6366f1' : '#f43f5e';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI*2);
        ctx.fillStyle = color + '44'; // glow
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        draw();
      };
      resize();
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }, [draw]);

    const updateStats = useCallback(() => {
       const pts = pointsRef.current;
       const canvas = canvasRef.current;
       if (!pts.length || !canvas) { setAccuracy('0.0%'); return; }
       const W = canvas.width, H = canvas.height;
       const { w1, w2, b } = weightsRef.current;
       let correct = 0;
       pts.forEach(p => {
         const z = w1*(p.x/W) + w2*(p.y/H) + b;
         const pred = z >= 0 ? 1 : 0;
         if (pred === p.label) correct++;
       });
       setAccuracy(((correct/pts.length)*100).toFixed(1) + '%');
    }, []);

    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      pointsRef.current.push({ x, y, label: selectedClass });
      draw();
      if (weightsRef.current.w1 !== 0 || weightsRef.current.w2 !== 0) {
        updateStats();
      }
    }, [selectedClass, draw, updateStats]);

    const fitModel = useCallback(() => {
      const pts = pointsRef.current;
      const canvas = canvasRef.current;
      if (pts.length < 2 || !canvas) {
        setHint(isVi ? 'Cần ít nhất 2 điểm để huấn luyện!' : 'Need at least 2 points to train!');
        return;
      }
      
      const hasClass1 = pts.some(p => p.label === 1);
      const hasClass0 = pts.some(p => p.label === 0);
      if (!hasClass1 || !hasClass0) {
        setHint(isVi ? 'Cần điểm của cả 2 lớp!' : 'Need points from both classes!');
        return;
      }

      if (isFitting) return;
      setIsFitting(true);
      
      const W = canvas.width, H = canvas.height;
      weightsRef.current = { w1: (Math.random()-0.5)*0.1, w2: (Math.random()-0.5)*0.1, b: 0 };
      setEpochs(0);
      
      let currentEpoch = 0;
      const lr = 1.5; // relatively large LR for fast convergence on [0,1] normalized data
      
      if (fitTimerRef.current) clearInterval(fitTimerRef.current);
      
      fitTimerRef.current = setInterval(() => {
        let { w1, w2, b } = weightsRef.current;
        
        let dw1 = 0, dw2 = 0, db = 0;
        pts.forEach(p => {
          const nx = p.x/W, ny = p.y/H;
          const z = w1*nx + w2*ny + b;
          const y_pred = 1 / (1 + Math.exp(-z));
          const error = y_pred - p.label;
          dw1 += error * nx;
          dw2 += error * ny;
          db += error;
        });
        
        w1 -= lr * (dw1 / pts.length);
        w2 -= lr * (dw2 / pts.length);
        b -= lr * (db / pts.length);

        weightsRef.current = { w1, w2, b };
        currentEpoch += 5;
        setEpochs(currentEpoch);
        draw();
        updateStats();

        if (currentEpoch >= 150) {
          clearInterval(fitTimerRef.current!);
          fitTimerRef.current = null;
          setIsFitting(false);
          setHint(isVi ? 'Huấn luyện hoàn tất!' : 'Training complete!');
        }
      }, 40);
      
    }, [isFitting, draw, updateStats, isVi]);

    const generateData = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const W = canvas.width || 600, H = canvas.height || 360;
      pointsRef.current = [];
      
      for(let i=0; i<30; i++) {
        pointsRef.current.push({
          x: W*0.7 + (Math.random()-0.5)*150,
          y: H*0.3 + (Math.random()-0.5)*150,
          label: 1
        });
      }
      for(let i=0; i<30; i++) {
        pointsRef.current.push({
          x: W*0.3 + (Math.random()-0.5)*150,
          y: H*0.7 + (Math.random()-0.5)*150,
          label: 0
        });
      }
      weightsRef.current = {w1:0, w2:0, b:0};
      setEpochs(0);
      setAccuracy('0.0%');
      setHint(isVi ? 'Đã tạo dữ liệu mẫu. Bấm Fit Model để huấn luyện.' : 'Generated sample data. Click Fit Model to train.');
      draw();
    }, [draw, isVi]);

    const clearAll = useCallback(() => {
      if (fitTimerRef.current) clearInterval(fitTimerRef.current);
      fitTimerRef.current = null;
      setIsFitting(false);
      pointsRef.current = [];
      weightsRef.current = {w1:0, w2:0, b:0};
      setEpochs(0);
      setAccuracy('0.0%');
      setHint(isVi ? 'Canvas đã xóa. Click để vẽ điểm mới!' : 'Canvas cleared. Click to draw new points!');
      draw();
    }, [draw, isVi]);

    return (
      <div className="rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900 mt-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            {isVi ? 'Bảng mô phỏng Logistic Regression' : 'Logistic Regression Simulator'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col gap-4">
            
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{isVi ? 'Chọn lớp để vẽ' : 'Select class to draw'}</span>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setSelectedClass(1)} className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors flex justify-center items-center gap-2 ${selectedClass === 1 ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-300"></span> Class A (1)
                </button>
                <button onClick={() => setSelectedClass(0)} className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors flex justify-center items-center gap-2 ${selectedClass === 0 ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-300"></span> Class B (0)
                </button>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <button onClick={fitModel} disabled={isFitting} className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl border border-violet-500 transition-colors shadow-lg shadow-violet-900/50">
                  {isFitting ? (isVi ? 'Đang huấn luyện...' : 'Training...') : (isVi ? '▶ Huấn luyện (Fit Model)' : '▶ Fit Model')}
                </button>
                <button onClick={generateData} disabled={isFitting} className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors">
                  {isVi ? 'Tạo dữ liệu mẫu' : 'Generate sample data'}
                </button>
                <button onClick={clearAll} disabled={isFitting} className="w-full py-2 bg-red-900/30 hover:bg-red-900/50 disabled:opacity-50 text-red-400 text-xs font-semibold rounded-xl border border-red-900/50 transition-colors">
                  {isVi ? 'Xóa hết' : 'Clear all'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-auto">
              <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Epochs</span>
                <span className="text-xs font-bold block mt-0.5 text-violet-300">{epochs} / 150</span>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Accuracy</span>
                <span className="text-xs font-bold block mt-0.5 text-emerald-400">{accuracy}</span>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50 col-span-2">
                 <p className="text-[10px] text-slate-400 leading-relaxed">{hint}</p>
              </div>
            </div>

          </div>

          <div className="lg:col-span-2 relative">
            <canvas ref={canvasRef} onClick={handleCanvasClick}
              className="w-full cursor-crosshair block"
              style={{ minHeight: 360 }} />
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-[10px] text-slate-400 px-3 py-1.5 rounded-lg border border-slate-700">
               {isVi ? 'Đường màu vàng: Ranh giới quyết định (Decision Boundary)' : 'Yellow line: Decision Boundary'}
            </div>
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
          <div className="p-10 rounded-3xl bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 text-white shadow-2xl relative overflow-hidden border border-violet-700/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-300 mb-3 bg-violet-800/60 px-3 py-1 rounded-full border border-violet-700">
                {isVi ? 'Học có giám sát' : 'Supervised Learning'}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Logistic Regression</h1>
              <p className="text-xl text-violet-100 mb-8 max-w-2xl leading-relaxed">
                {isVi 
                  ? "Đừng để cái tên đánh lừa! Đây là một trong những thuật toán phân loại kinh điển nhất, nền tảng của các mạng nơ-ron hiện đại."
                  : "Don't let the name fool you! This is one of the most fundamental classification algorithms and the building block of modern neural networks."}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-5">
                {['Binary Classification', 'Sigmoid', 'Probabilistic', 'Log Loss'].map(tag => (
                  <span key={tag} className="text-xs font-semibold text-violet-200 bg-violet-700/50 px-3 py-1 rounded-full border border-violet-600/50">
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
              ? "Logistic Regression là một thuật toán học máy có giám sát chuyên giải quyết các bài toán phân loại (Classification). Mặc dù có từ 'Regression' (Hồi quy) trong tên gọi, nó không dùng để dự đoán một số thực liên tục như Linear Regression."
              : "Logistic Regression is a supervised machine learning algorithm used primarily for Classification tasks. Despite having 'Regression' in its name, it does not predict continuous variables like Linear Regression does."}
          </p>
          <p>
            {isVi
              ? "Thay vào đó, nó dự đoán XÁC SUẤT một điểm dữ liệu thuộc về một lớp (ví dụ lớp '1'). Điều này khiến nó trở thành công cụ tuyệt vời cho các bài toán Binary Classification (Phân loại nhị phân: Thắng/Thua, Rác/Không rác)."
              : "Instead, it predicts the PROBABILITY that a given data point belongs to a default class (e.g., class '1'). This makes it an excellent tool for Binary Classification problems (Win/Loss, Spam/Not Spam)."}
          </p>
        </Section>

        {/* 3. Intuition */}
        <Section id="intuition" title={isVi ? "Trực giác (Intuition)" : "Intuition"} icon="💡">
          <p>
            {isVi 
              ? "Trong Linear Regression, một đường thẳng có thể kéo dài từ âm vô cùng đến dương vô cùng. Nếu ta dùng nó để dự đoán xác suất thì sẽ thu được những kết quả vô lý như -0.5 hay 1.8. Xác suất bắt buộc phải nằm trong khoảng [0, 1]."
              : "In Linear Regression, a straight line can stretch from negative infinity to positive infinity. If we use it to predict probabilities, we might get nonsensical values like -0.5 or 1.8. Probabilities must strictly be bounded between [0, 1]."}
          </p>
          <p>
            {isVi
              ? "Vì vậy, Logistic Regression lấy kết quả tuyến tính đó, bóp méo nó thông qua một đường cong chữ S, sao cho mọi giá trị lớn đều tiến về 1, và mọi giá trị âm nhỏ đều tiến về 0."
              : "Thus, Logistic Regression takes that linear output and squashes it through an S-shaped curve, so large positive values approach 1, and large negative values approach 0."}
          </p>
        </Section>

        {/* 4. Sigmoid Function */}
        <Section id="sigmoid" title={isVi ? "Hàm Sigmoid" : "Sigmoid Function"} icon="📈">
          <p>
            {isVi ? "Trái tim của thuật toán này là Hàm Sigmoid (Hàm Logistic). Công thức:" : "The heart of this algorithm is the Sigmoid function. Formula:"}
          </p>
          <div className="bg-slate-900 p-6 rounded-2xl my-6 flex justify-center text-white overflow-x-auto shadow-inner">
            <BlockMath math="\sigma(z) = \frac{1}{1 + e^{-z}}" />
          </div>
          <p className="text-sm">
            {isVi ? "Trong đó:" : "Where:"} <InlineMath math="e" /> {isVi ? "là hằng số Euler (~2.718) và" : "is Euler's number (~2.718) and"} <InlineMath math="z" /> {isVi ? "là giá trị đầu vào (kết quả hồi quy tuyến tính)." : "is the input value (the linear regression output)."}
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 mt-6">
            <div className="flex flex-col items-center">
              <span className="font-bold mb-4">The S-Curve (Sigmoid)</span>
              <svg width="300" height="200" viewBox="0 0 300 200" className="overflow-visible">
                <line x1="20" y1="20" x2="280" y2="20" stroke="currentColor" strokeDasharray="4,4" className="text-slate-300 dark:text-slate-600" />
                <text x="5" y="25" fontSize="12" fill="currentColor" className="text-slate-500">1.0</text>
                
                <line x1="20" y1="100" x2="280" y2="100" stroke="currentColor" strokeDasharray="4,4" className="text-slate-300 dark:text-slate-600" />
                <text x="5" y="105" fontSize="12" fill="currentColor" className="text-slate-500">0.5</text>
                
                <line x1="20" y1="180" x2="280" y2="180" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                <line x1="150" y1="20" x2="150" y2="180" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                
                <path d="M 20 175 Q 120 170 150 100 T 280 25" fill="none" stroke="#8b5cf6" strokeWidth="4" />
                
                <circle cx="150" cy="100" r="5" fill="#ef4444" />
                <text x="160" y="95" fill="#ef4444" fontSize="12" fontWeight="bold">Threshold (0.5)</text>
                <text x="270" y="195" fill="currentColor" fontSize="12" className="text-slate-500">+z</text>
                <text x="20" y="195" fill="currentColor" fontSize="12" className="text-slate-500">-z</text>
              </svg>
            </div>
          </div>
        </Section>

        {/* 5. Mathematical Foundation */}
        <Section id="math" title={isVi ? "Nền tảng Toán học" : "Mathematical Foundation"} icon="➗">
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-6 shadow-inner">
            <div>
              <div className="text-sm text-slate-400 mb-2 font-semibold">1. {isVi ? "Hồi quy tuyến tính" : "Linear Combination"}</div>
              <BlockMath math="z = W^T X + b" />
            </div>
            <div className="border-t border-slate-700/50 pt-4">
              <div className="text-sm text-slate-400 mb-2 font-semibold">2. {isVi ? "Xác suất (Sigmoid)" : "Probability (Sigmoid)"}</div>
              <BlockMath math="\hat{y} = P(y=1 | X) = \sigma(z)" />
            </div>
            <div className="border-t border-slate-700/50 pt-4">
              <div className="text-sm text-slate-400 mb-2 font-semibold">3. {isVi ? "Hàm mất mát (Log Loss / Cross-Entropy)" : "Cost Function (Log Loss)"}</div>
              <BlockMath math="J(W) = - \frac{1}{m} \sum_{i=1}^{m} \left[ y^{(i)} \log(\hat{y}^{(i)}) + (1 - y^{(i)}) \log(1 - \hat{y}^{(i)}) \right]" />
            </div>
          </div>
          <InfoBox>
            {isVi 
              ? "Tại sao không dùng Mean Squared Error (MSE)? Nếu kết hợp MSE với Sigmoid, đồ thị hàm mất mát sẽ gồ ghề và chứa rất nhiều điểm tối ưu cục bộ. Log Loss ép mô hình phải dự đoán đúng với mức độ tự tin cao và luôn có một đáy duy nhất (Convex)."
              : "Why not use MSE? Passing MSE through a Sigmoid creates a non-convex loss surface with many local minima. Log Loss penalizes confident wrong predictions heavily and is always convex."}
          </InfoBox>
        </Section>

        {/* 6. Interactive Simulator */}
        <Section id="simulator" title={isVi ? "Mô phỏng tương tác" : "Interactive Simulator"} icon="🎮">
          <p className="mb-4 text-sm">
            {isVi
              ? 'Thử thêm các điểm của Class A và Class B, sau đó chạy quá trình huấn luyện (Gradient Descent) để tìm ranh giới quyết định (Decision Boundary).'
              : 'Add points for Class A and Class B, then run training (Gradient Descent) to find the Decision Boundary.'}
          </p>
          <LogisticSimulator />
        </Section>

        {/* 7. Pros/Cons */}
        <Section id="pros-cons" title={isVi ? "Ưu & Nhược điểm" : "Pros & Cons"} icon="⚖️">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                <span className="text-xl">✅</span> {isVi ? "Ưu điểm" : "Pros"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Đơn giản, tốc độ huấn luyện rất nhanh." : "Simple and fast to train."}</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Dễ diễn giải: Trọng số (weights) thể hiện trực tiếp mức độ quan trọng của feature." : "Interpretable: Weights directly show feature importance."}</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Đưa ra dự đoán dưới dạng xác suất rõ ràng." : "Outputs well-calibrated probabilities."}</span></li>
              </ul>
            </div>
            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span> {isVi ? "Nhược điểm" : "Cons"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">•</span> <span>{isVi ? "Chỉ hiệu quả nếu dữ liệu có thể phân tách tuyến tính (Linearly separable)." : "Only works well if data is linearly separable."}</span></li>
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">•</span> <span>{isVi ? "Dễ bị ảnh hưởng bởi nhiễu (outliers) cực đoan." : "Can be sensitive to extreme outliers."}</span></li>
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">•</span> <span>{isVi ? "Yêu cầu phải chuẩn hoá dữ liệu (Feature Scaling) để hội tụ tốt." : "Requires feature scaling for optimal convergence."}</span></li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 8. Python Code */}
        <Section id="python" title={isVi ? "Triển khai Python" : "Python Implementation"} icon="💻">
          <p className="mb-4">
            {isVi 
              ? "Sử dụng Scikit-Learn với bước chuẩn hóa dữ liệu quan trọng (StandardScaler):"
              : "Using Scikit-Learn with the crucial feature scaling step (StandardScaler):"}
          </p>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
            <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-xs text-slate-400 font-mono ml-2">logistic_regression.py</span>
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
          <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {isVi ? "Nội dung" : "Contents"}
          </h3>
          <nav className="flex flex-col space-y-2.5 text-sm font-medium">
            {[
              { id: 'hero', text: isVi ? "1. Tổng quan" : "1. Overview" },
              { id: 'intro', text: isVi ? "2. Giới thiệu" : "2. Introduction" },
              { id: 'intuition', text: isVi ? "3. Trực giác" : "3. Intuition" },
              { id: 'sigmoid', text: isVi ? "4. Hàm Sigmoid" : "4. Sigmoid" },
              { id: 'math', text: isVi ? "5. Nền tảng Toán học" : "5. Math" },
              { id: 'simulator', text: isVi ? "6. Mô phỏng tương tác" : "6. Simulator" },
              { id: 'pros-cons', text: isVi ? "7. Ưu / Nhược" : "7. Pros & Cons" },
              { id: 'python', text: isVi ? "8. Code Python" : "8. Python" },
            ].map(item => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-2"
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
