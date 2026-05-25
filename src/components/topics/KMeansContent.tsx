import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useRef, useEffect, useCallback, useState } from 'react';

export default function KMeansContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  /* ───────────── Sub-components ───────────── */

  const Section = ({
    title, children, id, icon,
  }: { title: string; children: React.ReactNode; id: string; icon?: string }) => (
    <section id={id} className="mb-10 scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-base shadow-md shadow-indigo-200 dark:shadow-indigo-900/40 flex-shrink-0">
            {icon}
          </div>
        )}
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
        {children}
      </div>
    </section>
  );

  const InfoBox = ({ children, variant = 'indigo' }: { children: React.ReactNode; variant?: 'indigo' | 'emerald' | 'amber' }) => {
    const styles = {
      indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200',
      emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
      amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200',
    };
    return (
      <div className={`p-4 my-4 rounded-2xl border ${styles[variant]} text-sm font-medium`}>
        {children}
      </div>
    );
  };

  /* ───────────── Step Cards ───────────── */
  const steps = isVi
    ? [
        { num: '01', label: 'Khởi tạo', desc: 'Chọn ngẫu nhiên K điểm làm tâm cụm (centroids) ban đầu.', color: 'from-violet-500 to-indigo-500' },
        { num: '02', label: 'Gán cụm', desc: 'Tính khoảng cách mỗi điểm tới K tâm, gán vào cụm gần nhất.', color: 'from-indigo-500 to-blue-500' },
        { num: '03', label: 'Cập nhật', desc: 'Tính lại tâm cụm = trung bình cộng tọa độ tất cả điểm trong cụm.', color: 'from-blue-500 to-cyan-500' },
        { num: '04', label: 'Lặp lại', desc: 'Lặp bước 2–3 đến khi tâm không thay đổi (hội tụ).', color: 'from-cyan-500 to-emerald-500' },
      ]
    : [
        { num: '01', label: 'Initialization', desc: 'Randomly pick K data points as initial centroids.', color: 'from-violet-500 to-indigo-500' },
        { num: '02', label: 'Assignment', desc: 'Compute distance from each point to K centroids, assign to closest.', color: 'from-indigo-500 to-blue-500' },
        { num: '03', label: 'Update', desc: 'Recalculate centroid = mean of all points in that cluster.', color: 'from-blue-500 to-cyan-500' },
        { num: '04', label: 'Repeat', desc: 'Repeat steps 2–3 until centroids stop changing (convergence).', color: 'from-cyan-500 to-emerald-500' },
      ];

  /* ───────────── Python Code ───────────── */
  const pythonCode = `import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

# 1. Generate synthetic data
X, y_true = make_blobs(n_samples=300, centers=4, cluster_std=0.60, random_state=0)

# 2. Initialize KMeans with K=4
kmeans = KMeans(n_clusters=4, init='k-means++', n_init=10, max_iter=300, random_state=42)

# 3. Fit and predict clusters
y_kmeans = kmeans.fit_predict(X)

# 4. Get the cluster centroids
centers = kmeans.cluster_centers_

# 5. Visualize the result
plt.figure(figsize=(8, 6))
plt.scatter(X[:, 0], X[:, 1], c=y_kmeans, s=50, cmap='viridis', alpha=0.7)
plt.scatter(centers[:, 0], centers[:, 1], c='red', s=200, alpha=0.9, marker='X', label='Centroids')
plt.title('K-Means Clustering (K=4)')
plt.legend()
plt.show()`;

  /* ───────────── SVG Cluster Visualizer (Removed) ───────────── */

  /* ───────────── K-Means Interactive Simulator ───────────── */
  const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#ec4899','#06b6d4','#8b5cf6','#f97316'];

  function KMeansSimulator() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [K, setK] = useState(3);
    const [phase, setPhase] = useState<'idle'|'initialized'|'assigned'|'updated'|'converged'>('idle');
    const [iterations, setIterations] = useState(0);
    const [wcss, setWcss] = useState<string>('N/A');
    const [hint, setHint] = useState(isVi ? 'Click lên canvas để vẽ điểm, hoặc dùng nút tạo dữ liệu mẫu' : 'Click the canvas to add points, or use preset buttons');
    const [isPlaying, setIsPlaying] = useState(false);

    const pointsRef = useRef<{x:number,y:number,cluster:number}[]>([]);
    const centroidsRef = useRef<{x:number,y:number,color:string}[]>([]);
    const phaseRef = useRef<'idle'|'initialized'|'assigned'|'updated'|'converged'>('idle');
    const iterRef = useRef(0);
    const playTimerRef = useRef<ReturnType<typeof setInterval>|null>(null);

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
      for (let x = 20; x < W; x += 30) for (let y = 20; y < H; y += 30)
        ctx.fillRect(x, y, 1.5, 1.5);

      const pts = pointsRef.current;
      const cents = centroidsRef.current;

      // Draw Voronoi-like cluster regions (soft circles)
      if (cents.length > 0 && phaseRef.current !== 'idle') {
        cents.forEach(c => {
          const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 120);
          grad.addColorStop(0, c.color + '22');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, 120, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Draw points
      pts.forEach(p => {
        const col = p.cluster >= 0 && cents[p.cluster] ? cents[p.cluster].color : '#64748b';
        // glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = col + '33';
        ctx.fill();
        // core
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
      });

      // Draw centroids
      cents.forEach((c, i) => {
        // outer ring pulse
        ctx.beginPath();
        ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
        ctx.strokeStyle = c.color + '66';
        ctx.lineWidth = 2;
        ctx.stroke();
        // inner fill
        ctx.beginPath();
        ctx.arc(c.x, c.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.fill();
        // X mark
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(c.x - 4, c.y - 4); ctx.lineTo(c.x + 4, c.y + 4);
        ctx.moveTo(c.x + 4, c.y - 4); ctx.lineTo(c.x - 4, c.y + 4);
        ctx.stroke();
        // label
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(`C${i+1}`, c.x, c.y + 22);
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

    const calcWCSS = useCallback(() => {
      const pts = pointsRef.current;
      const cents = centroidsRef.current;
      if (!cents.length) return 'N/A';
      let sum = 0;
      pts.forEach(p => {
        if (p.cluster < 0) return;
        const c = cents[p.cluster];
        if (!c) return;
        sum += (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
      });
      return sum.toFixed(0);
    }, []);

    const assignStep = useCallback(() => {
      const pts = pointsRef.current;
      const cents = centroidsRef.current;
      if (!cents.length) return;
      pts.forEach(p => {
        let best = 0, bestDist = Infinity;
        cents.forEach((c, i) => {
          const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
          if (d < bestDist) { bestDist = d; best = i; }
        });
        p.cluster = best;
      });
      phaseRef.current = 'assigned';
      setPhase('assigned');
      setWcss(calcWCSS());
      setHint(isVi ? '✅ Đã gán cụm — mỗi điểm thuộc về tâm gần nhất. Bấm "Bước tiếp" để cập nhật tâm.' : '✅ Assigned — each point belongs to the nearest centroid. Click "Next step" to update centroids.');
      draw();
    }, [calcWCSS, draw]);

    const updateStep = useCallback(() => {
      const pts = pointsRef.current;
      const cents = centroidsRef.current;
      let converged = true;
      cents.forEach((c, i) => {
        const members = pts.filter(p => p.cluster === i);
        if (!members.length) return;
        const newX = members.reduce((s, p) => s + p.x, 0) / members.length;
        const newY = members.reduce((s, p) => s + p.y, 0) / members.length;
        if (Math.abs(newX - c.x) > 0.5 || Math.abs(newY - c.y) > 0.5) converged = false;
        c.x = newX; c.y = newY;
      });
      if (converged) {
        phaseRef.current = 'converged';
        setPhase('converged');
        setHint(isVi ? '🎉 Hội tụ! Các tâm không còn thay đổi. Thuật toán hoàn tất!' : '🎉 Converged! Centroids stopped moving. Algorithm complete!');
        if (playTimerRef.current) { clearInterval(playTimerRef.current); playTimerRef.current = null; setIsPlaying(false); }
      } else {
        iterRef.current += 1;
        setIterations(iterRef.current);
        phaseRef.current = 'updated';
        setPhase('updated');
        setHint(isVi ? `🔄 Đã cập nhật tâm — vòng lặp #${iterRef.current}. Bấm "Bước tiếp" để gán lại cụm.` : `🔄 Updated centroids — iteration #${iterRef.current}. Click "Next step" to reassign.`);
      }
      draw();
    }, [draw]);

    const stepKMeans = useCallback(() => {
      const pts = pointsRef.current;
      if (pts.length < K) {
        setHint(isVi ? `⚠️ Cần ít nhất ${K} điểm. Hãy click thêm điểm lên canvas!` : `⚠️ Need at least ${K} points. Click to add more!`);
        return;
      }
      if (phaseRef.current === 'idle' || phaseRef.current === 'converged') {
        // Initialize centroids (K-Means++ style)
        centroidsRef.current = [];
        const shuffled = [...pts].sort(() => Math.random() - 0.5);
        centroidsRef.current.push({ ...shuffled[0], color: COLORS[0] });
        for (let i = 1; i < K; i++) {
          let maxDist = -1, chosen = shuffled[i];
          shuffled.forEach(p => {
            const minD = Math.min(...centroidsRef.current.map(c => (p.x-c.x)**2 + (p.y-c.y)**2));
            if (minD > maxDist) { maxDist = minD; chosen = p; }
          });
          centroidsRef.current.push({ ...chosen, color: COLORS[i % COLORS.length] });
        }
        pts.forEach(p => p.cluster = -1);
        iterRef.current = 0;
        setIterations(0);
        phaseRef.current = 'initialized';
        setPhase('initialized');
        setHint(isVi ? '🎯 Đã khởi tạo tâm cụm (K-Means++). Bấm "Bước tiếp" để gán cụm!' : '🎯 Centroids initialized (K-Means++). Click "Next step" to assign clusters!');
        draw();
      } else if (phaseRef.current === 'initialized' || phaseRef.current === 'updated') {
        assignStep();
      } else if (phaseRef.current === 'assigned') {
        updateStep();
      }
    }, [K, assignStep, updateStep, draw]);

    const togglePlay = useCallback(() => {
      if (isPlaying) {
        if (playTimerRef.current) clearInterval(playTimerRef.current);
        playTimerRef.current = null;
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        stepKMeans();
        playTimerRef.current = setInterval(() => {
          if (phaseRef.current === 'converged') {
            clearInterval(playTimerRef.current!);
            playTimerRef.current = null;
            setIsPlaying(false);
            return;
          }
          if (phaseRef.current === 'initialized' || phaseRef.current === 'updated') {
            // assign
            const pts = pointsRef.current;
            const cents = centroidsRef.current;
            pts.forEach(p => {
              let best = 0, bestDist = Infinity;
              cents.forEach((c, i) => { const d=(p.x-c.x)**2+(p.y-c.y)**2; if(d<bestDist){bestDist=d;best=i;} });
              p.cluster = best;
            });
            phaseRef.current = 'assigned';
            setPhase('assigned');
          } else if (phaseRef.current === 'assigned') {
            // update
            const pts = pointsRef.current;
            const cents = centroidsRef.current;
            let converged = true;
            cents.forEach((c, i) => {
              const members = pts.filter(p => p.cluster === i);
              if (!members.length) return;
              const newX = members.reduce((s,p)=>s+p.x,0)/members.length;
              const newY = members.reduce((s,p)=>s+p.y,0)/members.length;
              if (Math.abs(newX-c.x)>0.5||Math.abs(newY-c.y)>0.5) converged=false;
              c.x=newX; c.y=newY;
            });
            if (converged) {
              phaseRef.current = 'converged';
              setPhase('converged');
              if (playTimerRef.current) clearInterval(playTimerRef.current);
              setIsPlaying(false);
              setHint(isVi ? '🎉 Hội tụ! Thuật toán hoàn tất!' : '🎉 Converged! Algorithm complete!');
            } else {
              iterRef.current += 1;
              setIterations(iterRef.current);
              phaseRef.current = 'updated';
              setPhase('updated');
            }
          }
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              // redraw inline (can't call hook inside callback)
              const W=canvas.width,H=canvas.height;
              ctx.clearRect(0,0,W,H);
              ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
              ctx.fillStyle='rgba(255,255,255,0.04)';
              for(let x=20;x<W;x+=30)for(let y=20;y<H;y+=30)ctx.fillRect(x,y,1.5,1.5);
              const pts=pointsRef.current,cents=centroidsRef.current;
              if(cents.length){cents.forEach(c=>{const g=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,120);g.addColorStop(0,c.color+'22');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(c.x,c.y,120,0,Math.PI*2);ctx.fill();});}
              pts.forEach(p=>{const col=p.cluster>=0&&cents[p.cluster]?cents[p.cluster].color:'#64748b';ctx.beginPath();ctx.arc(p.x,p.y,8,0,Math.PI*2);ctx.fillStyle=col+'33';ctx.fill();ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();});
              cents.forEach((c,i)=>{ctx.beginPath();ctx.arc(c.x,c.y,14,0,Math.PI*2);ctx.strokeStyle=c.color+'66';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(c.x,c.y,9,0,Math.PI*2);ctx.fillStyle=c.color;ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(c.x-4,c.y-4);ctx.lineTo(c.x+4,c.y+4);ctx.moveTo(c.x+4,c.y-4);ctx.lineTo(c.x-4,c.y+4);ctx.stroke();ctx.font='bold 9px Inter,sans-serif';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(`C${i+1}`,c.x,c.y+22);});
            }
          }
        }, 900);
      }
    }, [isPlaying, stepKMeans]);

    const generateGaussian = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const W = canvas.width || 600, H = canvas.height || 360;
      pointsRef.current = [];
      centroidsRef.current = [];
      phaseRef.current = 'idle';
      setPhase('idle'); setIterations(0); setWcss('N/A');
      for (let c = 0; c < K; c++) {
        const cx = W * (0.2 + Math.random() * 0.6);
        const cy = H * (0.2 + Math.random() * 0.6);
        const std = Math.min(W, H) * 0.07;
        for (let i = 0; i < Math.floor(80/K); i++) {
          const u1 = Math.random() || 0.001, u2 = Math.random() || 0.001;
          const nx = Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
          const ny = Math.sqrt(-2*Math.log(u1))*Math.sin(2*Math.PI*u2);
          const x = cx + nx*std, y = cy + ny*std;
          if (x>10&&x<W-10&&y>10&&y<H-10) pointsRef.current.push({x,y,cluster:-1});
        }
      }
      setHint(isVi ? `Đã tạo ${pointsRef.current.length} điểm Gaussian. Bấm "Từng bước" để bắt đầu!` : `Generated ${pointsRef.current.length} Gaussian points. Click "Step" to start!`);
      draw();
    }, [K, draw]);

    const generateRandom = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const W = canvas.width || 600, H = canvas.height || 360;
      pointsRef.current = Array.from({length: 80}, () => ({ x: 20+Math.random()*(W-40), y: 20+Math.random()*(H-40), cluster: -1 }));
      centroidsRef.current = [];
      phaseRef.current = 'idle';
      setPhase('idle'); setIterations(0); setWcss('N/A');
      setHint(isVi ? 'Đã tạo 80 điểm ngẫu nhiên. Bấm "Từng bước" để bắt đầu!' : 'Generated 80 random points. Click "Step" to start!');
      draw();
    }, [draw]);

    const reset = useCallback(() => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      playTimerRef.current = null;
      setIsPlaying(false);
      centroidsRef.current = [];
      pointsRef.current.forEach(p => p.cluster = -1);
      phaseRef.current = 'idle';
      setPhase('idle'); setIterations(0); setWcss('N/A');
      setHint(isVi ? 'Đã reset tâm cụm. Bấm "Từng bước" để chạy lại.' : 'Reset centroids. Click "Step" to restart.');
      draw();
    }, [draw]);

    const clearAll = useCallback(() => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      playTimerRef.current = null;
      setIsPlaying(false);
      pointsRef.current = [];
      centroidsRef.current = [];
      phaseRef.current = 'idle';
      setPhase('idle'); setIterations(0); setWcss('N/A');
      setHint(isVi ? 'Canvas đã xóa. Click để vẽ điểm mới!' : 'Canvas cleared. Click to draw new points!');
      draw();
    }, [draw]);

    const onCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      pointsRef.current.push({ x, y, cluster: -1 });
      if (phaseRef.current === 'assigned' || phaseRef.current === 'updated' || phaseRef.current === 'converged') {
        phaseRef.current = 'initialized';
        setPhase('initialized');
        iterRef.current = 0;
        setIterations(0);
      }
      draw();
    }, [draw]);

    const phaseLabel: Record<string, string> = {
      idle: isVi ? 'Chưa bắt đầu' : 'Not started',
      initialized: isVi ? 'Đã khởi tạo tâm' : 'Initialized',
      assigned: isVi ? 'Đã gán cụm' : 'Assigned',
      updated: isVi ? 'Đã cập nhật tâm' : 'Updated',
      converged: isVi ? '✓ Hội tụ!' : '✓ Converged!',
    };

    return (
      <div className="rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {isVi ? 'Bảng mô phỏng K-Means tương tác' : 'K-Means Interactive Simulator'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Controls panel */}
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col gap-4">
            {/* K selector */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isVi ? 'Số cụm K' : 'Clusters K'}</span>
                <span className="text-xs font-bold bg-indigo-900/60 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-700">{K}</span>
              </div>
              <input type="range" min={2} max={7} value={K}
                onChange={e => { setK(+e.target.value); reset(); }}
                className="w-full accent-indigo-500 h-1.5 rounded-full cursor-pointer" />
            </div>

            {/* Presets */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{isVi ? 'Tạo dữ liệu mẫu' : 'Generate Data'}</span>
              <div className="flex flex-col gap-2">
                <button onClick={generateGaussian} className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-2">
                  <span className="text-indigo-400">◉</span> {isVi ? 'Cụm Gaussian' : 'Gaussian Clusters'}
                </button>
                <button onClick={generateRandom} className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-2">
                  <span className="text-amber-400">◈</span> {isVi ? 'Phân bố ngẫu nhiên' : 'Random Scatter'}
                </button>
              </div>
            </div>

            {/* Step buttons */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={stepKMeans}
                  className="py-2.5 bg-indigo-900/50 hover:bg-indigo-800/70 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-700 transition-colors">
                  ⏭ {isVi ? 'Từng bước' : 'Step'}
                </button>
                <button onClick={togglePlay}
                  className={`py-2.5 text-xs font-bold rounded-xl border transition-colors ${isPlaying ? 'bg-amber-900/50 hover:bg-amber-800/70 text-amber-300 border-amber-700' : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500'}`}>
                  {isPlaying ? `⏸ ${isVi ? 'Dừng' : 'Pause'}` : `▶ ${isVi ? 'Tự động' : 'Auto'}`}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={reset} className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold rounded-xl border border-slate-700 transition-colors">
                  ↺ {isVi ? 'Reset' : 'Reset'}
                </button>
                <button onClick={clearAll} className="py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs font-semibold rounded-xl border border-red-900/50 transition-colors">
                  ✕ {isVi ? 'Xóa hết' : 'Clear'}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: isVi ? 'Giai đoạn' : 'Phase', value: phaseLabel[phase], color: phase === 'converged' ? 'text-emerald-400' : 'text-amber-400' },
                { label: isVi ? 'Vòng lặp' : 'Iterations', value: iterations.toString(), color: 'text-slate-200' },
                { label: isVi ? 'Số điểm' : 'Points', value: pointsRef.current.length.toString(), color: 'text-slate-200' },
                { label: 'WCSS', value: wcss, color: 'text-indigo-300' },
              ].map(s => (
                <div key={s.label} className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{s.label}</span>
                  <span className={`text-xs font-bold block mt-0.5 ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Hint */}
            <div className="bg-indigo-900/20 border border-indigo-800/40 rounded-xl p-3">
              <p className="text-[11px] text-indigo-300 leading-relaxed">{hint}</p>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2 relative">
            <canvas ref={canvasRef} onClick={onCanvasClick}
              className="w-full cursor-crosshair block"
              style={{ minHeight: 340 }} />
            <div className="absolute bottom-3 left-3 flex gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500 inline-block"/>  {isVi ? 'điểm dữ liệu' : 'data point'}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400 inline-block"/> centroid</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* ─── Main Content ─── */}
      <div className="lg:w-3/4 space-y-2">

        {/* Hero Banner */}
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 p-8 shadow-2xl shadow-indigo-900/30">
          <div className="absolute -right-8 -bottom-8 text-indigo-600/20 text-[10rem] font-black leading-none select-none pointer-events-none">K</div>
          <div className="relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3 bg-indigo-800/60 px-3 py-1 rounded-full border border-indigo-700">
              Unsupervised Learning
            </span>
            <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
              K-Means Clustering
            </h1>
            <p className="text-indigo-200 text-sm leading-relaxed max-w-xl">
              {isVi
                ? 'Thuật toán phân cụm không giám sát phổ biến nhất — chia dữ liệu thành K nhóm tối ưu bằng cách tối thiểu hoá khoảng cách nội cụm.'
                : 'The most popular unsupervised clustering algorithm — partitions data into K optimal groups by minimising intra-cluster distances.'}
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              {['Unsupervised', 'Iterative', 'O(n·k·I)', 'Euclidean'].map(tag => (
                <span key={tag} className="text-xs font-semibold text-indigo-200 bg-indigo-700/50 px-3 py-1 rounded-full border border-indigo-600/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 1. Introduction */}
        <Section id="intro" title={isVi ? '1. Giới thiệu' : '1. Introduction'} icon="💡">
          <p>
            {isVi
              ? 'K-Means là thuật toán học máy không giám sát (unsupervised learning) vô cùng phổ biến dùng để phân cụm dữ liệu. Mục tiêu là chia tập dữ liệu thành K nhóm riêng biệt sao cho các điểm trong cùng nhóm giống nhau nhất có thể.'
              : 'K-Means is a highly popular unsupervised machine learning algorithm used for data clustering. The goal is to partition a dataset into K distinct groups such that data points within the same group are as similar as possible.'}
          </p>
          <InfoBox variant="indigo">
            💡 {isVi
              ? 'Hãy tưởng tượng bạn có một rổ hoa quả lộn xộn (táo, cam, chuối). K-Means tự động phân loại chúng vào K rổ riêng mà không cần nhãn trước!'
              : 'Imagine a mixed basket of fruits (apples, oranges, bananas). K-Means automatically sorts them into K separate baskets — no labels needed!'}
          </InfoBox>
        </Section>

        {/* 2. Algorithm Steps */}
        <Section id="algorithm" title={isVi ? '2. Thuật toán từng bước' : '2. Step-by-step Algorithm'} icon="⚙️">
          <p className="mb-4">
            {isVi
              ? 'K-Means hoạt động theo vòng lặp gồm 4 bước chính:'
              : 'K-Means works in an iterative loop of 4 main steps:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map(step => (
              <div
                key={step.num}
                className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} opacity-10`} />
                <span className={`inline-block text-xs font-black bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-2`}>
                  STEP {step.num}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{step.label}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 3. Math */}
        <Section id="math" title={isVi ? '3. Cơ sở toán học' : '3. Mathematical Foundation'} icon="∑">
          <p>
            {isVi
              ? 'K-Means tối thiểu hoá hàm mục tiêu WCSS (Within-Cluster Sum of Squares — Tổng bình phương khoảng cách nội cụm):'
              : 'K-Means minimises the WCSS (Within-Cluster Sum of Squares) objective function:'}
          </p>
          <div className="bg-slate-900 rounded-2xl p-6 my-4 overflow-x-auto shadow-inner">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              {isVi ? 'Hàm mục tiêu (Objective Function)' : 'Objective Function'}
            </p>
            <div className="text-white">
              <BlockMath math="J = \sum_{j=1}^{K} \sum_{x \in S_j} \| x - \mu_j \|^2" />
            </div>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li><span className="text-indigo-400 font-bold">K</span> — {isVi ? 'số lượng cụm' : 'number of clusters'}</li>
              <li><span className="text-indigo-400 font-bold">S_j</span> — {isVi ? 'tập hợp điểm thuộc cụm j' : 'set of points in cluster j'}</li>
              <li><span className="text-indigo-400 font-bold">μ_j</span> — {isVi ? 'tâm (centroid) của cụm j' : 'centroid of cluster j'}</li>
              <li><span className="text-indigo-400 font-bold">‖x − μ_j‖²</span> — {isVi ? 'bình phương khoảng cách Euclid' : 'squared Euclidean distance'}</li>
            </ul>
          </div>
          <p className="text-sm">
            {isVi
              ? 'Khoảng cách Euclid giữa hai điểm trong không gian 2D:'
              : 'Euclidean distance between two points in 2D space:'}
          </p>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 overflow-x-auto">
            <BlockMath math="d(A, B) = \sqrt{(x_A - x_B)^2 + (y_A - y_B)^2}" />
          </div>
        </Section>

        {/* 4. Choosing K */}
        <Section id="choosing-k" title={isVi ? '4. Chọn số cụm K tối ưu' : '4. Choosing Optimal K'} icon="📐">
          <p>
            {isVi
              ? 'Thách thức lớn nhất của K-Means: phải biết trước K. Hai phương pháp phổ biến:'
              : 'The biggest challenge of K-Means: you must specify K upfront. Two popular methods:'}
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            {/* Elbow Method */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm">📈</span>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Elbow Method</h4>
              </div>
              {/* Mini SVG Chart */}
              <svg viewBox="0 0 200 100" className="w-full h-auto mb-3 bg-slate-900 rounded-xl p-2">
                <line x1="20" y1="10" x2="20" y2="85" stroke="#475569" strokeWidth="1" />
                <line x1="20" y1="85" x2="195" y2="85" stroke="#475569" strokeWidth="1" />
                <path d="M 20,15 L 50,38 L 80,62 L 110,72 L 140,78 L 170,82 L 195,84" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Elbow point */}
                <circle cx="80" cy="62" r="6" fill="rgba(99,102,241,0.3)" className="animate-pulse" />
                <circle cx="80" cy="62" r="3" fill="#818cf8" />
                <text x="90" y="57" fill="#38bdf8" fontSize="7" fontWeight="bold">Elbow (K=3)</text>
                {/* Axis labels */}
                {[1,2,3,4,5,6,7].map((k, i) => (
                  <text key={k} x={20 + i * 29} y="93" fill="#94a3b8" fontSize="7" textAnchor="middle"
                    fontWeight={k === 3 ? 'bold' : 'normal'}
                    style={{ fill: k === 3 ? '#818cf8' : '#94a3b8' }}>
                    K={k}
                  </text>
                ))}
                <text x="7" y="50" fill="#94a3b8" fontSize="6" transform="rotate(-90,7,50)" textAnchor="middle">WCSS</text>
              </svg>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isVi
                  ? 'Vẽ WCSS theo K. Chọn K tại điểm "khuỷu tay" — nơi WCSS bắt đầu giảm chậm lại rõ rệt.'
                  : 'Plot WCSS vs K. Choose K at the "elbow" — where WCSS starts decreasing slowly.'}
              </p>
            </div>
            {/* Silhouette */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">📊</span>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Silhouette Score</h4>
              </div>
              <div className="flex items-end gap-1.5 h-16 mb-3 px-2">
                {[0.32, 0.48, 0.71, 0.62, 0.54, 0.46].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{
                        height: `${v * 60}px`,
                        background: i === 2 ? 'linear-gradient(to top, #10b981, #34d399)' : 'linear-gradient(to top, #6366f1, #818cf8)',
                        opacity: i === 2 ? 1 : 0.5,
                      }}
                    />
                    <span className="text-[9px] text-slate-500 dark:text-slate-400">K={i + 2}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isVi
                  ? 'Giá trị từ -1 đến 1. K cho điểm Silhouette trung bình cao nhất là tốt nhất.'
                  : 'Values from -1 to 1. The K with the highest average Silhouette score is optimal.'}
              </p>
            </div>
          </div>
        </Section>

        {/* 5. Interactive Simulation */}
        <Section id="visualization" title={isVi ? '5. Mô phỏng tương tác' : '5. Interactive Simulation'} icon="🎮">
          <p className="mb-4 text-sm">
            {isVi
              ? 'Tự tay vẽ điểm lên canvas hoặc tạo dữ liệu mẫu, rồi chạy thuật toán từng bước để quan sát K-Means hoạt động:'
              : 'Draw points on the canvas or generate sample data, then run the algorithm step-by-step to watch K-Means in action:'}
          </p>
          <KMeansSimulator />
        </Section>

        {/* 6. Pros / Cons */}
        <Section id="pros-cons" title={isVi ? '6. Ưu & Nhược điểm' : '6. Pros & Cons'} icon="⚖️">
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-5">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                <span className="text-lg">✅</span> {isVi ? 'Ưu điểm' : 'Advantages'}
              </h4>
              <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-300">
                {(isVi
                  ? ['Dễ hiểu, dễ cài đặt', 'Cực nhanh với dữ liệu lớn', 'Luôn hội tụ về một nghiệm', 'Tích hợp tốt với scikit-learn']
                  : ['Simple to understand & implement', 'Extremely fast on large datasets', 'Guaranteed convergence', 'Great scikit-learn integration']
                ).map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-200 dark:border-rose-800 p-5">
              <h4 className="font-bold text-rose-700 dark:text-rose-400 mb-3 flex items-center gap-2">
                <span className="text-lg">⚠️</span> {isVi ? 'Nhược điểm' : 'Disadvantages'}
              </h4>
              <ul className="space-y-2 text-sm text-rose-800 dark:text-rose-300">
                {(isVi
                  ? ['Phải chỉ định K trước', 'Nhạy cảm với Outliers', 'Nhạy cảm với tâm khởi tạo (dùng K-Means++)', 'Không tốt với cụm hình dạng phức tạp']
                  : ['K must be specified in advance', 'Highly sensitive to outliers', 'Sensitive to init placement (use K-Means++)', 'Fails on non-spherical cluster shapes']
                ).map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5 flex-shrink-0">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* 7. Applications */}
        <Section id="applications" title={isVi ? '7. Ứng dụng thực tế' : '7. Real-world Applications'} icon="🌐">
          <div className="grid sm:grid-cols-3 gap-4">
            {(isVi
              ? [
                  { icon: '🛒', title: 'Phân khúc khách hàng', desc: 'Nhóm khách hàng theo hành vi mua sắm để tối ưu Marketing.' },
                  { icon: '📄', title: 'Phân loại văn bản', desc: 'Gom cụm bài báo, tin tức theo chủ đề tương đồng.' },
                  { icon: '🖼️', title: 'Nén hình ảnh', desc: 'Giảm số màu pixel bằng cách gom cụm màu tương đồng.' },
                ]
              : [
                  { icon: '🛒', title: 'Customer Segmentation', desc: 'Group customers by behavior to optimize marketing.' },
                  { icon: '📄', title: 'Document Clustering', desc: 'Cluster articles and news by similar themes.' },
                  { icon: '🖼️', title: 'Image Quantization', desc: 'Reduce image colors by clustering similar pixel colors.' },
                ]
            ).map(app => (
              <div key={app.title} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="text-3xl mb-3">{app.icon}</div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">{app.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{app.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 8. Python Code */}
        <Section id="python" title={isVi ? '8. Triển khai Python' : '8. Python Implementation'} icon="🐍">
          <p className="mb-4">
            {isVi
              ? 'K-Means rất dễ dùng với scikit-learn. Code dưới đây dùng K-Means++ để khởi tạo thông minh hơn:'
              : 'K-Means is incredibly simple with scikit-learn. Code below uses K-Means++ for smarter initialization:'}
          </p>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-700">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-slate-400 font-mono">kmeans_example.py</span>
            </div>
            <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers customStyle={{ margin: 0, borderRadius: 0 }}>
              {pythonCode}
            </SyntaxHighlighter>
          </div>
        </Section>

        {/* 9. Complexity */}
        <Section id="complexity" title={isVi ? '9. Độ phức tạp' : '9. Complexity Analysis'} icon="📉">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {isVi ? 'Độ phức tạp thời gian' : 'Time Complexity'}
              </p>
              <div className="overflow-x-auto">
                <InlineMath math="O(I \cdot K \cdot n \cdot d)" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {isVi
                  ? 'I = số vòng lặp, K = số cụm, n = số điểm, d = số chiều. Thường hội tụ rất nhanh.'
                  : 'I = iterations, K = clusters, n = data points, d = dimensions. Converges very fast in practice.'}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {isVi ? 'Độ phức tạp không gian' : 'Space Complexity'}
              </p>
              <div className="overflow-x-auto">
                <InlineMath math="O(n \cdot d + K \cdot d)" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {isVi
                  ? 'Cần lưu dữ liệu đầu vào và K vị trí tâm cụm.'
                  : 'Needs to store input data and K centroid positions.'}
              </p>
            </div>
          </div>
        </Section>

        {/* 10. GMM & EM Algorithm */}
        <Section id="gmm-em" title={isVi ? '10. GMM & Thuật toán EM' : '10. Gaussian Mixture Models & EM'} icon="🧠">
          <p>
            {isVi
              ? 'Trong khi K-Means thực hiện gán cứng (hard assignment) mỗi điểm vào duy nhất một cụm, Mô hình Trộn Gaussian (Gaussian Mixture Models - GMM) tiếp cận bằng gán mềm (soft assignment) dựa trên lý thuyết xác suất.'
              : 'While K-Means performs hard assignment of each point to a single cluster, Gaussian Mixture Models (GMM) use soft assignment based on probability theory.'}
          </p>

          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4 my-6 shadow-inner">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {isVi ? 'Mô hình hỗn hợp Gaussian (GMM Formula)' : 'Gaussian Mixture Model (GMM Formula)'}
            </div>
            <BlockMath math="p(x) = \sum_{c=1}^{C} \pi_c \mathcal{N}(x | \mu_c, \Sigma_c)" />
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
              <li><InlineMath math="\pi_c" />: {isVi ? 'Trọng số/tỷ lệ của cụm c (tổng bằng 1).' : 'Mixture weight of cluster c (sums to 1).'}</li>
              <li><InlineMath math="\mu_c" />: {isVi ? 'Tâm kỳ vọng của phân phối Gaussian c.' : 'Mean vector of Gaussian distribution c.'}</li>
              <li><InlineMath math="\Sigma_c" />: {isVi ? 'Ma trận hiệp phương sai (độ rộng và hướng trải).' : 'Covariance matrix (shape and orientation).'}</li>
            </ul>
          </div>

          <p className="text-sm">
            {isVi
              ? 'Để học các tham số của GMM khi nhãn cụm (biến ẩn - latent variables) không được quan sát, ta sử dụng thuật toán EM (Expectation-Maximization) gồm hai bước lặp:'
              : 'To train GMM parameters when cluster labels (latent variables) are unobserved, we use the EM (Expectation-Maximization) algorithm:'}
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2 text-sm">E-step (Expectation)</h4>
              <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-405">
                {isVi
                  ? 'Ước lượng xác suất mỗi điểm dữ liệu thuộc về từng cụm dựa trên các tham số hiện tại (Dự đoán nhãn mềm).'
                  : 'Estimate the posterior probability that each data point belongs to each cluster using current parameters (Soft label prediction).'}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-violet-600 dark:text-violet-400 mb-2 text-sm">M-step (Maximization)</h4>
              <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-405">
                {isVi
                  ? 'Cập nhật các tham số (trung bình, hiệp phương sai, trọng số cụm) để tối đa hóa hàm Likelihood thu được từ E-step.'
                  : 'Update cluster parameters (mean, covariance, weight) to maximize the likelihood function derived in the E-step.'}
              </p>
            </div>
          </div>
        </Section>

        {/* 11. DBSCAN */}
        <Section id="dbscan" title={isVi ? '11. Thuật toán DBSCAN' : '11. DBSCAN Clustering'} icon="🌐">
          <p>
            {isVi
              ? 'DBSCAN (Density-Based Spatial Clustering of Applications with Noise) là thuật toán phân cụm dựa trên mật độ. Khác với K-Means, DBSCAN không yêu cầu khai báo số cụm K trước và tự động phát hiện nhiễu (outliers).'
              : 'DBSCAN is a density-based clustering algorithm. Unlike K-Means, it does not require specifying K beforehand and automatically detects noise and outliers.'}
          </p>

          <div className="p-5 my-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{isVi ? 'Hai tham số cốt lõi:' : 'Two Core Parameters:'}</h4>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1 ml-2">
              <li><strong>Epsilon (eps)</strong>: {isVi ? 'Bán kính tìm kiếm lân cận quanh một điểm.' : 'Search radius around a point.'}</li>
              <li><strong>MinPts</strong>: {isVi ? 'Số điểm tối thiểu trong bán kính eps để cấu thành một vùng mật độ dày.' : 'Minimum points required within eps to form a dense region.'}</li>
            </ul>
          </div>

          <p className="text-sm">
            {isVi ? 'Thuật toán chia các điểm dữ liệu thành 3 loại:' : 'The algorithm classifies data points into 3 categories:'}
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-center">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase block mb-1">Core Point</span>
              <span className="text-xs text-slate-650 dark:text-slate-405 leading-relaxed">
                {isVi ? 'Có ≥ MinPts điểm trong bán kính eps.' : 'Contains ≥ MinPts points within eps.'}
              </span>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl text-center">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase block mb-1">Border Point</span>
              <span className="text-xs text-slate-650 dark:text-slate-405 leading-relaxed">
                {isVi ? 'Có < MinPts điểm trong eps nhưng nằm gần điểm lõi.' : 'Has < MinPts within eps but lies close to a Core point.'}
              </span>
            </div>
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl text-center">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase block mb-1">Noise Point</span>
              <span className="text-xs text-slate-650 dark:text-slate-405 leading-relaxed">
                {isVi ? 'Điểm nhiễu, không thỏa mãn hai điều kiện trên.' : 'Outliers that do not satisfy core or border criteria.'}
              </span>
            </div>
          </div>
        </Section>

        {/* 12. Evaluation Metrics */}
        <Section id="metrics" title={isVi ? '12. Đánh giá Phân cụm' : '12. Clustering Evaluation Metrics'} icon="📊">
          <p>
            {isVi
              ? 'Phân cụm là học không giám sát, nên việc đánh giá khó khăn hơn phân loại. Ta chia các độ đo (metrics) làm 2 nhóm:'
              : 'Evaluating clustering is challenging since there are no true labels. We divide metrics into two groups:'}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {/* Without Label */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
              <h4 className="font-extrabold text-indigo-650 dark:text-indigo-400 text-base mb-4">
                {isVi ? 'Không có nhãn thực tế' : 'Internal Metrics (No Ground Truth)'}
              </h4>
              <div className="space-y-4 text-xs">
                <div>
                  <strong className="text-slate-900 dark:text-slate-200">Silhouette Score:</strong>
                  <p className="text-slate-500 mt-1">
                    {isVi ? 'Đo mức độ gần gũi nội cụm và tách biệt ngoại cụm. Khoảng [-1, 1], càng gần 1 càng tốt.' : 'Measures cohesion and separation. Range [-1, 1], closer to 1 is better.'}
                  </p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700/50 pt-3">
                  <strong className="text-slate-900 dark:text-slate-200">Davies-Bouldin Index:</strong>
                  <p className="text-slate-500 mt-1">
                    {isVi ? 'Đo lường sai số trung bình giữa các cụm. Càng nhỏ cụm càng tách biệt và gọn.' : 'Measures average similarity between clusters. Smaller index is better.'}
                  </p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700/50 pt-3">
                  <strong className="text-slate-900 dark:text-slate-200">Calinski-Harabasz Index:</strong>
                  <p className="text-slate-500 mt-1">
                    {isVi ? 'Tỷ số giữa độ phân tán giữa các cụm và nội cụm. Giá trị càng lớn càng tốt.' : 'Ratio of between-cluster to within-cluster dispersion. Higher values are better.'}
                  </p>
                </div>
              </div>
            </div>

            {/* With Label */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
              <h4 className="font-extrabold text-violet-650 dark:text-violet-400 text-base mb-4">
                {isVi ? 'Có nhãn thực tế (Ground Truth)' : 'External Metrics (With Ground Truth)'}
              </h4>
              <div className="space-y-4 text-xs">
                <div>
                  <strong className="text-slate-900 dark:text-slate-200">Adjusted Rand Index (ARI):</strong>
                  <p className="text-slate-500 mt-1">
                    {isVi ? 'Đo lường sự tương tự giữa hai cách gán nhãn, điều chỉnh theo yếu tố ngẫu nhiên. Cực đại là 1.0.' : 'Calculates similarity between predicted and true labels, adjusted for chance. Max is 1.0.'}
                  </p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700/50 pt-3">
                  <strong className="text-slate-900 dark:text-slate-200">Fowlkes-Mallows Index (FMI):</strong>
                  <p className="text-slate-500 mt-1">
                    {isVi ? 'Trung bình nhân của Precision và Recall. Giá trị từ 0 đến 1, càng gần 1 càng giống nhãn thật.' : 'Geometric mean of precision and recall. Range [0, 1], closer to 1 is better.'}
                  </p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700/50 pt-3">
                  <strong className="text-slate-900 dark:text-slate-200">Normalized Mutual Information (NMI):</strong>
                  <p className="text-slate-500 mt-1">
                    {isVi ? 'Sử dụng lý thuyết thông tin để so sánh các phân bố nhãn. Giá trị [0, 1], càng cao càng tốt.' : 'Information theoretic measure. Range [0, 1], higher is better.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 13. Pitfalls & Checklist */}
        <Section id="checklist" title={isVi ? '13. Lỗi thường gặp & Checklist' : '13. Pitfalls & Best Practices'} icon="🛡️">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl">
              <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2 text-sm">
                <span>⚠️</span> {isVi ? 'Những sai lầm thường gặp' : 'Common Pitfalls'}
              </h4>
              <ul className="space-y-2 text-xs text-amber-800 dark:text-amber-300 list-disc list-inside">
                <li>{isVi ? 'Không chuẩn hóa dữ liệu khiến các đặc trưng có thang đo lớn áp đảo khoảng cách.' : 'Not standardizing data, allowing features with large scale to dominate distance calculations.'}</li>
                <li>{isVi ? 'Chọn K một cách cảm tính mà không chạy thử Elbow hoặc Silhouette.' : 'Choosing K arbitrarily without checking Elbow or Silhouette curves.'}</li>
                <li>{isVi ? 'Bỏ qua Outliers: Các điểm nhiễu kéo lệch vị trí tâm cụm rất mạnh.' : 'Ignoring outliers: Extreme values drag centroids far from the dense core.'}</li>
                <li>{isVi ? 'Nhầm lẫn Centroid là điểm dữ liệu thực tế. Nó chỉ là trung bình cộng.' : 'Confusing centroids with actual data points. They are coordinate means.'}</li>
              </ul>
            </div>

            <div className="p-5 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 rounded-2xl">
              <h4 className="font-bold text-indigo-700 dark:text-indigo-400 mb-3 flex items-center gap-2 text-sm">
                <span>✓</span> {isVi ? 'Checklist thực hành phân cụm' : 'Practical Checklist'}
              </h4>
              <ul className="space-y-2 text-xs text-indigo-800 dark:text-indigo-300 list-decimal list-inside">
                <li>{isVi ? 'Làm sạch dữ liệu và xử lý khuyết thiếu, nhiễu.' : 'Clean data and handle missing/noisy values.'}</li>
                <li>{isVi ? 'Scale dữ liệu bằng StandardScaler hoặc MinMaxScaler.' : 'Standardize with StandardScaler or MinMaxScaler.'}</li>
                <li>{isVi ? 'Chạy thử K-Means với n_init nhiều lần để tránh khởi tạo xấu.' : 'Run K-Means with multiple n_init trials to avoid local minima.'}</li>
                <li>{isVi ? 'Đánh giá bằng cả công thức định lượng (Silhouette) và hiểu biết nghiệp vụ.' : 'Evaluate using metrics (Silhouette) combined with domain knowledge.'}</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 14. Summary */}
        <Section id="summary" title={isVi ? '14. Tổng kết' : '14. Summary'} icon="🏁">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 shadow-lg shadow-indigo-900/30">
            <div className="absolute -right-4 -bottom-4 text-white/10 text-8xl font-black pointer-events-none select-none">✓</div>
            <p className="relative text-white text-sm leading-relaxed font-medium">
              {isVi
                ? 'K-Means là thuật toán học máy "go-to" đầu tiên khi giải quyết bài toán phân cụm. Mặc dù cần định trước số cụm K và nhạy cảm với Outliers, tốc độ tính toán vượt trội và sự đơn giản giúp K-Means giữ vị thế hàng đầu trong vô vàn ứng dụng phân tích dữ liệu thực tế.'
                : 'K-Means is the go-to algorithm for clustering problems. Despite needing K predefined and being sensitive to outliers, its incredible speed and simplicity keep it at the forefront of numerous real-world data analysis applications.'}
            </p>
          </div>
        </Section>
      </div>

      {/* ─── Table of Contents Sidebar ─── */}
      <div className="hidden lg:block lg:w-1/4">
        <div className="sticky top-24 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4">
            <h3 className="font-bold text-white text-sm">{isVi ? 'Mục lục' : 'On this page'}</h3>
          </div>
          <nav className="flex flex-col p-3 gap-0.5 text-sm">
            {[
              { id: 'intro',        text: isVi ? '1. Giới thiệu'       : '1. Introduction' },
              { id: 'algorithm',    text: isVi ? '2. Thuật toán'        : '2. Algorithm' },
              { id: 'math',         text: isVi ? '3. Cơ sở toán học'    : '3. Math Foundation' },
              { id: 'choosing-k',   text: isVi ? '4. Chọn K tối ưu'    : '4. Choosing K' },
              { id: 'visualization',text: isVi ? '5. Trực quan hoá'     : '5. Visualization' },
              { id: 'pros-cons',    text: isVi ? '6. Ưu / Nhược điểm'  : '6. Pros & Cons' },
              { id: 'applications', text: isVi ? '7. Ứng dụng'          : '7. Applications' },
              { id: 'python',       text: isVi ? '8. Code Python'       : '8. Python Code' },
              { id: 'complexity',   text: isVi ? '9. Độ phức tạp'       : '9. Complexity' },
              { id: 'gmm-em',       text: isVi ? '10. GMM & Thuật toán EM' : '10. GMM & EM Algorithm' },
              { id: 'dbscan',       text: isVi ? '11. Thuật toán DBSCAN' : '11. DBSCAN Algorithm' },
              { id: 'metrics',      text: isVi ? '12. Đánh giá Phân cụm' : '12. Evaluation Metrics' },
              { id: 'checklist',    text: isVi ? '13. Lỗi thường gặp & Checklist' : '13. Pitfalls & Checklist' },
              { id: 'summary',      text: isVi ? '14. Tổng kết'         : '14. Summary' },
            ].map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-xs font-medium"
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
