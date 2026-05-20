import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function SVMContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  const Section = ({ title, children, id, icon }: { title: string, children: React.ReactNode, id: string, icon?: string }) => (
    <section id={id} className="mb-16 scroll-mt-24">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-base shadow-md">
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
          : 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
      }`}>
        {children}
      </div>
    );
  };

  const pythonCode = `import numpy as np
import matplotlib.pyplot as plt
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

# 1. Load dataset (Breast Cancer for Binary Classification)
data = datasets.load_breast_cancer()
X = data.data
y = data.target

# 2. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 3. Feature Scaling (Absolutely CRITICAL for SVM)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. Train the Support Vector Machine Model
# Kernel options: 'linear', 'poly', 'rbf', 'sigmoid'
# C is the regularization parameter (smaller C = wider margin but more violations)
svm_model = SVC(kernel='rbf', C=1.0, gamma='scale', random_state=42)
svm_model.fit(X_train_scaled, y_train)

# 5. Prediction & Evaluation
y_pred = svm_model.predict(X_test_scaled)
print("SVM Accuracy:", accuracy_score(y_test, y_pred))

# Note: To get probabilities with SVM, you need to set probability=True during init
# svm_model = SVC(..., probability=True) -> then use svm_model.predict_proba()`;

  /* ───────────── SVM Interactive Simulator ───────────── */
  function SVMSimulator() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedClass, setSelectedClass] = useState<1 | -1>(1);
    const [epochs, setEpochs] = useState(0);
    const [accuracy, setAccuracy] = useState('0.0%');
    const [hint, setHint] = useState(isVi ? 'Nhấp vào canvas để vẽ điểm' : 'Click canvas to add points');
    const [isFitting, setIsFitting] = useState(false);
    const [cValue, setCValue] = useState(10); // C parameter
    
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
      
      if (w1 !== 0 || w2 !== 0) {
        ctx.save();
        
        const drawLine = (offset: number, color: string, dash: number[], width: number) => {
          ctx.beginPath();
          if (Math.abs(w2) > Math.abs(w1)) {
            const y1 = H * (-w1*(0/W) - b + offset)/w2;
            const y2 = H * (-w1*(W/W) - b + offset)/w2;
            ctx.moveTo(0, y1);
            ctx.lineTo(W, y2);
          } else {
            const x1 = W * (-w2*(0/H) - b + offset)/w1;
            const x2 = W * (-w2*(H/H) - b + offset)/w1;
            ctx.moveTo(x1, 0);
            ctx.lineTo(x2, H);
          }
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.setLineDash(dash);
          ctx.stroke();
        };

        // Margin +1 (Class 1)
        drawLine(1, '#6366f1', [5, 5], 1);
        // Margin -1 (Class -1)
        drawLine(-1, '#f97316', [5, 5], 1);
        
        // Decision boundary (0)
        drawLine(0, '#fbbf24', [], 3);
        
        // Shading
        ctx.globalAlpha = 0.1;
        ctx.setLineDash([]);
        if (w2 !== 0) {
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
        const nx = p.x / W;
        const ny = p.y / H;
        const color = p.label === 1 ? '#6366f1' : '#f97316';
        
        let isSupportVector = false;
        if (w1 !== 0 || w2 !== 0) {
          const dist = p.label * (w1 * nx + w2 * ny + b);
          if (dist <= 1.05) isSupportVector = true;
        }

        ctx.beginPath();
        if (isSupportVector) {
          // Highlight support vector
          ctx.arc(p.x, p.y, 9, 0, Math.PI*2);
          ctx.fillStyle = color + '66'; 
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.arc(p.x, p.y, 7, 0, Math.PI*2);
          ctx.fillStyle = color + '44'; 
          ctx.fill();
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
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
         const pred = z >= 0 ? 1 : -1;
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
      if (pts.length < 2 || !canvas) return;
      
      if (isFitting) return;
      setIsFitting(true);
      
      const W = canvas.width, H = canvas.height;
      weightsRef.current = { w1: (Math.random()-0.5)*0.1, w2: (Math.random()-0.5)*0.1, b: 0 };
      setEpochs(0);
      
      let currentEpoch = 0;
      const lr = 0.05; // Pegasos learning rate base
      
      if (fitTimerRef.current) clearInterval(fitTimerRef.current);
      
      fitTimerRef.current = setInterval(() => {
        let { w1, w2, b } = weightsRef.current;
        
        let dw1 = w1, dw2 = w2, db = 0; // w from regularization term
        
        pts.forEach(p => {
          const nx = p.x/W, ny = p.y/H;
          const dist = p.label * (w1*nx + w2*ny + b);
          
          if (dist < 1) { // Hinge loss active
            dw1 -= cValue * p.label * nx;
            dw2 -= cValue * p.label * ny;
            db  -= cValue * p.label;
          }
        });
        
        // Update
        const effectiveLr = lr / (1 + currentEpoch * 0.01); // decay LR
        w1 -= effectiveLr * dw1 / pts.length;
        w2 -= effectiveLr * dw2 / pts.length;
        b -= effectiveLr * db / pts.length;

        weightsRef.current = { w1, w2, b };
        currentEpoch += 2;
        setEpochs(currentEpoch);
        draw();
        updateStats();

        if (currentEpoch >= 300) {
          clearInterval(fitTimerRef.current!);
          fitTimerRef.current = null;
          setIsFitting(false);
          setHint(isVi ? 'Hoàn tất! Các điểm có vòng sáng là Support Vectors' : 'Done! Highlighted points are Support Vectors');
        }
      }, 20);
      
    }, [isFitting, cValue, draw, updateStats, isVi]);

    const generateData = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const W = canvas.width || 600, H = canvas.height || 360;
      pointsRef.current = [];
      
      for(let i=0; i<30; i++) {
        pointsRef.current.push({ x: W*0.7 + (Math.random()-0.5)*150, y: H*0.3 + (Math.random()-0.5)*150, label: 1 });
      }
      for(let i=0; i<30; i++) {
        pointsRef.current.push({ x: W*0.3 + (Math.random()-0.5)*150, y: H*0.7 + (Math.random()-0.5)*150, label: -1 });
      }
      weightsRef.current = {w1:0, w2:0, b:0};
      setEpochs(0); setAccuracy('0.0%');
      setHint(isVi ? 'Đã tạo dữ liệu mẫu' : 'Generated sample data');
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
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {isVi ? 'Linear SVM Simulator (Hinge Loss)' : 'Linear SVM Simulator'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col gap-4">
            
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{isVi ? 'Chọn lớp' : 'Select class'}</span>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setSelectedClass(1)} className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors flex justify-center items-center gap-2 ${selectedClass === 1 ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-300"></span> Class A
                </button>
                <button onClick={() => setSelectedClass(-1)} className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors flex justify-center items-center gap-2 ${selectedClass === -1 ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-300"></span> Class B
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400">Parameter C: {cValue}</label>
              <input type="range" min="1" max="100" value={cValue} onChange={e => setCValue(Number(e.target.value))} disabled={isFitting} className="accent-amber-500" />
              <p className="text-[10px] text-slate-500 leading-tight">
                {isVi ? 'C nhỏ = Soft margin (chấp nhận sai). C lớn = Hard margin (cố gắng đúng 100%).' : 'Small C = Soft margin. Large C = Hard margin.'}
              </p>
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <button onClick={fitModel} disabled={isFitting} className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl border border-amber-500 transition-colors shadow-lg shadow-amber-900/50">
                  {isFitting ? (isVi ? 'Đang huấn luyện...' : 'Training...') : (isVi ? '▶ Huấn luyện SVM' : '▶ Fit SVM')}
                </button>
                <button onClick={generateData} disabled={isFitting} className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors">
                  {isVi ? 'Tạo dữ liệu' : 'Generate Data'}
                </button>
                <button onClick={() => {pointsRef.current=[]; weightsRef.current={w1:0,w2:0,b:0}; draw(); setAccuracy('0.0%');}} disabled={isFitting} className="w-full py-2 bg-red-900/30 hover:bg-red-900/50 disabled:opacity-50 text-red-400 text-xs font-semibold rounded-xl border border-red-900/50 transition-colors">
                  {isVi ? 'Xóa hết' : 'Clear all'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-auto">
              <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Epochs</span>
                <span className="text-xs font-bold block mt-0.5 text-amber-300">{epochs} / 300</span>
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
              style={{ minHeight: 400 }} />
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-[10px] text-slate-400 px-3 py-1.5 rounded-lg border border-slate-700">
               {isVi ? 'Đường nét đứt: Margins' : 'Dashed lines: Margins'}
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
          <div className="p-10 rounded-3xl bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900 text-white shadow-2xl relative overflow-hidden border border-orange-700/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-300 mb-3 bg-orange-800/60 px-3 py-1 rounded-full border border-orange-700">
                {isVi ? 'Học có giám sát' : 'Supervised Learning'}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Support Vector Machine (SVM)</h1>
              <p className="text-xl text-amber-100 mb-8 max-w-2xl leading-relaxed">
                {isVi 
                  ? "Thuật toán phân loại mạnh mẽ với triết lý: Tìm con đường rộng nhất để chia rẽ hai thế giới. Cỗ máy tạo 'Đường biên an toàn'."
                  : "A powerful classification algorithm with a philosophy: Find the widest street separating two worlds. The margin maximization machine."}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-5">
                {['Max Margin', 'Hyperplane', 'Kernel Trick', 'Support Vectors'].map(tag => (
                  <span key={tag} className="text-xs font-semibold text-amber-200 bg-orange-700/50 px-3 py-1 rounded-full border border-orange-600/50">
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
              ? "Support Vector Machine (SVM) là một thuật toán học có giám sát chủ yếu dùng để Phân loại (Classification). Khác với Logistic Regression chỉ cố gắng chia các lớp bằng một đường thẳng bất kỳ, SVM tìm kiếm một 'đường biên tốt nhất'."
              : "Support Vector Machine (SVM) is a supervised learning algorithm primarily used for Classification. Unlike Logistic Regression which finds any line separating classes, SVM searches for the 'best possible boundary'."}
          </p>
          <p>
            {isVi
              ? "'Tốt nhất' ở đây nghĩa là đường biên có khoảng cách (Margin) lớn nhất đến các điểm dữ liệu gần nhất của cả 2 lớp. Những điểm dữ liệu nằm sát rìa và đóng vai trò quyết định vị trí đường biên này được gọi là các Support Vectors."
              : "The 'best' means the boundary that maximizes the distance (Margin) to the nearest data points of both classes. The data points lying on the edges that dictate this boundary are called Support Vectors."}
          </p>
        </Section>

        {/* 3. The Math & Concepts */}
        <Section id="math" title={isVi ? "Toán học & Khái niệm cốt lõi" : "Math & Core Concepts"} icon="➗">
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-6 shadow-inner my-6">
            <div>
              <div className="text-sm text-slate-400 mb-2 font-semibold">1. {isVi ? "Phương trình Hyperplane" : "Hyperplane Equation"}</div>
              <BlockMath math="w^T x + b = 0" />
              <p className="text-xs text-slate-400 mt-2 text-center">
                <InlineMath math="w" /> {isVi ? "là Vector trọng số vuông góc với mặt phẳng." : "is the weight vector perpendicular to the plane."}
              </p>
            </div>
            <div className="border-t border-slate-700/50 pt-4">
              <div className="text-sm text-slate-400 mb-2 font-semibold">2. {isVi ? "Ranh giới 2 biên (Margins)" : "Margin Boundaries"}</div>
              <BlockMath math="w^T x + b \geq 1 \quad \text{(Class +1)}" />
              <BlockMath math="w^T x + b \leq -1 \quad \text{(Class -1)}" />
              <p className="text-xs text-slate-400 mt-2 text-center">
                {isVi ? "Khoảng cách Margin (độ rộng đường) = " : "Margin Distance (width of the street) = "} <InlineMath math="\frac{2}{||w||}" />
              </p>
            </div>
            <div className="border-t border-slate-700/50 pt-4">
              <div className="text-sm text-slate-400 mb-2 font-semibold">3. {isVi ? "Hàm mục tiêu (Tối ưu hóa)" : "Objective Function (Optimization)"}</div>
              <BlockMath math="\min_{w,b} \frac{1}{2} ||w||^2 + C \sum_{i=1}^n \max(0, 1 - y_i(w^T x_i + b))" />
              <p className="text-xs text-slate-400 mt-2 text-center">
                {isVi ? "Tối đa hóa Margin đồng thời Tối thiểu hóa lỗi (Hinge Loss)." : "Maximize Margin while Minimizing error (Hinge Loss)."}
              </p>
            </div>
          </div>
          
          <InfoBox>
            <strong>{isVi ? "Tham số C (Regularization)" : "Parameter C"}:</strong> 
            <br />
            {isVi 
              ? "C là tham số quyết định sự đánh đổi. C LỚN = Hard Margin (Tuyệt đối không cho phép điểm nào nằm sai biên, dễ bị Overfit). C NHỎ = Soft Margin (Cho phép một số điểm sai để đổi lấy đường biên rộng hơn và tổng quát hóa tốt hơn)."
              : "C handles the bias-variance tradeoff. LARGE C = Hard Margin (Strictly penalizes errors, prone to overfitting). SMALL C = Soft Margin (Allows some errors for a wider, better-generalizing margin)."}
          </InfoBox>
        </Section>

        {/* 4. Interactive Simulator */}
        <Section id="simulator" title={isVi ? "Mô phỏng tương tác Linear SVM" : "Linear SVM Simulator"} icon="🎮">
          <p className="mb-4 text-sm">
            {isVi
              ? 'Thử thay đổi tham số C và quan sát cách SVM xây dựng đường biên (Solid line) và Margin (Dashed lines). Các điểm phát sáng chính là Support Vectors!'
              : 'Try changing the C parameter and see how SVM builds the Decision Boundary (Solid line) and Margin (Dashed lines). Glowing points are Support Vectors!'}
          </p>
          <SVMSimulator />
        </Section>

        {/* 5. Kernel Trick */}
        <Section id="kernel" title={isVi ? "Vũ khí bí mật: Kernel Trick" : "Secret Weapon: The Kernel Trick"} icon="✨">
          <p>
            {isVi
              ? "Vậy nếu dữ liệu KHÔNG thể phân tách bằng đường thẳng thì sao? (Ví dụ tập dữ liệu hình tròn lồng nhau). Lúc này SVM dùng đến Kernel Trick."
              : "What if the data is NOT linearly separable? (e.g., concentric circles). This is where the Kernel Trick shines."}
          </p>
          <p>
            {isVi
              ? "Kernel Trick là phép toán chiếu dữ liệu từ không gian 2D lên không gian đa chiều (3D, 4D...) nơi chúng CÓ THỂ chia cắt bằng một mặt phẳng. Thay vì thực sự tốn sức tính toán tọa độ 3D, Kernel Trick tính trực tiếp khoảng cách giữa các điểm trong không gian mới một cách cực nhanh."
              : "The Kernel Trick projects data from a lower dimension (2D) into a higher dimension (3D+) where a hyperplane CAN separate them. Instead of actually computing the costly 3D coordinates, it computes the inner products directly."}
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4 mt-4">
            <li><strong>Linear Kernel:</strong> {isVi ? "Cho bài toán tuyến tính (như mô phỏng trên)." : "For linearly separable data."}</li>
            <li><strong>RBF (Radial Basis Function):</strong> {isVi ? "Kernel xịn nhất, map dữ liệu lên không gian vô hạn chiều. Tách mọi hình thù dị biệt." : "The most powerful kernel, mapping to infinite dimensions."}</li>
            <li><strong>Polynomial:</strong> {isVi ? "Đường biên cong uốn lượn theo bậc đa thức." : "Curved boundaries based on polynomial degrees."}</li>
          </ul>
        </Section>

        {/* 6. Pros/Cons */}
        <Section id="pros-cons" title={isVi ? "Ưu & Nhược điểm" : "Pros & Cons"} icon="⚖️">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                <span className="text-xl">✅</span> {isVi ? "Ưu điểm" : "Pros"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Cực kỳ hiệu quả trong không gian đa chiều (High dimensional spaces)." : "Highly effective in high dimensional spaces."}</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Tiết kiệm bộ nhớ vì chỉ dùng một lượng nhỏ dữ liệu (Support Vectors) để ra quyết định." : "Memory efficient as it uses a subset of training points (Support Vectors)."}</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Rất mạnh mẽ cho các bài toán phi tuyến tính nhờ Kernel Trick." : "Versatile and powerful for non-linear tasks via the Kernel Trick."}</span></li>
              </ul>
            </div>
            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span> {isVi ? "Nhược điểm" : "Cons"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">•</span> <span>{isVi ? "Huấn luyện cực kỳ chậm nếu tập dữ liệu khổng lồ (O(n³))." : "Very slow training time on massive datasets (O(n³))."}</span></li>
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">•</span> <span>{isVi ? "Khó tinh chỉnh tham số (C và Gamma của Kernel RBF)." : "Hard to tune hyperparameters (C and Gamma for RBF)."}</span></li>
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">•</span> <span>{isVi ? "Không cung cấp dự đoán xác suất trực tiếp (như Logistic Regression)." : "Does not natively provide probability estimates."}</span></li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 7. Python Code */}
        <Section id="python" title={isVi ? "Triển khai Python" : "Python Implementation"} icon="💻">
          <p className="mb-4">
            {isVi 
              ? "Triển khai SVM phân loại ung thư với Kernel RBF:"
              : "Implementing Breast Cancer classification with SVM using RBF Kernel:"}
          </p>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
            <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-xs text-slate-400 font-mono ml-2">svm_classifier.py</span>
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
          <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {isVi ? "Nội dung" : "Contents"}
          </h3>
          <nav className="flex flex-col space-y-2.5 text-sm font-medium">
            {[
              { id: 'hero', text: isVi ? "1. Tổng quan" : "1. Overview" },
              { id: 'intro', text: isVi ? "2. Giới thiệu" : "2. Introduction" },
              { id: 'math', text: isVi ? "3. Toán học (SVM)" : "3. Math Behind SVM" },
              { id: 'simulator', text: isVi ? "4. Mô phỏng Linear SVM" : "4. Linear SVM Simulator" },
              { id: 'kernel', text: isVi ? "5. Kernel Trick" : "5. Kernel Trick" },
              { id: 'pros-cons', text: isVi ? "6. Ưu / Nhược" : "6. Pros & Cons" },
              { id: 'python', text: isVi ? "7. Code Python" : "7. Python Code" },
            ].map(item => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-2"
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
