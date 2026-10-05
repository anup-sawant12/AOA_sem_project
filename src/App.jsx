import React, { useState, useEffect } from 'react';
import Navbar, { ALGORITHMS } from './components/common/Navbar';
import KnapsackPage from './pages/KnapsackPage';
import FractionalKnapsackPage from './pages/FractionalKnapsackPage';
import MatrixChainPage from './pages/MatrixChainPage';
import LCSPage from './pages/LCSPage';
import FloydWarshallPage from './pages/FloydWarshallPage';
import BellmanFordPage from './pages/BellmanFordPage';

const HASH_MAP = {
  '#knapsack': 'knapsack',
  '#fractional-knapsack': 'fractionalKnapsack',
  '#fractional': 'fractionalKnapsack',
  '#matrix-chain': 'matrixChain',
  '#lcs': 'lcs',
  '#floyd-warshall': 'floydWarshall',
  '#bellman-ford': 'bellmanFord'
};

const ID_TO_HASH = {
  knapsack: '#knapsack',
  fractionalKnapsack: '#fractional-knapsack',
  matrixChain: '#matrix-chain',
  lcs: '#lcs',
  floydWarshall: '#floyd-warshall',
  bellmanFord: '#bellman-ford'
};

export default function App() {
  const [activeModule, setActiveModule] = useState(() => {
    const hash = window.location.hash;
    return HASH_MAP[hash] || 'knapsack';
  });

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (HASH_MAP[hash]) {
        setActiveModule(HASH_MAP[hash]);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectModule = (moduleId) => {
    setActiveModule(moduleId);
    const targetHash = ID_TO_HASH[moduleId];
    if (targetHash && window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'knapsack':
        return <KnapsackPage hasGlobalNav={true} />;
      case 'fractionalKnapsack':
        return <FractionalKnapsackPage />;
      case 'matrixChain':
        return <MatrixChainPage />;
      case 'lcs':
        return <LCSPage />;
      case 'floydWarshall':
        return <FloydWarshallPage />;
      case 'bellmanFord':
        return <BellmanFordPage />;
      default:
        return <KnapsackPage hasGlobalNav={true} />;
    }
  };

  const activeAlgoMeta = ALGORITHMS.find(a => a.id === activeModule) || ALGORITHMS[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Universal Navigation Header */}
      <Navbar
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
      />

      {/* Main Algorithm Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {renderActiveModule()}
      </main>

      {/* Clean Academic Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            Analysis of Algorithms (AOA) Visualizer &bull; Module {activeAlgoMeta.number}: {activeAlgoMeta.name} ({activeAlgoMeta.category})
          </p>
          <p className="font-mono text-[11px] text-slate-400">
            6 Browser-Native Algorithm Modules &bull; Zero Backend &bull; Framer Motion
          </p>
        </div>
      </footer>
    </div>
  );
}
