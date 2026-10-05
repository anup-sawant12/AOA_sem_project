import React, { useState } from 'react';
import Card from '../common/Card';
import { BookOpen, ChevronDown, ChevronUp, Clock, HardDrive, CheckCircle } from 'lucide-react';

export default function EducationalSection() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card
      title="How 0/1 Knapsack Works"
      subtitle="Theoretical foundations, recurrence relation, and complexity analysis"
      icon={BookOpen}
      action={
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
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
      <div className="space-y-5 text-slate-700 text-xs leading-relaxed">
        {/* Section 1: Problem Definition & Why 0/1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg">
            <h4 className="font-semibold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              The Problem Statement
            </h4>
            <p>
              Given <strong>n</strong> discrete items, each characterized by a weight <code className="text-slate-800">wᵢ</code> and a value <code className="text-slate-800">vᵢ</code>, along with a container with maximum capacity <strong>W</strong>.
            </p>
            <p className="mt-1.5">
              <strong>Objective:</strong> Choose a subset of items to maximize the total accumulated value without the sum of their weights exceeding capacity <strong>W</strong>.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg">
            <h4 className="font-semibold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              Why is it called "0/1"?
            </h4>
            <p>
              For each item <code className="text-slate-800">i</code>, we have binary decision variable <code className="text-slate-800">xᵢ ∈ {'{0, 1}'}</code>:
            </p>
            <ul className="mt-2 space-y-1 list-none">
              <li className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-purple-100 text-purple-800">xᵢ = 1</span>
                <span><strong>Take</strong> the item completely into the knapsack.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-800">xᵢ = 0</span>
                <span><strong>Don't take</strong> (leave) the item.</span>
              </li>
            </ul>
            <p className="mt-2 text-slate-500 italic">
              Items cannot be split or divided (unlike Fractional Knapsack which is solvable with Greedy).
            </p>
          </div>
        </div>

        {/* Section 2: DP State and Recurrence */}
        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3">
          <div>
            <h4 className="font-semibold text-indigo-950 text-sm mb-1">
              Dynamic Programming State Definition
            </h4>
            <p className="text-indigo-900">
              Let <code className="font-mono bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-800 font-semibold">DP[i][w]</code> represent the maximum value obtainable using a subset of the first <strong className="text-indigo-950">i</strong> items with available capacity <strong className="text-indigo-950">w</strong>.
            </p>
          </div>

          <div className="pt-2">
            <h5 className="font-semibold text-indigo-950 text-xs uppercase tracking-wider mb-2">
              Recurrence Relation:
            </h5>
            <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg font-mono text-xs overflow-x-auto shadow-inner leading-loose">
              <div className="text-slate-400">// Base Cases:</div>
              <div>DP[0][w] = 0 &nbsp;&nbsp;<span className="text-slate-400">(no items available)</span></div>
              <div>DP[i][0] = 0 &nbsp;&nbsp;<span className="text-slate-400">(zero capacity)</span></div>
              <div className="mt-2 text-slate-400">// If current item's weight exceeds remaining capacity:</div>
              <div className="text-amber-300">if (weight[i] &gt; w):</div>
              <div className="pl-4">DP[i][w] = DP[i - 1][w]</div>
              <div className="mt-2 text-slate-400">// Otherwise, take maximum of excluding or including item:</div>
              <div className="text-emerald-300">else:</div>
              <div className="pl-4 text-emerald-200 font-bold">
                DP[i][w] = max( DP[i - 1][w], &nbsp;value[i] + DP[i - 1][w - weight[i]] )
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Time and Space Complexity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-800 text-xs block">Time Complexity</span>
              <span className="font-mono text-sm font-bold text-indigo-700">O(n × W)</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                We compute each cell in the (n+1) × (W+1) matrix exactly once in O(1) constant time. (Pseudo-polynomial time).
              </p>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-800 text-xs block">Space Complexity</span>
              <span className="font-mono text-sm font-bold text-emerald-700">O(n × W)</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Full 2D table needed for visualization and backtracking of selected items. (Can be reduced to O(W) with 1D DP if only maximum value is needed).
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
