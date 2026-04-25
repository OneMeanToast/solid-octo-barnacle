'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';
import { useExplorer } from '@/lib/store';
import { inPhase, localPhaseProgress, phaseAt } from '@/lib/timeline';

/** Engine deck with louvers, exhaust grille and rear extension. */
export function EngineDeck() {
  const M = useTankMaterials();
  const grpRef = useRef<THREE.Group>(null!);
  const louvresRef = useRef<THREE.Group[]>([]);

  useFrame((_, dt) => {
    const { progress } = useExplorer.getState();
    let lift = 0;
    if (inPhase(progress, 'maintenance')) {
      lift = localPhaseProgress(progress, phaseAt(progress)) * 0.65;
    }
    if (grpRef.current) {
      grpRef.current.position.y = lift;
    }
    // mild louvre flutter when engine is on
    const t = performance.now() * 0.004;
    const heat = inPhase(progress, 'startup') || inPhase(progress, 'maneuver') || inPhase(progress, 'engage') ? 1 : 0;
    louvresRef.current.forEach((l, i) => {
      if (l) l.rotation.x = Math.sin(t + i) * 0.05 * heat;
    });
  });

  return (
    <PartGroup id="engine">
      <group ref={grpRef} position={[-1.7, 0.92, 0]}>
        {/* Engine deck plate */}
        <mesh castShadow receiveShadow material={M.metal}>
          <boxGeometry args={[2.4, 0.08, 2.5]} />
        </mesh>
        {/* Louvres */}
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <group
            key={i}
            ref={(el) => {
              if (el) louvresRef.current[i] = el;
            }}
            position={[x, 0.07, 0]}
          >
            <mesh material={M.metal} castShadow>
              <boxGeometry args={[0.18, 0.04, 1.7]} />
            </mesh>
          </group>
        ))}
        {/* Exhaust port (left rear) */}
        <mesh
          position={[-1.0, 0.05, 1.0]}
          material={M.metal}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.12, 0.12, 0.4, 14]} />
        </mesh>
        {/* Auxiliary fuel drums on rear plate */}
        <mesh
          position={[-1.4, -0.45, 0.6]}
          rotation={[0, 0, Math.PI / 2]}
          material={M.metal}
          castShadow
        >
          <cylinderGeometry args={[0.22, 0.22, 0.7, 18]} />
        </mesh>
        <mesh
          position={[-1.4, -0.45, -0.6]}
          rotation={[0, 0, Math.PI / 2]}
          material={M.metal}
          castShadow
        >
          <cylinderGeometry args={[0.22, 0.22, 0.7, 18]} />
        </mesh>
      </group>
    </PartGroup>
  );
}
