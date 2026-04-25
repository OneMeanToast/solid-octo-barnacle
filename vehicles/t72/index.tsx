'use client';

import type { Vehicle } from '@/lib/types';
import { Tank } from '@/components/Tank';
import { T72_PARTS, T72_CATEGORY_COLORS } from './parts';
import { T72_PHASES } from './phases';
import { T72_HOME_POSE, T72_CAMERA_FOCUS } from './cameraFocus';

export const T72_VEHICLE: Vehicle = {
  id: 't72',
  name: 'T-72',
  subtitle: 'Main Battle Tank',
  era: 'Soviet / Russian · 1973 →',
  parts: T72_PARTS,
  phases: T72_PHASES,
  cameraFocus: T72_CAMERA_FOCUS,
  homePose: T72_HOME_POSE,
  Model: Tank,
  stats: [
    { label: 'CAL', value: '125 mm' },
    { label: 'PWR', value: '840 hp' },
    { label: 'WGT', value: '44.5 t' },
  ],
  categoryColors: T72_CATEGORY_COLORS,
};
