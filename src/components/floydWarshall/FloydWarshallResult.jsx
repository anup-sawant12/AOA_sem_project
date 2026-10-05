import React, { useState } from 'react';
import Card from '../common/Card';
import { Award, AlertTriangle, ArrowRight, Route, Clock, HardDrive } from 'lucide-react';
import { reconstructPath } from '../../algorithms/floydWarshall';

export default function FloydWarshallResult({
  vertices = [],
  distMatrix = [],
  nextMatrix = [],
  hasNegativeCycle = false,
  isVisible = false
}) {
  const [sourceNode, setSourceNode] = useState(vertices[0] || 'A');
  const [targetNode, setTargetNode] = useState(vertices[vertices.length - 1] || 'D');

  if (!isVisible) return null;

  const V = vertices.length;
  const uIdx = vertices.indexOf(sourceNode);
  const vIdx = vertices.indexOf(targetNode);

  const queryDist =
    uIdx !== -1 && vIdx !== -1 && distMatrix[uIdx]
      ? distMatrix[uIdx][vIdx]
      : Infinity;

  const path =
    uIdx !== -1 && vIdx !== -1 && nextMatrix.length > 0 && !hasNegativeCycle
      ? reconstructPath(uIdx, vIdx, nextMatrix, vertices)
      : null;

  return (
    <Card
      title="All-Pairs Shortest Path Summary"
      subtitle="Final result from Floyd–Warshall Dynamic Programming"
      icon={Award}
      className={
        hasNegativeCycle
          ? 'border-rose-300 ring-2 ring-rose-500/20 bg-rose-50/20'
          : 'border-emerald-300 ring-2 ring-emerald-500/20 bg-gradient-to-b from-white to-emerald-50/20'
      }
      headerClassName={
        hasNegativeCycle
          ? 'px-5 py-3.5 border-b border-rose-100 bg-rose-50/60'
          : 'px-5 py-3.5 border-b border-emerald-100 bg-emerald-50/60'
      }
    >
      <div className="space-y-4">
        {/* Negative cycle alert if present */}
        {hasNegativeCycle ? (
          <div className="p-4 bg-rose-100 border border-rose-300 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900 text-sm">Negative Cycle Detected!</h4>
              <p className="text-xs text-rose-700 mt-1">
                A negative cycle exists in the graph (a node has <code>dist[i][i] &lt; 0</code>). Shortest paths are undefined as distance can decrease infinitely.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white border border-emerald-200 rounded-xl shadow-2xs">
              <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-0.5">
                Time Complexity
              </span>
              <span className="text-xl font-bold text-indigo-700 font-mono">
                O(V³)
              </span>
              <span className="text-[10px] text-slate-400 block">Triply-nested vertex loops</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-0.5">
                Space Complexity
              </span>
              <span className="text-xl font-bold text-indigo-700 font-mono">
                O(V²)
              </span>
              <span className="text-[10px] text-slate-400 block">V × V distance matrix</span>
            </div>
          </div>
        )}

        {/* Interactive Shortest Path Query between any 2 nodes */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-700 flex items-center gap-1.5">
              <Route className="w-4 h-4 text-indigo-600" />
              Interactive Path Query
            </span>
            <span className="text-[11px] text-slate-400">
              Query distance between any pair
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-500 font-sans">From:</span>
              <select
                value={sourceNode}
                onChange={(e) => setSourceNode(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-300 rounded font-bold text-slate-800"
              >
                {vertices.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400" />

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-500 font-sans">To:</span>
              <select
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-300 rounded font-bold text-slate-800"
              >
                {vertices.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                Shortest Distance:
              </span>
              <span className="font-mono text-xl font-black text-indigo-700">
                {queryDist === Infinity ? '∞ (No Path)' : queryDist}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                Reconstructed Path:
              </span>
              {path ? (
                <div className="flex items-center gap-1 font-mono font-bold text-emerald-800 text-xs mt-0.5">
                  {path.map((node, i) => (
                    <React.Fragment key={i}>
                      <span className="px-1.5 py-0.5 bg-emerald-100 rounded border border-emerald-200">
                        {node}
                      </span>
                      {i < path.length - 1 && <span className="text-slate-400">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic">No valid finite path</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
