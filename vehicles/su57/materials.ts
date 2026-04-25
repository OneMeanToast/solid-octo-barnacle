'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useExplorer } from '@/lib/store';
import { PALETTE } from '@/lib/theme';

/** Material set for the procedural Su-57. Mirrors useTankMaterials but with jet-appropriate slots. */
export function useJetMaterials() {
  const theme = useExplorer((s) => s.theme);
  const palette = PALETTE[theme];

  return useMemo(() => {
    const isBlueprint = theme === 'blueprint';

    // Jet-specific palette
    const skin = isBlueprint
      ? '#10324a'
      : theme === 'cinematic'
      ? '#34373c'
      : '#5a6470';
    const dark = isBlueprint ? '#08222f' : theme === 'cinematic' ? '#1f2126' : '#2c3038';
    const metal = isBlueprint ? '#0c2536' : theme === 'cinematic' ? '#3a3a3e' : '#4a4d52';
    const nozzleColor =
      isBlueprint ? '#082030' : theme === 'cinematic' ? '#26221c' : '#3a342a';
    const radome =
      isBlueprint ? '#0a2a3a' : theme === 'cinematic' ? '#272626' : '#3a3530';
    const canopy =
      isBlueprint ? '#9fdcff' : theme === 'cinematic' ? '#241a0c' : '#5a4a1a';

    const make = (
      color: string,
      opts: Partial<THREE.MeshStandardMaterialParameters> = {},
    ) => {
      if (isBlueprint) {
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          emissive: new THREE.Color(palette.outline),
          emissiveIntensity: 0.4,
          metalness: 0.0,
          roughness: 1,
          transparent: true,
          opacity: 0.45,
          ...opts,
        });
      }
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color('#000'),
        emissiveIntensity: 0,
        metalness: 0.55,
        roughness: 0.55,
        ...opts,
      });
    };

    return {
      skin: make(skin, { roughness: 0.55, metalness: 0.65 }),
      dark: make(dark, { roughness: 0.5, metalness: 0.7 }),
      metal: make(metal, { roughness: 0.4, metalness: 0.9 }),
      nozzle: make(nozzleColor, { roughness: 0.65, metalness: 0.9 }),
      radome: make(radome, { roughness: 0.85, metalness: 0.1 }),
      canopy: make(canopy, {
        roughness: 0.15,
        metalness: 0.5,
        transparent: !isBlueprint,
        opacity: isBlueprint ? 0.55 : 0.6,
        emissive: new THREE.Color(isBlueprint ? palette.outline : '#221a08'),
        emissiveIntensity: isBlueprint ? 0.7 : 0.1,
      }),
      panel: make(skin, { roughness: 0.65, metalness: 0.55 }),
    };
  }, [theme, palette]);
}
