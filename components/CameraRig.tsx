'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useExplorer } from '@/lib/store';

type OrbitControlsImpl = React.ElementRef<typeof OrbitControls>;
import type { PartId } from '@/lib/parts';

const HOME_POS = new THREE.Vector3(7.5, 4.2, 8.5);
const HOME_TARGET = new THREE.Vector3(0, 1.0, 0);

/** Per-part cinematic focus targets in world space (matches Tank assembly). */
const FOCUS: Record<PartId, { camera: [number, number, number]; target: [number, number, number] }> = {
  hull:           { camera: [6.5, 2.4, 6.0],   target: [0,    0.6, 0] },
  turret:         { camera: [3.5, 3.4, 4.5],   target: [0.2,  1.4, 0] },
  'main-gun':     { camera: [5.0, 1.7, 3.2],   target: [3.0,  1.1, 0] },
  autoloader:    { camera: [2.6, 1.0, 2.6],   target: [0,    0.4, 0] },
  era:            { camera: [4.0, 2.0, 4.0],   target: [1.5,  1.1, 0] },
  tracks:         { camera: [4.0, 1.4, 4.5],   target: [0,    0.3, 1.2] },
  engine:         { camera: [-3.5, 3.2, 4.5],  target: [-1.6, 1.0, 0] },
  driver:         { camera: [3.5, 2.6, 2.8],   target: [1.85, 1.0, 0] },
  cupola:         { camera: [1.5, 3.2, 3.5],   target: [0.0,  1.7, 0.5] },
  mg:             { camera: [1.5, 3.0, 3.0],   target: [0.3,  1.9, 0.5] },
  'smoke-launchers': { camera: [3.4, 2.6, 3.2], target: [1.0, 1.5, 0.95] },
  optics:         { camera: [2.4, 2.7, 3.2],   target: [0.55, 1.6, -0.5] },
  ammo:           { camera: [-1.6, 2.6, 3.4],  target: [-1.2, 0.7, 0] },
  fcs:            { camera: [-0.6, 3.0, 3.6],  target: [-0.65, 1.7, -0.4] },
};

export function CameraRig() {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const target = useRef<{ pos: THREE.Vector3; tgt: THREE.Vector3; t: number } | null>(null);

  const selectedPart = useExplorer((s) => s.selectedPart);
  const cameraResetToken = useExplorer((s) => s.cameraResetToken);
  const autoRotate = useExplorer((s) => s.autoRotate);

  // Initial home pose
  useEffect(() => {
    camera.position.copy(HOME_POS);
    if (controls.current) {
      controls.current.target.copy(HOME_TARGET);
      controls.current.update();
    }
  }, [camera]);

  // Reset
  useEffect(() => {
    target.current = {
      pos: HOME_POS.clone(),
      tgt: HOME_TARGET.clone(),
      t: 0,
    };
  }, [cameraResetToken]);

  // Selection -> fly to part
  useEffect(() => {
    if (!selectedPart) return;
    const focus = FOCUS[selectedPart as PartId];
    if (!focus) return;
    target.current = {
      pos: new THREE.Vector3(...focus.camera),
      tgt: new THREE.Vector3(...focus.target),
      t: 0,
    };
  }, [selectedPart]);

  useFrame((_, dt) => {
    if (target.current && controls.current) {
      target.current.t = Math.min(1, target.current.t + dt * 1.4);
      const k = easeInOutCubic(target.current.t);
      camera.position.lerp(target.current.pos, k * 0.18);
      controls.current.target.lerp(target.current.tgt, k * 0.18);
      controls.current.update();
      // close enough — drop target so the user regains direct control
      if (target.current.t >= 1 && camera.position.distanceTo(target.current.pos) < 0.02) {
        target.current = null;
      }
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={3.5}
      maxDistance={28}
      maxPolarAngle={Math.PI / 2 - 0.05}
      autoRotate={autoRotate}
      autoRotateSpeed={0.6}
    />
  );
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
