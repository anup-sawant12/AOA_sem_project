import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import { Table, Check, ArrowDown, ArrowUpRight, Compass } from 'lucide-react';

export default function KnapsackTable({
  items,
  capacity,
  currentStep,
  totalSteps,
}) {
  if (!currentStep || !currentStep.table) {
    return (
      <Card
        title="Dynamic Programming Table"
        subtitle="Visualization matrix DP[i][w]"
        icon={Table}
        className="min-h-[420px] flex flex-col justify-center items-center text-slate-400"
      >
        <p className="text-sm">Click "Generate Visualization" to build the DP Table.</p>
      </Card>
    );
  }

  const {
    phase,
    row: activeRow,
    col: activeCol,
    excludeCell,
    includeCell,
    table,
    backtrackPath = [],
    selectedItemIds = [],
    comparedRow,
    comparedCol
  } = currentStep;

  const numItems = items.length;
  const isBacktrackPhase = phase === 'backtrack' || phase === 'backtrack_start' || phase === 'complete';

  // Helper to check if a cell is part of the backtracking path
  const isCellInBacktrackPath = (r, c) => {
    return backtrackPath.some(pt => pt.row === r && pt.col === c);
  };

  return (
    <Card
      title="Dynamic Programming Table"
      subtitle={`Matrix dimensions: (${numItems} + 1) items × (${capacity} + 1) capacities`}
      icon={Table}
      action={
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-600 inline-block shadow-2xs"></span>
            <span className="text-slate-600 font-medium">Current Cell</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-100 border border-amber-400 inline-block"></span>
            <span className="text-slate-600 font-medium">Don't Take (DP[i-1][w])</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-100 border border-purple-400 inline-block"></span>
            <span className="text-slate-600 font-medium">Take (DP[i-1][w-wᵢ])</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
            <span className="text-slate-600 font-medium">Backtrack Path</span>
          </div>
        </div>
      }
      bodyClassName="p-3"
    >
      <div className="overflow-x-auto max-w-full pb-2">
        <table className="border-collapse select-none mx-auto min-w-full text-center">
          <thead>
            {/* Top row: Capacity header */}
            <tr>
              <th
                rowSpan={2}
                className="p-2 border border-slate-200 bg-slate-100 text-slate-700 font-semibold text-xs sticky left-0 z-20"
              >
                Item \ Cap
              </th>
              <th
                colSpan={capacity + 1}
                className="py-1.5 px-3 border border-slate-200 bg-slate-100 text-slate-700 font-semibold text-xs uppercase tracking-wider"
              >
                Knapsack Capacity (w)
              </th>
            </tr>
            <tr>
              {Array.from({ length: capacity + 1 }, (_, w) => {
                const isColumnActive = activeCol === w;
                return (
                  <th
                    key={`header-w-${w}`}
                    className={`py-1 px-2 border border-slate-200 font-mono text-xs font-semibold transition-colors min-w-[46px] ${
                      isColumnActive
                        ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                        : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    {w}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: numItems + 1 }, (_, i) => {
              const item = i > 0 ? items[i - 1] : null;
              const isRowActive = activeRow === i;

              return (
                <tr key={`row-${i}`} className="group">
                  {/* Row Header (Item details) */}
                  <th
                    className={`py-2 px-2.5 border border-slate-200 text-left font-sans text-xs transition-colors sticky left-0 z-10 whitespace-nowrap ${
                      isRowActive
                        ? 'bg-indigo-50 text-indigo-950 font-semibold border-indigo-300'
                        : 'bg-slate-50/90 text-slate-700'
                    }`}
                  >
                    {i === 0 ? (
                      <span className="font-semibold text-slate-500">0 (Base)</span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">#{i}</span>
                        <span className="text-[11px] text-slate-500 font-normal">
                          (w:{item.weight}, v:{item.value})
                        </span>
                      </div>
                    )}
                  </th>

                  {/* DP Table cells */}
                  {Array.from({ length: capacity + 1 }, (_, w) => {
                    const value = table[i] ? table[i][w] : null;
                    const isCalculated = value !== null;

                    // Compute cell roles
                    const isCurrentCell = activeRow === i && activeCol === w;
                    
                    const isExcludeCell = 
                      !isBacktrackPhase && 
                      excludeCell && 
                      excludeCell.row === i && 
                      excludeCell.col === w;

                    const isIncludeCell = 
                      !isBacktrackPhase && 
                      includeCell && 
                      includeCell.row === i && 
                      includeCell.col === w;

                    const isBacktrackActive = 
                      isBacktrackPhase && 
                      activeRow === i && 
                      activeCol === w;

                    const isBacktrackCompared = 
                      isBacktrackPhase && 
                      comparedRow === i && 
                      comparedCol === w;

                    const inBacktrackTrail = isCellInBacktrackPath(i, w);

                    // Determine cell styling
                    let cellBg = 'bg-white';
                    let cellText = 'text-slate-700';
                    let cellBorder = 'border-slate-200';
                    let cellRing = '';

                    if (isCurrentCell && !isBacktrackPhase) {
                      cellBg = 'bg-indigo-600 text-white shadow-md font-bold';
                      cellText = 'text-white font-bold';
                      cellBorder = 'border-indigo-700';
                      cellRing = 'ring-2 ring-indigo-400 ring-offset-1 z-10';
                    } else if (isBacktrackActive) {
                      cellBg = 'bg-emerald-600 text-white font-bold shadow-md';
                      cellText = 'text-white font-bold';
                      cellBorder = 'border-emerald-700';
                      cellRing = 'ring-2 ring-emerald-400 ring-offset-1 z-10';
                    } else if (isBacktrackCompared) {
                      cellBg = 'bg-amber-50 text-amber-900 border-dashed border-2 border-amber-400 font-semibold';
                    } else if (inBacktrackTrail) {
                      cellBg = 'bg-emerald-50 text-emerald-900 font-semibold border-emerald-300';
                    } else if (isIncludeCell && isExcludeCell) {
                      // Edge case if both point to same cell
                      cellBg = 'bg-gradient-to-r from-amber-100 to-purple-100 border-amber-400 font-semibold text-slate-900';
                    } else if (isExcludeCell) {
                      cellBg = 'bg-amber-100/90 text-amber-950 font-semibold border-amber-400';
                    } else if (isIncludeCell) {
                      cellBg = 'bg-purple-100/90 text-purple-950 font-semibold border-purple-400';
                    } else if (i === 0 || w === 0) {
                      cellBg = 'bg-slate-100/60 text-slate-500 font-mono';
                    } else if (!isCalculated) {
                      cellBg = 'bg-slate-50/40 text-slate-300 font-mono';
                    }

                    return (
                      <td
                        key={`cell-${i}-${w}`}
                        className={`relative p-2 border ${cellBorder} ${cellBg} ${cellRing} transition-all duration-150 h-10 min-w-[46px] font-mono text-xs`}
                      >
                        <AnimatePresence mode="wait">
                          {isCalculated ? (
                            <motion.span
                              key={`val-${value}`}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="inline-block"
                            >
                              {value}
                            </motion.span>
                          ) : (
                            <span className="text-slate-300 select-none">·</span>
                          )}
                        </AnimatePresence>

                        {/* Badges and markers */}
                        {isCurrentCell && !isBacktrackPhase && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                          </span>
                        )}

                        {isBacktrackActive && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                          </span>
                        )}

                        {/* Backtracking path dot */}
                        {inBacktrackTrail && !isBacktrackActive && (
                          <div className="absolute bottom-0.5 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
