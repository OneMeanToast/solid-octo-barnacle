'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useExplorer } from '@/lib/store';
import { inPhase, localPhaseProgress, phaseAt } from '@/vehicles/t72/timeline';

const COUNT = 120;

/** Dust kicked up behind both tracks during the Maneuver phase. */
export function TrackDust() {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) seeds[i] = Math.random();
    return { positions, seeds };
  }, []);

  const sprite = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,235,200,0.85)');
    g.addColorStop(0.5, 'rgba(200,180,140,0.4)');
    g.addColorStop(1, 'rgba(120,100,80,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame(() => {
    const { progress, theme } = useExplorer.getState();
    const active = inPhase(progress, 'maneuver');
    const local = active ? localPhaseProgress(progress, phaseAt(progress)) : 0;
    const intensity = active ? Math.sin(local * Math.PI) : 0;
    const T = progress * 100;

    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const seed = seeds[i];
      const side = i % 2 === 0 ? 1 : -1;
      const life = ((T + seed * 4) % 2) / 2;
      if (!active || life < 0) {
        arr[i * 3 + 1] = -100;
        continue;
      }
      const px = -2.5 - life * 1.5 + (seed - 0.5) * 0.5;
      const py = 0.05 + life * 0.5 + (seed - 0.5) * 0.05;
      const pz = side * (1.18 + (seed - 0.5) * 0.4) + life * 0.1 * side;
      arr[i * 3] = px;
      arr[i * 3 + 1] = py;
      arr[i * 3 + 2] = pz;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    if (matRef.current) {
      matRef.current.opacity = 0.6 * intensity * (theme === 'cinematic' ? 1.2 : 1);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        map={sprite}
        size={0.9}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={0}
        color="#d8c89a"
      />
    </points>
  );
}
