'use client';

import * as THREE from 'three';
import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';

/** Lower hull, glacis plate and side sponsons. */
export function Hull() {
  const M = useTankMaterials();

  return (
    <PartGroup id="hull">
      {/* Lower hull tub */}
      <mesh castShadow receiveShadow position={[0, 0.32, 0]} material={M.hull}>
        <boxGeometry args={[5.4, 0.55, 2.3]} />
      </mesh>

      {/* Upper hull */}
      <mesh castShadow receiveShadow position={[0, 0.72, 0]} material={M.hull}>
        <boxGeometry args={[5.0, 0.32, 2.6]} />
      </mesh>

      {/* Glacis plate (sloped front) — built from a wedge using a rotated box */}
      <mesh
        castShadow
        receiveShadow
        position={[2.55, 0.55, 0]}
        rotation={[0, 0, -Math.PI / 3.2]}
        material={M.hull}
      >
        <boxGeometry args={[1.1, 0.18, 2.6]} />
      </mesh>

      {/* Rear plate */}
      <mesh
        castShadow
        receiveShadow
        position={[-2.7, 0.55, 0]}
        rotation={[0, 0, Math.PI / 5]}
        material={M.hull}
      >
        <boxGeometry args={[0.9, 0.16, 2.6]} />
      </mesh>

      {/* Side skirts */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          castShadow
          receiveShadow
          position={[0, 0.46, s * 1.32]}
          material={M.metal}
        >
          <boxGeometry args={[4.8, 0.42, 0.06]} />
        </mesh>
      ))}

      {/* Fender storage boxes */}
      {[-1.6, -0.4, 0.8, 1.9].map((x, i) => (
        <mesh
          key={i}
          castShadow
          receiveShadow
          position={[x, 0.78, 1.36]}
          material={M.metal}
        >
          <boxGeometry args={[0.7, 0.22, 0.18]} />
        </mesh>
      ))}
      {[-1.9, -0.7, 0.5, 1.7].map((x, i) => (
        <mesh
          key={`r${i}`}
          castShadow
          receiveShadow
          position={[x, 0.78, -1.36]}
          material={M.metal}
        >
          <boxGeometry args={[0.7, 0.22, 0.18]} />
        </mesh>
      ))}

      {/* Tow hooks (front and rear) */}
      {[
        [2.85, 0.28, 0.7],
        [2.85, 0.28, -0.7],
        [-2.95, 0.4, 0.7],
        [-2.95, 0.4, -0.7],
      ].map((p, i) => (
        <mesh
          key={i}
          castShadow
          position={[p[0], p[1], p[2]]}
          material={M.metal}
        >
          <boxGeometry args={[0.18, 0.12, 0.2]} />
        </mesh>
      ))}
    </PartGroup>
  );
}
