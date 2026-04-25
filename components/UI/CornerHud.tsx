'use client';

import { useExplorer } from '@/lib/store';
import { useActiveVehicle } from '@/lib/vehicles';
import { phaseAt } from '@/lib/types';

/** Subtle corner readouts (top-center under top bar, bottom-right above timeline). */
export function CornerHud() {
  const vehicle = useActiveVehicle();
  const progress = useExplorer((s) => s.progress);
  const theme = useExplorer((s) => s.theme);
  const phase = phaseAt(progress, vehicle.phases);

  return (
    <>
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="panel-flat rounded px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 flex items-center gap-3">
          <span className="text-slate-500">SYS</span>
          <span className="text-accent">ONLINE</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">MODE</span>
          <span className="text-slate-200">{theme.toUpperCase()}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">PHASE</span>
          <span style={{ color: phase.color }}>{phase.name.toUpperCase()}</span>
        </div>
      </div>

      <div className="absolute right-4 bottom-32 z-10 pointer-events-none hidden lg:block">
        <div className="panel-flat rounded px-3 py-2 font-mono text-[10px] text-slate-400 leading-snug min-w-[120px]">
          {vehicle.stats.map((s) => (
            <div key={s.label}>
              <span className="text-slate-600">{s.label}</span>{' '}
              <span className="text-slate-200">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
