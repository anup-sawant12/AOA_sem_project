import React from 'react';
import Card from '../common/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowDownUp, Package, AlertCircle } from 'lucide-react';

export default function FractionalKnapsackVisualizer({ currentStep, capacity }) {
  if (!currentStep) {
    return (
      <Card title="Fractional Knapsack Visualizer" icon={Layers}>
        <div className="py-12 text-center text-slate-400 text-sm">
          Click "Generate Visualization" to start greedy fractional packing.
        </div>
      </Card>
    );
  }

  const { items = [], knapsackItems = [], currentItem, remainingCapacity, currentWeight, currentValue, phase } = currentStep;
  const isSorted = phase !== 'init';
  const cap = Number(capacity) || 50;
  const fillPercent = Math.min(100, Math.round((currentWeight / cap) * 100));

  return (
    <Card
      title="Fractional Knapsack Visualization"
      subtitle={isSorted ? "Items sorted by Value/Weight ratio (descending greedy order)" : "Initial Items & Calculated Density Ratios"}
      icon={Layers}
      action={
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-slate-500">Container:</span>
          <span className="font-mono font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
            {currentWeight} / {cap} kg ({fillPercent}%)
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* TOP: Ratio Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-600 flex items-center gap-1.5">
              <ArrowDownUp className="w-3.5 h-3.5 text-indigo-600" />
              Ratio Density Table {isSorted && <span className="text-emerald-600 font-normal">(Sorted Descending)</span>}
            </span>
            <span className="text-[11px] text-slate-400">
              Greedy criterion: ratio = v / w
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/80 text-slate-600 text-[11px] uppercase border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2 text-right">Weight (w)</th>
                  <th className="px-3 py-2 text-right">Value (v)</th>
                  <th className="px-3 py-2 text-right">Ratio (v/w)</th>
                  <th className="px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it, idx) => {
                  const isCurrent = currentItem && currentItem.id === it.id;
                  const inKnapsack = knapsackItems.find(k => k.id === it.id);

                  let statusBadge = (
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-600">
                      Pending
                    </span>
                  );

                  if (inKnapsack) {
                    if (inKnapsack.fraction >= 1) {
                      statusBadge = (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          100% Taken
                        </span>
                      );
                    } else {
                      statusBadge = (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          {inKnapsack.fractionPercent}% Fraction
                        </span>
                      );
                    }
                  } else if (isCurrent && currentStep.decision === 'skip') {
                    statusBadge = (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-rose-100 text-rose-700">
                        Skipped (Full)
                      </span>
                    );
                  }

                  return (
                    <motion.tr
                      key={it.id}
                      layout
                      transition={{ duration: 0.3 }}
                      className={`${
                        isCurrent
                          ? 'bg-indigo-50/80 font-medium ring-1 ring-indigo-400'
                          : inKnapsack
                            ? 'bg-emerald-50/30'
                            : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-3 py-2 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: it.color || '#6366f1' }}
                        />
                        <span className="font-semibold text-slate-800">{it.name}</span>
                      </td>
                      <td className="px-3 py-2 text-right font-mono">{it.weight} kg</td>
                      <td className="px-3 py-2 text-right font-mono text-slate-800">
                        ${it.value}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-indigo-700 bg-indigo-50/30">
                        {it.ratio.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-center">{statusBadge}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM: Visual Knapsack Container */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-600 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-indigo-600" />
              Knapsack Physical Container (Capacity: {cap} kg)
            </span>
            <span className="text-xs font-mono text-slate-500">
              Remaining: <strong className="text-indigo-700">{remainingCapacity} kg</strong>
            </span>
          </div>

          {/* Container Graphic */}
          <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>0 kg</span>
              <span>{Math.round(cap / 2)} kg (50%)</span>
              <span>{cap} kg (Max)</span>
            </div>

            {/* Horizontal Knapsack Tank */}
            <div className="relative h-14 bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-inner flex">
              {knapsackItems.map((kItem, idx) => {
                const widthPercent = (kItem.takenWeight / cap) * 100;
                const isFractional = kItem.fraction < 1;

                return (
                  <motion.div
                    key={kItem.id}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${widthPercent}%`, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className={`h-full relative flex flex-col items-center justify-center text-white px-2 border-r border-white/40 ${
                      isFractional ? 'striped-fraction-bg' : ''
                    }`}
                    style={{
                      backgroundColor: kItem.color || '#6366f1'
                    }}
                    title={`${kItem.name}: ${kItem.takenWeight} kg (${kItem.fractionPercent}%), Value: ${kItem.takenValue.toFixed(2)}`}
                  >
                    <span className="text-[11px] font-bold truncate max-w-full drop-shadow-sm">
                      {kItem.name}
                    </span>
                    <span className="text-[10px] font-mono opacity-90 drop-shadow-sm">
                      {isFractional ? `${kItem.takenWeight}kg (${kItem.fractionPercent}%)` : `${kItem.takenWeight}kg (100%)`}
                    </span>
                  </motion.div>
                );
              })}

              {remainingCapacity > 0 && (
                <div
                  className="h-full bg-slate-50/70 flex items-center justify-center text-slate-400 text-xs italic font-medium"
                  style={{ width: `${(remainingCapacity / cap) * 100}%` }}
                >
                  {remainingCapacity >= 10 ? `Empty: ${remainingCapacity} kg` : ''}
                </div>
              )}
            </div>

            {/* Current Knapsack Accumulated Stats */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-center">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Total Packed Weight
                </span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {currentWeight} / {cap} kg
                </span>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-center">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Accumulated Value
                </span>
                <span className="text-base font-bold text-emerald-600 font-mono">
                  ${Number(currentValue.toFixed(2))}
                </span>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-center">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Remaining Space
                </span>
                <span className="text-base font-bold text-indigo-600 font-mono">
                  {remainingCapacity} kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
