import {
  inPhase as _inPhase,
  phaseAt as _phaseAt,
  localPhaseProgress as _localPhaseProgress,
} from '@/lib/types';
import { T72_PHASES } from './phases';

/** Pre-bound timeline helpers for T-72-specific Tank + Particle components. */
export const phaseAt = (progress: number) => _phaseAt(progress, T72_PHASES);
export const inPhase = (progress: number, id: string) =>
  _inPhase(progress, T72_PHASES, id);
export const localPhaseProgress = _localPhaseProgress;

export { T72_PHASES };
