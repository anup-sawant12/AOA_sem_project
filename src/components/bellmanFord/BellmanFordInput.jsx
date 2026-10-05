import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Route, Plus, Trash2, RotateCcw, PlayCircle, Sliders } from 'lucide-react';
import { PRESET_BELLMAN_FORD_EXAMPLES } from '../../data/examples';

export default function BellmanFordInput({
  vertices,
  edges,
  source,
  onVerticesChange,
  onEdgesChange,
  onSourceChange,
  onGenerate,
  onReset,
  isExecuting,
  error
}) {
  const handleLoadPreset = (preset) => {
    onVerticesChange([...preset.vertices]);
    onEdgesChange(preset.edges.map(e => ({ ...e })));
    onSourceChange(preset.source);
  };

  const handleAddVertex = () => {
    if (vertices.length >= 6) return;
    const nextChar = String.fromCharCode(65 + vertices.length);
    onVerticesChange([...vertices, nextChar]);
  };

  const handleRemoveVertex = () => {
    if (vertices.length <= 3) return;
    const removed = vertices[vertices.length - 1];
    const newVerts = vertices.slice(0, vertices.length - 1);
    onVerticesChange(newVerts);
    if (source === removed) {
      onSourceChange(newVerts[0]);
    }
    onEdgesChange(edges.filter(e => e.from !== removed && e.to !== removed));
  };

  const handleEdgeChange = (idx, field, value) => {
    const next = [...edges];
    next[idx] = { ...next[idx], [field]: field === 'weight' ? Number(value) : value };
    onEdgesChange(next);
  };

  const handleAddEdge = () => {
    if (edges.length >= 14) return;
    onEdgesChange([
      ...edges,
      { from: vertices[0], to: vertices[1], weight: 2 }
    ]);
  };

  const handleRemoveEdge = (idx) => {
    if (edges.length <= 1) return;
    onEdgesChange(edges.filter((_, i) => i !== idx));
  };

  return (
    <Card
      title="Graph & Source Input"
      subtitle="Single-Source Shortest Paths Configuration"
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
            Load Preset Graph
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_BELLMAN_FORD_EXAMPLES.map((p, idx) => (
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

        {/* Source Vertex Selection */}
        <div>
          <label className="text-[11px] font-semibold uppercase text-slate-500 block mb-1">
            Source Vertex (Starting Node)
          </label>
          <div className="flex items-center gap-2">
            <select
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
              disabled={isExecuting}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500"
            >
              {vertices.map(v => (
                <option key={v} value={v}>Vertex {v} (dist = 0)</option>
              ))}
            </select>
          </div>
        </div>

        {/* Vertices Count */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold uppercase text-slate-500">
              Vertices ({vertices.length} nodes)
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handleRemoveVertex}
                disabled={vertices.length <= 3 || isExecuting}
                className="px-2 py-0.5 text-[11px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                - Node
              </button>
              <button
                type="button"
                onClick={handleAddVertex}
                disabled={vertices.length >= 6 || isExecuting}
                className="px-2 py-0.5 text-[11px] border border-indigo-300 text-indigo-700 bg-indigo-50 rounded hover:bg-indigo-100 disabled:opacity-40 cursor-pointer"
              >
                + Node
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg">
            {vertices.map((v) => (
              <span
                key={v}
                className={`w-7 h-7 rounded-full font-bold flex items-center justify-center font-mono text-xs shadow-2xs ${
                  v === source 
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300' 
                    : 'bg-white border border-slate-300 text-slate-700'
                }`}
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Directed Edges */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold uppercase text-slate-500">
              Directed Edges & Weights ({edges.length} edges)
            </label>
            <span className="text-[10px] text-slate-400">supports negative w</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {edges.map((e, idx) => (
              <div key={idx} className="flex items-center gap-1.5 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono">
                <select
                  value={e.from}
                  onChange={(ev) => handleEdgeChange(idx, 'from', ev.target.value)}
                  disabled={isExecuting}
                  className="px-1.5 py-1 bg-white border border-slate-300 rounded font-bold text-slate-700"
                >
                  {vertices.map(v => <option key={v} value={v}>{v}</option>)}
                </select>

                <span className="text-slate-400 font-sans">→</span>

                <select
                  value={e.to}
                  onChange={(ev) => handleEdgeChange(idx, 'to', ev.target.value)}
                  disabled={isExecuting}
                  className="px-1.5 py-1 bg-white border border-slate-300 rounded font-bold text-slate-700"
                >
                  {vertices.map(v => <option key={v} value={v}>{v}</option>)}
                </select>

                <span className="text-slate-400 text-[10px] font-sans ml-1">wt:</span>
                <input
                  type="number"
                  value={e.weight}
                  onChange={(ev) => handleEdgeChange(idx, 'weight', ev.target.value)}
                  disabled={isExecuting}
                  className="w-14 px-1.5 py-1 bg-white border border-slate-300 rounded text-center font-bold"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveEdge(idx)}
                  disabled={edges.length <= 1 || isExecuting}
                  className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer disabled:opacity-30 ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddEdge}
            disabled={edges.length >= 14 || isExecuting}
            className="mt-2 w-full py-1.5 border border-dashed border-slate-300 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 rounded-lg flex items-center justify-center gap-1.5 transition text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" /> Add Directed Edge
          </button>
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
          Run Bellman–Ford
        </Button>
      </div>
    </Card>
  );
}
