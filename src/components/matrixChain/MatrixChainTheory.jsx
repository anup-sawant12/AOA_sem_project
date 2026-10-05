import React, { useState } from 'react';
import Card from '../common/Card';
import { BookOpen, ChevronDown, ChevronUp, Clock, HardDrive } from 'lucide-react';

export default function MatrixChainTheory() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card
      title="How Matrix Chain DP Works"
      subtitle="Recurrence relation, diagonal ordering, and parenthesization"
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
            Given a sequence of <strong>n</strong> matrices <code>A₁, A₂, ..., Aₙ</code> where matrix <code>Aᵢ</code> has dimensions <code>pᵢ₋₁ × pᵢ</code>.
          </p>
          <p className="mt-1">
            Matrix multiplication is <strong>associative</strong> (e.g. <code>(A·B)·C = A·(B·C)</code>), but different parenthesizations yield vastly different scalar multiplication counts.
          </p>
          <p className="mt-1 text-slate-500 italic">
            <strong>Goal:</strong> Find the parenthesization that minimizes the total number of scalar arithmetic multiplications.
          </p>
        </div>

        {/* DP Recurrence */}
        <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
          <h4 className="font-semibold text-indigo-950 text-sm">
            Dynamic Programming Recurrence
          </h4>
          <p className="text-indigo-900">
            Let <code>m[i][j]</code> be the minimum scalar operations to multiply matrices <code>Aᵢ ... Aⱼ</code>:
          </p>
          <div className="p-2.5 bg-white rounded border border-indigo-200 font-mono text-[11px] text-indigo-900 space-y-1">
            <div>m[i][i] = 0 (Base case for single matrix)</div>
            <div>
              m[i][j] = min &#123; m[i][k] + m[k+1][j] + p[i-1] × p[k] × p[j] &#125;
            </div>
            <div className="text-slate-500 text-[10px]">for i ≤ k &lt; j</div>
          </div>
          <p className="text-[11px] text-slate-600">
            We store the optimal split point <code>k</code> in table <code>s[i][j]</code> for backtracking.
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Time Complexity: O(n³)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Outer loop on chain length <em>L</em> (2 to <em>n</em>), middle loop on row <em>i</em>, inner loop searching optimal split <em>k</em>.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
            <HardDrive className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Space Complexity: O(n²)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Two <em>n × n</em> 2D arrays: <code>m</code> for minimum costs and <code>s</code> for optimal split indices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
