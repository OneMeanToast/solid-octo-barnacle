'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';
import { useExplorer } from '@/lib/store';

/** Reserve ammunition stowed in hull racks. Visible only in blueprint or when relevant. */
export function AmmoStorage() {
  const M = useTankMaterials();
  const grpRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    const { theme, selectedPart } = useExplorer.getState();
    const visible = theme === 'blueprint' || selectedPart === 'ammo' || selectedPart === 'autoloader';
    if (grpRef.current) grpRef.current.visible = visible;
  });

  // 18 reserve rounds in a 3x6 rack on the rear hull floor
  return (
    <group ref={grpRef}>
      <PartGroup id="ammo" position={[-1.2, 0.45, 0]}>
        {Array.from({ length: 18 }).map((_, i) => {
          const x = (i % 6) * 0.18 - 0.45;
          const z = Math.floor(i / 6) * 0.16 - 0.16;
          return (
            <group key={i} position={[x, 0, z]}>
              <mesh material={M.ammo} castShadow position={[0, 0.08, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.16, 12]} />
              </mesh>
              <mesh material={M.metal} castShadow position={[0, -0.06, 0]}>
                <cylinderGeometry args={[0.055, 0.055, 0.12, 12]} />
              </mesh>
            </group>
          );
        })}
      </PartGroup>
    </group>
  );
}
