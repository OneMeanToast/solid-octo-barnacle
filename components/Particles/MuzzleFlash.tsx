'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useExplorer } from '@/lib/store';
import { inPhase, localPhaseProgress, phaseAt } from '@/lib/timeline';

/** Muzzle flash + lingering smoke at the tip of the gun barrel. */
export function MuzzleFlash({ position }: { position: [number, number, number] }) {
  const flashRef = useRef<THREE.Mesh>(null!);
  const flashMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const smokeRef = useRef<THREE.Points>(null!);
  const smokeMatRef = useRef<THREE.PointsMaterial>(null!);
  const flashStart = useRef<number>(-Infinity);
  const SMOKE = 60;

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(SMOKE * 3);
    const seeds = new Float32Array(SMOKE);
    for (let i = 0; i < SMOKE; i++) seeds[i] = Math.random();
    return { positions, seeds };
  }, []);

  const sprite = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.4, 'rgba(220,220,220,0.45)');
    g.addColorStop(1, 'rgba(180,180,180,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  // Listen for the fire event from the Tank parent
  useEffect(() => {
    const handler = () => {
      flashStart.current = performance.now();
      // Optionally play a sound
      const { soundEnabled } = useExplorer.getState();
      if (soundEnabled) tryPlayFireSound();
    };
    window.addEventListener('t72:fire', handler);
    return () => window.removeEventListener('t72:fire', handler);
  }, []);

  useFrame(() => {
    const { progress } = useExplorer.getState();
    const inEngage = inPhase(progress, 'engage');
    const now = performance.now();
    const dt = (now - flashStart.current) / 1000;

    // Flash lasts 90ms
    const flashLife = THREE.MathUtils.clamp(1 - dt / 0.09, 0, 1);
    const flashScale = 0.8 + (1 - flashLife) * 0.6;
    if (flashRef.current) {
      flashRef.current.visible = inEngage && flashLife > 0;
      flashRef.current.scale.setScalar(flashScale * (0.6 + Math.random() * 0.6));
    }
    if (flashMatRef.current) flashMatRef.current.opacity = flashLife;
    if (lightRef.current) {
      lightRef.current.intensity = inEngage ? flashLife * 8 : 0;
    }

    // Lingering smoke (driven by the engage local phase, supports reverse scrubbing)
    if (!inEngage) {
      const arr = smokeRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < SMOKE; i++) arr[i * 3 + 1] = -100;
      smokeRef.current.geometry.attributes.position.needsUpdate = true;
      if (smokeMatRef.current) smokeMatRef.current.opacity = 0;
      return;
    }
    const local = localPhaseProgress(progress, phaseAt(progress));
    const T = local * 30;
    const arr = smokeRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < SMOKE; i++) {
      const seed = seeds[i];
      const life = ((T + seed * 5) % 1.4) / 1.4;
      const px = life * 1.3 + (seed - 0.5) * 0.2;
      const py = life * 0.4 + (seed - 0.5) * 0.1;
      const pz = (seed - 0.5) * 0.25;
      arr[i * 3] = px;
      arr[i * 3 + 1] = py;
      arr[i * 3 + 2] = pz;
    }
    smokeRef.current.geometry.attributes.position.needsUpdate = true;
    if (smokeMatRef.current) smokeMatRef.current.opacity = 0.55;
  });

  return (
    <group position={position}>
      {/* Flash sphere */}
      <mesh ref={flashRef} visible={false}>
        <sphereGeometry args={[0.45, 12, 12]} />
        <meshBasicMaterial
          ref={flashMatRef}
          color="#fff2c8"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Bright point light during the flash */}
      <pointLight
        ref={lightRef}
        color="#ffd9a5"
        intensity={0}
        distance={12}
        decay={2}
      />
      {/* Lingering smoke */}
      <points ref={smokeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={smokeMatRef}
          map={sprite}
          size={0.9}
          sizeAttenuation
          transparent
          depthWrite={false}
          opacity={0}
          color="#d6d2c4"
        />
      </points>
    </group>
  );
}

let audioCtx: AudioContext | null = null;
function tryPlayFireSound() {
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (!audioCtx) return;
    const ctx = audioCtx;
    const now = ctx.currentTime;
    // a quick "boom": low sine + filtered noise burst
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.3);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.55, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);

    // noise burst
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.3;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  } catch {
    // ignore audio errors
  }
}
