'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';
import { useExplorer } from '@/lib/store';
import { inPhase, localPhaseProgress, phaseAt } from '@/vehicles/t72/timeline';

/** Kontakt-5 reactive armor blocks. Instanced for performance. Slightly explodes during Maintenance. */
export function ERA() {
  const M = useTankMaterials();
  const ref = useRef<THREE.InstancedMesh>(null!);

  const blocks = useMemo(() => {
    const arr: { p: [number, number, number]; r: [number, number, number]; s: [number, number, number] }[] = [];
    // Glacis grid (heavy ERA)
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        arr.push({
          p: [2.05 + i * 0.12, 0.78 - j * 0.18, -0.85 + j * 0.0 + (i - 2) * 0.0],
          r: [0, 0, -Math.PI / 3.2],
          s: [0.18, 0.55, 0.32],
        });
      }
    }
    // Turret cheek arrays
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const z = -0.55 + j * 0.55;
        arr.push({
          p: [1.42 - i * 0.12, 0.05 + (i - 1) * 0.04, z],
          r: [0, 0, -Math.PI / 14],
          s: [0.16, 0.42, 0.42],
        });
      }
    }
    // Side skirt rows
    for (let s = -1; s <= 1; s += 2) {
      for (let i = 0; i < 6; i++) {
        arr.push({
          p: [-1.8 + i * 0.65, 0.55, s * 1.36],
          r: [0, 0, 0],
          s: [0.55, 0.36, 0.06],
        });
      }
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const baseMatrices = useMemo(
    () =>
      blocks.map((b) => {
        const m = new THREE.Matrix4();
        m.compose(
          new THREE.Vector3(...b.p),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(...b.r)),
          new THREE.Vector3(...b.s),
        );
        return m;
      }),
    [blocks],
  );

  useFrame(() => {
    const { progress } = useExplorer.getState();
    let explode = 0;
    if (inPhase(progress, 'maintenance')) {
      explode = localPhaseProgress(progress, phaseAt(progress)) * 0.45;
    }
    blocks.forEach((b, i) => {
      dummy.matrix.copy(baseMatrices[i]);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      // explode outward roughly along the local normal of the surface
      const dir = new THREE.Vector3(b.p[0], b.p[1] - 0.4, b.p[2]).normalize();
      dummy.position.addScaledVector(dir, explode * 0.6);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <PartGroup id="era">
      <instancedMesh
        ref={ref}
        args={[undefined, undefined, blocks.length]}
        material={M.era}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
    </PartGroup>
  );
}
