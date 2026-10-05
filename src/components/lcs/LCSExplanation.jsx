import React from 'react';
import Card from '../common/Card';
import { Calculator, CheckCircle2, XCircle, ArrowUpRight, ArrowUp, ArrowLeft, CornerDownRight } from 'lucide-react';

export default function LCSExplanation({ currentStep }) {
  if (!currentStep) {
    return (
      <Card
        title="Current Step Explanation"
        subtitle="Step-by-step LCS recurrence breakdown"
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
    char1,
    char2,
    char1Index,
    char2Index,
    isMatch,
    decisionType,
    diagonalCell,
    topCell,
    leftCell,
    calculatedValue,
    lcsStringSoFar,
    phase
  } = currentStep;

  return (
    <Card
      title="Step Explanation & Mathematical Reasoning"
      subtitle={description?.title || "LCS step"}
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

        {/* Character comparison if active */}
        {char1 && char2 && (
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-800 text-xs">
                Character Comparison: X[{char1Index + 1}] vs Y[{char2Index + 1}]
              </span>
              {isMatch ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Characters Match ('{char1}' == '{char2}')
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <XCircle className="w-3.5 h-3.5 text-slate-400" /> Characters Differ ('{char1}' ≠ '{char2}')
                </span>
              )}
            </div>

            {isMatch ? (
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-1">
                <span className="font-bold text-emerald-900 block text-xs">
                  Match Recurrence Formula:
                </span>
                <p className="font-mono text-emerald-800 text-xs">
                  DP[i][j] = DP[i - 1][j - 1] + 1
                </p>
                <p className="text-slate-600 text-[11px]">
                  Take the diagonal cell value ({diagonalCell ? diagonalCell.value : 0}) and increment by 1 = <strong>{calculatedValue}</strong>.
                </p>
              </div>
            ) : (
              topCell && leftCell && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                  <div className={`p-2.5 rounded-lg border ${
                    topCell.value >= leftCell.value 
                      ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <span className="text-[10px] font-sans uppercase block text-slate-500 mb-0.5">
                      Top Cell DP[i-1][j]:
                    </span>
                    <span>Value = {topCell.value}</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border ${
                    leftCell.value > topCell.value 
                      ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <span className="text-[10px] font-sans uppercase block text-slate-500 mb-0.5">
                      Left Cell DP[i][j-1]:
                    </span>
                    <span>Value = {leftCell.value}</span>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Backtracking status */}
        {phase === 'backtrack' && lcsStringSoFar !== undefined && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="font-semibold text-emerald-900 text-xs block mb-1">
              Backtracking Progress:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Reconstructed LCS so far:</span>
              <span className="font-mono font-bold text-sm text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                "{lcsStringSoFar}"
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
