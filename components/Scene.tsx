'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { Tank } from './Tank';
import { ThemeEnvironment } from './Environment/ThemeEnvironment';
import { PostFX } from './Environment/PostFX';
import { CameraRig } from './CameraRig';
import { HoverLabel } from './HoverLabel';
import { useExplorer } from '@/lib/store';
import { PHASES } from '@/lib/timeline';

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
        const next = progress + dt * 0.06 * speed; // base = 1/16s of the timeline per second at 1x
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
        <Tank />
        <HoverLabel />
        <CameraRig />
        <PostFX />
      </Suspense>
      <TimelineDriver />
      {/* Pre-warm phases (touch length so tree-shaker keeps it) */}
      <group visible={false}>
        <mesh>
          <boxGeometry args={[0, 0, PHASES.length]} />
        </mesh>
      </group>
    </Canvas>
  );
}
