import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsDark } from '../../hooks/useIsDark';
import { Play, RotateCcw } from 'lucide-react';

interface StratifiedDot {
  x: number;
  y: number;
  stratum: 'A' | 'B' | 'C';
  selected: boolean;
  scale: number;
}

export default function StratifiedVisualizer() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const isDark = useIsDark();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [sampleSize, setSampleSize] = useState(20);
  const [dots, setDots] = useState<StratifiedDot[]>([]);
  const [sampling, setSampling] = useState(false);

  // Strata size proportions
  // A: 30%, B: 50%, C: 20%
  const sizeA = 24; // 30% of 80
  const sizeB = 40; // 50% of 80
  const sizeC = 16; // 20% of 80

  // Calculate proportional sample sizes
  const nA = Math.round(sampleSize * 0.3);
  const nC = Math.round(sampleSize * 0.2);
  const nB = sampleSize - nA - nC; // Adjust remainder to B to keep exact sum

  const initPopulation = () => {
    const canvas = canvasRef.current;
    const W = canvas?.offsetWidth || 600;
    const H = canvas?.offsetHeight || 300;

    const newDots: StratifiedDot[] = [];

    // Strata boundary y-coordinates
    const hA = H * 0.3;
    const hB = H * 0.8;

    // Generate Stratum A dots (top 30%)
    for (let i = 0; i < sizeA; i++) {
      newDots.push({
        x: Math.random() * (W - 40) + 20,
        y: Math.random() * (hA - 30) + 15,
        stratum: 'A',
        selected: false,
        scale: 1,
      });
    }

    // Generate Stratum B dots (middle 50%)
    for (let i = 0; i < sizeB; i++) {
      newDots.push({
        x: Math.random() * (W - 40) + 20,
        y: Math.random() * (hB - hA - 30) + hA + 15,
        stratum: 'B',
        selected: false,
        scale: 1,
      });
    }

    // Generate Stratum C dots (bottom 20%)
    for (let i = 0; i < sizeC; i++) {
      newDots.push({
        x: Math.random() * (W - 40) + 20,
        y: Math.random() * (H - hB - 30) + hB + 15,
        stratum: 'C',
        selected: false,
        scale: 1,
      });
    }

    setDots(newDots);
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
    setDots(prev => prev.map(d => ({ ...d, selected: false, scale: 1 })));

    // Choose indices for each stratum
    const getChosenIndices = (stratum: 'A' | 'B' | 'C', count: number) => {
      const indices: number[] = [];
      const stratumIndices = dots
        .map((d, idx) => (d.stratum === stratum ? idx : -1))
        .filter(idx => idx !== -1);

      while (indices.length < count && indices.length < stratumIndices.length) {
        const randIdx = stratumIndices[Math.floor(Math.random() * stratumIndices.length)];
        if (!indices.includes(randIdx)) {
          indices.push(randIdx);
        }
      }
      return indices;
    };

    const chosenA = getChosenIndices('A', nA);
    const chosenB = getChosenIndices('B', nB);
    const chosenC = getChosenIndices('C', nC);

    const allChosen = [...chosenA, ...chosenB, ...chosenC];

    // Animate selection step-by-step
    for (let step = 0; step < allChosen.length; step++) {
      await new Promise(r => setTimeout(r, 80));
      const targetIdx = allChosen[step];

      setDots(prev => {
        const next = [...prev];
        next[targetIdx] = {
          ...next[targetIdx],
          selected: true,
          scale: 1.4,
        };
        return next;
      });

      setTimeout(() => {
        setDots(prev => {
          const next = [...prev];
          if (next[targetIdx]) {
            next[targetIdx].scale = 1.25;
          }
          return next;
        });
      }, 150);
    }

    setSampling(false);
  };

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const W = canvas.width;
    const H = canvas.height;

    const hA = H * 0.3;
    const hB = H * 0.8;

    ctx.clearRect(0, 0, W, H);

    // Draw Strata Background Separators
    // Stratum A background
    ctx.fillStyle = isDark ? 'rgba(239, 68, 68, 0.02)' : 'rgba(239, 68, 68, 0.01)';
    ctx.fillRect(0, 0, W, hA);

    // Stratum B background
    ctx.fillStyle = isDark ? 'rgba(59, 130, 246, 0.02)' : 'rgba(59, 130, 246, 0.01)';
    ctx.fillRect(0, hA, W, hB - hA);

    // Stratum C background
    ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.02)' : 'rgba(16, 185, 129, 0.01)';
    ctx.fillRect(0, hB, W, H - hB);

    // Draw stratum lines
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, hA);
    ctx.lineTo(W, hA);
    ctx.moveTo(0, hB);
    ctx.lineTo(W, hB);
    ctx.stroke();

    // Draw text labels for Strata boundaries
    ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText('Stratum A (N_A = 24, 30%)', 10, 20);
    ctx.fillText('Stratum B (N_B = 40, 50%)', 10, hA + 20);
    ctx.fillText('Stratum C (N_C = 16, 20%)', 10, hB + 20);

    // Draw selection outer ring
    dots.forEach(d => {
      if (d.selected) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 14 * d.scale, 0, Math.PI * 2);
        ctx.fillStyle = d.stratum === 'A' ? 'rgba(239, 68, 68, 0.15)' :
                        d.stratum === 'B' ? 'rgba(59, 130, 246, 0.15)' :
                                            'rgba(16, 185, 129, 0.15)';
        ctx.fill();
        ctx.strokeStyle = d.stratum === 'A' ? 'rgba(239, 68, 68, 0.4)' :
                          d.stratum === 'B' ? 'rgba(59, 130, 246, 0.4)' :
                                              'rgba(16, 185, 129, 0.4)';
        ctx.stroke();
      }
    });

    // Draw Dots
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, 5 * (d.selected ? d.scale : 1), 0, Math.PI * 2);

      if (d.selected) {
        ctx.fillStyle = d.stratum === 'A' ? '#f87171' : // Soft Red
                        d.stratum === 'B' ? '#60a5fa' : // Soft Blue
                                            '#34d399';  // Soft Green
      } else {
        ctx.fillStyle = d.stratum === 'A' ? 'rgba(239, 68, 68, 0.35)' :
                        d.stratum === 'B' ? 'rgba(59, 130, 246, 0.35)' :
                                            'rgba(16, 185, 129, 0.35)';
      }

      ctx.fill();

      if (d.selected) {
        ctx.strokeStyle = isDark ? '#000000' : '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  }, [dots, isDark]);

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/60 p-5 md:p-6 overflow-hidden my-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-base font-extrabold text-neutral-800 dark:text-neutral-200 mb-1">
              {isVi ? 'Phân bổ tỷ lệ lớp' : 'Proportional Allocation'}
            </h4>
            <p className="text-xs text-neutral-500">
              {isVi ? 'Mẫu được chọn tỉ lệ thuận với kích cỡ mỗi nhóm.' : 'Samples are picked proportionally based on stratum sizes.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
              <span>{isVi ? 'Tổng số mẫu (n)' : 'Total Sample Size (n)'}</span>
              <span className="text-lime-600 dark:text-lime-400 font-mono">{sampleSize}</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={sampleSize}
              onChange={e => setSampleSize(Number(e.target.value))}
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
              {isVi ? 'Lấy mẫu lớp' : 'Sample Strata'}
            </button>
            <button
              onClick={initPopulation}
              disabled={sampling}
              className="py-2.5 px-3 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors flex items-center justify-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 mt-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-red-500/10 rounded-xl p-2.5 border border-red-500/20 text-center">
                <span className="text-[9px] font-bold text-red-500 uppercase block">Stratum A (30%)</span>
                <span className="text-sm font-extrabold text-neutral-800 dark:text-white block mt-0.5">n_A = {nA}</span>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-2.5 border border-blue-500/20 text-center">
                <span className="text-[9px] font-bold text-blue-500 uppercase block">Stratum B (50%)</span>
                <span className="text-sm font-extrabold text-neutral-800 dark:text-white block mt-0.5">n_B = {nB}</span>
              </div>
              <div className="bg-emerald-500/10 rounded-xl p-2.5 border border-emerald-500/20 text-center">
                <span className="text-[9px] font-bold text-emerald-500 uppercase block">Stratum C (20%)</span>
                <span className="text-sm font-extrabold text-neutral-800 dark:text-white block mt-0.5">n_C = {nC}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer Column */}
        <div className="lg:col-span-2 relative bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-900 flex flex-col" style={{ minHeight: 280 }}>
          <canvas ref={canvasRef} className="w-full flex-1 block" />
          <div className="absolute bottom-2.5 right-2.5 bg-neutral-200/60 dark:bg-black/60 backdrop-blur text-[10px] text-neutral-600 dark:text-neutral-450 px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-800 pointer-events-none">
            {isVi ? 'Độ đậm: Được chọn từ lớp tương ứng' : 'Solid colors: Represent items selected from each stratum'}
          </div>
        </div>
      </div>
    </div>
  );
}
