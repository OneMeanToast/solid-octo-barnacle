'use client';

import { forwardRef } from 'react';
import * as THREE from 'three';
import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';

/** Turret shell. Yaw (Y rotation) is animated by the parent group. */
export const Turret = forwardRef<THREE.Group, { children?: React.ReactNode }>(
  function Turret({ children }, ref) {
    const M = useTankMaterials();

    return (
      <group ref={ref}>
        <PartGroup id="turret">
          {/* Main turret body — flattened cylinder for the cast look */}
          <mesh castShadow receiveShadow position={[0.2, 0, 0]} material={M.hull}>
            <cylinderGeometry args={[1.35, 1.55, 0.55, 32]} />
          </mesh>

          {/* Front cheeks block */}
          <mesh castShadow receiveShadow position={[1.1, 0, 0]} material={M.hull}>
            <boxGeometry args={[0.8, 0.5, 2.0]} />
          </mesh>

          {/* Bevelled front (sloping down to the gun mantlet) */}
          <mesh
            castShadow
            receiveShadow
            position={[1.55, -0.05, 0]}
            rotation={[0, 0, -Math.PI / 14]}
            material={M.hull}
          >
            <boxGeometry args={[0.7, 0.45, 1.5]} />
          </mesh>

          {/* Bustle (rear stowage) */}
          <mesh castShadow receiveShadow position={[-1.0, 0.05, 0]} material={M.hull}>
            <boxGeometry args={[0.9, 0.4, 2.2]} />
          </mesh>

          {/* Top plate */}
          <mesh
            castShadow
            receiveShadow
            position={[0.1, 0.28, 0]}
            material={M.hull}
          >
            <cylinderGeometry args={[1.32, 1.35, 0.08, 32]} />
          </mesh>

          {/* Snorkel container on the left rear */}
          <mesh
            castShadow
            position={[-0.6, 0.18, -1.05]}
            rotation={[0, 0, Math.PI / 2]}
            material={M.metal}
          >
            <cylinderGeometry args={[0.11, 0.11, 1.6, 12]} />
          </mesh>
        </PartGroup>

        {children}
      </group>
    );
  },
);
