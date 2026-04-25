'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useExplorer } from '@/lib/store';
import { inPhase, localPhaseProgress, phaseAt } from '@/lib/timeline';
import { PALETTE } from '@/lib/theme';

const COUNT = 90;

/** Exhaust smoke from the rear-left exhaust port. Spawns when engine is on. */
export function ExhaustSmoke({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);

  const { positions, sizes, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      seeds[i] = Math.random();
      sizes[i] = 0.4 + Math.random() * 0.5;
    }
    return { positions, sizes, seeds };
  }, []);

  const sprite = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.4)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame(() => {
    const { progress, theme } = useExplorer.getState();
    const palette = PALETTE[theme];
    const active =
      inPhase(progress, 'startup') ||
      inPhase(progress, 'maneuver') ||
      inPhase(progress, 'engage') ||
      inPhase(progress, 'aim');

    const intensity = active ? (inPhase(progress, 'startup') ? localPhaseProgress(progress, phaseAt(progress)) * 1.2 : 1) : 0;

    // Map progress to a continuous "time" so reversing works deterministically
    const T = progress * 80;

    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const seed = seeds[i];
      const life = ((T + seed * 6) % 4) / 4; // 0..1
      const visible = active && life < 1;
      if (!visible) {
        arr[i * 3] = 0;
        arr[i * 3 + 1] = -100; // hide
        arr[i * 3 + 2] = 0;
        continue;
      }
      const px = -life * 0.6 + (seed - 0.5) * 0.15;
      const py = life * 1.1 + (seed - 0.5) * 0.05;
      const pz = (seed - 0.5) * 0.25 + life * 0.1;
      arr[i * 3] = px;
      arr[i * 3 + 1] = py;
      arr[i * 3 + 2] = pz;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    if (matRef.current) {
      matRef.current.opacity = 0.55 * intensity;
      matRef.current.color.set(palette.exhaustGlow);
    }
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        map={sprite}
        size={0.8}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={0}
        color="#888"
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
