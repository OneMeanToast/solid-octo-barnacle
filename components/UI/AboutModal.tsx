'use client';

import { useExplorer } from '@/lib/store';
import { useActiveVehicle, VEHICLE_LIST } from '@/lib/vehicles';

export function AboutModal() {
  const open = useExplorer((s) => s.aboutOpen);
  const setOpen = useExplorer((s) => s.setAboutOpen);
  const vehicle = useActiveVehicle();
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
          Vehicle Explorer
        </h2>
        <p className="text-[13px] leading-relaxed text-slate-300 mb-3">
          A general-purpose interactive 3D explainer with a registry of
          vehicles. Each entry brings its own subsystem list, mission
          timeline, and (procedural or imported) 3D model into a shared
          shell — cinematic HUD, theme system, particle effects, fly-to
          camera. Inspired by the{' '}
          <span className="text-accent">Artemis II Mission Explorer</span>.
        </p>
        <p className="text-[13px] leading-relaxed text-slate-300 mb-3">
          Built with <span className="text-slate-100">Next.js 14</span>,{' '}
          <span className="text-slate-100">React Three Fiber</span>,{' '}
          <span className="text-slate-100">@react-three/drei</span> and{' '}
          <span className="text-slate-100">@react-three/postprocessing</span>.
        </p>
        <div className="rounded panel-flat p-3 mb-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-1.5">
            Loaded vehicles
          </div>
          <ul className="text-[12px] text-slate-300 leading-relaxed space-y-1">
            {VEHICLE_LIST.map((v) => (
              <li key={v.id} className="flex items-baseline gap-2">
                <span className="text-accent font-mono">{v.name}</span>
                <span className="text-slate-500">·</span>
                <span>{v.subtitle}</span>
                <span className="text-slate-600 ml-auto font-mono text-[10px]">
                  {v.parts.length} parts · {v.phases.length} phases
                </span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="text-[12px] text-slate-400 leading-relaxed list-disc list-inside space-y-0.5 mb-4">
          <li>Three seamless themes — Blueprint, Field, Cinematic.</li>
          <li>Per-vehicle phase timeline with synchronized animations.</li>
          <li>Hover labels, fly-to camera, theme-aware post-processing.</li>
          <li>Drop-in GLTF support: place a .glb at <code className="text-slate-300">/public/models/&lt;vehicle&gt;/scene.glb</code>.</li>
        </ul>
        {vehicle.attribution && (
          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-bg-border mb-2">
            Attribution: {vehicle.attribution}
          </div>
        )}
        <div className="text-[11px] font-mono text-slate-500 pt-3 border-t border-bg-border">
          Educational use. Specifications drawn from public open-source
          references.
        </div>
      </div>
    </div>
  );
}
