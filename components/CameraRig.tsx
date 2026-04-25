'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useExplorer } from '@/lib/store';
import { useActiveVehicle } from '@/lib/vehicles';

type OrbitControlsImpl = React.ElementRef<typeof OrbitControls>;

export function CameraRig() {
  const vehicle = useActiveVehicle();
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const target = useRef<{ pos: THREE.Vector3; tgt: THREE.Vector3; t: number } | null>(null);

  const selectedPart = useExplorer((s) => s.selectedPart);
  const cameraResetToken = useExplorer((s) => s.cameraResetToken);
  const autoRotate = useExplorer((s) => s.autoRotate);

  // Apply the active vehicle's home pose on mount + when it changes.
  useEffect(() => {
    const home = vehicle.homePose;
    target.current = {
      pos: new THREE.Vector3(...home.camera),
      tgt: new THREE.Vector3(...home.target),
      t: 0,
    };
  }, [vehicle, cameraResetToken]);

  // Selection -> fly to part using the active vehicle's focus map.
  useEffect(() => {
    if (!selectedPart) return;
    const focus = vehicle.cameraFocus[selectedPart];
    if (!focus) return;
    target.current = {
      pos: new THREE.Vector3(...focus.camera),
      tgt: new THREE.Vector3(...focus.target),
      t: 0,
    };
  }, [selectedPart, vehicle]);

  useFrame((_, dt) => {
    if (target.current && controls.current) {
      target.current.t = Math.min(1, target.current.t + dt * 1.4);
      const k = easeInOutCubic(target.current.t);
      camera.position.lerp(target.current.pos, k * 0.18);
      controls.current.target.lerp(target.current.tgt, k * 0.18);
      controls.current.update();
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
      maxDistance={32}
      maxPolarAngle={Math.PI / 2 - 0.05}
      autoRotate={autoRotate}
      autoRotateSpeed={0.6}
    />
  );
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
