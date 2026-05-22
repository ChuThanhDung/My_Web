import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, HelpCircle } from 'lucide-react';
import { useIsDark } from '../../hooks/useIsDark';

interface UserRow {
  id: number;
  name: string | null;
  email: string | null;
  country: string | null;
  age: number | null;
  status: string | null;
}

const RAW_DATASET: UserRow[] = [
  { id: 1, name: "  John Doe ", email: "john@doe.com", country: "US", age: 29, status: "active" },
  { id: 2, name: "Jane Smith", email: "JANE@SMITH.COM", country: "United States", age: null, status: "Active" },
  { id: 3, name: "  john doe ", email: "john@doe.com", country: "US", age: 29, status: "active" }, // Duplicate
  { id: 4, name: "Alice Brown", email: "alice@brown.com", country: "UK", age: 34, status: "inactive" },
  { id: 5, name: "Bob Johnson", email: null, country: "Canada", age: 41, status: "Active" },
  { id: 6, name: "Charlie Green", email: "charlie@green.org", country: "DE", age: null, status: null }
];

export default function SqlVisualizer() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const isDark = useIsDark();

  const [queryKey, setQueryKey] = useState<'trim' | 'coalesce' | 'distinct' | 'standardize'>('trim');
  const [isRunning, setIsRunning] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);

  const queries = {
    trim: {
      sql: `SELECT 
  id, 
  TRIM(name) AS clean_name, 
  LOWER(email) AS clean_email, 
  country 
FROM users;`,
      descEn: 'Trim whitespace from names and lowercase emails for uniform search keys.',
      descVi: 'Loại bỏ khoảng trắng thừa ở tên và viết thường toàn bộ email để thống nhất đầu vào.'
    },
    coalesce: {
      sql: `SELECT 
  id, 
  name, 
  COALESCE(email, 'no-email@company.com') AS email, 
  COALESCE(age, 30) AS age, 
  COALESCE(status, 'unknown') AS status 
FROM users;`,
      descEn: 'Impute missing values using COALESCE with default values.',
      descVi: 'Điền dữ liệu khuyết thiếu bằng hàm COALESCE với giá trị mặc định tương ứng.'
    },
    distinct: {
      sql: `SELECT DISTINCT 
  TRIM(LOWER(name)) AS normalized_name, 
  LOWER(email) AS email, 
  country 
FROM users;`,
      descEn: 'Deduplicate records based on normalized names and lowercased emails.',
      descVi: 'Loại bỏ hoàn toàn các bản ghi trùng lặp dựa trên tên đã chuẩn hóa và email.'
    },
    standardize: {
      sql: `SELECT 
  id, 
  name, 
  CASE 
    WHEN country IN ('US', 'United States', 'USA') THEN 'United States'
    WHEN country IN ('UK', 'GB') THEN 'United Kingdom'
    ELSE country 
  END AS standardized_country 
FROM users;`,
      descEn: 'Standardize inconsistent country representations using a CASE WHEN block.',
      descVi: 'Chuẩn hóa định dạng tên quốc gia không nhất quán bằng cấu trúc điều kiện CASE WHEN.'
    }
  };

  // Run the mock SQL query client-side
  const queryResult = useMemo(() => {
    if (!hasExecuted) return [];

    switch (queryKey) {
      case 'trim':
        return RAW_DATASET.map(row => ({
          id: row.id,
          clean_name: row.name ? row.name.trim() : null,
          clean_email: row.email ? row.email.toLowerCase() : null,
          country: row.country
        }));
      case 'coalesce':
        return RAW_DATASET.map(row => ({
          id: row.id,
          name: row.name,
          email: row.email || 'no-email@company.com',
          age: row.age || 30,
          status: row.status || 'unknown'
        }));
      case 'distinct': {
        const seen = new Set<string>();
        const res: any[] = [];
        RAW_DATASET.forEach(row => {
          const normName = row.name ? row.name.trim().toLowerCase() : '';
          const normEmail = row.email ? row.email.trim().toLowerCase() : '';
          const key = `${normName}|${normEmail}`;
          if (!seen.has(key)) {
            seen.add(key);
            res.push({
              normalized_name: row.name ? row.name.trim() : null,
              email: row.email ? row.email.toLowerCase() : null,
              country: row.country
            });
          }
        });
        return res;
      }
      case 'standardize':
        return RAW_DATASET.map(row => {
          let stdCountry = row.country;
          if (row.country === 'US' || row.country === 'United States') stdCountry = 'United States';
          if (row.country === 'UK') stdCountry = 'United Kingdom';
          return {
            id: row.id,
            name: row.name,
            standardized_country: stdCountry
          };
        });
      default:
        return RAW_DATASET;
    }
  }, [queryKey, hasExecuted]);

  const handleRunQuery = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasExecuted(true);
    }, 500);
  };

  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <div className="my-8 rounded-[1.5rem] border overflow-hidden" style={{ borderColor: borderCol, background: isDark ? 'rgba(10,10,10,0.3)' : 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)' }}>
      {/* Top Selector Bar */}
      <div className="p-4 md:p-6 border-b flex flex-wrap items-center justify-between gap-4" style={{ borderColor: borderCol }}>
        <div className="flex flex-wrap gap-2">
          {Object.keys(queries).map((key) => {
            const label = key === 'trim'
              ? (isVi ? '1. Hàm TRIM / LOWER' : '1. TRIM / LOWER Strings')
              : key === 'coalesce'
              ? (isVi ? '2. Hàm COALESCE' : '2. Impute COALESCE')
              : key === 'distinct'
              ? (isVi ? '3. DISTINCT Loại trùng' : '3. DISTINCT Deduplicate')
              : (isVi ? '4. Phân nhóm CASE WHEN' : '4. CASE WHEN Standardize');
            return (
              <button
                key={key}
                onClick={() => { setQueryKey(key as any); setHasExecuted(false); }}
                className={`px-3 py-2 text-xs font-extrabold rounded-lg transition-all ${
                  queryKey === key
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleRunQuery}
          disabled={isRunning}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 text-white font-black text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isRunning ? (isVi ? 'Đang truy vấn...' : 'Running...') : (isVi ? 'Chạy Truy vấn' : 'Run Query')}
        </button>
      </div>

      {/* Editor & Explanation Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border-b" style={{ borderColor: borderCol }}>
        {/* Mock SQL Query Console */}
        <div className="lg:col-span-3 p-6 bg-neutral-950 font-mono text-xs text-sky-400 min-h-[140px] flex flex-col justify-between">
          <pre className="whitespace-pre-wrap select-all">{queries[queryKey].sql}</pre>
          <div className="text-[10px] text-neutral-600 border-t border-neutral-800 pt-3 mt-4">
            -- PostgreSQL / SQLite Clean Engine Sandbox
          </div>
        </div>

        {/* Explain Pane */}
        <div className="lg:col-span-2 p-6 flex flex-col justify-between bg-neutral-900/10 dark:bg-white/5">
          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-widest text-neutral-500 mb-2">
              {isVi ? 'Mục tiêu làm sạch' : 'Cleaning Objective'}
            </h5>
            <p className="text-xs leading-relaxed text-neutral-400">
              {isVi ? queries[queryKey].descVi : queries[queryKey].descEn}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-sky-400 font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>
              {isVi ? 'Ấn "Chạy Truy vấn" để xem kết quả chuyển đổi.' : 'Click "Run Query" to process raw dataset.'}
            </span>
          </div>
        </div>
      </div>

      {/* Tables Dashboard */}
      <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Raw (Dirty) Dataset */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-black uppercase text-rose-500 tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              {isVi ? 'Bảng Dữ liệu Thô (Dirty RAW Table)' : 'Raw (Dirty) Dataset'}
            </span>
            <span className="text-[10px] font-mono text-neutral-500">FROM users</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-700/30">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-800/50 text-neutral-500 text-[10px] border-b border-neutral-800">
                  <th className="p-2.5">id</th>
                  <th className="p-2.5">name</th>
                  <th className="p-2.5">email</th>
                  <th className="p-2.5">country</th>
                  <th className="p-2.5">age</th>
                  <th className="p-2.5">status</th>
                </tr>
              </thead>
              <tbody>
                {RAW_DATASET.map((row) => {
                  const isDup = row.id === 3;
                  return (
                    <tr 
                      key={row.id} 
                      className={`border-b border-neutral-800/40 text-neutral-300 ${
                        isDup && queryKey === 'distinct' && hasExecuted ? 'opacity-30 line-through bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="p-2.5 text-neutral-500">{row.id}</td>
                      <td className={`p-2.5 ${row.name?.startsWith(' ') || row.name?.endsWith(' ') ? 'bg-amber-500/10 text-amber-300' : ''}`}>
                        "{row.name}"
                      </td>
                      <td className={`p-2.5 ${!row.email ? 'bg-rose-500/10 text-rose-400' : row.email !== row.email.toLowerCase() ? 'bg-amber-500/10 text-amber-300' : ''}`}>
                        {row.email || 'NULL'}
                      </td>
                      <td className={`p-2.5 ${row.country === 'United States' ? 'bg-amber-500/10 text-amber-300' : ''}`}>{row.country}</td>
                      <td className={`p-2.5 ${!row.age ? 'bg-rose-500/10 text-rose-400' : ''}`}>{row.age || 'NULL'}</td>
                      <td className={`p-2.5 ${row.status === 'Active' || !row.status ? 'bg-amber-500/10 text-amber-300' : ''}`}>{row.status || 'NULL'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cleaned Dataset Output */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-black uppercase text-emerald-500 tracking-wider flex items-center gap-1">
              {hasExecuted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {isVi ? 'Kết quả sau xử lý (CLEANED Output)' : 'Cleaned Output Table'}
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              {hasExecuted ? `Rows: ${queryResult.length}` : 'Waiting...'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-700/30 bg-neutral-900/20 min-h-[220px] flex flex-col justify-start">
            <AnimatePresence mode="wait">
              {!hasExecuted ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-500 text-xs">
                  <Play className="w-8 h-8 text-neutral-600 mb-2 animate-bounce" />
                  <span>
                    {isVi ? 'Ấn Run Query để tiến hành xử lý dữ liệu thô.' : 'Press Run Query to trigger SQL engine execution.'}
                  </span>
                </div>
              ) : (
                <motion.table 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full text-left text-xs font-mono"
                >
                  <thead>
                    <tr className="bg-neutral-800/40 text-neutral-500 text-[10px] border-b border-neutral-800">
                      {Object.keys(queryResult[0] || {}).map((col) => (
                        <th key={col} className="p-2.5">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.map((row: any, rIdx: number) => (
                      <tr key={rIdx} className="border-b border-neutral-800/35 text-slate-300 hover:bg-sky-500/5">
                        {Object.values(row).map((val: any, cIdx: number) => {
                          const isImputed = (queryKey === 'coalesce' && (val === 30 || val === 'no-email@company.com' || val === 'unknown'));
                          const isStandardized = (queryKey === 'standardize' && val === 'United States');
                          const isTrimmed = (queryKey === 'trim' && (cIdx === 1 || cIdx === 2));
                          
                          return (
                            <td 
                              key={cIdx} 
                              className={`p-2.5 ${
                                isImputed 
                                  ? 'text-sky-400 font-extrabold bg-sky-500/5' 
                                  : isStandardized
                                  ? 'text-emerald-400 font-extrabold bg-emerald-500/5'
                                  : isTrimmed
                                  ? 'text-purple-400 font-semibold'
                                  : ''
                              }`}
                            >
                              {val === null ? 'NULL' : typeof val === 'string' ? `"${val}"` : val}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </motion.table>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
