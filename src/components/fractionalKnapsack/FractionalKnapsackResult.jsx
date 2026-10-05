import React from 'react';
import Card from '../common/Card';
import { Award, ShoppingBag, Clock, HardDrive, Percent } from 'lucide-react';

export default function FractionalKnapsackResult({
  maxValue,
  totalWeight,
  capacity,
  selectedItems = [],
  isVisible = false
}) {
  if (!isVisible) return null;

  return (
    <Card
      title="Optimal Solution Summary"
      subtitle="Final result from Greedy Fractional Knapsack"
      icon={Award}
      className="border-emerald-300 ring-2 ring-emerald-500/20 shadow-md bg-gradient-to-b from-white to-emerald-50/20"
      headerClassName="px-5 py-3.5 border-b border-emerald-100 bg-emerald-50/60"
    >
      <div className="space-y-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white border border-emerald-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold uppercase text-emerald-700 block mb-0.5">
              Maximum Value
            </span>
            <span className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
              ${Number(maxValue.toFixed(2))}
            </span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-0.5">
              Total Weight
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800 font-mono">
                {totalWeight}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ {capacity} kg</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-0.5">
              Time Complexity
            </span>
            <span className="text-lg font-bold text-indigo-700 font-mono">
              O(n log n)
            </span>
            <span className="text-[10px] text-slate-400 block">Due to sorting</span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-0.5">
              Space Complexity
            </span>
            <span className="text-lg font-bold text-indigo-700 font-mono">
              O(n)
            </span>
            <span className="text-[10px] text-slate-400 block">Array storage</span>
          </div>
        </div>

        {/* Selected Items Detail List */}
        <div className="border border-emerald-200 rounded-lg overflow-hidden bg-white">
          <div className="px-3.5 py-2 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between text-xs font-semibold text-emerald-900">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              Items In Knapsack & Selected Fractions:
            </span>
            <span className="text-emerald-700 font-mono">
              Remaining: {capacity - totalWeight} kg
            </span>
          </div>

          {selectedItems.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No items could be added to the knapsack.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {selectedItems.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between hover:bg-emerald-50/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px]">
                      ✓
                    </span>
                    <div>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-[11px] text-slate-500 ml-2">
                        (Weight taken: {item.takenWeight} kg)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-xs font-mono font-semibold rounded-full border ${
                      item.fractionPercent === 100 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {item.fractionPercent}% Taken
                    </span>
                    <span className="font-mono text-emerald-800 font-bold">
                      +${Number(item.takenValue.toFixed(2))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
