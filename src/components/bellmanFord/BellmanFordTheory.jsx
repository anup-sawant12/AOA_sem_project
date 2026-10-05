import React, { useState } from 'react';
import Card from '../common/Card';
import { BookOpen, ChevronDown, ChevronUp, Clock, HardDrive } from 'lucide-react';

export default function BellmanFordTheory() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card
      title="How Bellman–Ford Works"
      subtitle="Single-source shortest paths, edge relaxations, and negative cycle detection"
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
            Given a weighted directed graph <strong>G = (V, E)</strong> and a source vertex <strong>S</strong>. Find the shortest path from <em>S</em> to all other vertices.
          </p>
          <p className="mt-1">
            Unlike Dijkstra's algorithm which greedily assumes non-negative edge weights, Bellman–Ford works correctly with <strong>negative edge weights</strong>.
          </p>
        </div>

        {/* Algorithm Mechanics */}
        <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
          <h4 className="font-semibold text-indigo-950 text-sm">
            Why (V - 1) Iterations?
          </h4>
          <p className="text-indigo-900">
            A simple shortest path in any graph with <em>V</em> vertices contains at most <strong>V - 1 edges</strong>.
          </p>
          <div className="p-2.5 bg-white rounded border border-indigo-200 font-mono text-[11px] text-indigo-900 space-y-1">
            <div>Initialize: dist[source] = 0, all other dist = ∞</div>
            <div>Repeat (V - 1) times:</div>
            <div className="pl-4">For each edge (u, v) with weight w:</div>
            <div className="pl-8">if dist[u] + w &lt; dist[v] then dist[v] = dist[u] + w</div>
          </div>
          <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px] mt-1">
            <strong>Negative Cycle Check (V-th Pass):</strong> If any edge can still relax after <em>V - 1</em> passes, a negative cycle exists.
          </div>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Time Complexity: O(V · E)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                (V - 1) outer passes, with each pass checking all <em>E</em> directed edges.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
            <HardDrive className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Space Complexity: O(V)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Only requires 1D distance and predecessor arrays of size <em>V</em>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
