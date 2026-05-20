import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function PCAContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  const Section = ({ title, children, id, icon }: { title: string, children: React.ReactNode, id: string, icon?: string }) => (
    <section id={id} className="mb-16 scroll-mt-24">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-base shadow-md">
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
          : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500'
      }`}>
        {children}
      </div>
    );
  };

  const pythonCode = `import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_iris

# 1. Load dataset (Iris dataset has 4 features)
data = load_iris()
X = data.data
y = data.target

# 2. Standardize the data (CRITICAL step for PCA)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 3. Apply PCA (Reduce 4D down to 2D)
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# 4. Results
print("Original shape:", X.shape) # (150, 4)
print("Reduced shape:", X_pca.shape) # (150, 2)
print("Explained Variance Ratio:", pca.explained_variance_ratio_) 
# Output: [0.729, 0.228] -> Together they explain ~95.7% of the total variance!

# 5. Visualize the 2D projection
plt.figure(figsize=(8, 6))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis')
plt.xlabel(f'First Principal Component ({pca.explained_variance_ratio_[0]*100:.1f}%)')
plt.ylabel(f'Second Principal Component ({pca.explained_variance_ratio_[1]*100:.1f}%)')
plt.title('PCA of Iris Dataset')
plt.colorbar(scatter, ticks=[0, 1, 2], label='Classes')
plt.show()`;

  /* ───────────── PCA Interactive Simulator ───────────── */
  function PCASimulator() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [points, setPoints] = useState<{x:number, y:number}[]>([]);
    const [pcaResult, setPcaResult] = useState<{
      mean: {x:number, y:number},
      pc1: {dx:number, dy:number, var:number},
      pc2: {dx:number, dy:number, var:number}
    } | null>(null);
    const [showProjection, setShowProjection] = useState(false);
    
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
      
      // Draw projections
      if (pcaResult && showProjection) {
        const { mean, pc1 } = pcaResult;
        
        // Draw the full PC1 line passing through mean
        ctx.beginPath();
        // line: p = mean + t * pc1
        // find intersection with canvas boundaries roughly
        const t1 = 2000, t2 = -2000;
        ctx.moveTo(mean.x + t1*pc1.dx, mean.y + t1*pc1.dy);
        ctx.lineTo(mean.x + t2*pc1.dx, mean.y + t2*pc1.dy);
        ctx.strokeStyle = '#fbbf2433'; // very dim yellow
        ctx.lineWidth = 1;
        ctx.stroke();

        points.forEach(p => {
          // Project p onto pc1
          const vx = p.x - mean.x;
          const vy = p.y - mean.y;
          // dot product (since pc1 is normalized)
          const projLen = vx * pc1.dx + vy * pc1.dy;
          const projX = mean.x + projLen * pc1.dx;
          const projY = mean.y + projLen * pc1.dy;

          // Projection dashed line
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(projX, projY);
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Projected point
          ctx.beginPath();
          ctx.arc(projX, projY, 4, 0, Math.PI*2);
          ctx.fillStyle = '#10b981'; // emerald
          ctx.fill();
        });
      }

      // Draw points
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI*2);
        ctx.fillStyle = '#38bdf888'; // sky glow
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
        ctx.fillStyle = '#0ea5e9';
        ctx.fill();
      });

      // Draw PCA Vectors
      if (pcaResult) {
        const { mean, pc1, pc2 } = pcaResult;
        
        // Draw Mean
        ctx.beginPath();
        ctx.arc(mean.x, mean.y, 5, 0, Math.PI*2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        // Draw Arrows
        const drawArrow = (dx: number, dy: number, len: number, color: string, thick: number) => {
          const ex = mean.x + dx * len;
          const ey = mean.y + dy * len;
          ctx.beginPath();
          ctx.moveTo(mean.x, mean.y);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = color;
          ctx.lineWidth = thick;
          ctx.stroke();

          // arrowhead
          const angle = Math.atan2(dy, dx);
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - 10 * Math.cos(angle - Math.PI/6), ey - 10 * Math.sin(angle - Math.PI/6));
          ctx.lineTo(ex - 10 * Math.cos(angle + Math.PI/6), ey - 10 * Math.sin(angle + Math.PI/6));
          ctx.lineTo(ex, ey);
          ctx.fillStyle = color;
          ctx.fill();
        };

        // Scale vector length by sqrt of variance (standard deviation)
        // Multiplied by a constant for visual sizing
        const scale = 3;
        drawArrow(pc2.dx, pc2.dy, Math.sqrt(pc2.var)*scale, '#94a3b8', 2); // slate (PC2)
        drawArrow(pc1.dx, pc1.dy, Math.sqrt(pc1.var)*scale, '#fbbf24', 4); // amber (PC1)
      }
      
    }, [points, pcaResult, showProjection]);

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

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      setPoints([...points, { x, y }]);
      setPcaResult(null);
    };

    const runPCA = () => {
      if (points.length < 3) return;
      
      const n = points.length;
      let mx = 0, my = 0;
      points.forEach(p => { mx += p.x; my += p.y; });
      mx /= n; my /= n;

      let cxx = 0, cyy = 0, cxy = 0;
      points.forEach(p => {
        const dx = p.x - mx;
        const dy = p.y - my;
        cxx += dx * dx;
        cyy += dy * dy;
        cxy += dx * dy;
      });
      cxx /= n; cyy /= n; cxy /= n;

      const trace = cxx + cyy;
      const det = cxx * cyy - cxy * cxy;
      
      let lambda1 = (trace + Math.sqrt(Math.max(0, trace * trace - 4 * det))) / 2;
      let lambda2 = (trace - Math.sqrt(Math.max(0, trace * trace - 4 * det))) / 2;

      let dx1, dy1, dx2, dy2;
      
      if (Math.abs(cxy) > 1e-6) {
        dx1 = cxy;
        dy1 = lambda1 - cxx;
        dx2 = cxy;
        dy2 = lambda2 - cxx;
      } else {
        // Data is axis-aligned
        dx1 = cxx > cyy ? 1 : 0;
        dy1 = cxx > cyy ? 0 : 1;
        dx2 = dy1;
        dy2 = -dx1;
      }

      // Normalize
      const mag1 = Math.hypot(dx1, dy1) || 1;
      dx1 /= mag1; dy1 /= mag1;
      const mag2 = Math.hypot(dx2, dy2) || 1;
      dx2 /= mag2; dy2 /= mag2;

      setPcaResult({
        mean: {x: mx, y: my},
        pc1: {dx: dx1, dy: dy1, var: lambda1},
        pc2: {dx: dx2, dy: dy2, var: lambda2}
      });
      setShowProjection(true);
    };

    const generateSample = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const W = canvas.width || 600, H = canvas.height || 360;
      
      const newPoints = [];
      const cx = W/2, cy = H/2;
      // create a tilted ellipse cloud
      const angle = Math.PI / -6; // 30 degrees up
      for(let i=0; i<100; i++) {
        // normal distribution approx
        const u1 = Math.random(), u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        
        // stretch along x-axis
        const px = z0 * 100;
        const py = z1 * 20; 
        
        // rotate
        const rx = px * Math.cos(angle) - py * Math.sin(angle);
        const ry = px * Math.sin(angle) + py * Math.cos(angle);
        
        newPoints.push({ x: cx + rx, y: cy + ry });
      }
      setPoints(newPoints);
      setPcaResult(null);
    };

    let var1 = 0, var2 = 0;
    if (pcaResult) {
      const sum = pcaResult.pc1.var + pcaResult.pc2.var;
      var1 = (pcaResult.pc1.var / sum) * 100;
      var2 = (pcaResult.pc2.var / sum) * 100;
    }

    return (
      <div className="rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900 mt-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {isVi ? 'PCA Simulator' : 'PCA Simulator'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col gap-4">
            
            <div className="text-xs text-slate-400 leading-relaxed">
              {isVi ? 'Nhấp vào canvas để thêm điểm hoặc tạo dữ liệu mẫu.' : 'Click canvas to add points or generate sample data.'}
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={generateSample} className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors">
                {isVi ? 'Tạo dữ liệu ngẫu nhiên' : 'Generate Sample Data'}
              </button>
              
              <button 
                onClick={runPCA} 
                disabled={points.length < 3}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl border border-emerald-500 transition-colors shadow-lg shadow-emerald-900/50"
              >
                {isVi ? '▶ Chạy PCA' : '▶ Run PCA'}
              </button>
              
              <button onClick={() => {setPoints([]); setPcaResult(null);}} className="w-full py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs font-semibold rounded-xl border border-red-900/50 transition-colors">
                {isVi ? 'Xóa hết' : 'Clear all'}
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                <input type="checkbox" checked={showProjection} onChange={e => setShowProjection(e.target.checked)} disabled={!pcaResult}
                  className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 bg-slate-800" />
                {isVi ? 'Hiện hình chiếu (Projection)' : 'Show Projection'}
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-auto">
              <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">PC1 Explained</span>
                <span className="text-sm font-bold block mt-0.5 text-white">{pcaResult ? var1.toFixed(1) + '%' : '--'}</span>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PC2 Explained</span>
                <span className="text-sm font-bold block mt-0.5 text-white">{pcaResult ? var2.toFixed(1) + '%' : '--'}</span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-2 relative">
            <canvas ref={canvasRef} onClick={handleCanvasClick}
              className="w-full cursor-crosshair block"
              style={{ minHeight: 360 }} />
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-[10px] text-slate-400 px-3 py-1.5 rounded-lg border border-slate-700">
               {isVi ? 'PC1: Trục vàng | PC2: Trục xám' : 'PC1: Amber axis | PC2: Slate axis'}
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
          <div className="p-10 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white shadow-2xl relative overflow-hidden border border-emerald-700/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3 bg-emerald-800/60 px-3 py-1 rounded-full border border-emerald-700">
                {isVi ? 'Học không giám sát' : 'Unsupervised Learning'}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">PCA</h1>
              <p className="text-xl text-emerald-100 mb-8 max-w-2xl leading-relaxed">
                {isVi 
                  ? "Principal Component Analysis - Kỹ thuật Giảm Chiều Dữ Liệu đỉnh cao giúp cô đọng thông tin khổng lồ vào những chiều không gian quan trọng nhất."
                  : "Principal Component Analysis - The ultimate dimensionality reduction technique that condenses massive data into the most important dimensions."}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-5">
                {['Dimensionality Reduction', 'Eigenvalues', 'Feature Extraction', 'Data Compression'].map(tag => (
                  <span key={tag} className="text-xs font-semibold text-emerald-200 bg-emerald-700/50 px-3 py-1 rounded-full border border-emerald-600/50">
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
              ? "PCA (Phân tích Thành phần Chính) là một thuật toán học không giám sát được sử dụng để giảm số lượng chiều (đặc trưng) của dữ liệu, trong khi vẫn cố gắng giữ lại lượng thông tin (phương sai - variance) lớn nhất có thể."
              : "PCA is an unsupervised learning algorithm used to reduce the dimensionality of large datasets, by transforming a large set of variables into a smaller one that still contains most of the information (variance)."}
          </p>
          <p>
            {isVi
              ? "Trong thực tế, dữ liệu thường có hàng ngàn cột, nhiều cột chứa thông tin dư thừa hoặc nhiễu. PCA giúp tìm ra những góc nhìn mới (các trục toạ độ mới) sao cho dữ liệu trải rộng nhất, giúp ta nén dữ liệu và vẽ biểu đồ 2D/3D trực quan."
              : "In practice, datasets often have thousands of columns, many of which contain redundant information or noise. PCA finds new perspectives (axes) that maximize the spread of data, helping to compress it and visualize it in 2D/3D."}
          </p>
        </Section>

        {/* 3. The Math Behind PCA */}
        <Section id="math" title={isVi ? "Toán học đằng sau PCA" : "The Math Behind PCA"} icon="➗">
          <p>
            {isVi
              ? "PCA thực chất là một phép biến đổi tuyến tính sử dụng Đại số tuyến tính (Linear Algebra). Quy trình cơ bản gồm 4 bước:"
              : "PCA is fundamentally a linear transformation using Linear Algebra. The core process involves 4 steps:"}
          </p>
          
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-6 shadow-inner my-6">
            <div>
              <div className="text-sm text-slate-400 mb-2 font-semibold">1. {isVi ? "Chuẩn hoá dữ liệu (Standardization)" : "Standardization"}</div>
              <BlockMath math="Z = \frac{X - \mu}{\sigma}" />
            </div>
            <div className="border-t border-slate-700/50 pt-4">
              <div className="text-sm text-slate-400 mb-2 font-semibold">2. {isVi ? "Tính Ma trận Hiệp phương sai (Covariance Matrix)" : "Covariance Matrix"}</div>
              <BlockMath math="\Sigma = \frac{1}{n-1} Z^T Z" />
            </div>
            <div className="border-t border-slate-700/50 pt-4">
              <div className="text-sm text-slate-400 mb-2 font-semibold">3. {isVi ? "Tìm Trị riêng & Vector riêng (Eigendecomposition)" : "Eigendecomposition"}</div>
              <BlockMath math="\Sigma v = \lambda v" />
              <p className="text-xs text-slate-400 mt-2 text-center">
                <InlineMath math="\lambda" /> {isVi ? "là Trị riêng (Lượng thông tin), " : "is Eigenvalue (Variance amount), "} 
                <InlineMath math="v" /> {isVi ? "là Vector riêng (Hướng)." : "is Eigenvector (Direction)."}
              </p>
            </div>
            <div className="border-t border-slate-700/50 pt-4">
              <div className="text-sm text-slate-400 mb-2 font-semibold">4. {isVi ? "Chiếu dữ liệu (Projection)" : "Projection"}</div>
              <BlockMath math="X_{new} = Z \cdot W" />
              <p className="text-xs text-slate-400 mt-2 text-center">
                {isVi ? "W là ma trận gồm k Vector riêng lớn nhất." : "W is the matrix of the top k Eigenvectors."}
              </p>
            </div>
          </div>
          
          <InfoBox>
            {isVi 
              ? "Tại sao phải Chuẩn hoá (Standardization)? PCA tìm kiếm hướng có phương sai lớn nhất. Nếu đặc trưng A có đơn vị là KM (số nhỏ) và B có đơn vị là CM (số lớn), PCA sẽ bị đánh lừa rằng B quan trọng hơn A. Do đó, việc căn chỉnh tất cả về cùng scale là BẮT BUỘC."
              : "Why Standardize? PCA seeks directions with maximum variance. If feature A is in KM (small numbers) and B is in CM (large numbers), PCA will incorrectly think B is more important. Standardization is MANDATORY."}
          </InfoBox>
        </Section>

        {/* 4. Interactive Simulator */}
        <Section id="simulator" title={isVi ? "Mô phỏng tương tác 2D" : "2D Interactive Simulator"} icon="🎮">
          <p className="mb-4 text-sm">
            {isVi
              ? 'Tạo một đám mây điểm. Thuật toán PCA sẽ tìm ra Principal Component 1 (PC1 - Trục màu vàng) là hướng mà dữ liệu phân tán nhiều nhất. PC2 vuông góc với PC1. Bật "Hiện hình chiếu" để xem cách dữ liệu 2D được nén xuống 1D (đường thẳng PC1).'
              : 'Generate a point cloud. PCA will find Principal Component 1 (PC1 - Amber axis), the direction with maximum variance. PC2 is orthogonal to PC1. Toggle "Show Projection" to see how 2D data compresses to 1D.'}
          </p>
          <PCASimulator />
        </Section>

        {/* 5. Pros/Cons */}
        <Section id="pros-cons" title={isVi ? "Ưu & Nhược điểm" : "Pros & Cons"} icon="⚖️">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                <span className="text-xl">✅</span> {isVi ? "Ưu điểm" : "Pros"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Giảm dung lượng dữ liệu, tăng tốc độ huấn luyện cho các mô hình khác." : "Reduces data size, speeding up training for downstream models."}</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Loại bỏ các đặc trưng bị tương quan (Multicollinearity)." : "Removes correlated features (Multicollinearity)."}</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Tuyệt vời để trực quan hóa dữ liệu nhiều chiều trên đồ thị 2D hoặc 3D." : "Excellent for visualizing highly dimensional data in 2D/3D."}</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> <span>{isVi ? "Lọc nhiễu hiệu quả bằng cách bỏ đi các PC cuối cùng." : "Filters noise by ignoring the last Principal Components."}</span></li>
              </ul>
            </div>
            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span> {isVi ? "Nhược điểm" : "Cons"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">•</span> <span>{isVi ? "Làm mất tính có thể diễn giải (Interpretability). Các trục PC mới không còn là đặc trưng nguyên gốc." : "Loss of interpretability. The new PC axes don't represent original features directly."}</span></li>
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">•</span> <span>{isVi ? "PCA chỉ nắm bắt được các mối quan hệ tuyến tính." : "PCA only captures linear relationships."}</span></li>
                <li className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">•</span> <span>{isVi ? "Bắt buộc phải chuẩn hóa dữ liệu." : "Strictly requires data standardization."}</span></li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 6. Python Code */}
        <Section id="python" title={isVi ? "Triển khai Python" : "Python Implementation"} icon="💻">
          <p className="mb-4">
            {isVi 
              ? "Sử dụng PCA để giảm số chiều của tập dữ liệu Iris từ 4D xuống 2D để vẽ biểu đồ trực quan:"
              : "Using PCA to reduce the Iris dataset from 4D down to 2D for visualization:"}
          </p>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
            <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-xs text-slate-400 font-mono ml-2">pca_iris.py</span>
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
          <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {isVi ? "Nội dung" : "Contents"}
          </h3>
          <nav className="flex flex-col space-y-2.5 text-sm font-medium">
            {[
              { id: 'hero', text: isVi ? "1. Tổng quan" : "1. Overview" },
              { id: 'intro', text: isVi ? "2. Giới thiệu" : "2. Introduction" },
              { id: 'math', text: isVi ? "3. Toán học (PCA)" : "3. Math Behind PCA" },
              { id: 'simulator', text: isVi ? "4. Mô phỏng 2D" : "4. 2D Simulator" },
              { id: 'pros-cons', text: isVi ? "5. Ưu / Nhược" : "5. Pros & Cons" },
              { id: 'python', text: isVi ? "6. Code Python" : "6. Python Code" },
            ].map(item => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2"
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
