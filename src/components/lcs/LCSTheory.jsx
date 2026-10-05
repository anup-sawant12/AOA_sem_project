import React, { useState } from 'react';
import Card from '../common/Card';
import { BookOpen, ChevronDown, ChevronUp, Clock, HardDrive } from 'lucide-react';

export default function LCSTheory() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card
      title="How Longest Common Subsequence Works"
      subtitle="Recurrence relations, optimal substructure, and backtracking"
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
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <h4 className="font-semibold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            The Problem Statement
          </h4>
          <p>
            Given two strings <strong>X = x₁x₂...xₘ</strong> and <strong>Y = y₁y₂...yₙ</strong>.
          </p>
          <p className="mt-1">
            A <em>subsequence</em> is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.
          </p>
          <p className="mt-1">
            <strong>Goal:</strong> Find the length and characters of the longest sequence that appears as a subsequence in both strings.
          </p>
        </div>

        {/* DP Recurrence */}
        <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
          <h4 className="font-semibold text-indigo-950 text-sm">
            Dynamic Programming Recurrence
          </h4>
          <p className="text-indigo-900">
            Let <code>DP[i][j]</code> be the length of the LCS of <code>X[1..i]</code> and <code>Y[1..j]</code>:
          </p>
          <div className="p-2.5 bg-white rounded border border-indigo-200 font-mono text-[11px] text-indigo-900 space-y-1">
            <div>DP[i][0] = 0 and DP[0][j] = 0</div>
            <div>
              If X[i] == Y[j]: <strong className="text-emerald-700">DP[i][j] = DP[i-1][j-1] + 1</strong>
            </div>
            <div>
              If X[i] ≠ Y[j]: <strong className="text-amber-700">DP[i][j] = max(DP[i-1][j], DP[i][j-1])</strong>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            After filling the table, start at <code>DP[m][n]</code> and trace backwards to recover the characters.
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Time Complexity: O(m × n)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Each cell of the (m + 1) × (n + 1) table takes O(1) constant time to evaluate. Backtracking takes O(m + n).
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
            <HardDrive className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Space Complexity: O(m × n)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                To store the 2D table needed for full path reconstruction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
