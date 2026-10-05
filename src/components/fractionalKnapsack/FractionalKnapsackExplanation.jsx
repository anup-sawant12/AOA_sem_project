import React from 'react';
import Card from '../common/Card';
import { Calculator, ArrowRight, CheckCircle2, Split, AlertCircle, ShoppingBag } from 'lucide-react';

export default function FractionalKnapsackExplanation({ currentStep }) {
  if (!currentStep) {
    return (
      <Card
        title="Current Step Explanation"
        subtitle="Greedy decision breakdown"
        icon={Calculator}
      >
        <div className="py-6 text-center text-slate-400 text-sm">
          No active step. Click "Generate Visualization" to begin.
        </div>
      </Card>
    );
  }

  const { description, currentItem, remainingCapacity, decision, fractionSelected, valueAdded, weightAdded, phase } = currentStep;

  return (
    <Card
      title="Step Explanation & Reasoning"
      subtitle={description?.title || "Greedy algorithm step"}
      icon={Calculator}
    >
      <div className="space-y-3.5 text-xs">
        {/* Main description banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <h4 className="font-semibold text-slate-900 text-sm mb-1">{description?.title}</h4>
          <p className="text-slate-600 leading-relaxed">{description?.detail}</p>
        </div>

        {/* Current Item Evaluation Details */}
        {currentItem && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 bg-indigo-50/60 border border-indigo-100 rounded-lg">
              <span className="text-[10px] uppercase font-semibold text-indigo-700 block">
                Current Item
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {currentItem.name}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                Weight & Value
              </span>
              <span className="font-mono font-medium text-slate-800 text-xs">
                W: {currentItem.weight}kg | V: ${currentItem.value}
              </span>
            </div>

            <div className="p-2.5 bg-indigo-50/60 border border-indigo-100 rounded-lg">
              <span className="text-[10px] uppercase font-semibold text-indigo-700 block">
                Density Ratio (v/w)
              </span>
              <span className="font-mono font-bold text-indigo-700 text-sm">
                {currentItem.ratio.toFixed(2)}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                Remaining Capacity
              </span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                {remainingCapacity} kg
              </span>
            </div>
          </div>
        )}

        {/* Decision Breakdown */}
        {decision && (
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Greedy Action:
              </span>
              {decision === 'full' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Take Full Item (100%)
                </span>
              )}
              {decision === 'fraction' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  <Split className="w-3.5 h-3.5" /> Take Fractional Portion
                </span>
              )}
              {decision === 'skip' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5" /> Skip (Knapsack Capacity Full)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] uppercase text-slate-500 block font-sans">Fraction Selected</span>
                <span className="font-bold text-slate-800">{fractionSelected || '100%'}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] uppercase text-slate-500 block font-sans">Weight Added</span>
                <span className="font-bold text-slate-800">{weightAdded !== undefined ? `+${weightAdded} kg` : '—'}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] uppercase text-slate-500 block font-sans">Value Added</span>
                <span className="font-bold text-emerald-600">{valueAdded !== undefined ? `+$${Number(valueAdded).toFixed(2)}` : '—'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
