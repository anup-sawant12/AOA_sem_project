import React, { useState } from 'react';
import Card from '../common/Card';
import { Code2, ChevronDown, ChevronUp } from 'lucide-react';

const CODE_LINES = [
  { line: 1, text: 'function solveKnapsack(items, capacity) {' },
  { line: 2, text: '  const n = items.length;' },
  { line: 3, text: '  // DP Table Initialization' },
  { line: 4, text: '  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));' },
  { line: 5, text: '  for (let i = 1; i <= n; i++) {' },
  { line: 6, text: '    const { weight, value } = items[i - 1];' },
  { line: 7, text: '    for (let w = 0; w <= capacity; w++) {' },
  { line: 8, text: '      if (weight > w) {' },
  { line: 9, text: '        dp[i][w] = dp[i - 1][w]; // Cannot fit item' },
  { line: 10, text: '      } else {' },
  { line: 11, text: '        dp[i][w] = Math.max(dp[i - 1][w], value + dp[i - 1][w - weight]);' },
  { line: 12, text: '      }' },
  { line: 13, text: '    }' },
  { line: 14, text: '  }' },
  { line: 15, text: '  // Backtracking Phase' },
  { line: 16, text: '  let w = capacity, selected = [];' },
  { line: 17, text: '  for (let i = n; i > 0; i--) {' },
  { line: 18, text: '    if (dp[i][w] !== dp[i - 1][w]) {' },
  { line: 19, text: '      selected.push(items[i - 1]); w -= items[i - 1].weight;' },
  { line: 20, text: '    }' },
  { line: 21, text: '  }' },
  { line: 22, text: '  return { maxValue: dp[n][capacity], selected };' },
  { line: 23, text: '}' }
];

// Map activeCodeLine from algorithm step to line in CODE_LINES
function getMappedLine(activeCodeLine) {
  switch (activeCodeLine) {
    case 3: return [3, 4];
    case 6: return [8, 9];
    case 8: return [11];
    case 9: return [11];
    case 13: return [16, 17];
    case 16: return [18, 19];
    case 18: return [18];
    case 21: return [22];
    default: return [];
  }
}

export default function AlgorithmCode({ activeCodeLine }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeLines = getMappedLine(activeCodeLine);

  return (
    <Card
      title="Algorithm Implementation"
      subtitle="Clean JavaScript code with line tracking"
      icon={Code2}
      action={
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              Collapse <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              View Code <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      }
      bodyClassName={isExpanded ? 'p-0' : 'hidden'}
    >
      <div className="bg-slate-900 rounded-b-xl overflow-hidden font-mono text-[11px] leading-relaxed p-2 text-slate-300 max-h-64 overflow-y-auto">
        <table className="w-full">
          <tbody>
            {CODE_LINES.map(({ line, text }) => {
              const isActive = activeLines.includes(line);
              return (
                <tr
                  key={line}
                  className={`transition-colors ${
                    isActive 
                      ? 'bg-indigo-950/80 text-white font-bold border-l-2 border-indigo-400' 
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="w-8 py-0.5 px-2 text-right text-slate-500 select-none text-[10px]">
                    {line}
                  </td>
                  <td className="py-0.5 px-2 whitespace-pre">
                    {text}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
