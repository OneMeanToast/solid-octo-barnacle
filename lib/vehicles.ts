'use client';

import type { Vehicle, VehicleId } from './types';
import { T72_VEHICLE } from '@/vehicles/t72';
import { SU57_VEHICLE } from '@/vehicles/su57';
import { useExplorer } from './store';

export const VEHICLES: Record<VehicleId, Vehicle> = {
  t72: T72_VEHICLE,
  su57: SU57_VEHICLE,
};

export const VEHICLE_LIST: Vehicle[] = [T72_VEHICLE, SU57_VEHICLE];

/** Subscribes to the active vehicle. Re-renders when the user switches. */
export function useActiveVehicle(): Vehicle {
  const id = useExplorer((s) => s.vehicleId);
  return VEHICLES[id];
}
