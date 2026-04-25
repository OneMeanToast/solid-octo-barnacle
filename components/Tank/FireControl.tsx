'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';
import { useExplorer } from '@/lib/store';
import { inPhase } from '@/vehicles/t72/timeline';

/** A small abstract "fire control" pylon on the turret roof — laser warning + crosswind sensor styling. */
export function FireControl() {
  const M = useTankMaterials();
  const beaconRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(() => {
    const { progress, theme } = useExplorer.getState();
    if (!beaconRef.current) return;
    const t = performance.now() * 0.005;
    const active = inPhase(progress, 'aim') || inPhase(progress, 'engage');
    const base = theme === 'blueprint' ? 0.7 : active ? 0.9 : 0.18;
    beaconRef.current.emissiveIntensity = base + Math.sin(t) * 0.12 * (active ? 1 : 0.2);
  });

  return (
    <PartGroup id="fcs" position={[-0.65, 0.34, -0.4]}>
      {/* Crosswind sensor mast */}
      <mesh position={[0, 0.18, 0]} castShadow material={M.metal}>
        <cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />
      </mesh>
      {/* Sensor cup */}
      <mesh position={[0, 0.4, 0]} castShadow material={M.metal}>
        <cylinderGeometry args={[0.06, 0.06, 0.06, 12]} />
      </mesh>
      {/* Beacon (cyan glow) */}
      <mesh position={[0, 0.46, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          ref={beaconRef}
          color="#0a1a2a"
          emissive={new THREE.Color('#7be3ff')}
          emissiveIntensity={0.4}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      {/* Computer box on turret roof (hint at internals) */}
      <mesh position={[0.05, 0.04, 0]} castShadow material={M.fcs}>
        <boxGeometry args={[0.22, 0.08, 0.18]} />
      </mesh>
    </PartGroup>
  );
}
