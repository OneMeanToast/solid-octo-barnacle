'use client';

import { useState } from 'react';
import type { Vehicle } from '@/lib/types';
import { Su57Procedural } from './Procedural';
import { Su57Gltf } from './GltfModel';
import { SU57_PARTS, SU57_CATEGORY_COLORS } from './parts';
import { SU57_PHASES } from './phases';
import { SU57_HOME_POSE, SU57_CAMERA_FOCUS } from './cameraFocus';

/** Composite model: tries GLTF first, falls back to procedural if file is absent. */
function Su57Model() {
  const [missing, setMissing] = useState(false);
  return (
    <>
      <Su57Gltf onMissing={() => setMissing(true)} />
      {missing && <Su57Procedural />}
    </>
  );
}

export const SU57_VEHICLE: Vehicle = {
  id: 'su57',
  name: 'Su-57',
  subtitle: 'Stealth Multi-role Fighter',
  era: 'Russian · 2010 →',
  attribution:
    'Su-57 model attribution required when present (CC-BY). Drop file at /public/models/su57/scene.glb',
  parts: SU57_PARTS,
  phases: SU57_PHASES,
  cameraFocus: SU57_CAMERA_FOCUS,
  homePose: SU57_HOME_POSE,
  Model: Su57Model,
  stats: [
    { label: 'PWR', value: '2 × AL-41F1' },
    { label: 'TWR', value: '~1.1 (clean)' },
    { label: 'MTOW', value: '35 t' },
  ],
  categoryColors: SU57_CATEGORY_COLORS,
};
