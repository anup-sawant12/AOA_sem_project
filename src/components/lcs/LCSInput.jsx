import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Sliders, RotateCcw, PlayCircle, Type } from 'lucide-react';
import { PRESET_LCS_EXAMPLES } from '../../data/examples';

export default function LCSInput({
  str1,
  str2,
  onStr1Change,
  onStr2Change,
  onGenerate,
  onReset,
  isExecuting,
  error
}) {
  const handleLoadPreset = (preset) => {
    onStr1Change(preset.str1);
    onStr2Change(preset.str2);
  };

  return (
    <Card
      title="LCS String Input"
      subtitle="Dynamic Programming Sequence Configuration"
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
            {PRESET_LCS_EXAMPLES.map((p, idx) => (
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

        {/* String 1 Input */}
        <div>
          <label className="text-[11px] font-semibold uppercase text-slate-500 block mb-1">
            Sequence 1 (Rows, length m)
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength="10"
              value={str1}
              onChange={(e) => onStr1Change(e.target.value.toUpperCase())}
              disabled={isExecuting}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest uppercase font-bold"
              placeholder="e.g. ABCD"
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Length: {str1.length} characters (Max 10 for table layout)
          </span>
        </div>

        {/* String 2 Input */}
        <div>
          <label className="text-[11px] font-semibold uppercase text-slate-500 block mb-1">
            Sequence 2 (Columns, length n)
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength="10"
              value={str2}
              onChange={(e) => onStr2Change(e.target.value.toUpperCase())}
              disabled={isExecuting}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest uppercase font-bold"
              placeholder="e.g. ACBD"
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Length: {str2.length} characters (Max 10 for table layout)
          </span>
        </div>

        {/* Character Visual Comparison Banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 w-12 text-[10px]">X (m={str1.length}):</span>
            <div className="flex gap-1">
              {str1.split('').map((c, i) => (
                <span key={i} className="w-5 h-6 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 w-12 text-[10px]">Y (n={str2.length}):</span>
            <div className="flex gap-1">
              {str2.split('').map((c, i) => (
                <span key={i} className="w-5 h-6 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                  {c}
                </span>
              ))}
            </div>
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
