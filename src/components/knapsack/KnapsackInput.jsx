import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { DEFAULT_EXAMPLE, PRESET_EXAMPLES } from '../../data/examples';
import { 
  Play, 
  RotateCcw, 
  Bookmark, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  Layers
} from 'lucide-react';

export default function KnapsackInput({
  items,
  capacity,
  onItemsChange,
  onCapacityChange,
  onGenerate,
  onReset,
  selectedItemIds = [],
  isFinished = false,
  isExecuting = false,
  error = null,
}) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  const handleItemChange = (index, field, value) => {
    const updated = items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [field]: value === '' ? '' : Number(value)
        };
      }
      return item;
    });
    onItemsChange(updated);
  };

  const addItem = () => {
    if (items.length >= 8) {
      return;
    }
    const nextId = items.length > 0 ? Math.max(...items.map(it => it.id)) + 1 : 1;
    onItemsChange([
      ...items,
      { id: nextId, name: `Item ${nextId}`, weight: 1, value: 5 }
    ]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    const updated = items.filter((_, i) => i !== index);
    onItemsChange(updated);
  };

  const handleLoadPreset = (e) => {
    const idx = Number(e.target.value);
    setSelectedPresetIndex(idx);
    const preset = PRESET_EXAMPLES[idx];
    if (preset) {
      onCapacityChange(preset.capacity);
      onItemsChange(preset.items.map(it => ({ ...it })));
      onGenerate(preset.items, preset.capacity);
    }
  };

  return (
    <Card
      title="Problem Configuration"
      subtitle="Define knapsack capacity and item weights & values"
      icon={Package}
      className="border-slate-200"
    >
      <div className="space-y-4">
        {/* Preset Selector */}
        <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200/70 rounded-lg text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
            <span>Preset Examples:</span>
          </div>
          <select
            value={selectedPresetIndex}
            onChange={handleLoadPreset}
            disabled={isExecuting}
            className="bg-white border border-slate-300 text-slate-700 text-xs rounded-md px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            {PRESET_EXAMPLES.map((ex, i) => (
              <option key={i} value={i}>{ex.name}</option>
            ))}
          </select>
        </div>

        {/* Capacity Input */}
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="knapsack-capacity" className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              Knapsack Capacity (W)
            </label>
            <span className="text-[11px] text-slate-400">Max limit: 30 for clear table</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="knapsack-capacity"
              type="number"
              min="1"
              max="30"
              value={capacity}
              onChange={(e) => onCapacityChange(e.target.value === '' ? '' : Number(e.target.value))}
              disabled={isExecuting}
              className="w-full px-3 py-1.5 text-sm font-medium border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none text-slate-900 bg-white"
              placeholder="e.g. 5"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Items List ({items.length})
            </span>
            <button
              onClick={addItem}
              disabled={isExecuting || items.length >= 8}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 disabled:opacity-40"
              title="Add another item (max 8 for best visualization)"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
          </div>

          <div className="max-h-[260px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-500 font-medium">
                  <th className="py-2 px-3">Item</th>
                  <th className="py-2 px-3">Weight (w)</th>
                  <th className="py-2 px-3">Value (v)</th>
                  <th className="py-2 px-2 text-center w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, index) => {
                  const isSelected = isFinished && selectedItemIds.includes(item.id);
                  return (
                    <tr
                      key={item.id || index}
                      className={`transition-colors ${
                        isSelected 
                          ? 'bg-emerald-50/90 font-medium' 
                          : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700">#{index + 1}</span>
                          {isSelected && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-600 text-white shadow-2xs">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Selected
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={item.weight}
                          onChange={(e) => handleItemChange(index, 'weight', e.target.value)}
                          disabled={isExecuting}
                          className={`w-16 px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                            isSelected ? 'border-emerald-400 bg-white font-semibold' : 'border-slate-300'
                          }`}
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="1"
                          max="500"
                          value={item.value}
                          onChange={(e) => handleItemChange(index, 'value', e.target.value)}
                          disabled={isExecuting}
                          className={`w-16 px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                            isSelected ? 'border-emerald-400 bg-white font-semibold' : 'border-slate-300'
                          }`}
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => removeItem(index)}
                          disabled={isExecuting || items.length <= 1}
                          className="text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-20"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Validation Errors */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div>
              <p className="font-medium">Invalid Configuration</p>
              <p className="mt-0.5 text-rose-600">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            onClick={() => onGenerate()}
            disabled={isExecuting}
            variant="primary"
            icon={Play}
            size="md"
            className="w-full col-span-2 shadow-sm font-semibold"
          >
            Generate Visualization
          </Button>

          <Button
            onClick={() => {
              const def = DEFAULT_EXAMPLE;
              setSelectedPresetIndex(0);
              onCapacityChange(def.capacity);
              onItemsChange(def.items.map(it => ({ ...it })));
              onGenerate(def.items, def.capacity);
            }}
            disabled={isExecuting}
            variant="secondary"
            size="sm"
            icon={Bookmark}
          >
            Default Example
          </Button>

          <Button
            onClick={onReset}
            disabled={isExecuting}
            variant="outline"
            size="sm"
            icon={RotateCcw}
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
