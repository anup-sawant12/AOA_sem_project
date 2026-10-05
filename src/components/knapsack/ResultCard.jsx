import React from 'react';
import Card from '../common/Card';
import { Award, PackageCheck, Scale, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function ResultCard({
  maxValue,
  selectedItems = [],
  totalWeight,
  capacity,
  isVisible = false
}) {
  if (!isVisible) return null;

  return (
    <Card
      title="Optimal Solution Summary"
      subtitle="Final result from 0/1 Knapsack Dynamic Programming"
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
              {maxValue}
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
              <span className="text-xs text-slate-500 font-mono">/ {capacity}</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-0.5">
              Knapsack Capacity
            </span>
            <span className="text-2xl font-bold text-slate-800 font-mono">
              {capacity}
            </span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-0.5">
              Items Selected
            </span>
            <span className="text-2xl font-bold text-indigo-600 font-mono">
              {selectedItems.length}
            </span>
          </div>
        </div>

        {/* Selected Items Detail List */}
        <div className="border border-emerald-200 rounded-lg overflow-hidden bg-white">
          <div className="px-3.5 py-2 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between text-xs font-semibold text-emerald-900">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              Items Included in the Knapsack:
            </span>
            <span className="text-emerald-700 font-normal">
              Remaining capacity: {capacity - totalWeight} units
            </span>
          </div>

          {selectedItems.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No items could be included given the capacity limit.
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
                      <span className="font-semibold text-slate-800">{item.name || `Item ${item.id}`}</span>
                      <span className="text-[11px] text-slate-500 ml-2">
                        (Weight: {item.weight}, Value: {item.value})
                      </span>
                    </div>
                  </div>
                  <div className="font-mono text-emerald-800 font-medium">
                    +{item.value} value
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
