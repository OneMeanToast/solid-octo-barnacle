'use client';

import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';

/** NSVT 12.7mm AA machine gun on the cupola. Sits in turret-local space. */
export function MachineGun() {
  const M = useTankMaterials();
  return (
    <PartGroup id="mg" position={[0.0, 0.6, 0.55]}>
      {/* Mount cradle */}
      <mesh castShadow material={M.metal}>
        <boxGeometry args={[0.18, 0.06, 0.22]} />
      </mesh>
      {/* MG body */}
      <mesh position={[0.18, 0.05, 0]} castShadow material={M.metal}>
        <boxGeometry args={[0.36, 0.1, 0.1]} />
      </mesh>
      {/* Barrel */}
      <mesh
        position={[0.55, 0.05, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        material={M.barrel}
      >
        <cylinderGeometry args={[0.025, 0.025, 0.55, 12]} />
      </mesh>
      {/* Charging handle */}
      <mesh position={[0.05, 0.12, 0.07]} castShadow material={M.metal}>
        <boxGeometry args={[0.04, 0.06, 0.04]} />
      </mesh>
      {/* Ammunition box */}
      <mesh position={[0.05, -0.05, 0.16]} castShadow material={M.metal}>
        <boxGeometry args={[0.18, 0.16, 0.14]} />
      </mesh>
    </PartGroup>
  );
}
