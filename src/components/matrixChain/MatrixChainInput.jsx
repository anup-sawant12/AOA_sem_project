import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Sliders, Plus, Trash2, RotateCcw, PlayCircle } from 'lucide-react';
import { PRESET_MATRIX_CHAIN_EXAMPLES } from '../../data/examples';

export default function MatrixChainInput({
  dimensions,
  onDimensionsChange,
  onGenerate,
  onReset,
  isExecuting,
  error
}) {
  const n = dimensions.length - 1; // number of matrices

  const handleDimChange = (index, value) => {
    const next = [...dimensions];
    next[index] = Number(value);
    onDimensionsChange(next);
  };

  const handleAddMatrix = () => {
    if (dimensions.length >= 8) return;
    const lastVal = dimensions[dimensions.length - 1] || 20;
    onDimensionsChange([...dimensions, 25]);
  };

  const handleRemoveMatrix = () => {
    if (dimensions.length <= 3) return; // Need at least 2 matrices (3 dimensions)
    onDimensionsChange(dimensions.slice(0, dimensions.length - 1));
  };

  const handleLoadPreset = (preset) => {
    onDimensionsChange([...preset.dimensions]);
  };

  return (
    <Card
      title="Matrix Chain Input"
      subtitle="Matrix Dimensions Sequence [p0, p1, ..., pn]"
      icon={Sliders}
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          icon={RotateCcw}
          disabled={isExecuting}
        >
          Defaults
        </Button>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Presets */}
        <div>
          <label className="text-[11px] font-semibold uppercase text-slate-500 block mb-1.5">
            Load Preset Example
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_MATRIX_CHAIN_EXAMPLES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadPreset(p)}
                disabled={isExecuting}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition cursor-pointer disabled:opacity-50"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Matrices Preview */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold uppercase text-slate-500">
              Matrices in Chain ({n} matrices)
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handleRemoveMatrix}
                disabled={dimensions.length <= 3 || isExecuting}
                className="px-2 py-0.5 text-[11px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                title="Remove matrix"
              >
                - Matrix
              </button>
              <button
                type="button"
                onClick={handleAddMatrix}
                disabled={dimensions.length >= 8 || isExecuting}
                className="px-2 py-0.5 text-[11px] border border-indigo-300 text-indigo-700 bg-indigo-50 rounded hover:bg-indigo-100 disabled:opacity-40 cursor-pointer"
                title="Add matrix"
              >
                + Matrix
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            {Array.from({ length: n }).map((_, idx) => (
              <div key={idx} className="p-2 bg-white border border-slate-200 rounded shadow-2xs">
                <span className="font-bold text-indigo-700 text-xs block">
                  Matrix A{idx + 1}
                </span>
                <span className="text-[11px] font-mono text-slate-600">
                  {dimensions[idx]} × {dimensions[idx + 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dimension Vector Inputs */}
        <div>
          <label className="text-[11px] font-semibold uppercase text-slate-500 block mb-1.5">
            Dimension Array Values (p₀, p₁, ... pₙ)
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            {dimensions.map((dim, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-mono text-slate-400">p{idx}</span>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={dim}
                    onChange={(e) => handleDimChange(idx, e.target.value)}
                    disabled={isExecuting}
                    className="w-14 px-1.5 py-1 text-xs text-center bg-white border border-slate-300 rounded font-mono font-semibold focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                {idx < dimensions.length - 1 && (
                  <span className="text-slate-300 font-bold mt-3">,</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
            {error}
          </div>
        )}

        <Button
          onClick={onGenerate}
          disabled={isExecuting}
          variant="primary"
          size="md"
          icon={PlayCircle}
          className="w-full font-semibold shadow-sm"
        >
          Generate DP Table
        </Button>
      </div>
    </Card>
  );
}
