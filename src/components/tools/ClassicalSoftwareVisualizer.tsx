import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, Play, AlertCircle, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import { useIsDark } from '../../hooks/useIsDark';

export default function ClassicalSoftwareVisualizer() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const isDark = useIsDark();

  // Active software tab
  const [software, setSoftware] = useState<'spss' | 'stata' | 'eviews'>('spss');

  // SPSS State variables
  const [spssMenuOpen, setSpssMenuOpen] = useState(false);
  const [spssDialogOpen, setSpssDialogOpen] = useState(false);
  const [spssAnovaFixedFactor, setSpssAnovaFixedFactor] = useState('Region');
  const [spssOutput, setSpssOutput] = useState<any>(null);

  // Stata State variables
  const [stataTerminalLines, setStataTerminalLines] = useState<string[]>([
    '. sysuse auto, clear',
    '(1978 automobile data)'
  ]);

  // EViews State variables
  const [eviewsDiff, setEviewsDiff] = useState<boolean>(false);
  const [eviewsAdfResult, setEviewsAdfResult] = useState<any>(null);

  // Mock SPSS datasets
  const mockSpssData = [
    { country: 'Vietnam', Region: 'East Asia', GDP: 6.8, Inflation: 3.2, Unemployment: 2.1 },
    { country: 'Thailand', Region: 'East Asia', GDP: 3.5, Inflation: 1.5, Unemployment: 1.8 },
    { country: 'Singapore', Region: 'East Asia', GDP: 4.8, Inflation: 1.1, Unemployment: 2.0 },
    { country: 'Germany', Region: 'Europe', GDP: 1.8, Inflation: 1.9, Unemployment: 3.2 },
    { country: 'France', Region: 'Europe', GDP: 1.5, Inflation: 1.6, Unemployment: 5.5 },
    { country: 'UK', Region: 'Europe', GDP: 1.2, Inflation: 2.1, Unemployment: 4.0 },
    { country: 'US', Region: 'Americas', GDP: 2.5, Inflation: 2.3, Unemployment: 3.6 },
    { country: 'Canada', Region: 'Americas', GDP: 2.1, Inflation: 2.0, Unemployment: 5.8 },
    { country: 'Brazil', Region: 'Americas', GDP: 1.1, Inflation: 4.5, Unemployment: 11.2 }
  ];

  // SPSS ANOVA Calculation simulation
  const handleRunSpssAnova = () => {
    setSpssDialogOpen(false);
    setSpssMenuOpen(false);

    // Calculate mean GDP by group (East Asia, Europe, Americas)
    const groups: Record<string, number[]> = {};
    mockSpssData.forEach(d => {
      const g = spssAnovaFixedFactor === 'Region' ? d.Region : (d.GDP > 3 ? 'HighGDP' : 'LowGDP');
      if (!groups[g]) groups[g] = [];
      groups[g].push(d.GDP);
    });

    const groupNames = Object.keys(groups);
    const overallMean = mockSpssData.reduce((acc, curr) => acc + curr.GDP, 0) / mockSpssData.length;

    let dfBetween = groupNames.length - 1;
    let dfWithin = mockSpssData.length - groupNames.length;
    let dfTotal = mockSpssData.length - 1;

    let ssBetween = 0;
    let ssWithin = 0;

    groupNames.forEach(name => {
      const gMeans = groups[name];
      const gMean = gMeans.reduce((a, b) => a + b, 0) / gMeans.length;
      ssBetween += gMeans.length * ((gMean - overallMean) ** 2);
      gMeans.forEach(val => {
        ssWithin += (val - gMean) ** 2;
      });
    });

    const ssTotal = ssBetween + ssWithin;
    const msBetween = ssBetween / dfBetween;
    const msWithin = ssWithin / (dfWithin || 1);
    const fValue = msWithin !== 0 ? msBetween / msWithin : 0;
    const pValue = fValue > 5 ? 0.008 : fValue > 2 ? 0.12 : 0.65;

    setSpssOutput({
      factor: spssAnovaFixedFactor,
      ssBetween: ssBetween.toFixed(3),
      ssWithin: ssWithin.toFixed(3),
      ssTotal: ssTotal.toFixed(3),
      dfBetween,
      dfWithin,
      dfTotal,
      msBetween: msBetween.toFixed(3),
      msWithin: msWithin.toFixed(3),
      fValue: fValue.toFixed(3),
      pValue: pValue.toFixed(3)
    });
  };

  // Stata script runner
  const handleRunStataCmd = (cmd: string) => {
    const newLines = [...stataTerminalLines, `. ${cmd}`];
    
    if (cmd.includes('summarize')) {
      newLines.push(
        `    Variable |        Obs        Mean    Std. dev.       Min        Max`,
        `-------------+---------------------------------------------------------`,
        `       price |         74    6165.257    2949.496       3291      15906`,
        `         mpg |         74     21.2973    5.785503         12         41`,
        `      weight |         74    3019.459    777.1936       1760       4840`,
        `     foreign |         74    .2972973    .4601885          0          1`
      );
    } else if (cmd.includes('regress')) {
      newLines.push(
        `      Source |       SS           df       MS              Number of obs =      74`,
        `-------------+----------------------------------           F(2, 71)      =   14.82`,
        `       Model |   186542100         2    93271050           Prob > F      =  0.0001`,
        `    Residual |   447124900        71   6297533.8           R-squared     =  0.2942`,
        `-------------+----------------------------------           Adj R-squared =  0.2743`,
        `       Total |   633667000        73   8680369.9           Root MSE      =  2509.5`,
        `-----------------------------------------------------------------------------------`,
        `       price |      Coefficient  Std. err.      t    P>|t|     [95% conf. interval]`,
        `-------------+---------------------------------------------------------------------`,
        `         mpg |      -21.85042     74.2201    -0.29   0.770     -169.8415    126.1407`,
        `      weight |       1.746559     .641325     2.72   0.008      .4677943    3.025324`,
        `       _cons |       1946.069    3597.050     0.54   0.590     -5226.248    9118.385`,
        `-----------------------------------------------------------------------------------`
      );
    } else if (cmd.includes('clear') || cmd.includes('sysuse')) {
      newLines.push(`(1978 automobile data loaded successfully)`);
    } else {
      newLines.push(`unrecognized command: "${cmd}"`, `r(199);`);
    }

    setStataTerminalLines(newLines);
  };

  // EViews economic dataset (GDP growth index 2010 - 2025)
  const eviewsRawData = [
    { year: 2010, raw: 100.0, diff: 0 },
    { year: 2011, raw: 106.2, diff: 6.2 },
    { year: 2012, raw: 111.8, diff: 5.6 },
    { year: 2013, raw: 118.4, diff: 6.6 },
    { year: 2014, raw: 125.7, diff: 7.3 },
    { year: 2015, raw: 133.1, diff: 7.4 },
    { year: 2016, raw: 141.2, diff: 8.1 },
    { year: 2017, raw: 151.1, diff: 9.9 },
    { year: 2018, raw: 162.0, diff: 10.9 },
    { year: 2019, raw: 173.5, diff: 11.5 },
    { year: 2020, raw: 178.6, diff: 5.1 }, // Covid dip
    { year: 2021, raw: 184.2, diff: 5.6 },
    { year: 2022, raw: 198.8, diff: 14.6 },
    { year: 2023, raw: 208.5, diff: 9.7 },
    { year: 2024, raw: 221.0, diff: 12.5 },
    { year: 2025, raw: 235.6, diff: 14.6 }
  ];

  // EViews ADF Unit Root Test simulation
  const handleRunEviewsAdf = () => {
    if (!eviewsDiff) {
      setEviewsAdfResult({
        level: 'Level',
        variable: 'GDP_INDEX',
        tStat: '-1.4210',
        pVal: '0.5512',
        cv1: '-3.9640',
        cv5: '-3.0812',
        cv10: '-2.6810',
        conclusion: isVi 
          ? 'Không bác bỏ H0: Dãy dữ liệu có chứa Unit Root (Không dừng)'
          : 'Fail to Reject H0: Series has a Unit Root (Non-stationary)'
      });
    } else {
      setEviewsAdfResult({
        level: '1st Difference',
        variable: 'D(GDP_INDEX)',
        tStat: '-4.8510',
        pVal: '0.0004',
        cv1: '-3.9850',
        cv5: '-3.0910',
        cv10: '-2.6920',
        conclusion: isVi
          ? 'Bác bỏ H0: Dãy dữ liệu dừng ở mức ý nghĩa 1%'
          : 'Reject H0: Series is Stationary at 1% significance level'
      });
    }
  };

  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <div className="my-8 rounded-[1.5rem] border overflow-hidden" style={{ borderColor: borderCol, background: isDark ? 'rgba(10,10,10,0.3)' : 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)' }}>
      {/* Tab Switcher */}
      <div className="p-4 md:p-6 border-b flex flex-wrap items-center justify-between gap-4" style={{ borderColor: borderCol }}>
        <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">
          {isVi ? 'Phần mềm giả lập' : 'Classical Software Simulators'}
        </h4>

        <div className="flex gap-2 bg-neutral-900/10 dark:bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setSoftware('spss')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
              software === 'spss' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            SPSS GUI
          </button>
          <button
            onClick={() => setSoftware('stata')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
              software === 'stata' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Stata Console
          </button>
          <button
            onClick={() => setSoftware('eviews')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
              software === 'eviews' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            EViews Chart
          </button>
        </div>
      </div>

      {/* Main Workspace based on selected software */}
      <div className="p-6">
        {/* =================== SPSS VIEW =================== */}
        {software === 'spss' && (
          <div className="space-y-6">
            {/* Windows 98/2000 style menu bar mockup */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: borderCol, backgroundColor: isDark ? '#121212' : '#f3f4f6' }}>
              <div className="bg-neutral-800 dark:bg-neutral-950 p-2 flex justify-between items-center px-4 text-xs font-bold text-slate-300 border-b border-neutral-700/50">
                <span>IBM SPSS Statistics - DataEditor1.sav</span>
                <div className="flex gap-2">
                  <span className="w-3 h-3 bg-neutral-600 rounded-full" />
                  <span className="w-3 h-3 bg-neutral-600 rounded-full" />
                </div>
              </div>

              {/* SPSS Menu Bar */}
              <div className="flex bg-neutral-200 dark:bg-neutral-900 border-b p-1 px-4 text-xs select-none gap-4" style={{ borderColor: borderCol }}>
                <span className="cursor-pointer text-neutral-400 hover:text-neutral-200">File</span>
                <span className="cursor-pointer text-neutral-400 hover:text-neutral-200">Edit</span>
                <span className="cursor-pointer text-neutral-400 hover:text-neutral-200">Data</span>
                <span className="cursor-pointer text-neutral-400 hover:text-neutral-200">Transform</span>
                <div className="relative">
                  <span 
                    onClick={() => setSpssMenuOpen(!spssMenuOpen)}
                    className="cursor-pointer text-indigo-500 font-extrabold hover:text-indigo-400 flex items-center gap-0.5"
                  >
                    Analyze
                  </span>
                  {/* Dropdown Menu */}
                  {spssMenuOpen && (
                    <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-xl bg-white dark:bg-neutral-950 border border-neutral-700 p-1.5 z-30 text-xs">
                      <div className="p-2 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">Statistical Tests</div>
                      <button 
                        onClick={() => { setSpssDialogOpen(true); setSpssMenuOpen(false); }}
                        className="w-full text-left p-2 hover:bg-indigo-600 hover:text-white rounded-md font-bold transition-all text-slate-300"
                      >
                        General Linear Model &gt; Univariate (ANOVA)
                      </button>
                      <button className="w-full text-left p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all text-neutral-500 cursor-not-allowed">
                        Regression &gt; Linear...
                      </button>
                    </div>
                  )}
                </div>
                <span className="cursor-pointer text-neutral-400 hover:text-neutral-200">Graphs</span>
                <span className="cursor-pointer text-neutral-400 hover:text-neutral-200">Utilities</span>
              </div>

              {/* SPSS Data Grid Mockup */}
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-neutral-300 dark:bg-neutral-900 border-b border-neutral-700/50 text-neutral-400">
                      <th className="p-2 border-r border-neutral-700/30">ID</th>
                      <th className="p-2 border-r border-neutral-700/30">Country</th>
                      <th className="p-2 border-r border-neutral-700/30">Region</th>
                      <th className="p-2 border-r border-neutral-700/30">GDP Growth (%)</th>
                      <th className="p-2 border-r border-neutral-700/30">Inflation (%)</th>
                      <th className="p-2">Unemployment (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSpssData.map((row, idx) => (
                      <tr key={idx} className="border-b border-neutral-700/20 text-neutral-300 hover:bg-indigo-600/5">
                        <td className="p-2 border-r border-neutral-700/20 text-neutral-500">{idx + 1}</td>
                        <td className="p-2 border-r border-neutral-700/20 font-bold">{row.country}</td>
                        <td className="p-2 border-r border-neutral-700/20">{row.Region}</td>
                        <td className="p-2 border-r border-neutral-700/20 text-emerald-400">{row.GDP}%</td>
                        <td className="p-2 border-r border-neutral-700/20">{row.Inflation}%</td>
                        <td className="p-2">{row.Unemployment}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Instruction tooltip */}
            <div className="flex gap-2.5 items-center p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                {isVi 
                  ? 'Hãy click vào bảng chọn "Analyze" ở trên và chọn "General Linear Model > Univariate (ANOVA)" để mở hộp thoại cấu hình phân tích thống kê.'
                  : 'Click on the "Analyze" tab in the mockup menu above and select "General Linear Model > Univariate (ANOVA)" to open the configuration dialog.'}
              </span>
            </div>

            {/* Modal Dialog for SPSS Settings */}
            {spssDialogOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-900 p-6 text-slate-200 shadow-2xl">
                  <h3 className="text-base font-black mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    SPSS Univariate ANOVA Dialog
                  </h3>
                  
                  <div className="space-y-4 my-6">
                    <div>
                      <span className="text-xs font-bold text-neutral-400 block mb-1">Dependent Variable:</span>
                      <div className="p-2 border border-neutral-800 rounded bg-neutral-950 text-xs font-mono text-emerald-400">
                        GDP Growth (%)
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-400 block mb-1">Fixed Factor (Group Variable):</label>
                      <select 
                        value={spssAnovaFixedFactor}
                        onChange={(e) => setSpssAnovaFixedFactor(e.target.value)}
                        className="w-full p-2.5 border border-neutral-800 rounded bg-neutral-950 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Region">Region (East Asia, Europe, Americas)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5">
                    <button 
                      onClick={() => setSpssDialogOpen(false)}
                      className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-bold text-neutral-400 hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleRunSpssAnova}
                      className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-black text-white hover:bg-indigo-500 flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Run ANOVA / OK
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SPSS Outputs Display */}
            {spssOutput && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border"
                style={{ borderColor: borderCol, backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#ffffff' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-extrabold uppercase text-indigo-400 tracking-wider">
                    SPSS Statistics Viewer - Output 1
                  </span>
                  <button 
                    onClick={() => setSpssOutput(null)}
                    className="text-neutral-500 hover:text-neutral-300 text-xs font-extrabold"
                  >
                    Clear Output
                  </button>
                </div>

                <div className="space-y-4 font-mono text-[10px] overflow-auto">
                  <div className="text-xs font-extrabold border-b border-indigo-500/20 pb-1 mb-2 text-neutral-400">
                    Tests of Between-Subjects Effects (Dependent Variable: GDP Growth)
                  </div>
                  
                  <table className="w-full text-left text-slate-300">
                    <thead>
                      <tr className="border-b border-neutral-700 text-neutral-500">
                        <th className="py-1">Source</th>
                        <th>Type III Sum of Squares</th>
                        <th>df</th>
                        <th>Mean Square</th>
                        <th>F</th>
                        <th>Sig. (p-value)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-800">
                        <td className="py-1 font-bold text-indigo-400">Corrected Model</td>
                        <td>{spssOutput.ssBetween}</td>
                        <td>{spssOutput.dfBetween}</td>
                        <td>{spssOutput.msBetween}</td>
                        <td>{spssOutput.fValue}</td>
                        <td className="font-extrabold text-emerald-400">{spssOutput.pValue}</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-1 text-neutral-500">Intercept</td>
                        <td>124.550</td>
                        <td>1</td>
                        <td>124.550</td>
                        <td>54.210</td>
                        <td>0.000</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-1 font-bold text-indigo-400">{spssOutput.factor}</td>
                        <td>{spssOutput.ssBetween}</td>
                        <td>{spssOutput.dfBetween}</td>
                        <td>{spssOutput.msBetween}</td>
                        <td>{spssOutput.fValue}</td>
                        <td className="font-extrabold text-emerald-400">{spssOutput.pValue}</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-1 text-neutral-500">Error (Within)</td>
                        <td>{spssOutput.ssWithin}</td>
                        <td>{spssOutput.dfWithin}</td>
                        <td>{spssOutput.msWithin}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td className="py-1 text-neutral-500">Corrected Total</td>
                        <td>{spssOutput.ssTotal}</td>
                        <td>{spssOutput.dfTotal}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="text-neutral-500 mt-2 text-[9px]">
                    a. R Squared = {(parseFloat(spssOutput.ssBetween)/parseFloat(spssOutput.ssTotal)).toFixed(3)} (Adjusted R Squared = {((parseFloat(spssOutput.ssBetween)/parseFloat(spssOutput.ssTotal)) - 0.05).toFixed(3)})
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* =================== STATA VIEW =================== */}
        {software === 'stata' && (
          <div className="space-y-4">
            {/* Terminal Panel */}
            <div className="rounded-xl border overflow-hidden text-neutral-300 font-mono text-[11px]" style={{ borderColor: borderCol, background: '#090d16' }}>
              <div className="bg-slate-900 border-b p-2 px-4 flex justify-between items-center text-xs text-neutral-500" style={{ borderColor: borderCol }}>
                <span className="flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-indigo-400" />
                  Stata MP 18.0 - Terminal Console
                </span>
                <span className="text-[10px] text-neutral-600">sql_app.db loaded</span>
              </div>

              {/* Console display logs */}
              <div className="p-4 space-y-2 max-h-80 overflow-y-auto leading-relaxed select-all">
                {stataTerminalLines.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={`whitespace-pre-wrap ${
                      line.startsWith('.') 
                        ? 'text-indigo-400 font-bold' 
                        : line.includes('Variable') || line.includes('coef')
                        ? 'text-slate-300'
                        : line.includes('unrecognized')
                        ? 'text-rose-500 font-bold'
                        : 'text-neutral-400'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick scripts controls */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-neutral-500">Quick Commands:</span>
              <button 
                onClick={() => { handleRunStataCmd('summarize price mpg weight foreign'); }}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-indigo-500 text-neutral-300 hover:text-white rounded-lg text-xs font-bold font-mono transition-all"
              >
                summarize vars
              </button>
              <button 
                onClick={() => { handleRunStataCmd('regress price mpg weight'); }}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-indigo-500 text-neutral-300 hover:text-white rounded-lg text-xs font-bold font-mono transition-all"
              >
                regress price mpg weight
              </button>
              <button 
                onClick={() => setStataTerminalLines(['. sysuse auto, clear', '(1978 automobile data)'])}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-rose-500 text-rose-400 hover:text-rose-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Terminal
              </button>
            </div>
          </div>
        )}

        {/* =================== EVIEWS VIEW =================== */}
        {software === 'eviews' && (
          <div className="space-y-6">
            {/* EViews Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border" style={{ borderColor: borderCol, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEviewsDiff(false); setEviewsAdfResult(null); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    !eviewsDiff 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-neutral-500 bg-neutral-800/10'
                  }`}
                >
                  Raw Level Series: GDP_INDEX
                </button>
                <button
                  onClick={() => { setEviewsDiff(true); setEviewsAdfResult(null); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    eviewsDiff 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-neutral-500 bg-neutral-800/10'
                  }`}
                >
                  1st Difference Series: D(GDP_INDEX)
                </button>
              </div>

              <button
                onClick={handleRunEviewsAdf}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/10"
              >
                <CheckCircle className="w-4 h-4" />
                Augmented Dickey-Fuller (ADF) Test
              </button>
            </div>

            {/* Time series Chart plot */}
            <div className="p-4 rounded-xl border flex justify-center items-center" style={{ borderColor: borderCol, background: isDark ? '#0d0d0d' : '#ffffff' }}>
              <svg viewBox="0 0 500 240" className="w-full max-w-[420px] h-auto font-mono text-[9px]">
                {/* Axes and grid */}
                <line x1="40" y1="200" x2="460" y2="200" stroke="#555555" strokeWidth="1" />
                <line x1="40" y1="30" x2="40" y2="200" stroke="#555555" strokeWidth="1" />
                
                {Array.from({ length: 5 }).map((_, idx) => {
                  const yVal = 40 + idx * 40;
                  return (
                    <line key={idx} x1="40" y1={yVal} x2="460" y2={yVal} stroke="#333333" strokeWidth="0.5" strokeDasharray="3 3" />
                  );
                })}

                {/* Plot line */}
                {(() => {
                  const points: string[] = [];
                  eviewsRawData.forEach((d, i) => {
                    const x = 40 + (i / 15) * 420;
                    // Map raw (100 to 240) or diff (0 to 16)
                    let yVal = 0;
                    if (!eviewsDiff) {
                      const pct = (d.raw - 90) / 160;
                      yVal = 200 - pct * 160;
                    } else {
                      const pct = (d.diff - (-2)) / 18;
                      yVal = 200 - pct * 160;
                    }
                    points.push(`${x},${yVal}`);
                  });

                  return (
                    <>
                      <polyline
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                        points={points.join(' ')}
                      />
                      {/* Highlight covid dip */}
                      <circle cx={40 + (10/15)*420} cy={200 - ((eviewsDiff ? eviewsRawData[10].diff - (-2) : eviewsRawData[10].raw - 90) / (eviewsDiff ? 18 : 160)) * 160} r="4" fill="#rose" className="fill-rose-500 animate-pulse" />
                    </>
                  );
                })()}

                {/* X labels */}
                {eviewsRawData.filter((_, i) => i % 3 === 0).map((d, i) => {
                  const x = 40 + ((i * 3) / 15) * 420;
                  return (
                    <text key={i} x={x} y="215" textAnchor="middle" fill="#888888">{d.year}</text>
                  );
                })}

                {/* Y labels */}
                {!eviewsDiff ? (
                  <>
                    <text x="30" y="43" textAnchor="end" fill="#888888">220</text>
                    <text x="30" y="123" textAnchor="end" fill="#888888">140</text>
                    <text x="30" y="195" textAnchor="end" fill="#888888">100</text>
                  </>
                ) : (
                  <>
                    <text x="30" y="43" textAnchor="end" fill="#888888">15%</text>
                    <text x="30" y="123" textAnchor="end" fill="#888888">8%</text>
                    <text x="30" y="195" textAnchor="end" fill="#888888">0%</text>
                  </>
                )}

                <text x="250" y="235" textAnchor="middle" fill="#888888" className="font-extrabold">
                  {eviewsDiff ? 'D(GDP_INDEX) - Differenced' : 'GDP_INDEX - Raw Index'}
                </text>
              </svg>
            </div>

            {/* EViews ADF outputs */}
            {eviewsAdfResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border font-mono text-[10px] overflow-auto"
                style={{ borderColor: borderCol, backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#ffffff', color: isDark ? '#d4d4d8' : '#3f3f46' }}
              >
                <div className="text-xs font-extrabold border-b border-indigo-500/20 pb-1 mb-3 text-neutral-400">
                  Null Hypothesis: {eviewsAdfResult.variable} has a unit root
                </div>
                
                <table className="w-full text-left mb-4">
                  <tbody>
                    <tr className="border-b border-neutral-800">
                      <td className="py-1 font-bold">Augmented Dickey-Fuller test statistic</td>
                      <td className="text-indigo-400 font-extrabold">{eviewsAdfResult.tStat}</td>
                      <td>Prob.*: {eviewsAdfResult.pVal}</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-neutral-500">Test critical values:</td>
                      <td>1% level</td>
                      <td>{eviewsAdfResult.cv1}</td>
                    </tr>
                    <tr>
                      <td className="py-1"></td>
                      <td>5% level</td>
                      <td>{eviewsAdfResult.cv5}</td>
                    </tr>
                    <tr className="border-b border-neutral-800">
                      <td className="py-1"></td>
                      <td>10% level</td>
                      <td>{eviewsAdfResult.cv10}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 font-bold border border-indigo-500/20 text-xs">
                  {eviewsAdfResult.conclusion}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
