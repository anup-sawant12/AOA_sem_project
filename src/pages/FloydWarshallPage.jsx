import React, { useState, useEffect, useRef, useCallback } from 'react';
import FloydWarshallInput from '../components/floydWarshall/FloydWarshallInput';
import FloydWarshallGraph from '../components/floydWarshall/FloydWarshallGraph';
import FloydWarshallMatrix from '../components/floydWarshall/FloydWarshallMatrix';
import FloydWarshallExplanation from '../components/floydWarshall/FloydWarshallExplanation';
import FloydWarshallResult from '../components/floydWarshall/FloydWarshallResult';
import FloydWarshallTheory from '../components/floydWarshall/FloydWarshallTheory';
import AlgorithmControls from '../components/common/AlgorithmControls';
import { generateFloydWarshallSteps } from '../algorithms/floydWarshall';
import { DEFAULT_FLOYD_WARSHALL } from '../data/examples';

export default function FloydWarshallPage() {
  const [vertices, setVertices] = useState(() => [...DEFAULT_FLOYD_WARSHALL.vertices]);
  const [edges, setEdges] = useState(() => DEFAULT_FLOYD_WARSHALL.edges.map(e => ({ ...e })));
  const [error, setError] = useState(null);

  // Animation states
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);

  const timerRef = useRef(null);

  const validateGraph = (verts, edgeList) => {
    if (!verts || verts.length < 2) {
      return "Graph must contain at least 2 vertices.";
    }
    if (!edgeList || edgeList.length === 0) {
      return "Please provide at least 1 directed edge.";
    }
    for (let i = 0; i < edgeList.length; i++) {
      const e = edgeList[i];
      if (isNaN(e.weight)) {
        return `Edge ${e.from} -> ${e.to} weight must be a valid number.`;
      }
    }
    return null;
  };

  const handleGenerate = useCallback((customVerts = vertices, customEdges = edges) => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const valErr = validateGraph(customVerts, customEdges);
    if (valErr) {
      setError(valErr);
      return false;
    }
    setError(null);

    const generated = generateFloydWarshallSteps({
      vertices: customVerts,
      edges: customEdges
    });
    setSteps(generated);
    setCurrentStepIndex(0);
    return true;
  }, [vertices, edges]);

  useEffect(() => {
    handleGenerate(DEFAULT_FLOYD_WARSHALL.vertices, DEFAULT_FLOYD_WARSHALL.edges);
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
    const def = DEFAULT_FLOYD_WARSHALL;
    setVertices([...def.vertices]);
    setEdges(def.edges.map(e => ({ ...e })));
    handleGenerate(def.vertices, def.edges);
  };

  const currentStep = steps[currentStepIndex] || null;
  const isFinished = currentStep?.phase === 'complete' || currentStepIndex === steps.length - 1;

  const phaseBadges = {
    init: { label: 'Initial Matrix D^(0)', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    compute: { label: 'Intermediate Node Relaxation', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    complete: { label: 'All-Pairs Shortest Paths Found', color: 'bg-emerald-600 text-white border-emerald-600' }
  };

  return (
    <div className="space-y-6">
      {/* Top Grid: Left Inputs & Summary, Right Graph, Matrix & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-5">
          <FloydWarshallInput
            vertices={vertices}
            edges={edges}
            onVerticesChange={setVertices}
            onEdgesChange={setEdges}
            onGenerate={() => handleGenerate(vertices, edges)}
            onReset={handleReset}
            isExecuting={isPlaying}
            error={error}
          />

          {isFinished && (
            <FloydWarshallResult
              vertices={vertices}
              distMatrix={currentStep?.distMatrix || []}
              nextMatrix={currentStep?.nextMatrix || []}
              hasNegativeCycle={currentStep?.hasNegativeCycle || false}
              isVisible={isFinished}
            />
          )}
        </div>

        {/* Right Column: Graph & Distance Matrix */}
        <div className="lg:col-span-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloydWarshallGraph
              vertices={vertices}
              edges={edges}
              currentStep={currentStep}
            />
            <FloydWarshallMatrix
              vertices={vertices}
              currentStep={currentStep}
            />
          </div>

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
          <FloydWarshallExplanation currentStep={currentStep} />
        </div>
        <div className="lg:col-span-5 space-y-5">
          <FloydWarshallTheory />
        </div>
      </div>
    </div>
  );
}
