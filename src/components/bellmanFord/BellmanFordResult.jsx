import React, { useState } from 'react';
import Card from '../common/Card';
import { Award, AlertTriangle, Route, Clock, HardDrive, ArrowRight } from 'lucide-react';
import { reconstructBellmanFordPath } from '../../algorithms/bellmanFord';

export default function BellmanFordResult({
  vertices = [],
  source,
  dist = {},
  predecessor = {},
  hasNegativeCycle = false,
  edges = [],
  isVisible = false
}) {
  const [destNode, setDestNode] = useState(
    vertices.find(v => v !== source) || vertices[0] || 'B'
  );

  if (!isVisible) return null;

  const targetDist = dist[destNode] !== undefined ? dist[destNode] : Infinity;
  const path = !hasNegativeCycle ? reconstructBellmanFordPath(destNode, source, predecessor) : null;

  return (
    <Card
      title="Single-Source Shortest Paths Summary"
      subtitle={`Final result from Bellman–Ford Algorithm (Source: '${source}')`}
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
        {/* Negative cycle alert */}
        {hasNegativeCycle ? (
          <div className="p-4 bg-rose-100 border border-rose-300 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900 text-sm">Negative Cycle Detected!</h4>
              <p className="text-xs text-rose-700 mt-1">
                A negative-weight cycle is reachable from source vertex <strong>'{source}'</strong>. Shortest path weights are not well-defined (-∞).
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
                O(V · E)
              </span>
              <span className="text-[10px] text-slate-400 block">
                {vertices.length - 1} passes × {edges.length} edges
              </span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-0.5">
                Space Complexity
              </span>
              <span className="text-xl font-bold text-indigo-700 font-mono">
                O(V)
              </span>
              <span className="text-[10px] text-slate-400 block">Distance and predecessor arrays</span>
            </div>
          </div>
        )}

        {/* Interactive Path Query from Source */}
        {!hasNegativeCycle && (
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-700 flex items-center gap-1.5">
                <Route className="w-4 h-4 text-indigo-600" />
                Query Shortest Path from Source ({source})
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-500 font-sans">Destination Node:</span>
              <select
                value={destNode}
                onChange={(e) => setDestNode(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-300 rounded font-bold text-slate-800"
              >
                {vertices.map(v => (
                  <option key={v} value={v}>Vertex {v}</option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                  Shortest Distance:
                </span>
                <span className="font-mono text-xl font-black text-indigo-700">
                  {targetDist === Infinity ? '∞ (Unreachable)' : targetDist}
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
                  <span className="text-slate-400 italic">No path available</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
