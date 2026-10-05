import React from 'react';
import Card from '../common/Card';
import { Calculator, ArrowRight, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function BellmanFordExplanation({ currentStep }) {
  if (!currentStep) {
    return (
      <Card
        title="Current Step Explanation"
        subtitle="Edge relaxation reasoning"
        icon={Calculator}
      >
        <div className="py-6 text-center text-slate-400 text-sm">
          No active step. Click "Run Bellman–Ford" to begin.
        </div>
      </Card>
    );
  }

  const {
    description,
    iteration,
    maxIterations,
    activeEdge,
    uVertex,
    vVertex,
    weight,
    uDist,
    oldDist,
    newDist,
    relaxed,
    hasNegativeCycle,
    phase
  } = currentStep;

  return (
    <Card
      title="Step Explanation & Edge Relaxation"
      subtitle={description?.title || "Bellman–Ford step"}
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

        {/* Edge Relaxation Analysis Card */}
        {activeEdge && (
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-800 text-xs">
                Relaxing Edge ({activeEdge.from} → {activeEdge.to}) with Weight {activeEdge.weight}
              </span>
              {relaxed ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Relaxed & Updated
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  No Improvement
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-sans uppercase font-bold text-slate-500 block mb-0.5">
                  1. Source dist[{uVertex}]
                </span>
                <span className="text-slate-800 font-bold text-sm">
                  {uDist === Infinity ? '∞' : uDist}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-sans uppercase font-bold text-slate-500 block mb-0.5">
                  2. Edge Weight (w)
                </span>
                <span className="text-indigo-700 font-bold text-sm">
                  {weight}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-sans uppercase font-bold text-slate-500 block mb-0.5">
                  3. Old dist[{vVertex}]
                </span>
                <span className="text-slate-800 font-bold text-sm">
                  {oldDist === Infinity ? '∞' : oldDist}
                </span>
              </div>

              <div className={`p-2.5 rounded-lg border ${
                relaxed 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' 
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <span className="text-[10px] font-sans uppercase font-bold text-slate-500 block mb-0.5">
                  4. New dist[{vVertex}]
                </span>
                <span className="text-sm">
                  {relaxed ? `${newDist}` : `${oldDist === Infinity ? '∞' : oldDist}`}
                </span>
              </div>
            </div>

            {/* Condition check detail */}
            <div className="p-2.5 bg-slate-50 rounded-lg text-slate-700 font-mono text-[11px] flex items-center justify-between">
              <span>Condition Check:</span>
              <span>
                {uDist} + ({weight}) = {uDist !== Infinity ? uDist + weight : '∞'} {relaxed ? '<' : '≥'} {oldDist === Infinity ? '∞' : oldDist}
              </span>
            </div>
          </div>
        )}

        {/* Negative cycle detection pass details */}
        {phase === 'check' && (
          <div className={`p-3 rounded-lg border ${
            hasNegativeCycle 
              ? 'bg-rose-50 border-rose-200 text-rose-800' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <span className="font-bold block mb-1">
              {hasNegativeCycle ? 'Negative Cycle Detected!' : 'No Negative Cycle Detected.'}
            </span>
            <p className="text-[11px]">
              {hasNegativeCycle
                ? 'An edge can still be relaxed in the V-th iteration, proving the existence of a negative cycle reachable from the source.'
                : 'No edges could be relaxed in the V-th pass, guaranteeing valid shortest paths.'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
