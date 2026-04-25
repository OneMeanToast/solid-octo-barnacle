'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { ThemeEnvironment } from './Environment/ThemeEnvironment';
import { PostFX } from './Environment/PostFX';
import { CameraRig } from './CameraRig';
import { HoverLabel } from './HoverLabel';
import { useExplorer } from '@/lib/store';
import { useActiveVehicle } from '@/lib/vehicles';

/** Drives the global timeline progress while playing. */
function TimelineDriver() {
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      const { playing, speed, progress, setProgress, setPlaying } = useExplorer.getState();
      if (playing) {
        const next = progress + dt * 0.06 * speed;
        if (next >= 1) {
          setProgress(1);
          setPlaying(false);
        } else {
          setProgress(next);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
}

/** Renders the active vehicle's Model. Re-mounts on vehicle switch. */
function ActiveVehicleModel() {
  const vehicle = useActiveVehicle();
  const { Model } = vehicle;
  // key on vehicle.id so refs / animation state reset cleanly across switches
  return <Model key={vehicle.id} />;
}

export function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [7.5, 4.2, 8.5], fov: 38, near: 0.1, far: 200 }}
    >
      <Suspense fallback={null}>
        <ThemeEnvironment />
        <ActiveVehicleModel />
        <HoverLabel />
        <CameraRig />
        <PostFX />
      </Suspense>
      <TimelineDriver />
    </Canvas>
  );
}
