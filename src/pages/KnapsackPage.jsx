import React, { useState, useEffect, useRef, useCallback } from 'react';
import KnapsackInput from '../components/knapsack/KnapsackInput';
import KnapsackTable from '../components/knapsack/KnapsackTable';
import KnapsackControls from '../components/knapsack/KnapsackControls';
import StepExplanation from '../components/knapsack/StepExplanation';
import ResultCard from '../components/knapsack/ResultCard';
import BacktrackingView from '../components/knapsack/BacktrackingView';
import EducationalSection from '../components/knapsack/EducationalSection';
import AlgorithmCode from '../components/knapsack/AlgorithmCode';
import { generateKnapsackSteps, solveKnapsack } from '../algorithms/knapsack';
import { DEFAULT_EXAMPLE } from '../data/examples';
import { Sparkles, BrainCircuit, GraduationCap } from 'lucide-react';

export default function KnapsackPage({ hasGlobalNav = false }) {
  const [items, setItems] = useState(() => DEFAULT_EXAMPLE.items.map(it => ({ ...it })));
  const [capacity, setCapacity] = useState(DEFAULT_EXAMPLE.capacity);
  const [error, setError] = useState(null);

  // Animation & step states
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600); // 600ms default (Normal)

  const timerRef = useRef(null);

  // Validate inputs
  const validateInputs = (itemList, cap) => {
    if (!cap || isNaN(cap) || cap <= 0) {
      return "Knapsack capacity must be a positive integer greater than 0.";
    }
    if (cap > 30) {
      return "For clear table visualization, maximum capacity is capped at 30.";
    }
    if (!itemList || itemList.length === 0) {
      return "Please provide at least 1 item.";
    }
    if (itemList.length > 8) {
      return "Maximum 8 items allowed for optimal screen visualization.";
    }
    for (let i = 0; i < itemList.length; i++) {
      const it = itemList[i];
      if (it.weight === '' || isNaN(it.weight) || it.weight <= 0) {
        return `Item #${i + 1} weight must be a positive integer greater than 0.`;
      }
      if (it.value === '' || isNaN(it.value) || it.value < 0) {
        return `Item #${i + 1} value must be a non-negative number (>= 0).`;
      }
    }
    return null;
  };

  // Generate visualization steps
  const handleGenerate = useCallback((customItems = items, customCap = capacity) => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const validationErr = validateInputs(customItems, customCap);
    if (validationErr) {
      setError(validationErr);
      return false;
    }
    setError(null);

    // Format clean numeric items
    const cleanItems = customItems.map((it, idx) => ({
      id: it.id || idx + 1,
      name: it.name || `Item ${idx + 1}`,
      weight: Number(it.weight),
      value: Number(it.value)
    }));
    const cleanCap = Number(customCap);

    const generated = generateKnapsackSteps({ items: cleanItems, capacity: cleanCap });
    setSteps(generated);
    setCurrentStepIndex(0);
    return true;
  }, [items, capacity]);

  // Initial load
  useEffect(() => {
    handleGenerate(DEFAULT_EXAMPLE.items, DEFAULT_EXAMPLE.capacity);
  }, []);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  // Step navigation controls
  const handlePlayPause = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleSeek = (index) => {
    setIsPlaying(false);
    setCurrentStepIndex(index);
  };

  const handleReset = () => {
    setIsPlaying(false);
    const def = DEFAULT_EXAMPLE;
    setItems(def.items.map(it => ({ ...it })));
    setCapacity(def.capacity);
    handleGenerate(def.items, def.capacity);
  };

  const currentStep = steps[currentStepIndex] || null;
  const isFinished = currentStep?.phase === 'complete' || currentStepIndex === steps.length - 1;

  // Selected items from step or completed state
  const selectedItemIds = currentStep?.selectedItemIds || [];
  const selectedItemsData = items.filter(it => selectedItemIds.includes(it.id));
  const activeCodeLine = currentStep?.activeCodeLine || 0;

  const content = (
    <div className="space-y-6">
      {/* Top/Main Grid: Left Input, Right DP Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Input Configuration */}
        <div className="lg:col-span-4 space-y-5">
          <KnapsackInput
            items={items}
            capacity={capacity}
            onItemsChange={setItems}
            onCapacityChange={setCapacity}
            onGenerate={() => handleGenerate(items, capacity)}
            onReset={handleReset}
            selectedItemIds={selectedItemIds}
            isFinished={isFinished}
            isExecuting={isPlaying}
            error={error}
          />

          {/* Quick Summary / Result Card on Left if complete */}
          {isFinished && (
            <ResultCard
              maxValue={currentStep?.maxValue ?? 0}
              selectedItems={selectedItemsData}
              totalWeight={currentStep?.totalWeight ?? 0}
              capacity={capacity}
              isVisible={isFinished}
            />
          )}
        </div>

        {/* RIGHT / MAIN: DP Table & Controls */}
        <div className="lg:col-span-8 space-y-5">
          {/* DP Table */}
          <KnapsackTable
            items={items}
            capacity={capacity}
            currentStep={currentStep}
            totalSteps={steps.length}
          />

          {/* Animation Controls & Progress */}
          <KnapsackControls
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            isPlaying={isPlaying}
            speed={speed}
            onPlayPause={handlePlayPause}
            onPrev={handlePrev}
            onNext={handleNext}
            onRestart={handleRestart}
            onSpeedChange={setSpeed}
            onSeek={handleSeek}
            currentPhase={currentStep?.phase}
          />
        </div>
      </div>

      {/* BOTTOM SECTION: Step Explanation, Backtracking Details, Code & Theory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Detailed Step-by-Step Mathematical Explanation */}
        <div className="lg:col-span-7 space-y-5">
          <StepExplanation currentStep={currentStep} />
          <BacktrackingView
            steps={steps}
            currentStepIndex={currentStepIndex}
            items={items}
            capacity={capacity}
          />
        </div>

        {/* Algorithm Code & Theory Accordion */}
        <div className="lg:col-span-5 space-y-5">
          <AlgorithmCode activeCodeLine={activeCodeLine} />
          <EducationalSection />
        </div>
      </div>
    </div>
  );

  if (hasGlobalNav) {
    return content;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Academic Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
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
                  Module 1: Dynamic Programming
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight mt-0.5">
                0/1 Knapsack Problem
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Analysis of Algorithms (AOA)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {content}
      </main>

      {/* Clean Academic Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            Analysis of Algorithms (AOA) Visualizer &bull; Dynamic Programming &bull; 0/1 Knapsack
          </p>
          <p className="font-mono text-[11px] text-slate-400">
            Browser-native runtime &bull; Framer Motion &bull; Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
