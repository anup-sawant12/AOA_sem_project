import React from 'react';
import Card from '../common/Card';
import { motion } from 'framer-motion';
import { GitFork, Sparkles, Hash } from 'lucide-react';

export default function MatrixChainTable({
  dimensions,
  currentStep
}) {
  if (!currentStep) {
    return (
      <Card title="Matrix Chain DP Table" icon={GitFork}>
        <div className="py-12 text-center text-slate-400 text-sm">
          Click "Generate DP Table" to view diagonal chain computation.
        </div>
      </Card>
    );
  }

  const {
    n = dimensions.length - 1,
    mTable = [],
    sTable = [],
    activeCell,
    leftCell,
    rightCell,
    currentChainLength,
    currentK
  } = currentStep;

  return (
    <Card
      title="Dynamic Programming Cost & Split Tables"
      subtitle={`Triangular DP table evaluated diagonally by chain length (Current L = ${currentChainLength || 1})`}
      icon={GitFork}
      action={
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-slate-500">Target Cell:</span>
          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            {activeCell ? `m[${activeCell.row}][${activeCell.col}]` : 'm[1][n]'}
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* TOP: Chain Visualization */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-2">
            Matrix Multiplication Chain
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: n }).map((_, idx) => {
              const mIdx = idx + 1;
              const isIncludedInSubproblem =
                activeCell && mIdx >= activeCell.row && mIdx <= activeCell.col;
              const isLeftSubproblem =
                activeCell && currentK && mIdx >= activeCell.row && mIdx <= currentK;
              const isRightSubproblem =
                activeCell && currentK && mIdx > currentK && mIdx <= activeCell.col;

              return (
                <React.Fragment key={idx}>
                  <div
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                      isLeftSubproblem
                        ? 'bg-blue-100 border-blue-300 text-blue-900 font-bold shadow-2xs'
                        : isRightSubproblem
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold shadow-2xs'
                          : isIncludedInSubproblem
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="block font-bold">A{mIdx}</span>
                    <span className="text-[10px] text-slate-500">
                      {dimensions[idx]}×{dimensions[idx + 1]}
                    </span>
                  </div>
                  {idx < n - 1 && (
                    <span className="text-slate-400 font-bold text-xs">×</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          {currentK && activeCell && (
            <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Left subchain (A{activeCell.row}..A{currentK})</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ml-2"></span>
              <span>Right subchain (A{currentK + 1}..A{activeCell.col})</span>
            </div>
          )}
        </div>

        {/* DP Cost Table m[i][j] */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-600 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-600" />
              m[i][j] Table: Minimum Scalar Multiplications
            </span>
            <span className="text-[11px] text-slate-400">
              Only upper triangle (j ≥ i) is used
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-center border-collapse">
              <thead className="bg-slate-100/90 text-slate-600 font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-2 border-r border-slate-200 bg-slate-200/50">i \ j</th>
                  {Array.from({ length: n }).map((_, j) => (
                    <th key={j} className="p-2 border-r border-slate-200 min-w-[70px]">
                      j = {j + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {Array.from({ length: n }).map((_, rowIdx) => {
                  const i = rowIdx + 1;
                  return (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold bg-slate-100/80 border-r border-slate-200 text-slate-700">
                        i = {i}
                      </td>
                      {Array.from({ length: n }).map((_, colIdx) => {
                        const j = colIdx + 1;

                        if (j < i) {
                          // Unused lower triangle
                          return (
                            <td
                              key={j}
                              className="p-2 bg-slate-50/60 border-r border-slate-100 text-slate-300 select-none text-[11px]"
                            >
                              —
                            </td>
                          );
                        }

                        const val = mTable[i] ? mTable[i][j] : null;
                        const splitK = sTable[i] ? sTable[i][j] : null;

                        const isActive = activeCell && activeCell.row === i && activeCell.col === j;
                        const isLeft = leftCell && leftCell.row === i && leftCell.col === j;
                        const isRight = rightCell && rightCell.row === i && rightCell.col === j;
                        const isDiag = i === j;

                        let cellClass = 'bg-white text-slate-800';
                        if (isActive) {
                          cellClass = 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400 shadow-sm';
                        } else if (isLeft) {
                          cellClass = 'bg-blue-100 text-blue-900 font-semibold ring-1 ring-blue-300';
                        } else if (isRight) {
                          cellClass = 'bg-emerald-100 text-emerald-900 font-semibold ring-1 ring-emerald-300';
                        } else if (isDiag) {
                          cellClass = 'bg-slate-100/70 text-slate-500 font-medium';
                        } else if (val !== null) {
                          cellClass = 'bg-emerald-50/50 text-slate-900 font-semibold';
                        }

                        return (
                          <td
                            key={j}
                            className={`p-2.5 border-r border-slate-100 transition-colors ${cellClass}`}
                          >
                            <span className="block text-xs">
                              {val !== null ? val.toLocaleString() : '—'}
                            </span>
                            {splitK && !isDiag && (
                              <span
                                className={`text-[9px] block mt-0.5 ${
                                  isActive ? 'text-indigo-200' : 'text-slate-400'
                                }`}
                              >
                                split k={splitK}
                              </span>
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
        </div>
      </div>
    </Card>
  );
}
