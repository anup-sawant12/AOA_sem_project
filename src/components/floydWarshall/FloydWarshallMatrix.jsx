import React from 'react';
import Card from '../common/Card';
import { Table, Sparkles } from 'lucide-react';

export default function FloydWarshallMatrix({
  vertices = [],
  currentStep
}) {
  if (!currentStep) {
    return (
      <Card title="All-Pairs Distance Matrix" icon={Table}>
        <div className="py-12 text-center text-slate-400 text-sm">
          Run algorithm to inspect distance matrix states.
        </div>
      </Card>
    );
  }

  const {
    distMatrix = [],
    kIndex,
    kVertex,
    iIndex,
    iVertex,
    jIndex,
    jVertex,
    updated
  } = currentStep;

  return (
    <Card
      title="All-Pairs Distance Matrix D^(k)"
      subtitle={
        kVertex
          ? `Current matrix with paths evaluated through vertex '${kVertex}' (k = ${kIndex + 1})`
          : "Initial Distance Matrix D^(0)"
      }
      icon={Table}
      action={
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-slate-500">Target Cell:</span>
          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            {iVertex && jVertex ? `dist[${iVertex}][${jVertex}]` : 'dist[i][j]'}
          </span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-center border-collapse">
            <thead className="bg-slate-100 font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-2.5 border-r border-slate-200 bg-slate-200/60 text-slate-600">
                  From \ To
                </th>
                {vertices.map((v, colIdx) => {
                  const isTargetCol = jIndex === colIdx;
                  const isKCol = kIndex === colIdx;
                  return (
                    <th
                      key={v}
                      className={`p-2.5 border-r border-slate-200 transition-colors ${
                        isTargetCol
                          ? 'bg-emerald-100 text-emerald-950 font-black'
                          : isKCol
                            ? 'bg-indigo-100 text-indigo-950 font-bold'
                            : 'text-slate-700'
                      }`}
                    >
                      {v}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {vertices.map((u, rowIdx) => {
                const isTargetRow = iIndex === rowIdx;
                const isKRow = kIndex === rowIdx;

                return (
                  <tr key={u} className="hover:bg-slate-50/50">
                    <td
                      className={`p-2.5 font-bold border-r border-slate-200 ${
                        isTargetRow
                          ? 'bg-sky-100 text-sky-950 font-black'
                          : isKRow
                            ? 'bg-indigo-100 text-indigo-950 font-bold'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u}
                    </td>

                    {vertices.map((v, colIdx) => {
                      const val = distMatrix[rowIdx] ? distMatrix[rowIdx][colIdx] : Infinity;
                      const isCurrentCell = iIndex === rowIdx && jIndex === colIdx;
                      const isIKCell = iIndex === rowIdx && kIndex === colIdx;
                      const isKJCell = kIndex === rowIdx && jIndex === colIdx;
                      const isDiag = rowIdx === colIdx;

                      let cellClass = 'bg-white text-slate-800';

                      if (isCurrentCell) {
                        cellClass = updated
                          ? 'bg-emerald-600 text-white font-black ring-2 ring-emerald-400 shadow-md'
                          : 'bg-indigo-600 text-white font-black ring-2 ring-indigo-400 shadow-md';
                      } else if (isIKCell || isKJCell) {
                        cellClass = 'bg-indigo-50 text-indigo-950 font-bold ring-1 ring-indigo-300';
                      } else if (isDiag) {
                        cellClass = 'bg-slate-50 text-slate-400 font-semibold';
                      }

                      return (
                        <td
                          key={v}
                          className={`p-2.5 border-r border-slate-100 transition-colors ${cellClass}`}
                        >
                          <span className="text-xs font-semibold">
                            {val === Infinity ? '∞' : val}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Matrix Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-600"></span>
              <span>Updated Cell dist[i][j]</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-indigo-100 border border-indigo-300"></span>
              <span>Subpaths (i→k or k→j)</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            Self-distance dist[i][i] = 0
          </span>
        </div>
      </div>
    </Card>
  );
}
