import React from 'react';
import { 
  BrainCircuit, 
  Package, 
  Layers, 
  GitFork, 
  Network, 
  Route, 
  GraduationCap 
} from 'lucide-react';

export const ALGORITHMS = [
  {
    id: 'knapsack',
    number: 1,
    name: '0/1 Knapsack',
    shortName: '0/1 Knapsack',
    category: 'Dynamic Programming',
    categoryBadge: 'DP',
    icon: Package,
    hash: '#knapsack'
  },
  {
    id: 'fractionalKnapsack',
    number: 2,
    name: 'Fractional Knapsack',
    shortName: 'Fractional Knapsack',
    category: 'Greedy Method',
    categoryBadge: 'Greedy',
    icon: Layers,
    hash: '#fractional-knapsack'
  },
  {
    id: 'matrixChain',
    number: 3,
    name: 'Matrix Chain Multiplication',
    shortName: 'Matrix Chain',
    category: 'Dynamic Programming',
    categoryBadge: 'DP',
    icon: GitFork,
    hash: '#matrix-chain'
  },
  {
    id: 'lcs',
    number: 4,
    name: 'Longest Common Subsequence',
    shortName: 'LCS',
    category: 'Dynamic Programming',
    categoryBadge: 'DP',
    icon: BrainCircuit,
    hash: '#lcs'
  },
  {
    id: 'floydWarshall',
    number: 5,
    name: 'Floyd–Warshall',
    shortName: 'Floyd–Warshall',
    category: 'All-Pairs Shortest Path',
    categoryBadge: 'Graphs',
    icon: Network,
    hash: '#floyd-warshall'
  },
  {
    id: 'bellmanFord',
    number: 6,
    name: 'Bellman–Ford',
    shortName: 'Bellman–Ford',
    category: 'Single-Source Shortest Path',
    categoryBadge: 'Graphs',
    icon: Route,
    hash: '#bellman-ford'
  }
];

export default function Navbar({ activeModule, onSelectModule }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                AOA ALGORITHM VISUALIZER
              </span>
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Interactive Learning System
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight mt-0.5">
              Analysis of Algorithms (AOA)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="font-medium">6 Core Algorithm Modules</span>
          </div>
        </div>
      </div>

      {/* Algorithm Navigation Tabs */}
      <div className="bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Algorithms">
            {ALGORITHMS.map((algo) => {
              const isActive = activeModule === algo.id;
              const Icon = algo.icon;
              return (
                <button
                  key={algo.id}
                  type="button"
                  onClick={() => onSelectModule(algo.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/90 font-semibold ring-1 ring-indigo-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {algo.number}
                  </span>
                  <span>{algo.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                      : 'bg-slate-200/70 text-slate-500'
                  }`}>
                    {algo.categoryBadge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
