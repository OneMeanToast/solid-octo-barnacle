'use client';

import { useExplorer } from '@/lib/store';

export function AboutModal() {
  const open = useExplorer((s) => s.aboutOpen);
  const setOpen = useExplorer((s) => s.setAboutOpen);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="panel rounded-lg max-w-lg w-[90%] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-100 text-lg leading-none"
        >
          ×
        </button>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-1">
          About
        </div>
        <h2 className="text-xl font-semibold text-slate-100 mb-3">
          T-72 Tank Explorer
        </h2>
        <p className="text-[13px] leading-relaxed text-slate-300 mb-3">
          An interactive 3D explainer for the Soviet/Russian T-72 main battle
          tank. The interface is inspired by the{' '}
          <span className="text-accent">Artemis II Mission Explorer</span> — a
          dark, cinematic layout with a clickable component tree, a contextual
          detail panel, a scrubable phase timeline, and switchable visual
          themes.
        </p>
        <p className="text-[13px] leading-relaxed text-slate-300 mb-3">
          Built with <span className="text-slate-100">Next.js 14</span>,{' '}
          <span className="text-slate-100">React Three Fiber</span>,{' '}
          <span className="text-slate-100">@react-three/drei</span> and{' '}
          <span className="text-slate-100">@react-three/postprocessing</span>.
          The model is a procedural T-72 assembled from primitives so every
          subsystem is individually addressable for hover, selection, and
          animation.
        </p>
        <ul className="text-[12px] text-slate-400 leading-relaxed list-disc list-inside space-y-0.5 mb-4">
          <li>Three seamless themes — Blueprint, Field, Cinematic.</li>
          <li>Six-phase mission timeline with synchronized animations.</li>
          <li>Hover labels, fly-to camera, exploded maintenance view.</li>
          <li>Particle systems for exhaust, dust, and muzzle blast.</li>
        </ul>
        <div className="text-[11px] font-mono text-slate-500 pt-3 border-t border-bg-border">
          Educational use. Specifications drawn from public open-source
          references on the T-72A and T-72B variants.
        </div>
      </div>
    </div>
  );
}
