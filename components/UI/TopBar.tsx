'use client';

import { useEffect } from 'react';
import { useExplorer, type Theme } from '@/lib/store';

const THEMES: { id: Theme; label: string; hint: string }[] = [
  { id: 'blueprint', label: 'BLUEPRINT', hint: 'Schematic / wireframe' },
  { id: 'realistic', label: 'FIELD', hint: 'PBR daylight' },
  { id: 'cinematic', label: 'CINEMATIC', hint: 'Bloom + DOF' },
];

export function TopBar() {
  const theme = useExplorer((s) => s.theme);
  const setTheme = useExplorer((s) => s.setTheme);
  const resetCamera = useExplorer((s) => s.resetCamera);
  const autoRotate = useExplorer((s) => s.autoRotate);
  const toggleAutoRotate = useExplorer((s) => s.toggleAutoRotate);
  const soundEnabled = useExplorer((s) => s.soundEnabled);
  const toggleSound = useExplorer((s) => s.toggleSound);
  const setAboutOpen = useExplorer((s) => s.setAboutOpen);
  const isFullscreen = useExplorer((s) => s.isFullscreen);
  const setFullscreen = useExplorer((s) => s.setFullscreen);

  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [setFullscreen]);

  const goFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 pointer-events-none">
      {/* Title block */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="panel px-3 py-2 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent shadow-glow pulse-soft" />
          <div className="font-mono leading-tight">
            <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
              Tank Explorer
            </div>
            <div className="text-sm font-semibold text-slate-100 tracking-wide">
              T-72 <span className="text-accent">·</span>{' '}
              <span className="text-slate-300">Main Battle Tank</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block panel px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-400">
          Soviet / Russian · 1973 →
        </div>
      </div>

      {/* Theme switcher + actions */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="panel px-1 py-1 flex items-center gap-1">
          {THEMES.map((t) => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={t.hint}
                className={`px-2.5 py-1.5 rounded text-[10px] font-mono uppercase tracking-widest transition-colors ${
                  active
                    ? 'bg-accent/15 text-accent shadow-glow'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={toggleAutoRotate}
          title="Toggle auto-rotate"
          className={`panel px-2.5 py-2 text-[10px] font-mono uppercase tracking-widest hover:text-accent ${
            autoRotate ? 'text-accent' : 'text-slate-400'
          }`}
        >
          {autoRotate ? '◐ AUTO' : '◌ AUTO'}
        </button>

        <button
          onClick={resetCamera}
          title="Reset camera"
          className="panel px-2.5 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-accent"
        >
          ⟳ RESET
        </button>

        <button
          onClick={toggleSound}
          title="Toggle sound"
          className={`panel px-2.5 py-2 text-[10px] font-mono uppercase tracking-widest hover:text-accent ${
            soundEnabled ? 'text-accent' : 'text-slate-400'
          }`}
        >
          {soundEnabled ? '♪ SND' : '✕ SND'}
        </button>

        <button
          onClick={goFullscreen}
          title="Toggle fullscreen"
          className="panel px-2.5 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-accent"
        >
          {isFullscreen ? '✕ EXIT' : '⛶ FULL'}
        </button>

        <button
          onClick={() => setAboutOpen(true)}
          title="About"
          className="panel px-2.5 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-accent"
        >
          ? ABOUT
        </button>
      </div>
    </header>
  );
}
