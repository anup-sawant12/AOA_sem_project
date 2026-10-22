import React from 'react';
import Card from '../common/Card';
import { Award, Clock, HardDrive, GitFork, ArrowDownRight } from 'lucide-react';

export default function MatrixChainResult({
  minOperations,
  optimalParens,
  backtrackDetails = [],
  isVisible = false
}) {
  if (!isVisible) return null;

  return (
    <Card
      title="Optimal Parenthesization Summary"
      subtitle="Final result from Matrix Chain Dynamic Programming"
      icon={Award}
      className="border-emerald-300 ring-2 ring-emerald-500/20 shadow-md bg-gradient-to-b from-white to-emerald-50/20"
      headerClassName="px-5 py-3.5 border-b border-emerald-100 bg-emerald-50/60"
    >
      <div className="space-y-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-white border border-emerald-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold uppercase text-emerald-700 block mb-0.5">
              Minimum Multiplications
            </span>
            <span className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
              {Number(minOperations || 0).toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-0.5">
              Time Complexity
            </span>
            <span className="text-xl font-bold text-indigo-700 font-mono">
              O(n³)
            </span>
            <span className="text-[10px] text-slate-400 block">3 nested loops (L, i, k)</span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-0.5">
              Space Complexity
            </span>
            <span className="text-xl font-bold text-indigo-700 font-mono">
              O(n²)
            </span>
            <span className="text-[10px] text-slate-400 block">m and s DP tables</span>
          </div>
        </div>

        {/* Highlighted Optimal Parenthesization */}
        <div className="p-4 bg-white border-2 border-emerald-300 rounded-xl shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Optimal Parenthesization Order
          </span>
          <div className="font-mono text-xl sm:text-2xl font-black text-emerald-700 bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 text-center tracking-wide break-all">
            {optimalParens}
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            Multiply innermost parenthesized pairs first to minimize arithmetic operations.
          </p>
        </div>

        {/* Backtracking Split Tree Breakdown */}
        {backtrackDetails.length > 0 && (
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
            <div className="px-3.5 py-2 bg-slate-100/80 border-b border-slate-200 font-semibold text-slate-700 flex items-center gap-1.5">
              <ArrowDownRight className="w-3.5 h-3.5 text-indigo-600" />
              Reconstruction Steps from Split Table s:
            </div>
            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {backtrackDetails.map((b, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Step {idx + 1}:</span>
                  <span className="font-sans text-slate-700 text-xs">{b.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
