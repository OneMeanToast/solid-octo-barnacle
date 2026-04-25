import type { ComponentType } from 'react';

/** A clickable, describable subsystem of a vehicle. */
export type PartCategory = string;

export type PartSpec = {
  label: string;
  value: string;
};

export type Part = {
  id: string;
  index: number;
  name: string;
  short: string;
  category: PartCategory;
  description: string;
  role: string;
  specs: PartSpec[];
};

export type Phase = {
  id: string;
  name: string;
  start: number;
  end: number;
  description: string;
  highlights: string[];
  color: string;
};

export type CameraFocus = {
  camera: [number, number, number];
  target: [number, number, number];
};

export type VehicleId = 't72' | 'su57';

export type Vehicle = {
  id: VehicleId;
  name: string;
  /** Short label shown next to the title (e.g. "Main Battle Tank"). */
  subtitle: string;
  /** Era / origin tag shown in the top bar (e.g. "Soviet / Russian · 1973 →"). */
  era: string;
  /** Optional attribution string for CC-BY 3D models. */
  attribution?: string;

  parts: Part[];
  phases: Phase[];
  /** Camera fly-to per-part. */
  cameraFocus: Record<string, CameraFocus>;
  /** Initial camera pose. */
  homePose: CameraFocus;

  /** The 3D component for this vehicle. Mounted under the scene as the active body. */
  Model: ComponentType;

  /** Per-vehicle quick stats shown in CornerHud. */
  stats: { label: string; value: string }[];

  /** Per-vehicle category accent colors. */
  categoryColors: Record<string, string>;
};

/** Helper: phase containing the given progress. */
export function phaseAt(progress: number, phases: Phase[]): Phase {
  for (const p of phases) {
    if (progress >= p.start && progress <= p.end) return p;
  }
  return phases[phases.length - 1];
}

export function localPhaseProgress(progress: number, phase: Phase): number {
  if (phase.end === phase.start) return 0;
  return Math.max(0, Math.min(1, (progress - phase.start) / (phase.end - phase.start)));
}

export function inPhase(progress: number, phases: Phase[], id: string): boolean {
  const p = phases.find((x) => x.id === id);
  if (!p) return false;
  return progress >= p.start && progress <= p.end;
}
