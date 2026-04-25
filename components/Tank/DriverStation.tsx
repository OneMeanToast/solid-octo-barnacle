'use client';

import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';

/** Driver's hatch and periscopes on the upper glacis. */
export function DriverStation() {
  const M = useTankMaterials();
  return (
    <PartGroup id="driver" position={[1.85, 0.92, 0]} rotation={[0, 0, -Math.PI / 3.2]}>
      {/* Hatch disc */}
      <mesh castShadow material={M.metal}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 24]} />
      </mesh>
      {/* Hatch hinge */}
      <mesh position={[-0.3, 0.03, 0]} castShadow material={M.metal}>
        <boxGeometry args={[0.08, 0.03, 0.16]} />
      </mesh>
      {/* Periscope row */}
      {[-0.16, 0, 0.16].map((z, i) => (
        <mesh key={i} position={[0.05, 0.04, z]} castShadow material={M.glass}>
          <boxGeometry args={[0.08, 0.05, 0.08]} />
        </mesh>
      ))}
    </PartGroup>
  );
}
