import React from 'react';
import Card from '../common/Card';
import { Calculator, ArrowRight, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export default function FloydWarshallExplanation({ currentStep }) {
  if (!currentStep) {
    return (
      <Card
        title="Current Step Explanation"
        subtitle="All-pairs shortest path reasoning"
        icon={Calculator}
      >
        <div className="py-6 text-center text-slate-400 text-sm">
          No active step. Click "Run Floyd–Warshall" to begin.
        </div>
      </Card>
    );
  }

  const {
    description,
    kIndex,
    kVertex,
    iVertex,
    jVertex,
    currentDist,
    distIK,
    distKJ,
    candidateDist,
    updated,
    hasNegativeCycle
  } = currentStep;

  return (
    <Card
      title="Step Explanation & Transit Relaxation"
      subtitle={description?.title || "Shortest path step"}
      icon={Calculator}
    >
      <div className="space-y-4 text-xs">
        {/* Main description banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <h4 className="font-semibold text-slate-900 text-sm mb-1">{description?.title}</h4>
          <p className="text-slate-600 leading-relaxed">{description?.detail}</p>
          {description?.formula && (
            <div className="mt-2 font-mono text-[11px] text-indigo-700 bg-indigo-50/70 px-2 py-1 rounded border border-indigo-100">
              {description.formula}
            </div>
          )}
        </div>

        {/* Detailed transit calculation breakdown */}
        {iVertex && jVertex && kVertex && (
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-800 text-xs">
                Path Evaluation: {iVertex} → {jVertex} via {kVertex}
              </span>
              {updated ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Distance Relaxed (Shorter)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  No Improvement
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-sans uppercase font-bold text-slate-500 block mb-0.5">
                  1. Existing Distance
                </span>
                <span className="text-slate-800 font-bold text-sm">
                  dist[{iVertex}][{jVertex}] = {currentDist === Infinity ? '∞' : currentDist}
                </span>
              </div>

              <div className="p-2.5 bg-indigo-50/60 border border-indigo-200 rounded-lg">
                <span className="text-[10px] font-sans uppercase font-bold text-indigo-800 block mb-0.5">
                  2. Path Via {kVertex}
                </span>
                <span className="text-indigo-950 font-bold text-sm">
                  {distIK} + {distKJ} = {candidateDist === Infinity ? '∞' : candidateDist}
                </span>
              </div>

              <div className={`p-2.5 rounded-lg border ${
                updated 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' 
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <span className="text-[10px] font-sans uppercase font-bold text-slate-500 block mb-0.5">
                  3. New Value
                </span>
                <span className="text-sm">
                  {updated ? `dist[${iVertex}][${jVertex}] = ${candidateDist}` : `Keep ${currentDist === Infinity ? '∞' : currentDist}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {hasNegativeCycle && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
            <strong>Warning:</strong> Negative cycle detected! Self-distance dist[i][i] &lt; 0.
          </div>
        )}
      </div>
    </Card>
  );
}
