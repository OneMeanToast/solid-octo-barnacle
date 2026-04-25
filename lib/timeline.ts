import type { PartId } from './parts';

export type Phase = {
  id: string;
  name: string;
  /** start fraction of the timeline (0..1) */
  start: number;
  /** end fraction of the timeline (0..1) */
  end: number;
  description: string;
  /** Parts most relevant during this phase (used for subtle hint highlights). */
  highlights: PartId[];
  color: string;
};

export const PHASES: Phase[] = [
  {
    id: 'idle',
    name: 'Idle',
    start: 0.0,
    end: 0.1,
    description: 'Vehicle parked, systems cold. Static technical display.',
    highlights: ['hull', 'turret'],
    color: '#7be3ff',
  },
  {
    id: 'startup',
    name: 'Start-up',
    start: 0.1,
    end: 0.3,
    description: 'V-84 multi-fuel diesel cranked. Exhaust plume and warm-up.',
    highlights: ['engine'],
    color: '#ffb86b',
  },
  {
    id: 'aim',
    name: 'Aim',
    start: 0.3,
    end: 0.5,
    description: 'Turret traverse and 2A46 gun elevation under stabilizer.',
    highlights: ['turret', 'main-gun', 'fcs', 'optics'],
    color: '#ffd66b',
  },
  {
    id: 'maneuver',
    name: 'Maneuver',
    start: 0.5,
    end: 0.7,
    description: 'Forward drive. Tracks roll, road wheels rotate, dust kicks up.',
    highlights: ['tracks', 'engine'],
    color: '#a4ff8a',
  },
  {
    id: 'engage',
    name: 'Engage',
    start: 0.7,
    end: 0.85,
    description: 'Firing sequence: muzzle flash, recoil, autoloader cycle.',
    highlights: ['main-gun', 'autoloader', 'ammo'],
    color: '#ff6b6b',
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    start: 0.85,
    end: 1.0,
    description: 'Exploded view. Components separate to reveal layout.',
    highlights: ['era', 'engine', 'autoloader', 'ammo'],
    color: '#c08bff',
  },
];

export function phaseAt(progress: number): Phase {
  for (const p of PHASES) {
    if (progress >= p.start && progress <= p.end) return p;
  }
  return PHASES[PHASES.length - 1];
}

/** Returns 0..1 within the phase (smooth scrubbing inside). */
export function localPhaseProgress(progress: number, phase: Phase): number {
  if (phase.end === phase.start) return 0;
  return Math.max(0, Math.min(1, (progress - phase.start) / (phase.end - phase.start)));
}

/** True when the timeline is currently inside the given phase. */
export function inPhase(progress: number, id: string): boolean {
  const p = PHASES.find((x) => x.id === id);
  if (!p) return false;
  return progress >= p.start && progress <= p.end;
}
