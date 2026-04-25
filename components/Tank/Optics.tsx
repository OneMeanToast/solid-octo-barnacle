'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';
import { useExplorer } from '@/lib/store';
import { inPhase } from '@/vehicles/t72/timeline';

/** Gunner's day sight block (TPD-K1 / 1A40) on the turret roof. Lens has a soft cyan glow. */
export function Optics() {
  const M = useTankMaterials();
  const lensRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(() => {
    const { progress, theme } = useExplorer.getState();
    if (!lensRef.current) return;
    const active = inPhase(progress, 'aim') || inPhase(progress, 'engage');
    const target = theme === 'blueprint' ? 0.8 : active ? 0.7 : 0.18;
    lensRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      lensRef.current.emissiveIntensity ?? 0,
      target,
      0.08,
    );
  });

  return (
    <PartGroup id="optics" position={[0.55, 0.32, -0.55]}>
      {/* Housing */}
      <mesh castShadow material={M.metal}>
        <boxGeometry args={[0.4, 0.22, 0.32]} />
      </mesh>
      {/* Side aperture */}
      <mesh position={[0.21, 0.0, 0]} castShadow material={M.metal}>
        <boxGeometry args={[0.04, 0.16, 0.22]} />
      </mesh>
      {/* Front lens */}
      <mesh position={[0.23, 0.0, 0]}>
        <planeGeometry args={[0.14, 0.14]} />
        <meshStandardMaterial
          ref={lensRef}
          color="#0a1a2a"
          emissive={new THREE.Color('#7be3ff')}
          emissiveIntensity={0.18}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>
      {/* IR / laser projector slot */}
      <mesh position={[0, 0.13, 0.16]} castShadow material={M.metal}>
        <boxGeometry args={[0.18, 0.06, 0.06]} />
      </mesh>
    </PartGroup>
  );
}
