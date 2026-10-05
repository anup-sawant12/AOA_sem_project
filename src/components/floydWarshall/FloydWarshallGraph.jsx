import React from 'react';
import Card from '../common/Card';
import { Network } from 'lucide-react';

export default function FloydWarshallGraph({
  vertices = [],
  edges = [],
  currentStep
}) {
  const width = 440;
  const height = 280;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 45;

  // Compute circular layout for nodes
  const nodePositions = {};
  const V = vertices.length;
  vertices.forEach((v, idx) => {
    const angle = (2 * Math.PI * idx) / V - Math.PI / 2;
    nodePositions[v] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const kVertex = currentStep?.kVertex;
  const iVertex = currentStep?.iVertex;
  const jVertex = currentStep?.jVertex;
  const activeEdges = currentStep?.activeEdges || [];

  return (
    <Card
      title="Graph Topology & Active Edges"
      subtitle="Visualizing intermediate node (k) and relaxed path (i -> k -> j)"
      icon={Network}
    >
      <div className="flex flex-col items-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[440px] h-auto select-none overflow-visible"
        >
          <defs>
            {/* Standard arrow marker */}
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
            </marker>

            {/* Active arrow marker */}
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
            </marker>

            {/* Current path arrow marker */}
            <marker
              id="arrow-current"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="7"
              markerHeight="7"
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

            const isViaTransit = activeEdges.some(
              ae => ae.from === e.from && ae.to === e.to && !ae.isCurrent
            );
            const isDirectCurrent = activeEdges.some(
              ae => ae.from === e.from && ae.to === e.to && ae.isCurrent
            );

            // Compute slight curve offset if reverse edge exists
            const hasReverse = edges.some(other => other.from === e.to && other.to === e.from);
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const normX = -dy / dist;
            const normY = dx / dist;
            const curveOffset = hasReverse ? 18 : 0;

            const midX = (start.x + end.x) / 2 + normX * curveOffset;
            const midY = (start.y + end.y) / 2 + normY * curveOffset;

            const pathD = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;

            let strokeColor = '#cbd5e1';
            let strokeWidth = 1.5;
            let markerId = 'url(#arrow-default)';

            if (isViaTransit) {
              strokeColor = '#6366f1';
              strokeWidth = 3;
              markerId = 'url(#arrow-active)';
            } else if (isDirectCurrent) {
              strokeColor = '#10b981';
              strokeWidth = 2.5;
              markerId = 'url(#arrow-current)';
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
                  x={midX - 12}
                  y={midY - 9}
                  width="24"
                  height="18"
                  rx="4"
                  fill="white"
                  stroke={isViaTransit ? '#6366f1' : isDirectCurrent ? '#10b981' : '#e2e8f0'}
                  strokeWidth={isViaTransit || isDirectCurrent ? '1.5' : '1'}
                  className="shadow-2xs"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  className={`text-[10px] font-mono font-bold ${
                    isViaTransit ? 'fill-indigo-700' : isDirectCurrent ? 'fill-emerald-700' : 'fill-slate-600'
                  }`}
                >
                  {e.weight}
                </text>
              </g>
            );
          })}

          {/* Vertices (Nodes) */}
          {vertices.map((v) => {
            const pos = nodePositions[v];
            if (!pos) return null;

            const isK = kVertex === v;
            const isI = iVertex === v;
            const isJ = jVertex === v;

            let fillColor = 'white';
            let strokeColor = '#94a3b8';
            let strokeWidth = 2;
            let textColor = '#334155';

            if (isK) {
              fillColor = '#818cf8'; // Indigo/Purple for intermediate k
              strokeColor = '#4338ca';
              strokeWidth = 3;
              textColor = 'white';
            } else if (isI) {
              fillColor = '#38bdf8'; // Sky blue for start i
              strokeColor = '#0284c7';
              strokeWidth = 3;
              textColor = 'white';
            } else if (isJ) {
              fillColor = '#34d399'; // Emerald for destination j
              strokeColor = '#059669';
              strokeWidth = 3;
              textColor = 'white';
            }

            return (
              <g key={v} className="transition-all duration-300">
                {/* Glow ring if active */}
                {isK && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="25"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="4"
                    strokeOpacity="0.4"
                    className="animate-pulse"
                  />
                )}

                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="shadow-sm"
                />

                <text
                  x={pos.x}
                  y={pos.y + 4.5}
                  textAnchor="middle"
                  fill={textColor}
                  className="text-xs font-mono font-bold select-none"
                >
                  {v}
                </text>

                {/* Role indicator label */}
                {isK && (
                  <text
                    x={pos.x}
                    y={pos.y - 22}
                    textAnchor="middle"
                    className="text-[10px] font-sans font-bold fill-indigo-700"
                  >
                    Intermediate (k)
                  </text>
                )}
                {isI && !isK && (
                  <text
                    x={pos.x}
                    y={pos.y - 22}
                    textAnchor="middle"
                    className="text-[10px] font-sans font-bold fill-sky-700"
                  >
                    Start (i)
                  </text>
                )}
                {isJ && !isK && !isI && (
                  <text
                    x={pos.x}
                    y={pos.y - 22}
                    textAnchor="middle"
                    className="text-[10px] font-sans font-bold fill-emerald-700"
                  >
                    Target (j)
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-100 w-full">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span>Intermediate (k)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-400"></span>
            <span>Start Node (i)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span>Target Node (j)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
