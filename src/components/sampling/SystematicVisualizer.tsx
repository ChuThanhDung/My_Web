import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsDark } from '../../hooks/useIsDark';
import { Play, RotateCcw } from 'lucide-react';

interface OrderedDot {
  index: number;
  selected: boolean;
  isStart: boolean;
  scale: number;
}

export default function SystematicVisualizer() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const isDark = useIsDark();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [sampleSize, setSampleSize] = useState(10);
  const [dots, setDots] = useState<OrderedDot[]>([]);
  const [sampling, setSampling] = useState(false);
  const [randomStart, setRandomStart] = useState<number | null>(null);

  const N = 60;
  const k = Math.floor(N / sampleSize);

  const initPopulation = () => {
    const newDots: OrderedDot[] = [];
    for (let i = 0; i < N; i++) {
      newDots.push({
        index: i,
        selected: false,
        isStart: false,
        scale: 1,
      });
    }
    setDots(newDots);
    setRandomStart(null);
    setSampling(false);
  };

  useEffect(() => {
    initPopulation();
  }, []);

  const runSampling = async () => {
    if (sampling) return;
    setSampling(true);

    // Reset
    setDots(prev => prev.map(d => ({ ...d, selected: false, isStart: false, scale: 1 })));

    // Choose random start r in [0, k-1] (0-indexed)
    const r = Math.floor(Math.random() * k);
    setRandomStart(r);

    // Calculate chosen indices: r, r+k, r+2k, ...
    const chosenIndices: number[] = [];
    for (let i = 0; i < sampleSize; i++) {
      const idx = r + i * k;
      if (idx < N) {
        chosenIndices.push(idx);
      }
    }

    // Step-by-step animation
    for (let step = 0; step < chosenIndices.length; step++) {
      await new Promise(r => setTimeout(r, 180));
      const targetIdx = chosenIndices[step];

      setDots(prev => {
        const next = [...prev];
        if (next[targetIdx]) {
          next[targetIdx] = {
            ...next[targetIdx],
            selected: true,
            isStart: step === 0,
            scale: 1.4,
          };
        }
        return next;
      });

      setTimeout(() => {
        setDots(prev => {
          const next = [...prev];
          if (next[targetIdx]) {
            next[targetIdx].scale = 1.2;
          }
          return next;
        });
      }, 150);
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

    // Draw grid of dots (e.g. 5 rows, 12 cols = 60 dots)
    const rows = 5;
    const cols = 12;

    const xPadding = 30;
    const yPadding = 30;

    const colWidth = (W - xPadding * 2) / (cols - 1 || 1);
    const rowHeight = (H - yPadding * 2) / (rows - 1 || 1);

    dots.forEach((d, i) => {
      const colIdx = i % cols;
      const rowIdx = Math.floor(i / cols);

      const cx = xPadding + colIdx * colWidth;
      const cy = yPadding + rowIdx * rowHeight;

      // Draw connection lines between consecutive chosen ones
      if (d.selected && i > 0) {
        // Find previous selected index
        const prevIdx = i - k;
        if (prevIdx >= 0 && dots[prevIdx].selected) {
          const prevCol = prevIdx % cols;
          const prevRow = Math.floor(prevIdx / cols);
          const px = xPadding + prevCol * colWidth;
          const py = yPadding + prevRow * rowHeight;

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(cx, cy);
          ctx.strokeStyle = isDark ? 'rgba(226, 255, 59, 0.4)' : 'rgba(132, 204, 22, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Draw dot glow
      if (d.selected) {
        ctx.beginPath();
        ctx.arc(cx, cy, 14 * d.scale, 0, Math.PI * 2);
        ctx.fillStyle = d.isStart 
          ? 'rgba(16, 185, 129, 0.25)' // Emerald for start
          : 'rgba(226, 255, 59, 0.15)'; // Lime/Yellow for step
        ctx.fill();
        ctx.strokeStyle = d.isStart ? '#10b981' : '#e2ff3b';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw the dot itself
      ctx.beginPath();
      ctx.arc(cx, cy, 7 * (d.selected ? d.scale : 1), 0, Math.PI * 2);
      ctx.fillStyle = d.selected
        ? (d.isStart ? '#10b981' : '#e2ff3b')
        : (isDark ? '#334155' : '#cbd5e1');
      ctx.fill();

      // Draw number labels inside or above the dots
      ctx.fillStyle = d.selected 
        ? '#000000' 
        : (isDark ? '#94a3b8' : '#475569');
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((i + 1).toString(), cx, cy);
    });
  }, [dots, isDark, k]);

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/60 p-5 md:p-6 overflow-hidden my-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-base font-extrabold text-neutral-800 dark:text-neutral-200 mb-1">
              {isVi ? 'Thông số hệ thống' : 'Interval Parameters'}
            </h4>
            <p className="text-xs text-neutral-500">
              {isVi ? 'Chọn cỡ mẫu để tính toán chu kỳ bước nhảy k = N / n.' : 'Select sample size to calculate interval k = N / n.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
              <span>{isVi ? 'Kích thước mẫu (n)' : 'Sample Size (n)'}</span>
              <span className="text-lime-600 dark:text-lime-400 font-mono">{sampleSize}</span>
            </div>
            {/* Limit sample size to nice divisors of 60 where possible, or general ranges */}
            <input
              type="range"
              min="3"
              max="20"
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
              {isVi ? 'Chạy Lấy mẫu' : 'Start Systematic'}
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
            <div className="bg-neutral-100 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200/50 dark:border-neutral-800/50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                {isVi ? 'Chu kỳ khoảng cách (k)' : 'Interval Size (k)'}
              </span>
              <span className="text-sm font-extrabold text-neutral-850 dark:text-white font-mono">
                k = {k}
              </span>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200/50 dark:border-neutral-800/50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                {isVi ? 'Bắt đầu ngẫu nhiên (r)' : 'Random Start (r)'}
              </span>
              <span className={`text-sm font-extrabold font-mono ${randomStart !== null ? 'text-emerald-500' : 'text-neutral-400'}`}>
                {randomStart !== null ? `r = ${randomStart + 1}` : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Visualizer Column */}
        <div className="lg:col-span-2 relative bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-900 flex flex-col" style={{ minHeight: 280 }}>
          <canvas ref={canvasRef} className="w-full flex-1 block" />
          <div className="absolute bottom-2.5 right-2.5 bg-neutral-200/60 dark:bg-black/60 backdrop-blur text-[10px] text-neutral-600 dark:text-neutral-450 px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-800 pointer-events-none">
            {isVi ? 'Xanh: Điểm bắt đầu | Vàng: Các khoảng bước k' : 'Green: Start Point (r) | Yellow: Consecutive Steps (+k)'}
          </div>
        </div>
      </div>
    </div>
  );
}
