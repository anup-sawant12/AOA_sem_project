import React, { useState } from 'react';
import Card from '../common/Card';
import { BookOpen, ChevronDown, ChevronUp, Clock, HardDrive, CheckCircle2 } from 'lucide-react';

export default function FractionalKnapsackTheory() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card
      title="How Fractional Knapsack Works"
      subtitle="Theoretical foundations, greedy choice property, and complexity analysis"
      icon={BookOpen}
      action={
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          {isOpen ? (
            <>
              Hide Guide <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Show Guide <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      }
      bodyClassName={isOpen ? 'p-5' : 'hidden'}
    >
      <div className="space-y-4 text-slate-700 text-xs leading-relaxed">
        {/* Problem Statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <h4 className="font-semibold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              The Problem Statement
            </h4>
            <p>
              Given <strong>n</strong> items with weights <code>wᵢ</code> and values <code>vᵢ</code>, and a knapsack of capacity <strong>W</strong>.
            </p>
            <p className="mt-1.5">
              Unlike 0/1 knapsack where items are indivisible, here we are allowed to take arbitrary fractions <code className="text-indigo-700 font-semibold">xᵢ ∈ [0, 1]</code> of any item.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <h4 className="font-semibold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              The Greedy Choice Property
            </h4>
            <p>
              Because items can be broken down into fractional units, taking the item with the <strong>highest value per unit weight</strong> (density ratio) is guaranteed to yield the global optimum.
            </p>
            <p className="mt-1 font-mono text-indigo-700 bg-indigo-50/60 px-2 py-0.5 rounded border border-indigo-100 inline-block">
              ratio = value / weight
            </p>
          </div>
        </div>

        {/* Algorithm Steps */}
        <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
          <h4 className="font-semibold text-indigo-950 text-sm">
            Step-by-Step Greedy Algorithm
          </h4>
          <ol className="list-decimal list-inside space-y-1.5 text-indigo-900">
            <li><strong>Compute density:</strong> For each item <code>i</code>, compute <code>ratio = vᵢ / wᵢ</code>.</li>
            <li><strong>Sort:</strong> Sort all items in descending order of ratio (<code>ratio[0] ≥ ratio[1] ≥ ...</code>).</li>
            <li><strong>Pack:</strong> Iterate through the sorted items:
              <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5 text-slate-700">
                <li>If <code>wᵢ ≤ W_remaining</code>, take the full item (<code>xᵢ = 1</code>) and subtract <code>wᵢ</code> from capacity.</li>
                <li>Otherwise, take fraction <code>xᵢ = W_remaining / wᵢ</code>, fill the knapsack, and stop.</li>
              </ul>
            </li>
          </ol>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Time Complexity: O(n log n)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Dominated by the comparison sort of <em>n</em> items. If items are already sorted, the packing phase takes <strong>O(n)</strong>.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
            <HardDrive className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Space Complexity: O(n)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                To store item ratios and sorted indices. No dynamic programming matrix is required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
