'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useExplorer } from '@/lib/store';
import { PALETTE } from '@/lib/theme';

/** Returns a fresh material set for the active theme.
 *  Blueprint mode swaps to wireframe + emissive so it reads as a schematic. */
export function useTankMaterials() {
  const theme = useExplorer((s) => s.theme);
  const palette = PALETTE[theme];

  return useMemo(() => {
    const isBlueprint = theme === 'blueprint';

    const make = (
      color: string,
      opts: Partial<THREE.MeshStandardMaterialParameters> = {},
    ) => {
      if (isBlueprint) {
        const m = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          emissive: new THREE.Color(palette.outline),
          emissiveIntensity: 0.4,
          metalness: 0.0,
          roughness: 1,
          transparent: true,
          opacity: 0.45,
          wireframe: false,
          ...opts,
        });
        return m;
      }
      const m = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color('#000'),
        emissiveIntensity: 0,
        metalness: 0.45,
        roughness: 0.7,
        ...opts,
      });
      return m;
    };

    return {
      hull: make(palette.hullColor, { roughness: 0.78, metalness: 0.55 }),
      metal: make(palette.metalColor, { roughness: 0.55, metalness: 0.85 }),
      track: make(palette.trackColor, { roughness: 0.92, metalness: 0.4 }),
      rubber: make(palette.rubberColor, { roughness: 0.95, metalness: 0.05 }),
      era: make(palette.eraColor, { roughness: 0.65, metalness: 0.45 }),
      glass: make(palette.glassColor, {
        roughness: 0.2,
        metalness: 0.1,
        emissive: new THREE.Color(theme === 'blueprint' ? palette.outline : '#000'),
        emissiveIntensity: theme === 'blueprint' ? 0.6 : 0.0,
      }),
      gun: make(palette.metalColor, { roughness: 0.45, metalness: 0.95 }),
      barrel: make(palette.metalColor, { roughness: 0.35, metalness: 0.95 }),
      autoloader: make('#5a4a32', { roughness: 0.6, metalness: 0.6 }),
      ammo: make('#9a7a3c', { roughness: 0.55, metalness: 0.6 }),
      fcs: make('#22364a', {
        roughness: 0.4,
        metalness: 0.7,
        emissive: new THREE.Color('#7be3ff'),
        emissiveIntensity: theme === 'blueprint' ? 0.8 : 0.15,
      }),
    };
  }, [theme, palette]);
}

/** Wireframe overlay used in blueprint mode. */
export function useWireOverlayMaterial() {
  const theme = useExplorer((s) => s.theme);
  const palette = PALETTE[theme];
  return useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(palette.outline),
        transparent: true,
        opacity: theme === 'blueprint' ? 0.9 : 0,
        depthTest: true,
      }),
    [palette.outline, theme],
  );
}
