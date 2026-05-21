import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsDark } from '../../hooks/useIsDark';
import { Play, RotateCcw } from 'lucide-react';

interface Cluster {
  id: number;
  cx: number;
  cy: number;
  radius: number;
  color: string;
  dots: { rx: number; ry: number; selected: boolean }[];
  selected: boolean;
}

export default function ClusterVisualizer() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const isDark = useIsDark();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [clustersToSelect, setClustersToSelect] = useState(2);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [sampling, setSampling] = useState(false);

  const totalClusters = 6;
  const dotsPerCluster = 10;

  const colors = [
    'rgba(239, 68, 68, 0.75)',  // Red
    'rgba(59, 130, 246, 0.75)',  // Blue
    'rgba(16, 185, 129, 0.75)',  // Green
    'rgba(245, 158, 11, 0.75)',  // Orange
    'rgba(168, 85, 247, 0.75)',  // Purple
    'rgba(236, 72, 153, 0.75)',  // Pink
  ];

  const initPopulation = () => {
    const canvas = canvasRef.current;
    const W = canvas?.offsetWidth || 600;
    const H = canvas?.offsetHeight || 300;

    // Define positions for 6 clusters (arranged in 2 rows of 3 columns)
    const positions = [
      { cx: W * 0.20, cy: H * 0.30 },
      { cx: W * 0.50, cy: H * 0.30 },
      { cx: W * 0.80, cy: H * 0.30 },
      { cx: W * 0.20, cy: H * 0.75 },
      { cx: W * 0.50, cy: H * 0.75 },
      { cx: W * 0.80, cy: H * 0.75 },
    ];

    const newClusters: Cluster[] = positions.map((pos, idx) => {
      const radius = 55;
      const dots = [];
      for (let j = 0; j < dotsPerCluster; j++) {
        // Random polar coords inside the cluster radius
        const r = Math.random() * (radius - 16) + 4;
        const theta = Math.random() * Math.PI * 2;
        dots.push({
          rx: Math.cos(theta) * r,
          ry: Math.sin(theta) * r,
          selected: false,
        });
      }

      return {
        id: idx + 1,
        cx: pos.cx,
        cy: pos.cy,
        radius,
        color: colors[idx % colors.length],
        dots,
        selected: false,
      };
    });

    setClusters(newClusters);
    setSampling(false);
  };

  useEffect(() => {
    initPopulation();
    const handleResize = () => initPopulation();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const runSampling = async () => {
    if (sampling) return;
    setSampling(true);

    // Reset current selections
    setClusters(prev =>
      prev.map(c => ({
        ...c,
        selected: false,
        dots: c.dots.map(d => ({ ...d, selected: false })),
      }))
    );

    // Randomly select 'clustersToSelect' cluster IDs
    const chosenIds: number[] = [];
    while (chosenIds.length < clustersToSelect) {
      const id = Math.floor(Math.random() * totalClusters) + 1;
      if (!chosenIds.includes(id)) {
        chosenIds.push(id);
      }
    }

    // Step-by-step select whole clusters
    for (let step = 0; step < chosenIds.length; step++) {
      await new Promise(r => setTimeout(r, 400));
      const targetId = chosenIds[step];

      setClusters(prev =>
        prev.map(c => {
          if (c.id === targetId) {
            return {
              ...c,
              selected: true,
              dots: c.dots.map(d => ({ ...d, selected: true })),
            };
          }
          return c;
        })
      );
    }

    setSampling(false);
  };

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    clusters.forEach(c => {
      // Draw cluster boundary circle
      ctx.beginPath();
      ctx.arc(c.cx, c.cy, c.radius, 0, Math.PI * 2);

      if (c.selected) {
        ctx.strokeStyle = isDark ? '#e2ff3b' : '#10b981';
        ctx.lineWidth = 2.5;
        // Glow effect
        ctx.shadowBlur = 12;
        ctx.shadowColor = isDark ? 'rgba(226, 255, 59, 0.4)' : 'rgba(16, 185, 129, 0.4)';
      } else {
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
      }

      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0; // reset shadow

      // Draw cluster label
      ctx.fillStyle = c.selected 
        ? (isDark ? '#e2ff3b' : '#10b981') 
        : (isDark ? '#475569' : '#94a3b8');
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Cluster ${c.id}`, c.cx, c.cy - c.radius - 8);

      // Draw dots in this cluster
      c.dots.forEach(d => {
        const dx = c.cx + d.rx;
        const dy = c.cy + d.ry;

        // Selection ring
        if (d.selected) {
          ctx.beginPath();
          ctx.arc(dx, dy, 9, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(226, 255, 59, 0.15)' : 'rgba(16, 185, 129, 0.15)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = d.selected 
          ? (isDark ? '#e2ff3b' : '#10b981') 
          : c.color;
        ctx.fill();

        if (d.selected) {
          ctx.strokeStyle = isDark ? '#000000' : '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });
  }, [clusters, isDark]);

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/60 p-5 md:p-6 overflow-hidden my-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-base font-extrabold text-neutral-800 dark:text-neutral-200 mb-1">
              {isVi ? 'Lấy mẫu cụm' : 'Cluster Selection'}
            </h4>
            <p className="text-xs text-neutral-500">
              {isVi ? 'Chọn số lượng cụm (nhóm) để lấy toàn bộ thành viên.' : 'Select how many cluster groups to completely sample.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
              <span>{isVi ? 'Số lượng cụm chọn (m)' : 'Clusters to Sample (m)'}</span>
              <span className="text-lime-600 dark:text-lime-400 font-mono">{clustersToSelect} / 6</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              value={clustersToSelect}
              onChange={e => setClustersToSelect(Number(e.target.value))}
              disabled={sampling}
              className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-lime-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={runSampling}
              disabled={sampling}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl border border-emerald-500 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isVi ? 'Chọn cụm ngẫu nhiên' : 'Select Clusters'}
            </button>
            <button
              onClick={initPopulation}
              disabled={sampling}
              className="py-2.5 px-3 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors flex items-center justify-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 mt-2 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 leading-relaxed">
            <p>
              {isVi 
                ? 'Trong lấy mẫu cụm, quần thể được chia thành các cụm tự nhiên. Chúng ta chỉ chọn ngẫu nhiên một số cụm và lấy TOÀN BỘ cá thể trong các cụm đó.' 
                : 'In cluster sampling, the population is divided into natural clusters. We only select a few clusters randomly and survey ALL individuals within those chosen clusters.'}
            </p>
          </div>
        </div>

        {/* Visualizer Column */}
        <div className="lg:col-span-2 relative bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-900 flex flex-col" style={{ minHeight: 280 }}>
          <canvas ref={canvasRef} className="w-full flex-1 block" />
          <div className="absolute bottom-2.5 right-2.5 bg-neutral-200/60 dark:bg-black/60 backdrop-blur text-[10px] text-neutral-600 dark:text-neutral-450 px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-800 pointer-events-none">
            {isVi ? 'Đường viền vàng nét liền: Cụm được chọn' : 'Solid green/yellow border: Selected Cluster groups'}
          </div>
        </div>
      </div>
    </div>
  );
}
