import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsDark } from '../../hooks/useIsDark';
import { Play, RotateCcw } from 'lucide-react';

interface Dot {
  x: number;
  y: number;
  value: number;
  selected: boolean;
  animating: boolean;
  scale: number;
}

export default function SimpleRandomVisualizer() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const isDark = useIsDark();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [sampleSize, setSampleSize] = useState(15);
  const [dots, setDots] = useState<Dot[]>([]);
  const [sampling, setSampling] = useState(false);
  const [popMean, setPopMean] = useState(0);
  const [sampleMean, setSampleMean] = useState<number | null>(null);

  const popSize = 80;

  // Initialize population dots
  const initPopulation = () => {
    const canvas = canvasRef.current;
    const width = canvas?.offsetWidth || 600;
    const height = canvas?.offsetHeight || 300;

    const newDots: Dot[] = [];
    let sumVal = 0;
    for (let i = 0; i < popSize; i++) {
      // Random coordinates inside canvas padding
      const x = Math.random() * (width - 40) + 20;
      const y = Math.random() * (height - 40) + 20;
      const value = Math.floor(Math.random() * 90) + 10; // value between 10 and 100
      sumVal += value;

      newDots.push({
        x,
        y,
        value,
        selected: false,
        animating: false,
        scale: 1,
      });
    }
    setDots(newDots);
    setPopMean(sumVal / popSize);
    setSampleMean(null);
    setSampling(false);
  };

  useEffect(() => {
    initPopulation();
    // Handle resize
    const handleResize = () => {
      initPopulation();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Run sampling simulation
  const runSampling = async () => {
    if (sampling) return;
    setSampling(true);

    // Reset current selections
    const resetDots = dots.map(d => ({ ...d, selected: false, animating: false, scale: 1 }));
    setDots(resetDots);
    setSampleMean(null);

    // Draw frame-by-frame selection
    const chosenIndices: number[] = [];
    while (chosenIndices.length < sampleSize) {
      const idx = Math.floor(Math.random() * popSize);
      if (!chosenIndices.includes(idx)) {
        chosenIndices.push(idx);
      }
    }

    // Animate selection one-by-one with a delay
    for (let step = 0; step < chosenIndices.length; step++) {
      await new Promise(r => setTimeout(r, 120));
      const targetIdx = chosenIndices[step];

      setDots(prev => {
        const next = [...prev];
        next[targetIdx] = {
          ...next[targetIdx],
          selected: true,
          animating: true,
          scale: 1.5,
        };
        return next;
      });

      // Reset animation state shortly after
      setTimeout(() => {
        setDots(prev => {
          const next = [...prev];
          if (next[targetIdx]) {
            next[targetIdx] = {
              ...next[targetIdx],
              animating: false,
              scale: 1.25,
            };
          }
          return next;
        });
      }, 200);
    }

    // Compute sample mean
    let sampleSum = 0;
    chosenIndices.forEach(idx => {
      sampleSum += dots[idx].value;
    });
    setSampleMean(sampleSum / sampleSize);
    setSampling(false);
  };

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set correct dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Grid dots background
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)';
    for (let x = 15; x < W; x += 25) {
      for (let y = 15; y < H; y += 25) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    // Draw connections or glow for selected items
    dots.forEach(d => {
      if (d.selected) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 14 * d.scale, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(226, 255, 59, 0.15)' : 'rgba(132, 204, 22, 0.15)';
        ctx.fill();
        ctx.strokeStyle = isDark ? 'rgba(226, 255, 59, 0.4)' : 'rgba(132, 204, 22, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Draw the population dots
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, 6 * (d.selected ? d.scale : 1), 0, Math.PI * 2);

      if (d.selected) {
        ctx.fillStyle = isDark ? '#e2ff3b' : '#84cc16'; // Lime/Yellow accent
      } else {
        ctx.fillStyle = isDark ? '#334155' : '#cbd5e1'; // Dark slate/light grey
      }
      ctx.fill();

      // Border for selection
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
              {isVi ? 'Thông số lấy mẫu' : 'Sampling Parameters'}
            </h4>
            <p className="text-xs text-neutral-500">
              {isVi ? 'Tinh chỉnh số lượng mẫu để mô phỏng chọn ngẫu nhiên.' : 'Adjust sample size to simulate random picking.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
              <span>{isVi ? 'Kích thước mẫu (n)' : 'Sample Size (n)'}</span>
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
              {isVi ? 'Lấy mẫu' : 'Sample'}
            </button>
            <button
              onClick={initPopulation}
              disabled={sampling}
              className="py-2.5 px-3 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors flex items-center justify-center"
              title="Reset population"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 mt-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="bg-neutral-100 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200/50 dark:border-neutral-800/50">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                Population Mean (μ)
              </span>
              <span className="text-base font-extrabold block text-neutral-800 dark:text-white mt-0.5">
                {popMean.toFixed(2)}
              </span>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200/50 dark:border-neutral-800/50">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                Sample Mean (x̄)
              </span>
              <span className={`text-base font-extrabold block mt-0.5 ${sampleMean !== null ? 'text-lime-600 dark:text-lime-400' : 'text-neutral-400 dark:text-neutral-600'}`}>
                {sampleMean !== null ? sampleMean.toFixed(2) : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Visualizer Column */}
        <div className="lg:col-span-2 relative bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-900 flex flex-col" style={{ minHeight: 280 }}>
          <canvas ref={canvasRef} className="w-full flex-1 block" />
          <div className="absolute bottom-2.5 right-2.5 bg-neutral-200/60 dark:bg-black/60 backdrop-blur text-[10px] text-neutral-600 dark:text-neutral-450 px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-800 pointer-events-none">
            {isVi ? 'Hạt vàng: Được chọn | Hạt xám: Quần thể' : 'Yellow: Selected | Slate: Population'}
          </div>
        </div>
      </div>
    </div>
  );
}
