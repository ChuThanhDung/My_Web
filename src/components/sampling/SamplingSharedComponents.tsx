import type { ReactNode } from 'react';
import { BlockMath } from 'react-katex';
import { useIsDark } from '../../hooks/useIsDark';
import { CheckCircle2, XCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

// ── Section Container ──
export function Section({
  title,
  children,
  id,
  icon,
  accentColor = '#e2ff3b',
}: {
  title: string;
  children: ReactNode;
  id: string;
  icon?: string;
  accentColor?: string;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <div className="flex items-center gap-3 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-bold text-lg shadow-md"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #10b981)`,
            }}
          >
            {icon}
          </div>
        )}
        <h2 className="text-3xl font-extrabold text-neutral-850 dark:text-neutral-50 tracking-tight">
          {title}
        </h2>
      </div>
      <div className="space-y-5 text-neutral-600 dark:text-neutral-300 leading-relaxed text-base md:text-[1.05rem]">
        {children}
      </div>
    </section>
  );
}

// ── Custom Info/Warning/Tip Box ──
export function InfoBox({
  children,
  variant = 'info',
}: {
  children: ReactNode;
  variant?: 'info' | 'warning' | 'tip';
}) {
  const isDark = useIsDark();

  let borderColor = 'border-emerald-500';
  let bgColor = isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.05)';
  let Icon = Lightbulb;
  let iconColor = '#10b981';

  if (variant === 'warning') {
    borderColor = 'border-amber-500';
    bgColor = isDark ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.05)';
    Icon = AlertTriangle;
    iconColor = '#f59e0b';
  } else if (variant === 'tip') {
    borderColor = 'border-lime-400';
    bgColor = isDark ? 'rgba(226,255,59,0.04)' : 'rgba(226,255,59,0.05)';
    Icon = Lightbulb;
    iconColor = isDark ? '#e2ff3b' : '#84cc16';
  }

  return (
    <div
      className={`p-6 my-6 border-l-4 rounded-r-2xl backdrop-blur-md flex items-start gap-4 shadow-sm ${borderColor}`}
      style={{ backgroundColor: bgColor }}
    >
      <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: iconColor }} />
      <div className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
        {children}
      </div>
    </div>
  );
}

// ── Formula Presentation Card ──
export function FormulaCard({
  formula,
  title,
  variables,
}: {
  formula: string;
  title: string;
  variables: { name: string; desc: string }[];
}) {
  const isDark = useIsDark();

  const cardStyle = isDark
    ? { background: 'rgba(10,10,10,0.8)', border: '1px solid rgba(255,255,255,0.08)' }
    : { background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)' };

  return (
    <div className="rounded-2xl overflow-hidden shadow-md my-6" style={cardStyle}>
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 flex items-center justify-between">
        <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm md:text-base">
          {title}
        </h4>
        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-450 dark:text-neutral-400">
          Math Formula
        </span>
      </div>
      <div className="p-6">
        <div className="py-6 px-4 bg-neutral-50 dark:bg-black/50 rounded-xl overflow-x-auto shadow-inner flex items-center justify-center">
          <div className="text-xl md:text-2xl text-neutral-900 dark:text-white font-serif leading-none">
            <BlockMath math={formula} />
          </div>
        </div>

        {variables.length > 0 && (
          <div className="mt-5">
            <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-3">
              Where:
            </span>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs md:text-sm">
              {variables.map((v, i) => (
                <li key={i} className="flex items-start gap-2 py-1 text-neutral-600 dark:text-neutral-400">
                  <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded flex-shrink-0">
                    {v.name}
                  </span>
                  <span>{v.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Comparison Table ──
export function ComparisonTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 my-6 shadow-sm">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-neutral-100/80 dark:bg-neutral-900/80 text-xs md:text-sm font-bold text-neutral-700 dark:text-neutral-300 border-b border-neutral-250 dark:border-neutral-850">
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className="border-b last:border-0 border-neutral-100 dark:border-neutral-850 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors"
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-6 py-4 leading-relaxed">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Common Mistakes Checklist ──
export function CommonMistakes({
  items,
}: {
  items: { mistake: string; fix: string }[];
}) {
  const isDark = useIsDark();

  const cardStyle = isDark
    ? { background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,255,255,0.08)' }
    : { background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)' };

  return (
    <div className="rounded-2xl p-6 md:p-8 space-y-6" style={cardStyle}>
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 last:pb-0 border-b last:border-0 border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-3">
            <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-1">Common Pitfall</span>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{item.mistake}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block mb-1">Correct Approach</span>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 font-medium">{item.fix}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Summary Cards ──
export function SummaryCard({
  bullets,
}: {
  bullets: string[];
}) {
  const isDark = useIsDark();

  const bgGradient = isDark
    ? 'linear-gradient(135deg, rgba(226,255,59,0.08) 0%, rgba(16,185,129,0.02) 100%)'
    : 'linear-gradient(135deg, rgba(226,255,59,0.12) 0%, rgba(16,185,129,0.05) 100%)';

  const borderColor = isDark ? 'rgba(226,255,59,0.2)' : 'rgba(16,185,129,0.2)';

  return (
    <div
      className="rounded-2xl p-6 md:p-8 border shadow-sm relative overflow-hidden"
      style={{ background: bgGradient, borderColor }}
    >
      <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <span className="text-xs font-bold text-emerald-600 dark:text-lime-400 uppercase tracking-wider block mb-4">
        Mini-Summary Checklist
      </span>
      <ul className="space-y-3">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm md:text-base text-neutral-700 dark:text-neutral-200 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-lime-400 flex-shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Step-by-Step Guide ──
export function StepGuide({
  steps,
}: {
  steps: { title: string; desc: string }[];
}) {
  const isDark = useIsDark();

  return (
    <div className="relative pl-6 md:pl-8 border-l border-neutral-200 dark:border-neutral-800 space-y-8 my-8 ml-4">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="relative"
        >
          {/* Step Number Dot */}
          <div
            className="absolute -left-[39px] md:-left-[47px] top-0 w-8 h-8 rounded-full border flex items-center justify-center font-extrabold text-sm shadow-md"
            style={{
              background: isDark ? '#000000' : '#ffffff',
              color: isDark ? '#e2ff3b' : '#10b981',
              borderColor: isDark ? '#e2ff3b' : '#10b981',
            }}
          >
            {i + 1}
          </div>

          <h4 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-1">
            {step.title}
          </h4>
          <p className="text-sm md:text-base text-neutral-550 dark:text-neutral-400">
            {step.desc}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
