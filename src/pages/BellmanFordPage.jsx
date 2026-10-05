import React, { useState, useEffect, useRef, useCallback } from 'react';
import BellmanFordInput from '../components/bellmanFord/BellmanFordInput';
import BellmanFordGraph from '../components/bellmanFord/BellmanFordGraph';
import BellmanFordTable from '../components/bellmanFord/BellmanFordTable';
import BellmanFordExplanation from '../components/bellmanFord/BellmanFordExplanation';
import BellmanFordResult from '../components/bellmanFord/BellmanFordResult';
import BellmanFordTheory from '../components/bellmanFord/BellmanFordTheory';
import AlgorithmControls from '../components/common/AlgorithmControls';
import { generateBellmanFordSteps } from '../algorithms/bellmanFord';
import { DEFAULT_BELLMAN_FORD } from '../data/examples';

export default function BellmanFordPage() {
  const [vertices, setVertices] = useState(() => [...DEFAULT_BELLMAN_FORD.vertices]);
  const [edges, setEdges] = useState(() => DEFAULT_BELLMAN_FORD.edges.map(e => ({ ...e })));
  const [source, setSource] = useState(DEFAULT_BELLMAN_FORD.source);
  const [error, setError] = useState(null);

  // Animation states
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);

  const timerRef = useRef(null);

  const validateGraph = (verts, edgeList, src) => {
    if (!verts || verts.length < 2) {
      return "Graph must contain at least 2 vertices.";
    }
    if (!edgeList || edgeList.length === 0) {
      return "Please provide at least 1 directed edge.";
    }
    if (!verts.includes(src)) {
      return `Source vertex '${src}' must belong to the graph vertices.`;
    }
    for (let i = 0; i < edgeList.length; i++) {
      const e = edgeList[i];
      if (isNaN(e.weight)) {
        return `Edge ${e.from} -> ${e.to} weight must be a valid number.`;
      }
    }
    return null;
  };

  const handleGenerate = useCallback((customVerts = vertices, customEdges = edges, customSrc = source) => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const valErr = validateGraph(customVerts, customEdges, customSrc);
    if (valErr) {
      setError(valErr);
      return false;
    }
    setError(null);

    const generated = generateBellmanFordSteps({
      vertices: customVerts,
      edges: customEdges,
      source: customSrc
    });
    setSteps(generated);
    setCurrentStepIndex(0);
    return true;
  }, [vertices, edges, source]);

  useEffect(() => {
    handleGenerate(DEFAULT_BELLMAN_FORD.vertices, DEFAULT_BELLMAN_FORD.edges, DEFAULT_BELLMAN_FORD.source);
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
    const def = DEFAULT_BELLMAN_FORD;
    setVertices([...def.vertices]);
    setEdges(def.edges.map(e => ({ ...e })));
    setSource(def.source);
    handleGenerate(def.vertices, def.edges, def.source);
  };

  const currentStep = steps[currentStepIndex] || null;
  const isFinished = currentStep?.phase === 'complete' || currentStepIndex === steps.length - 1;

  const phaseBadges = {
    init: { label: 'Distance Table Init', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    relax: { label: 'Edge Relaxation Pass', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    check: { label: 'Negative Cycle Check', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    complete: { label: 'Single-Source Shortest Paths', color: 'bg-emerald-600 text-white border-emerald-600' }
  };

  return (
    <div className="space-y-6">
      {/* Top Grid: Left Inputs & Summary, Right Graph, Table & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-5">
          <BellmanFordInput
            vertices={vertices}
            edges={edges}
            source={source}
            onVerticesChange={setVertices}
            onEdgesChange={setEdges}
            onSourceChange={setSource}
            onGenerate={() => handleGenerate(vertices, edges, source)}
            onReset={handleReset}
            isExecuting={isPlaying}
            error={error}
          />

          {isFinished && (
            <BellmanFordResult
              vertices={vertices}
              source={source}
              dist={currentStep?.dist || {}}
              predecessor={currentStep?.predecessor || {}}
              hasNegativeCycle={currentStep?.hasNegativeCycle || false}
              edges={edges}
              isVisible={isFinished}
            />
          )}
        </div>

        {/* Right Column: Graph & Distance Table */}
        <div className="lg:col-span-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BellmanFordGraph
              vertices={vertices}
              edges={edges}
              source={source}
              currentStep={currentStep}
            />
            <BellmanFordTable
              vertices={vertices}
              source={source}
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
          <BellmanFordExplanation currentStep={currentStep} />
        </div>
        <div className="lg:col-span-5 space-y-5">
          <BellmanFordTheory />
        </div>
      </div>
    </div>
  );
}
