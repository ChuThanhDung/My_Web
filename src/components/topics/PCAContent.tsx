import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockMath } from 'react-katex';
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

  const InfoBox = ({ children, variant = 'info' }: { children: React.ReactNode, variant?: 'info' | 'warning' | 'emerald' }) => {
    const isWarn = variant === 'warning';
    const isEmerald = variant === 'emerald';
    return (
      <div className={`p-5 my-6 border-l-4 rounded-r-xl shadow-sm ${
        isWarn 
          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-900 dark:text-amber-250' 
          : isEmerald
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-950 dark:text-emerald-200'
            : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-950 dark:text-indigo-200'
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
      pc2: {dx:number, dy:number, var:number},
      sig1: number,
      sig2: number
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
        
        ctx.beginPath();
        const t1 = 2000, t2 = -2000;
        ctx.moveTo(mean.x + t1*pc1.dx, mean.y + t1*pc1.dy);
        ctx.lineTo(mean.x + t2*pc1.dx, mean.y + t2*pc1.dy);
        ctx.strokeStyle = '#fbbf2433';
        ctx.lineWidth = 1;
        ctx.stroke();

        points.forEach(p => {
          const vx = p.x - mean.x;
          const vy = p.y - mean.y;
          const projLen = vx * pc1.dx + vy * pc1.dy;
          const projX = mean.x + projLen * pc1.dx;
          const projY = mean.y + projLen * pc1.dy;

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(projX, projY);
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.beginPath();
          ctx.arc(projX, projY, 4, 0, Math.PI*2);
          ctx.fillStyle = '#10b981';
          ctx.fill();
        });
      }

      // Draw points
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI*2);
        ctx.fillStyle = '#38bdf888';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
        ctx.fillStyle = '#0ea5e9';
        ctx.fill();
      });

      // Draw PCA Vectors
      if (pcaResult) {
        const { mean, pc1, pc2 } = pcaResult;
        
        ctx.beginPath();
        ctx.arc(mean.x, mean.y, 5, 0, Math.PI*2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();

        const drawArrow = (dx: number, dy: number, len: number, color: string, thick: number) => {
          const ex = mean.x + dx * len;
          const ey = mean.y + dy * len;
          ctx.beginPath();
          ctx.moveTo(mean.x, mean.y);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = color;
          ctx.lineWidth = thick;
          ctx.stroke();

          const angle = Math.atan2(dy, dx);
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - 10 * Math.cos(angle - Math.PI/6), ey - 10 * Math.sin(angle - Math.PI/6));
          ctx.lineTo(ex - 10 * Math.cos(angle + Math.PI/6), ey - 10 * Math.sin(angle + Math.PI/6));
          ctx.fillStyle = color;
          ctx.fill();
        };

        const scale = 3;
        drawArrow(pc2.dx, pc2.dy, Math.sqrt(pc2.var)*scale, '#94a3b8', 2); // Slate (PC2)
        drawArrow(pc1.dx, pc1.dy, Math.sqrt(pc1.var)*scale, '#fbbf24', 4); // Amber (PC1)
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
        dx1 = cxx > cyy ? 1 : 0;
        dy1 = cxx > cyy ? 0 : 1;
        dx2 = dy1;
        dy2 = -dx1;
      }

      const mag1 = Math.hypot(dx1, dy1) || 1;
      dx1 /= mag1; dy1 /= mag1;
      const mag2 = Math.hypot(dx2, dy2) || 1;
      dx2 /= mag2; dy2 /= mag2;

      setPcaResult({
        mean: {x: mx, y: my},
        pc1: {dx: dx1, dy: dy1, var: lambda1},
        pc2: {dx: dx2, dy: dy2, var: lambda2},
        sig1: Math.sqrt(n * lambda1),
        sig2: Math.sqrt(n * lambda2)
      });
      setShowProjection(true);
    };

    const generateSample = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const W = canvas.width || 600, H = canvas.height || 360;
      
      const newPoints = [];
      const cx = W/2, cy = H/2;
      const angle = Math.PI / -6;
      for(let i=0; i<80; i++) {
        const u1 = Math.random() || 0.001, u2 = Math.random() || 0.001;
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        
        const px = z0 * 100;
        const py = z1 * 20; 
        
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
            PCA Simulator
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-800 p-6 flex flex-col gap-4">
            
            <div className="text-xs text-slate-400 leading-relaxed">
              {isVi ? 'Nhấp chuột lên canvas để thêm điểm dữ liệu hoặc dùng nút ngẫu nhiên.' : 'Click on canvas to add points or use generate sample button.'}
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

            <div className="mt-2 pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                <input type="checkbox" checked={showProjection} onChange={e => setShowProjection(e.target.checked)} disabled={!pcaResult}
                  className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 bg-slate-800" />
                {isVi ? 'Hiện hình chiếu (1D Projection)' : 'Show 1D Projection'}
              </label>
            </div>

            {pcaResult && (
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {isVi ? 'Biểu đồ Trị riêng (Scree Plot)' : 'Scree Plot (Eigenvalues)'}
                </span>
                <svg viewBox="0 0 200 80" className="w-full h-auto bg-slate-950/80 rounded-xl p-2 border border-slate-900">
                  <rect x="25" y={60 - (pcaResult.pc1.var / (pcaResult.pc1.var + pcaResult.pc2.var)) * 50} width="35" height={(pcaResult.pc1.var / (pcaResult.pc1.var + pcaResult.pc2.var)) * 50} fill="#fbbf24" rx="2" />
                  <rect x="75" y={60 - (pcaResult.pc2.var / (pcaResult.pc1.var + pcaResult.pc2.var)) * 50} width="35" height={(pcaResult.pc2.var / (pcaResult.pc1.var + pcaResult.pc2.var)) * 50} fill="#94a3b8" rx="2" />
                  <line x1="15" y1="60" x2="190" y2="60" stroke="#475569" strokeWidth="1" />
                  <text x="42.5" y="72" fill="#fbbf24" fontSize="8" textAnchor="middle" fontWeight="bold">PC1</text>
                  <text x="92.5" y="72" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">PC2</text>
                  <text x="42.5" y={53 - (pcaResult.pc1.var / (pcaResult.pc1.var + pcaResult.pc2.var)) * 50} fill="#fff" fontSize="8" textAnchor="middle">
                    {var1.toFixed(0)}%
                  </text>
                  <text x="92.5" y={53 - (pcaResult.pc2.var / (pcaResult.pc1.var + pcaResult.pc2.var)) * 50} fill="#fff" fontSize="8" textAnchor="middle">
                    {var2.toFixed(0)}%
                  </text>
                </svg>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-auto">
              <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">PC1 (σ₁)</span>
                <span className="text-sm font-bold block mt-0.5 text-white">{pcaResult ? pcaResult.sig1.toFixed(2) : '--'}</span>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PC2 (σ₂)</span>
                <span className="text-sm font-bold block mt-0.5 text-white">{pcaResult ? pcaResult.sig2.toFixed(2) : '--'}</span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-2 relative">
            <canvas ref={canvasRef} onClick={handleCanvasClick}
              className="w-full cursor-crosshair block"
              style={{ minHeight: 360 }} />
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-[10px] text-slate-400 px-3 py-1.5 rounded-lg border border-slate-700">
               {isVi ? 'PC1: Trục vàng | PC2: Trục xám' : 'PC1: Yellow axis | PC2: Slate axis'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ───────────── Power Method Interactive Simulator ───────────── */
  function PowerMethodSimulator() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [q, setQ] = useState<[number, number]>([Math.cos(0.8), Math.sin(0.8)]);
    const [lam, setLam] = useState<number | null>(null);
    const [angErr, setAngErr] = useState<number | null>(null);
    const historyRef = useRef<[number, number][]>([[Math.cos(0.8), Math.sin(0.8)]]);
    const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const A = [[3.5, 1.2], [1.2, 1.5]]; // Eigenvalues: ~4.2, ~0.8

    // True eigenvector calculation for A
    const tr = A[0][0] + A[1][1];
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    const disc = Math.sqrt(Math.max(0, (tr / 2) ** 2 - det));
    const lmax = tr / 2 + disc;
    let ex = lmax - A[1][1];
    let ey = A[1][0];
    const en = Math.hypot(ex, ey) || 1;
    const trueU1 = [ex / en, ey / en];

    const draw = useCallback((currentQ: [number, number], currentStep: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;
      const R = Math.min(cx, cy) - 40;

      // Draw grid/background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      for (let x = 20; x < W; x += 30) for (let y = 20; y < H; y += 30) ctx.fillRect(x, y, 1.5, 1.5);

      // Draw Axes
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R - 20, cy); ctx.lineTo(cx + R + 20, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - R - 20); ctx.lineTo(cx, cy + R + 20); ctx.stroke();

      // Draw Unit Circle
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

      // Draw True Eigenvector Direction u1
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'; // emerald-500/40
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cx - trueU1[0] * R, cy + trueU1[1] * R);
      ctx.lineTo(cx + trueU1[0] * R, cy - trueU1[1] * R);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`u1 thực (λmax=${lmax.toFixed(2)})`, cx + trueU1[0] * R + 6, cy - trueU1[1] * R + 4);

      // Draw History Trail
      const hist = historyRef.current;
      if (hist.length > 1) {
        for (let i = 1; i < hist.length; i++) {
          const alpha = (i / hist.length) * 0.4 + 0.1;
          const q0 = hist[i - 1], q1 = hist[i];
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`; // indigo
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx + q0[0] * R, cy - q0[1] * R);
          ctx.lineTo(cx + q1[0] * R, cy - q1[1] * R);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx + q1[0] * R, cy - q1[1] * R, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99, 102, 241, ${alpha + 0.2})`;
          ctx.fill();
        }
      }

      // Draw Current Vector q
      const qx = cx + currentQ[0] * R;
      const qy = cy - currentQ[1] * R;
      ctx.strokeStyle = '#6366f1'; // indigo-500
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(qx, qy); ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(-currentQ[1], currentQ[0]);
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.moveTo(qx, qy);
      ctx.lineTo(qx - 12 * Math.cos(angle - Math.PI/6), qy - 12 * Math.sin(angle - Math.PI/6));
      ctx.lineTo(qx - 12 * Math.cos(angle + Math.PI/6), qy - 12 * Math.sin(angle + Math.PI/6));
      ctx.fill();

      ctx.beginPath(); ctx.arc(qx, qy, 5, 0, Math.PI * 2); ctx.fill();

      // Draw Label
      ctx.fillStyle = '#fff';
      ctx.font = '11px monospace';
      ctx.fillText(`q(${currentStep})`, qx + 8, qy - 8);
    }, [trueU1, lmax]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw(q, step);
    }, [draw, q, step]);

    const stepPower = () => {
      const zx = A[0][0] * q[0] + A[0][1] * q[1];
      const zy = A[1][0] * q[0] + A[1][1] * q[1];
      const nm = Math.hypot(zx, zy) || 1;
      const nextQ: [number, number] = [zx / nm, zy / nm];

      const currentLam = nextQ[0] * (A[0][0] * nextQ[0] + A[0][1] * nextQ[1]) +
                         nextQ[1] * (A[1][0] * nextQ[0] + A[1][1] * nextQ[1]);
      const error = Math.acos(Math.min(1, Math.abs(nextQ[0] * trueU1[0] + nextQ[1] * trueU1[1]))) * 180 / Math.PI;

      historyRef.current.push(nextQ);
      setQ(nextQ);
      setStep(prev => prev + 1);
      setLam(currentLam);
      setAngErr(error);
    };

    const togglePlay = () => {
      if (isPlaying) {
        if (playTimerRef.current) clearInterval(playTimerRef.current);
        playTimerRef.current = null;
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        stepPower();
        playTimerRef.current = setInterval(() => {
          setStep(prevStep => {
            if (prevStep >= 20) {
              if (playTimerRef.current) clearInterval(playTimerRef.current);
              playTimerRef.current = null;
              setIsPlaying(false);
              return prevStep;
            }
            setQ(prevQ => {
              const zx = A[0][0] * prevQ[0] + A[0][1] * prevQ[1];
              const zy = A[1][0] * prevQ[0] + A[1][1] * prevQ[1];
              const nm = Math.hypot(zx, zy) || 1;
              const nextQ: [number, number] = [zx / nm, zy / nm];
              historyRef.current.push(nextQ);
              
              const currentLam = nextQ[0] * (A[0][0] * nextQ[0] + A[0][1] * nextQ[1]) +
                                 nextQ[1] * (A[1][0] * nextQ[0] + A[1][1] * nextQ[1]);
              const error = Math.acos(Math.min(1, Math.abs(nextQ[0] * trueU1[0] + nextQ[1] * trueU1[1]))) * 180 / Math.PI;
              setLam(currentLam);
              setAngErr(error);
              return nextQ;
            });
            return prevStep + 1;
          });
        }, 400);
      }
    };

    const reset = () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      playTimerRef.current = null;
      setIsPlaying(false);
      const initQ: [number, number] = [Math.cos(0.8), Math.sin(0.8)];
      historyRef.current = [initQ];
      setQ(initQ);
      setStep(0);
      setLam(null);
      setAngErr(null);
    };

    return (
      <div className="rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900 mt-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            {isVi ? 'Mô phỏng Power Method' : 'Power Method Simulator'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-800 p-6 flex flex-col gap-4">
            <div className="text-xs text-slate-400 leading-relaxed">
              {isVi
                ? 'Nhân vectơ q liên tục với ma trận A. Vectơ q sẽ tự động quay dần về hướng của vectơ riêng u1.'
                : 'Repeatedly multiply vector q with matrix A. Vector q will rotate towards the dominant eigenvector u1.'}
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={stepPower} disabled={isPlaying || step >= 20} className="w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors">
                {isVi ? '▶ Bước tiếp' : '▶ Step'}
              </button>
              <button onClick={togglePlay} className={`w-full py-2.5 text-xs font-bold rounded-xl border transition-colors ${isPlaying ? 'bg-amber-900/50 hover:bg-amber-800/70 text-amber-300 border-amber-700' : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500'}`}>
                {isPlaying ? `⏸ ${isVi ? 'Tạm dừng' : 'Pause'}` : `⏩ ${isVi ? 'Chạy tự động' : 'Auto'}`}
              </button>
              <button onClick={reset} className="w-full py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 text-xs font-semibold rounded-xl border border-red-900/40 transition-colors">
                ↺ Reset
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-auto">
              <div className="bg-slate-800/60 rounded-xl p-2 border border-slate-700/50 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{isVi ? 'Bước' : 'Step'}</span>
                <span className="text-xs font-bold block mt-0.5 text-white">{step}</span>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-2 border border-slate-700/50 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{isVi ? 'Xấp xỉ λ₁' : 'Approx λ₁'}</span>
                <span className="text-xs font-bold block mt-0.5 text-white">{lam !== null ? lam.toFixed(3) : '—'}</span>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-2 border border-slate-700/50 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{isVi ? 'Lệch góc' : 'Ang Error'}</span>
                <span className="text-xs font-bold block mt-0.5 text-white">{angErr !== null ? angErr.toFixed(1) + '°' : '—'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 relative">
            <canvas ref={canvasRef} className="w-full block" style={{ minHeight: 300 }} />
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-[10px] text-slate-400 px-3 py-1.5 rounded-lg border border-slate-700">
               {isVi ? 'Xanh: u₁ thực | Tím: q vector' : 'Green: True u₁ | Indigo: q vector'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ───────────── LDA vs PCA Interactive Simulator ───────────── */
  function LdaPcaSimulator() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mode, setMode] = useState<'both' | 'pca' | 'lda' | 'proj'>('both');
    
    // Class 1 (emerald-like), Class 2 (rose-like)
    const generateClassPoints = (n: number, mx: number, my: number, sx: number, sy: number, seed: number) => {
      const pts = [];
      let s = seed;
      for (let i = 0; i < n; i++) {
        s = s + i * 7;
        let randVal = Math.sin(s * 12.9898 + 78.233) * 43758.5453;
        randVal = randVal - Math.floor(randVal);
        let randVal2 = Math.sin((s + 1) * 12.9898 + 78.233) * 43758.5453;
        randVal2 = randVal2 - Math.floor(randVal2);
        const u = -2 * Math.log(randVal + 0.0001);
        const v = 2 * Math.PI * (randVal2);
        pts.push({
          x: mx + Math.sqrt(u) * Math.cos(v) * sx,
          y: my + Math.sqrt(u) * Math.sin(v) * sy
        });
      }
      return pts;
    };

    const c1 = generateClassPoints(40, -2.5, 1, 0.6, 0.35, 1);
    const c2 = generateClassPoints(40, 2.5, -1, 0.6, 0.35, 100);

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
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      for (let x = 20; x < W; x += 30) for (let y = 20; y < H; y += 30) ctx.fillRect(x, y, 1.5, 1.5);

      const all = [...c1, ...c2];
      let mn_x = Infinity, mx_x = -Infinity, mn_y = Infinity, mx_y = -Infinity;
      all.forEach(p => {
        mn_x = Math.min(mn_x, p.x);
        mx_x = Math.max(mx_x, p.x);
        mn_y = Math.min(mn_y, p.y);
        mx_y = Math.max(mx_y, p.y);
      });

      const pad = 50;
      const sc = Math.min((W - 2 * pad) / (mx_x - mn_x + 0.01), (H - 2 * pad) / (mx_y - mn_y + 0.01));
      const ox = W / 2 - ((mx_x + mn_x) / 2) * sc;
      const oy = H / 2 + ((mx_y + mn_y) / 2) * sc;

      const tX = (v: number) => ox + v * sc;
      const tY = (v: number) => oy - v * sc;

      // Draw Axes
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, tY(0)); ctx.lineTo(W, tY(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tX(0), 0); ctx.lineTo(tX(0), H); ctx.stroke();

      // Draw Points
      c1.forEach(p => {
        ctx.beginPath(); ctx.arc(tX(p.x), tY(p.y), 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.7)'; // emerald
        ctx.fill();
      });
      c2.forEach(p => {
        ctx.beginPath(); ctx.arc(tX(p.x), tY(p.y), 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.7)'; // rose
        ctx.fill();
      });

      const m1 = {
        x: c1.reduce((s, p) => s + p.x, 0) / c1.length,
        y: c1.reduce((s, p) => s + p.y, 0) / c1.length
      };
      const m2 = {
        x: c2.reduce((s, p) => s + p.x, 0) / c2.length,
        y: c2.reduce((s, p) => s + p.y, 0) / c2.length
      };

      const N = all.length;
      const gmx = all.reduce((s, p) => s + p.x, 0) / N;
      const gmy = all.reduce((s, p) => s + p.y, 0) / N;

      // Compute SW
      let sw00 = 0, sw01 = 0, sw11 = 0;
      [
        ...c1.map(p => ({ x: p.x - m1.x, y: p.y - m1.y })),
        ...c2.map(p => ({ x: p.x - m2.x, y: p.y - m2.y }))
      ].forEach(p => {
        sw00 += p.x * p.x;
        sw01 += p.x * p.y;
        sw11 += p.y * p.y;
      });

      const det = sw00 * sw11 - sw01 ** 2 + 1e-9;
      const iw00 = sw11 / det;
      const iw01 = -sw01 / det;
      const iw11 = sw00 / det;

      const dx = m1.x - m2.x;
      const dy = m1.y - m2.y;
      let ldaX = iw00 * dx + iw01 * dy;
      let ldaY = iw01 * dx + iw11 * dy;
      const ldaNorm = Math.hypot(ldaX, ldaY) || 1;
      ldaX /= ldaNorm;
      ldaY /= ldaNorm;

      // Compute PCA
      let psxx = 0, psxy = 0, psyy = 0;
      all.forEach(p => {
        psxx += (p.x - gmx) ** 2;
        psxy += (p.x - gmx) * (p.y - gmy);
        psyy += (p.y - gmy) ** 2;
      });
      psxx /= N; psxy /= N; psyy /= N;
      const ptr = psxx + psyy;
      const pdet = psxx * psyy - psxy ** 2;
      const pdisc = Math.sqrt(Math.max(0, (ptr / 2) ** 2 - pdet));
      const pl1 = ptr / 2 + pdisc;
      let pcaX = pl1 - psyy;
      let pcaY = psxy;
      const pcaNorm = Math.hypot(pcaX, pcaY) || 1;
      pcaX /= pcaNorm;
      pcaY /= pcaNorm;

      const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string) => {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const al = 10, aa = 0.4;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x2 - al * Math.cos(angle - aa), y2 - al * Math.sin(angle - aa));
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2 - al * Math.cos(angle + aa), y2 - al * Math.sin(angle + aa));
        ctx.fill();
      };

      const drawDir = (ex: number, ey: number, color: string, label: string) => {
        const len = 4.5;
        const x1 = tX(gmx - ex * len);
        const y1 = tY(gmy - ey * len);
        const x2 = tX(gmx + ex * len);
        const y2 = tY(gmy + ey * len);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        drawArrow(tX(gmx), tY(gmy), x2, y2, color);

        ctx.fillStyle = color;
        ctx.font = 'bold 10px monospace';
        ctx.fillText(label, x2 + 6, y2 + (ey > 0 ? -6 : 12));
      };

      if (mode === 'pca' || mode === 'both') {
        drawDir(pcaX, pcaY, '#6366f1', '← PCA');
      }
      if (mode === 'lda' || mode === 'both') {
        drawDir(ldaX, ldaY, '#10b981', '← LDA');
      }

      if (mode === 'proj') {
        [
          ...c1.map(p => ({ ...p, col: 'rgba(16, 185, 129, 0.4)' })),
          ...c2.map(p => ({ ...p, col: 'rgba(244, 63, 94, 0.4)' }))
        ].forEach(p => {
          const t = (p.x - gmx) * ldaX + (p.y - gmy) * ldaY;
          const px2 = gmx + t * ldaX;
          const py2 = gmy + t * ldaY;

          ctx.strokeStyle = p.col;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([2, 3]);
          ctx.beginPath(); ctx.moveTo(tX(p.x), tY(p.y)); ctx.lineTo(tX(px2), tY(py2)); ctx.stroke();
          ctx.setLineDash([]);

          ctx.beginPath(); ctx.arc(tX(px2), tY(py2), 3, 0, Math.PI * 2);
          ctx.fillStyle = p.col;
          ctx.fill();
        });
        drawDir(ldaX, ldaY, '#10b981', '← LDA (axis)');
      }

      [m1, m2].forEach((m, idx) => {
        ctx.beginPath(); ctx.arc(tX(m.x), tY(m.y), 6, 0, Math.PI * 2);
        ctx.fillStyle = idx ? '#f43f5e' : '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

    }, [mode, c1, c2]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw();
    }, [draw, mode]);

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
            LDA vs PCA Comparison
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-800 p-6 flex flex-col gap-3">
            <div className="text-xs text-slate-400 leading-relaxed mb-2">
              {isVi
                ? 'PCA tìm hướng chiếu có độ phân tán lớn nhất. LDA tìm hướng chiếu tối đa hóa sự phân biệt giữa các lớp.'
                : 'PCA finds the projection axis of maximum variance. LDA finds the projection axis that maximizes class separability.'}
            </div>

            <button onClick={() => setMode('pca')} className={`w-full py-2 text-xs font-bold rounded-xl border transition-all ${mode === 'pca' ? 'bg-indigo-650 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-350'}`}>
              {isVi ? 'Hướng PCA' : 'PCA Direction'}
            </button>
            <button onClick={() => setMode('lda')} className={`w-full py-2 text-xs font-bold rounded-xl border transition-all ${mode === 'lda' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-350'}`}>
              {isVi ? 'Hướng LDA' : 'LDA Direction'}
            </button>
            <button onClick={() => setMode('both')} className={`w-full py-2 text-xs font-bold rounded-xl border transition-all ${mode === 'both' ? 'bg-purple-650 border-purple-550 text-white' : 'bg-slate-800 border-slate-700 text-slate-350'}`}>
              {isVi ? 'Cả hai' : 'Show Both'}
            </button>
            <button onClick={() => setMode('proj')} className={`w-full py-2 text-xs font-bold rounded-xl border transition-all ${mode === 'proj' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-350'}`}>
              {isVi ? 'Chiếu xuống 1D' : 'Project to 1D'}
            </button>
          </div>

          <div className="lg:col-span-2 relative">
            <canvas ref={canvasRef} className="w-full block" style={{ minHeight: 300 }} />
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-[10px] text-slate-400 px-3 py-1.5 rounded-lg border border-slate-700">
               {isVi ? '● Lớp 1 (màu xanh) | ● Lớp 2 (màu hồng)' : '● Class 1 (Green) | ● Class 2 (Rose)'}
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
                {isVi ? 'Học không giám sát & Có giám sát' : 'Unsupervised & Supervised learning'}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                {isVi ? 'Giảm Chiều Dữ Liệu' : 'Dimensionality Reduction'}
              </h1>
              <p className="text-xl text-emerald-100 mb-8 max-w-2xl leading-relaxed">
                {isVi 
                  ? "Tìm hiểu sâu sắc các phương pháp giảm chiều dữ liệu: từ lý thuyết SVD, PCA thuần túy, chọn số chiều k tối ưu cho đến LDA phân loại có giám sát."
                  : "Deep dive into feature reduction techniques: from pure PCA and SVD theory to supervised Linear Discriminant Analysis."}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-5">
                {['PCA', 'SVD', 'LDA', 'Power Method', 'Scree Plot'].map(tag => (
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
              ? "Giảm chiều dữ liệu là một bước cực kỳ quan trọng trong Tiền xử lý dữ liệu của Học máy. Dữ liệu thực tế thường có số lượng đặc trưng d cực kỳ lớn (Curse of Dimensionality - Lời nguyền số chiều) dẫn đến việc lưu trữ và tính toán tốn kém, tốc độ chậm."
              : "Dimensionality reduction is a vital preprocessing step in Machine Learning. Real-world datasets often suffer from the Curse of Dimensionality (massive number of features d), causing computational inefficiency and high storage costs."}
          </p>
          <p>
            {isVi
              ? "Giảm chiều giúp ánh xạ dữ liệu ban đầu vào không gian mới có số chiều k nhỏ hơn nhiều (k ≪ d) mà vẫn giữ lại lượng thông tin quan trọng nhất, hỗ trợ nén dữ liệu, giảm nhiễu và trực quan hóa trực giác trên đồ thị 2D/3D."
              : "By mapping data into a lower k-dimensional space (k ≪ d), we preserve crucial information while removing noise, enabling efficient data compression and human-friendly 2D/3D visualization."}
          </p>
        </Section>

        {/* 3. The Math Behind PCA & SVD */}
        <Section id="math" title={isVi ? "Cơ sở toán học: PCA & SVD" : "Mathematical Foundation: PCA & SVD"} icon="➗">
          <p>
            {isVi
              ? "PCA tìm một hệ trực chuẩn mới mà thông tin (phương sai) được gom lại ở các chiều đầu tiên. Về mặt toán học, điều này liên quan chặt chẽ đến Phân tích Kỳ dị (Singular Value Decomposition - SVD)."
              : "PCA looks for an orthogonal coordinate system where information (variance) is maximized along the first few axes. Mathematically, this is deeply connected to Singular Value Decomposition (SVD)."}
          </p>
          
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-6 shadow-inner my-6">
            <div>
              <div className="text-sm text-slate-400 mb-2 font-semibold">1. {isVi ? "Khai triển SVD đầy đủ (Full SVD)" : "Full SVD"}</div>
              <BlockMath math="X = U \Sigma V^T" />
              <p className="text-xs text-slate-500 mt-2">
                {isVi 
                  ? "U (d × d) và V (N × N) trực giao; ma trận đường chéo Σ chứa các giá trị kỳ dị (singular values) σ₁ ≥ σ₂ ≥ ... ≥ 0."
                  : "U (d × d) and V (N × N) are orthogonal; diagonal matrix Σ contains singular values σ₁ ≥ σ₂ ≥ ... ≥ 0."}
              </p>
            </div>
            <div className="border-t border-slate-700/50 pt-4">
              <div className="text-sm text-slate-400 mb-2 font-semibold">2. {isVi ? "SVD rút gọn (Truncated SVD rank-k)" : "Truncated SVD (rank-k)"}</div>
              <BlockMath math="A = U_k \Sigma_k V_k^T \approx X" />
              <p className="text-xs text-slate-500 mt-2">
                {isVi 
                  ? "Xấp xỉ rank-k tối ưu giúp cực tiểu hóa sai số Frobenius (Định lý Eckart-Young-Mirsky)."
                  : "The optimal rank-k approximation that minimizes Frobenius reconstruction error."}
              </p>
            </div>
            <div className="border-t border-slate-700/50 pt-4">
              <div className="text-sm text-slate-400 mb-2 font-semibold">3. {isVi ? "Mối liên hệ giữa Trị riêng (Eigenvalue) và Giá trị kỳ dị (Singular Value)" : "Eigenvalues vs Singular Values"}</div>
              <BlockMath math="\lambda_i = \frac{\sigma_i^2}{N}" />
              <p className="text-xs text-slate-500 mt-2">
                {isVi 
                  ? "Trị riêng λ_i của ma trận hiệp phương sai S tỉ lệ với bình phương của các giá trị kỳ dị σ_i của ma trận dữ liệu chuẩn hóa X̂."
                  : "Eigenvalues λ_i of covariance matrix S are proportional to the squares of singular values σ_i of centered data matrix X̂."}
              </p>
            </div>
          </div>
          
          <InfoBox variant="info">
            💡 {isVi 
              ? "PCA thực chất chính là Truncated SVD được áp dụng trên ma trận dữ liệu đã được trừ đi vector kỳ vọng (mean-centered data matrix X̂)."
              : "PCA is mathematically equivalent to applying Truncated SVD on the mean-centered data matrix X̂."}
          </InfoBox>
        </Section>

        {/* 4. Interactive Simulator */}
        <Section id="simulator" title={isVi ? "Mô phỏng tương tác PCA" : "PCA Interactive Simulator"} icon="🎮">
          <p className="mb-4 text-sm">
            {isVi
              ? 'Tạo tập điểm dữ liệu. Thuật toán PCA sẽ tự động vẽ ra vector PC1 (màu vàng) dọc theo hướng phân tán mạnh nhất của dữ liệu, và PC2 (màu xám) vuông góc với nó. Biểu đồ Scree Plot góc dưới sẽ biểu diễn tỷ lệ thông tin giữ lại.'
              : 'Add data points on the canvas. PCA will draw the PC1 vector (amber) in the direction of maximum variance, and PC2 (slate) orthogonal to it. The Scree Plot chart will reflect the explained variance ratio.'}
          </p>
          <PCASimulator />
        </Section>

        {/* 5. Choosing Optimal K */}
        <Section id="optimal-k" title={isVi ? "Chọn số chiều k tối ưu" : "Choosing Optimal K"} icon="🎯">
          <p>
            {isVi
              ? "Tổng phương sai (Trace của ma trận hiệp phương sai S) bất biến đối với mọi phép xoay trục tọa độ. Khi giảm số chiều về k, ta chọn k dựa trên Tỷ lệ phương sai giải thích được tích lũy (Cumulative Explained Variance Ratio):"
              : "The total variance (Trace of covariance matrix S) is invariant under orthogonal rotations. When reducing dimensions to k, we select k based on the Cumulative Explained Variance Ratio:"}
          </p>
          <div className="bg-slate-900 rounded-2xl p-5 text-white my-4 overflow-x-auto shadow-inner">
            <BlockMath math="r_k = \frac{\sum_{i=1}^{k} \lambda_i}{\sum_{j=1}^{d} \lambda_j} \ge \theta" />
            <p className="text-xs text-slate-500 mt-2 text-center">
              {isVi ? "Thường chọn theta bằng 95% hoặc 99% lượng thông tin được bảo toàn." : "Usually theta is selected to preserve 95% or 99% of original information."}
            </p>
          </div>
          <p className="text-sm">
            {isVi
              ? "Vẽ đồ thị trị riêng λ_i theo chỉ số i (gọi là Scree Plot). Điểm gấp khúc khuỷu tay (Elbow) chỉ ra số chiều k tối ưu, vì sau điểm đó các trị riêng tiếp theo đóng góp rất ít vào việc giải thích phương sai dữ liệu."
              : "A Scree Plot visualizes eigenvalues against their component index. The elbow point indicates the optimal k dimension, beyond which additional components contribute very little explained variance."}
          </p>
        </Section>

        {/* 6. Practical PCA */}
        <Section id="practical-pca" title={isVi ? "PCA trong thực tế" : "PCA in Practice"} icon="⚙️">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">
            {isVi ? "📌 Trường hợp d > N (Số chiều vượt trội số mẫu)" : "📌 Case d > N (High-dimensional low-sample size)"}
          </h4>
          <p className="text-sm">
            {isVi
              ? "Ví dụ phân tích gene (d = 50,000 cột nhưng chỉ có N = 100 mẫu). Ma trận hiệp phương sai S (d × d) quá lớn để tính toán. Giải pháp là chuyển sang tính ma trận hạt nhân nhỏ hơn T = X^T X (N × N):"
              : "For gene datasets (d = 50,000 features, N = 100 samples), the covariance matrix S (d × d) is too large. Instead, compute eigenvalues of the smaller Gram matrix T = X^T X (N × N):"}
          </p>
          <div className="bg-slate-900 p-5 rounded-2xl my-4 text-white overflow-x-auto">
            <BlockMath math="T v_i = \lambda_i v_i \implies S u_i = \lambda_i u_i \quad \text{với} \quad u_i = \frac{X v_i}{\|X v_i\|_2}" />
            <p className="text-xs text-slate-500 mt-2 text-center">
              {isVi 
                ? "Giúp trích xuất vector riêng u_i của ma trận cực lớn S thông qua vector riêng v_i của ma trận nhỏ T."
                : "Allows calculating eigenvectors u_i of massive matrix S through eigenvectors v_i of small matrix T."}
            </p>
          </div>

          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2 mt-6">
            {isVi ? "📌 Học máy dữ liệu lớn (Large-Scale Data)" : "📌 Large-Scale Data Handling"}
          </h4>
          <p className="text-sm">
            {isVi
              ? "Khi cả N và d đều rất lớn, ta sử dụng thuật toán Incremental PCA (đọc dữ liệu theo từng block nhỏ để cập nhật tâm) hoặc thuật toán lặp xấp xỉ trị riêng như Power Method."
              : "When both N and d are extremely large, Incremental PCA (batch-based updates) or iterative approximation algorithms like the Power Method are used."}
          </p>
        </Section>

        {/* 7. Power Method */}
        <Section id="power" title={isVi ? "Thuật toán Power Method" : "Power Method Algorithm"} icon="⚡">
          <p>
            {isVi
              ? "Power Method là thuật toán lặp cực kỳ nhanh để xấp xỉ trị riêng lớn nhất (λ₁) và vector riêng tương ứng (u₁) của ma trận lớn mà không cần tính toàn bộ ma trận trị riêng."
              : "The Power Method is a fast iterative algorithm to approximate the dominant eigenvalue (λ₁) and its corresponding eigenvector (u₁) without full matrix decomposition."}
          </p>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm text-sm space-y-2 leading-relaxed">
            <p><strong>{isVi ? 'Ý tưởng chính:' : 'Main Idea:'}</strong></p>
            <p>
              {isVi
                ? "Bắt đầu từ một vector ngẫu nhiên q(0). Nhân lặp nhiều lần với ma trận A: z = A * q. Sau đó chuẩn hóa q = z / ||z||. Vector q sẽ hội tụ về hướng của vector riêng u₁."
                : "Start with a random unit vector q(0). Repeatedly multiply: z = A * q, and normalize: q = z / ||z||. Vector q will align with eigenvector u₁."}
            </p>
            <p>
              {isVi
                ? "Để tìm các trị riêng tiếp theo (λ₂, u₂...), ta dùng phương pháp khử ma trận (Deflation):"
                : "To extract subsequent eigenvectors (λ₂, u₂...), we use Deflation:"}
            </p>
            <div className="bg-slate-950 text-white p-3 rounded-xl text-xs font-mono">
              <BlockMath math="B = A - \lambda_1 u_1 u_1^T" />
            </div>
          </div>

          <PowerMethodSimulator />
        </Section>

        {/* 8. Linear Discriminant Analysis */}
        <Section id="lda" title={isVi ? "Linear Discriminant Analysis" : "Linear Discriminant Analysis (LDA)"} icon="🏷️">
          <p>
            {isVi
              ? "Trong khi PCA là kỹ thuật không giám sát (unsupervised), LDA (Linear Discriminant Analysis) là kỹ thuật giảm chiều có giám sát (supervised). LDA tìm hướng chiếu sao cho khả năng phân biệt giữa các lớp là lớn nhất."
              : "While PCA is unsupervised, LDA is supervised. LDA searches for a projection axis that maximizes the separability between classes."}
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-xs">
              <strong className="text-emerald-700 dark:text-emerald-400 block mb-1">Within-class variance (SW)</strong>
              {isVi 
                ? 'Độ phân tán dữ liệu nội bộ từng lớp. LDA muốn SW càng NHỎ càng tốt (mỗi lớp gom lại gọn).' 
                : 'Variance within each class. LDA wants SW to be as SMALL as possible (compact clusters).'}
            </div>
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl text-xs">
              <strong className="text-rose-700 dark:text-rose-400 block mb-1">Between-class variance (SB)</strong>
              {isVi 
                ? 'Khoảng cách giữa các tâm của các lớp. LDA muốn SB càng LỚN càng tốt (các tâm cách xa nhau).' 
                : 'Distance between class means. LDA wants SB to be as LARGE as possible (distant clusters).'}
            </div>
          </div>

          <p className="text-sm">
            {isVi
              ? "Tiêu chí Fisher (Fisher's Criterion) tối đa hóa tỷ số:"
              : "Fisher's Criterion maximizes the ratio:"}
          </p>
          <div className="bg-slate-900 text-white p-5 rounded-2xl my-4 text-center">
            <BlockMath math="J(w) = \frac{w^T S_B w}{w^T S_W w}" />
            <p className="text-xs text-slate-500 mt-2">
              {isVi
                ? "Nghiệm của bài toán nhị phân (2 lớp) có công thức đóng: w* ∝ SW^-1(m1 - m2)"
                : "For binary classes, the analytic solution is: w* ∝ SW^-1(m1 - m2)"}
            </p>
          </div>

          <InfoBox variant="emerald">
            ⚠️ <strong>{isVi ? 'Giới hạn số chiều:' : 'Dimension Limit:'}</strong> 
            <br />
            {isVi
              ? "Vì rank(SB) ≤ C - 1 (với C là số lớp), LDA chỉ có thể giảm dữ liệu xuống tối đa là C - 1 chiều. Với bài toán phân loại 2 lớp, LDA chỉ có thể chiếu dữ liệu về duy nhất 1 chiều."
              : "Since rank(SB) ≤ C - 1 (where C is the number of classes), LDA can only reduce features to a maximum of C - 1 dimensions. For binary classification, it is restricted to a 1D projection."}
          </InfoBox>

          <LdaPcaSimulator />
        </Section>

        {/* 9. Comparison */}
        <Section id="compare" title={isVi ? "So sánh PCA & LDA" : "Comparison: PCA vs LDA"} icon="⚖️">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left text-slate-650 dark:text-slate-400 border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <th className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold">{isVi ? 'Đặc trưng' : 'Feature'}</th>
                  <th className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold">PCA</th>
                  <th className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold">LDA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{isVi ? 'Loại mô hình' : 'Model Type'}</td>
                  <td className="p-4">Unsupervised (Không giám sát)</td>
                  <td className="p-4">Supervised (Có giám sát)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{isVi ? 'Nhãn dữ liệu' : 'Requires Labels?'}</td>
                  <td className="p-4">✗ {isVi ? 'Không yêu cầu' : 'No'}</td>
                  <td className="p-4">✓ {isVi ? 'Bắt buộc' : 'Yes'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{isVi ? 'Mục tiêu tối ưu' : 'Optimization Goal'}</td>
                  <td className="p-4">{isVi ? 'Tối đa hóa phương sai dữ liệu' : 'Maximize overall data variance'}</td>
                  <td className="p-4">{isVi ? 'Tối đa hóa khả năng phân biệt các lớp' : 'Maximize class separability'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{isVi ? 'Số chiều tối đa' : 'Maximum Dimensions'}</td>
                  <td className="p-4">min(d, N - 1)</td>
                  <td className="p-4">C - 1 (C = {isVi ? 'số lớp' : 'number of classes'})</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{isVi ? 'Ứng dụng chính' : 'Main Applications'}</td>
                  <td className="p-4">{isVi ? 'Nén dữ liệu, giảm nhiễu, trực quan hóa' : 'Data compression, noise removal, visualization'}</td>
                  <td className="p-4">{isVi ? 'Phân loại mẫu, Nhận diện khuôn mặt' : 'Feature extraction for classification, Face Recognition'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* 10. Pros & Cons */}
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

        {/* 11. Python Code */}
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
              { id: 'math', text: isVi ? "3. Toán học (PCA & SVD)" : "3. Math (PCA & SVD)" },
              { id: 'simulator', text: isVi ? "4. Mô phỏng PCA" : "4. PCA Simulator" },
              { id: 'optimal-k', text: isVi ? "5. Chọn k tối ưu" : "5. Optimal K" },
              { id: 'practical-pca', text: isVi ? "6. PCA trong thực tế" : "6. PCA in Practice" },
              { id: 'power', text: isVi ? "7. Thuật toán Power Method" : "7. Power Method" },
              { id: 'lda', text: isVi ? "8. Thuật toán LDA" : "8. LDA Algorithm" },
              { id: 'compare', text: isVi ? "9. So sánh PCA & LDA" : "9. Compare PCA & LDA" },
              { id: 'pros-cons', text: isVi ? "10. Ưu / Nhược" : "10. Pros & Cons" },
              { id: 'python', text: isVi ? "11. Code Python" : "11. Python Code" },
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
