import React from 'react';
import Card from '../common/Card';
import { Table, Layers, ArrowRight } from 'lucide-react';

export default function BellmanFordTable({
  vertices = [],
  source,
  currentStep
}) {
  if (!currentStep) {
    return (
      <Card title="Distance & Predecessor Table" icon={Table}>
        <div className="py-12 text-center text-slate-400 text-sm">
          Run algorithm to inspect Bellman–Ford distance table.
        </div>
      </Card>
    );
  }

  const {
    iteration = 0,
    maxIterations = vertices.length - 1,
    dist = {},
    predecessor = {},
    activeEdge,
    relaxed,
    phase
  } = currentStep;

  const targetVertex = activeEdge?.to;

  return (
    <Card
      title="Shortest Distance & Predecessor Table"
      subtitle={`Source: '${source}' | Distance estimates after edge relaxations`}
      icon={Table}
      action={
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-slate-500">Outer Pass:</span>
          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            {phase === 'check' || phase === 'complete' 
              ? 'Negative Cycle Check' 
              : `Iteration ${iteration} / ${maxIterations}`}
          </span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-center border-collapse">
            <thead className="bg-slate-100 font-mono text-[11px] border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-2.5 border-r border-slate-200 text-left pl-4">Vertex (v)</th>
                <th className="p-2.5 border-r border-slate-200 text-right pr-4">Shortest Distance dist[v]</th>
                <th className="p-2.5 text-center">Predecessor π[v]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {vertices.map((v) => {
                const isTarget = targetVertex === v;
                const d = dist[v] !== undefined ? dist[v] : Infinity;
                const pred = predecessor[v];
                const isSource = v === source;

                let rowStyle = 'hover:bg-slate-50/50';
                if (isTarget && relaxed) {
                  rowStyle = 'bg-emerald-50/80 font-bold';
                } else if (isTarget) {
                  rowStyle = 'bg-indigo-50/50';
                } else if (isSource) {
                  rowStyle = 'bg-slate-50/60 font-semibold';
                }

                return (
                  <tr key={v} className={`transition-colors ${rowStyle}`}>
                    <td className="p-2.5 text-left pl-4 border-r border-slate-100 font-bold text-slate-800">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          isSource 
                            ? 'bg-indigo-600 text-white font-bold' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {v}
                        </span>
                        {isSource && (
                          <span className="text-[10px] text-indigo-600 font-normal font-sans">
                            (Source)
                          </span>
                        )}
                      </span>
                    </td>

                    <td className={`p-2.5 text-right pr-4 border-r border-slate-100 font-bold ${
                      isTarget && relaxed ? 'text-emerald-700 text-sm' : 'text-slate-800'
                    }`}>
                      {d === Infinity ? '∞' : d}
                    </td>

                    <td className="p-2.5 text-center text-slate-600">
                      {pred ? (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200">
                          {pred}
                        </span>
                      ) : (
                        <span className="text-slate-400">null</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Outer loop progress banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
          <span className="text-slate-600">
            Outer Pass Progress:
          </span>
          <div className="flex items-center gap-1 font-mono font-bold">
            {Array.from({ length: maxIterations }).map((_, idx) => (
              <span
                key={idx}
                className={`w-6 h-6 rounded flex items-center justify-center text-[11px] ${
                  iteration > idx + 1
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : iteration === idx + 1
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-400'
                }`}
              >
                {idx + 1}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
