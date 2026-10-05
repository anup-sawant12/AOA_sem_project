import React, { useState, useEffect, useRef, useCallback } from 'react';
import LCSInput from '../components/lcs/LCSInput';
import LCSTable from '../components/lcs/LCSTable';
import LCSExplanation from '../components/lcs/LCSExplanation';
import LCSResult from '../components/lcs/LCSResult';
import LCSTheory from '../components/lcs/LCSTheory';
import AlgorithmControls from '../components/common/AlgorithmControls';
import { generateLCSSteps } from '../algorithms/lcs';
import { DEFAULT_LCS } from '../data/examples';

export default function LCSPage() {
  const [str1, setStr1] = useState(DEFAULT_LCS.str1);
  const [str2, setStr2] = useState(DEFAULT_LCS.str2);
  const [error, setError] = useState(null);

  // Animation states
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);

  const timerRef = useRef(null);

  const validateStrings = (s1, s2) => {
    if (!s1 || s1.trim().length === 0) {
      return "String 1 cannot be empty.";
    }
    if (!s2 || s2.trim().length === 0) {
      return "String 2 cannot be empty.";
    }
    if (s1.length > 10 || s2.length > 10) {
      return "For readable table layout, please limit strings to 10 characters.";
    }
    return null;
  };

  const handleGenerate = useCallback((customS1 = str1, customS2 = str2) => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const valErr = validateStrings(customS1, customS2);
    if (valErr) {
      setError(valErr);
      return false;
    }
    setError(null);

    const generated = generateLCSSteps({ str1: customS1.trim(), str2: customS2.trim() });
    setSteps(generated);
    setCurrentStepIndex(0);
    return true;
  }, [str1, str2]);

  useEffect(() => {
    handleGenerate(DEFAULT_LCS.str1, DEFAULT_LCS.str2);
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
    const def = DEFAULT_LCS;
    setStr1(def.str1);
    setStr2(def.str2);
    handleGenerate(def.str1, def.str2);
  };

  const currentStep = steps[currentStepIndex] || null;
  const isFinished = currentStep?.phase === 'complete' || currentStepIndex === steps.length - 1;

  const phaseBadges = {
    init: { label: 'Base Cases Setup', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    compute: { label: 'Cell-by-Cell Matching', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    backtrack: { label: 'Subsequence Backtrack', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    complete: { label: 'LCS Completed', color: 'bg-emerald-600 text-white border-emerald-600' }
  };

  return (
    <div className="space-y-6">
      {/* Top Grid: Left Inputs & Summary, Right Table & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-5">
          <LCSInput
            str1={str1}
            str2={str2}
            onStr1Change={setStr1}
            onStr2Change={setStr2}
            onGenerate={() => handleGenerate(str1, str2)}
            onReset={handleReset}
            isExecuting={isPlaying}
            error={error}
          />

          {isFinished && (
            <LCSResult
              str1={str1}
              str2={str2}
              lcsString={currentStep?.lcsString || ''}
              length={currentStep?.length ?? 0}
              matchedIndices={currentStep?.matchedIndices || { str1: [], str2: [] }}
              isVisible={isFinished}
            />
          )}
        </div>

        {/* Right Column: Table & Controls */}
        <div className="lg:col-span-8 space-y-5">
          <LCSTable
            str1={str1}
            str2={str2}
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
          <LCSExplanation currentStep={currentStep} />
        </div>
        <div className="lg:col-span-5 space-y-5">
          <LCSTheory />
        </div>
      </div>
    </div>
  );
}
