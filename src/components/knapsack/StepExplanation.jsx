import React from 'react';
import Card from '../common/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ArrowRight, 
  Check, 
  X, 
  Scale, 
  Calculator, 
  CheckCircle2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function StepExplanation({ currentStep }) {
  if (!currentStep) {
    return (
      <Card
        title="Current Step Explanation"
        subtitle="Step-by-step mathematical reasoning"
        icon={Calculator}
      >
        <div className="py-6 text-center text-slate-400 text-sm">
          No active step. Click "Generate Visualization" to begin.
        </div>
      </Card>
    );
  }

  const { phase, row, col, currentItem, excludeCell, includeCell, selectedValue, decision, description } = currentStep;

  // Render initialization phase explanation
  if (phase === 'init') {
    return (
      <Card
        title="Step Explanation: Base Cases"
        subtitle="Boundary condition setup"
        icon={Calculator}
      >
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <h4 className="font-semibold text-slate-800 text-sm mb-1">{description.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{description.detail}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg">
              <span className="font-semibold text-indigo-900 block mb-1">Base Case 1: Row 0 (i = 0)</span>
              <span className="font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 inline-block mb-1">
                DP[0][w] = 0
              </span>
              <p className="text-slate-600 mt-1">If no items are available, 0 value can be collected regardless of knapsack capacity.</p>
            </div>
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg">
              <span className="font-semibold text-indigo-900 block mb-1">Base Case 2: Column 0 (w = 0)</span>
              <span className="font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 inline-block mb-1">
                DP[i][0] = 0
              </span>
              <p className="text-slate-600 mt-1">If knapsack capacity is 0, no items can be held, yielding a maximum value of 0.</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Render backtracking start phase
  if (phase === 'backtrack_start') {
    return (
      <Card
        title="Step Explanation: Backtracking Started"
        subtitle="Tracing optimal item combination from DP table"
        icon={RotateCcw}
      >
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <h4 className="font-semibold text-amber-950 text-sm">{description.title}</h4>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed mb-3">{description.detail}</p>
          <div className="text-xs font-mono bg-white p-2.5 rounded border border-amber-200 text-amber-900">
            Target starting cell: <strong>DP[{row}][{col}] = {currentStep.table[row][col]}</strong>
          </div>
        </div>
      </Card>
    );
  }

  // Render backtracking individual step
  if (phase === 'backtrack') {
    const { comparedRow, comparedCol, comparedValue, currentValue, isSelected, nextRow, nextCol } = currentStep;
    return (
      <Card
        title="Backtracking Decision"
        subtitle={`Analyzing Item ${row} at cell DP[${row}][${col}]`}
        icon={RotateCcw}
      >
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Current Cell */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-[11px] font-semibold uppercase text-emerald-700 block mb-1">
                Current Cell
              </span>
              <span className="font-mono text-sm font-bold text-emerald-900">
                DP[{row}][{col}] = {currentValue}
              </span>
            </div>

            {/* Compare With Above */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-[11px] font-semibold uppercase text-amber-700 block mb-1">
                Above Cell (Excluding Item)
              </span>
              <span className="font-mono text-sm font-bold text-amber-900">
                DP[{comparedRow}][{comparedCol}] = {comparedValue}
              </span>
            </div>

            {/* Decision */}
            <div className={`p-3 border rounded-lg ${
              isSelected ? 'bg-emerald-100/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[11px] font-semibold uppercase block mb-1">
                Decision for Item {row}
              </span>
              <div className="flex items-center gap-1.5 font-bold">
                {isSelected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-800">ITEM #{row} SELECTED</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">NOT SELECTED</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg leading-relaxed text-slate-700">
            <p>{description.decisionText}</p>
          </div>
        </div>
      </Card>
    );
  }

  // Render completed phase
  if (phase === 'complete') {
    return (
      <Card
        title="Optimization Completed"
        subtitle="Final algorithm summary"
        icon={CheckCircle2}
      >
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-sm text-emerald-900">Optimal Knapsack Solution Verified</span>
          </div>
          <p className="text-emerald-800 leading-relaxed">{description.detail}</p>
        </div>
      </Card>
    );
  }

  // Render DP cell computation phase
  const canInclude = currentStep.canInclude;

  return (
    <Card
      title="Current Step Dynamic Programming Explanation"
      subtitle={`Detailed calculation breakdown for cell DP[${row}][${col}]`}
      icon={Calculator}
    >
      <div className="space-y-4">
        {/* Cell & Item Meta Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-lg">
            <span className="text-[10px] uppercase font-semibold text-indigo-500 block">Current Cell</span>
            <span className="font-mono text-sm font-bold text-indigo-900">DP[{row}][{col}]</span>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Current Item</span>
            <span className="font-semibold text-slate-800">Item #{row}</span>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Item Weight (wᵢ)</span>
            <span className="font-mono font-semibold text-slate-800">{currentItem?.weight} (Capacity: {col})</span>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Item Value (vᵢ)</span>
            <span className="font-mono font-semibold text-emerald-700">+{currentItem?.value}</span>
          </div>
        </div>

        {/* Options Breakdown: Don't take vs Take */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Option 1: Don't take item */}
          <div className={`p-3 rounded-lg border transition-all ${
            decision === 'exclude' || decision === 'exclude_exceeds'
              ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300 shadow-2xs'
              : 'bg-slate-50/80 border-slate-200 opacity-80'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Option A: Don't take item #{row}
              </span>
              {(decision === 'exclude' || decision === 'exclude_exceeds') && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-semibold">
                  Chosen Choice
                </span>
              )}
            </div>
            <div className="font-mono text-slate-700 bg-white p-2 rounded border border-slate-200/80 mb-1">
              DP[{row - 1}][{col}] = <span className="font-bold text-amber-800">{excludeCell?.value}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Value is inherited directly from the best solution for capacity {col} without item #{row}.
            </p>
          </div>

          {/* Option 2: Take item */}
          <div className={`p-3 rounded-lg border transition-all ${
            decision === 'include'
              ? 'bg-purple-50/90 border-purple-300 ring-1 ring-purple-300 shadow-2xs'
              : 'bg-slate-50/80 border-slate-200 opacity-80'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Option B: Take item #{row}
              </span>
              {decision === 'include' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-200 text-purple-900 font-semibold">
                  Chosen Choice
                </span>
              )}
            </div>

            {canInclude ? (
              <>
                <div className="font-mono text-slate-700 bg-white p-2 rounded border border-slate-200/80 mb-1">
                  v[{row}] + DP[{row - 1}][{col} - {currentItem.weight}] = {currentItem.value} + {includeCell.value} = <span className="font-bold text-purple-800">{includeCell.total}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Item value ({currentItem.value}) plus the optimal value for the remaining capacity ({col - currentItem.weight}).
                </p>
              </>
            ) : (
              <div className="bg-rose-50 p-2 rounded border border-rose-200 text-rose-700 font-medium">
                Weight ({currentItem.weight}) &gt; Capacity ({col}) → Item cannot fit!
              </div>
            )}
          </div>
        </div>

        {/* Conclusion / Formula Result */}
        <div className="p-3 bg-indigo-900 text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
          <div className="text-xs">
            <span className="text-indigo-200 uppercase font-semibold text-[10px] block">Recurrence Applied</span>
            <span className="font-mono text-xs text-indigo-100">
              {canInclude 
                ? `DP[${row}][${col}] = max(${excludeCell.value}, ${includeCell.total})` 
                : `DP[${row}][${col}] = DP[${row - 1}][${col}] (weight exceeds capacity)`}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-indigo-200 font-medium">Result:</span>
            <span className="font-mono text-base font-bold bg-white text-indigo-900 px-3 py-1 rounded-md shadow-2xs">
              DP[{row}][{col}] = {selectedValue}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
