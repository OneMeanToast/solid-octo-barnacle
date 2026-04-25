'use client';

import { forwardRef } from 'react';
import * as THREE from 'three';
import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';

/** 125mm 2A46 smoothbore. The pitch is animated by the parent group. */
export const MainGun = forwardRef<THREE.Group>(function MainGun(_, ref) {
  const M = useTankMaterials();

  return (
    <group ref={ref}>
      <PartGroup id="main-gun">
        {/* Mantlet */}
        <mesh castShadow receiveShadow position={[1.7, 0, 0]} material={M.hull}>
          <boxGeometry args={[0.5, 0.55, 1.1]} />
        </mesh>

        {/* Recoil sleeve */}
        <mesh castShadow position={[2.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={M.gun}>
          <cylinderGeometry args={[0.16, 0.16, 0.5, 18]} />
        </mesh>

        {/* Barrel */}
        <mesh castShadow position={[3.55, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={M.barrel}>
          <cylinderGeometry args={[0.09, 0.095, 3.0, 24]} />
        </mesh>

        {/* Bore evacuator (mid barrel bulge) */}
        <mesh castShadow position={[3.7, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={M.gun}>
          <cylinderGeometry args={[0.16, 0.16, 0.55, 24]} />
        </mesh>

        {/* Muzzle reference / collimator at the very tip */}
        <mesh castShadow position={[5.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={M.metal}>
          <cylinderGeometry args={[0.12, 0.12, 0.18, 16]} />
        </mesh>

        {/* Hollow muzzle ring (visual cap) */}
        <mesh position={[5.16, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={M.metal}>
          <torusGeometry args={[0.085, 0.018, 12, 24]} />
        </mesh>
      </PartGroup>
    </group>
  );
});
