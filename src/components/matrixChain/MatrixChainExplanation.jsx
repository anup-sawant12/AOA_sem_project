import React from 'react';
import Card from '../common/Card';
import { Calculator, Split, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export default function MatrixChainExplanation({ currentStep }) {
  if (!currentStep) {
    return (
      <Card
        title="Current Step Explanation"
        subtitle="Recurrence breakdown & split evaluation"
        icon={Calculator}
      >
        <div className="py-6 text-center text-slate-400 text-sm">
          No active step. Click "Generate DP Table" to begin.
        </div>
      </Card>
    );
  }

  const {
    description,
    activeCell,
    currentChainLength,
    currentK,
    candidateCalculation,
    candidateSplits = [],
    bestCostSoFar,
    bestKSoFar,
    optimalParens,
    phase
  } = currentStep;

  return (
    <Card
      title="Step Explanation & Candidate Split Analysis"
      subtitle={description?.title || "Recurrence step"}
      icon={Calculator}
    >
      <div className="space-y-4 text-xs">
        {/* Main description banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <h4 className="font-semibold text-slate-900 text-sm mb-1">{description?.title}</h4>
          <p className="text-slate-600 leading-relaxed">{description?.detail}</p>
          {description?.formula && (
            <div className="mt-2 font-mono text-[11px] text-indigo-700 bg-indigo-50/70 px-2 py-1 rounded border border-indigo-100">
              {description.formula}
            </div>
          )}
        </div>

        {/* Candidate Split Breakdown if computing */}
        {activeCell && currentK && (
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <Split className="w-3.5 h-3.5 text-indigo-600" />
                Testing Split k = {currentK} (A{activeCell.row}..A{currentK}) × (A{currentK + 1}..A{activeCell.col})
              </span>
              <span className="font-mono text-[11px] font-bold text-indigo-700">
                Current Best: {bestCostSoFar !== null ? `${bestCostSoFar.toLocaleString()} (k=${bestKSoFar})` : '—'}
              </span>
            </div>

            {candidateCalculation && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[11px]">
                <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-lg">
                  <span className="text-[10px] font-sans uppercase font-bold text-blue-800 block mb-0.5">
                    1. Left Subchain
                  </span>
                  <span className="text-blue-950 font-bold">{candidateCalculation.leftText}</span>
                </div>

                <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                  <span className="text-[10px] font-sans uppercase font-bold text-emerald-800 block mb-0.5">
                    2. Right Subchain
                  </span>
                  <span className="text-emerald-950 font-bold">{candidateCalculation.rightText}</span>
                </div>

                <div className="p-2.5 bg-purple-50/60 border border-purple-200 rounded-lg">
                  <span className="text-[10px] font-sans uppercase font-bold text-purple-800 block mb-0.5">
                    3. Outer Multiplication
                  </span>
                  <span className="text-purple-950 font-bold">{candidateCalculation.multText}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* All Splits Tested Table for Active Cell */}
        {candidateSplits.length > 0 && (
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-1.5">
              Tested Splits for m[{activeCell.row}][{activeCell.col}]:
            </span>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-slate-100 text-[10px] uppercase text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-2.5 py-1.5">Split (k)</th>
                    <th className="px-2.5 py-1.5 text-right">m[i][k]</th>
                    <th className="px-2.5 py-1.5 text-right">m[k+1][j]</th>
                    <th className="px-2.5 py-1.5 text-right">Scalar Mults</th>
                    <th className="px-2.5 py-1.5 text-right font-bold">Total Cost</th>
                    <th className="px-2.5 py-1.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidateSplits.map((cs) => {
                    const isCurrent = cs.k === currentK;
                    return (
                      <tr
                        key={cs.k}
                        className={`${
                          isCurrent
                            ? 'bg-indigo-50 font-semibold'
                            : cs.isMin
                              ? 'bg-emerald-50/40'
                              : ''
                        }`}
                      >
                        <td className="px-2.5 py-1.5">k = {cs.k}</td>
                        <td className="px-2.5 py-1.5 text-right">{cs.leftCost}</td>
                        <td className="px-2.5 py-1.5 text-right">{cs.rightCost}</td>
                        <td className="px-2.5 py-1.5 text-right">{cs.multCost.toLocaleString()}</td>
                        <td className="px-2.5 py-1.5 text-right font-bold text-slate-900">
                          {cs.totalCost.toLocaleString()}
                        </td>
                        <td className="px-2.5 py-1.5 text-center">
                          {cs.isMin ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-sans font-bold">
                              Minimum
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px] font-sans">
                              Suboptimal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
