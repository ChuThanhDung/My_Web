import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Code } from 'lucide-react';
import { useIsDark } from '../../hooks/useIsDark';

export default function LanguagesVisualizer() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const isDark = useIsDark();

  // Selected language & active task
  const [lang, setLang] = useState<'r' | 'python'>('r');
  const [task, setTask] = useState<'load' | 'stats' | 'plot'>('load');

  // Interactive controls
  const [sampleSize, setSampleSize] = useState<number>(100);
  const [correlation, setCorrelation] = useState<number>(0.65);
  const [noise, setNoise] = useState<number>(20);

  // Generate synthetic data based on state
  const data = useMemo(() => {
    const arr = [];
    const baseIncome = 30000;
    const educationMean = 12;
    const educationSD = 3;

    // Seeded random-like generation
    for (let i = 0; i < sampleSize; i++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.random() || 0.0001;
      const u2 = Math.random() || 0.0001;
      const randN1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const randN2 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

      const edu = Math.max(8, Math.min(22, Math.round(educationMean + randN1 * educationSD)));
      
      // Calculate income with relationship
      const stdEdu = (edu - educationMean) / educationSD;
      const incomeNoise = randN2 * noise * 500;
      const incomeRatio = correlation * stdEdu * 12000;
      const income = Math.round(baseIncome + (edu - 8) * 2500 + incomeRatio + incomeNoise);

      arr.push({
        id: i + 1,
        education_years: edu,
        income: Math.max(12000, income),
        age: Math.max(22, Math.min(65, Math.round(35 + randN1 * 8 + Math.random() * 5)))
      });
    }
    return arr;
  }, [sampleSize, correlation, noise]);

  // Compute OLS Linear Regression (y = beta0 + beta1 * x)
  const regressionStats = useMemo(() => {
    const x = data.map(d => d.education_years);
    const y = data.map(d => d.income);
    const n = data.length;

    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = y.reduce((a, b) => a + b, 0) / n;

    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (x[i] - xMean) * (y[i] - yMean);
      den += (x[i] - xMean) ** 2;
    }

    const beta1 = den !== 0 ? num / den : 0;
    const beta0 = yMean - beta1 * xMean;

    // R^2 calculation
    let ssRes = 0;
    let ssTot = 0;
    for (let i = 0; i < n; i++) {
      const pred = beta0 + beta1 * x[i];
      ssRes += (y[i] - pred) ** 2;
      ssTot += (y[i] - yMean) ** 2;
    }
    const rSquared = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;

    // Standard errors & T-stats (Approximated)
    const residualVar = ssRes / (n - 2 || 1);
    const seBeta1 = Math.sqrt(residualVar / (den || 1));
    const tStat = seBeta1 !== 0 ? beta1 / seBeta1 : 0;
    const pValue = tStat > 4 ? 0.00001 : tStat > 2 ? 0.015 : tStat > 1 ? 0.15 : 0.45;

    return {
      beta0: Math.round(beta0 * 100) / 100,
      beta1: Math.round(beta1 * 100) / 100,
      rSquared: Math.round(rSquared * 4) / 4 > 1 ? 0.99 : Math.round(rSquared * 1000) / 1000,
      tStat: Math.round(tStat * 100) / 100,
      pValue: pValue,
      xMean: Math.round(xMean * 10) / 10,
      yMean: Math.round(yMean * 10) / 10
    };
  }, [data]);

  // Code scripts to display
  const rCodes = {
    load: `# Load CSV & Select variables
library(tidyverse)

df <- read_csv("income_survey.csv")
cleaned_df <- df %>% 
  filter(!is.na(income)) %>%
  select(id, education_years, age, income)

head(cleaned_df, 5)`,
    stats: `# Ordinary Least Squares (OLS) in R
model <- lm(income ~ education_years + age, data = cleaned_df)
summary(model)`,
    plot: `# Academic plotting with ggplot2
ggplot(cleaned_df, aes(x = education_years, y = income)) +
  geom_point(color = "#8b5cf6", alpha = 0.6) +
  geom_smooth(method = "lm", color = "#f43f5e") +
  theme_minimal() +
  labs(title = "Academic Income Analysis")`
  };

  const pyCodes = {
    load: `# Load Dataframe & Clean
import pandas as pd

df = pd.read_csv("income_survey.csv")
cleaned_df = (df
    .dropna(subset=["income"])
    [["id", "education_years", "age", "income"]]
)
print(cleaned_df.head(5))`,
    stats: `# OLS stats models regression
import statsmodels.api as sm

X = cleaned_df[["education_years", "age"]]
X = sm.add_constant(X)
y = cleaned_df["income"]

model = sm.OLS(y, X).fit()
print(model.summary())`,
    plot: `# Visualizing using Seaborn
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid")
sns.regplot(data=cleaned_df, x="education_years", y="income",
            scatter_kws={"color": "#8b5cf6", "alpha": 0.6},
            line_kws={"color": "#f43f5e"})
plt.show()`
  };

  const activeCode = lang === 'r' ? rCodes[task] : pyCodes[task];

  // Helper colors
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <div className="my-8 rounded-[1.5rem] border overflow-hidden" style={{ borderColor: borderCol, background: isDark ? 'rgba(10,10,10,0.3)' : 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)' }}>
      {/* Top Controller Bar */}
      <div className="p-4 md:p-6 border-b flex flex-wrap items-center justify-between gap-4" style={{ borderColor: borderCol }}>
        <div className="flex gap-2 bg-neutral-900/10 dark:bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setLang('r')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
              lang === 'r' 
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            R Language (Academic)
          </button>
          <button
            onClick={() => setLang('python')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
              lang === 'python' 
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Python (Pandas / Statsmodels)
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-neutral-900/10 dark:bg-white/5 p-1 rounded-xl">
          {['load', 'stats', 'plot'].map((tType) => {
            const label = tType === 'load' 
              ? (isVi ? '1. Đọc & Làm sạch' : '1. Load & Clean')
              : tType === 'stats'
              ? (isVi ? '2. Hồi quy OLS' : '2. OLS Regression')
              : (isVi ? '3. Trực quan hóa' : '3. Visualization');
            return (
              <button
                key={tType}
                onClick={() => setTask(tType as any)}
                className={`px-3.5 py-1.5 text-[11px] font-black rounded-lg transition-all ${
                  task === tType
                    ? 'bg-neutral-800 text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-0">
        {/* Left Side: Parameters Slider & Inputs */}
        <div className="xl:col-span-2 p-6 border-r flex flex-col justify-between" style={{ borderColor: borderCol }}>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-6 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-500" />
              {isVi ? 'Điều chỉnh Dữ liệu Mô phỏng' : 'Simulation Parameters'}
            </h4>

            {/* Slider: Sample Size */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-neutral-400">
                  {isVi ? 'Kích thước mẫu (N)' : 'Sample Size (N)'}
                </label>
                <span className="text-xs font-extrabold text-violet-500">{sampleSize}</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={sampleSize}
                onChange={(e) => setSampleSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Slider: Correlation */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-neutral-400">
                  {isVi ? 'Độ tương quan lý thuyết (r)' : 'Theoretical Correlation (r)'}
                </label>
                <span className="text-xs font-extrabold text-violet-500">{correlation}</span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.05"
                value={correlation}
                onChange={(e) => setCorrelation(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Slider: Noise Level */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-neutral-400">
                  {isVi ? 'Độ nhiễu dữ liệu (Noise)' : 'Data Noise Variance'}
                </label>
                <span className="text-xs font-extrabold text-violet-500">{noise}</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={noise}
                onChange={(e) => setNoise(parseInt(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border text-xs leading-relaxed" style={{ borderColor: borderCol, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
            <span className="font-extrabold block text-violet-500 mb-1">
              {isVi ? 'Ước lượng OLS thực tế (Real-time OLS Estimations):' : 'Calculated OLS Estimations:'}
            </span>
            <ul className="space-y-1 font-mono text-neutral-400">
              <li>Income = {regressionStats.beta0} + {regressionStats.beta1} * EduYears</li>
              <li>R-squared (R²): {regressionStats.rSquared}</li>
              <li>t-statistic (Edu): {regressionStats.tStat}</li>
              <li>p-value: {regressionStats.pValue}</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Code Editor & Simulated Outputs */}
        <div className="xl:col-span-3 flex flex-col justify-between" style={{ background: isDark ? '#080808' : '#fafafa' }}>
          {/* Code Window Header */}
          <div className="p-3 border-b flex justify-between items-center px-6" style={{ borderColor: borderCol }}>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-violet-500" />
              {lang === 'r' ? 'R Markdown Console' : 'Jupyter Lab Editor'}
            </span>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Code block */}
          <div className="p-6 font-mono text-xs overflow-auto min-h-[160px] text-slate-300 bg-neutral-950">
            <pre className="whitespace-pre-wrap">{activeCode}</pre>
          </div>

          {/* Terminal / Viz Output Panel */}
          <div className="border-t p-6" style={{ borderColor: borderCol, background: isDark ? 'rgba(0,0,0,0.4)' : '#ffffff' }}>
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider mb-3 block">
              {isVi ? 'Kết quả đầu ra (Simulated Execution Output):' : 'Simulated Output Result:'}
            </span>

            {/* Conditionally Render Output based on Task */}
            <AnimatePresence mode="wait">
              {task === 'load' && (
                <motion.div
                  key="load-output"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-xs overflow-x-auto p-4 rounded-xl border border-neutral-800 bg-neutral-950 text-slate-400"
                >
                  <div className="text-[11px] text-emerald-500 mb-2"># Showing head(cleaned_df, 5)</div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500">
                        <th className="py-1">id</th>
                        <th>edu_years</th>
                        <th>age</th>
                        <th>income</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 5).map((row) => (
                        <tr key={row.id}>
                          <td className="py-1 text-violet-400">{row.id}</td>
                          <td>{row.education_years}</td>
                          <td>{row.age}</td>
                          <td>${row.income.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-2 text-neutral-600">... and {data.length - 5} more rows.</div>
                </motion.div>
              )}

              {task === 'stats' && (
                <motion.div
                  key="stats-output"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[10px] overflow-auto p-4 rounded-xl border border-neutral-800 bg-neutral-950 text-slate-400 whitespace-pre leading-relaxed"
                >
                  {lang === 'r' ? (
                    `Call:
lm(formula = income ~ education_years + age, data = cleaned_df)

Residuals:
    Min      1Q  Median      3Q     Max 
 -12450   -3120     120    3040   14210 

Coefficients:
                 Estimate Std. Error t value Pr(>|t|)    
(Intercept)      ${regressionStats.beta0}   2432.12    1.25    0.212    
education_years  ${regressionStats.beta1}    120.45    ${regressionStats.tStat}   ${regressionStats.pValue < 0.005 ? '< 2e-16 ***' : regressionStats.pValue}
age                12.30     45.10    0.27    0.785    
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 4210 on ${sampleSize - 3} degrees of freedom
Multiple R-squared:  ${regressionStats.rSquared},	Adjusted R-squared:  ${Math.max(0, regressionStats.rSquared - 0.01)}
F-statistic: 42.12 on 2 and ${sampleSize - 3} DF,  p-value: < 2.2e-16`
                  ) : (
                    `                            OLS Regression Results                            
==============================================================================
Dep. Variable:                 income   R-squared:                       ${regressionStats.rSquared}
Model:                            OLS   Adj. R-squared:                  ${Math.max(0, regressionStats.rSquared - 0.01)}
Method:                 Least Squares   F-statistic:                     42.12
Date:                May 2026   Prob (F-statistic):           2.20e-16
No. Observations:                 ${sampleSize}   Log-Likelihood:                -1024.5
Df Residuals:                     ${sampleSize - 3}   AIC:                             2055.
Df Model:                           2   BIC:                             2061.
Covariance Type:            nonrobust                                         
===================================================================================
                      coef    std err          t      P>|t|      [0.025      0.975]
-----------------------------------------------------------------------------------
const            ${regressionStats.beta0}   2432.12      1.250      0.212   -3124.00    6212.00
education_years  ${regressionStats.beta1}    120.450      ${regressionStats.tStat}      ${regressionStats.pValue < 0.005 ? '0.000' : regressionStats.pValue}     350.00     790.00
age                12.300     45.100      0.270      0.785     -76.00      101.00
==============================================================================`
                  )}
                </motion.div>
              )}

              {task === 'plot' && (
                <motion.div
                  key="plot-output"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center p-2 rounded-xl border"
                  style={{
                    backgroundColor: lang === 'r' 
                      ? (isDark ? '#1a1a1a' : '#eaeaea') // ggplot classic grey grid bg
                      : (isDark ? '#0f172a' : '#ffffff'), // sns whitegrid/darkgrid
                    borderColor: borderCol
                  }}
                >
                  {/* Scatter plot in SVG */}
                  <svg viewBox="0 0 500 280" className="w-full max-w-[420px] select-none h-auto font-mono text-[9px]">
                    {/* Render grid lines */}
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const yVal = 40 + idx * 50;
                      return (
                        <line
                          key={`y-grid-${idx}`}
                          x1="40"
                          y1={yVal}
                          x2="460"
                          y2={yVal}
                          stroke={lang === 'r' ? '#ffffff' : (isDark ? '#1e293b' : '#e2e8f0')}
                          strokeWidth="1"
                        />
                      );
                    })}
                    {Array.from({ length: 6 }).map((_, idx) => {
                      const xVal = 40 + idx * 75;
                      return (
                        <line
                          key={`x-grid-${idx}`}
                          x1={xVal}
                          y1="30"
                          x2={xVal}
                          y2="240"
                          stroke={lang === 'r' ? '#ffffff' : (isDark ? '#1e293b' : '#e2e8f0')}
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Chart axis */}
                    <line x1="40" y1="240" x2="460" y2="240" stroke="#888888" strokeWidth="1" />
                    <line x1="40" y1="30" x2="40" y2="240" stroke="#888888" strokeWidth="1" strokeDasharray={lang === 'r' ? '2 2' : 'none'} />

                    {/* Plot labels */}
                    <text x="250" y="270" textAnchor="middle" fill={isDark ? '#94a3b8' : '#334155'} className="font-extrabold text-[10px]">
                      {isVi ? 'Số năm học (Years of Education)' : 'Years of Education (X)'}
                    </text>
                    <text x="12" y="130" textAnchor="middle" transform="rotate(-90, 12, 130)" fill={isDark ? '#94a3b8' : '#334155'} className="font-extrabold text-[10px]">
                      {isVi ? 'Thu nhập ($ / năm)' : 'Annual Income ($ / Y)'}
                    </text>

                    {/* Title */}
                    <text x="250" y="20" textAnchor="middle" fill={lang === 'r' ? '#444444' : (isDark ? '#f8fafc' : '#0f172a')} className="font-black text-[11px]">
                      {lang === 'r' ? 'ggplot2: income ~ education_years' : 'seaborn.regplot: Income vs Education'}
                    </text>

                    {/* Map data points to SVG coordinate space */}
                    {data.map((d, index) => {
                      // x range: 8 to 22. Map to 40 - 460
                      const xPercent = (d.education_years - 8) / 14;
                      const xSVG = 40 + xPercent * (460 - 40);

                      // y range: 10000 to 120000. Map to 240 - 30
                      const yPercent = (d.income - 10000) / 100000;
                      const ySVG = 240 - Math.min(1, Math.max(0, yPercent)) * (240 - 30);

                      return (
                        <circle
                          key={`point-${index}`}
                          cx={xSVG}
                          cy={ySVG}
                          r={lang === 'r' ? "3" : "2.5"}
                          fill={lang === 'r' ? "#8b5cf6" : "#6366f1"}
                          opacity="0.65"
                        />
                      );
                    })}

                    {/* OLS Regression Line */}
                    {(() => {
                      // Calculate OLS points for x = 8 and x = 22
                      const yPred8 = regressionStats.beta0 + regressionStats.beta1 * 8;
                      const yPred22 = regressionStats.beta0 + regressionStats.beta1 * 22;

                      const yPercent8 = (yPred8 - 10000) / 100000;
                      const ySVG8 = 240 - Math.min(1, Math.max(0, yPercent8)) * (240 - 30);

                      const yPercent22 = (yPred22 - 10000) / 100000;
                      const ySVG22 = 240 - Math.min(1, Math.max(0, yPercent22)) * (240 - 30);

                      return (
                        <line
                          x1="40"
                          y1={ySVG8}
                          x2="460"
                          y2={ySVG22}
                          stroke="#f43f5e"
                          strokeWidth="2.5"
                          strokeDasharray={lang === 'r' ? 'none' : '4 2'}
                        />
                      );
                    })()}
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
