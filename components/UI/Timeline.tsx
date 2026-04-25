'use client';

import { useEffect, useMemo } from 'react';
import { useExplorer, type Speed } from '@/lib/store';
import { useActiveVehicle } from '@/lib/vehicles';
import { phaseAt } from '@/lib/types';

const SPEEDS: Speed[] = [1, 2, 3, 5];

export function Timeline() {
  const vehicle = useActiveVehicle();
  const progress = useExplorer((s) => s.progress);
  const playing = useExplorer((s) => s.playing);
  const speed = useExplorer((s) => s.speed);
  const setProgress = useExplorer((s) => s.setProgress);
  const togglePlay = useExplorer((s) => s.togglePlay);
  const setPlaying = useExplorer((s) => s.setPlaying);
  const setSpeed = useExplorer((s) => s.setSpeed);

  const phase = useMemo(
    () => phaseAt(progress, vehicle.phases),
    [progress, vehicle.phases],
  );

  // Spacebar shortcut for play/pause; arrows for scrub
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        setProgress(progress + 0.02);
      } else if (e.code === 'ArrowLeft') {
        setProgress(progress - 0.02);
      } else if (e.code === 'KeyR') {
        setProgress(0);
        setPlaying(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [progress, setProgress, setPlaying, togglePlay]);

  return (
    <footer className="absolute left-4 right-4 bottom-4 z-20">
      <div className="panel rounded-md px-4 py-3">
        {/* Top row: phase label + transport + speed */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded bg-accent/15 hover:bg-accent/25 text-accent flex items-center justify-center shadow-glow"
              title={playing ? 'Pause (space)' : 'Play (space)'}
            >
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <rect x="2" y="1" width="3.5" height="12" fill="currentColor" />
                  <rect x="8.5" y="1" width="3.5" height="12" fill="currentColor" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M2 1 L13 7 L2 13 Z" fill="currentColor" />
                </svg>
              )}
            </button>
            <button
              onClick={() => {
                setProgress(0);
                setPlaying(false);
              }}
              className="text-slate-400 hover:text-slate-100 text-[10px] font-mono uppercase tracking-widest"
              title="Reset (R)"
            >
              ⏮ Reset
            </button>
            <div className="hidden md:flex items-center gap-3 min-w-0">
              <div
                className="font-mono text-[10px] uppercase tracking-[0.25em]"
                style={{ color: phase.color }}
              >
                Phase
              </div>
              <div className="text-slate-100 text-sm font-semibold tracking-wide truncate">
                {phase.name}
              </div>
              <div className="text-slate-500 text-[11px] truncate">
                {phase.description}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest hidden sm:block">
              Speed
            </div>
            <div className="panel px-1 py-1 flex items-center gap-1">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-widest transition-colors ${
                    speed === s
                      ? 'bg-accent/15 text-accent'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            <div className="font-mono text-[11px] text-slate-300 tabular-nums w-14 text-right">
              {(progress * 100).toFixed(0).padStart(3, '0')}%
            </div>
          </div>
        </div>

        {/* Phase strip */}
        <div className="relative h-7 mb-1">
          <div className="absolute inset-0 flex rounded overflow-hidden border border-bg-border">
            {vehicle.phases.map((p) => {
              const w = (p.end - p.start) * 100;
              const inThis = progress >= p.start && progress <= p.end;
              return (
                <button
                  key={p.id}
                  onClick={() => setProgress(p.start + 0.001)}
                  style={{
                    width: `${w}%`,
                    background: inThis ? `${p.color}25` : 'transparent',
                    borderRight: '1px solid rgba(120,160,200,0.10)',
                  }}
                  className="relative group"
                  title={p.description}
                >
                  <span
                    className="absolute inset-0 flex items-center justify-center text-[9px] font-mono uppercase tracking-widest transition-colors"
                    style={{ color: inThis ? p.color : '#64748b' }}
                  >
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrubber */}
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(e) => setProgress(Number(e.target.value) / 1000)}
          className="scrubber w-full"
          style={{ ['--p' as string]: `${progress * 100}%` }}
        />
      </div>
    </footer>
  );
}
