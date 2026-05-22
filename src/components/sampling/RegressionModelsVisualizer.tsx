import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsDark } from '../../hooks/useIsDark';
import { RotateCcw, Trash2, HelpCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Point {
  x: number; // 0 to 100
  y: number; // 0 to 100
  classVal: number; // 0 if y < 50 else 1
}

const PRESET_POINTS: Point[] = [
  { x: 15, y: 20, classVal: 0 },
  { x: 25, y: 35, classVal: 0 },
  { x: 35, y: 30, classVal: 0 },
  { x: 45, y: 55, classVal: 1 },
  { x: 55, y: 45, classVal: 0 },
  { x: 65, y: 75, classVal: 1 },
  { x: 75, y: 70, classVal: 1 },
  { x: 85, y: 90, classVal: 1 }
];

export default function RegressionModelsVisualizer() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const isDark = useIsDark();

  const [points, setPoints] = useState<Point[]>(PRESET_POINTS);
  const [mode, setMode] = useState<'linear' | 'logistic'>('linear');

  // Chart coordinate mapping helpers
  const toScreenX = (x: number) => 50 + (x / 100) * 500; // map 0-100 to 50-550
  const toScreenY = (y: number) => 250 - (y / 100) * 200; // map 0-100 to 250-50 (flip Y)
  const fromScreenX = (sx: number) => ((sx - 50) / 500) * 100;
  const fromScreenY = (sy: number) => ((250 - sy) / 200) * 100;

  // Handle SVG click to add or remove points
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    // Map screen click coordinates to the viewBox coordinates (0 to 600 width, 0 to 300 height)
    const svgX = (screenX / rect.width) * 600;
    const svgY = (screenY / rect.height) * 300;

    // Check if clicked near an existing point to delete it
    let clickedIndex = -1;
    const threshold = 12; // distance threshold in SVG pixels

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const px = toScreenX(p.x);
      // In logistic mode, points slide to class-based limits
      const py = mode === 'logistic' ? toScreenY(p.classVal * 100) : toScreenY(p.y);

      const dist = Math.sqrt(Math.pow(svgX - px, 2) + Math.pow(svgY - py, 2));
      if (dist < threshold) {
        clickedIndex = i;
        break;
      }
    }

    if (clickedIndex !== -1) {
      // Remove point
      setPoints(prev => prev.filter((_, idx) => idx !== clickedIndex));
    } else {
      // Add point if click is within chart bounds (x: 50-550, y: 50-250)
      if (svgX >= 50 && svgX <= 550 && svgY >= 50 && svgY <= 250) {
        const xVal = fromScreenX(svgX);
        const yVal = fromScreenY(svgY);
        const classVal = yVal >= 50 ? 1 : 0;
        setPoints(prev => [...prev, { x: xVal, y: yVal, classVal }]);
      }
    }
  };

  // Ordinary Least Squares Linear Regression Fit
  const linearFit = useMemo(() => {
    if (points.length < 2) {
      return { beta0: 0, beta1: 0, r2: 0, mse: 0, valid: false };
    }

    const n = points.length;
    let sumX = 0;
    let sumY = 0;
    for (let i = 0; i < n; i++) {
      sumX += points[i].x;
      sumY += points[i].y;
    }
    const meanX = sumX / n;
    const meanY = sumY / n;

    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      const dx = points[i].x - meanX;
      const dy = points[i].y - meanY;
      num += dx * dy;
      den += dx * dx;
    }

    const beta1 = den === 0 ? 0 : num / den;
    const beta0 = meanY - beta1 * meanX;

    // Goodness of fit (R-squared & MSE)
    let ssTot = 0;
    let ssRes = 0;
    for (let i = 0; i < n; i++) {
      const yPred = beta0 + beta1 * points[i].x;
      ssTot += Math.pow(points[i].y - meanY, 2);
      ssRes += Math.pow(points[i].y - yPred, 2);
    }

    const mse = ssRes / n;
    const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

    return { beta0, beta1, r2, mse, valid: true };
  }, [points]);

  // Logistic Regression Fit using Gradient Descent with Momentum
  const logisticFit = useMemo(() => {
    if (points.length < 2) {
      return { beta0: 0, beta1: 0, accuracy: 0, decisionBoundary: null, valid: false };
    }

    const n = points.length;
    let b0 = 0;
    let b1 = 0;
    let v0 = 0;
    let v1 = 0;
    const lr = 2.0; // Optimized learning rate
    const momentum = 0.9;
    const iterations = 1000;

    // Run Gradient Descent
    for (let iter = 0; iter < iterations; iter++) {
      let db0 = 0;
      let db1 = 0;
      for (let i = 0; i < n; i++) {
        const xi = points[i].x / 100; // scale x to [0, 1] for numerical stability
        const yi = points[i].classVal;
        const z = b0 + b1 * xi;
        const pi = 1 / (1 + Math.exp(-z));
        const err = pi - yi;
        db0 += err;
        db1 += err * xi;
      }
      db0 /= n;
      db1 /= n;

      v0 = momentum * v0 - lr * db0;
      v1 = momentum * v1 - lr * db1;
      b0 += v0;
      b1 += v1;

      // Prevent overflow/extravagant curves by clipping
      b0 = Math.max(-25, Math.min(25, b0));
      b1 = Math.max(-25, Math.min(25, b1));
    }

    // Evaluate accuracy
    let correct = 0;
    for (let i = 0; i < n; i++) {
      const xi = points[i].x / 100;
      const z = b0 + b1 * xi;
      const pi = 1 / (1 + Math.exp(-z));
      const predClass = pi >= 0.5 ? 1 : 0;
      if (predClass === points[i].classVal) {
        correct++;
      }
    }
    const accuracy = correct / n;

    // Decision Boundary: p(x) = 0.5 => b0 + b1*(x/100) = 0 => x = -b0/b1 * 100
    let decisionBoundary: number | null = null;
    if (Math.abs(b1) > 0.001) {
      const xBound = (-b0 / b1) * 100;
      if (xBound >= 0 && xBound <= 100) {
        decisionBoundary = xBound;
      }
    }

    return { beta0: b0, beta1: b1, accuracy, decisionBoundary, valid: true };
  }, [points]);

  // Compute points for regression line / curve
  const fittedPath = useMemo(() => {
    if (points.length < 2) return '';

    if (mode === 'linear') {
      const { beta0, beta1 } = linearFit;
      const y0 = beta0;
      const y100 = beta0 + beta1 * 100;
      return `M ${toScreenX(0)} ${toScreenY(y0)} L ${toScreenX(100)} ${toScreenY(y100)}`;
    } else {
      const { beta0, beta1 } = logisticFit;
      const steps = 100;
      const pathPoints: string[] = [];
      for (let i = 0; i <= steps; i++) {
        const xVal = (i / steps) * 100;
        const xPrime = xVal / 100;
        const z = beta0 + beta1 * xPrime;
        const p = 1 / (1 + Math.exp(-z));
        pathPoints.push(`${i === 0 ? 'M' : 'L'} ${toScreenX(xVal).toFixed(1)} ${toScreenY(p * 100).toFixed(1)}`);
      }
      return pathPoints.join(' ');
    }
  }, [points, mode, linearFit, logisticFit]);

  const clearAll = () => setPoints([]);
  const resetPreset = () => setPoints(PRESET_POINTS);

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/60 p-5 md:p-6 overflow-hidden my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls and Fit Diagnostics (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div>
            <h4 className="text-base font-extrabold text-neutral-800 dark:text-neutral-200 mb-1">
              {isVi ? 'Mô hình Hồi quy' : 'Regression Model'}
            </h4>
            <p className="text-xs text-neutral-500">
              {isVi ? 'Chọn mô hình và thêm các điểm để xem cập nhật trực quan.' : 'Select model type and click graph to place/remove dots.'}
            </p>
          </div>

          {/* Model Switcher */}
          <div className="flex p-1 bg-neutral-200/60 dark:bg-neutral-900 rounded-xl border border-neutral-300 dark:border-neutral-800">
            <button
              onClick={() => setMode('linear')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-black transition-all ${
                mode === 'linear'
                  ? 'bg-white dark:bg-black text-rose-500 shadow-sm border border-neutral-200 dark:border-neutral-800'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {isVi ? 'Tuyến tính (Linear)' : 'Linear'}
            </button>
            <button
              onClick={() => setMode('logistic')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-black transition-all ${
                mode === 'logistic'
                  ? 'bg-white dark:bg-black text-rose-500 shadow-sm border border-neutral-200 dark:border-neutral-800'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {isVi ? 'Logistic' : 'Logistic'}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              onClick={resetPreset}
              className="flex-1 py-2 px-3 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isVi ? 'Đặt lại mẫu' : 'Load Preset'}
            </button>
            <button
              onClick={clearAll}
              className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isVi ? 'Xóa hết' : 'Clear All'}
            </button>
          </div>

          {/* Real-time Equations and Fit Scores */}
          <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            {points.length < 2 ? (
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 flex items-start gap-2 text-amber-600 dark:text-amber-400">
                <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] font-semibold leading-relaxed">
                  {isVi
                    ? 'Vui lòng nhấn chuột lên biểu đồ để thêm ít nhất 2 điểm dữ liệu khác nhau.'
                    : 'Please click on the canvas to add at least 2 distinct data points to fit the model.'}
                </p>
              </div>
            ) : mode === 'linear' ? (
              <>
                <div className="bg-neutral-100 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200/50 dark:border-neutral-800/50">
                  <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    {isVi ? 'Phương trình Tuyến tính' : 'Linear Regression Equation'}
                  </span>
                  <span className="text-xs font-mono font-black text-rose-600 dark:text-rose-400 block mt-1">
                    {`y = ${linearFit.beta0.toFixed(2)} ${
                      linearFit.beta1 >= 0 ? '+' : '-'
                    } ${Math.abs(linearFit.beta1).toFixed(2)}x`}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-neutral-100 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200/50 dark:border-neutral-800/50">
                    <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                      R-squared (R²)
                    </span>
                    <span className="text-sm font-extrabold text-neutral-850 dark:text-white block mt-0.5">
                      {linearFit.r2.toFixed(4)}
                    </span>
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200/50 dark:border-neutral-800/50">
                    <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                      MSE (Error)
                    </span>
                    <span className="text-sm font-extrabold text-neutral-850 dark:text-white block mt-0.5">
                      {linearFit.mse.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-neutral-100 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200/50 dark:border-neutral-800/50">
                  <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    {isVi ? 'Mô hình xác suất Sigmoid (x ∈ [0, 100])' : 'Sigmoid Probability Model (x ∈ [0, 100])'}
                  </span>
                  <span className="text-[10px] font-mono font-black text-rose-650 dark:text-rose-450 block mt-1 break-all">
                    {`p(x) = 1 / (1 + e^-(${logisticFit.beta0.toFixed(2)} ${
                      logisticFit.beta1 >= 0 ? '+' : '-'
                    } ${(Math.abs(logisticFit.beta1) / 100).toFixed(4)}x))`}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-neutral-100 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200/50 dark:border-neutral-800/50">
                    <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                      {isVi ? 'Độ chính xác (Acc)' : 'Accuracy'}
                    </span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-450 block mt-0.5">
                      {(logisticFit.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200/50 dark:border-neutral-800/50">
                    <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                      {isVi ? 'Điểm cắt (Boundary)' : 'Decision Boundary'}
                    </span>
                    <span className="text-sm font-extrabold text-neutral-850 dark:text-white block mt-0.5">
                      {logisticFit.decisionBoundary !== null
                        ? `x = ${logisticFit.decisionBoundary.toFixed(1)}`
                        : '--'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Scatter Plot Visualizer (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-900 p-2 flex flex-col h-[320px] justify-center items-center overflow-hidden">
            
            {/* SVG Plot */}
            <svg
              viewBox="0 0 600 300"
              className="w-full h-full cursor-crosshair select-none"
              onClick={handleSvgClick}
            >
              <defs>
                <clipPath id="chart-clip">
                  <rect x="50" y="50" width="500" height="200" />
                </clipPath>
              </defs>

              {/* Grid Background lines */}
              <line x1="50" y1="250" x2="550" y2="250" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="1.5" />
              <line x1="50" y1="50" x2="50" y2="250" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="1" />
              <line x1="550" y1="50" x2="550" y2="250" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3,3" />

              {/* Horizontal grid ticks */}
              <line x1="50" y1="150" x2="550" y2="150" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3,3" />
              <line x1="50" y1="50" x2="550" y2="50" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3,3" />

              {/* Vertical grid lines */}
              <line x1="175" y1="50" x2="175" y2="250" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3,3" />
              <line x1="300" y1="50" x2="300" y2="250" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3,3" />
              <line x1="425" y1="50" x2="425" y2="250" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3,3" />

              {/* Axis labels */}
              <text x="45" y="254" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="end">0</text>
              <text x="45" y="154" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="end">
                {mode === 'logistic' ? '0.5' : '50'}
              </text>
              <text x="45" y="54" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="end">
                {mode === 'logistic' ? '1.0' : '100'}
              </text>

              <text x="50" y="270" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="middle">0</text>
              <text x="175" y="270" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="middle">25</text>
              <text x="300" y="270" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="middle">50</text>
              <text x="425" y="270" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="middle">75</text>
              <text x="550" y="270" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="middle">100</text>

              {/* Axis Titles */}
              <text x="300" y="292" fill={isDark ? '#94a3b8' : '#475569'} fontSize="11" fontWeight="bold" textAnchor="middle">
                {isVi ? 'Biến độc lập (X)' : 'Independent Variable (X)'}
              </text>
              <text x="20" y="150" fill={isDark ? '#94a3b8' : '#475569'} fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(-90 20 150)">
                {mode === 'logistic'
                  ? (isVi ? 'Xác suất P(Y=1)' : 'Probability P(Y=1)')
                  : (isVi ? 'Biến liên tục (Y)' : 'Dependent Variable (Y)')}
              </text>

              {/* Fitted Regression Curve/Line */}
              {points.length >= 2 && fittedPath && (
                <path
                  d={fittedPath}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  clipPath="url(#chart-clip)"
                />
              )}

              {/* Decision Boundary Line in Logistic Mode */}
              {mode === 'logistic' && logisticFit.decisionBoundary !== null && (
                <>
                  <line
                    x1={toScreenX(logisticFit.decisionBoundary)}
                    y1={50}
                    x2={toScreenX(logisticFit.decisionBoundary)}
                    y2={250}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={toScreenX(logisticFit.decisionBoundary) + 6}
                    y={65}
                    fill="#f59e0b"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {isVi ? `Ranh giới: ${logisticFit.decisionBoundary.toFixed(1)}` : `Boundary: ${logisticFit.decisionBoundary.toFixed(1)}`}
                  </text>
                </>
              )}

              {/* Points */}
              {points.map((p, idx) => {
                const targetY = mode === 'logistic' ? p.classVal * 100 : p.y;
                // Class-based coloring for logistic mode, uniform for linear
                const dotColor = mode === 'logistic'
                  ? (p.classVal === 1 ? '#f43f5e' : '#06b6d4')
                  : '#a855f7';

                return (
                  <motion.circle
                    key={`pt-${idx}`}
                    animate={{
                      cx: toScreenX(p.x),
                      cy: toScreenY(targetY),
                      fill: dotColor
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 180,
                      damping: 18
                    }}
                    r="6.5"
                    stroke={isDark ? '#000000' : '#ffffff'}
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    whileHover={{ scale: 1.3 }}
                  />
                );
              })}
            </svg>

            {/* Instruction tooltip */}
            <div className="absolute bottom-3 right-3 bg-neutral-200/70 dark:bg-neutral-900/80 backdrop-blur-sm text-[9px] text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded border border-neutral-350 dark:border-neutral-800 pointer-events-none font-medium">
              {isVi
                ? 'Click khoảng trống để thêm điểm | Click lên chấm để xóa'
                : 'Click blank space to add point | Click point to delete'}
            </div>
          </div>

          {/* Verdict Box / Educational Insight */}
          {points.length >= 2 && (
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/30 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                <strong className="block text-neutral-800 dark:text-neutral-200 mb-0.5">
                  {mode === 'linear' 
                    ? (isVi ? 'Phân tích Tuyến tính OLS' : 'Ordinary Least Squares (OLS) Insight')
                    : (isVi ? 'Mô hình phân loại nhị phân' : 'Binary Classification Insight')}
                </strong>
                {mode === 'linear' ? (
                  isVi
                    ? `Hệ số góc ${linearFit.beta1.toFixed(3)} cho biết khi biến X tăng thêm 1 đơn vị, biến Y sẽ thay đổi trung bình ${linearFit.beta1.toFixed(3)} đơn vị. Chỉ số R² = ${linearFit.r2.toFixed(3)} cho thấy mô hình này giải thích được ${(linearFit.r2 * 100).toFixed(1)}% sự biến động của dữ liệu.`
                    : `The slope of ${linearFit.beta1.toFixed(3)} indicates that for every 1-unit increase in X, Y is predicted to change by ${linearFit.beta1.toFixed(3)} units. R² = ${linearFit.r2.toFixed(3)} means the model explains ${(linearFit.r2 * 100).toFixed(1)}% of the variance.`
                ) : (
                  isVi
                    ? `Các điểm nằm ở nửa trên (Y ≥ 50) được dán nhãn Class 1 (Màu hồng), nửa dưới (Y < 50) là Class 0 (Màu xanh). Đường cong Sigmoid chỉ ra xác suất thuộc về Class 1. Điểm ranh giới quyết định (p = 0.5) ở x = ${logisticFit.decisionBoundary !== null ? logisticFit.decisionBoundary.toFixed(1) : '--'}.`
                    : `Points with Y ≥ 50 are labeled Class 1 (Pink), and Y < 50 are Class 0 (Cyan). The Sigmoid curve outputs the probability of belonging to Class 1. The decision threshold (p = 0.5) lies at x = ${logisticFit.decisionBoundary !== null ? logisticFit.decisionBoundary.toFixed(1) : '--'}.`
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
