import React from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Gauge, 
  Activity 
} from 'lucide-react';

export default function KnapsackControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onPlayPause,
  onPrev,
  onNext,
  onRestart,
  onSpeedChange,
  onSeek,
  currentPhase = 'compute',
}) {
  const progressPercent = totalSteps > 1 
    ? Math.round((currentStepIndex / (totalSteps - 1)) * 100) 
    : 0;

  const phaseBadges = {
    init: { label: 'Initialization', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    compute: { label: 'Table Filling (DP)', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    backtrack_start: { label: 'Backtracking Start', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    backtrack: { label: 'Backtracking Trail', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
    complete: { label: 'Complete / Optimal', color: 'bg-emerald-600 text-white border-emerald-600' },
  };

  const currentBadge = phaseBadges[currentPhase] || phaseBadges.compute;

  return (
    <Card className="border-slate-200" bodyClassName="p-4">
      <div className="flex flex-col gap-3">
        {/* Top: Progress and Phase */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Progress:
            </span>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-800 border border-slate-200">
              Step {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${currentBadge.color}`}>
              {currentBadge.label}
            </span>
          </div>

          {/* Speed selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1" />
            <span className="text-slate-500 text-[11px] font-medium mr-1">Speed:</span>
            {[
              { label: 'Slow', value: 1200 },
              { label: 'Normal', value: 600 },
              { label: 'Fast', value: 200 }
            ].map(s => (
              <button
                key={s.label}
                onClick={() => onSpeedChange(s.value)}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${
                  speed === s.value
                    ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar & Scrubber */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max={Math.max(0, totalSteps - 1)}
              value={currentStepIndex}
              onChange={(e) => onSeek(Number(e.target.value))}
              disabled={totalSteps <= 1}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Start</span>
            <span>{progressPercent}% Complete</span>
            <span>End</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <Button
            onClick={onRestart}
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            title="Restart from beginning"
            disabled={totalSteps <= 1 || currentStepIndex === 0}
          >
            Restart
          </Button>

          <Button
            onClick={onPrev}
            variant="secondary"
            size="md"
            icon={SkipBack}
            disabled={totalSteps <= 1 || currentStepIndex === 0}
            title="Previous step"
          >
            Previous
          </Button>

          <Button
            onClick={onPlayPause}
            variant={isPlaying ? 'secondary' : 'primary'}
            size="md"
            icon={isPlaying ? Pause : Play}
            className="min-w-[110px] font-semibold shadow-sm"
            disabled={totalSteps <= 1}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button
            onClick={onNext}
            variant="secondary"
            size="md"
            icon={SkipForward}
            disabled={totalSteps <= 1 || currentStepIndex >= totalSteps - 1}
            title="Next step"
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
