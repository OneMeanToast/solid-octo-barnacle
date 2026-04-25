'use client';

import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';
import { useExplorer } from '@/lib/store';
import { inPhase, localPhaseProgress, phaseAt } from '@/vehicles/t72/timeline';

const ROAD_WHEEL_X = [-2.0, -1.2, -0.4, 0.4, 1.2, 2.0];
const RETURN_X = [-1.4, 0.0, 1.4];

/** Tracks, road wheels, return rollers, sprocket and idler. Animates during Maneuver phase. */
export function Tracks() {
  const M = useTankMaterials();
  const wheelsRef = useRef<THREE.Group[]>([]);
  const sprocketRef = useRef<THREE.Mesh>(null!);
  const idlerRef = useRef<THREE.Mesh>(null!);
  const trackOffset = useRef(0);
  const trackUniforms = useRef<{ uOffset: { value: number } }[]>([]);

  // Procedural seamless track texture
  const trackTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#1a1c18';
    ctx.fillRect(0, 0, 64, 256);
    ctx.fillStyle = '#2c2e26';
    for (let i = 0; i < 16; i++) {
      ctx.fillRect(4, i * 16 + 2, 56, 10);
    }
    ctx.fillStyle = '#0d0e0b';
    for (let i = 0; i < 16; i++) {
      ctx.fillRect(0, i * 16, 64, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 6);
    tex.anisotropy = 4;
    return tex;
  }, []);

  // Track band material (a separate one we can scroll the texture on)
  const trackBandMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: trackTexture,
      color: '#2a2c24',
      roughness: 0.95,
      metalness: 0.4,
    });
  }, [trackTexture]);

  useEffect(() => {
    return () => {
      trackTexture.dispose();
      trackBandMat.dispose();
    };
  }, [trackTexture, trackBandMat]);

  useFrame((_, dt) => {
    const { progress, playing, speed } = useExplorer.getState();
    let v = 0;
    if (inPhase(progress, 'maneuver')) {
      const local = localPhaseProgress(progress, phaseAt(progress));
      v = Math.sin(local * Math.PI) * 6.0;
    } else if (inPhase(progress, 'startup')) {
      v = 0.4 * Math.sin(progress * 12);
    }
    if (playing) {
      trackOffset.current += dt * v * (speed * 0.6);
    } else {
      // when scrubbing, base offset on progress directly so reverse works
      trackOffset.current = progress * 18;
    }
    // animate wheel rotation
    wheelsRef.current.forEach((g) => {
      if (g) g.rotation.z = -trackOffset.current;
    });
    if (sprocketRef.current) sprocketRef.current.rotation.z = -trackOffset.current * 0.9;
    if (idlerRef.current) idlerRef.current.rotation.z = -trackOffset.current * 0.95;
    // scroll texture
    trackTexture.offset.y = trackOffset.current * 0.05;
  });

  return (
    <PartGroup id="tracks">
      {[1, -1].map((side) => (
        <group key={side} position={[0, 0, side * 1.18]}>
          {/* Track band — top run */}
          <mesh
            position={[0, 0.55, 0]}
            castShadow
            receiveShadow
            material={trackBandMat}
            scale={[1, 1, 1]}
          >
            <boxGeometry args={[5.0, 0.08, 0.34]} />
          </mesh>
          {/* Track band — bottom run */}
          <mesh
            position={[0, -0.02, 0]}
            castShadow
            receiveShadow
            material={trackBandMat}
          >
            <boxGeometry args={[5.0, 0.08, 0.36]} />
          </mesh>
          {/* Front idler curve (cylinder cap) */}
          <mesh
            ref={side === 1 ? idlerRef : undefined}
            position={[2.5, 0.27, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            material={M.metal}
          >
            <cylinderGeometry args={[0.32, 0.32, 0.34, 18]} />
          </mesh>
          {/* Rear sprocket */}
          <mesh
            ref={side === 1 ? sprocketRef : undefined}
            position={[-2.5, 0.27, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            material={M.metal}
          >
            <cylinderGeometry args={[0.34, 0.34, 0.36, 14]} />
          </mesh>
          {/* Sprocket teeth */}
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[-2.5 + Math.cos(a) * 0.36, 0.27 + Math.sin(a) * 0.36, 0]}
                rotation={[0, 0, a]}
                castShadow
                material={M.metal}
              >
                <boxGeometry args={[0.05, 0.08, 0.36]} />
              </mesh>
            );
          })}
          {/* Road wheels */}
          {ROAD_WHEEL_X.map((x, i) => (
            <group
              key={i}
              ref={(el) => {
                if (el) wheelsRef.current[side === 1 ? i : i + ROAD_WHEEL_X.length] = el;
              }}
              position={[x, 0.05, 0]}
            >
              <mesh
                castShadow
                rotation={[Math.PI / 2, 0, 0]}
                material={M.rubber}
              >
                <cylinderGeometry args={[0.32, 0.32, 0.32, 22]} />
              </mesh>
              {/* Hub */}
              <mesh
                rotation={[Math.PI / 2, 0, 0]}
                material={M.metal}
              >
                <cylinderGeometry args={[0.13, 0.13, 0.34, 14]} />
              </mesh>
              {/* Rim ring */}
              <mesh rotation={[Math.PI / 2, 0, 0]} material={M.metal}>
                <torusGeometry args={[0.27, 0.018, 8, 24]} />
              </mesh>
            </group>
          ))}
          {/* Return rollers (top, smaller) */}
          {RETURN_X.map((x, i) => (
            <mesh
              key={i}
              position={[x, 0.5, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
              material={M.metal}
            >
              <cylinderGeometry args={[0.13, 0.13, 0.18, 14]} />
            </mesh>
          ))}
        </group>
      ))}
    </PartGroup>
  );
}
