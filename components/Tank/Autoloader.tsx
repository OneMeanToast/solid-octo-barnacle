'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PartGroup } from './PartGroup';
import { useTankMaterials } from './materials';
import { useExplorer } from '@/lib/store';
import { inPhase, localPhaseProgress, phaseAt } from '@/vehicles/t72/timeline';
import { PALETTE } from '@/lib/theme';

/** Autoloader carousel. Visible in blueprint or maintenance phase, or when selected. Rotates during Engage. */
export function Autoloader() {
  const M = useTankMaterials();
  const carouselRef = useRef<THREE.Group>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    const { progress, selectedPart, theme } = useExplorer.getState();
    const palette = PALETTE[theme];
    const inMaint = inPhase(progress, 'maintenance');
    const inEngage = inPhase(progress, 'engage');
    const blueprint = theme === 'blueprint';
    const visible = blueprint || inMaint || selectedPart === 'autoloader' || selectedPart === 'ammo';

    if (groupRef.current) {
      groupRef.current.visible = visible;
      // small lift in maintenance for readability
      const lift = inMaint ? localPhaseProgress(progress, phaseAt(progress)) * -0.25 : 0;
      groupRef.current.position.y = 0.5 + lift;
      // tint stronger in blueprint
      groupRef.current.scale.setScalar(1);
    }

    if (carouselRef.current) {
      const t = inEngage ? localPhaseProgress(progress, phaseAt(progress)) * Math.PI * 2 : 0;
      carouselRef.current.rotation.y = t;
    }
    // suppress unused-var warning
    void palette;
  });

  return (
    <group ref={groupRef}>
      <PartGroup id="autoloader" position={[0, 0, 0]}>
        {/* Carousel base */}
        <mesh material={M.autoloader} castShadow>
          <cylinderGeometry args={[1.05, 1.05, 0.18, 32]} />
        </mesh>
        <group ref={carouselRef}>
          {/* Round positions (22 slots) */}
          {Array.from({ length: 22 }).map((_, i) => {
            const a = (i / 22) * Math.PI * 2;
            return (
              <group key={i} position={[Math.cos(a) * 0.85, 0.0, Math.sin(a) * 0.85]} rotation={[0, -a, 0]}>
                {/* Projectile (top half) */}
                <mesh material={M.ammo} castShadow position={[0, 0.06, 0]}>
                  <cylinderGeometry args={[0.06, 0.06, 0.18, 12]} />
                </mesh>
                {/* Charge (bottom half) */}
                <mesh material={M.metal} castShadow position={[0, -0.08, 0]}>
                  <cylinderGeometry args={[0.07, 0.07, 0.16, 12]} />
                </mesh>
              </group>
            );
          })}
        </group>
        {/* Hydraulic rammer arm */}
        <mesh position={[0, 0.08, 0]} castShadow material={M.metal}>
          <boxGeometry args={[0.4, 0.06, 0.06]} />
        </mesh>
      </PartGroup>
    </group>
  );
}
