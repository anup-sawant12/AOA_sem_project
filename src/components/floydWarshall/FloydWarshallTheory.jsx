import React, { useState } from 'react';
import Card from '../common/Card';
import { BookOpen, ChevronDown, ChevronUp, Clock, HardDrive } from 'lucide-react';

export default function FloydWarshallTheory() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card
      title="How Floyd–Warshall Works"
      subtitle="All-pairs shortest paths, intermediate vertex dynamic programming, and cycle detection"
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
            Given a directed, weighted graph <strong>G = (V, E)</strong>. Find the shortest path distances between <strong>every pair of vertices (u, v)</strong>.
          </p>
          <p className="mt-1">
            Floyd–Warshall handles positive and negative edge weights, as long as there is <strong>no negative-weight cycle</strong>.
          </p>
        </div>

        {/* DP Recurrence */}
        <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
          <h4 className="font-semibold text-indigo-950 text-sm">
            Dynamic Programming Formulation
          </h4>
          <p className="text-indigo-900">
            Let <code>D^(k)[i][j]</code> be the shortest distance from vertex <code>i</code> to vertex <code>j</code> using only vertices from <code>{'{1, 2, ..., k}'}</code> as intermediate steps:
          </p>
          <div className="p-2.5 bg-white rounded border border-indigo-200 font-mono text-[11px] text-indigo-900 space-y-1">
            <div>dist[i][j] = min( dist[i][j], dist[i][k] + dist[k][j] )</div>
            <div className="text-slate-500 text-[10px]">
              For k = 1 to V, for i = 1 to V, for j = 1 to V
            </div>
          </div>
          <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px] mt-1">
            <strong>Negative Cycle Detection:</strong> If after V iterations any self-distance <code>dist[i][i] &lt; 0</code>, a negative cycle exists.
          </div>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Time Complexity: O(V³)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Three deeply nested loops iterating through all vertices: intermediate node <em>k</em>, start node <em>i</em>, destination node <em>j</em>.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
            <HardDrive className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Space Complexity: O(V²)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Two <em>V × V</em> matrices: distance matrix and predecessor/next matrix for path reconstruction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
