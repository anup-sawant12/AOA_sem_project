import React from 'react';
import Card from '../common/Card';
import { Route, CheckCircle, XCircle, ArrowDown, CornerDownRight } from 'lucide-react';

export default function BacktrackingView({
  steps = [],
  currentStepIndex = 0,
  items = [],
  capacity = 0,
}) {
  // Extract all backtracking steps up to current step
  const backtrackSteps = steps
    .filter(s => s.phase === 'backtrack' || s.phase === 'backtrack_start')
    .filter(s => s.stepIndex <= currentStepIndex);

  if (backtrackSteps.length === 0) return null;

  return (
    <Card
      title="Backtracking Decision Path"
      subtitle="Visual trail determining the optimal subset of items from DP table"
      icon={Route}
      className="border-emerald-200/80 bg-slate-50/40"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>Target Start: DP[{items.length}][{capacity}]</span>
          <span>→</span>
          <span>Traversing backwards to Item 1</span>
        </div>

        <div className="space-y-2">
          {backtrackSteps.map((step, idx) => {
            if (step.phase === 'backtrack_start') {
              return (
                <div
                  key="start-node"
                  className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs flex items-center justify-between"
                >
                  <span className="font-semibold text-indigo-900">
                    🏁 Start Backtracking at DP[{step.row}][{step.col}] = {step.table[step.row][step.col]}
                  </span>
                  <span className="text-[11px] text-indigo-600 font-mono">Capacity = {step.col}</span>
                </div>
              );
            }

            const { row, col, comparedValue, currentValue, isSelected, nextCol } = step;
            const resolvedItem = step.currentItem || step.item || (items && items[row - 1]) || {};
            return (
              <div
                key={step.id || idx}
                className={`p-2.5 rounded-lg border text-xs transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-semibold text-slate-800">
                      Item #{row} (w:{resolvedItem.weight ?? '—'}, v:{resolvedItem.value ?? '—'})
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isSelected ? 'INCLUDED' : 'NOT INCLUDED'}
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 font-mono">
                  <span>DP[{row}][{col}] ({currentValue}) {isSelected ? '≠' : '='} DP[{row - 1}][{col}] ({comparedValue})</span>
                  {isSelected && (
                    <span className="text-emerald-700 font-semibold">
                      New Capacity: {col} - {resolvedItem.weight ?? 0} = {nextCol}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
