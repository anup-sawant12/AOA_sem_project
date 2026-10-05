import React, { useState, useEffect, useRef, useCallback } from 'react';
import MatrixChainInput from '../components/matrixChain/MatrixChainInput';
import MatrixChainTable from '../components/matrixChain/MatrixChainTable';
import MatrixChainExplanation from '../components/matrixChain/MatrixChainExplanation';
import MatrixChainResult from '../components/matrixChain/MatrixChainResult';
import MatrixChainTheory from '../components/matrixChain/MatrixChainTheory';
import AlgorithmControls from '../components/common/AlgorithmControls';
import { generateMatrixChainSteps } from '../algorithms/matrixChain';
import { DEFAULT_MATRIX_CHAIN } from '../data/examples';

export default function MatrixChainPage() {
  const [dimensions, setDimensions] = useState(() => [...DEFAULT_MATRIX_CHAIN.dimensions]);
  const [error, setError] = useState(null);

  // Playback states
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);

  const timerRef = useRef(null);

  const validateDimensions = (dims) => {
    if (!dims || dims.length < 3) {
      return "At least 2 matrices (3 dimensions) are required.";
    }
    if (dims.length > 8) {
      return "Maximum 7 matrices allowed for clear screen visualization.";
    }
    for (let i = 0; i < dims.length; i++) {
      if (!dims[i] || isNaN(dims[i]) || Number(dims[i]) <= 0) {
        return `Dimension p${i} must be a positive integer > 0.`;
      }
    }
    return null;
  };

  const handleGenerate = useCallback((customDims = dimensions) => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const valErr = validateDimensions(customDims);
    if (valErr) {
      setError(valErr);
      return false;
    }
    setError(null);

    const cleanDims = customDims.map(Number);
    const generated = generateMatrixChainSteps({ dimensions: cleanDims });
    setSteps(generated);
    setCurrentStepIndex(0);
    return true;
  }, [dimensions]);

  useEffect(() => {
    handleGenerate(DEFAULT_MATRIX_CHAIN.dimensions);
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
    const def = DEFAULT_MATRIX_CHAIN;
    setDimensions([...def.dimensions]);
    handleGenerate(def.dimensions);
  };

  const currentStep = steps[currentStepIndex] || null;
  const isFinished = currentStep?.phase === 'complete' || currentStepIndex === steps.length - 1;

  const phaseBadges = {
    init: { label: 'Base Initialization', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    compute: { label: 'Diagonal Chain Evaluation', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    backtrack: { label: 'Parenthesization Backtrack', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    complete: { label: 'Optimal Order Found', color: 'bg-emerald-600 text-white border-emerald-600' }
  };

  return (
    <div className="space-y-6">
      {/* Top Grid: Left Inputs & Summary, Right Table & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-5">
          <MatrixChainInput
            dimensions={dimensions}
            onDimensionsChange={setDimensions}
            onGenerate={() => handleGenerate(dimensions)}
            onReset={handleReset}
            isExecuting={isPlaying}
            error={error}
          />

          {isFinished && (
            <MatrixChainResult
              minOperations={currentStep?.minOperations ?? 0}
              optimalParens={currentStep?.optimalParens || ''}
              backtrackDetails={currentStep?.backtrackDetails || []}
              isVisible={isFinished}
            />
          )}
        </div>

        {/* Right Column: Table & Controls */}
        <div className="lg:col-span-8 space-y-5">
          <MatrixChainTable
            dimensions={dimensions}
            currentStep={currentStep}
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
          <MatrixChainExplanation currentStep={currentStep} />
        </div>
        <div className="lg:col-span-5 space-y-5">
          <MatrixChainTheory />
        </div>
      </div>
    </div>
  );
}
