import React, { useState, useEffect, useRef, useCallback } from 'react';
import FractionalKnapsackInput from '../components/fractionalKnapsack/FractionalKnapsackInput';
import FractionalKnapsackVisualizer from '../components/fractionalKnapsack/FractionalKnapsackVisualizer';
import FractionalKnapsackExplanation from '../components/fractionalKnapsack/FractionalKnapsackExplanation';
import FractionalKnapsackResult from '../components/fractionalKnapsack/FractionalKnapsackResult';
import FractionalKnapsackTheory from '../components/fractionalKnapsack/FractionalKnapsackTheory';
import AlgorithmControls from '../components/common/AlgorithmControls';
import { generateFractionalKnapsackSteps } from '../algorithms/fractionalKnapsack';
import { DEFAULT_FRACTIONAL_KNAPSACK } from '../data/examples';

export default function FractionalKnapsackPage() {
  const [items, setItems] = useState(() => DEFAULT_FRACTIONAL_KNAPSACK.items.map(it => ({ ...it })));
  const [capacity, setCapacity] = useState(DEFAULT_FRACTIONAL_KNAPSACK.capacity);
  const [error, setError] = useState(null);

  // Playback states
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);

  const timerRef = useRef(null);

  const validateInputs = (itemList, cap) => {
    if (!cap || isNaN(cap) || Number(cap) <= 0) {
      return "Capacity must be a positive number greater than 0.";
    }
    if (!itemList || itemList.length === 0) {
      return "Please provide at least 1 item.";
    }
    for (let i = 0; i < itemList.length; i++) {
      const it = itemList[i];
      if (it.weight === '' || isNaN(it.weight) || Number(it.weight) <= 0) {
        return `Item #${i + 1} weight must be > 0.`;
      }
      if (it.value === '' || isNaN(it.value) || Number(it.value) < 0) {
        return `Item #${i + 1} value must be >= 0.`;
      }
    }
    return null;
  };

  const handleGenerate = useCallback((customItems = items, customCap = capacity) => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const valErr = validateInputs(customItems, customCap);
    if (valErr) {
      setError(valErr);
      return false;
    }
    setError(null);

    const generated = generateFractionalKnapsackSteps({
      items: customItems,
      capacity: Number(customCap)
    });
    setSteps(generated);
    setCurrentStepIndex(0);
    return true;
  }, [items, capacity]);

  useEffect(() => {
    handleGenerate(DEFAULT_FRACTIONAL_KNAPSACK.items, DEFAULT_FRACTIONAL_KNAPSACK.capacity);
  }, []);

  // Timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
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
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(p => p + 1);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) setCurrentStepIndex(p => p - 1);
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
    const def = DEFAULT_FRACTIONAL_KNAPSACK;
    setItems(def.items.map(it => ({ ...it })));
    setCapacity(def.capacity);
    handleGenerate(def.items, def.capacity);
  };

  const currentStep = steps[currentStepIndex] || null;
  const isFinished = currentStep?.phase === 'complete' || currentStepIndex === steps.length - 1;

  const phaseBadges = {
    init: { label: 'Ratio Calculation', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    sort: { label: 'Greedy Sorting', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    fill: { label: 'Greedy Packing', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    complete: { label: 'Optimal Packing', color: 'bg-emerald-600 text-white border-emerald-600' }
  };

  return (
    <div className="space-y-6">
      {/* Top Grid: Left Inputs & Summary, Right Visualizer & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-5">
          <FractionalKnapsackInput
            items={items}
            capacity={capacity}
            onItemsChange={setItems}
            onCapacityChange={setCapacity}
            onGenerate={() => handleGenerate(items, capacity)}
            onReset={handleReset}
            isExecuting={isPlaying}
            error={error}
          />

          {isFinished && (
            <FractionalKnapsackResult
              maxValue={currentStep?.currentValue ?? 0}
              totalWeight={currentStep?.currentWeight ?? 0}
              capacity={capacity}
              selectedItems={currentStep?.knapsackItems ?? []}
              isVisible={isFinished}
            />
          )}
        </div>

        {/* Right Column: Visualizer & Controls */}
        <div className="lg:col-span-8 space-y-5">
          <FractionalKnapsackVisualizer
            currentStep={currentStep}
            capacity={capacity}
          />

          <AlgorithmControls
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
            phaseBadges={phaseBadges}
          />
        </div>
      </div>

      {/* Bottom Grid: Explanation & Theory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-5">
          <FractionalKnapsackExplanation currentStep={currentStep} />
        </div>
        <div className="lg:col-span-5 space-y-5">
          <FractionalKnapsackTheory />
        </div>
      </div>
    </div>
  );
}
