import React from 'react';
import Card from '../common/Card';
import { Award, Clock, HardDrive, CheckCircle2 } from 'lucide-react';

export default function LCSResult({
  str1,
  str2,
  lcsString,
  length,
  matchedIndices = { str1: [], str2: [] },
  isVisible = false
}) {
  if (!isVisible) return null;

  return (
    <Card
      title="LCS Solution Summary"
      subtitle="Final result from Longest Common Subsequence DP"
      icon={Award}
      className="border-emerald-300 ring-2 ring-emerald-500/20 shadow-md bg-gradient-to-b from-white to-emerald-50/20"
      headerClassName="px-5 py-3.5 border-b border-emerald-100 bg-emerald-50/60"
    >
      <div className="space-y-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-white border border-emerald-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold uppercase text-emerald-700 block mb-0.5">
              LCS Length
            </span>
            <span className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
              {length}
            </span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-0.5">
              Time Complexity
            </span>
            <span className="text-xl font-bold text-indigo-700 font-mono">
              O(m × n)
            </span>
            <span className="text-[10px] text-slate-400 block">DP matrix table filling</span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-0.5">
              Space Complexity
            </span>
            <span className="text-xl font-bold text-indigo-700 font-mono">
              O(m × n)
            </span>
            <span className="text-[10px] text-slate-400 block">(m+1) × (n+1) matrix</span>
          </div>
        </div>

        {/* Found Subsequence String */}
        <div className="p-4 bg-white border-2 border-emerald-300 rounded-xl shadow-sm text-center space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Longest Common Subsequence:
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-700 bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 tracking-widest">
            {lcsString ? `"${lcsString}"` : '(None)'}
          </div>
        </div>

        {/* Matching Character Alignment in original strings */}
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-2.5 text-xs">
          <span className="font-semibold text-slate-700 block">
            Character Alignments in Sequences:
          </span>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-500 w-16 text-[11px]">Str 1:</span>
            <div className="flex gap-1">
              {str1.split('').map((c, i) => {
                const isMatched = matchedIndices.str1?.includes(i);
                return (
                  <span
                    key={i}
                    className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                      isMatched
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {c}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-500 w-16 text-[11px]">Str 2:</span>
            <div className="flex gap-1">
              {str2.split('').map((c, i) => {
                const isMatched = matchedIndices.str2?.includes(i);
                return (
                  <span
                    key={i}
                    className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                      isMatched
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {c}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
