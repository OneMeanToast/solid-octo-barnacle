import type { CameraFocus } from '@/lib/types';

/** Coordinate convention for the Su-57 procedural model:
 *  - +X is forward (nose)
 *  - +Y is up
 *  - length ~6 units, span ~5 units, sits ~0.6 above ground
 */
export const SU57_HOME_POSE: CameraFocus = {
  camera: [7.5, 4.0, 7.5],
  target: [0, 1.0, 0],
};

export const SU57_CAMERA_FOCUS: Record<string, CameraFocus> = {
  airframe:    { camera: [7.0, 3.5, 6.5],   target: [0,    0.9, 0] },
  cockpit:     { camera: [3.4, 2.8, 2.6],   target: [1.6,  1.4, 0] },
  canopy:      { camera: [3.4, 2.8, 2.4],   target: [1.6,  1.5, 0] },
  radar:       { camera: [4.6, 1.6, 2.0],   target: [3.0,  1.0, 0] },
  irst:        { camera: [3.0, 2.4, 2.4],   target: [1.9,  1.5, 0] },
  wings:       { camera: [0.5, 4.2, 5.0],   target: [0,    0.9, 0] },
  tail:        { camera: [-4.5, 3.4, 4.5],  target: [-2.2, 1.4, 0] },
  engines:     { camera: [-3.4, 1.8, 3.6],  target: [-2.4, 0.8, 0] },
  nozzles:     { camera: [-4.6, 1.4, 3.0],  target: [-3.0, 0.7, 0] },
  'main-bay':  { camera: [0.0, -0.6, 4.0],  target: [-0.2, 0.4, 0] },
  'side-bays': { camera: [1.4, 1.4, 3.6],   target: [0.6,  0.7, 1.2] },
  gear:        { camera: [1.5, 0.6, 4.0],   target: [0.8,  0.2, 0] },
  ew:          { camera: [-3.6, 4.0, 4.5],  target: [-2.4, 1.6, 0] },
};
