import React from 'react';
import Card from '../common/Card';
import { motion } from 'framer-motion';
import { Table, Check, ArrowDownLeft, CornerDownRight, ArrowUp, ArrowLeft } from 'lucide-react';

export default function LCSTable({
  str1,
  str2,
  currentStep
}) {
  if (!currentStep) {
    return (
      <Card title="LCS Dynamic Programming Table" icon={Table}>
        <div className="py-12 text-center text-slate-400 text-sm">
          Click "Generate DP Table" to start cell-by-cell LCS matching.
        </div>
      </Card>
    );
  }

  const {
    table = [],
    row: activeRow,
    col: activeCol,
    char1Index,
    char2Index,
    isMatch,
    diagonalCell,
    topCell,
    leftCell,
    backtrackPath = [],
    matchedIndices = { str1: [], str2: [] },
    phase
  } = currentStep;

  const m = str1.length;
  const n = str2.length;

  return (
    <Card
      title="Dynamic Programming Grid with Boundary Sequences"
      subtitle="DP[i][j] represents length of LCS between prefixes X[0..i-1] and Y[0..j-1]"
      icon={Table}
      action={
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-slate-500">Active Cell:</span>
          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            {activeRow !== null && activeCol !== null ? `DP[${activeRow}][${activeCol}]` : '—'}
          </span>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Dynamic Sequence Character Highlight Strip */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          {/* String 1 Display */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 w-16">
              Str 1 (X):
            </span>
            <div className="flex items-center gap-1">
              {str1.split('').map((char, idx) => {
                const isActive = char1Index === idx;
                const isSelectedInLCS = matchedIndices.str1?.includes(idx);
                return (
                  <span
                    key={idx}
                    className={`w-7 h-7 rounded-md font-mono font-bold text-xs flex items-center justify-center transition-all ${
                      isSelectedInLCS
                        ? 'bg-emerald-500 text-white shadow-xs ring-2 ring-emerald-300'
                        : isActive
                          ? isMatch
                            ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300 animate-pulse'
                            : 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </div>

          {/* String 2 Display */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 w-16">
              Str 2 (Y):
            </span>
            <div className="flex items-center gap-1">
              {str2.split('').map((char, idx) => {
                const isActive = char2Index === idx;
                const isSelectedInLCS = matchedIndices.str2?.includes(idx);
                return (
                  <span
                    key={idx}
                    className={`w-7 h-7 rounded-md font-mono font-bold text-xs flex items-center justify-center transition-all ${
                      isSelectedInLCS
                        ? 'bg-emerald-500 text-white shadow-xs ring-2 ring-emerald-300'
                        : isActive
                          ? isMatch
                            ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300 animate-pulse'
                            : 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* DP Matrix Table with Boundary Strings */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-center border-collapse">
            <thead className="bg-slate-100 font-mono text-[11px] border-b border-slate-200">
              {/* String 2 header characters */}
              <tr>
                <th className="p-2 border-r border-b border-slate-200 bg-slate-200/60" colSpan={2}>
                  X \ Y
                </th>
                <th className="p-2 border-r border-b border-slate-200 bg-slate-100 text-slate-400">
                  "" (0)
                </th>
                {str2.split('').map((char, idx) => {
                  const isActiveCol = char2Index === idx;
                  const isSelectedCol = matchedIndices.str2?.includes(idx);
                  return (
                    <th
                      key={idx}
                      className={`p-2 border-r border-b border-slate-200 transition-colors ${
                        isSelectedCol
                          ? 'bg-emerald-100 text-emerald-900 font-bold'
                          : isActiveCol
                            ? 'bg-indigo-100 text-indigo-900 font-bold ring-1 ring-indigo-300'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="block text-[10px] text-slate-400 font-normal">j = {idx + 1}</span>
                      <span className="text-sm font-bold">{char}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {Array.from({ length: m + 1 }).map((_, i) => {
                const charX = i > 0 ? str1[i - 1] : '""';
                const isActiveRow = char1Index === i - 1;
                const isSelectedRow = i > 0 && matchedIndices.str1?.includes(i - 1);

                return (
                  <tr key={i} className="hover:bg-slate-50/40">
                    {/* Index header */}
                    <td className="p-2 bg-slate-100/70 border-r border-slate-200 text-slate-400 text-[10px] w-8">
                      i = {i}
                    </td>

                    {/* Character header */}
                    <td
                      className={`p-2 font-bold border-r border-slate-200 text-xs w-10 ${
                        isSelectedRow
                          ? 'bg-emerald-100 text-emerald-900 font-bold'
                          : isActiveRow
                            ? 'bg-indigo-100 text-indigo-900 font-bold ring-1 ring-indigo-300'
                            : 'bg-slate-100/90 text-slate-800'
                      }`}
                    >
                      {charX}
                    </td>

                    {/* Table cells j = 0 to n */}
                    {Array.from({ length: n + 1 }).map((_, j) => {
                      const val = table[i] ? table[i][j] : null;

                      const isCurrent = activeRow === i && activeCol === j;
                      const isDiagonal = diagonalCell && diagonalCell.row === i && diagonalCell.col === j;
                      const isTop = topCell && topCell.row === i && topCell.col === j;
                      const isLeft = leftCell && leftCell.row === i && leftCell.col === j;
                      const isBacktrackCell = backtrackPath.some(pt => pt.row === i && pt.col === j);

                      let cellStyle = 'bg-white text-slate-800';

                      if (isCurrent) {
                        cellStyle = isMatch
                          ? 'bg-emerald-600 text-white font-black ring-2 ring-emerald-400 shadow-md'
                          : 'bg-indigo-600 text-white font-black ring-2 ring-indigo-400 shadow-md';
                      } else if (isDiagonal) {
                        cellStyle = 'bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-400';
                      } else if (isTop || isLeft) {
                        cellStyle = 'bg-amber-100 text-amber-950 font-bold ring-1 ring-amber-300';
                      } else if (isBacktrackCell) {
                        cellStyle = 'bg-emerald-50 text-emerald-900 font-bold border-emerald-200';
                      } else if (i === 0 || j === 0) {
                        cellStyle = 'bg-slate-50 text-slate-400 font-normal';
                      }

                      return (
                        <td
                          key={j}
                          className={`p-2.5 border-r border-slate-100 transition-all ${cellStyle}`}
                        >
                          <span className="text-xs font-semibold">
                            {val !== null ? val : '—'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600"></span>
            <span>Character Match (Diagonal + 1)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-200 border border-amber-300"></span>
            <span>Mismatch Candidates (Max Top/Left)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300"></span>
            <span>Backtracking Path</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
