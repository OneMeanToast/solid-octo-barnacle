import type { Theme } from './store';

export type ThemePalette = {
  background: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  ambient: number;
  hemisphereTop: string;
  hemisphereBottom: string;
  keyLight: string;
  keyIntensity: number;
  fillLight: string;
  fillIntensity: number;
  rimLight: string;
  rimIntensity: number;

  hullColor: string;
  trackColor: string;
  metalColor: string;
  rubberColor: string;
  eraColor: string;
  glassColor: string;
  exhaustGlow: string;

  outline: string;
  hoverOutline: string;
  selectOutline: string;

  groundColor: string;
  showGroundGrid: boolean;
  showStars: boolean;
};

export const PALETTE: Record<Theme, ThemePalette> = {
  blueprint: {
    background: '#031018',
    fog: '#04141f',
    fogNear: 16,
    fogFar: 60,
    ambient: 0.8,
    hemisphereTop: '#1a3a55',
    hemisphereBottom: '#001018',
    keyLight: '#9fdcff',
    keyIntensity: 1.1,
    fillLight: '#3a7fb8',
    fillIntensity: 0.6,
    rimLight: '#bff0ff',
    rimIntensity: 0.8,

    hullColor: '#0e2a3a',
    trackColor: '#0a1f2a',
    metalColor: '#0c2536',
    rubberColor: '#06151c',
    eraColor: '#103342',
    glassColor: '#9fdcff',
    exhaustGlow: '#7be3ff',

    outline: '#7be3ff',
    hoverOutline: '#ffffff',
    selectOutline: '#ffd66b',

    groundColor: '#03131c',
    showGroundGrid: true,
    showStars: false,
  },
  realistic: {
    background: '#1d2418',
    fog: '#3a4530',
    fogNear: 22,
    fogFar: 80,
    ambient: 0.45,
    hemisphereTop: '#aabb88',
    hemisphereBottom: '#3a3528',
    keyLight: '#fff1cf',
    keyIntensity: 2.2,
    fillLight: '#9cb8d6',
    fillIntensity: 0.5,
    rimLight: '#ffd09a',
    rimIntensity: 0.6,

    hullColor: '#4a5238',
    trackColor: '#2a2d24',
    metalColor: '#3a3f30',
    rubberColor: '#1c1c1a',
    eraColor: '#3e4632',
    glassColor: '#3b4a55',
    exhaustGlow: '#665544',

    outline: '#000000',
    hoverOutline: '#ffe27a',
    selectOutline: '#ffb86b',

    groundColor: '#5a5236',
    showGroundGrid: false,
    showStars: false,
  },
  cinematic: {
    background: '#06070a',
    fog: '#0a0c12',
    fogNear: 18,
    fogFar: 70,
    ambient: 0.18,
    hemisphereTop: '#1a1828',
    hemisphereBottom: '#020205',
    keyLight: '#ffe5b8',
    keyIntensity: 3.2,
    fillLight: '#5a6f9a',
    fillIntensity: 0.35,
    rimLight: '#ff8a6b',
    rimIntensity: 1.6,

    hullColor: '#3a3a36',
    trackColor: '#1a1a18',
    metalColor: '#2a2a26',
    rubberColor: '#0a0a09',
    eraColor: '#332f28',
    glassColor: '#1a2230',
    exhaustGlow: '#ffb070',

    outline: '#000000',
    hoverOutline: '#ffd29a',
    selectOutline: '#ff9c5b',

    groundColor: '#0a0a0c',
    showGroundGrid: false,
    showStars: true,
  },
};
