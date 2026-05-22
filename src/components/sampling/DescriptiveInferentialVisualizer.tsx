import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsDark } from '../../hooks/useIsDark';
import { Play, Sparkles } from 'lucide-react';

// Box-Muller transform for generating normally distributed values
function randomNormal(mean: number, sd: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * sd + mean;
}

// Student's t distribution cumulative distribution function (exact for integer df)
function tCDF(t: number, df: number): number {
  const absT = Math.abs(t);
  const theta = Math.atan(absT / Math.sqrt(df));
  if (df === 1) {
    return 0.5 + theta / Math.PI;
  }
  let sum = 0;
  if (df % 2 === 0) {
    let term = Math.sin(theta);
    sum = term;
    for (let i = 2; i <= df - 2; i += 2) {
      term = term * Math.cos(theta) * Math.cos(theta) * (i - 1) / i;
      sum += term;
    }
    return 0.5 + 0.5 * sum;
  } else {
    let term = Math.sin(theta) * Math.cos(theta);
    sum = term;
    for (let i = 3; i <= df - 2; i += 2) {
      term = term * Math.cos(theta) * Math.cos(theta) * (i - 1) / i;
      sum += term;
    }
    return 0.5 + (theta + sum) / Math.PI;
  }
}

// Welch's t-test p-value calculation (two-tailed)
function calculateTTest(
  mean1: number, sd1: number, n1: number,
  mean2: number, sd2: number, n2: number
) {
  const var1 = sd1 * sd1;
  const var2 = sd2 * sd2;

  // Welch's t-statistic
  const se = Math.sqrt(var1 / n1 + var2 / n2);
  if (se === 0) return { tVal: 0, df: 1, pVal: 1 };

  const tVal = (mean1 - mean2) / se;

  // Welch-Satterthwaite equation for degrees of freedom
  const num = Math.pow(var1 / n1 + var2 / n2, 2);
  const den = Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1);
  const df = Math.max(1, num / den);

  // Calculate p-value (two-tailed)
  const dfInt = Math.round(df);
  const pVal = 2 * (1 - tCDF(tVal, dfInt));

  return { tVal, df, pVal: Math.min(1, Math.max(0, pVal)) };
}

export default function DescriptiveInferentialVisualizer() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const isDark = useIsDark();

  // True population parameters
  const [meanA, setMeanA] = useState(45);
  const [sdA, setSdA] = useState(8);
  const [nA, setNA] = useState(30);

  const [meanB, setMeanB] = useState(52);
  const [sdB, setSdB] = useState(9);
  const [nB, setNB] = useState(30);

  // Generated sample data
  const [samplesA, setSamplesA] = useState<number[]>([]);
  const [samplesB, setSamplesB] = useState<number[]>([]);

  // Computed sample statistics
  const [statsA, setStatsA] = useState({ mean: 0, sd: 0, variance: 0 });
  const [statsB, setStatsB] = useState({ mean: 0, sd: 0, variance: 0 });
  const [testResult, setTestResult] = useState<{ tVal: number; df: number; pVal: number } | null>(null);

  // Generate samples based on parameters
  const generateSamples = () => {
    const dataA = Array.from({ length: nA }, () => randomNormal(meanA, sdA));
    const dataB = Array.from({ length: nB }, () => randomNormal(meanB, sdB));

    setSamplesA(dataA);
    setSamplesB(dataB);
  };

  // Re-calculate statistics whenever samples change
  useEffect(() => {
    if (samplesA.length === 0 || samplesB.length === 0) return;

    // Group A Stats
    const sumA = samplesA.reduce((a, b) => a + b, 0);
    const mA = sumA / samplesA.length;
    const varA = samplesA.reduce((a, b) => a + Math.pow(b - mA, 2), 0) / (samplesA.length - 1);
    const sA = Math.sqrt(varA);

    // Group B Stats
    const sumB = samplesB.reduce((a, b) => a + b, 0);
    const mB = sumB / samplesB.length;
    const varB = samplesB.reduce((a, b) => a + Math.pow(b - mB, 2), 0) / (samplesB.length - 1);
    const sB = Math.sqrt(varB);

    setStatsA({ mean: mA, sd: sA, variance: varA });
    setStatsB({ mean: mB, sd: sB, variance: varB });

    // T-Test
    const result = calculateTTest(mA, sA, samplesA.length, mB, sB, samplesB.length);
    setTestResult(result);
  }, [samplesA, samplesB]);

  // Generate initial samples
  useEffect(() => {
    generateSamples();
  }, []);

  // Compute normal PDF values for charting
  const getPDFPath = (meanVal: number, sdVal: number) => {
    if (sdVal === 0) return '';
    const points: string[] = [];
    const minX = 10;
    const maxX = 90;
    const steps = 100;

    for (let i = 0; i <= steps; i++) {
      const x = minX + (i / steps) * (maxX - minX);
      // Normal probability density formula
      const y = (1 / (sdVal * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - meanVal, 2) / (2 * sdVal * sdVal));
      
      // Scaling for visual representation
      const screenX = (x / 100) * 500 + 50; // map 0-100 to 50-550
      const screenY = 220 - y * 1200; // scale PDF height and flip Y
      points.push(`${i === 0 ? 'M' : 'L'} ${screenX.toFixed(1)} ${screenY.toFixed(1)}`);
    }
    return points.join(' ');
  };

  const pathA = getPDFPath(statsA.mean, statsA.sd);
  const pathB = getPDFPath(statsB.mean, statsB.sd);

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/60 p-5 md:p-6 overflow-hidden my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div>
            <h4 className="text-base font-extrabold text-neutral-800 dark:text-neutral-200 mb-1">
              {isVi ? 'Thông số Quần thể & Mẫu' : 'Population & Sample Parameters'}
            </h4>
            <p className="text-xs text-neutral-500">
              {isVi ? 'Thay đổi tham số thực tế của Group A và B.' : 'Adjust the true distribution values of A and B.'}
            </p>
          </div>

          {/* Group A Controls */}
          <div className="space-y-4 p-4 rounded-xl border border-pink-500/10 bg-pink-500/5">
            <span className="text-xs font-black text-pink-500 uppercase tracking-widest block">Group A</span>
            
            {/* Mean A */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
                <span>{isVi ? 'Trung bình quần thể (μ)' : 'True Mean (μ)'}</span>
                <span className="text-pink-500 font-mono">{meanA}</span>
              </div>
              <input
                type="range" min="30" max="70" value={meanA}
                onChange={e => setMeanA(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            {/* SD A */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
                <span>{isVi ? 'Độ lệch chuẩn (σ)' : 'True SD (σ)'}</span>
                <span className="text-pink-500 font-mono">{sdA}</span>
              </div>
              <input
                type="range" min="3" max="15" value={sdA}
                onChange={e => setSdA(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            {/* Sample Size A */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
                <span>{isVi ? 'Kích thước mẫu (n)' : 'Sample Size (n)'}</span>
                <span className="text-pink-500 font-mono">{nA}</span>
              </div>
              <input
                type="range" min="10" max="80" value={nA}
                onChange={e => setNA(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>
          </div>

          {/* Group B Controls */}
          <div className="space-y-4 p-4 rounded-xl border border-cyan-500/10 bg-cyan-500/5">
            <span className="text-xs font-black text-cyan-500 uppercase tracking-widest block">Group B</span>
            
            {/* Mean B */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
                <span>{isVi ? 'Trung bình quần thể (μ)' : 'True Mean (μ)'}</span>
                <span className="text-cyan-500 font-mono">{meanB}</span>
              </div>
              <input
                type="range" min="30" max="70" value={meanB}
                onChange={e => setMeanB(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* SD B */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
                <span>{isVi ? 'Độ lệch chuẩn (σ)' : 'True SD (σ)'}</span>
                <span className="text-cyan-500 font-mono">{sdB}</span>
              </div>
              <input
                type="range" min="3" max="15" value={sdB}
                onChange={e => setSdB(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Sample Size B */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
                <span>{isVi ? 'Kích thước mẫu (n)' : 'Sample Size (n)'}</span>
                <span className="text-cyan-500 font-mono">{nB}</span>
              </div>
              <input
                type="range" min="10" max="80" value={nB}
                onChange={e => setNB(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={generateSamples}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl border border-emerald-500 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isVi ? 'Tạo mẫu dữ liệu mới' : 'Generate New Samples'}
            </button>
          </div>
        </div>

        {/* Right Column: Visualizer & Results (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Plot Visualizer */}
          <div className="relative bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-900 p-4 flex flex-col h-[320px] justify-center items-center overflow-hidden">
            
            {/* SVG Charts */}
            <svg viewBox="0 0 600 280" className="w-full h-full">
              {/* Background grids */}
              <line x1="50" y1="220" x2="550" y2="220" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="1.5" />
              <line x1="50" y1="50" x2="50" y2="220" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3,3" />
              <line x1="175" y1="50" x2="175" y2="220" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3,3" />
              <line x1="300" y1="50" x2="300" y2="220" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3,3" />
              <line x1="425" y1="50" x2="425" y2="220" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3,3" />
              <line x1="550" y1="50" x2="550" y2="220" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3,3" />

              {/* X-axis tick labels */}
              <text x="50" y="240" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="middle">0</text>
              <text x="175" y="240" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="middle">25</text>
              <text x="300" y="240" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="middle">50</text>
              <text x="425" y="240" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="middle">75</text>
              <text x="550" y="240" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="middle">100</text>

              {/* Group A PDF Curve */}
              {pathA && (
                <>
                  <path d={`${pathA} L 550 220 L 50 220 Z`} fill="rgba(236,72,153,0.06)" />
                  <path d={pathA} fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}

              {/* Group B PDF Curve */}
              {pathB && (
                <>
                  <path d={`${pathB} L 550 220 L 50 220 Z`} fill="rgba(6,182,212,0.06)" />
                  <path d={pathB} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}

              {/* Jitter Points A */}
              {samplesA.map((val, idx) => {
                const screenX = (val / 100) * 500 + 50;
                // Add a small deterministic vertical offset based on index to spread dots
                const screenY = 250 + (idx % 4) * 5;
                if (screenX < 50 || screenX > 550) return null;
                return (
                  <circle
                    key={`a-${idx}`}
                    cx={screenX}
                    cy={screenY}
                    r="3.5"
                    fill="#ec4899"
                    opacity="0.6"
                  />
                );
              })}

              {/* Jitter Points B */}
              {samplesB.map((val, idx) => {
                const screenX = (val / 100) * 500 + 50;
                const screenY = 268 + (idx % 4) * 5;
                if (screenX < 50 || screenX > 550) return null;
                return (
                  <circle
                    key={`b-${idx}`}
                    cx={screenX}
                    cy={screenY}
                    r="3.5"
                    fill="#06b6d4"
                    opacity="0.6"
                  />
                );
              })}

              {/* Group Means Markers */}
              <line
                x1={(statsA.mean / 100) * 500 + 50} y1="40"
                x2={(statsA.mean / 100) * 500 + 50} y2="220"
                stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4,4"
              />
              <circle cx={(statsA.mean / 100) * 500 + 50} cy="40" r="4.5" fill="#ec4899" />
              
              <line
                x1={(statsB.mean / 100) * 500 + 50} y1="40"
                x2={(statsB.mean / 100) * 500 + 50} y2="220"
                stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4,4"
              />
              <circle cx={(statsB.mean / 100) * 500 + 50} cy="40" r="4.5" fill="#06b6d4" />
            </svg>

            {/* Legend */}
            <div className="absolute top-3 right-3 bg-neutral-200/60 dark:bg-black/60 backdrop-blur text-[10px] text-neutral-600 dark:text-neutral-400 p-2.5 rounded border border-neutral-350 dark:border-neutral-800 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" />
                <span>Group A (x̄: {statsA.mean.toFixed(1)})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                <span>Group B (x̄: {statsB.mean.toFixed(1)})</span>
              </div>
            </div>
          </div>

          {/* Results dashboard grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Descriptive Stats A */}
            <div className="p-4 rounded-xl border border-pink-500/10 bg-pink-500/5">
              <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest block mb-2">Group A Stats (Sample)</span>
              <div className="space-y-1.5 text-xs font-medium">
                <div className="flex justify-between">
                  <span className="text-neutral-500">{isVi ? 'Trung bình (x̄)' : 'Sample Mean (x̄)'}</span>
                  <span className="text-neutral-800 dark:text-white font-mono font-bold">{statsA.mean.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{isVi ? 'Độ lệch chuẩn (s)' : 'Sample SD (s)'}</span>
                  <span className="text-neutral-800 dark:text-white font-mono font-bold">{statsA.sd.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{isVi ? 'Phương sai (s²)' : 'Sample Variance (s²)'}</span>
                  <span className="text-neutral-800 dark:text-white font-mono font-bold">{statsA.variance.toFixed(3)}</span>
                </div>
              </div>
            </div>

            {/* Descriptive Stats B */}
            <div className="p-4 rounded-xl border border-cyan-500/10 bg-cyan-500/5">
              <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest block mb-2">Group B Stats (Sample)</span>
              <div className="space-y-1.5 text-xs font-medium">
                <div className="flex justify-between">
                  <span className="text-neutral-500">{isVi ? 'Trung bình (x̄)' : 'Sample Mean (x̄)'}</span>
                  <span className="text-neutral-800 dark:text-white font-mono font-bold">{statsB.mean.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{isVi ? 'Độ lệch chuẩn (s)' : 'Sample SD (s)'}</span>
                  <span className="text-neutral-800 dark:text-white font-mono font-bold">{statsB.sd.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{isVi ? 'Phương sai (s²)' : 'Sample Variance (s²)'}</span>
                  <span className="text-neutral-800 dark:text-white font-mono font-bold">{statsB.variance.toFixed(3)}</span>
                </div>
              </div>
            </div>

            {/* T-Test Results */}
            {testResult && (
              <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block mb-2">
                  {isVi ? 'Kết quả Welch\'s T-Test' : 'Welch\'s T-Test Results'}
                </span>
                <div className="space-y-1.5 text-xs font-medium">
                  <div className="flex justify-between">
                    <span>t-statistic</span>
                    <span className="text-neutral-850 dark:text-neutral-100 font-mono font-bold">{testResult.tVal.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>df</span>
                    <span className="text-neutral-850 dark:text-neutral-100 font-mono font-bold">{testResult.df.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">p-value</span>
                    <span className="text-neutral-850 dark:text-neutral-100 font-mono font-black">
                      {testResult.pVal < 0.001 ? '< 0.001' : testResult.pVal.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Verdict Box */}
          {testResult && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 shadow-inner ${
              testResult.pVal < 0.05
                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-450'
                : 'border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-450'
            }`}>
              <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                  {isVi ? 'Kết luận kiểm định (α = 0.05)' : 'Hypothesis Verdict (α = 0.05)'}
                </span>
                <p className="text-sm font-semibold leading-relaxed">
                  {testResult.pVal < 0.05
                    ? (isVi
                      ? `Bác bỏ H0. Sự khác biệt giữa 2 nhóm có ý nghĩa thống kê (p = ${testResult.pVal.toFixed(4)} < 0.05).`
                      : `Reject H0. The difference is statistically significant (p = ${testResult.pVal.toFixed(4)} < 0.05).`)
                    : (isVi
                      ? `Chưa thể bác bỏ H0. Sự khác biệt không có ý nghĩa thống kê (p = ${testResult.pVal.toFixed(4)} >= 0.05).`
                      : `Fail to reject H0. The difference is not statistically significant (p = ${testResult.pVal.toFixed(4)} >= 0.05).`)
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
