import React from 'react';
import Card from '../common/Card';
import { Route } from 'lucide-react';

export default function BellmanFordGraph({
  vertices = [],
  edges = [],
  source,
  currentStep
}) {
  const width = 440;
  const height = 280;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 45;

  const nodePositions = {};
  const V = vertices.length;
  vertices.forEach((v, idx) => {
    const angle = (2 * Math.PI * idx) / V - Math.PI / 2;
    nodePositions[v] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const activeEdge = currentStep?.activeEdge;
  const dist = currentStep?.dist || {};
  const relaxed = currentStep?.relaxed;

  return (
    <Card
      title="Graph Topology & Edge Relaxation"
      subtitle={`Source: '${source}'. Node badges show current distance estimates dist[v].`}
      icon={Route}
    >
      <div className="flex flex-col items-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[440px] h-auto select-none overflow-visible"
        >
          <defs>
            <marker
              id="bf-arrow-default"
              viewBox="0 0 10 10"
              refX="23"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
            </marker>

            <marker
              id="bf-arrow-active"
              viewBox="0 0 10 10"
              refX="23"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
            </marker>

            <marker
              id="bf-arrow-relaxed"
              viewBox="0 0 10 10"
              refX="23"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Directed Edges */}
          {edges.map((e, idx) => {
            const start = nodePositions[e.from];
            const end = nodePositions[e.to];
            if (!start || !end) return null;

            const isActive = activeEdge && activeEdge.from === e.from && activeEdge.to === e.to;
            const isRelaxed = isActive && relaxed;

            const hasReverse = edges.some(other => other.from === e.to && other.to === e.from);
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const d = Math.sqrt(dx * dx + dy * dy) || 1;
            const normX = -dy / d;
            const normY = dx / d;
            const curveOffset = hasReverse ? 18 : 0;

            const midX = (start.x + end.x) / 2 + normX * curveOffset;
            const midY = (start.y + end.y) / 2 + normY * curveOffset;

            const pathD = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;

            let strokeColor = '#cbd5e1';
            let strokeWidth = 1.5;
            let markerId = 'url(#bf-arrow-default)';

            if (isRelaxed) {
              strokeColor = '#10b981';
              strokeWidth = 3.5;
              markerId = 'url(#bf-arrow-relaxed)';
            } else if (isActive) {
              strokeColor = '#6366f1';
              strokeWidth = 3;
              markerId = 'url(#bf-arrow-active)';
            }

            return (
              <g key={idx}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  markerEnd={markerId}
                  className="transition-all duration-300"
                />

                {/* Weight badge */}
                <rect
                  x={midX - 13}
                  y={midY - 9}
                  width="26"
                  height="18"
                  rx="4"
                  fill="white"
                  stroke={isRelaxed ? '#10b981' : isActive ? '#6366f1' : '#e2e8f0'}
                  strokeWidth={isActive ? '1.5' : '1'}
                  className="shadow-2xs"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  className={`text-[10px] font-mono font-bold ${
                    isRelaxed ? 'fill-emerald-700' : isActive ? 'fill-indigo-700' : 'fill-slate-600'
                  }`}
                >
                  {e.weight}
                </text>
              </g>
            );
          })}

          {/* Vertices */}
          {vertices.map((v) => {
            const pos = nodePositions[v];
            if (!pos) return null;

            const isSource = v === source;
            const isU = activeEdge && activeEdge.from === v;
            const isV = activeEdge && activeEdge.to === v;
            const currentD = dist[v] !== undefined ? dist[v] : Infinity;

            let fillColor = 'white';
            let strokeColor = '#94a3b8';
            let strokeWidth = 2;
            let textColor = '#334155';

            if (isSource) {
              fillColor = '#818cf8';
              strokeColor = '#4338ca';
              strokeWidth = 3;
              textColor = 'white';
            } else if (isV && relaxed) {
              fillColor = '#34d399';
              strokeColor = '#059669';
              strokeWidth = 3;
              textColor = 'white';
            } else if (isV) {
              fillColor = '#fde047';
              strokeColor = '#ca8a04';
              strokeWidth = 2.5;
              textColor = '#713f12';
            } else if (isU) {
              fillColor = '#38bdf8';
              strokeColor = '#0284c7';
              strokeWidth = 2.5;
              textColor = 'white';
            }

            return (
              <g key={v} className="transition-all duration-300">
                {/* Distance Badge Above Node */}
                <rect
                  x={pos.x - 20}
                  y={pos.y - 34}
                  width="40"
                  height="16"
                  rx="4"
                  fill="#1e293b"
                  className="shadow-xs"
                />
                <text
                  x={pos.x}
                  y={pos.y - 22}
                  textAnchor="middle"
                  fill="white"
                  className="text-[10px] font-mono font-bold"
                >
                  {currentD === Infinity ? 'd=∞' : `d=${currentD}`}
                </text>

                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="shadow-sm"
                />

                {/* Node label */}
                <text
                  x={pos.x}
                  y={pos.y + 4.5}
                  textAnchor="middle"
                  fill={textColor}
                  className="text-xs font-mono font-bold select-none"
                >
                  {v}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-100 w-full">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span>Source Vertex</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-400"></span>
            <span>Edge Source (u)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span>Relaxed Target (v)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
