'use client';

import { create } from 'zustand';
import type { VehicleId } from './types';

export type Theme = 'blueprint' | 'realistic' | 'cinematic';
export type Speed = 1 | 2 | 3 | 5;

export type StoreState = {
  // active vehicle
  vehicleId: VehicleId;

  // selection / hover
  selectedPart: string | null;
  hoveredPart: string | null;
  hoverPos: [number, number, number] | null;

  // visual theme
  theme: Theme;

  // timeline
  progress: number;
  playing: boolean;
  speed: Speed;

  // camera / scene
  autoRotate: boolean;
  cameraResetToken: number;

  // audio
  soundEnabled: boolean;

  // overlays
  aboutOpen: boolean;
  hudVisible: boolean;
  isFullscreen: boolean;

  // setters
  setVehicle: (id: VehicleId) => void;

  setSelectedPart: (id: string | null) => void;
  setHoveredPart: (id: string | null, pos?: [number, number, number] | null) => void;
  setTheme: (t: Theme) => void;

  setProgress: (p: number) => void;
  togglePlay: () => void;
  setPlaying: (v: boolean) => void;
  setSpeed: (s: Speed) => void;

  toggleAutoRotate: () => void;
  resetCamera: () => void;

  toggleSound: () => void;
  setAboutOpen: (v: boolean) => void;
  toggleHud: () => void;
  setFullscreen: (v: boolean) => void;
};

export const useExplorer = create<StoreState>((set, get) => ({
  vehicleId: 't72',

  selectedPart: null,
  hoveredPart: null,
  hoverPos: null,

  theme: 'realistic',

  progress: 0,
  playing: false,
  speed: 1,

  autoRotate: false,
  cameraResetToken: 0,

  soundEnabled: false,

  aboutOpen: false,
  hudVisible: true,
  isFullscreen: false,

  setVehicle: (id) => {
    if (get().vehicleId === id) return;
    set({
      vehicleId: id,
      // Reset selection + timeline when switching vehicles so the new
      // vehicle's part IDs and phases start fresh.
      selectedPart: null,
      hoveredPart: null,
      hoverPos: null,
      progress: 0,
      playing: false,
      cameraResetToken: get().cameraResetToken + 1,
    });
  },

  setSelectedPart: (id) => set({ selectedPart: id }),
  setHoveredPart: (id, pos = null) => set({ hoveredPart: id, hoverPos: pos }),
  setTheme: (t) => set({ theme: t }),

  setProgress: (p) => set({ progress: Math.max(0, Math.min(1, p)) }),
  togglePlay: () => set({ playing: !get().playing }),
  setPlaying: (v) => set({ playing: v }),
  setSpeed: (s) => set({ speed: s }),

  toggleAutoRotate: () => set({ autoRotate: !get().autoRotate }),
  resetCamera: () => set({ cameraResetToken: get().cameraResetToken + 1 }),

  toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
  setAboutOpen: (v) => set({ aboutOpen: v }),
  toggleHud: () => set({ hudVisible: !get().hudVisible }),
  setFullscreen: (v) => set({ isFullscreen: v }),
}));
