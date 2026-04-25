'use client';

import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';

/** Commander's cupola on top-right of turret. */
export function Cupola() {
  const M = useTankMaterials();
  return (
    <PartGroup id="cupola" position={[0.0, 0.4, 0.55]}>
      {/* Cupola ring */}
      <mesh castShadow material={M.hull}>
        <cylinderGeometry args={[0.34, 0.36, 0.18, 24]} />
      </mesh>
      {/* Hatch */}
      <mesh position={[0, 0.13, 0]} castShadow material={M.metal}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 24]} />
      </mesh>
      {/* TKN-3 sight block */}
      <mesh position={[0.32, 0.06, 0]} castShadow material={M.metal}>
        <boxGeometry args={[0.18, 0.18, 0.32]} />
      </mesh>
      {/* Periscope blocks around the cupola */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = -Math.PI / 2 + (i / 4) * Math.PI;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.32, 0.04, Math.sin(a) * 0.32]}
            rotation={[0, -a, 0]}
            castShadow
            material={M.glass}
          >
            <boxGeometry args={[0.06, 0.06, 0.1]} />
          </mesh>
        );
      })}
    </PartGroup>
  );
}
