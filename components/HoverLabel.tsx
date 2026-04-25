'use client';

import { Html } from '@react-three/drei';
import { useExplorer } from '@/lib/store';
import { useActiveVehicle } from '@/lib/vehicles';

/** Floating tooltip that follows the hovered part in screen-space. */
export function HoverLabel() {
  const vehicle = useActiveVehicle();
  const hoveredPart = useExplorer((s) => s.hoveredPart);
  const hoverPos = useExplorer((s) => s.hoverPos);
  const selectedPart = useExplorer((s) => s.selectedPart);

  if (!hoveredPart || !hoverPos || hoveredPart === selectedPart) return null;
  const part = vehicle.parts.find((p) => p.id === hoveredPart);
  if (!part) return null;

  return (
    <Html
      position={hoverPos}
      style={{ pointerEvents: 'none', transform: 'translate(12px, -12px)' }}
      zIndexRange={[10, 0]}
    >
      <div className="panel px-2.5 py-1.5 text-[11px] tracking-wide font-mono whitespace-nowrap">
        <span className="text-accent">[{String(part.index).padStart(2, '0')}]</span>{' '}
        <span className="text-slate-100">{part.name}</span>
      </div>
    </Html>
  );
}
