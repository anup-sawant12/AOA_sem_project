import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Plus, Trash2, RotateCcw, PlayCircle, Sliders } from 'lucide-react';
import { PRESET_FRACTIONAL_EXAMPLES } from '../../data/examples';

export default function FractionalKnapsackInput({
  items,
  capacity,
  onItemsChange,
  onCapacityChange,
  onGenerate,
  onReset,
  isExecuting,
  error
}) {
  const handleItemChange = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onItemsChange(next);
  };

  const handleAddItem = () => {
    if (items.length >= 8) return;
    const newId = items.length > 0 ? Math.max(...items.map(it => it.id || 0)) + 1 : 1;
    onItemsChange([
      ...items,
      { id: newId, name: `Item ${newId}`, weight: 15, value: 50 }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    const next = items.filter((_, idx) => idx !== index);
    onItemsChange(next);
  };

  const handleLoadPreset = (preset) => {
    onCapacityChange(preset.capacity);
    onItemsChange(preset.items.map(it => ({ ...it })));
  };

  return (
    <Card
      title="Fractional Knapsack Input"
      subtitle="Greedy Value-Density Configuration"
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
            {PRESET_FRACTIONAL_EXAMPLES.map((p, idx) => (
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

        {/* Knapsack Capacity */}
        <div>
          <label className="text-[11px] font-semibold uppercase text-slate-500 block mb-1">
            Knapsack Capacity (W)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="200"
              value={capacity}
              onChange={(e) => onCapacityChange(e.target.value)}
              disabled={isExecuting}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
              placeholder="e.g. 50"
            />
            <span className="text-slate-500 text-xs shrink-0 font-medium">units</span>
          </div>
        </div>

        {/* Items List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-semibold uppercase text-slate-500">
              Items (Weights & Values)
            </label>
            <span className="text-[11px] text-slate-400">
              {items.length}/8 items
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {items.map((it, idx) => {
              const w = Number(it.weight) || 0;
              const v = Number(it.value) || 0;
              const ratio = w > 0 ? (v / w).toFixed(2) : '—';
              return (
                <div key={it.id || idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="w-5 text-center font-bold text-slate-500 text-[11px]">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={it.name || `Item ${idx + 1}`}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    disabled={isExecuting}
                    className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                    placeholder="Name"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[10px]">W:</span>
                    <input
                      type="number"
                      min="1"
                      value={it.weight}
                      onChange={(e) => handleItemChange(idx, 'weight', e.target.value)}
                      disabled={isExecuting}
                      className="w-14 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                      placeholder="Wt"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[10px]">V:</span>
                    <input
                      type="number"
                      min="0"
                      value={it.value}
                      onChange={(e) => handleItemChange(idx, 'value', e.target.value)}
                      disabled={isExecuting}
                      className="w-14 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                      placeholder="Val"
                    />
                  </div>
                  <div className="text-[11px] font-mono text-indigo-600 font-semibold px-1 min-w-[42px] text-right" title="Ratio: Value / Weight">
                    r={ratio}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length <= 1 || isExecuting}
                    className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer disabled:opacity-30"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            disabled={items.length >= 8 || isExecuting}
            className="mt-2 w-full py-1.5 border border-dashed border-slate-300 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 rounded-lg flex items-center justify-center gap-1.5 transition text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* Generate / Run Button */}
        <Button
          onClick={onGenerate}
          disabled={isExecuting}
          variant="primary"
          size="md"
          icon={PlayCircle}
          className="w-full font-semibold shadow-sm"
        >
          Generate Visualization
        </Button>
      </div>
    </Card>
  );
}
