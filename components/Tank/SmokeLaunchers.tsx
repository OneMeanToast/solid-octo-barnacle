'use client';

import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';

/** 902B "Tucha" 81mm smoke grenade dischargers. Two banks on the turret cheeks. */
export function SmokeLaunchers() {
  const M = useTankMaterials();

  const tube = (x: number, y: number, z: number, key: string) => (
    <mesh
      key={key}
      position={[x, y, z]}
      rotation={[Math.PI / 2 + 0.1, 0, -0.4]}
      castShadow
      material={M.metal}
    >
      <cylinderGeometry args={[0.04, 0.04, 0.16, 14]} />
    </mesh>
  );

  return (
    <PartGroup id="smoke-launchers">
      {/* Left bank (looking from above, port side = +Z here, but this is just style) */}
      <group position={[1.0, 0.18, 0.95]}>
        {Array.from({ length: 6 }).map((_, i) =>
          tube((i % 3) * 0.1, Math.floor(i / 3) * 0.12, 0, `l${i}`),
        )}
      </group>
      {/* Right bank */}
      <group position={[1.0, 0.18, -0.95]}>
        {Array.from({ length: 6 }).map((_, i) =>
          tube((i % 3) * 0.1, Math.floor(i / 3) * 0.12, 0, `r${i}`),
        )}
      </group>
    </PartGroup>
  );
}
