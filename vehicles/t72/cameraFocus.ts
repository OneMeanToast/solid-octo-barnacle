import type { CameraFocus } from '@/lib/types';

export const T72_HOME_POSE: CameraFocus = {
  camera: [7.5, 4.2, 8.5],
  target: [0, 1.0, 0],
};

export const T72_CAMERA_FOCUS: Record<string, CameraFocus> = {
  hull:              { camera: [6.5, 2.4, 6.0],   target: [0,    0.6, 0] },
  turret:            { camera: [3.5, 3.4, 4.5],   target: [0.2,  1.4, 0] },
  'main-gun':        { camera: [5.0, 1.7, 3.2],   target: [3.0,  1.1, 0] },
  autoloader:       { camera: [2.6, 1.0, 2.6],   target: [0,    0.4, 0] },
  era:               { camera: [4.0, 2.0, 4.0],   target: [1.5,  1.1, 0] },
  tracks:            { camera: [4.0, 1.4, 4.5],   target: [0,    0.3, 1.2] },
  engine:            { camera: [-3.5, 3.2, 4.5],  target: [-1.6, 1.0, 0] },
  driver:            { camera: [3.5, 2.6, 2.8],   target: [1.85, 1.0, 0] },
  cupola:            { camera: [1.5, 3.2, 3.5],   target: [0.0,  1.7, 0.5] },
  mg:                { camera: [1.5, 3.0, 3.0],   target: [0.3,  1.9, 0.5] },
  'smoke-launchers': { camera: [3.4, 2.6, 3.2],   target: [1.0,  1.5, 0.95] },
  optics:            { camera: [2.4, 2.7, 3.2],   target: [0.55, 1.6, -0.5] },
  ammo:              { camera: [-1.6, 2.6, 3.4],  target: [-1.2, 0.7, 0] },
  fcs:               { camera: [-0.6, 3.0, 3.6],  target: [-0.65, 1.7, -0.4] },
};
